import { Ionicons } from "@expo/vector-icons";

import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ControlAssessment from "./ControlAssessment";
import ImagePreview from "./ImagePreview";

const ExportModal = ({
  visible,
  onClose,
  exportDays,
  onExportDaysChange,
  selectedDate,
}) => {
  const insets = useSafeAreaInsets();

  const [isExporting, setIsExporting] = useState(false);
  const [controlAssessment, setControlAssessment] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [modalAnimationType, setModalAnimationType] = useState("slide");

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Короткая задержка для визуального эффекта
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Меняем анимацию на fade для плавного перехода к превью
      setModalAnimationType("fade");

      // Небольшая задержка чтобы изменение анимации применилось
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Сначала закрываем текущую модалку, затем открываем превью
      onClose();

      // Небольшая задержка для плавного перехода
      setTimeout(() => {
        setShowImagePreview(true);
      }, 100);

      setIsExporting(false);
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Ошибка", "Не удалось экспортировать данные");
      setIsExporting(false);
    }
  };

  const handlePreviewClose = () => {
    setShowImagePreview(false);

    // Сбрасываем состояние (модалка уже закрыта в handleExport)
    setTimeout(() => {
      // Сбрасываем слайдер к 7 дням
      onExportDaysChange(7);

      // Сбрасываем ControlAssessment
      setControlAssessment(null);

      // Сбрасываем анимацию обратно к slide
      setModalAnimationType("slide");

      // onClose() уже вызван в handleExport, повторно не нужен
    }, 300); // Небольшая задержка для плавности
  };

  // Обработчик обычного закрытия (крестик)
  const handleNormalClose = () => {
    // Оставляем стандартную анимацию slide
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType={modalAnimationType}
        presentationStyle="pageSheet"
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <View
            style={[
              styles.header,
              { paddingHorizontal: 16, paddingVertical: 12 },
            ]}
          >
            <Text style={styles.title}>Экспорт данных</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleNormalClose}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.content}>
              <Text style={styles.label}>
                Период экспорта:{" "}
                {exportDays === 7
                  ? "неделя"
                  : exportDays === 14
                  ? "две недели"
                  : `${exportDays} ${
                      exportDays === 1
                        ? "день"
                        : exportDays < 5
                        ? "дня"
                        : "дней"
                    }`}
              </Text>

              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>7</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={7}
                  maximumValue={14}
                  step={1}
                  value={exportDays}
                  onValueChange={onExportDaysChange}
                  minimumTrackTintColor="#ff3b30"
                  maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                  thumbTintColor="#ff3b30"
                />
                <Text style={styles.sliderLabel}>14</Text>
              </View>

              <ControlAssessment onAssessmentChange={setControlAssessment} />
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
                styles.exportButton,
                isExporting && styles.exportButtonDisabled,
              ]}
              onPress={handleExport}
              disabled={isExporting}
            >
              <Text style={styles.exportButtonText}>
                {isExporting ? "Экспортируется..." : "Экспортировать"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Компонент превью изображения */}
      <ImagePreview visible={showImagePreview} onClose={handlePreviewClose} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d2d4a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.4,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 4,
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 24,
    letterSpacing: 0.4,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: "#ff3b30",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  slider: {
    flex: 1,
    height: 44,
    marginHorizontal: 16,
  },
  sliderLabel: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  hint: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginBottom: 22,
    fontStyle: "italic",
  },
  footer: {
    padding: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.12)",
  },
  exportButton: {
    backgroundColor: "#ff3b30",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  exportButtonDisabled: {
    backgroundColor: "rgba(255, 59, 48, 0.6)",
  },
});

export default ExportModal;
