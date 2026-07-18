import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { useRef } from "react";
import { Animated, Easing, View } from "react-native";

function YinYang({ color, spin }) {
  const rotate = spin.interpolate({
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
  // The tab bar renders two copies of each icon (active and inactive) and
  // cross-fades them, so the animation lives here and is shared by both.
  const yinYangSpin = useRef(new Animated.Value(0)).current;

  const spinYinYang = () => {
    yinYangSpin.setValue(0);
    Animated.timing(yinYangSpin, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Tabs
      screenListeners={{
        tabPress: (e) => {
          if (e.target?.startsWith("support")) {
            spinYinYang();
          }
        },
      }}
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
              <YinYang color={color} spin={yinYangSpin} />
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
