import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useData } from "../../contexts/DataContext";
import {
  behaviorSuggestions,
  getCategoryColor,
  suggestionStyles,
} from "./behaviorData";

/**
 * AddBehaviorModal component - bottom sheet interface for adding new behaviors
 * with suggestion bubbles and type selection.
 */
const AddBehaviorModal = ({ visible, onClose }) => {
  const { addBehavior, behaviors } = useData();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [type, setType] = useState("boolean"); // 'boolean' or 'scale'

  // Reset state when modal is opened/closed
  React.useEffect(() => {
    if (!visible) {
      setName("");
      setType("boolean");
    }
  }, [visible]);

  // Handle adding a new behavior
  const handleAddBehavior = useCallback(() => {
    if (name.trim()) {
      addBehavior({
        name: name.trim(),
        type: type,
      });
      onClose();
    }
  }, [name, type, addBehavior, onClose]);

  // Check if behavior name already exists
  const isDuplicate = useMemo(() => {
    if (!name.trim()) return false;
    return behaviors.some(
      (behavior) =>
        behavior.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
  }, [name, behaviors]);

  // Check if add button should be enabled
  const isAddEnabled = useMemo(
    () => name.trim().length > 0 && !isDuplicate,
    [name, isDuplicate]
  );

  // Select a suggested behavior
  const handleSelectSuggestion = useCallback((suggestion) => {
    // Using behavior suggestions imported from behaviorData.js
    setName(suggestion);
  }, []);

  // Функции для группировки по категориям были удалены для упрощения кода

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Добавить поведение</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Fixed top area */}
        <View style={styles.fixedTopArea}>
          {/* Behavior name input with clear button */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Введите название поведения"
              value={name}
              onChangeText={setName}
              autoCorrect={false}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
            {name.length > 0 && (
              <TouchableOpacity
                onPress={() => setName("")}
                style={styles.clearButton}
              >
                <Ionicons
                  name="close-circle"
                  size={22}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Duplicate warning */}
          {isDuplicate && (
            <View style={styles.warningContainer}>
              <Ionicons name="warning" size={16} color="#ff9500" />
              <Text style={styles.warningText}>
                Поведение с таким названием уже существует
              </Text>
            </View>
          )}

          {/* Behavior type toggle */}
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "boolean" && styles.typeButtonActive,
              ]}
              onPress={() => setType("boolean")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === "boolean" && styles.typeButtonTextActive,
                ]}
              >
                Да или нет
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "scale" && styles.typeButtonActive,
              ]}
              onPress={() => setType("scale")}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === "scale" && styles.typeButtonTextActive,
                ]}
              >
                Шкала от 0 до 5
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable suggestions area */}
        <ScrollView
          style={styles.suggestionsScrollView}
          contentContainerStyle={styles.suggestionsScrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={suggestionStyles.suggestionsContainer}>
            {behaviorSuggestions.map((suggestion, index) => {
              const categoryColor = getCategoryColor(suggestion.category);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    suggestionStyles.suggestionBubble,
                    { backgroundColor: `${categoryColor}30` }, // Light background with 30% opacity
                  ]}
                  onPress={() => handleSelectSuggestion(suggestion.name)}
                >
                  <Text
                    style={suggestionStyles.suggestionText}
                    numberOfLines={2}
                  >
                    {suggestion.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View
          style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 8) }]}
        >
          <TouchableOpacity
            style={[
              styles.addButton,
              !isAddEnabled && styles.addButtonDisabled,
            ]}
            onPress={handleAddBehavior}
            disabled={!isAddEnabled}
          >
            <Text style={styles.addButtonText}>Добавить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#2d2d4a",
    // paddingTop is applied dynamically based on safe area insets
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.4,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  contentScroll: {
    flex: 1,
  },
  fixedTopArea: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 4,
  },
  suggestionsScrollView: {
    flex: 1,
  },
  suggestionsScrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 6,
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    marginBottom: 18,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  input: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  clearButton: {
    padding: 10,
    marginRight: 8,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  warningText: {
    color: "#ff9500",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
  typeToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 22,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#ff3b30",
  },
  typeButtonText: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 0.3,
  },
  typeButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  footer: {
    padding: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
  },
  addButton: {
    backgroundColor: "#ff3b30",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  addButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default AddBehaviorModal;
