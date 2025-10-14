import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// Get device width for responsive sizing
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const QUIZ_WIDTH = Math.min(SCREEN_WIDTH - 48, 400);

export default function Quiz({ questions = [], color = "#7CB342" }) {
  // Empty check - don't render anything if no questions provided
  if (!questions.length) return null;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Animation values
  const scale = useSharedValue(1);
  const correctBgOpacity = useSharedValue(0);
  const incorrectBgOpacity = useSharedValue(0);

  // Current question data
  const currentQuestion = questions[currentQuestionIndex];
  const isMultipleChoice = currentQuestion.multiple;

  // Animated styles for score counters
  const correctScoreAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isQuizCompleted ? 
        "#4CAF50" : // Full color when completed
        `rgba(76, 175, 80, ${correctBgOpacity.value})`,
    };
  });

  const incorrectScoreAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isQuizCompleted ? 
        "#F44336" : // Full color when completed
        `rgba(244, 67, 54, ${incorrectBgOpacity.value})`,
    };
  });

  // Handle option select
  const handleOptionSelect = (optionIndex) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    if (isMultipleChoice) {
      // For multiple choice, toggle the selection
      setSelectedOptions((prev) => {
        if (prev.includes(optionIndex)) {
          return prev.filter((index) => index !== optionIndex);
        } else {
          return [...prev, optionIndex];
        }
      });
    } else {
      // For single choice, just select one option
      setSelectedOptions([optionIndex]);
    }
  };

  // Check answer and update counters with animation
  const checkAnswer = () => {
    if (selectedOptions.length === 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Check if the answer is correct
    const isCorrect = currentQuestion.correct.every((index) =>
      selectedOptions.includes(index)
    ) && selectedOptions.length === currentQuestion.correct.length;

    // Update counters with animation
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      // Brighter background flash animation for correct score
      correctBgOpacity.value = withSequence(
        withTiming(0.6, { duration: 300 }),
        withTiming(0, { duration: 500 })
      );
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
      // Brighter background flash animation for incorrect score
      incorrectBgOpacity.value = withSequence(
        withTiming(0.6, { duration: 300 }),
        withTiming(0, { duration: 500 })
      );
    }
    
    setShowFeedback(true);
    
    // Check if this is the last question
    if (currentQuestionIndex === questions.length - 1) {
      // Set quiz completed after animation finishes
      setTimeout(() => {
        setIsQuizCompleted(true);
      }, 800); // Wait for flash animation to complete
    }
  };

  // Move to next question or restart quiz
  const goToNextQuestion = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOptions([]);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz completed - reset
        setCurrentQuestionIndex(0);
        setCorrectAnswers(0);
        setIncorrectAnswers(0);
        setIsQuizCompleted(false);
      }
    }, 300);
  };

  // Check if option is selected
  const isOptionSelected = (optionIndex) => {
    return selectedOptions.includes(optionIndex);
  };

  return (
    <View style={styles.container}>
      {/* Question title */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        <View style={styles.questionMetaContainer}>
          <View style={styles.upperMetaContainer}>
            <Text style={styles.questionCounter}>
              {currentQuestionIndex + 1} из {questions.length}
            </Text>
            <View style={styles.scoreContainer}>
              <Animated.View 
                style={[
                  styles.scoreItem, 
                  correctScoreAnimatedStyle,
                  isQuizCompleted && styles.scoreItemFilled
                ]}
              >
                <Text style={[styles.correctScore, isQuizCompleted && styles.scoreTextLight]}>{correctAnswers}</Text>
              </Animated.View>
              <Animated.View 
                style={[
                  styles.scoreItemDanger, 
                  incorrectScoreAnimatedStyle,
                  isQuizCompleted && styles.scoreItemDangerFilled
                ]}
              >
                <Text style={[styles.incorrectScore, isQuizCompleted && styles.scoreTextLight]}>{incorrectAnswers}</Text>
              </Animated.View>
            </View>
          </View>

        </View>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              isOptionSelected(index) && { borderColor: color, backgroundColor: `${color}15` },
              showFeedback && currentQuestion.correct.includes(index) && styles.correctOption,
              showFeedback && isOptionSelected(index) && !currentQuestion.correct.includes(index) && styles.incorrectOption,
            ]}
            onPress={() => !showFeedback && handleOptionSelect(index)}
            disabled={showFeedback}
            activeOpacity={0.8}
          >
            <View style={styles.optionContentContainer}>
              <View style={[styles.optionIndicator, 
                isMultipleChoice ? styles.checkboxIndicator : styles.radioIndicator,
                { borderColor: "#f0f0f0" },
                isOptionSelected(index) && { borderColor: color, backgroundColor: isMultipleChoice ? 'transparent' : color },
                showFeedback && currentQuestion.correct.includes(index) && { borderColor: "#4CAF50", backgroundColor: isMultipleChoice ? 'transparent' : "#4CAF50" },
                showFeedback && isOptionSelected(index) && !currentQuestion.correct.includes(index) && { borderColor: "#F44336", backgroundColor: isMultipleChoice ? 'transparent' : "#F44336" }
              ]}>
                {isMultipleChoice && isOptionSelected(index) && (
                  <Ionicons 
                    name="checkmark" 
                    size={14} 
                    color={showFeedback ? 
                      (currentQuestion.correct.includes(index) ? "#4CAF50" : "#F44336") : 
                      color} 
                  />
                )}
              </View>
              <Text 
                style={[
                  styles.optionText,
                  isOptionSelected(index) && { color: color, fontWeight: "600" },
                  showFeedback && currentQuestion.correct.includes(index) && styles.correctOptionText,
                  showFeedback && isOptionSelected(index) && !currentQuestion.correct.includes(index) && styles.incorrectOptionText,
                ]}
              >
                {option}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action button (Check Answer or Next Question) */}
      {!showFeedback ? (
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            { backgroundColor: selectedOptions.length === 0 ? `${color}80` : color }
          ]}
          onPress={checkAnswer}
          disabled={selectedOptions.length === 0}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionButtonText, selectedOptions.length === 0 && { opacity: 0.8 }]}>
            Проверить
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: color }]}
          onPress={goToNextQuestion}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>
            {currentQuestionIndex < questions.length - 1 ? "Следующий вопрос" : "Попробовать снова"}
          </Text>
        </TouchableOpacity>
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: QUIZ_WIDTH,
    alignSelf: "center",
    marginVertical: 8,
    paddingHorizontal: 0,
  },
  questionContainer: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f0f0f0",
    marginBottom: 8,
    lineHeight: 26,
    letterSpacing: 0.3,
    flexWrap: "wrap",
  },
  questionMetaContainer: {
    flexDirection: "column",
    gap: 8,
  },
  upperMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  questionCounter: {
    fontSize: 14,
    color: "#c8c8e0",
    opacity: 0.8,
  },

  scoreContainer: {
    flexDirection: "row",
    gap: 8,
  },
  scoreItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  scoreItemDanger: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#F44336",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  scoreItemFilled: {
    backgroundColor: "#4CAF50",
  },
  scoreItemDangerFilled: {
    backgroundColor: "#F44336",
  },
  correctScore: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "700",
  },
  incorrectScore: {
    fontSize: 16,
    color: "#F44336",
    fontWeight: "700",
  },
  scoreTextLight: {
    color: "#FFFFFF",
  },
  selectionTypeContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectionTypeText: {
    fontSize: 12,
    color: "#f0f0f0",
    fontWeight: "500",
  },
  optionsContainer: {
    marginTop: 8,
    marginBottom: 10,
  },
  option: {
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  optionContentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIndicator: {
    width: 20,
    height: 20,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioIndicator: {
    borderRadius: 10,
  },
  checkboxIndicator: {
    borderRadius: 4,
  },
  optionText: {
    fontSize: 16,
    color: "#f0f0f0",
    lineHeight: 22,
    flex: 1,
    flexWrap: "wrap",
  },
  correctOption: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  incorrectOption: {
    borderColor: "#F44336",
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  correctOptionText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  incorrectOptionText: {
    color: "#F44336",
    fontWeight: "600",
  },
  actionButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  feedbackContainer: {
    marginTop: 10,
    paddingHorizontal: 8,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
