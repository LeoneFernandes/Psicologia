// config/firebaseConfig.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";

// 🔒 Usa variáveis de ambiente (Vercel + Expo)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
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

// ✅ Exporta também a configuração (caso precise acessar diretamente)
export { firebaseConfig };

