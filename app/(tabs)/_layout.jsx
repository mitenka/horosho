import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

function YinYang({ color, focused }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <MaterialCommunityIcons name="yin-yang" size={48} color={color} />
    </Animated.View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ffd700",
        tabBarInactiveTintColor: "#cccccc",
        tabBarStyle: {
          backgroundColor: "#323248",
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Практика",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "flask" : "flask-outline"}
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
              name={focused ? "school" : "school-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "",
          tabBarIcon: ({ focused, color }) => (
            <View
              style={{
                backgroundColor: "#323248",
                borderRadius: 33,
                width: 66,
                height: 66,
                justifyContent: "center",
                alignItems: "center",
                marginTop: -5,
              }}
            >
              <YinYang color={color} focused={focused} />
            </View>
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
      <Tabs.Screen
        name="settings"
        options={{
          title: "Настройка",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
