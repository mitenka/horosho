import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Get device width for responsive sizing
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SCENARIO_WIDTH = Math.min(SCREEN_WIDTH - 48, 400);

export default function Scenario({
  title,
  situation,
  options = [],
  color = "#7CB342",
}) {
  // Empty check - don't render anything if no options provided
  if (!options.length) return null;

  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Animation values
  const scale = useSharedValue(1);
  const feedbackOpacity = useSharedValue(0);

  // Animated style for feedback
  const feedbackAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: feedbackOpacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  // Handle option select
  const handleOptionSelect = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedOption(index);
    setShowFeedback(true);

    // Animate feedback appearance
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
    feedbackOpacity.value = withTiming(1, { duration: 300 });
  };

  // Reset scenario
  const resetScenario = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animate feedback disappearance
    feedbackOpacity.value = withTiming(0, { duration: 300 });

    setTimeout(() => {
      setSelectedOption(null);
      setShowFeedback(false);
    }, 300);
  };

  return (
    <View style={styles.container}>
      {/* Title and Situation */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.situation}>{situation}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedOption === index && {
                borderColor: color,
                backgroundColor: `${color}15`,
              },
            ]}
            onPress={() => !showFeedback && handleOptionSelect(index)}
            disabled={showFeedback && selectedOption !== index}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === index && { color: color, fontWeight: "600" },
              ]}
            >
              {option.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback */}
      {showFeedback && selectedOption !== null && (
        <Animated.View
          style={[
            styles.feedbackContainer,
            {
              backgroundColor: options[selectedOption].isHealthy
                ? "rgba(76, 175, 80, 0.1)"
                : "rgba(244, 67, 54, 0.08)",
              borderColor: options[selectedOption].isHealthy
                ? "#4CAF50"
                : "#F44336",
            },
            feedbackAnimatedStyle,
          ]}
        >
          <View style={styles.feedbackHeader}>
            <Ionicons
              name={
                options[selectedOption].isHealthy
                  ? "checkmark-circle"
                  : "alert-circle"
              }
              size={22}
              color={options[selectedOption].isHealthy ? "#4CAF50" : "#F44336"}
              style={styles.feedbackIcon}
            />
            <Text
              style={[
                styles.feedbackHeaderText,
                {
                  color: options[selectedOption].isHealthy
                    ? "#4CAF50"
                    : "#F44336",
                },
              ]}
            >
              {options[selectedOption].isHealthy
                ? "Эффективная стратегия"
                : "Осложняет достижение цели"}
            </Text>
          </View>

          <Text style={styles.feedbackText}>
            {options[selectedOption].feedback}
          </Text>

          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: color }]}
            onPress={resetScenario}
            activeOpacity={0.8}
          >
            <Text style={styles.resetButtonText}>Попробовать снова</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCENARIO_WIDTH,
    alignSelf: "center",
    marginVertical: 8,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f0f0f0",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  situation: {
    fontSize: 16,
    color: "#f0f0f0",
    lineHeight: 24,
    letterSpacing: 0.2,
    opacity: 0.95,
  },
  optionsContainer: {
    marginTop: 8,
    marginBottom: 0,
  },
  option: {
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  optionText: {
    fontSize: 16,
    color: "#f0f0f0",
    lineHeight: 22,
  },
  feedbackContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 8,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  feedbackIcon: {
    marginRight: 8,
  },
  feedbackHeaderText: {
    fontSize: 16,
    fontWeight: "600",
  },
  feedbackText: {
    fontSize: 15,
    color: "#f0f0f0",
    lineHeight: 22,
    marginBottom: 16,
  },
  resetButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
