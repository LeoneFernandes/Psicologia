import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { auth } from "../config/firebaseConfig";

const showAlert = (titulo: string, msg: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${msg}`);
  } else {
    Alert.alert(titulo, msg);
  }
};

export default function Login() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 600; // notebook ou tablet

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      showAlert("Atenção", "⚠️ Preencha todos os campos.");
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      localStorage.setItem("userLogged", "true");
      showAlert("Sucesso", "✅ Login realizado com sucesso!");
      setTimeout(() => router.replace("/"), 300);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/invalid-credential":
          case "auth/invalid-login-credentials":
            showAlert("Erro", "❌ E-mail ou senha incorretos.");
            break;
          case "auth/user-not-found":
            showAlert("Erro", "❌ Usuário não encontrado.");
            break;
          case "auth/invalid-email":
            showAlert("Erro", "❌ E-mail inválido.");
            break;
          case "auth/network-request-failed":
            showAlert("Erro", "🌐 Falha de conexão com o servidor.");
            break;
          default:
            showAlert("Erro", `❌ Erro desconhecido: ${err.code}`);
        }
      } else {
        showAlert("Erro", "❌ Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  };

  const inputWidth = isLargeScreen ? 400 : "90%";

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/mirian2.jpg")}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>🧠 Psicóloga Mirian Matos</Text>
      <Text style={styles.subtitle}>Acesse sua conta</Text>

      <View style={[styles.form, { width: inputWidth }]}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Campo de senha com olhinho */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, borderWidth: 0, marginBottom: 0 }]}
            placeholder="Digite sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
          />
          <TouchableOpacity
            onPress={() => setMostrarSenha(!mostrarSenha)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={mostrarSenha ? "eye-off" : "eye"}
              size={22}
              color="#000"
            />
          </TouchableOpacity>
        </View>

        {/* 🔗 Novo link de recuperação de senha */}
        <TouchableOpacity onPress={() => router.push("/recuperar/recuperar-senha")}>
          <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          {...(Platform.OS === "web" ? { type: "button" } : {})}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#4F46E5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
  },
  form: {
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  eyeIcon: {
    padding: 2,
    opacity: 0.3,
    marginRight: 8,
    ...(Platform.OS === "web" ? { cursor: "pointer" } : {}),
  },
  forgotText: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 15,
    textAlign: "right",
    width: "100%",
    textDecorationLine: "underline",
    ...(Platform.OS === "web" ? { cursor: "pointer" } : {}),
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
