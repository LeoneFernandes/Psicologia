import { router } from "expo-router";
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
} from "react-native";

import { FirebaseError } from "firebase/app";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";

const showAlert = (titulo: string, msg: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${msg}`);
  } else {
    Alert.alert(titulo, msg);
  }
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    if (!email || !senha) {
      showAlert("Atenção", "⚠️ Preencha todos os campos.");
      return;
    }

    console.log("🟡 Iniciando login...");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      console.log("🟢 Login realizado no Firebase!");
      console.log("👤 Usuário logado:", cred.user);

      // ✅ Grava o login localmente para manter o acesso
      localStorage.setItem("userLogged", "true");

      showAlert("Sucesso", "✅ Login realizado com sucesso!");
      console.log("➡️ Redirecionando para Home...");

      // ✅ Redireciona de forma segura para a Home (index.tsx)
      setTimeout(() => {
        try {
          router.replace("/");
          console.log("✅ router.replace('/') executado");
        } catch (e) {
          console.warn("⚠️ router.replace('/') falhou:", e);
        }
      }, 300);
    } catch (err: unknown) {
      console.error("Erro no login:", err);

      if (err instanceof FirebaseError) {
        console.log("🔍 Código do erro Firebase:", err.code);

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

  const handleForgotPassword = async () => {
    if (!email) {
      showAlert("Atenção", "⚠️ Informe seu e-mail para recuperar a senha.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showAlert(
        "Sucesso",
        "📧 E-mail de recuperação enviado! Verifique sua caixa de entrada."
      );
    } catch (err: unknown) {
      console.error("Erro ao enviar e-mail de redefinição:", err);

      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/user-not-found":
            showAlert("Erro", "❌ Nenhuma conta encontrada com este e-mail.");
            break;
          case "auth/invalid-email":
            showAlert("Erro", "❌ E-mail inválido. Verifique e tente novamente.");
            break;
          default:
            showAlert(
              "Erro",
              `❌ Não foi possível enviar o e-mail (${err.code}). Tente novamente mais tarde.`
            );
        }
      } else {
        showAlert("Erro", "❌ Ocorreu um erro inesperado. Tente novamente.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/mirian2.jpg")}
        style={styles.image}
      />

      <Text style={styles.title}>🧠 Psicóloga Mirian Matos</Text>
      <Text style={styles.subtitle}>Acesse sua conta</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={(e) => {
            e.preventDefault?.();
            e.stopPropagation?.();
            console.log("✅ Clique detectado — executando login...");
            handleLogin();
          }}
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
    padding: 20,
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
    width: 300,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    fontSize: 16,
  },
  forgotText: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 15,
    textAlign: "right",
    width: 300,
    textDecorationLine: "underline",
    ...(Platform.OS === "web" ? { cursor: "pointer" } : {}),
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
