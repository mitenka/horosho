import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ExportModal = ({
  visible,
  onClose,
  exportDays,
  onExportDaysChange,
  onExport,
}) => {
  const insets = useSafeAreaInsets();
  const dayOptions = [7, 14, 30];

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

        <View style={styles.content}>
          <Text style={styles.label}>Выберите период для экспорта:</Text>

          <View style={styles.daySelector}>
            {dayOptions.map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.daySelectorButton,
                  exportDays === days && styles.daySelectorButtonActive,
                ]}
                onPress={() => onExportDaysChange(days)}
              >
                <Text
                  style={[
                    styles.daySelectorButtonText,
                    exportDays === days && styles.daySelectorButtonTextActive,
                  ]}
                >
                  {days} {days === 1 ? "день" : days < 5 ? "дня" : "дней"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 8) }]}
        >
          <TouchableOpacity style={styles.exportButton} onPress={onExport}>
            <Text style={styles.exportButtonText}>Экспортировать</Text>
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
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
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
  daySelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  daySelectorButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  daySelectorButtonActive: {
    backgroundColor: "#ff3b30",
  },
  daySelectorButtonText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 0.3,
  },
  daySelectorButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 0.4,
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
});

export default ExportModal;
