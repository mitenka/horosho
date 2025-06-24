import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Quote({ text, author, color = "#7CB342" }) {
  return (
    <View
      style={[
        styles.quoteContainer,
        {
          borderLeftColor: color,
        },
      ]}
    >
      <View style={styles.quoteContent}>
        <Text style={styles.quoteText}>{text}</Text>
        {author && (
          <Text style={[styles.quoteAuthor, { color }]}>
            — {author}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quoteContainer: {
    marginBottom: 24,
    borderLeftWidth: 3,
    flexDirection: "row",
    paddingLeft: 16,
  },
  quoteContent: {
    flex: 1,
  },
  quoteText: {
    fontSize: 17,
    lineHeight: 26,
    fontStyle: "italic",
    color: "#e0e0e0",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 15,
    textAlign: "right",
    fontWeight: "600",
    letterSpacing: 0.3,
    marginTop: 4,
  },
});
