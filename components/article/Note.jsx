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
    marginBottom: 24,
  },
  noteWrapper: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 6,
    padding: 2,
  },
  noteContent: {
    padding: 16,
    backgroundColor: "rgba(45, 45, 65, 0.4)",
    borderRadius: 4,
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
