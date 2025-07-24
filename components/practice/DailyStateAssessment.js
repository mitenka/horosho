import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getDailyState, saveDailyState } from "../../services/diaryService";
import { formatDateToString } from "../../utils/dateUtils";

const DailyStateAssessment = ({ selectedDate }) => {
  const [state, setState] = useState({
    emotional: null,
    physical: null,
    pleasure: null,
  });

  // Load existing state for the selected date
  useEffect(() => {
    const loadStateForDate = async () => {
      const dateString = formatDateToString(selectedDate);
      const existingState = await getDailyState(dateString);
      if (existingState) {
        setState({
          emotional: existingState.emotional,
          physical: existingState.physical,
          pleasure: existingState.pleasure,
        });
      } else {
        setState({
          emotional: null,
          physical: null,
          pleasure: null,
        });
      }
    };

    loadStateForDate();
  }, [selectedDate]);

  const handleValueChange = async (category, value) => {
    // If same value is selected, remove it (toggle behavior)
    const newValue = state[category] === value ? null : value;
    const newState = { ...state, [category]: newValue };
    setState(newState);

    // Always save the state change
    const dateString = formatDateToString(selectedDate);
    await saveDailyState(dateString, newState);
  };

  const renderScale = (category, title) => {
    return (
      <View style={styles.scaleContainer}>
        <Text style={styles.scaleTitle}>{title}</Text>
        <View style={styles.scaleButtons}>
          {[0, 1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              activeOpacity={0.8}
              style={[
                styles.scaleButton,
                state[category] === value && styles.scaleButtonActive,
              ]}
              onPress={() => handleValueChange(category, value)}
            >
              <Text
                style={[
                  styles.scaleButtonText,
                  state[category] === value && styles.scaleButtonTextActive,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[
        "rgba(255, 215, 0, 0.05)",
        "rgba(255, 255, 255, 0.08)",
        "rgba(255, 215, 0, 0.03)"
      ]}
      style={styles.container}
    >
      {renderScale("emotional", "Эмоциональное страдание")}
      {renderScale("physical", "Физическое страдание")}
      {renderScale("pleasure", "Удовольствие")}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scaleContainer: {
    marginBottom: 20,
  },
  scaleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  scaleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  scaleButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scaleButtonActive: {
    backgroundColor: "#FFD700",
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  scaleButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
  scaleButtonTextActive: {
    color: "#000000",
    fontWeight: "600",
  },
});

export default DailyStateAssessment;
