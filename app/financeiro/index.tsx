import { StyleSheet, Text, View } from "react-native";

export default function Financeiro() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Tela Financeira</Text>
      <Text style={styles.text}>Aqui você vai registrar valores, pagamentos e relatórios.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
