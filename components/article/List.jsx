import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function List({ items }) {
  return (
    <View style={styles.listContainer}>
      {items.map((item, index) => (
        <View key={index} style={styles.listItemContainer}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listItem}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginBottom: 16,
  },
  listItemContainer: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  bullet: {
    fontSize: 16,
    color: "#e0e0e0",
    marginRight: 8,
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    color: "#e0e0e0",
    lineHeight: 24,
    flex: 1,
    letterSpacing: 0.2,
  },
});
