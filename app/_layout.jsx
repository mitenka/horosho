import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DataProvider } from "../contexts/DataContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DataProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </DataProvider>
    </GestureHandlerRootView>
  );
}
