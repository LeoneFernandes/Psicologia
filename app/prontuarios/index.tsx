import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Prontuarios() {
  const [paciente, setPaciente] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [evolucao, setEvolucao] = useState("");

  const salvarProntuario = () => {
    alert("✅ Prontuário salvo com sucesso!");
    console.log({ paciente, inicio, fim, data, valor, evolucao });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Prontuário</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do paciente"
        value={paciente}
        onChangeText={setPaciente}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Início (ex: 14:00)"
          value={inicio}
          onChangeText={setInicio}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Fim (ex: 15:00)"
          value={fim}
          onChangeText={setFim}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Data (ex: 18/10/2025)"
        value={data}
        onChangeText={setData}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor da consulta (R$)"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Evolução (anotações da consulta)"
        value={evolucao}
        onChangeText={setEvolucao}
        multiline
        numberOfLines={6}
      />

      <TouchableOpacity style={styles.button} onPress={salvarProntuario}>
        <Text style={styles.buttonText}>💾 Salvar Prontuário</Text>
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
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  textArea: {
    height: 130,
    textAlignVertical: "top",
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
