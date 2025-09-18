import * as Haptics from "expo-haptics";
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
      "Состояние ума, которое объединяет логическое мышление и эмоции. Это способность принимать мудрые решения, учитывая как факты, так и свои чувства, находя баланс между «головой» и «сердцем». Мудрый разум помогает действовать осознанно, а не импульсивно или чрезмерно рационально.",
    "**Наблюдение:** замечать":
      "Навык осознанного наблюдения за своими мыслями, чувствами, телесными ощущениями и тем, что происходит вокруг. Это как быть «свидетелем» своего опыта, не пытаясь его изменить, оценить или избежать. Наблюдение — основа всех навыков осознанности.",
    "**Описание:** добавлять слова, только факты":
      "Умение описывать то, что вы наблюдаете, используя только факты без интерпретаций и оценок. Например, вместо «он злится на меня» сказать «он говорит громким голосом и хмурится». Это помогает отделить реальность от наших домыслов и предположений.",
    "**Участие:** погружаться в происходящее":
      "Полное включение в текущую деятельность, «растворение» в том, что вы делаете. Это противоположность «автопилоту» — когда вы осознанно участвуете в жизни, а не просто «присутствуете телом». Участие помогает получать максимум от каждого момента.",
    "**Безоценочность**":
      "Отношение к опыту без автоматических суждений «хорошо-плохо», «правильно-неправильно». Это не означает отсутствие мнения, а скорее осознанный выбор — оценивать или просто принимать то, что есть. Безоценочность снижает страдания от борьбы с реальностью.",
    "**Однонаправленность:** здесь и сейчас":
      "Способность фокусировать внимание на одном объекте в настоящий момент. Это противоположность многозадачности — когда вы полностью присутствуете в том, что делаете сейчас, не «блуждая» мыслями в прошлое или будущее.",
    "**Эффективность:** фокусировка на том, что работает":
      "Выбор действий исходя из того, что помогает достичь ваших целей, а не из принципов «как должно быть» или «что справедливо». Эффективность означает гибкость в выборе средств ради достижения важных для вас результатов.",

    "**Проверка фактов**":
      "Техника определения того, соответствует ли ваша эмоциональная реакция реальным фактам ситуации. Включает вопросы: «Что именно произошло?», «Какова вероятность того, чего я боюсь?», «Что бы сказал беспристрастный наблюдатель?». Помогает отделить обоснованные эмоции от тех, что основаны на домыслах.",
    "**Противоположное действие**":
      "Когда эмоция не соответствует фактам или её интенсивность мешает вашим целям, нужно действовать полностью противоположно тому, к чему эмоция побуждает. Например, при необоснованном страхе — приближаться к пугающему объекту, при неоправданной вине — не извиняться. Важно делать это «всем телом» — изменяя позу, выражение лица, мысли.",
    "**Решение проблемы**":
      "Активные шаги по изменению ситуации, которая вызывает болезненные, но обоснованные эмоции. Включает определение проблемы, поиск вариантов решения, выбор наилучшего варианта и его выполнение. Применяется только когда эмоция соответствует фактам и ситуацию можно изменить.",
    "**A:** позитивные эмоции":
      "Создание «подушки безопасности» из положительных переживаний на двух уровнях: ежедневное включение приятных активностей (любимый чай, встречи с друзьями, хобби) и движение к жизни, соответствующей вашим глубинным ценностям и долгосрочным целям. Краткосрочные радости дают энергию на каждый день, долгосрочные — глубокий смысл и удовлетворение от жизни.",
    "**B:** мастерство":
      "Регулярные занятия деятельностью, в которой вы можете совершенствоваться и чувствовать свою компетентность. Это может быть хобби, профессиональный навык, спорт — главное, чтобы была возможность видеть свой прогресс. Мастерство повышает самооценку и уверенность в себе.",
    "**C:** заблаговременный поиск решений":
      "Мысленная репетиция того, как вы будете справляться с предстоящими сложными ситуациями. Включает представление ситуации, возможных препятствий и конкретных навыков, которые вы будете использовать. Это как «тренировка» перед важным событием.",
    "**PLEASE:** снижение уязвимости":
      "Забота о физическом здоровье для повышения эмоциональной устойчивости: лечение болезней, сбалансированное питание, избегание веществ, изменяющих настроение, достаточный сон, регулярные физические упражнения. Когда тело здорово, эмоции легче контролировать.",
    "**Осознанное отношение к текущей эмоции**":
      "Навык замечания и принятия своих эмоций без попыток их немедленно изменить или подавить. Это включает наблюдение за физическими ощущениями эмоции, её названием и позволение ей «быть» столько, сколько нужно. Как волны в океане — эмоции приходят и уходят сами.",

    "**СТОП:** остановись":
      "Техника экстренного реагирования в кризисных ситуациях: Стой (не действуй импульсивно), Сделай шаг назад (физически или мысленно отстранись), Осмотрись (что происходит внутри и снаружи), Продолжи осознанно (выбери эффективное действие). Помогает избежать действий, о которых потом пожалеешь.",
    "**За и против**":
      "Техника принятия решения через составление списка преимуществ и недостатков того, чтобы вытерпеть кризис без импульсивных действий, против действий под влиянием сильных эмоций. Помогает увидеть долгосрочные последствия ваших выборов.",
    "**Физиологические методы (ТРУД):** холодная вода, интенсивная физнагрузка, медленное дыхание, сканирование и расслабление тела":
      "Быстрые способы снижения интенсивности эмоций через физиологические методы: холодная вода на лицо или руки (активирует нырятельный рефлекс), интенсивные физические упражнения (выводят гормоны стресса), контролируемое медленное дыхание, напряжение и расслабление мышц. Эти техники «перезагружают» нервную систему.",
    "**ACCEPTS:** отвлечение":
      "Техники здорового отвлечения от болезненных переживаний: Активности (действия, требующие концентрации), Помощь другим, Сравнения (с теми, кому хуже), Противоположные эмоции (смешные видео при грусти), Отложить переживания на потом, Другие мысли (чтение, кроссворды), Интенсивные ощущения (лёд, острая пища). Цель — «переждать» пик эмоции.",
    "**Пять органов чувств:** забота о себе":
      "Использование приятных ощущений для каждого органа чувств: красивые виды (зрение), любимая музыка (слух), приятные ароматы (обоняние), вкусная еда (вкус), мягкие ткани или тёплая ванна (осязание). Это активирует парасимпатическую нервную систему и естественным образом успокаивает.",
    "**IMPROVE:** улучшить момент":
      "Техники, которые делают тяжёлые переживания более выносимыми: воображение приятных сцен, молитва или медитация, расслабление мышц, одно дело за раз (не думать обо всём сразу), «отпуск» от проблем (ментальный перерыв), вдохновляющие мысли, поиск смысла в страдании. Боль остаётся, но становится менее мучительной.",
    "**Радикальное принятие**":
      "Полное принятие реальности такой, какая она есть, без борьбы с тем, что невозможно изменить. Это не означает одобрение ситуации или пассивность — это прекращение внутринней войны с фактами. Принятие освобождает энергию для конструктивных действий там, где изменения возможны.",
    "**Готовность, полуулыбка, раскрытые ладони**":
      "Физические позы для практики принятия: открытые, расслабленные ладони (не сжатые в кулаки), лёгкая полуулыбка (расслабление мышц лица), прямая, но не напряжённая поза тела. Эти позы сигнализируют готовность принять опыт таким, какой он есть, и помогают телу «научить» разум принятию.",
    "**Осознанное отношение к текущим мыслям**":
      "Наблюдение за потоком мыслей как за облаками на небе — они приходят и уходят, но вы остаётесь. Важно помнить: мысли — это не факты и не приказы к действию. Это просто ментальные события, которые можно замечать, не следуя за ними автоматически.",

    "**Попроси (DEAR MAN):** навык эффективной просьбы":
      "Структурированный способ формулировать просьбы и отказы для достижения целей в общении. Перечислите факты без интерпретаций, опишите свое отношение через «я чувствую», попросите четко, чего хотите, расскажите о положительных результатах, обсудите варианты компромисса, стойте на своем без отвлечений, изобразите уверенность в голосе и позе. Навык помогает получить желаемое, сохраняя отношения и самоуважение.",
    "**Друг (GIVE):** эффективность отношений":
      "Способ общения, который поддерживает хорошие отношения: будьте мягкими (не агрессивными), проявляйте интерес к другому человеку, признавайте обоснованность его чувств и переживаний, используйте легкую манеру общения (юмор, улыбка). Эти навыки помогают людям чувствовать себя услышанными и принятыми.",
    "**Честь (FAST):** эффективность самоуважения":
      "Принципы общения, которые помогают оставаться верным себе: будьте справедливыми к себе и другим, не извиняйтесь за разумные просьбы и потребности, придерживайтесь своих ценностей, будьте честными. Эти навыки защищают от чувства вины и стыда после сложных разговоров.",
    "**Валидация**":
      "Признание и принятие чувств, мыслей или поведения другого человека как понятных в его ситуации, даже если вы не согласны с ними. Валидация не означает одобрение — это сообщение: «Я понимаю, почему ты так чувствуешь/думаешь». Это один из самых мощных способов улучшить отношения.",
    "**Стратегии изменения поведения**":
      "Методы влияния на поведение людей: поощрение желаемого поведения (благодарность, внимание), игнорирование нежелательного поведения (не подкрепляя его реакцией), демонстрация последствий неприемлемого поведения. Важно: изменить можно только своё поведение, но это влияет на реакции других людей.",
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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
