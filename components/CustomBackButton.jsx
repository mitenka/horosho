import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CustomBackButton({
  title = "Назад",
  onPress,
  color = "#f0f0f0",
}) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        <Ionicons
          name="chevron-back"
          size={20}
          color={color}
          style={styles.backIcon}
        />
        <Text style={[styles.buttonText, { color }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    marginRight: 6,
  },
  button: {
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginRight: 6,
  },
});
