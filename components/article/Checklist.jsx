import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function Checklist({ items, title, color = "#7CB342" }) {
  const backgroundColor = "rgba(45, 45, 65, 0.65)";
  
  return (
    <View
      style={[
        styles.checklistContainer,
        {
          borderColor: `${color}50`,
          ...Platform.select({
            ios: {
              shadowColor: color,
              shadowOpacity: 0.3,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
            },
            android: {
              elevation: 0,
            },
          }),
        },
      ]}
    >
      {title && (
        <View style={[styles.titleContainer, { backgroundColor }]}>
          <Text style={[styles.title, { color: "#ffffff" }]}>{title}</Text>
        </View>
      )}
      <View style={[styles.itemsContainer, { backgroundColor }]}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <View 
              style={[
                styles.markerContainer, 
                { backgroundColor: color }
              ]}
            />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checklistContainer: {
    marginBottom: 20,
    borderWidth: 1.5,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(45, 45, 65, 0.2)",
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  itemsContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-start",
  },
  markerContainer: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 14,
    marginTop: 9,
  },
  itemText: {
    fontSize: 18,
    color: "#ffffff",
    lineHeight: 26,
    flex: 1,
    letterSpacing: 0.2,
  },
});
