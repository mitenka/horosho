import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Get device width for responsive sizing
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 48, 350);

export default function Cards({ cards = [], color = "#7CB342" }) {
  // Empty check - don't render anything if no cards provided
  if (!cards.length) return null;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Animation values
  const rotation = useSharedValue(0); // 0 = front, 1 = back
  const cardScale = useSharedValue(1);

  // Reset animation when card index changes
  useEffect(() => {
    rotation.value = 0;
  }, [currentIndex]);

  // Handle card flip
  const flipCard = useCallback(() => {
    // Apply haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Animate card flip with easing for natural feel
    rotation.value = withTiming(rotation.value === 0 ? 1 : 0, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  // Navigate to previous card
  const goToPrevCard = useCallback(() => {
    // Apply haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animate scale down
    cardScale.value = withTiming(0.8, { duration: 150 });

    // Move to previous card with loop
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : cards.length - 1
      );

      // Animate scale back
      cardScale.value = withTiming(1, { duration: 250 });
    }, 200);
  }, [cards.length]);

  // Navigate to next card
  const goToNextCard = useCallback(() => {
    // Apply haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Animate scale down
    cardScale.value = withTiming(0.8, { duration: 150 });

    // Move to next card with loop
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex < cards.length - 1 ? prevIndex + 1 : 0
      );

      // Animate scale back
      cardScale.value = withTiming(1, { duration: 250 });
    }, 200);
  }, [cards.length]);

  // Gesture handling - tap to flip
  const tap = Gesture.Tap().onEnd(() => {
    "worklet";
    runOnJS(flipCard)();
  });

  // Swipe gesture for navigating between cards
  const swipe = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-10, 10])
    .onEnd((event) => {
      "worklet";
      const distance = Math.abs(event.translationX);
      
      // Require both velocity and distance for swipe
      if (event.velocityX < -150 || (event.translationX < -50 && distance > 30)) {
        // Left swipe - go to next card
        runOnJS(goToNextCard)();
      } else if (event.velocityX > 150 || (event.translationX > 50 && distance > 30)) {
        // Right swipe - go to previous card
        runOnJS(goToPrevCard)();
      }
    });

  // Combine gestures - Race allows first successful gesture to win
  const gesture = Gesture.Race(tap, swipe);

  // Animated styles for front face
  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1200 },
        { scale: cardScale.value },
        {
          rotateY: `${interpolate(rotation.value, [0, 1], [0, 180])}deg`,
        },
      ],
      opacity: interpolate(rotation.value, [0, 0.5, 1], [1, 0, 0]),
      backfaceVisibility: "hidden",
    };
  });

  // Animated styles for back face
  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1200 },
        { scale: cardScale.value },
        {
          rotateY: `${interpolate(rotation.value, [0, 1], [180, 360])}deg`,
        },
      ],
      opacity: interpolate(rotation.value, [0, 0.5, 1], [0, 0, 1]),
      backfaceVisibility: "hidden",
    };
  });

  // Get current card data
  const currentCard = cards[currentIndex];

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={styles.cardContainer}>
          {/* Front of the card */}
          <Animated.View
            style={[
              styles.card,
              {
                borderColor: color,
                backgroundColor: `${color}03`,
              },
              frontAnimatedStyle,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Карточка ${currentIndex + 1} из ${
              cards.length
            }. ${
              currentCard.front
            }. Нажмите, чтобы перевернуть. Проведите влево или вправо для навигации.`}
          >
            <Text style={[styles.cardText, { color }]}>
              {currentCard.front}
            </Text>
          </Animated.View>

          {/* Back of the card */}
          <Animated.View
            style={[
              styles.card,
              styles.backCard,
              { borderColor: color, backgroundColor: "white" },
              backAnimatedStyle,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Обратная сторона карточки. ${currentCard.back}. Нажмите, чтобы перевернуть обратно. Проведите влево или вправо для навигации.`}
          >
            <Text style={[styles.cardBackText, { color: "#333" }]}>
              {currentCard.back}
            </Text>
          </Animated.View>
        </View>
      </GestureDetector>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        {cards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor: index === currentIndex ? color : `${color}40`,
              },
            ]}
            accessibilityLabel={
              index === currentIndex
                ? `Текущая карточка ${index + 1} из ${cards.length}`
                : `Карточка ${index + 1} из ${cards.length}`
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 24,
    width: "100%",
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.7,
    position: "relative",
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  backCard: {
    borderWidth: 1,
    borderRadius: 14,
  },
  cardText: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardBackText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  progressContainer: {
    flexDirection: "row",
    marginTop: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
