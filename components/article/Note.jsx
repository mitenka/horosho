import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Note({ text }) {
  return (
    <View style={styles.noteContainer}>
      <View style={styles.noteContent}>
        <Text style={styles.noteText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    marginVertical: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#0078D7",
  },
  noteContent: {
    padding: 20,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderStyle: "dashed",
    margin: 4,
    borderRadius: 12,
  },
  noteText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: "#FFFFFF",
    textAlign: "left",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
