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
    <View>
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
            <View style={styles.radioContainer}>
              <View style={[
                styles.radioButton,
                selectedAssessment !== null && selectedAssessment === index && styles.radioButtonSelected
              ]}>
                {selectedAssessment !== null && selectedAssessment === index && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  selectedAssessment !== null && selectedAssessment === index && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
    textAlign: "left",
    letterSpacing: 0.4,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
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
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 22,
    textAlign: "left",
    letterSpacing: 0.2,
    flex: 1,
    flexWrap: "wrap",
  },
  selectedOptionText: {
    color: "#fff",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#FFD700",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFD700",
  },
});

export default SkillsAssessment;
