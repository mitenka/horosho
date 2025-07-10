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
import { useData } from "../../contexts/DataContext";

/**
 * AddBehaviorModal component - bottom sheet interface for adding new behaviors
 * with suggestion bubbles and type selection.
 */
const AddBehaviorModal = ({ visible, onClose }) => {
  const { addBehavior } = useData();
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
    setName(suggestion);
  }, []);

  // Suggestion bubbles organized by categories
  const behaviorSuggestions = useMemo(() => {
    return [
      // life_threatening - Жизнеугрожающие поведения
      { name: "Суицидальные попытки", category: "life_threatening" },
      { name: "Самоповреждения", category: "life_threatening" },
      { name: "Передозировка", category: "life_threatening" },
      { name: "Суицидальные угрозы", category: "life_threatening" },

      // therapy_interfering - Мешающие терапии поведения
      { name: "Пропуск сессий", category: "therapy_interfering" },
      { name: "Опоздания на терапию", category: "therapy_interfering" },
      {
        name: "Невыполнение домашних заданий",
        category: "therapy_interfering",
      },
      { name: "Ложь терапевту", category: "therapy_interfering" },
      { name: "Отказ от сотрудничества", category: "therapy_interfering" },

      // substance_use - Употребление веществ
      { name: "Злоупотребление алкоголем", category: "substance_use" },
      { name: "Употребление наркотиков", category: "substance_use" },
      { name: "Превышение дозировки лекарств", category: "substance_use" },
      { name: "Смешивание веществ", category: "substance_use" },

      // interpersonal - Межличностные поведения
      { name: "Агрессия к другим", category: "interpersonal" },
      { name: "Избегание людей", category: "interpersonal" },
      { name: "Навязывание себя", category: "interpersonal" },
      { name: "Манипулирование", category: "interpersonal" },
      { name: "Нарушение границ", category: "interpersonal" },
      { name: "Провокация конфликтов", category: "interpersonal" },

      // impulsive - Импульсивные поведения
      { name: "Импульсивные траты", category: "impulsive" },
      { name: "Беспорядочные половые связи", category: "impulsive" },
      { name: "Агрессивное вождение", category: "impulsive" },
      { name: "Срывы в работе/учебе", category: "impulsive" },
      { name: "Импульсивные решения", category: "impulsive" },
      { name: "Разрушение имущества", category: "impulsive" },

      // eating - Нарушения пищевого поведения
      { name: "Переедание", category: "eating" },
      { name: "Голодание", category: "eating" },
      { name: "Очищение/рвота", category: "eating" },
      { name: "Компульсивное переедание", category: "eating" },
      { name: "Использование слабительных", category: "eating" },

      // avoidance - Избегающие поведения
      { name: "Социальная изоляция", category: "avoidance" },
      { name: "Избегание ответственности", category: "avoidance" },
      { name: "Прокрастинация", category: "avoidance" },
      { name: "Избегание проблем", category: "avoidance" },
      { name: "Отказ от помощи", category: "avoidance" },

      // self_harm - Самоповреждающие поведения (не суицидальные)
      { name: "Порезы", category: "self_harm" },
      { name: "Удары о стену", category: "self_harm" },
      { name: "Царапание до крови", category: "self_harm" },
      { name: "Выдергивание волос", category: "self_harm" },
      { name: "Обжигание себя", category: "self_harm" },

      // daily_functioning - Нарушения повседневного функционирования
      { name: "Нарушение гигиены", category: "daily_functioning" },
      { name: "Нарушение сна", category: "daily_functioning" },
      {
        name: "Игнорирование медицинских назначений",
        category: "daily_functioning",
      },
      { name: "Нарушение режима питания", category: "daily_functioning" },
      { name: "Пренебрежение домашними делами", category: "daily_functioning" },

      // emotional_behaviors - Дисфункциональные эмоциональные поведения
      { name: "Вспышки гнева", category: "emotional_behaviors" },
      { name: "Неконтролируемый плач", category: "emotional_behaviors" },
      { name: "Крики и ругань", category: "emotional_behaviors" },
      { name: "Эмоциональные срывы", category: "emotional_behaviors" },
      { name: "Истерики", category: "emotional_behaviors" },
    ];
  }, []);

  // Get color for a category
  const getCategoryColor = useCallback((category) => {
    switch (category) {
      case "life_threatening":
        return "#EC407A"; // deep pink (urgent)
      case "therapy_interfering":
        return "#FFC107"; // orange
      case "substance_use":
        return "#FF9800"; // orange-red
      case "self_harm":
        return "#E53935"; // pink
      case "impulsive":
        return "#F57C00"; // orange
      case "eating":
        return "#F2C464"; // yellow
      case "interpersonal":
        return "#64B5F6"; // blue-grey
      case "avoidance":
        return "#FF5252"; // bright pink (readable on #3a3a5e background)
      case "daily_functioning":
        return "#2196F3"; // indigo
      case "emotional_behaviors":
        return "#66BB6A"; // green
      default:
        return "#999999"; // grey
    }
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
            <View style={styles.suggestionsFlexWrap}>
              {behaviorSuggestions.map((suggestion, index) => {
                const categoryColor = getCategoryColor(suggestion.category);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.suggestionBubble,
                      { borderColor: `${categoryColor}60` }, // Adding 60 for transparency
                    ]}
                    onPress={() => handleSelectSuggestion(suggestion.name)}
                  >
                    <Text
                      style={[styles.suggestionText, { color: categoryColor }]}
                    >
                      {suggestion.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
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
  suggestionsFlexWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  suggestionBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    margin: 2,
    marginVertical: 4,
    position: "relative",
    minHeight: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionText: {
    fontSize: 13,
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
