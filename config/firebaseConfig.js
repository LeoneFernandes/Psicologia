// config/firebaseConfig.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";

// 🔥 Configuração do Firebase (idêntica à do Console)
const firebaseConfig = {
  apiKey: "AIzaSyDq5xYi49umiDC7n7LQJGYhZ-8SH_KiwZ4",
  authDomain: "psicologiaapp-de73f.firebaseapp.com",
  projectId: "psicologiaapp-de73f",
  storageBucket: "psicologiaapp-de73f.firebasestorage.app",
  messagingSenderId: "8341175621",
  appId: "1:8341175621:web:be1e9a13e3fb38dc11d22c"
};

// ✅ Inicializa o app Firebase uma única vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Exporta instâncias reutilizáveis
export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };

// 🧪 Função opcional para testar a conexão
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

// ✅ Exporta também a configuração, caso precise acessar diretamente
export { firebaseConfig };

