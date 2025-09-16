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
  }, [selectedEmotion]);

  const renderBasicEmotion = (emotion) => {
    const isSelected = selectedEmotion === emotion;

    if (isSelected) {
      return (
        <View style={styles.festiveBorderContainer}>
          <LinearGradient
            colors={[
              emotionData[emotion].colors[0],
              emotionData[emotion].colors[1],
              emotionData[emotion].colors[0],
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.festiveBorder}
          >
            <LinearGradient
              colors={emotionData[emotion].colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.basicEmotionButton}
            >
              <Text style={styles.basicEmotionTextActive}>{emotion}</Text>
            </LinearGradient>
          </LinearGradient>
        </View>
      );
    }

    return (
      <LinearGradient
        colors={[
          `${emotionData[emotion].colors[0]}80`, // 50% opacity for more saturation
          `${emotionData[emotion].colors[1]}70`, // 44% opacity for more saturation
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.basicEmotionButton,
          { borderColor: emotionData[emotion].colors[0], borderWidth: 1.5 },
        ]}
      >
        <Text
          style={[
            styles.basicEmotionTextInactive,
            { color: emotionData[emotion].colors[0] },
          ]}
        >
          {emotion}
        </Text>
      </LinearGradient>
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
            onPress={() => setSelectedEmotion(emotion)}
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
    paddingVertical: 4, // Add vertical padding to prevent clipping of active state
    gap: 12,
  },
  emotionButtonWrapper: {
    marginHorizontal: 4,
  },
  basicEmotionButton: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 32,
    minWidth: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  activeEmotionButton: {
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  basicEmotionTextActive: {
    fontSize: 19,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.4,
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
  festiveBorderContainer: {
    overflow: "hidden",
    borderRadius: 32,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
  festiveBorder: {
    padding: 4,
    borderRadius: 32,
  },
});
