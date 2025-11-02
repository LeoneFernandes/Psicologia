import { useLocalSearchParams, useRouter } from "expo-router";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { firebaseConfig } from "../../../config/firebaseConfig";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function HistoricoPaciente() {
  const { nome } = useLocalSearchParams();
  const router = useRouter();

  const [consultas, setConsultas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);

  // Campos editáveis
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [idade, setIdade] = useState("");
  const [endereco, setEndereco] = useState("");

  // 🔒 Proteção de rota (PWA com localStorage)
  useEffect(() => {
    const logged = localStorage.getItem("userLogged");
    const timer = setTimeout(() => {
      if (logged !== "true") {
        router.replace("/login");
      }
    }, 100); // pequeno atraso evita erro de navegação prematura
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!nome) return;

    const q = query(collection(db, "prontuarios"), where("paciente", "==", nome));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: any[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));

        // Ordenar por data mais recente
        data.sort((a, b) => {
          const tA = a.criadoEm?.seconds || 0;
          const tB = b.criadoEm?.seconds || 0;
          return tB - tA;
        });

        setConsultas(data);

        if (data.length > 0) {
          const p = data[0];
          setCpf(p.cpf || "");
          setEmail(p.email || "");
          setCelular(p.celular || "");
          setDataNascimento(p.dataNascimento || "");
          setIdade(p.idade || "");
          setEndereco(p.endereco || "");
        }

        setCarregando(false);
      },
      (error) => {
        console.error("Erro ao carregar histórico:", error);
        setCarregando(false);
      }
    );

    return () => unsubscribe();
  }, [nome]);

  const salvarEdicao = async () => {
    try {
      if (!consultas.length) return;

      const docRef = doc(db, "prontuarios", consultas[0].id);
      await updateDoc(docRef, {
        cpf,
        email,
        celular,
        dataNascimento,
        idade,
        endereco,
      });

      Alert.alert("✅ Sucesso", "Informações atualizadas com sucesso!");
      setEditando(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("❌ Erro", "Não foi possível salvar as alterações.");
    }
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 10 }}>Carregando histórico...</Text>
      </View>
    );
  }

  const totalAtendimentos = consultas.length;
  const ultimoAtendimento = consultas[0]?.data || "—";
  const tipoMaisRecente = consultas[0]?.tipoAtendimento || "—";
  const statusMaisRecente = consultas[0]?.status || "—";
  const valorMaisRecente = consultas[0]?.valor || "—";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>📋 Histórico de {nome}</Text>

      {/* 🔹 Cards lado a lado */}
      <View style={styles.row}>
        {/* Card 1 - Dados do Paciente */}
        <View style={styles.dashboardCard}>
          <View style={styles.headerCard}>
            <Text style={styles.sectionTitle}>Dados do Paciente</Text>

            {editando ? (
              <TouchableOpacity style={styles.saveButton} onPress={salvarEdicao}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={() => setEditando(true)}>
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoGroupInline}>
            <Text style={styles.label}>🧍 Nome:</Text>
            <Text style={styles.value}>{nome}</Text>
          </View>

          <View style={styles.infoGroupInline}>
            <Text style={styles.label}>🪪 CPF:</Text>
            {editando ? (
              <TextInput
                style={styles.input}
                value={cpf}
                onChangeText={setCpf}
                placeholder="000.000.000-00"
              />
            ) : (
              <Text style={styles.value}>{cpf}</Text>
            )}
          </View>

          <View style={styles.infoGroupInline}>
            <Text style={styles.label}>🎂 Data de Nascimento:</Text>
            {editando ? (
              <TextInput
                style={styles.input}
                value={dataNascimento}
                onChangeText={setDataNascimento}
                placeholder="Ex: 01/01/1990"
              />
            ) : (
              <Text style={styles.value}>{dataNascimento}</Text>
            )}
          </View>

          <View style={styles.infoGroupInline}>
            <Text style={styles.label}>📅 Idade:</Text>
            {editando ? (
              <TextInput
                style={styles.input}
                value={idade}
                onChangeText={setIdade}
                keyboardType="numeric"
                placeholder="Ex: 30"
              />
            ) : (
              <Text style={styles.value}>{idade}</Text>
            )}
          </View>

          <View style={styles.infoGroupInline}>
            <Text style={styles.label}>🏠 Endereço:</Text>
            {editando ? (
              <TextInput
                style={styles.input}
                value={endereco}
                onChangeText={setEndereco}
                placeholder="Digite o endereço"
              />
            ) : (
              <Text style={styles.value}>{endereco}</Text>
            )}
          </View>

          <View style={styles.infoGroupInline}>
            <Text style={styles.label}>✉️ Email:</Text>
            {editando ? (
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite o email"
              />
            ) : (
              <Text style={styles.value}>{email}</Text>
            )}
          </View>

          <View style={styles.infoGroupInline}>
            <Text style={styles.label}>📞 Telefone:</Text>
            {editando ? (
              <TextInput
                style={styles.input}
                value={celular}
                onChangeText={setCelular}
                placeholder="Digite o telefone"
              />
            ) : (
              <Text style={styles.value}>{celular}</Text>
            )}
          </View>
        </View>

        {/* Card 2 - Informações das Consultas */}
        <View style={styles.dashboardCard}>
          <Text style={styles.sectionTitle}>Informações sobre as Consultas</Text>

          <View style={{ height: 6 }} />

          <View style={styles.infoGroupInline}>
            <Text style={styles.label}>📅 Último atendimento:</Text>
            <Text style={styles.value}>{ultimoAtendimento}</Text>
          </View>

          <View style={styles.infoGroupInline}>
            <Text style={styles.label}>💬 Tipo:</Text>
            <Text style={styles.value}>{tipoMaisRecente}</Text>
          </View>

          <View style={styles.infoGroupInline}>
            <Text style={styles.label}>📍 Status atual:</Text>
            <Text style={styles.value}>{statusMaisRecente}</Text>
          </View>

          <View style={styles.infoGroupInline}>
            <Text style={styles.label}>💵 Valor mais recente:</Text>
            <Text style={styles.value}>{valorMaisRecente}</Text>
          </View>

          <View style={styles.infoGroupInline}>
            <Text style={styles.label}>📚 Total de Atendimentos:</Text>
            <Text style={styles.value}>{totalAtendimentos}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.novaConsultaButton}
        onPress={() =>
          router.push(`/prontuarios/abrir/${consultas[0]?.id || ""}?novo=true&nome=${nome}`)
        }
      >
        <Text style={styles.novaConsultaText}>🩺 Nova Consulta</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Prontuários Registrados</Text>

      {consultas.length === 0 ? (
        <Text style={styles.vazio}>Nenhum prontuário encontrado para este paciente.</Text>
      ) : (
        consultas.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => router.push(`/prontuarios/abrir/${item.id}`)}
          >
            <Text style={styles.data}>📅 {item.data || "—"}</Text>
            <Text style={styles.texto}>💬 Tipo: {item.tipoAtendimento || "—"}</Text>
            <Text style={styles.texto}>💵 Valor: {item.valor || "—"}</Text>
            <Text style={styles.texto}>📍 Status: {item.status || "—"}</Text>
            {item.evolucao ? <Text style={styles.evolucao}>📝 {item.evolucao}</Text> : null}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f3f4f6" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 10 },
  dashboardCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flex: 1,
    minWidth: "48%",
  },
  headerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#333" },
  editButton: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editText: { fontSize: 13, color: "#111", fontWeight: "600" },
  saveButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  saveText: { fontSize: 13, color: "#fff", fontWeight: "600" },
  infoGroupInline: { flexDirection: "row", alignItems: "center", marginBottom: 6, flexWrap: "wrap" },
  label: { fontSize: 15, color: "#555", fontWeight: "500", marginRight: 6 },
  value: { fontSize: 15, color: "#111", fontWeight: "600", flexShrink: 1 },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 2,
    fontSize: 15,
    flex: 1,
    color: "#111",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  data: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 6 },
  texto: { fontSize: 15, color: "#555", marginBottom: 3 },
  evolucao: { marginTop: 8, fontSize: 14, color: "#444", fontStyle: "italic" },
  vazio: { textAlign: "center", color: "#666", fontSize: 16, marginTop: 20 },
  novaConsultaButton: {
    backgroundColor: "#10B981",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 20,
  },
  novaConsultaText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
