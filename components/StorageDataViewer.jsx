import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { STORAGE_KEYS } from "../services/storageConfig";

const StorageDataViewer = () => {
  const [expandedKey, setExpandedKey] = useState(null);
  const [storageData, setStorageData] = useState({});
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);

  // Keys we want to display
  const keysToDisplay = [
    STORAGE_KEYS.DICTIONARY,
    STORAGE_KEYS.THEORY,
    STORAGE_KEYS.BEHAVIORS,
    STORAGE_KEYS.DIARY_ENTRIES,
    STORAGE_KEYS.SETTINGS,
    STORAGE_KEYS.READ_ARTICLES,
  ];

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    setLoading(true);
    try {
      const dataObj = {};

      for (const key of keysToDisplay) {
        const value = await AsyncStorage.getItem(key);
        let parsedValue = null;

        try {
          parsedValue = value ? JSON.parse(value) : null;
        } catch (e) {
          parsedValue = value;
        }

        // Special handling for Dictionary and Theory to count articles
        if (key === STORAGE_KEYS.DICTIONARY && parsedValue) {
          // Dictionary is a flat array of term objects
          const totalTerms = Array.isArray(parsedValue)
            ? parsedValue.length
            : 0;

          dataObj[key] = {
            value: parsedValue,
            size: value ? new TextEncoder().encode(value).length : 0,
            items: totalTerms,
            itemLabel: "терминов",
            isSimpleCount: true,
          };
        } else if (key === STORAGE_KEYS.THEORY && parsedValue) {
          const blockCounts = {};
          let totalArticles = 0;

          // Theory has a blocks array with articles inside each block
          if (parsedValue && Array.isArray(parsedValue.blocks)) {
            parsedValue.blocks.forEach((block) => {
              if (block && Array.isArray(block.articles)) {
                blockCounts[block.id] = {
                  title: block.title,
                  count: block.articles.length,
                };
                totalArticles += block.articles.length;
              }
            });
          }

          dataObj[key] = {
            value: parsedValue,
            size: value ? new TextEncoder().encode(value).length : 0,
            items: totalArticles,
            blocks: blockCounts,
            blockCount: Object.keys(blockCounts).length,
            itemLabel: "статей",
          };
        } else {
          dataObj[key] = {
            value: parsedValue,
            size: value ? new TextEncoder().encode(value).length : 0,
            items:
              parsedValue && typeof parsedValue === "object"
                ? Array.isArray(parsedValue)
                  ? parsedValue.length
                  : Object.keys(parsedValue).length
                : 0,
          };
        }
      }

      setStorageData(dataObj);
    } catch (error) {
      console.error("Error loading storage data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (key) => {
    if (expandedKey === key) {
      setExpandedKey(null);
    } else {
      setExpandedKey(key);
    }
  };

  const copyToClipboard = (key) => {
    try {
      const data = storageData[key];
      if (!data || !data.value) return;

      const content = JSON.stringify(data.value, null, 2);
      Clipboard.setString(content);

      // Show feedback
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);

      // Platform specific feedback
      if (Platform.OS === "android") {
        ToastAndroid.show("Скопировано в буфер обмена", ToastAndroid.SHORT);
      } else {
        Alert.alert("Скопировано", "Данные скопированы в буфер обмена");
      }
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      Alert.alert("Ошибка", "Не удалось скопировать данные");
    }
  };

  const getKeyDisplayName = (key) => {
    const parts = key.split("/");
    return parts[parts.length - 1];
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  const formatData = (data) => {
    if (data === null) return "null";
    if (data === undefined) return "undefined";

    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a0a0c0" />
        <Text style={styles.loadingText}>Загрузка данных...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Данные хранилища</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadStorageData}
        >
          <Ionicons name="refresh" size={20} color="#a0a0c0" />
        </TouchableOpacity>
      </View>

      {keysToDisplay.map((key) => {
        const data = storageData[key];
        const isExpanded = expandedKey === key;

        if (!data) return null;

        return (
          <View key={key} style={styles.itemContainer}>
            <TouchableOpacity
              style={styles.itemHeader}
              onPress={() => toggleExpand(key)}
            >
              <View style={styles.itemTitleContainer}>
                <Text style={styles.itemTitle}>{getKeyDisplayName(key)}</Text>
                <View style={styles.itemMeta}>
                  {key === STORAGE_KEYS.DICTIONARY && (
                    <Text style={styles.itemMetaText}>
                      {data.items} {data.itemLabel || "элем."} •{" "}
                      {formatBytes(data.size)}
                    </Text>
                  )}
                  {key === STORAGE_KEYS.THEORY && (
                    <Text style={styles.itemMetaText}>
                      {data.items} {data.itemLabel || "элем."} (
                      {data.blockCount} разделов) • {formatBytes(data.size)}
                    </Text>
                  )}
                  {key !== STORAGE_KEYS.DICTIONARY &&
                    key !== STORAGE_KEYS.THEORY && (
                      <Text style={styles.itemMetaText}>
                        {data.items} элем. • {formatBytes(data.size)}
                      </Text>
                    )}
                </View>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.copyButton,
                    copiedKey === key && styles.copyButtonActive,
                  ]}
                  onPress={() => copyToClipboard(key)}
                >
                  <Ionicons
                    name={copiedKey === key ? "checkmark" : "copy-outline"}
                    size={18}
                    color={copiedKey === key ? "#ffffff" : "#a0a0c0"}
                  />
                </TouchableOpacity>
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="#a0a0c0"
                  style={{ marginLeft: 12 }}
                />
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <ScrollView style={styles.dataContainer} horizontal={false}>
                {/* Special display for Dictionary */}
                {key === STORAGE_KEYS.DICTIONARY && data.isSimpleCount ? (
                  <View style={styles.categoriesContainer}>
                    <Text style={styles.categoriesTitle}>
                      Словарь содержит {data.items} терминов
                    </Text>
                    <View style={styles.divider} />
                    <Text style={styles.dataText}>
                      {formatData(data.value)}
                    </Text>
                  </View>
                ) : null}

                {/* Special display for Theory blocks */}
                {key === STORAGE_KEYS.THEORY && data.blocks ? (
                  <View style={styles.categoriesContainer}>
                    <Text style={styles.categoriesTitle}>
                      Количество статей по разделам:
                    </Text>
                    {Object.entries(data.blocks).map(([blockId, blockData]) => (
                      <View key={blockId} style={styles.categoryItem}>
                        <Text style={styles.categoryName}>
                          {blockData.title}
                        </Text>
                        <Text style={styles.categoryCount}>
                          {blockData.count}
                        </Text>
                      </View>
                    ))}
                    <View style={styles.divider} />
                    <Text style={styles.dataText}>
                      {formatData(data.value)}
                    </Text>
                  </View>
                ) : null}

                {/* Default display for other keys or when special handling is not applicable */}
                {(key !== STORAGE_KEYS.DICTIONARY || !data.isSimpleCount) &&
                  (key !== STORAGE_KEYS.THEORY || !data.blocks) && (
                    <Text style={styles.dataText}>
                      {formatData(data.value)}
                    </Text>
                  )}
              </ScrollView>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(50, 50, 72, 0.9)",
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f0f0f0",
  },
  refreshButton: {
    padding: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(50, 50, 72, 0.9)",
    borderRadius: 16,
  },
  loadingText: {
    color: "#a0a0c0",
    marginTop: 12,
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: "rgba(60, 60, 85, 0.7)",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  itemTitleContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f0f0f0",
  },
  itemMeta: {
    marginTop: 4,
  },
  itemMetaText: {
    fontSize: 14,
    color: "#a0a0c0",
  },
  dataContainer: {
    backgroundColor: "rgba(40, 40, 60, 0.8)",
    padding: 14,
    maxHeight: 300,
  },
  dataText: {
    fontSize: 14,
    fontFamily: "monospace",
    color: "#d0d0e0",
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f0f0f0",
    marginBottom: 10,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "rgba(60, 60, 90, 0.5)",
    borderRadius: 8,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 14,
    color: "#d0d0e0",
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a0c0ff",
    minWidth: 30,
    textAlign: "right",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  copyButton: {
    padding: 8,
    backgroundColor: "rgba(60, 60, 90, 0.6)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
  },
  copyButtonActive: {
    backgroundColor: "rgba(80, 170, 120, 0.8)",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(100, 100, 140, 0.5)",
    marginVertical: 16,
  },
});

export default StorageDataViewer;
