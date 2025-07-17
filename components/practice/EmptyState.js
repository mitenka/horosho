import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmptyState = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Нет поведений для отслеживания.{'\n'}
        Добавьте первое поведение, чтобы начать!
      </Text>
      <Ionicons
        name="clipboard-outline"
        size={48}
        color="rgba(255, 255, 255, 0.3)"
        style={styles.emptyIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  emptyText: {
    fontSize: 17,
    color: "#cccccc",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  emptyIcon: {
    marginTop: 18,
    opacity: 0.7,
  },
});

export default EmptyState;
