import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import DaySelector from "../../components/practice/DaySelector";

export default function Index() {
  const handleDaySelected = (date: Date) => {
    console.log("Selected date:", date);
  };
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Сегодня</Text>
        <Text style={styles.subtitle}>Дневник и практика</Text>
      </View>

      <DaySelector onDaySelected={handleDaySelected} />

      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>
          Здесь будет дневник навыков и отслеживание настроения
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#cccccc",
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3a3a5e",
    borderRadius: 12,
    padding: 30,
    marginTop: 20,
  },
  emptyStateText: {
    color: "#f0f0f0",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
