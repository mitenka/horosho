import { StyleSheet } from "react-native";

export const behaviorSuggestions = [
  // therapy_interfering - Мешающие терапии поведения
  { name: "Пропуск сессии", category: "therapy_interfering" },

  // life_threatening - Жизнеугрожающие поведения
  { name: "Самоповреждения", category: "life_threatening" },
  { name: "Суицидальные попытки", category: "life_threatening" },
  { name: "Суицидальные угрозы", category: "life_threatening" },

  // substance_use - Употребление веществ
  { name: "Злоупотребление алкоголем", category: "substance_use" },
  { name: "Употребление наркотиков", category: "substance_use" },

  // interpersonal - Межличностные поведения
  { name: "Ложь", category: "interpersonal" },
  { name: "Агрессия", category: "interpersonal" },
  { name: "Провокация конфликтов", category: "interpersonal" },

  // impulsive - Импульсивные поведения
  { name: "Импульсивные траты", category: "impulsive" },
  { name: "Беспорядочные половые связи", category: "impulsive" },
  { name: "Агрессивное вождение", category: "impulsive" },

  // eating - Нарушения пищевого поведения
  { name: "Переедание", category: "eating" },
  { name: "Голодание", category: "eating" },
  { name: "Очищение", category: "eating" },

  // emotional_behaviors - Дисфункциональные эмоциональные поведения
  { name: "Вспышки гнева", category: "emotional_behaviors" },
  { name: "Неконтролируемый плач", category: "emotional_behaviors" },
  { name: "Крики и ругань", category: "emotional_behaviors" },
];

/**
 * Get color for a behavior category
 * @param {string} category - The behavior category
 * @returns {string} - The color hex code
 */
export const getCategoryColor = (category) => {
  switch (category) {
    case "life_threatening":
      return "#E91E63"; // vibrant pink (urgent)
    case "therapy_interfering":
      return "#FF9800"; // bright orange
    case "substance_use":
      return "#9C27B0"; // bright purple
    case "impulsive":
      return "#F44336"; // bright red
    case "eating":
      return "#00BCD4"; // cyan
    case "interpersonal":
      return "#8BC34A"; // lime green
    case "daily_functioning":
      return "#FFEB3B"; // yellow
    case "emotional_behaviors":
      return "#4CAF50"; // bright green
    default:
      return "#9E9E9E"; // medium grey
  }
};

/**
 * Styles related to behavior suggestions
 */
export const suggestionStyles = StyleSheet.create({
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 4,
  },
  suggestionBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingLeft: 10,
    margin: 4,
    marginLeft: 3,
    borderRadius: 18,
  },
  suggestionText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});
