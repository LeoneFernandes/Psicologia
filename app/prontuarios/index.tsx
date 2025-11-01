import { getApp, getApps, initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { firebaseConfig } from "../../config/firebaseConfig";

// 🔥 Inicializa Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Tipos
type Atendimento = "Online" | "Presencial" | "Particular" | "Plano";
type Status = "Em andamento" | "Encerrado";

export default function Prontuarios() {
  const [paciente, setPaciente] = useState("");
  const [cpf, setCpf] = useState(""); // 🆕 Novo campo CPF
  const [dataNascimento, setDataNascimento] = useState("");
  const [idade, setIdade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [data, setData] = useState("");
  const [valor, setValor] = useState("");
  const [evolucao, setEvolucao] = useState("");
  const [tipoAtendimento, setTipoAtendimento] = useState<Atendimento | "">("");
  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  const [status, setStatus] = useState<Status | "">("");
  const [mostrarStatus, setMostrarStatus] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const opcoes: Atendimento[] = ["Online", "Presencial", "Particular", "Plano"];
  const opcoesStatus: Status[] = ["Em andamento", "Encerrado"];

  const cores: Record<Atendimento, string> = {
    Online: "#1877F2",
    Presencial: "#22C55E",
    Particular: "#8B5CF6",
    Plano: "#F97316",
  };

  // 🔹 Formatações
  const formatarHora = (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, "");
    let formatado = apenasNumeros.slice(0, 4);
    if (formatado.length >= 3) {
      return `${formatado.slice(0, 2)}h ${formatado.slice(2)}min`;
    } else if (formatado.length >= 1 && formatado.length <= 2) {
      return `${formatado}h`;
    }
    return formatado;
  };

  const formatarData = (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, "").slice(0, 8);
    if (apenasNumeros.length > 4) {
      return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(
        2,
        4
      )}/${apenasNumeros.slice(4)}`;
    } else if (apenasNumeros.length > 2) {
      return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
    }
    return apenasNumeros;
  };

  const formatarValor = (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, "");
    if (!apenasNumeros) return "";
    const numero = (parseInt(apenasNumeros, 10) / 100).toFixed(2);
    return "R$ " + numero.replace(".", ",");
  };

  // 📱 Formata celular: (xx) x xxxx-xxxx
  const formatarCelular = (texto: string) => {
    const numeros = texto.replace(/\D/g, "").slice(0, 11);
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 3)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length <= 7)
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)} ${numeros.slice(
        3
      )}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)} ${numeros.slice(
      3,
      7
    )}-${numeros.slice(7)}`;
  };

  // 🆕 Formata CPF: xxx.xxx.xxx-xx
  const formatarCpf = (texto: string) => {
    const numeros = texto.replace(/\D/g, "").slice(0, 11);
    let formatado = numeros;
    if (numeros.length > 9)
      formatado = `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(
        6,
        9
      )}-${numeros.slice(9)}`;
    else if (numeros.length > 6)
      formatado = `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(
        6
      )}`;
    else if (numeros.length > 3)
      formatado = `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    return formatado;
  };

  // 🔹 Função principal
  const salvarProntuario = async () => {
    try {
      setMensagemSucesso("");

      if (!paciente.trim() || !data.trim()) {
        Alert.alert("⚠️ Campos obrigatórios", "Preencha o nome e a data.");
        return;
      }

      if (email && !email.includes("@")) {
        Alert.alert("⚠️ E-mail inválido", "Insira um e-mail válido.");
        return;
      }

      // 🔥 Salva no Firestore
      await addDoc(collection(db, "prontuarios"), {
        paciente,
        cpf, // ✅ Adicionado
        dataNascimento,
        idade,
        endereco,
        email,
        celular,
        inicio,
        fim,
        data,
        valor,
        evolucao,
        tipoAtendimento,
        status,
        criadoEm: serverTimestamp(),
      });

      Alert.alert("✅ Sucesso", "Prontuário salvo com sucesso!");
      setMensagemSucesso("✅ Salvo com sucesso!");

      // 🔹 Limpa campos
      setPaciente("");
      setCpf("");
      setDataNascimento("");
      setIdade("");
      setEndereco("");
      setEmail("");
      setCelular("");
      setInicio("");
      setFim("");
      setData("");
      setValor("");
      setEvolucao("");
      setTipoAtendimento("");
      setStatus("");

      setTimeout(() => setMensagemSucesso(""), 4000);
    } catch (error) {
      console.error("Erro ao salvar prontuário:", error);
      Alert.alert("❌ Erro", "Não foi possível salvar o prontuário.");
    }
  };

  const corSelecionada = tipoAtendimento ? cores[tipoAtendimento] : undefined;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📋 Prontuário</Text>

      {/* Tipo de Atendimento */}
      <TouchableOpacity
        style={[
          styles.dropdown,
          corSelecionada && {
            backgroundColor: corSelecionada,
            borderColor: corSelecionada,
          },
        ]}
        onPress={() => setMostrarOpcoes(!mostrarOpcoes)}
      >
        <Text
          style={[
            styles.dropdownText,
            tipoAtendimento && styles.dropdownTextSelecionado,
          ]}
        >
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
              <Text style={[styles.opcaoTexto, { color: cores[opcao] }]}>
                {opcao}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Campos de texto */}
      <TextInput
        style={styles.input}
        placeholder="Nome do paciente"
        value={paciente}
        onChangeText={setPaciente}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF do paciente (xxx.xxx.xxx-xx)"
        value={cpf}
        onChangeText={(t) => setCpf(formatarCpf(t))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Data de nascimento ex: 00/00/0000"
        value={dataNascimento}
        onChangeText={(t) => setDataNascimento(formatarData(t))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail do paciente"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Celular do paciente ex: (xx) x xxxx-xxxx"
        value={celular}
        onChangeText={(t) => setCelular(formatarCelular(t))}
        keyboardType="phone-pad"
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Início ex: 00h:00min"
          value={inicio}
          onChangeText={(t) => setInicio(formatarHora(t))}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Fim ex: 00h:00min"
          value={fim}
          onChangeText={(t) => setFim(formatarHora(t))}
          keyboardType="numeric"
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Data da consulta ex: 00/00/0000"
        value={data}
        onChangeText={(t) => setData(formatarData(t))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Valor da consulta (R$)"
        value={valor}
        onChangeText={(t) => setValor(formatarValor(t))}
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

      {/* Status */}
      <TouchableOpacity
        style={[styles.dropdown, { borderColor: "#aaa" }]}
        onPress={() => setMostrarStatus(!mostrarStatus)}
      >
        <Text
          style={[
            styles.dropdownText,
            status && { color: "#000", fontWeight: "600" },
          ]}
        >
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

      {/* Botão */}
      <TouchableOpacity style={styles.button} onPress={salvarProntuario}>
        <Text style={styles.buttonText}>💾 Salvar Prontuário</Text>
      </TouchableOpacity>

      {mensagemSucesso !== "" && (
        <Text style={styles.mensagemSucesso}>{mensagemSucesso}</Text>
      )}
    </ScrollView>
  );
}

// 💅 Estilos
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f3f4f6", flexGrow: 1 },
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
  dropdownText: { fontSize: 16, color: "#555" },
  dropdownTextSelecionado: { color: "#fff", fontWeight: "600" },
  opcoesContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  opcao: { padding: 14, borderBottomWidth: 1, borderBottomColor: "#eee" },
  opcaoTexto: { fontSize: 16, fontWeight: "500" },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { width: "48%" },
  textArea: { height: 130, textAlignVertical: "top" },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  mensagemSucesso: {
    textAlign: "center",
    color: "#22C55E",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "500",
  },
});
