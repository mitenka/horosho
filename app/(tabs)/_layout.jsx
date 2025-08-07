import Ionicons from "@expo/vector-icons/Ionicons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

function AnimatedGradientHeart({ focused }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    };
    animate();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <MaskedView
      style={{ width: 52, height: 52 }}
      maskElement={<Ionicons name="aperture-outline" size={52} color="#fff" />}
    >
      <Animated.View
        style={{
          width: 104,
          height: 104,
          transform: [{ rotate }],
          position: "absolute",
          left: -26,
          top: -26,
        }}
      >
        <LinearGradient
          colors={["#ff6b6b", "#feca57", "#ff9ff3", "#48cae4", "#ff6b6b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 104, height: 104 }}
        />
      </Animated.View>
    </MaskedView>
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
              <AnimatedGradientHeart focused={focused} />
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
