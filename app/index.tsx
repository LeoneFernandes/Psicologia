import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Home() {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  useEffect(() => {
    const logged = localStorage.getItem("userLogged");
    setIsLogged(logged === "true");
  }, []);

  if (isLogged === null) return null;
  if (!isLogged) return <Redirect href="/login" />;

  return <HomeScreenContent />;
}

/*
  Tela principal da psicóloga Mirian Matos
*/
export function HomeScreenContent() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userLogged");
    router.replace("/login");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/images/mirian2.jpg")}
          style={styles.image}
        />

        <Text style={styles.title}>🧠 Psicóloga Mirian Matos</Text>
        <Text style={styles.subtitle}>Escolha uma opção:</Text>

        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/prontuarios/opcao")}
          >
            <Text style={styles.buttonText}>📋 Prontuários</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/agendamentos")}
          >
            <Text style={styles.buttonText}>📅 Agendamentos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/financeiro")}
          >
            <Text style={styles.buttonText}>💰 Financeiro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#10B981" }]}
            onPress={() => router.push("/configuracao")}
          >
            <Text style={styles.buttonText}>⚙️ Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  container: {
    width: width < 500 ? "100%" : 420,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#4F46E5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 17,
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
  },
  menu: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
    width: "85%",
    maxWidth: 360,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  logoutText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
