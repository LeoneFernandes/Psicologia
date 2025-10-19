import { collection, getDocs } from "firebase/firestore";
import db from "./firestore";

export async function testarConexao() {
  try {
    const querySnapshot = await getDocs(collection(db, "prontuarios"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
    console.log("🔥 Conexão com o Firestore funcionando!");
  } catch (error) {
    console.error("❌ Erro ao conectar com o Firestore:", error);
  }
}
