import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";
import DiaryTable from "./DiaryTable";

// Константа для дополнительного отступа кнопки закрытия от верха
const CLOSE_BUTTON_TOP_OFFSET = 31;

const ImagePreview = ({ visible, onClose, exportDays, selectedDate, controlAssessment }) => {
  const insets = useSafeAreaInsets();
  const [isSharing, setIsSharing] = useState(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [isOffscreenReady, setIsOffscreenReady] = useState(false);
  const imageRef = useRef();
  const offscreenRef = useRef(); // Ref для невидимого компонента экспорта

  const handleShare = async () => {
    try {
      setIsSharing(true);

      if (!isOffscreenReady) {
        Alert.alert("Ошибка", "Изображение еще не готово. Попробуйте еще раз.");
        setIsSharing(false);
        return;
      }

      // Небольшая задержка для стабильности
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Создаем изображение с невидимого offscreen компонента в полном размере
      const uri = await captureRef(offscreenRef, {
        format: "png",
        quality: 1.0,
        result: "tmpfile",
        pixelRatio: 3, // Увеличиваем разрешение для высокого качества
      });

      // Делимся изображением
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(`file://${uri}`, {
          mimeType: "image/png",
          dialogTitle: "Поделиться изображением",
        });
      } else {
        Alert.alert("Успех", "Изображение создано");
      }

      setIsSharing(false);
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Ошибка", "Не удалось поделиться изображением");
      setIsSharing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent={false}
    >
      <LinearGradient
        colors={["#3a3a5e", "#2d2d4a"]}
        style={[styles.container, { paddingTop: insets.top }]}
      >
        {/* Кнопка закрытия */}
        <TouchableOpacity
          style={[
            styles.closeButton,
            { top: insets.top + CLOSE_BUTTON_TOP_OFFSET },
          ]}
          onPress={onClose}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Контейнер для превью (масштабированный для экрана) */}
        <View
          ref={imageRef}
          style={styles.imageContainer}
          collapsable={false}
          onLayout={() => setIsLayoutReady(true)}
        >
          <DiaryTable 
            exportDays={exportDays} 
            selectedDate={selectedDate}
            isPreview={true}
            thoughtsControl={controlAssessment?.thoughts}
            emotionsControl={controlAssessment?.emotions}
            actionsControl={controlAssessment?.actions}
          />
        </View>

        {/* Кнопка поделиться - обычная, яркая */}
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.shareButton,
              isSharing && styles.shareButtonDisabled,
            ]}
            onPress={handleShare}
            disabled={isSharing}
          >
            <Ionicons
              name="share"
              size={24}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.shareButtonText}>
              {isSharing ? "Подготовка..." : "Поделиться"}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Невидимый offscreen компонент для экспорта в полном размере */}
      <View
        ref={offscreenRef}
        style={styles.offscreenContainer}
        collapsable={false}
        onLayout={() => setIsOffscreenReady(true)}
      >
        <DiaryTable 
          exportDays={exportDays} 
          selectedDate={selectedDate}
          isPreview={false}
          thoughtsControl={controlAssessment?.thoughts}
          emotionsControl={controlAssessment?.emotions}
          actionsControl={controlAssessment?.actions}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    // top убран - теперь используется динамический отступ с insets.top
    right: 30, // Увеличен отступ справа для лучшего позиционирования
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    margin: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  helloText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    fontStyle: "italic",
  },
  decorativeElement: {
    marginTop: 20,
  },
  emoji: {
    fontSize: 64,
    textAlign: "center",
  },
  footer: {
    padding: 20,
  },
  shareButton: {
    backgroundColor: "#ff3b30", // Обычная яркая кнопка (не полупрозрачная)
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  shareButtonDisabled: {
    backgroundColor: "rgba(255, 59, 48, 0.6)",
  },
  buttonIcon: {
    marginRight: 8,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  offscreenContainer: {
    position: "absolute",
    left: -10000, // Размещаем далеко за пределами экрана
    top: -10000,
    backgroundColor: "#fff",
  },
});

export default ImagePreview;
