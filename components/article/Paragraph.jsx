import React from "react";
import { StyleSheet, Text } from "react-native";

export default function Paragraph({ text }) {
  return <Text style={styles.paragraph}>{text}</Text>;
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 17,
    color: "#e0e0e0",
    lineHeight: 26,
    marginBottom: 26,
    letterSpacing: 0.3,
  },
});
