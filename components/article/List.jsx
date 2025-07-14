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
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 0.4,
    marginBottom: 14,
    color: "#f0f0f0",
  },
  listItemsContainer: {
    marginLeft: 6,
  },
  listItemContainer: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-start",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 14,
    marginTop: 9,
  },
  listItem: {
    fontSize: 17,
    color: "#e0e0e0",
    lineHeight: 26,
    flex: 1,
    letterSpacing: 0.3,
  },
});
