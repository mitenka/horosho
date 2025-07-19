import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../../contexts/DataContext";
import { getDiaryCompletionStatus, saveDiaryCompletionStatus } from "../../services/dataService";
import { formatDateToString } from "../../utils/dateUtils";

const DiaryCompletionToggle = () => {
  const { selectedDate } = useData();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dateString = formatDateToString(selectedDate);

  // Load completion status when date changes
  useEffect(() => {
    const loadCompletionStatus = async () => {
      setIsLoading(true);
      try {
        const status = await getDiaryCompletionStatus(dateString);
        setIsCompleted(status);
      } catch (error) {
        console.error("Error loading diary completion status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompletionStatus();
  }, [dateString]);

  const handleToggle = async () => {
    const newStatus = !isCompleted;
    
    // Optimistic update
    setIsCompleted(newStatus);
    
    try {
      await saveDiaryCompletionStatus(dateString, newStatus);
    } catch (error) {
      console.error("Error saving diary completion status:", error);
      // Revert on error
      setIsCompleted(!newStatus);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.toggle, styles.loadingToggle]}>
          <Text style={styles.label}>Дневник заполнен сегодня</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.toggle, isCompleted && styles.completedToggle]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={[styles.label, isCompleted && styles.completedLabel]}>
              Дневник заполнен сегодня
            </Text>
          </View>
          
          <View style={[styles.checkbox, isCompleted && styles.completedCheckbox]}>
            {isCompleted && (
              <Ionicons name="checkmark" size={18} color="#fff" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  toggle: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedToggle: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  loadingToggle: {
    opacity: 0.6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "500",
  },
  completedLabel: {
    color: "#4CAF50",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  completedCheckbox: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
});

export default DiaryCompletionToggle;
