import React from "react";
import { StyleSheet, Text } from "react-native";

export default function Paragraph({ text }) {
  return <Text style={styles.paragraph}>{text}</Text>;
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 16,
    color: "#e0e0e0",
    lineHeight: 24,
    marginBottom: 16,
    letterSpacing: 0.2,
  },
});
