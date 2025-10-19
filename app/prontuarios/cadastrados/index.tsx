import { StyleSheet, Text, View } from "react-native";

export default function ProntuariosCadastrados() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📁 Prontuários Cadastrados</Text>
      <Text style={styles.text}>
        Aqui você verá a lista de prontuários salvos.
      </Text>
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
    marginBottom: 15,
    color: "#333",
  },
  text: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
});
