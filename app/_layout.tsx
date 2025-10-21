// app/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Home / Início (sem header se quiser) */}
        <Stack.Screen
          name="index"
          options={{
            title: "",
            headerShown: false,
          }}
        />

        {/* Prontuários - menu de opções */}
        <Stack.Screen
          name="prontuarios/opcao/index"
          options={{
            title: "Prontuários",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/")}>
                <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          }}
        />

        {/* Criar prontuário (formulário) */}
        <Stack.Screen
          name="prontuarios/index"
          options={{
            title: "Novo Prontuário",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/prontuarios/opcao")}>
                <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          }}
        />

        {/* Prontuários cadastrados */}
        <Stack.Screen
          name="prontuarios/cadastrados/index"
          options={{
            title: "Prontuários Cadastrados",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/prontuarios/opcao")}>
                <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          }}
        />

        {/* Agendamentos */}
        <Stack.Screen
          name="agendamentos/index"
          options={{
            title: "Agendamentos",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/")}>
                <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          }}
        />

        {/* Financeiro */}
        <Stack.Screen
          name="financeiro/index"
          options={{
            title: "Financeiro",
            headerStyle: { backgroundColor: "#4F46E5" },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/")}>
                <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
