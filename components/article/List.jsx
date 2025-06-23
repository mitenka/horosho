import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function List({ items, title, color = "#7CB342" }) {
  const backgroundColor = "rgba(45, 45, 65, 0.75)";
  return (
    <View
      style={[
        styles.listContainer,
        {
          borderColor: `${color}90`,
          shadowColor: color,
          shadowOpacity: 0.25,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: 4,
        },
      ]}
    >
      {title && (
        <View style={[styles.titleContainer, { backgroundColor }]}>
          <Text style={[styles.title, { color: "#ffffff" }]}>{title}</Text>
        </View>
      )}
      <View style={[styles.listItemsContainer, { backgroundColor }]}>
        {items.map((item, index) => (
          <View key={index} style={styles.listItemContainer}>
            <View style={[styles.checkContainer, { backgroundColor: color }]}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </View>
            <Text style={styles.listItem}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginBottom: 20,
    borderWidth: 1.5,
    borderRadius: 12,
    overflow: "hidden",
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
  listItemsContainer: {
    padding: 16,
  },
  listItemContainer: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-start",
    paddingVertical: 6,
  },
  checkContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    marginTop: 2,
  },
  listItem: {
    fontSize: 18,
    color: "#ffffff",
    lineHeight: 26,
    flex: 1,
    letterSpacing: 0.2,
  },
});
