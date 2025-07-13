import { StyleSheet } from "react-native";

/**
 * Behavior suggestions organized by categories
 */
export const behaviorSuggestions = [
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
  { name: "Очищение", category: "eating" },
  { name: "Нарушение режима питания", category: "daily_functioning" },
  { name: "Пренебрежение домашними делами", category: "daily_functioning" },

  // emotional_behaviors - Дисфункциональные эмоциональные поведения
  { name: "Вспышки гнева", category: "emotional_behaviors" },
  { name: "Неконтролируемый плач", category: "emotional_behaviors" },
  { name: "Крики и ругань", category: "emotional_behaviors" },
  { name: "Эмоциональные срывы", category: "emotional_behaviors" },
  { name: "Истерики", category: "emotional_behaviors" },
];

/**
 * Get color for a behavior category
 * @param {string} category - The behavior category
 * @returns {string} - The color hex code
 */
export const getCategoryColor = (category) => {
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
};

/**
 * Styles related to behavior suggestions
 */
export const suggestionStyles = StyleSheet.create({
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
});
