import { useRouter } from "expo-router";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
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

// ✅ Caminho do Firebase
import { firebaseConfig } from "../../../config/firebaseConfig";

// 🔹 Inicializa o Firebase apenas uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function ProntuariosCadastrados() {
  const router = useRouter();

  const [prontuarios, setProntuarios] = useState<any[]>([]);
  const [filtrados, setFiltrados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<
    "Todos" | "Em andamento" | "Encerrado"
  >("Todos");

  // 🔹 Escuta mudanças em tempo real no Firestore
  useEffect(() => {
    const q = collection(db, "prontuarios");
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const lista: any[] = [];
        querySnapshot.forEach((d) => {
          lista.push({ id: d.id, ...d.data() });
        });

        // 🔹 Ordena por nome (A–Z) e, dentro do mesmo nome, por data (mais recente primeiro)
        lista.sort((a, b) => {
          const nomeA = (a.paciente || "").toLowerCase();
          const nomeB = (b.paciente || "").toLowerCase();
          if (nomeA < nomeB) return -1;
          if (nomeA > nomeB) return 1;

          // se o nome for igual, compara pela data
          const dataA = a.data ? a.data.split("/").reverse().join("-") : "";
          const dataB = b.data ? b.data.split("/").reverse().join("-") : "";
          return dataB.localeCompare(dataA); // mais recente primeiro
        });

        setProntuarios(lista);
        setFiltrados(lista);
        setCarregando(false);
      },
      (err) => {
        console.error("Erro no onSnapshot:", err);
        setCarregando(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 🔹 Excluir prontuário (compatível web + nativo)
  const excluirProntuario = (id: string) => {
    const confirmarWeb = () => {
      const ok = window.confirm(
        "Tem certeza que deseja excluir este prontuário? Essa ação não pode ser desfeita."
      );
      if (!ok) return;
      executarExclusao(id);
    };

    const confirmarNativo = () => {
      Alert.alert(
        "Excluir prontuário",
        "Tem certeza que deseja excluir este prontuário? Essa ação não pode ser desfeita.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => executarExclusao(id),
          },
        ]
      );
    };

    if (Platform.OS === "web") confirmarWeb();
    else confirmarNativo();
  };

  // função que realmente exclui e trata erros
  const executarExclusao = async (id: string) => {
    try {
      await deleteDoc(doc(db, "prontuarios", id));
      // no onSnapshot a lista será atualizada automaticamente
      if (Platform.OS !== "web") {
        Alert.alert("✅ Prontuário excluído com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao excluir prontuário:", error);
      if (Platform.OS === "web") {
        alert("❌ Erro ao excluir prontuário.");
      } else {
        Alert.alert("❌ Erro ao excluir prontuário.");
      }
    }
  };

  // 🔹 Abre prontuário completo
  const abrirProntuario = (id: string) => {
    router.push(`/prontuarios/abrir/${id}`);
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

              {/* 🗓️ Data + legenda */}
              <Text style={styles.info}>
                🗓️{" "}
                {item.data ? (
                  <>
                    <Text style={{ fontWeight: "600", color: "#333" }}>
                      {item.data}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#777" }}>
                      {" "}
                      (última consulta atualizada)
                    </Text>
                  </>
                ) : (
                  "—"
                )}
              </Text>

              <Text style={styles.info}>💬 {item.tipoAtendimento || "—"}</Text>
              <Text style={styles.info}>📍 {item.status || "—"}</Text>

              <View style={{ flexDirection: "row", marginTop: 10, gap: 8 }}>
                <TouchableOpacity
                  style={styles.botaoAbrir}
                  onPress={() => abrirProntuario(item.id)}
                >
                  <Text style={styles.botaoTexto}>Abrir</Text>
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
  botaoAbrir: {
    backgroundColor: "#4F46E5",
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
});
