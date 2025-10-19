import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Foto da psicóloga */}
      <Image
        source={require("../assets/images/mirian2.jpg")}
        style={styles.image}
      />

      <Text style={styles.title}>🧠 Psicóloga Mirian Matos</Text>
      <Text style={styles.subtitle}>Escolha uma opção:</Text>

      <View style={styles.menu}>
        {/* Redireciona para a nova tela de opções de prontuário */}
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
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
