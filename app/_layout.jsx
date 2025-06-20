import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DataProvider } from "../contexts/DataContext";

export default function RootLayout() {
  return (
    <DataProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </DataProvider>
  );
}
