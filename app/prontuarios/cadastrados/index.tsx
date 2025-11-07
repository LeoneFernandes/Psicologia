// app/prontuarios/cadastrados/index.js
import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../../config/firebaseConfig"; // ✅ importando direto o db, nada de initializeApp

export default function ProntuariosCadastrados() {
  const router = useRouter();

  // 🔒 Proteção de rota — impede acesso sem login
  useEffect(() => {
    const logged = localStorage.getItem("userLogged");
    const timer = setTimeout(() => {
      if (logged !== "true") {
        router.replace("/login");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const [prontuarios, setProntuarios] = useState([]);
  const [pacientesUnicos, setPacientesUnicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "prontuarios"),
      (querySnapshot) => {
        const lista = [];
        querySnapshot.forEach((d) => lista.push({ id: d.id, ...d.data() }));

        // 🔹 Agrupa por nome do paciente
        const pacientesMap = new Map();
        lista.forEach((p) => {
          const nome = p.paciente?.trim();
          if (!nome) return;

          if (!pacientesMap.has(nome)) {
            pacientesMap.set(nome, p);
          } else {
            const atual = pacientesMap.get(nome);
            const dataA = p.data?.split("/").reverse().join("-") || "";
            const dataB = atual.data?.split("/").reverse().join("-") || "";
            if (dataA > dataB) pacientesMap.set(nome, p);
          }
        });

        const pacientesUnicos = Array.from(pacientesMap.values()).sort((a, b) =>
          a.paciente.localeCompare(b.paciente)
        );

        setProntuarios(lista);
        setPacientesUnicos(pacientesUnicos);
        setCarregando(false);
      },
      (err) => {
        console.error("Erro no onSnapshot:", err);
        setCarregando(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const excluirProntuariosDoPaciente = (nome) => {
    const confirmar = () => {
      const texto = `Tem certeza que deseja excluir todos os prontuários de ${nome}?`;
      if (Platform.OS === "web") {
        const ok = window.confirm(texto);
        if (!ok) return;
        executarExclusao(nome);
      } else {
        Alert.alert("Excluir paciente", texto, [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: () => executarExclusao(nome) },
        ]);
      }
    };
    confirmar();
  };

  const executarExclusao = async (nome) => {
    try {
      const registros = prontuarios.filter((p) => p.paciente === nome);
      for (const reg of registros) {
        await deleteDoc(doc(db, "prontuarios", reg.id));
      }
      Alert.alert("✅ Todos os prontuários de " + nome + " foram excluídos!");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      Alert.alert("❌ Erro ao excluir prontuários do paciente.");
    }
  };

  const abrirHistorico = (nome) => {
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
          keyExtractor={(item) => item.paciente}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nome}>{item.paciente}</Text>
              <Text style={styles.info}>🗓️ Último atendimento: {item.data || "—"}</Text>
              <Text style={styles.info}>💬 {item.tipoAtendimento || "—"}</Text>
              <Text style={styles.info}>📍 {item.status || "—"}</Text>

              <View style={{ flexDirection: "row", marginTop: 10, gap: 8 }}>
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
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  countText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 15,
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
  text: { fontSize: 18, color: "#555", textAlign: "center" },
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
  nome: { fontSize: 18, fontWeight: "700", color: "#111", marginBottom: 4 },
  info: { fontSize: 15, color: "#555", marginBottom: 2 },
  botaoAbrir: {
    backgroundColor: "#4F46E5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: { color: "#fff", fontWeight: "600" },
  botaoExcluir: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoExcluirTexto: { color: "#fff", fontWeight: "600" },
});
