import { useScrollToTop } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useData } from "../../contexts/DataContext";
import {
  checkForUpdates,
  getDataVersions,
  getLastUpdateCheckTime,
} from "../../services/dataService";
import commonStyles from "../../styles/commonStyles";

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
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCheckForUpdates}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Проверка..." : "Проверить обновления"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Информация о данных</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Версия словаря: {dataInfo.dictionaryVersion}
            </Text>
            <Text style={styles.infoText}>
              Версия теории: {dataInfo.theoryVersion}
            </Text>
            <Text style={styles.infoText}>
              Последняя проверка обновлений:{" "}
              {dataInfo.lastUpdateCheck
                ? dataInfo.lastUpdateCheck.toLocaleString("ru-RU")
                : "никогда"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: "#4a4a6a",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  infoText: {
    color: "#f0f0f0",
    fontSize: 16,
    marginBottom: 4,
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
