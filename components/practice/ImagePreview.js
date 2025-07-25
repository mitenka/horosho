import { Ionicons } from "@expo/vector-icons";
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

const ImagePreview = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const [isSharing, setIsSharing] = useState(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const imageRef = useRef();

  const handleShare = async () => {
    try {
      setIsSharing(true);

      if (!isLayoutReady) {
        Alert.alert("Ошибка", "Изображение еще не готово. Попробуйте еще раз.");
        setIsSharing(false);
        return;
      }

      // Небольшая задержка для стабильности
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Создаем изображение в высоком разрешении с правильными пропорциями
      const uri = await captureRef(imageRef, {
        format: "png",
        quality: 1.0,
        result: "tmpfile",
        pixelRatio: 3, // Увеличиваем разрешение без изменения пропорций
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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Кнопка закрытия */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Контейнер для захвата изображения */}
        <View
          ref={imageRef}
          style={styles.imageContainer}
          collapsable={false}
          onLayout={() => setIsLayoutReady(true)}
        >
          <View style={styles.content}>
            <Text style={styles.helloText}>Hello World</Text>
            <Text style={styles.subtitle}>Экспорт из приложения Horosho</Text>
            <View style={styles.decorativeElement}>
              <Text style={styles.emoji}>🎉</Text>
            </View>
          </View>
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
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
});

export default ImagePreview;
