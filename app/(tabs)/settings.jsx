import { useScrollToTop } from "@react-navigation/native";
import { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useData } from "../../contexts/DataContext";
import { checkForUpdates } from "../../services/dataService";
import commonStyles from "../../styles/commonStyles";

export default function Settings() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshData } = useData();

  useScrollToTop(scrollViewRef);

  const handleCheckForUpdates = async () => {
    setIsLoading(true);
    setUpdateStatus(null);

    try {
      // First check and load updates from AsyncStorage
      const result = await checkForUpdates();

      // If data was updated, refresh it in the context
      if (result.updated) {
        await refreshData();
      }

      setUpdateStatus(result);
    } catch (error) {
      setUpdateStatus({ error: error.message });
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

          {updateStatus && (
            <View style={styles.statusContainer}>
              <Text style={styles.statusTitle}>Статус:</Text>
              {updateStatus.error ? (
                <Text style={styles.errorText}>
                  Ошибка: {updateStatus.error}
                </Text>
              ) : updateStatus.updated ? (
                <View>
                  <Text style={styles.successText}>
                    Данные успешно обновлены!
                  </Text>
                  {updateStatus.dictionaryUpdated && (
                    <Text style={styles.infoText}>• Словарь обновлен</Text>
                  )}
                  {updateStatus.theoryUpdated && (
                    <Text style={styles.infoText}>• Теория обновлена</Text>
                  )}
                </View>
              ) : (
                <Text style={styles.infoText}>
                  {updateStatus.message || "Обновления не требуются"}
                </Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.fixedContentContainer}>
          <Text style={styles.infoText}>insets: {JSON.stringify(insets)}</Text>
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
  statusContainer: {
    backgroundColor: "#323248",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  statusTitle: {
    color: "#f0f0f0",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  successText: {
    color: "#4cd964",
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 16,
  },
  infoText: {
    color: "#f0f0f0",
    fontSize: 16,
    marginBottom: 4,
  },
});
