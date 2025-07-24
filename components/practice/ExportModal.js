import { Ionicons } from "@expo/vector-icons";

import React, { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Slider from "@react-native-community/slider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ControlAssessment from "./ControlAssessment";



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

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Простое уведомление - функция экспорта отключена
      Alert.alert('Экспорт', 'Функция экспорта временно отключена');
      
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Ошибка', 'Не удалось экспортировать данные');
      setIsExporting(false);
    }
  };



  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Экспорт данных</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.contentScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <Text style={styles.label}>Период экспорта: {exportDays} {exportDays === 1 ? 'день' : exportDays < 5 ? 'дня' : 'дней'}</Text>

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
          style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 8) }]}
        >
          <TouchableOpacity 
            style={[styles.exportButton, isExporting && styles.exportButtonDisabled]} 
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
    padding: 12,
    paddingBottom: 4,
  },
  label: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 12,
  },
  sliderLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
    minWidth: 20,
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
    paddingHorizontal: 18,
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
