import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Start() {
  const router = useRouter();

useEffect(() => {
  const timer = setTimeout(() => {
    // ✅ Redireciona corretamente para o login (agora em app/login.tsx)
    router.replace("/login");
  }, 500);

  return () => clearTimeout(timer);
}, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
