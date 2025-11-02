import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    console.log("🔹 Botão clicado!");

    if (!email || !senha) {
      console.log("⚠️ Campos vazios");
      alert("⚠️ Preencha todos os campos.");
      return;
    }

    if (email === "mirian@psicologia.com" && senha === "123456") {
      console.log("✅ Login bem-sucedido");
      alert("✅ Bem-vinda, Mirian!");

      localStorage.setItem("userLogged", "true");

      setTimeout(() => {
        console.log("➡️ Redirecionando para Home...");
        router.replace("/");
      }, 800);
    } else {
      console.log("❌ Email ou senha incorretos");
      alert("❌ Email ou senha incorretos.");
    }
  };

  const handleForgotPassword = () => {
    // ⚠️ Compatível com PWA
    window.alert(
      "Recuperação de senha ainda não disponível.\nEntre em contato com o suporte."
    );
  };

  return (
    <View style={styles.container}>
      {/* Foto da psicóloga */}
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

        {/* Link de esqueci a senha */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
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
    cursor: "pointer", // funciona bem no PWA
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
