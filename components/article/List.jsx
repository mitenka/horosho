import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function List({ items, title, color = "#7CB342" }) {
  return (
    <View style={styles.listContainer}>
      {title && (
        <Text style={[styles.title, { color }]}>{title}</Text>
      )}
      <View style={styles.listItemsContainer}>
        {items.map((item, index) => (
          <View key={index} style={styles.listItemContainer}>
            <View style={[styles.marker, { backgroundColor: color }]} />
            <Text style={styles.listItem}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginBottom: 12,
    color: "#f0f0f0",
  },
  listItemsContainer: {
    marginLeft: 4,
  },
  listItemContainer: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "flex-start",
  },
  marker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
    marginTop: 9,
  },
  listItem: {
    fontSize: 16,
    color: "#e0e0e0",
    lineHeight: 24,
    flex: 1,
    letterSpacing: 0.2,
  },
});
