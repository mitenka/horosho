import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DataProvider } from "../contexts/DataContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#2d2d4a" }}>
      <DataProvider>
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: "#2d2d4a",
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </DataProvider>
    </GestureHandlerRootView>
  );
}
