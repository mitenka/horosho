import React from "react";
import { StyleSheet, Text, View } from "react-native";

const skillRules = [
  {
    level: "1–2",
    title: "Осознанность",
    color: "#81C784",
    description: "Базовые навыки осознанности и внимательности",
  },
  {
    level: "3–6",
    title: "Эмоциональная регуляция",
    color: "#A1887F",
    description: "Управление эмоциями и их понимание",
  },
  {
    level: "7–10",
    title: "Стрессоустойчивость",
    color: "#F48FB1",
    description: "Навыки преодоления стресса и кризисов",
  },
];

export default function SkillRules() {
  return (
    <View style={styles.container}>
      <View style={styles.rulesContainer}>
        {skillRules.map((rule, index) => (
          <View key={index} style={styles.ruleCard}>
            <View style={[styles.levelBadge, { backgroundColor: rule.color }]}>
              <Text style={styles.levelText}>{rule.level}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
            <Text style={styles.ruleTitle}>{rule.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 24,
  },
  rulesContainer: {
    gap: 16,
  },
  ruleCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  levelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  arrow: {
    fontSize: 20,
    color: "rgba(255, 255, 255, 0.7)",
    marginRight: 16,
  },
  ruleTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    flex: 1,
  },
});
