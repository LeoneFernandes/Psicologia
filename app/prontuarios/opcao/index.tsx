import { Link, router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OpcaoProntuario() {
  // 🔒 Proteção de rota (versão ajustada para PWA)
  useEffect(() => {
    // Aguarda o ambiente carregar antes de verificar
    const timer = setTimeout(() => {
      try {
        const logged = window?.localStorage?.getItem("userLogged");
        if (logged !== "true") {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Erro ao verificar login:", error);
        router.replace("/login");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Prontuários</Text>
      <Text style={styles.subtitle}>Escolha uma opção:</Text>

      <Link href="/prontuarios" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>🧾 Criar Prontuário Novo</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/prontuarios/cadastrados" asChild>
        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonText}>📁 Ver Prontuários Cadastrados</Text>
        </TouchableOpacity>
      </Link>
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#6366F1",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
