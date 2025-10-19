import { getApp, getApps, initializeApp } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { firebaseConfig } from "../../../config/firebaseConfig";

// 🔹 Inicializa o Firebase apenas uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function ProntuariosCadastrados() {
  const [prontuarios, setProntuarios] = useState<any[]>([]);
  const [filtrados, setFiltrados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<
    "Todos" | "Em andamento" | "Encerrado"
  >("Todos");

  // 🔹 Estados para o modal de edição
  const [modalVisivel, setModalVisivel] = useState(false);
  const [prontuarioEditando, setProntuarioEditando] = useState<any>(null);

  const [paciente, setPaciente] = useState("");
  const [data, setData] = useState("");
  const [tipoAtendimento, setTipoAtendimento] = useState("");
  const [status, setStatus] = useState("");
  const [evolucao, setEvolucao] = useState("");

  // 🔹 Função para buscar prontuários no Firestore
  const carregarProntuarios = async () => {
    setCarregando(true);
    try {
      const querySnapshot = await getDocs(collection(db, "prontuarios"));
      const lista: any[] = [];
      querySnapshot.forEach((d) => {
        lista.push({ id: d.id, ...d.data() });
      });
      setProntuarios(lista);
      setFiltrados(lista);
    } catch (error) {
      console.error("Erro ao carregar prontuários:", error);
    } finally {
      setCarregando(false);
    }
  };

  // 🔹 Excluir prontuário
  const excluirProntuario = async (id: string) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este prontuário? Essa ação não pode ser desfeita."
    );

    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "prontuarios", id));
      alert("✅ Prontuário excluído com sucesso!");
      carregarProntuarios();
    } catch (error) {
      console.error("Erro ao excluir prontuário:", error);
      alert("❌ Erro ao excluir prontuário.");
    }
  };

  // 🔹 Abrir modal de edição
  const abrirEdicao = (item: any) => {
    setProntuarioEditando(item);
    setPaciente(item.paciente || "");
    setData(item.data || "");
    setTipoAtendimento(item.tipoAtendimento || "");
    setStatus(item.status || "");
    setEvolucao(item.evolucao || "");
    setModalVisivel(true);
  };

  // 🔹 Salvar alterações no Firebase
  const salvarEdicao = async () => {
    if (!prontuarioEditando) return;

    try {
      const ref = doc(db, "prontuarios", prontuarioEditando.id);
      await updateDoc(ref, {
        paciente,
        data,
        tipoAtendimento,
        status,
        evolucao,
      });

      alert("✅ Prontuário atualizado com sucesso!");
      setModalVisivel(false);
      carregarProntuarios();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("❌ Erro ao salvar alterações.");
    }
  };

  // 🔹 Atualiza lista conforme busca ou filtro
  useEffect(() => {
    let lista = [...prontuarios];

    if (busca.trim() !== "") {
      lista = lista.filter((p) =>
        p.paciente?.toLowerCase().includes(busca.toLowerCase())
      );
    }

    if (statusFiltro !== "Todos") {
      lista = lista.filter((p) => p.status === statusFiltro);
    }

    setFiltrados(lista);
  }, [busca, statusFiltro, prontuarios]);

  useEffect(() => {
    carregarProntuarios();
  }, []);

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
      <Text style={styles.title}>📁 Prontuários Cadastrados</Text>

      {/* 🔍 Campo de busca */}
      <TextInput
        style={styles.input}
        placeholder="Buscar por nome do paciente..."
        value={busca}
        onChangeText={setBusca}
      />

      {/* 📅 Filtro de status */}
      <View style={styles.filtroContainer}>
        {["Todos", "Em andamento", "Encerrado"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filtroBotao,
              statusFiltro === item && styles.filtroBotaoAtivo,
            ]}
            onPress={() => setStatusFiltro(item as any)}
          >
            <Text
              style={[
                styles.filtroTexto,
                statusFiltro === item && styles.filtroTextoAtivo,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtrados.length === 0 ? (
        <Text style={styles.text}>Nenhum prontuário encontrado.</Text>
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nome}>{item.paciente || "— Sem nome —"}</Text>
              <Text style={styles.info}>🗓️ {item.data || "—"}</Text>
              <Text style={styles.info}>💬 {item.tipoAtendimento || "—"}</Text>
              <Text style={styles.info}>📍 {item.status || "—"}</Text>

              <View style={{ flexDirection: "row", marginTop: 10, gap: 8 }}>
                <TouchableOpacity
                  style={styles.botaoDetalhes}
                  onPress={() =>
                    alert(
                      `Paciente: ${item.paciente}\nData: ${item.data}\nAtendimento: ${item.tipoAtendimento}\nStatus: ${item.status}\nEvolução: ${item.evolucao}`
                    )
                  }
                >
                  <Text style={styles.botaoTexto}>Ver Detalhes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoEditar}
                  onPress={() => abrirEdicao(item)}
                >
                  <Text style={styles.botaoTexto}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoExcluir}
                  onPress={() => excluirProntuario(item.id)}
                >
                  <Text style={styles.botaoExcluirTexto}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* 🟣 Modal de edição */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitulo}>✏️ Editar Prontuário</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Nome do paciente"
                value={paciente}
                onChangeText={setPaciente}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Data"
                value={data}
                onChangeText={setData}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Tipo de atendimento"
                value={tipoAtendimento}
                onChangeText={setTipoAtendimento}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Status"
                value={status}
                onChangeText={setStatus}
              />
              <TextInput
                style={[styles.modalInput, { height: 80 }]}
                placeholder="Evolução"
                value={evolucao}
                onChangeText={setEvolucao}
                multiline
              />

              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={[styles.modalBotao, { backgroundColor: "#4F46E5" }]}
                  onPress={salvarEdicao}
                >
                  <Text style={styles.modalBotaoTexto}>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBotao, { backgroundColor: "#9CA3AF" }]}
                  onPress={() => setModalVisivel(false)}
                >
                  <Text style={styles.modalBotaoTexto}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    fontSize: 16,
  },
  filtroContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  filtroBotao: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filtroBotaoAtivo: {
    backgroundColor: "#4F46E5",
  },
  filtroTexto: {
    color: "#333",
    fontWeight: "500",
  },
  filtroTextoAtivo: {
    color: "#fff",
  },
  text: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  nome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  info: {
    fontSize: 15,
    color: "#555",
    marginBottom: 2,
  },
  botaoDetalhes: {
    backgroundColor: "#4F46E5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoEditar: {
    backgroundColor: "#F59E0B",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "600",
  },
  botaoExcluir: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoExcluirTexto: {
    color: "#fff",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalBotoes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  modalBotao: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalBotaoTexto: {
    color: "#fff",
    fontWeight: "600",
  },
});
