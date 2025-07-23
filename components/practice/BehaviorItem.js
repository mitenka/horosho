import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const BehaviorItem = ({
  behavior,
  entry,
  onDesireChange,
  onActionChange,
  onDelete,
  isDeleting,
}) => {
  const handleDelete = () => {
    Alert.alert(
      "Удалить поведение",
      `Вы уверены, что хотите удалить "${behavior.name}"?`,
      [
        {
          text: "Отмена",
          style: "cancel",
        },
        {
          text: "Удалить",
          style: "destructive",
          onPress: () => onDelete(behavior.id, behavior.name),
        },
      ]
    );
  };

  const renderDesireScale = () => {
    return (
      <View style={styles.scaleContainer}>
        <Text style={styles.scaleLabel}>Желание</Text>
        <View style={styles.scaleButtons}>
          {[0, 1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              activeOpacity={0.8}
              style={[
                styles.scaleButton,
                entry?.desire === value && styles.scaleButtonActive,
              ]}
              onPress={() => onDesireChange(behavior.id, value)}
            >
              <Text
                style={[
                  styles.scaleButtonText,
                  entry?.desire === value && styles.scaleButtonTextActive,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderActionControl = () => {
    if (behavior.type === "boolean") {
      return (
        <View style={styles.actionContainer}>
          <Text style={styles.actionLabel}>Действие</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.actionButton,
                entry?.action === false && styles.actionButtonActive,
              ]}
              onPress={() => onActionChange(behavior.id, false)}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  entry?.action === false && styles.actionButtonTextActive,
                ]}
              >
                ✗
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.actionButton,
                entry?.action === true && styles.actionButtonActive,
              ]}
              onPress={() => onActionChange(behavior.id, true)}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  entry?.action === true && styles.actionButtonTextActive,
                ]}
              >
                ✓
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.scaleContainer}>
          <Text style={styles.scaleLabel}>Действие</Text>
          <View style={styles.scaleButtons}>
            {[0, 1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                activeOpacity={0.8}
                style={[
                  styles.scaleButton,
                  entry?.action === value && styles.scaleButtonActive,
                ]}
                onPress={() => onActionChange(behavior.id, value)}
              >
                <Text
                  style={[
                    styles.scaleButtonText,
                    entry?.action === value && styles.scaleButtonTextActive,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.behaviorItem}>
      <View style={styles.behaviorHeader}>
        <Text style={styles.behaviorName}>{behavior.name}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={isDeleting}
        >
          <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>

      {renderDesireScale()}
      {renderActionControl()}
    </View>
  );
};

const styles = StyleSheet.create({
  behaviorItem: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  behaviorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  behaviorName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.3,
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  scaleContainer: {
    marginBottom: 16,
  },
  scaleLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  scaleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  scaleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  scaleButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  scaleButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
  scaleButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  actionContainer: {
    marginBottom: 16,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 6,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  actionButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
  actionButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default BehaviorItem;
