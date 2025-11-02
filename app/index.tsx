import { Link, Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
  Tela principal da psicóloga Mirian
*/
export function HomeScreenContent() {
  const handleLogout = () => {
    localStorage.removeItem("userLogged");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/mirian2.jpg")}
        style={styles.image}
      />

      <Text style={styles.title}>🧠 Psicóloga Mirian Matos</Text>
      <Text style={styles.subtitle}>Escolha uma opção:</Text>

      <View style={styles.menu}>
        <Link href="/prontuarios/opcao" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>📋 Prontuários</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/agendamentos" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>📅 Agendamentos</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/financeiro" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>💰 Financeiro</Text>
          </TouchableOpacity>
        </Link>

        {/* Texto "Sair" discreto */}
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
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
  menu: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 15,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  logoutText: {
    color: "#dc2626", // vermelho mais suave
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
