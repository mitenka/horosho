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
    marginBottom: 28,
    borderLeftWidth: 4,
    flexDirection: "row",
    paddingLeft: 18,
    paddingVertical: 2,
  },
  quoteContent: {
    flex: 1,
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 28,
    fontStyle: "italic",
    color: "#e0e0e0",
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  quoteAuthor: {
    fontSize: 16,
    textAlign: "right",
    fontWeight: "600",
    letterSpacing: 0.3,
    marginTop: 6,
  },
});
