import { useRouter } from "expo-router"; // ✅ Import necessário para redirecionar
import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { firebaseConfig } from "../../config/firebaseConfig";

// 🔥 Inicializa Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

type Prontuario = {
  id: string;
  paciente: string;
  valor: string;
  data: string;
  tipoAtendimento?: string;
};

export default function Financeiro() {
  const router = useRouter(); // ✅ Necessário para o redirecionamento
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState<number>(
    new Date().getMonth() + 1
  );
  const [anoSelecionado, setAnoSelecionado] = useState<number>(
    new Date().getFullYear()
  );

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // ✅ Protege a rota — se não estiver logado, volta para /login
  useEffect(() => {
    const logged = localStorage.getItem("userLogged");
    const timer = setTimeout(() => {
      if (logged !== "true") {
        router.replace("/login");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 🔹 Busca os prontuários do Firebase
  useEffect(() => {
    const carregarProntuarios = async () => {
      try {
        const snapshot = await getDocs(collection(db, "prontuarios"));
        const lista: Prontuario[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          paciente: doc.data().paciente || "",
          valor: doc.data().valor || "R$ 0,00",
          data: doc.data().data || "",
          tipoAtendimento: doc.data().tipoAtendimento || "",
        }));

        // 🔹 Ordena por data (mais recente primeiro) e, se igual, por nome
        const listaOrdenada = lista.sort((a, b) => {
          const [diaA, mesA, anoA] = a.data.split("/").map(Number);
          const [diaB, mesB, anoB] = b.data.split("/").map(Number);
          const dataA = new Date(anoA, mesA - 1, diaA);
          const dataB = new Date(anoB, mesB - 1, diaB);

          const diff = dataB.getTime() - dataA.getTime();
          if (diff !== 0) return diff;
          return a.paciente.localeCompare(b.paciente, "pt-BR", {
            sensitivity: "base",
          });
        });

        setProntuarios(listaOrdenada);
      } catch (error) {
        console.error("Erro ao buscar prontuários:", error);
      }
    };

    carregarProntuarios();
  }, []);

  // 🔹 Converte "R$ 150,00" → 150.00
  const parseValor = (valor: string) => {
    const numero = valor.replace(/[^\d,]/g, "").replace(",", ".");
    return parseFloat(numero) || 0;
  };

  // 🔹 Filtra os prontuários pelo mês e ano selecionados
  const prontuariosFiltrados = prontuarios.filter((p) => {
    if (!p.data) return false;
    const [dia, mes, ano] = p.data.split("/").map(Number);
    return mes === mesSelecionado && ano === anoSelecionado;
  });

  // 🔹 Calcula o total do mês
  const totalMes = prontuariosFiltrados.reduce((acc, p) => {
    return acc + parseValor(p.valor);
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Financeiro</Text>

      {/* 🔸 Filtro de mês e ano */}
      <View style={styles.filtroContainer}>
        <TouchableOpacity
          onPress={() =>
            setMesSelecionado((prev) => (prev === 1 ? 12 : prev - 1))
          }
        >
          <Text style={styles.seta}>◀</Text>
        </TouchableOpacity>

        <Text style={styles.filtroTexto}>
          {meses[mesSelecionado - 1]} / {anoSelecionado}
        </Text>

        <TouchableOpacity
          onPress={() =>
            setMesSelecionado((prev) => (prev === 12 ? 1 : prev + 1))
          }
        >
          <Text style={styles.seta}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* 🔸 Lista de consultas */}
      {prontuariosFiltrados.length > 0 ? (
        <FlatList
          data={prontuariosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.paciente}>{item.paciente}</Text>
              <Text style={styles.data}>{item.data}</Text>
              <Text style={styles.tipo}>{item.tipoAtendimento}</Text>
              <Text style={styles.valor}>{item.valor || "R$ 0,00"}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.vazio}>Nenhum registro neste mês.</Text>
      )}

      {/* 🔸 Total */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total do mês:</Text>
        <Text style={styles.totalValor}>
          R$ {totalMes.toFixed(2).replace(".", ",")}
        </Text>
      </View>
    </View>
  );
}

// 💅 Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  filtroContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  filtroTexto: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginHorizontal: 15,
  },
  seta: { fontSize: 22, color: "#4F46E5", fontWeight: "bold" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  paciente: { fontSize: 16, fontWeight: "600", color: "#111" },
  data: { fontSize: 14, color: "#666" },
  tipo: { fontSize: 14, color: "#4F46E5", marginTop: 2 },
  valor: { fontSize: 16, color: "#16a34a", fontWeight: "bold", marginTop: 4 },
  vazio: {
    textAlign: "center",
    color: "#777",
    marginTop: 30,
    fontSize: 16,
  },
  totalContainer: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },
  totalLabel: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  totalValor: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 5,
  },
});
