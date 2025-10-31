import { useLocalSearchParams, useRouter } from "expo-router";
import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
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

  useEffect(() => {
    if (!nome) return;

    const q = query(collection(db, "prontuarios"), where("paciente", "==", nome));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: any[] = [];
        snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));

        data.sort((a, b) => {
          const tA = a.criadoEm?.seconds || 0;
          const tB = b.criadoEm?.seconds || 0;
          return tB - tA;
        });

        setConsultas(data);
        setCarregando(false);
      },
      (error) => {
        console.error("Erro ao carregar histórico:", error);
        setCarregando(false);
      }
    );

    return () => unsubscribe();
  }, [nome]);

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
  const email = consultas[0]?.email || "—";
  const celular = consultas[0]?.celular || "—";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>📋 Histórico de {nome}</Text>

      {/* 🔹 Card de informações básicas do paciente */}
      <View style={styles.dashboardCard}>
        <Text style={styles.sectionTitle}>Informações do Paciente</Text>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>🧍 Nome:</Text>
          <Text style={styles.value}>{nome}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>✉️ Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>📞 Telefone:</Text>
          <Text style={styles.value}>{celular}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>📅 Último atendimento:</Text>
          <Text style={styles.value}>{ultimoAtendimento}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>💬 Tipo de Atendimento:</Text>
          <Text style={styles.value}>{tipoMaisRecente}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>📍 Status atual:</Text>
          <Text style={styles.value}>{statusMaisRecente}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>💵 Valor da última consulta:</Text>
          <Text style={styles.value}>{valorMaisRecente}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>📚 Total de atendimentos:</Text>
          <Text style={styles.value}>{totalAtendimentos}</Text>
        </View>
      </View>

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
            {item.evolucao ? (
              <Text style={styles.evolucao}>📝 {item.evolucao}</Text>
            ) : null}
          </TouchableOpacity>
        ))
      )}

      {/* 🔹 Botão Nova Consulta */}
      <TouchableOpacity
        style={styles.novaConsultaButton}
        onPress={() => router.push(`/prontuarios/abrir/${consultas[0]?.id || ""}?novo=true&nome=${nome}`)}
      >
        <Text style={styles.novaConsultaText}>🩺 Nova Consulta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#111",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  dashboardCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
    marginRight: 6,
  },
  value: {
    fontSize: 15,
    color: "#111",
    fontWeight: "600",
    flexShrink: 1,
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  data: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 6 },
  texto: { fontSize: 15, color: "#555", marginBottom: 3 },
  evolucao: { marginTop: 8, fontSize: 14, color: "#444", fontStyle: "italic" },
  vazio: { textAlign: "center", color: "#666", fontSize: 16, marginTop: 20 },

  // 🔹 Estilo do botão "Nova Consulta"
  novaConsultaButton: {
    backgroundColor: "#10B981",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 30,
  },
  novaConsultaText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
