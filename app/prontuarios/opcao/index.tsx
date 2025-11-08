import { Link, router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OpcaoProntuario() {
  // 🔒 Proteção de rota (PWA segura)
  useEffect(() => {
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
      <View style={styles.card}>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e1e1e",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#6366F1",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
