import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const emotionData = {
  Гнев: {
    colors: ["#ff6b6b", "#ee5a52"],
    derivatives: [
      "Бешенство",
      "Ярость",
      "Ненависть",
      "Злость",
      "Раздражение",
      "Презрение",
      "Негодование",
      "Обида",
      "Ревность",
      "Уязвленность",
      "Досада",
      "Зависть",
      "Неприязнь",
      "Возмущение",
      "Отвращение",
    ],
  },
  Страх: {
    colors: ["#4ecdc4", "#45b7aa"],
    derivatives: [
      "Ужас",
      "Отчаяние",
      "Испуг",
      "Оцепенение",
      "Подозрение",
      "Тревога",
      "Ошарашенность",
      "Беспокойство",
      "Боязнь",
      "Унижение",
      "Замешательство",
      "Растерянность",
      "Вина",
      "Стыд",
      "Сомнение",
      "Застенчивость",
      "Опасение",
      "Смущение",
      "Сломленность",
      "Подвох",
      "Надменность",
      "Ошеломленность",
    ],
  },
  Грусть: {
    colors: ["#95a5a6", "#7f8c8d"],
    derivatives: [
      "Горечь",
      "Тоска",
      "Скорбь",
      "Лень",
      "Жалость",
      "Отрешенность",
      "Отчаяние",
      "Беспоспощность",
      "Душевная боль",
      "Безнадежность",
      "Отчужденность",
      "Разочарование",
      "Потрясение",
      "Сожаление",
      "Скука",
      "Безысходность",
      "Печаль",
      "Загнанность",
    ],
  },
  Радость: {
    colors: ["#f39c12", "#e67e22"],
    derivatives: [
      "Счастье",
      "Восторг",
      "Ликование",
      "Приподнятость",
      "Оживление",
      "Умиротворение",
      "Увлечение",
      "Интерес",
      "Забота",
      "Ожидание",
      "Возбуждение",
      "Предвкушение",
      "Надежда",
      "Любопытство",
      "Освобождение",
      "Приятие",
      "Принятие",
      "Нетерпение",
      "Вера",
      "Изумление",
    ],
  },
  Любовь: {
    colors: ["#e74c3c", "#c0392b"],
    derivatives: [
      "Нежность",
      "Теплота",
      "Сочувствие",
      "Блаженство",
      "Доверие",
      "Безопасность",
      "Благодарность",
      "Спокойствие",
      "Симпатия",
      "Идентичность",
      "Гордость",
      "Восхищение",
      "Уважение",
      "Самоценность",
      "Влюбленность",
      "Любовь к себе",
      "Очарованность",
      "Смирение",
      "Искренность",
      "Дружелюбие",
      "Доброта",
      "Взаимовыручка",
    ],
  },
};

export default function EmotionWheel() {
  const [selectedEmotion, setSelectedEmotion] = useState("Гнев");
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Создаем анимации для каждой базовой эмоции
  const buttonAnimations = useRef(
    Object.keys(emotionData).reduce((acc, emotion) => {
      acc[emotion] = {
        scale: new Animated.Value(1),
        opacity: new Animated.Value(0.85),
      };
      return acc;
    }, {})
  ).current;

  const basicEmotions = Object.keys(emotionData);

  useEffect(() => {
    // Smooth slide transition for derivative emotions when selection changes
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    // Анимируем кнопки при изменении выбранной эмоции
    basicEmotions.forEach((emotion) => {
      const isSelected = emotion === selectedEmotion;

      Animated.parallel([
        Animated.spring(buttonAnimations[emotion].scale, {
          toValue: isSelected ? 1.05 : 1.0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnimations[emotion].opacity, {
          toValue: isSelected ? 1.0 : 0.85,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [selectedEmotion]);

  const handleEmotionPress = (emotion) => {
    // Haptic feedback при нажатии
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedEmotion(emotion);
  };

  const renderBasicEmotion = (emotion) => {
    const isSelected = selectedEmotion === emotion;
    const animatedScale = buttonAnimations[emotion].scale;
    const animatedOpacity = buttonAnimations[emotion].opacity;

    return (
      <Animated.View
        style={[
          styles.emotionButtonContainer,
          {
            transform: [{ scale: animatedScale }],
            opacity: animatedOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={
            isSelected
              ? emotionData[emotion].colors
              : [
                  `${emotionData[emotion].colors[0]}40`, // 25% opacity для неактивных
                  `${emotionData[emotion].colors[1]}35`, // 21% opacity для неактивных
                ]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.basicEmotionButton,
            isSelected && styles.activeEmotionButton,
            !isSelected && {
              borderColor: emotionData[emotion].colors[0],
              borderWidth: 1.5,
            },
          ]}
        >
          <Text
            style={[
              isSelected
                ? styles.basicEmotionTextActive
                : styles.basicEmotionTextInactive,
              !isSelected && { color: emotionData[emotion].colors[0] },
              isSelected && {
                textShadowColor: "rgba(0,0,0,0.3)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              },
            ]}
          >
            {emotion}
          </Text>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Scrollable basic emotions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.basicEmotionsContainer}
        style={styles.basicEmotionsScroll}
      >
        {basicEmotions.map((emotion) => (
          <TouchableOpacity
            key={emotion}
            onPress={() => handleEmotionPress(emotion)}
            style={styles.emotionButtonWrapper}
          >
            {renderBasicEmotion(emotion)}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Derivative emotions */}
      <View style={styles.derivativeGrid}>
        {emotionData[selectedEmotion].derivatives.map((derivative, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.derivativeText,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            {derivative}
          </Animated.Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  basicEmotionsScroll: {
    marginBottom: 20,
  },
  basicEmotionsContainer: {
    paddingHorizontal: 0,
    paddingVertical: 8, // Увеличен для анимации scale
    gap: 14,
  },
  emotionButtonWrapper: {
    marginHorizontal: 4,
  },
  emotionButtonContainer: {
    // Контейнер для анимации
  },
  basicEmotionButton: {
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 32,
    minWidth: 110,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  activeEmotionButton: {
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  basicEmotionTextActive: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  basicEmotionTextInactive: {
    fontSize: 19,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  derivativeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingHorizontal: 4,
  },
  derivativeText: {
    fontSize: 19,
    fontWeight: "500",
    color: "#ffffff",
    letterSpacing: 0.2,
    lineHeight: 26,
  },
});
