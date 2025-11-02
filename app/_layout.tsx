// app/_layout.tsx
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Tela de Login */}
        <Stack.Screen
          name="login"
          options={{
            title: "Login",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => null,
          }}
        />

        {/* Tela inicial (Home) */}
        <Stack.Screen
          name="index"
          options={{
            title: "",
            headerShown: false,
          }}
        />

        {/* Tela de carregamento (Start) */}
        <Stack.Screen
          name="start"
          options={{
            headerShown: false,
          }}
        />

        {/* Demais telas */}
        <Stack.Screen
          name="prontuarios/opcao/index"
          options={{
            title: "Prontuários",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/")}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#fff"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="prontuarios/index"
          options={{
            title: "Novo Prontuário",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/prontuarios/opcao")}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#fff"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="prontuarios/cadastrados/index"
          options={{
            title: "Prontuários Cadastrados",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/prontuarios/opcao")}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#fff"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="prontuarios/abrir/[id]"
          options={{
            title: "Prontuário",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/prontuarios/cadastrados")}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#fff"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="prontuarios/historico/[nome]"
          options={{
            title: "Histórico do Paciente",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/prontuarios/cadastrados")}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#fff"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="agendamentos/index"
          options={{
            title: "Agendamentos",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/")}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#fff"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="financeiro/index"
          options={{
            title: "Financeiro",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/")}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#fff"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
