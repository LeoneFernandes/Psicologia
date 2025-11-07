import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { db } from "../../config/firebaseConfig";

// 🗣️ Configurar idioma do calendário
LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ],
  monthNamesShort: [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ],
  dayNames: [
    "Domingo", "Segunda", "Terça", "Quarta",
    "Quinta", "Sexta", "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

// 🧩 Tipo de dados
type Agendamento = {
  id?: string;
  data: string;
  inicio: string;
  fim: string;
  paciente: string;
  local: string;
  timestamp?: Date;
};

export default function Agendamentos() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [inicio, setInicio] = useState<string>("");
  const [fim, setFim] = useState<string>("");
  const [paciente, setPaciente] = useState<string>("");
  const [local, setLocal] = useState<string>("");
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const router = useRouter();
  const { width } = useWindowDimensions();

  // 🔒 Proteção de rota
  useEffect(() => {
    const logged = localStorage.getItem("userLogged");
    const timer = setTimeout(() => {
      if (logged !== "true") {
        router.replace("/login");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [router]);

  // ⏰ Formatar hora
  const formatarHora = (texto: string): string => {
    const apenasNumeros = texto.replace(/\D/g, "");
    let formatado = apenasNumeros.slice(0, 4);
    if (formatado.length >= 3) {
      return `${formatado.slice(0, 2)}h ${formatado.slice(2)}min`;
    } else if (formatado.length >= 1 && formatado.length <= 2) {
      return `${formatado}h`;
    }
    return formatado;
  };

  // 💾 SALVAR OU EDITAR
  const salvarAgendamento = async (): Promise<void> => {
    if (!selectedDate) {
      alert("Selecione uma data no calendário!");
      return;
    }
    if (!paciente || !inicio || !fim || !local) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      if (editandoId) {
        const ref = doc(db, "agendamentos", editandoId);
        await updateDoc(ref, { data: selectedDate, inicio, fim, paciente, local });
        alert("✅ Agendamento atualizado com sucesso!");
        setEditandoId(null);
      } else {
        await addDoc(collection(db, "agendamentos"), {
          data: selectedDate,
          inicio,
          fim,
          paciente,
          local,
          timestamp: new Date(),
        });
        alert("✅ Agendamento salvo com sucesso!");
      }

      setInicio("");
      setFim("");
      setPaciente("");
      setLocal("");
      carregarAgendamentosDoMes(selectedDate);
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      alert("❌ Erro ao salvar o agendamento.");
    }
  };

  // 📅 CARREGAR AGENDAMENTOS DO MÊS
  const carregarAgendamentosDoMes = async (data: string): Promise<void> => {
    try {
      const [ano, mes] = data.split("-");
      const prefixoMes = `${ano}-${mes}`;
      const q = query(
        collection(db, "agendamentos"),
        where("data", ">=", `${prefixoMes}-01`),
        where("data", "<=", `${prefixoMes}-31`),
        orderBy("data", "asc")
      );
      const snapshot = await getDocs(q);
      const lista: Agendamento[] = [];
      snapshot.forEach((docSnap) =>
        lista.push({ id: docSnap.id, ...(docSnap.data() as Agendamento) })
      );
      setAgendamentos(lista);
    } catch (e) {
      console.error("Erro ao carregar agendamentos:", e);
    }
  };

  // 🗑️ EXCLUIR
  const excluirAgendamento = async (id: string): Promise<void> => {
    const confirmar =
      Platform.OS === "web"
        ? window.confirm("Tem certeza que deseja excluir este agendamento?")
        : true;
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "agendamentos", id));
      alert("🗑️ Agendamento excluído!");
      carregarAgendamentosDoMes(currentMonth);
    } catch (e) {
      console.error("Erro ao excluir:", e);
      alert("❌ Erro ao excluir agendamento.");
    }
  };

  // ✏️ EDITAR
  const editarAgendamento = (item: Agendamento): void => {
    setSelectedDate(item.data);
    setInicio(item.inicio);
    setFim(item.fim);
    setPaciente(item.paciente);
    setLocal(item.local);
    setEditandoId(item.id || null);
    alert("✏️ Editando agendamento — faça as alterações e salve.");
  };

  // 🔁 Atualiza ao clicar em um dia
  useEffect(() => {
    if (selectedDate) carregarAgendamentosDoMes(selectedDate);
  }, [selectedDate]);

  // 🗓️ Quando muda o mês
  const handleMonthChange = (month: { year: number; month: number }): void => {
    const ano = month.year;
    const mes = String(month.month).padStart(2, "0");
    const dataMes = `${ano}-${mes}-01`;
    setCurrentMonth(dataMes);
    carregarAgendamentosDoMes(dataMes);
  };

  // 🕒 Mês atual ao abrir
  useEffect(() => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dataAtual = `${ano}-${mes}-01`;
    setCurrentMonth(dataAtual);
    carregarAgendamentosDoMes(dataAtual);
  }, []);

  // 🧩 Formatar data
  const formatarData = (data: string): string => {
    if (!data) return "";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const isWide = width > 800;

  return (
    <ScrollView contentContainerStyle={[styles.container, isWide && styles.containerWide]}>
      <Text style={styles.title}>📅 Agendamentos</Text>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        onMonthChange={handleMonthChange}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#4F46E5" },
        }}
        style={{
          width: isWide ? 780 : "98%",
          maxWidth: "100%",
          alignSelf: "center",
          borderRadius: 12,
          backgroundColor: "#fff",
          paddingVertical: 10,
          elevation: 3,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
        }}
        theme={{
          todayTextColor: "#4F46E5",
          arrowColor: "#4F46E5",
          selectedDayBackgroundColor: "#4F46E5",
          selectedDayTextColor: "#fff",
          textMonthFontWeight: "bold",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
      />

      <Text style={styles.selectedDate}>
        {selectedDate
          ? `Data selecionada: ${formatarData(selectedDate)}`
          : "Selecione uma data"}
      </Text>

      {/* Campos */}
      <View style={isWide ? styles.rowInputs : {}}>
        <TextInput
          style={[styles.input, isWide && styles.inputHalf]}
          placeholder="Horário de início ex: 00h 00min"
          value={inicio}
          onChangeText={(t) => setInicio(formatarHora(t))}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, isWide && styles.inputHalf]}
          placeholder="Horário de fim ex: 00h 00min"
          value={fim}
          onChangeText={(t) => setFim(formatarHora(t))}
          keyboardType="numeric"
        />
      </View>

      <View style={isWide ? styles.rowInputs : {}}>
        <TextInput
          style={[styles.input, isWide && styles.inputHalf]}
          placeholder="Nome do paciente"
          value={paciente}
          onChangeText={setPaciente}
        />
        <TextInput
          style={[styles.input, isWide && styles.inputHalf]}
          placeholder="Local do atendimento"
          value={local}
          onChangeText={setLocal}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={salvarAgendamento}>
        <Text style={styles.buttonText}>
          {editandoId ? "💾 Salvar Alterações" : "💾 Salvar Agendamento"}
        </Text>
      </TouchableOpacity>

      {agendamentos.length > 0 && (
        <View style={styles.listaContainer}>
          <Text style={styles.listaTitulo}>🗓️ Agendamentos deste mês</Text>
          <View style={styles.listaEmpilhada}>
            {agendamentos.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.cardData}>{formatarData(item.data)}</Text>
                <Text style={styles.cardTexto}>🧍‍♀️ {item.paciente}</Text>
                <Text style={styles.cardTexto}>
                  ⏰ {item.inicio} - {item.fim}
                </Text>
                <Text style={styles.cardTexto}>📍 {item.local}</Text>

                <View style={styles.cardBotoes}>
                  <TouchableOpacity
                    style={[styles.cardBtn, styles.btnEditar]}
                    onPress={() => editarAgendamento(item)}
                  >
                    <Text style={styles.cardBtnTexto}>✏️ Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cardBtn, styles.btnExcluir]}
                    onPress={() => excluirAgendamento(item.id!)}
                  >
                    <Text style={styles.cardBtnTexto}>🗑️ Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f3f4f6",
    flexGrow: 1,
    alignItems: "center",
  },
  containerWide: {
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  selectedDate: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    width: "90%",
  },
  inputHalf: {
    width: "48%",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: "90%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  listaContainer: {
    marginTop: 30,
    width: "90%",
  },
  listaTitulo: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  listaEmpilhada: {
    flexDirection: "column",
    gap: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardData: {
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 5,
  },
  cardTexto: {
    fontSize: 15,
    color: "#444",
  },
  cardBotoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  cardBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  btnEditar: {
    backgroundColor: "#2563EB",
  },
  btnExcluir: {
    backgroundColor: "#DC2626",
  },
  cardBtnTexto: {
    color: "#fff",
    fontWeight: "600",
  },
});
