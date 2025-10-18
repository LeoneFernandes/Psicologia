import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";

export default function Agendamentos() {
  const [selectedDate, setSelectedDate] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [paciente, setPaciente] = useState("");
  const [local, setLocal] = useState("");

  const salvarAgendamento = () => {
    if (!selectedDate) {
      alert("Selecione uma data no calendário!");
      return;
    }
    alert(`📅 Agendamento salvo!\n\nData: ${selectedDate}\nPaciente: ${paciente}`);
    console.log({ selectedDate, inicio, fim, paciente, local });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📅 Agendamentos</Text>

      {/* Calendário */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#4F46E5" },
        }}
        theme={{
          todayTextColor: "#4F46E5",
          arrowColor: "#4F46E5",
        }}
      />

      <Text style={styles.selectedDate}>
        {selectedDate ? `Data selecionada: ${selectedDate}` : "Selecione uma data"}
      </Text>

      {/* Campos do agendamento */}
      <TextInput
        style={styles.input}
        placeholder="Horário de início (ex: 14:00)"
        value={inicio}
        onChangeText={setInicio}
      />

      <TextInput
        style={styles.input}
        placeholder="Horário de fim (ex: 15:00)"
        value={fim}
        onChangeText={setFim}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome do paciente"
        value={paciente}
        onChangeText={setPaciente}
      />

      <TextInput
        style={styles.input}
        placeholder="Local do atendimento"
        value={local}
        onChangeText={setLocal}
      />

      <TouchableOpacity style={styles.button} onPress={salvarAgendamento}>
        <Text style={styles.buttonText}>💾 Salvar Agendamento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f3f4f6",
    flexGrow: 1,
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
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
