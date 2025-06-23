import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Quote({ text, author, color = "#7CB342" }) {
  const backgroundColor = "rgba(45, 45, 65, 0.6)";

  return (
    <View
      style={[
        styles.quoteContainer,
        {
          backgroundColor,
          borderLeftColor: color,
          borderLeftWidth: 8,
        },
      ]}
    >
      <View style={styles.quoteContent}>
        <View style={styles.quoteIconContainer}>
          <View
            style={[styles.iconBackground, { backgroundColor: `${color}30` }]}
          >
            <Ionicons name="chatbubble-ellipses" size={22} color={color} />
          </View>
        </View>
        <Text style={styles.quoteText}>{text}</Text>
        {author && (
          <Text style={[styles.quoteAuthor, { color: `${color}E0` }]}>
            — {author}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quoteContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    flexDirection: "row",
  },
  quoteContent: {
    flex: 1,
    padding: 20,
  },
  quoteIconContainer: {
    marginBottom: 16,
    alignItems: "flex-start",
  },
  iconBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 26,
    fontStyle: "italic",
    color: "#ffffff",
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 16,
    textAlign: "right",
    fontWeight: "600",
    letterSpacing: 0.3,
    marginTop: 4,
  },
});
