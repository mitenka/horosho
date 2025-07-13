import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  Keyboard,
  Modal,
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
  const { addBehavior } = useData();
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

  // Check if add button should be enabled
  const isAddEnabled = useMemo(() => name.trim().length > 0, [name]);

  // Select a suggested behavior
  const handleSelectSuggestion = useCallback((suggestion) => {
    // Using behavior suggestions imported from behaviorData.js
    setName(suggestion);
  }, []);

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Добавить поведение</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Fixed top area */}
          <View style={styles.fixedTopArea}>
            {/* Behavior name input */}
            <TextInput
              style={styles.input}
              placeholder="Введите название поведения"
              value={name}
              onChangeText={setName}
              autoCorrect={false}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />

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
            <View style={suggestionStyles.suggestionsFlexWrap}>
              {behaviorSuggestions.map((suggestion, index) => {
                const categoryColor = getCategoryColor(suggestion.category);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      suggestionStyles.suggestionBubble,
                      { borderColor: `${categoryColor}60` }, // Adding 60 for transparency
                    ]}
                    onPress={() => handleSelectSuggestion(suggestion.name)}
                  >
                    <Text
                      style={[
                        suggestionStyles.suggestionText,
                        { color: categoryColor },
                      ]}
                    >
                      {suggestion.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 8) },
            ]}
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    height: "95%",
    backgroundColor: "#3a3a5e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    overflow: "hidden",
    paddingTop: 64,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  closeButton: {
    padding: 4,
  },
  contentScroll: {
    flex: 1,
  },
  fixedTopArea: {
    padding: 8,
    paddingBottom: 0,
  },
  suggestionsScrollView: {
    flex: 1,
  },
  suggestionsScrollContainer: {
    padding: 8,
    paddingTop: 4,
    paddingBottom: 16,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    marginBottom: 8,
  },
  typeToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#ff3b30",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#ccc",
  },
  typeButtonTextActive: {
    color: "#fff",
    fontWeight: "500",
  },
  footer: {
    padding: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  addButton: {
    backgroundColor: "#ff3b30",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddBehaviorModal;
