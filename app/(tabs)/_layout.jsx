import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { View, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useEffect, useRef } from "react";

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
    outputRange: ['0deg', '360deg'],
  });

  return (
    <MaskedView
      style={{ width: 42, height: 42 }}
      maskElement={
        <Ionicons
          name="heart"
          size={42}
          color="#fff"
        />
      }
    >
      <Animated.View
        style={{
          width: 84,
          height: 84,
          transform: [{ rotate }],
          position: 'absolute',
          left: -21,
          top: -21,
        }}
      >
        <LinearGradient
          colors={['#ff6b6b', '#feca57', '#ff9ff3', '#48cae4', '#ff6b6b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 84, height: 84 }}
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
            <View style={{
              backgroundColor: focused ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: 28,
              width: 56,
              height: 56,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: focused ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)',
              shadowColor: '#fff',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: focused ? 0.5 : 0.3,
              shadowRadius: focused ? 8 : 4,
              elevation: focused ? 6 : 3,
            }}>
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
