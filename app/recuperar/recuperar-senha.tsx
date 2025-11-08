import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import {
    Alert,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "../../config/firebaseConfig";

const { width } = Dimensions.get("window");

const showAlert = (titulo: string, msg: string) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${msg}`);
  } else {
    Alert.alert(titulo, msg);
  }
};

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      showAlert("Atenção", "⚠️ Digite seu e-mail para continuar.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      showAlert(
        "Sucesso 🎉",
        "Enviamos um link de redefinição para o seu e-mail. Verifique sua caixa de entrada ou a pasta de spam."
      );
      setEmail("");
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
            showAlert("Erro", `❌ Ocorreu um erro (${err.code}). Tente novamente.`);
        }
      } else {
        showAlert("Erro", "❌ Ocorreu um erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Ionicons name="lock-closed-outline" size={64} color="#4F46E5" />
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          Digite o e-mail associado à sua conta e enviaremos um link para redefinir sua senha.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Enviando..." : "Enviar link de redefinição"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.backText}>← Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 16,
    width: width < 500 ? "100%" : 420,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginVertical: 15,
    maxWidth: 320,
  },
  input: {
    width: "100%",
    backgroundColor: "#f9fafb",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backText: {
    color: "#4F46E5",
    textDecorationLine: "underline",
    fontSize: 15,
  },
});
