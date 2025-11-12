import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { db } from "../../../config/firebaseConfig";

interface Prontuario {
  id: string;
  paciente: string;
  data?: string;
  tipoAtendimento?: string;
  status?: string;
}

export default function ProntuariosCadastrados() {
  const router = useRouter();
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [pacientesUnicos, setPacientesUnicos] = useState<Prontuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalVisivel, setModalVisivel] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<string | null>(null);

  useEffect(() => {
    const logged = localStorage.getItem("userLogged");
    const timer = setTimeout(() => {
      if (logged !== "true") router.replace("/login");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "prontuarios"),
      (querySnapshot) => {
        const lista: Prontuario[] = [];
        querySnapshot.forEach((d) =>
          lista.push({ id: d.id, ...(d.data() as Omit<Prontuario, "id">) })
        );

        const pacientesMap = new Map<string, Prontuario>();
        lista.forEach((p) => {
          const nome = p.paciente?.trim();
          if (!nome) return;
          if (!pacientesMap.has(nome)) pacientesMap.set(nome, p);
          else {
            const atual = pacientesMap.get(nome)!;
            const dataA = p.data?.split("/").reverse().join("-") || "";
            const dataB = atual.data?.split("/").reverse().join("-") || "";
            if (dataA > dataB) pacientesMap.set(nome, p);
          }
        });

        const pacientesUnicosOrdenados = Array.from(pacientesMap.values()).sort(
          (a, b) => a.paciente.localeCompare(b.paciente)
        );

        setProntuarios(lista);
        setPacientesUnicos(pacientesUnicosOrdenados);
        setCarregando(false);
      },
      (err) => {
        console.error("Erro no onSnapshot:", err);
        setCarregando(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const excluirProntuariosDoPaciente = (nome: string) => {
    setPacienteSelecionado(nome);
    setModalVisivel(true);
  };

  const confirmarExclusao = async () => {
    if (!pacienteSelecionado) return;
    try {
      const registros = prontuarios.filter((p) => p.paciente === pacienteSelecionado);
      for (const reg of registros) {
        await deleteDoc(doc(db, "prontuarios", reg.id));
      }
      setModalVisivel(false);
      Alert.alert("✅ Todos os prontuários de " + pacienteSelecionado + " foram excluídos!");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Alert.alert("❌ Erro ao excluir prontuários do paciente.");
    }
  };

  const abrirHistorico = (nome: string) => {
    if (!nome) return;
    router.push({
      pathname: "/prontuarios/historico/[nome]",
      params: { nome: encodeURIComponent(nome) },
    });
  };

  const listaFiltrada = pacientesUnicos.filter((p) =>
    p.paciente.toLowerCase().includes(busca.toLowerCase())
  );

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 10 }}>Carregando prontuários...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Pacientes Cadastrados</Text>

      <Text style={styles.countText}>
        Total de pacientes: {pacientesUnicos.length}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar paciente..."
        value={busca}
        onChangeText={setBusca}
      />

      {listaFiltrada.length === 0 ? (
        <Text style={styles.text}>Nenhum paciente encontrado.</Text>
      ) : (
        <FlatList
          data={listaFiltrada}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nome}>{item.paciente}</Text>
              <Text style={styles.info}>
                🗓️ Último atendimento: {item.data || "—"}
              </Text>
              <Text style={styles.info}>
                💬 {item.tipoAtendimento || "—"}
              </Text>
              <Text style={styles.info}>📍 {item.status || "—"}</Text>

              <View style={styles.botoesContainer}>
                <TouchableOpacity
                  style={styles.botaoAbrir}
                  onPress={() => abrirHistorico(item.paciente)}
                >
                  <Text style={styles.botaoTexto}>Abrir histórico</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoExcluir}
                  onPress={() => excluirProntuariosDoPaciente(item.paciente)}
                >
                  <Text style={styles.botaoExcluirTexto}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de confirmação */}
      <Modal
        transparent
        visible={modalVisivel}
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Confirmar Exclusão</Text>
            <Text style={styles.modalTexto}>
              Tem certeza que deseja excluir todos os prontuários de{" "}
              <Text style={{ fontWeight: "bold" }}>{pacienteSelecionado}</Text>?
            </Text>

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={[styles.modalBotao, styles.modalCancelar]}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.modalTextoBotao}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBotao, styles.modalExcluir]}
                onPress={confirmarExclusao}
              >
                <Text style={[styles.modalTextoBotao, { color: "#fff" }]}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const largura = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: largura < 600 ? 20 : 100,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  countText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    marginBottom: 20,
    alignSelf: "center",
    width: "80%",
    maxWidth: 600,
  },
  text: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    alignSelf: "center",
    width: "90%",
    maxWidth: 600,
  },
  nome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  info: {
    fontSize: 15,
    color: "#555",
    marginBottom: 3,
  },
  botoesContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 12,
    gap: 10,
  },
  botaoAbrir: {
    backgroundColor: "#4F46E5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    maxWidth: 140,
    width: "45%",
  },
  botaoExcluir: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    maxWidth: 140,
    width: "45%",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  botaoExcluirTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  // Estilos do modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 14,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalTexto: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#444",
  },
  modalBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBotao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalCancelar: {
    backgroundColor: "#e5e7eb",
  },
  modalExcluir: {
    backgroundColor: "#ef4444",
  },
  modalTextoBotao: {
    fontSize: 16,
    fontWeight: "600",
  },
});
