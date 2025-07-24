import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const EmptyState = () => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="partly-sunny-outline"
          size={64}
          color="#FFD700"
          style={styles.emptyIcon}
        />
      </View>
      <Text style={styles.titleText}>Добро пожаловать</Text>
      <Text style={styles.emptyText}>
        Добавленные поведения появятся в этом списке
      </Text>
      <View style={styles.quoteSection}>
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>
            Не столь важно верить в пользу навыков, сколько практиковать их
          </Text>
        </View>
        <Text style={styles.authorText}>
          — Айгуль
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 32,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  iconContainer: {
    marginBottom: 24,
    padding: 18,
    borderRadius: 50,
    backgroundColor: "rgba(255, 215, 0, 0.12)",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIcon: {
    opacity: 0.95,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  emptyText: {
    fontSize: 16,
    color: "#b8b8b8",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    letterSpacing: 0.2,
    paddingHorizontal: 4,
  },
  quoteSection: {
    alignSelf: "stretch",
    marginHorizontal: -12,
  },
  motivationContainer: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderLeftWidth: 3,
    borderLeftColor: "#FFD700",
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 16,
    color: "#FFD700",
    fontWeight: "600",
    fontStyle: "italic",
    textAlign: "left",
    letterSpacing: 0.2,
    lineHeight: 24,
  },
  authorText: {
    fontSize: 13,
    color: "#FFD700",
    fontWeight: "500",
    textAlign: "right",
    letterSpacing: 0.3,
    opacity: 0.75,
    marginTop: 6,
    paddingRight: 16,
  },
});

export default EmptyState;
