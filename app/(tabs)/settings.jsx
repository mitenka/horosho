import { Ionicons } from "@expo/vector-icons";
import { useScrollToTop } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import appJson from "../../app.json";
import StorageDataViewer from "../../components/StorageDataViewer";
import { useData } from "../../contexts/DataContext";
import {
  checkForUpdates,
  getDataVersions,
  getLastUpdateCheckTime,
  resetReadingProgress,
} from "../../services/dataService";
import { clearBehaviors, clearDiaryHistory } from "../../services/diaryService";

const APP_VERSION = appJson.expo.version;

const DEVELOPERS = [
  { name: "Редакторка Диана", telegram: "Di9919" },
  { name: "Разработчик Дима", telegram: "mitenka" },
];

export default function Settings() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataInfo, setDataInfo] = useState({
    dictionaryVersion: "-",
    theoryVersion: "-",
    lastUpdateCheck: null,
  });
  const { loadData, settings, updateSetting } = useData();

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

  const handleClearBehaviors = async () => {
    Alert.alert(
      "Очистка списка поведений",
      "Вы уверены, что хотите удалить все добавленные вами поведения? Это действие нельзя отменить.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Очистить",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              const success = await clearBehaviors();
              if (success) {
                Alert.alert("Готово", "Список поведений успешно очищен");
              } else {
                Alert.alert("Ошибка", "Не удалось очистить список поведений");
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

  const handleClearDiaryHistory = async () => {
    Alert.alert(
      "Удаление истории дневника",
      "Вы уверены, что хотите удалить всю историю дневника? Это действие нельзя отменить.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              const success = await clearDiaryHistory();
              if (success) {
                Alert.alert("Готово", "История дневника успешно удалена");
              } else {
                Alert.alert("Ошибка", "Не удалось удалить историю дневника");
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

  return (
    <LinearGradient
      colors={["#3a3a5e", "#2d2d4a"]}
      style={[styles.container, { paddingTop: insets.top + 8 }]}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Настройка</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView, { marginTop: 10 }]}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.settingsContainer}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>
              Использовать глаголы в женском роде
            </Text>
            <Switch
              value={settings?.useFeminineVerbs}
              onValueChange={(value) =>
                updateSetting("useFeminineVerbs", value)
              }
              trackColor={{ false: "#3a3a5e", true: "#6e6ea0" }}
              thumbColor={settings?.useFeminineVerbs ? "#f0f0f0" : "#a0a0c0"}
              ios_backgroundColor="#3a3a5e"
              style={styles.settingSwitch}
            />
          </View>
        </View>

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

            <TouchableOpacity
              style={styles.button}
              onPress={handleClearBehaviors}
              disabled={isLoading}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="trash-outline" size={20} color="#ffffff" />
              </View>
              <Text style={styles.buttonText}>Очистить список поведений</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleClearDiaryHistory}
              disabled={isLoading}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="trash-outline" size={20} color="#ffffff" />
              </View>
              <Text style={styles.buttonText}>Удалить историю дневника</Text>
            </TouchableOpacity>
          </View>

          {/* Storage Data Viewer Section */}
          <StorageDataViewer />

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Написать авторам</Text>
            <Text style={styles.infoText}>
              Если вы заметили ошибку, хотите предложить улучшение, или
              поговорить безо всякого повода, мы будем исключительно рады вашим
              сообщениям.
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
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  contactSection: {
    backgroundColor: "rgba(50, 50, 72, 0.9)",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  actionsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  buttonsGroup: {
    marginBottom: 20,
  },
  linksGroup: {
    paddingTop: 12,
  },
  button: {
    backgroundColor: "rgba(74, 74, 106, 0.9)",
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  link: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(64, 64, 96, 0.9)",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 28,
    alignItems: "center",
    marginRight: 14,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  linkText: {
    color: "#a0a0c0",
    fontSize: 17,
    flex: 1,
  },
  externalLinkIcon: {
    marginLeft: 8,
  },
  infoTextContainer: {
    paddingHorizontal: 6,
    marginBottom: 20,
  },
  infoText: {
    color: "#a0a0c0",
    fontSize: 16,
    lineHeight: 22,
    textAlign: "left",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    color: "#a0a0c0",
    fontSize: 17,
    width: 110,
  },
  infoValue: {
    color: "#f0f0f0",
    fontSize: 17,
    fontFamily: "monospace",
    flex: 1,
    textAlign: "right",
  },
  sectionTitle: {
    color: "#f0f0f0",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingsContainer: {
    backgroundColor: "rgba(50, 50, 72, 0.9)",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  settingLabel: {
    color: "#f0f0f0",
    fontSize: 18,
    flex: 1,
    paddingRight: 16,
    fontWeight: "500",
  },
  settingSwitch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  infoContainer: {
    backgroundColor: "rgba(50, 50, 72, 0.9)",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
