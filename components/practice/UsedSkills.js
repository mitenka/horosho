import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useData } from "../../contexts/DataContext";
import {
  getAvailableSkills,
  getUsedSkills,
  saveUsedSkills,
} from "../../services/dataService";
import { formatDateToString } from "../../utils/dateUtils";

const UsedSkills = () => {
  const { selectedDate } = useData();
  const [usedSkillsList, setUsedSkillsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableSkills, setAvailableSkills] = useState({});
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selectedSkillInfo, setSelectedSkillInfo] = useState(null);

  const dateString = formatDateToString(selectedDate);

  // База данных описаний навыков ДПТ
  const skillDescriptions = {
    "**Мудрый разум**":
      "Состояние ума, которое объединяет эмоциональный и рациональный разум. Это способность принимать решения, учитывая как чувства, так и логику, находя баланс между ними.",
    "**Наблюдение:** замечать":
      "Навык осознанного наблюдения за своими мыслями, чувствами, ощущениями и окружающей средой без попыток их изменить или оценить.",
    "**Описание:** добавлять слова, только факты":
      "Способность описывать происходящее словами, придерживаясь только фактов без интерпретаций, суждений или эмоциональных оценок.",
    "**Участие:** погружаться в происходящее":
      "Полное погружение в текущую деятельность, становление единым целым с тем, что вы делаете, без самосознания или отвлечений.",
    "**Безоценочность**":
      "Наблюдение и описание без добавления суждений о том, хорошо это или плохо, правильно или неправильно. Принятие реальности такой, какая она есть.",
    "**Однонаправленность:** здесь и сейчас":
      "Фокусировка внимания на одной вещи в текущий момент, полное присутствие в настоящем без блуждания ума в прошлое или будущее.",
    "**Эффективность:** фокусировка на том, что работает":
      "Концентрация на действиях и стратегиях, которые помогают достичь ваших целей, а не на том, что кажется «правильным» или «справедливым».",

    "**Проверка фактов**":
      "Техника определения того, соответствует ли ваша эмоциональная реакция фактам ситуации. Помогает различить обоснованные и необоснованные эмоции.",
    "**Противоположное действие**":
      "Когда эмоция не соответствует фактам или не эффективна, действовать противоположно тому, к чему побуждает эмоция.",
    "**Решение проблемы**":
      "Активные шаги по изменению ситуации, вызывающей болезненные эмоции, когда эмоция соответствует фактам и изменения возможны.",
    "**A:** позитивные эмоции":
      "Накопление позитивных эмоций в краткосрочной и долгосрочной перспективе через приятные активности и достижение целей.",
    "**B:** мастерство":
      "Развитие навыков и компетенций, которые повышают самооценку и уверенность в себе.",
    "**C:** заблаговременный поиск решений":
      "Подготовка к сложным ситуациям заранее, разработка планов действий для потенциальных проблем.",
    "**PLEASE:** снижение уязвимости":
      "Забота о физическом здоровье: лечение болезней, сбалансированное питание, избегание наркотиков, достаточный сон, физические упражнения.",
    "**Осознанное отношение к текущей эмоции**":
      "Наблюдение и принятие своих эмоций без попыток их подавить или усилить, позволяя им естественно протекать.",

    "**СТОП:** остановись":
      "Техника экстренного реагирования: Стоп, Сделай шаг назад, Осмотрись, Продолжи осознанно. Помогает избежать импульсивных действий.",
    "**За и против**":
      "Взвешивание преимуществ и недостатков толерантности к дистрессу против действий на основе кризисных побуждений.",
    "**Физиологические методы (ТРУД):** холодная вода, интенсивная физнагрузка, медленное дыхание, сканирование и расслабление тела":
      "Быстрые способы изменения химии тела для снижения интенсивности эмоций через физиологическое воздействие.",
    "**ACCEPTS:** отвлечение":
      "Техники отвлечения: Активности, Вклад в других, Сравнения, Эмоции (противоположные), Отталкивание, Мысли (другие), Ощущения (интенсивные).",
    "**Пять органов чувств:** забота о себе":
      "Самоуспокоение через приятные ощущения для каждого из пяти органов чувств: зрение, слух, обоняние, вкус, осязание.",
    "**IMPROVE:** улучшить момент":
      "Техники улучшения болезненного момента: Образы, Молитва/медитация, Релаксация, Одно дело за раз, Отпуск, Воодушевление, Смысл.",
    "**Радикальное принятие**":
      "Полное принятие реальности такой, какая она есть, без борьбы против нее. Это не одобрение, а прекращение борьбы с неизменным.",
    "**Готовность, полуулыбка, раскрытые ладони**":
      "Физические позы, которые помогают принять реальность: готовность к опыту, мягкое выражение лица, открытые жесты.",
    "**Осознанное отношение к текущим мыслям**":
      "Наблюдение за своими мыслями как за ментальными событиями, не принимая их автоматически за истину или руководство к действию.",

    "**DEAR:** объективная эффективность":
      "Техника просьб и отказов: Описать ситуацию, Выразить чувства, Утвердить потребности, Подкрепить последствиями.",
    "**MAN:** осознанность в достижении цели":
      "Поддержание фокуса на цели: быть Осознанным, Появляться уверенно, Не извиняться за разумные просьбы.",
    "**GIVE:** эффективность отношений":
      "Поддержание отношений: быть Мягким, Интересоваться другим, Валидировать, Использовать легкую манеру общения.",
    "**FAST:** эффективность самоуважения":
      "Сохранение самоуважения: быть Справедливым к себе, не Извиняться чрезмерно, Придерживаться ценностей, быть Правдивым.",
    "**Валидация**":
      "Признание и принятие чувств, мыслей или поведения как понятных в контексте ситуации человека, даже если вы не согласны.",
    "**Стратегии изменения поведения**":
      "Методы влияния на поведение других: подкрепление желаемого поведения, игнорирование нежелательного, наказание в крайних случаях.",
  };

  // Load available skills on component mount
  useEffect(() => {
    const skills = getAvailableSkills();
    setAvailableSkills(skills);
  }, []);

  // Load used skills when date changes
  useEffect(() => {
    const loadUsedSkills = async () => {
      setIsLoading(true);
      try {
        const skills = await getUsedSkills(dateString);
        setUsedSkillsList(skills);
      } catch (error) {
        console.error("Error loading used skills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsedSkills();
  }, [dateString]);

  const handleSkillToggle = async (skillName) => {
    const newUsedSkills = usedSkillsList.includes(skillName)
      ? usedSkillsList.filter((skill) => skill !== skillName)
      : [...usedSkillsList, skillName];

    // Optimistic update
    setUsedSkillsList(newUsedSkills);

    try {
      await saveUsedSkills(dateString, newUsedSkills);
    } catch (error) {
      console.error("Error saving used skills:", error);
      // Revert on error
      setUsedSkillsList(usedSkillsList);
    }
  };

  const handleSkillLongPress = (skillName) => {
    const description = skillDescriptions[skillName];
    if (description) {
      // Убираем звездочки из названия для отображения в тултипе
      const cleanName = skillName.replace(/\*\*/g, "");
      setSelectedSkillInfo({ name: cleanName, description });
      setTooltipVisible(true);
    }
  };

  const getCategoryColor = (categoryKey) => {
    switch (categoryKey) {
      case "mindfulness":
        return "#4CAF50"; // bright green
      case "interpersonal":
        return "#2196F3"; // bright blue
      case "emotionRegulation":
        return "#FF9800"; // bright orange
      case "stressTolerance":
        return "#CE93D8"; // lighter purple
      default:
        return "#9E9E9E"; // fallback grey (should not be used)
    }
  };

  // Parse markdown-style bold text
  const parseMarkdownText = (text) => {
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the bold part
      if (match.index > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, match.index),
          bold: false,
        });
      }

      // Add the bold part
      parts.push({
        text: match[1],
        bold: true,
      });

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        bold: false,
      });
    }

    return parts.length > 0 ? parts : [{ text, bold: false }];
  };

  const renderSkillItem = (skill, categoryKey) => {
    const isSelected = usedSkillsList.includes(skill);
    const categoryColor = getCategoryColor(categoryKey);
    const textParts = parseMarkdownText(skill);

    return (
      <TouchableOpacity
        key={skill}
        style={[
          styles.skillItem,
          isSelected && {
            ...styles.skillItemSelected,
            backgroundColor: `${categoryColor}15`, // 15 = 8.5% opacity
            borderColor: `${categoryColor}4D`, // 4D = 30% opacity
          },
        ]}
        onPress={() => handleSkillToggle(skill)}
        onLongPress={() => handleSkillLongPress(skill)}
        activeOpacity={0.7}
      >
        <Text style={styles.skillText}>
          {textParts.map((part, index) => (
            <Text
              key={index}
              style={[
                part.bold && styles.boldText,
                isSelected && { color: categoryColor },
              ]}
            >
              {part.text}
            </Text>
          ))}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategory = (categoryKey, categoryData) => {
    const categoryColor = getCategoryColor(categoryKey);

    return (
      <View key={categoryKey} style={styles.categoryContainer}>
        <Text style={[styles.categoryTitle, { color: categoryColor }]}>
          {categoryData.title}
        </Text>
        <View style={styles.skillsList}>
          {categoryData.skills.map((skill) =>
            renderSkillItem(skill, categoryKey)
          )}
        </View>
      </View>
    );
  };

  const closeTooltip = () => {
    setTooltipVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Использованные за день навыки</Text>
        <Text style={[styles.subtitle, { marginBottom: 8 }]}>
          Долгое нажатие — подсказка о навыке
        </Text>
      </View>

      {Object.entries(availableSkills).map(([categoryKey, categoryData]) =>
        renderCategory(categoryKey, categoryData)
      )}

      <Modal
        visible={tooltipVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeTooltip}
      >
        <TouchableOpacity
          style={styles.tooltipOverlay}
          activeOpacity={1}
          onPress={closeTooltip}
        >
          <TouchableOpacity
            style={styles.tooltipContent}
            activeOpacity={1}
            onPress={() => {}} // Предотвращаем закрытие при тапе на контент
          >
            <Text style={styles.tooltipTitle}>{selectedSkillInfo?.name}</Text>
            <Text style={styles.tooltipDescription}>
              {selectedSkillInfo?.description}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
    letterSpacing: 0.4,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.6,
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  skillsList: {
    gap: 10,
  },
  skillItem: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skillItemSelected: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  skillText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
    lineHeight: 22,
    textAlign: "left",
  },
  boldText: {
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  tooltipOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  tooltipContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  tooltipDescription: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
});

export default UsedSkills;
