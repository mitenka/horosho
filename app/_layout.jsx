import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { initializeData } from "../services/dataService";

export default function RootLayout() {
  useEffect(() => {
    initializeData().catch((error) => {
      console.error("Error initializing data:", error);
    });
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
