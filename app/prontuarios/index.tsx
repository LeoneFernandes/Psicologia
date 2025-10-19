import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Tipos
type Atendimento = "Online" | "Presencial" | "Particular" | "Plano";
type Status = "Em andamento" | "Encerrado";

export default function Prontuarios() {
  const [paciente, setPaciente] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [evolucao, setEvolucao] = useState("");

  const [tipoAtendimento, setTipoAtendimento] = useState<Atendimento | "">("");
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);

  const [status, setStatus] = useState<Status | "">("");
  const [mostrarStatus, setMostrarStatus] = useState(false);

  const opcoes: Atendimento[] = ["Online", "Presencial", "Particular", "Plano"];
  const opcoesStatus: Status[] = ["Em andamento", "Encerrado"];

  const cores: Record<Atendimento, string> = {
    Online: "#1877F2",
    Presencial: "#22C55E",
    Particular: "#8B5CF6",
    Plano: "#F97316",
  };

  // Função pra formatar o texto da hora automaticamente
  const formatarHora = (texto: string) => {
    // remove tudo que não for número
    const apenasNumeros = texto.replace(/\D/g, "");

    // limita a 4 dígitos (HHMM)
    let formatado = apenasNumeros.slice(0, 4);

    if (formatado.length >= 3) {
      // Exemplo: "1530" -> "15h 30min"
      return `${formatado.slice(0, 2)}h ${formatado.slice(2)}min`;
    } else if (formatado.length >= 1 && formatado.length <= 2) {
      // Exemplo: "15" -> "15h"
      return `${formatado}h`;
    }

    return formatado;
  };

  const salvarProntuario = () => {
    alert("✅ Prontuário salvo com sucesso!");
    console.log({
      paciente,
      inicio,
      fim,
      data,
      valor,
      evolucao,
      tipoAtendimento,
      status,
    });
  };

  const corSelecionada = tipoAtendimento ? cores[tipoAtendimento] : undefined;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Prontuário</Text>

      {/* Tipo de Atendimento */}
      <TouchableOpacity
        style={[
          styles.dropdown,
          corSelecionada && { backgroundColor: corSelecionada, borderColor: corSelecionada },
        ]}
        onPress={() => setMostrarOpcoes(!mostrarOpcoes)}
      >
        <Text style={[styles.dropdownText, tipoAtendimento && styles.dropdownTextSelecionado]}>
          {tipoAtendimento
            ? `Tipo de Atendimento: ${tipoAtendimento}`
            : "Selecione o tipo de atendimento"}
        </Text>
      </TouchableOpacity>

      {mostrarOpcoes && (
        <View style={styles.opcoesContainer}>
          {opcoes.map((opcao) => (
            <TouchableOpacity
              key={opcao}
              style={styles.opcao}
              onPress={() => {
                setTipoAtendimento(opcao);
                setMostrarOpcoes(false);
              }}
            >
              <Text style={[styles.opcaoTexto, { color: cores[opcao] }]}>{opcao}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Nome do Paciente */}
      <TextInput
        style={styles.input}
        placeholder="Nome do paciente"
        value={paciente}
        onChangeText={setPaciente}
      />

      {/* Horários */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Início (ex: 15h 30min)"
          value={inicio}
          onChangeText={(t) => setInicio(formatarHora(t))}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Fim (ex: 16h 10min)"
          value={fim}
          onChangeText={(t) => setFim(formatarHora(t))}
          keyboardType="numeric"
        />
      </View>

      {/* Data */}
      <TextInput
        style={styles.input}
        placeholder="Data (ex: 18/10/2025)"
        value={data}
        onChangeText={setData}
      />

      {/* Valor */}
      <TextInput
        style={styles.input}
        placeholder="Valor da consulta (R$)"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      {/* Evolução */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Evolução (anotações da consulta)"
        value={evolucao}
        onChangeText={setEvolucao}
        multiline
        numberOfLines={6}
      />

      {/* Status */}
      <TouchableOpacity
        style={[styles.dropdown, { borderColor: "#aaa" }]}
        onPress={() => setMostrarStatus(!mostrarStatus)}
      >
        <Text style={[styles.dropdownText, status && { color: "#000", fontWeight: "600" }]}>
          {status ? `Status: ${status}` : "Selecione o status"}
        </Text>
      </TouchableOpacity>

      {mostrarStatus && (
        <View style={styles.opcoesContainer}>
          {opcoesStatus.map((opcao) => (
            <TouchableOpacity
              key={opcao}
              style={styles.opcao}
              onPress={() => {
                setStatus(opcao);
                setMostrarStatus(false);
              }}
            >
              <Text style={styles.opcaoTexto}>{opcao}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Botão salvar */}
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
  dropdown: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "#555",
  },
  dropdownTextSelecionado: {
    color: "#fff",
    fontWeight: "600",
  },
  opcoesContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  opcao: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  opcaoTexto: {
    fontSize: 16,
    fontWeight: "500",
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
