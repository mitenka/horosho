import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useData } from "../../contexts/DataContext";
import {
  getBehaviorEntry,
  removeBehaviorEntry,
  saveBehaviorEntry,
} from "../../services/dataService";
import { formatDateToString } from "../../utils/dateUtils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddBehaviorModal from "./AddBehaviorModal";

const BehaviorsSection = ({ selectedDate }) => {
  const { behaviors, deleteBehavior } = useData();
  const insets = useSafeAreaInsets();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDays, setExportDays] = useState(7);
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
      {/* Action buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Добавить</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.exportButtonMain}
          onPress={() => setShowExportModal(true)}
        >
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.exportButtonText}>Экспорт</Text>
        </TouchableOpacity>
      </View>

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
      
      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={[
          styles.exportModalContainer,
          { paddingTop: insets.top + 10 },
        ]}>
          <View style={styles.exportModalHeader}>
            <Text style={styles.exportModalTitle}>Экспорт данных</Text>
            <TouchableOpacity
              style={styles.exportModalCloseButton}
              onPress={() => setShowExportModal(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.exportModalContent}>
            <Text style={styles.exportModalLabel}>Количество дней для экспорта</Text>
            
            <View style={styles.daySelector}>
              {[3, 7, 14, 30].map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.daySelectorButton,
                    exportDays === days && styles.daySelectorButtonActive,
                  ]}
                  onPress={() => setExportDays(days)}
                >
                  <Text
                    style={[
                      styles.daySelectorButtonText,
                      exportDays === days && styles.daySelectorButtonTextActive,
                    ]}
                  >
                    {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={[
            styles.exportModalFooter,
            { paddingBottom: Math.max(insets.bottom, 8) },
          ]}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => {
                // TODO: Implement export logic
                console.log(`Exporting ${exportDays} days of data`);
                setShowExportModal(false);
              }}
            >
              <Text style={styles.exportButtonText}>Экспортировать</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  behaviorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  scaleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  scaleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
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
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
  scaleButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  actionContainer: {
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  addButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff3b30",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  exportButtonMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 0.3,
  },
  exportButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 0.3,
  },
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
  exportModalContainer: {
    flex: 1,
    backgroundColor: "#2d2d4a",
  },
  exportModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  exportModalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.3,
  },
  exportModalCloseButton: {
    padding: 8,
    borderRadius: 20,
  },
  exportModalContent: {
    flex: 1,
    padding: 12,
    paddingBottom: 4,
  },
  exportModalLabel: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  daySelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  daySelectorButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  daySelectorButtonActive: {
    backgroundColor: "#ff3b30",
  },
  daySelectorButtonText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 0.3,
  },
  daySelectorButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  exportModalFooter: {
    padding: 14,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
  },
  exportButton: {
    backgroundColor: "#ff3b30",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default BehaviorsSection;
