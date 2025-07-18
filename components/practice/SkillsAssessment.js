import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useData } from "../../contexts/DataContext";
import {
  getSkillsAssessment,
  getSkillsAssessmentOptions,
  saveSkillsAssessment,
} from "../../services/dataService";
import { formatDateToString } from "../../utils/dateUtils";

const SkillsAssessment = ({ selectedDate }) => {
  const { settings } = useData();
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessmentOptions, setAssessmentOptions] = useState([]);

  // Update assessment options when settings change (reactive to gender setting)
  useEffect(() => {
    const feminine = settings?.useFeminineVerbs || false;
    setAssessmentOptions(getSkillsAssessmentOptions(feminine));
  }, [settings?.useFeminineVerbs]);

  // Load current assessment for selected date
  useEffect(() => {
    const loadAssessment = async () => {
      if (!selectedDate) {
        setSelectedAssessment(null);
        return;
      }

      try {
        const dateString = formatDateToString(selectedDate);
        const assessment = await getSkillsAssessment(dateString);
        setSelectedAssessment(assessment);
      } catch (error) {
        console.error("Error loading skills assessment:", error);
        setSelectedAssessment(null);
      }
    };

    loadAssessment();
  }, [selectedDate]);

  const handleAssessmentSelect = async (index) => {
    if (!selectedDate) return;

    try {
      const dateString = formatDateToString(selectedDate);
      
      // Toggle selection: if same option is selected, deselect it
      const newAssessment = selectedAssessment === index ? null : index;
      
      await saveSkillsAssessment(dateString, newAssessment);
      setSelectedAssessment(newAssessment);
    } catch (error) {
      console.error("Error saving skills assessment:", error);
    }
  };

  if (!selectedDate) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Как вы использовали навыки сегодня?</Text>
      
      <View style={styles.optionsContainer}>
        {assessmentOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAssessment !== null && selectedAssessment === index && styles.selectedOption,
            ]}
            onPress={() => handleAssessmentSelect(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                selectedAssessment !== null && selectedAssessment === index && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
    textAlign: "left",
    letterSpacing: 0.3,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  optionText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
    textAlign: "left",
    letterSpacing: 0.2,
  },
  selectedOptionText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default SkillsAssessment;
