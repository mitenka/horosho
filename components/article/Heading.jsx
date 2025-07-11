import React from "react";
import { StyleSheet, Text } from "react-native";

export default function Heading({ text }) {
  return <Text style={styles.heading}>{text}</Text>;
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f0f0f0",
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
});
