import { Ionicons } from "@expo/vector-icons";
import { useScrollToTop } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import appJson from "../../app.json";
import { useData } from "../../contexts/DataContext";
import {
  checkForUpdates,
  getDataVersions,
  getLastUpdateCheckTime,
  resetReadingProgress,
} from "../../services/dataService";
import commonStyles from "../../styles/commonStyles";

const APP_VERSION = appJson.expo.version;

const DEVELOPERS = [{ name: "Дима", telegram: "mitenka" }];

export default function Settings() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataInfo, setDataInfo] = useState({
    dictionaryVersion: "-",
    theoryVersion: "-",
    lastUpdateCheck: null,
  });
  const { loadData } = useData();

  useScrollToTop(scrollViewRef);

  const loadDataInfo = async () => {
    try {
      const versions = await getDataVersions();
      const lastCheckTime = await getLastUpdateCheckTime();

      setDataInfo({
        dictionaryVersion: versions.dictionaryVersion || "-",
        theoryVersion: versions.theoryVersion || "-",
        lastUpdateCheck: lastCheckTime ? new Date(lastCheckTime) : null,
      });
    } catch (error) {
      console.error("Error loading data info:", error);
    }
  };

  useEffect(() => {
    loadDataInfo();
  }, []);

  const handleOpenLink = (url) => {
    Linking.openURL(url);
  };

  const handleResetProgress = async () => {
    Alert.alert(
      "Сброс прогресса",
      "Вы уверены, что хотите сбросить весь прогресс чтения? Это действие нельзя отменить.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Сбросить",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              const success = await resetReadingProgress();
              if (success) {
                await loadData();
                await loadDataInfo();
                Alert.alert("Готово", "Прогресс чтения успешно сброшен");
              } else {
                Alert.alert("Ошибка", "Не удалось сбросить прогресс чтения");
              }
            } catch (error) {
              Alert.alert("Ошибка", `Произошла ошибка: ${error.message}`);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCheckForUpdates = async () => {
    setIsLoading(true);

    try {
      const result = await checkForUpdates();

      if (result.updated) {
        await loadData();
      }

      await loadDataInfo();

      if (result.error) {
        Alert.alert(
          "Ошибка",
          `Не удалось проверить обновления: ${result.error}`
        );
      } else if (result.updated) {
        let message = "Данные успешно обновлены";
        if (result.dictionaryUpdated) message += "\n• Словарь обновлен";
        if (result.theoryUpdated) message += "\n• Теория обновлена";

        Alert.alert("Обновление", message);
      } else {
        Alert.alert("Обновление", result.message || "Обновления не требуются");
      }
    } catch (error) {
      Alert.alert("Ошибка", `Произошла ошибка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.titleContainer}>
        <Text style={commonStyles.title}>Настройка</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Словарь:</Text>
            <Text style={styles.infoValue}>{dataInfo.dictionaryVersion}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Теория:</Text>
            <Text style={styles.infoValue}>{dataInfo.theoryVersion}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Обновлено:</Text>
            <Text style={styles.infoValue}>
              {dataInfo.lastUpdateCheck
                ? dataInfo.lastUpdateCheck.toLocaleString("ru-RU")
                : "никогда"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Версия:</Text>
            <Text style={styles.infoValue}>{APP_VERSION}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {/* Кнопки */}
          <View style={styles.buttonsGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleCheckForUpdates}
              disabled={isLoading}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="refresh-outline" size={20} color="#ffffff" />
              </View>
              <Text style={styles.buttonText}>
                {isLoading ? "Проверка..." : "Проверить обновления"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleResetProgress}
              disabled={isLoading}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="trash-outline" size={20} color="#ffffff" />
              </View>
              <Text style={styles.buttonText}>Сбросить прогресс чтения</Text>
            </TouchableOpacity>
          </View>

          {/* Ссылки */}
          <View style={styles.contactSection}>
            <Text style={styles.infoText}>
              Если вы заметили ошибку или хотите предложить улучшение, напишите
              нам. Впрочем, можете написать и безо всякого повода.
            </Text>

            <View style={styles.linksGroup}>
              {DEVELOPERS.map((dev, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.link}
                  onPress={() => handleOpenLink(`https://t.me/${dev.telegram}`)}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="paper-plane" size={20} color="#a0a0c0" />
                  </View>
                  <View style={styles.linkTextContainer}>
                    <Text style={styles.linkText}>{dev.name}</Text>
                    <Ionicons
                      name="open-outline"
                      size={16}
                      color="#a0a0c0"
                      style={styles.externalLinkIcon}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text style={styles.infoText}>Диана, тебя добавить? 🙂</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contactSection: {
    backgroundColor: "#323248",
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#3a3a5e",
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  actionsContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  buttonsGroup: {
    marginBottom: 24,
  },
  linksGroup: {
    paddingTop: 8,
  },
  button: {
    backgroundColor: "#4a4a6a",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },

  link: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#404060",
    borderRadius: 8,
  },
  iconContainer: {
    width: 24,
    alignItems: "center",
    marginRight: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  linkText: {
    color: "#a0a0c0",
    fontSize: 16,
    flex: 1,
  },
  externalLinkIcon: {
    marginLeft: 6,
  },
  infoTextContainer: {
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  infoText: {
    color: "#a0a0c0",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    color: "#a0a0c0",
    fontSize: 16,
    width: 100,
  },
  infoValue: {
    color: "#f0f0f0",
    fontSize: 16,
    fontFamily: "monospace",
    flex: 1,
    textAlign: "right",
  },
  sectionTitle: {
    color: "#f0f0f0",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
  },
  infoContainer: {
    backgroundColor: "#323248",
    padding: 16,
    borderRadius: 8,
  },
});
