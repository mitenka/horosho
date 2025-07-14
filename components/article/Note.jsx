import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Note({ text, color = "#0078D7" }) {
  return (
    <View style={styles.noteContainer}>
      <View
        style={[
          styles.noteWrapper,
          { borderColor: `rgba(255, 255, 255, 0.6)` },
        ]}
      >
        <View style={styles.noteContent}>
          <Text style={[styles.noteText, { color }]}>{text}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    marginBottom: 28,
  },
  noteWrapper: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noteContent: {
    padding: 18,
    backgroundColor: "rgba(45, 45, 65, 0.5)",
    borderRadius: 10,
  },
  noteText: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
