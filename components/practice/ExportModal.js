import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ControlAssessment from "./ControlAssessment";
import { getDiaryEntries } from "../../services/diaryService";
import WebViewExporter from "./WebViewExporter";

const ExportModal = ({
  visible,
  onClose,
  exportDays,
  onExportDaysChange,
}) => {
  const insets = useSafeAreaInsets();
  const dayOptions = [7, 14, 30];
  const [isExporting, setIsExporting] = useState(false);
  const [diaryData, setDiaryData] = useState(null);
  const [controlAssessment, setControlAssessment] = useState(null);
  const [showWebView, setShowWebView] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходимо разрешение для сохранения в фотоленту');
        setIsExporting(false);
        return;
      }
      
      // Load diary entries
      const entries = await getDiaryEntries();
      
      // Filter entries by selected days
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - exportDays);
      
      const filteredEntries = {};
      Object.entries(entries || {}).forEach(([date, entry]) => {
        const entryDate = new Date(date);
        if (entryDate >= cutoffDate) {
          filteredEntries[date] = entry;
        }
      });
      
      setDiaryData(filteredEntries);
      setShowWebView(true);
      
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Ошибка', 'Не удалось экспортировать данные');
      setIsExporting(false);
    }
  };

  const handleExportComplete = async (base64Data) => {
    try {
      // Convert base64 to file URI
      const filename = `diary_export_${new Date().toISOString().split('T')[0]}.png`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      
      // Remove data:image/png;base64, prefix
      const base64Image = base64Data.replace(/^data:image\/png;base64,/, '');
      
      // Write file
      await FileSystem.writeAsStringAsync(fileUri, base64Image, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Create asset and save to album
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      
      // Try to get or create "Сойдёт" album
      let album;
      try {
        const albums = await MediaLibrary.getAlbumsAsync();
        album = albums.find(a => a.title === 'Сойдёт');
        
        if (!album) {
          album = await MediaLibrary.createAlbumAsync('Сойдёт', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      } catch (albumError) {
        console.log('Album creation/addition failed, but image saved to camera roll');
      }
      
      // Clean up temporary file
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
      
      Alert.alert('Успешно', 'Изображение сохранено в фотоленту');
      
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить изображение');
    } finally {
      setIsExporting(false);
      setShowWebView(false);
      setDiaryData(null);
      onClose();
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
        
        {showWebView && (
          <WebViewExporter
            diaryData={diaryData}
            controlAssessment={controlAssessment}
            onExportComplete={handleExportComplete}
          />
        )}
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
  exportButtonDisabled: {
    backgroundColor: "rgba(255, 59, 48, 0.6)",
  },
});

export default ExportModal;
