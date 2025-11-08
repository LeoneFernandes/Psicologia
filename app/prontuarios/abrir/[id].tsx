import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
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

type Atendimento = "Online" | "Presencial" | "Particular" | "Plano";
type Status = "Em andamento" | "Encerrado";

export default function AbrirProntuario() {
  const { id, nome } = useLocalSearchParams();
  const router = useRouter();

  // ✅ Protege a rota — impede acesso direto sem login
  useEffect(() => {
    const logged = localStorage.getItem("userLogged");
    const timer = setTimeout(() => {
      if (logged !== "true") {
        router.replace("/login");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const [paciente, setPaciente] = useState("");
  const [cpf, setCpf] = useState("");
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
  const [status, setStatus] = useState<Status | "">("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
  const [mostrarStatus, setMostrarStatus] = useState(false);

  const opcoes: Atendimento[] = ["Online", "Presencial", "Particular", "Plano"];
  const opcoesStatus: Status[] = ["Em andamento", "Encerrado"];

  const cores: Record<Atendimento, string> = {
    Online: "#1877F2",
    Presencial: "#22C55E",
    Particular: "#8B5CF6",
    Plano: "#F97316",
  };

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
    let formatado = apenasNumeros;
    if (apenasNumeros.length > 4) {
      formatado = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(
        2,
        4
      )}/${apenasNumeros.slice(4)}`;
    } else if (apenasNumeros.length > 2) {
      formatado = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
    }
    return formatado;
  };

  const formatarValor = (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, "");
    if (!apenasNumeros) return "";
    const numero = (parseInt(apenasNumeros, 10) / 100).toFixed(2);
    return "R$ " + numero.replace(".", ",");
  };

  const formatarCelular = (texto: string) => {
    const apenasNumeros = texto.replace(/\D/g, "").slice(0, 11);
    if (apenasNumeros.length <= 2) return `(${apenasNumeros}`;
    if (apenasNumeros.length <= 7)
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(
      2,
      3
    )} ${apenasNumeros.slice(3, 7)}-${apenasNumeros.slice(7)}`;
  };

  const parseValor = (valorTexto: string): number => {
    const numeros = valorTexto.replace(/[R$\s.]/g, "").replace(",", ".");
    return parseFloat(numeros) || 0;
  };

  useEffect(() => {
    const carregarProntuario = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, "prontuarios", id as string);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const dados = snapshot.data();
          setPaciente(dados.paciente || "");
          setCpf(dados.cpf || "");
          setDataNascimento(dados.dataNascimento || "");
          setIdade(dados.idade || "");
          setEndereco(dados.endereco || "");
          setEmail(dados.email || "");
          setCelular(dados.celular || "");
          setEvolucao(dados.evolucao || "");
          setTipoAtendimento(dados.tipoAtendimento || "");
          setStatus(dados.status || "");
        } else {
          Alert.alert("Erro", "Prontuário não encontrado.");
          router.back();
        }
      } catch (e) {
        console.error("Erro ao carregar prontuário:", e);
      }
    };
    carregarProntuario();
  }, [id]);

  const salvarAlteracoes = async () => {
    try {
      setMensagemSucesso("");
      const valorAtual = parseValor(valor);

      await addDoc(collection(db, "prontuarios"), {
        paciente,
        cpf,
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

      Alert.alert("✅ Sucesso", "Nova consulta salva com sucesso!");
      setMensagemSucesso("✅ Nova consulta salva com sucesso!");

      setTimeout(() => {
        router.push({
          pathname: "/prontuarios/historico/[nome]",
          params: { nome: paciente || (nome as string) || "" },
        });
      }, 1200);
    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
      Alert.alert("❌ Erro", "Não foi possível salvar a nova consulta.");
    }
  };

  const corSelecionada = tipoAtendimento ? cores[tipoAtendimento] : undefined;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Prontuário",
          headerStyle: { backgroundColor: "#4F46E5" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/prontuarios/historico/[nome]",
                  params: { nome: paciente || (nome as string) || "" },
                })
              }
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="#fff"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📝 Nova Consulta</Text>

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

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Início"
            value={inicio}
            onChangeText={(t) => setInicio(formatarHora(t))}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Fim"
            value={fim}
            onChangeText={(t) => setFim(formatarHora(t))}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Data da consulta"
          value={data}
          onChangeText={(t) => setData(formatarData(t))}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor da consulta"
          value={valor}
          onChangeText={(t) => setValor(formatarValor(t))}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Evolução"
          value={evolucao}
          onChangeText={setEvolucao}
          multiline
          numberOfLines={6}
        />

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

        <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
          <Text style={styles.buttonText}>💾 Salvar Consulta</Text>
        </TouchableOpacity>

        {mensagemSucesso !== "" && (
          <Text style={styles.mensagemSucesso}>{mensagemSucesso}</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f4f6",
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 40,
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
    width: "100%",
    maxWidth: 600,
  },
  dropdownText: { fontSize: 16, color: "#555" },
  dropdownTextSelecionado: { color: "#fff", fontWeight: "600" },
  opcoesContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    width: "100%",
    maxWidth: 600,
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
    width: "100%",
    maxWidth: 600,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 600,
    gap: 10,
  },
  halfInput: { flex: 1 },
  textArea: { height: 130, textAlignVertical: "top" },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    maxWidth: 600,
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