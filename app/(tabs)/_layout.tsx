import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#323248",
          borderTopWidth: 0,
          paddingTop: 6,
          height: 64,
        },
        tabBarActiveTintColor: "#ffd700",
        tabBarInactiveTintColor: "#cccccc",
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Сегодня",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "today" : "today-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="theory"
        options={{
          title: "Теория",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: "Карточки",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "game-controller" : "game-controller-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: "Словарь",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
