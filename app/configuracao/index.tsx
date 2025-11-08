// app/configuracao/index.tsx
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { firebaseConfig } from "../../config/firebaseConfig";

import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export default function ConfiguracaoScreen() {
  const [prontuarios, setProntuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions(); // 🔹 usado para ajustar elementos conforme a tela

  // 🔥 Inicializa Firebase
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);

  // 📥 Carrega prontuários
  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "prontuarios"));
        const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProntuarios(lista);
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Não foi possível carregar os prontuários.");
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  // 📝 Exporta DOCX
  const exportarDOCX = async () => {
    if (prontuarios.length === 0) {
      Alert.alert("Aviso", "Nenhum prontuário encontrado para exportar.");
      return;
    }

    try {
      setLoading(true);

      const children: Paragraph[] = [];

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Relatório de Prontuários",
              bold: true,
              size: 28,
            }),
          ],
          spacing: { after: 400 },
        })
      );

      prontuarios.forEach((p, i) => {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `Paciente ${i + 1}`, bold: true, size: 24 })],
          }),
          new Paragraph({ children: [new TextRun(`Nome: ${p.paciente || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`CPF: ${p.cpf || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`Data Nascimento: ${p.dataNascimento || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`Idade: ${p.idade || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`Celular: ${p.celular || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`Email: ${p.email || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`Endereço: ${p.endereco || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`Data da Consulta: ${p.data || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`Início: ${p.inicio || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`Fim: ${p.fim || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`Tipo de Atendimento: ${p.tipoAtendimento || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`Status: ${p.status || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`Valor: ${p.valor || "-"}`)] }),
          new Paragraph({ children: [new TextRun(`Evolução: ${p.evolucao || "-"}`)] }),
          new Paragraph({ children: [new TextRun("---------------------------")] })
        );
      });

      const doc = new Document({ sections: [{ children }] });
      const buffer = await Packer.toBlob(doc);

      if (Platform.OS === "web") {
        saveAs(buffer, "prontuarios.docx");
      } else {
        const fileUri = (FileSystem as any).documentDirectory + "prontuarios.docx";
        const arrayBuffer = await buffer.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString("base64");
        await FileSystem.writeAsStringAsync(fileUri, base64String, { encoding: "base64" });
        await Sharing.shareAsync(fileUri);
      }
    } catch (error) {
      console.error("Erro ao exportar DOCX:", error);
      Alert.alert("Erro", "Não foi possível gerar o DOCX.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 largura adaptável do botão (celular → estreito / desktop → mais largo)
  const buttonWidth = width < 400 ? "80%" : width < 800 ? "50%" : "35%";

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Faça o Backup dos Prontuários:</Text>

        <TouchableOpacity
          style={[styles.button, { width: buttonWidth }]}
          onPress={exportarDOCX}
          disabled={loading}
        >
          <Text style={styles.buttonText}>📄 Exportar Prontuários</Text>
        </TouchableOpacity>

        {loading && <Text style={styles.loadingText}>Processando exportação...</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#111827",
  },
  button: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 15,
    color: "#555",
    textAlign: "center",
  },
});
