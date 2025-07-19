import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ControlAssessment = ({ onAssessmentChange }) => {
  const [assessments, setAssessments] = useState({
    thoughts: null, // Мыслями
    emotions: null, // Эмоциями
    actions: null, // Действиями
  });

  const categories = [
    { key: "thoughts", label: "Мысли" },
    { key: "emotions", label: "Эмоции" },
    { key: "actions", label: "Поведение" },
  ];

  const handleScalePress = (category, value) => {
    const newAssessments = {
      ...assessments,
      [category]: assessments[category] === value ? null : value,
    };

    setAssessments(newAssessments);

    // Notify parent component
    if (onAssessmentChange) {
      onAssessmentChange(newAssessments);
    }
  };

  const renderScaleButtons = (category) => {
    return (
      <View style={styles.scaleContainer}>
        {[0, 1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.scaleButton,
              assessments[category] === value && styles.selectedScaleButton,
            ]}
            onPress={() => handleScalePress(category, value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.scaleText,
                assessments[category] === value && styles.selectedScaleText,
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Как вы оцениваете влияние на свои мысли, эмоции и поведение?
      </Text>

      {categories.map((category) => (
        <View key={category.key} style={styles.categoryContainer}>
          <Text style={styles.categoryLabel}>{category.label}</Text>
          {renderScaleButtons(category.key)}
        </View>
      ))}
      
      <Text style={styles.helperText}>
        0 — совсем нет, 5 — полностью
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 20,
    textAlign: "left",
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryLabel: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  scaleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedScaleButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  scaleText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    fontWeight: "500",
  },
  selectedScaleText: {
    color: "#fff",
    fontWeight: "600",
  },
  helperText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 12,
  },
});

export default ControlAssessment;
