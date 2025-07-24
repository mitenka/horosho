import { Ionicons } from "@expo/vector-icons";
import { useScrollToTop } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useData } from "../../contexts/DataContext";

export default function Dictionary() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

  const { dictionary: dictionaryData, isLoading, error } = useData();

  useScrollToTop(flatListRef);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const terms = dictionaryData || [];

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return terms;

    const normalizedQuery = searchQuery.toLowerCase().trim();
    return terms.filter(
      (term) =>
        term.headword.toLowerCase().includes(normalizedQuery) ||
        term.definition.toLowerCase().includes(normalizedQuery)
    );
  }, [searchQuery, terms]);

  // Handle term selection and show modal
  const handleTermPress = (term) => {
    setSelectedTerm(term);
    setModalVisible(true);
  };

  // Find related terms for a given term
  const findRelatedTerms = (termId) => {
    return terms.filter((term) =>
      selectedTerm?.relatedTermIds.includes(term.id)
    );
  };

  // Render each term card
  const renderTermCard = ({ item }) => {
    // Truncate definition if it's too long
    const truncatedDefinition =
      item.definition.length > 80
        ? `${item.definition.substring(0, 80)}...`
        : item.definition;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleTermPress(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.headword}</Text>
        </View>
        <Text style={styles.definition}>{truncatedDefinition}</Text>
      </TouchableOpacity>
    );
  };

  // Show loading indicator if data is being loaded
  if (isLoading) {
    return (
      <LinearGradient
        colors={["#3a3a5e", "#2d2d4a"]}
        style={[styles.container, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>Словарь</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a0a0d0" />
          <Text style={styles.loadingText}>Загрузка словаря...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Show error message if something went wrong
  if (error) {
    return (
      <LinearGradient
        colors={["#3a3a5e", "#2d2d4a"]}
        style={[styles.container, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>Словарь</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Произошла ошибка при загрузке словаря
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#3a3a5e", "#2d2d4a"]}
      style={[styles.container, { paddingTop: insets.top + 8 }]}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Словарь</Text>
      </View>
      <View style={[styles.fixedContentContainer, { marginTop: 10 }]}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={22}
            color="#a0a0d0"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск термина"
            placeholderTextColor="#8484a9"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close" size={22} color="#a0a0d0" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {filteredTerms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Ничего не найдено. Попробуйте изменить запрос.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredTerms}
          renderItem={renderTermCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: insets.bottom + 16 },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={true}
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedTerm?.headword}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#f0f0f0" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.definitionContainer}>
                <Text style={styles.definitionLabel}>Определение</Text>
                <Text style={styles.definitionText}>
                  {selectedTerm?.definition}
                </Text>
              </View>

              {selectedTerm?.examples && selectedTerm.examples !== null && selectedTerm.examples.length > 0 && (
                <View style={styles.exampleContainer}>
                  <Text style={styles.exampleLabel}>
                    {selectedTerm.examples.length === 1 ? 'Пример' : 'Примеры'}
                  </Text>
                  <View style={styles.exampleContent}>
                    {selectedTerm.examples.map((example, index) => (
                      <Text key={index} style={[styles.exampleText, index > 0 && { marginTop: 8 }]}>
                        {selectedTerm.examples.length > 1 && `${index + 1}. `}{example}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {selectedTerm?.relatedTermIds.length > 0 && (
                <View style={styles.relatedTermsContainer}>
                  <Text style={styles.relatedTermsLabel}>
                    Связанные термины
                  </Text>
                  {selectedTerm &&
                    findRelatedTerms(selectedTerm.id).map((relatedTerm) => (
                      <TouchableOpacity
                        key={relatedTerm.id}
                        style={styles.relatedTermButton}
                        onPress={() => {
                          setSelectedTerm(relatedTerm);
                        }}
                      >
                        <Ionicons
                          name="link-outline"
                          size={16}
                          color="#a0a0d0"
                          style={styles.relatedTermIcon}
                        />
                        <Text style={styles.relatedTermText}>
                          {relatedTerm.headword}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 18,
    color: "#c8c8e0",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b",
    textAlign: "center",
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
  fixedContentContainer: {
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#2d2d4a",
    borderRadius: 24,
    width: "100%",
    maxHeight: "80%",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(58, 58, 94, 0.5)",
    padding: 22,
    paddingBottom: 18,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f0f0f0",
    flex: 1,
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 10,
    marginRight: -6,
  },
  modalBody: {
    padding: 22,
  },
  definitionContainer: {
    marginBottom: 28,
  },
  definitionLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#a0a0d0",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  definitionText: {
    fontSize: 17,
    lineHeight: 26,
    color: "#f0f0f0",
  },
  exampleContainer: {
    marginBottom: 28,
  },
  exampleLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#a0a0d0",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  exampleContent: {
    backgroundColor: "rgba(45, 45, 65, 0.4)",
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(160, 160, 208, 0.2)",
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exampleText: {
    fontSize: 17,
    lineHeight: 26,
    fontStyle: "italic",
    color: "#d0d0e0",
    letterSpacing: 0.3,
    padding: 18,
    backgroundColor: "rgba(45, 45, 65, 0.2)",
    borderRadius: 10,
    fontWeight: "500",
  },
  relatedTermsContainer: {
    marginBottom: 16,
  },
  relatedTermsLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#a0a0d0",
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  relatedTermButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3a5e",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  relatedTermIcon: {
    marginRight: 8,
  },
  relatedTermText: {
    fontSize: 16,
    color: "#f0f0f0",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  // Search container
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(45, 45, 74, 0.8)",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 54,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#f0f0f0",
    fontSize: 18,
    height: "100%",
  },
  clearButton: {
    padding: 8,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "rgba(58, 58, 94, 0.9)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: "600",
    color: "#f0f0f0",
    flex: 1,
  },
  definition: {
    fontSize: 16,
    color: "#c8c8e0",
    lineHeight: 22,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    color: "#8484a9",
    fontSize: 18,
    textAlign: "center",
  },
});
