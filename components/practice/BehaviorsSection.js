import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useData } from "../../contexts/DataContext";
import {
  getBehaviorEntry,
  removeBehaviorEntry,
  saveBehaviorEntry,
} from "../../services/dataService";
import { formatDateToString } from "../../utils/dateUtils";
import AddBehaviorModal from "./AddBehaviorModal";

const BehaviorsSection = ({ selectedDate }) => {
  const { behaviors, deleteBehavior } = useData();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [behaviorEntries, setBehaviorEntries] = useState({});

  // Load behavior entries for the selected date
  useEffect(() => {
    const loadBehaviorEntries = async () => {
      if (!selectedDate || !behaviors.length) return;

      const dateString = formatDateToString(selectedDate);
      const entries = {};

      for (const behavior of behaviors) {
        const entry = await getBehaviorEntry(dateString, behavior.id);
        if (entry) {
          entries[behavior.id] = {
            desire: entry.desire,
            action: entry.action,
          };
        }
      }

      setBehaviorEntries(entries);
    };

    loadBehaviorEntries();
  }, [selectedDate, behaviors]);

  const handleDeleteBehavior = async (behaviorId, behaviorName) => {
    Alert.alert(
      "Удалить поведение",
      `Вы уверены, что хотите удалить "${behaviorName}"?`,
      [
        {
          text: "Отмена",
          style: "cancel",
        },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteBehavior(behaviorId);
            } catch (error) {
              console.error("Error deleting behavior:", error);
              Alert.alert("Ошибка", "Не удалось удалить поведение");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleDesireChange = async (behaviorId, value) => {
    const dateString = formatDateToString(selectedDate);
    const behavior = behaviors.find((b) => b.id === behaviorId);
    const currentEntry = behaviorEntries[behaviorId] || {};

    // If same value is selected, remove it (toggle behavior)
    const newDesire = currentEntry.desire === value ? undefined : value;
    const newAction = currentEntry.action;

    // Update local state
    const newEntries = { ...behaviorEntries };
    if (newDesire !== undefined || newAction !== undefined) {
      newEntries[behaviorId] = { desire: newDesire, action: newAction };
    } else {
      delete newEntries[behaviorId];
    }
    setBehaviorEntries(newEntries);

    // Save to storage
    if (newDesire !== undefined || newAction !== undefined) {
      await saveBehaviorEntry(dateString, behaviorId, {
        name: behavior.name,
        type: behavior.type,
        desire: newDesire,
        action: newAction,
      });
    } else {
      await removeBehaviorEntry(dateString, behaviorId);
    }
  };

  const handleActionChange = async (behaviorId, value) => {
    const dateString = formatDateToString(selectedDate);
    const behavior = behaviors.find((b) => b.id === behaviorId);
    const currentEntry = behaviorEntries[behaviorId] || {};

    // If same value is selected, remove it (toggle behavior)
    const newAction = currentEntry.action === value ? undefined : value;
    const newDesire = currentEntry.desire;

    // Update local state
    const newEntries = { ...behaviorEntries };
    if (newDesire !== undefined || newAction !== undefined) {
      newEntries[behaviorId] = { desire: newDesire, action: newAction };
    } else {
      delete newEntries[behaviorId];
    }
    setBehaviorEntries(newEntries);

    // Save to storage
    if (newDesire !== undefined || newAction !== undefined) {
      await saveBehaviorEntry(dateString, behaviorId, {
        name: behavior.name,
        type: behavior.type,
        desire: newDesire,
        action: newAction,
      });
    } else {
      await removeBehaviorEntry(dateString, behaviorId);
    }
  };

  const renderDesireScale = (behaviorId) => {
    const currentDesire = behaviorEntries[behaviorId]?.desire;

    return (
      <View style={styles.scaleContainer}>
        <Text style={styles.scaleLabel}>Выраженность желания</Text>
        <View style={styles.scaleButtons}>
          {[0, 1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.scaleButton,
                currentDesire === value && styles.scaleButtonActive,
              ]}
              onPress={() => handleDesireChange(behaviorId, value)}
            >
              <Text
                style={[
                  styles.scaleButtonText,
                  currentDesire === value && styles.scaleButtonTextActive,
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

  const renderActionControl = (behaviorId, behaviorType) => {
    const currentAction = behaviorEntries[behaviorId]?.action;

    if (behaviorType === "boolean") {
      return (
        <View style={styles.scaleContainer}>
          <Text style={styles.scaleLabel}>Действие</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                currentAction === false && styles.actionButtonActive,
              ]}
              onPress={() => handleActionChange(behaviorId, false)}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  currentAction === false && styles.actionButtonTextActive,
                ]}
              >
                ✗
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                currentAction === true && styles.actionButtonActive,
              ]}
              onPress={() => handleActionChange(behaviorId, true)}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  currentAction === true && styles.actionButtonTextActive,
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
                style={[
                  styles.scaleButton,
                  currentAction === value && styles.scaleButtonActive,
                ]}
                onPress={() => handleActionChange(behaviorId, value)}
              >
                <Text
                  style={[
                    styles.scaleButtonText,
                    currentAction === value && styles.scaleButtonTextActive,
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

  // Empty state content
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Добавьте поведения, которые вы хотите отслеживать в своей карточке.
      </Text>
      <Ionicons
        name="clipboard-outline"
        size={48}
        color="rgba(255, 255, 255, 0.3)"
        style={styles.emptyIcon}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Add behavior button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Добавить</Text>
      </TouchableOpacity>

      {/* Behaviors list */}
      <View style={styles.listContent}>
        {behaviors.length > 0
          ? behaviors.map((item) => (
              <View key={item.id} style={styles.behaviorItem}>
                <View style={styles.behaviorHeader}>
                  <Text style={styles.behaviorName}>{item.name}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteBehavior(item.id, item.name)}
                    disabled={isDeleting}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                  </TouchableOpacity>
                </View>

                {renderDesireScale(item.id)}
                {renderActionControl(item.id, item.type)}
              </View>
            ))
          : renderEmptyComponent()}
      </View>
      <AddBehaviorModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  listContent: {
    paddingBottom: 12,
  },
  behaviorItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  behaviorInfo: {
    flex: 1,
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 10,
  },
  behaviorName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.3,
  },
  behaviorType: {
    fontSize: 15,
    color: "#cccccc",
    marginTop: 4,
    letterSpacing: 0.2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff3b30",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 16,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  emptyContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
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

export default BehaviorsSection;
