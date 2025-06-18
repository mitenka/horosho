import { Ionicons } from "@expo/vector-icons";
import { useScrollToTop } from "@react-navigation/native";
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
import commonStyles from "../../styles/commonStyles";

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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.titleContainer}>
          <Text style={commonStyles.title}>Словарь</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a0a0d0" />
          <Text style={styles.loadingText}>Загрузка словаря...</Text>
        </View>
      </View>
    );
  }

  // Show error message if something went wrong
  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.titleContainer}>
          <Text style={commonStyles.title}>Словарь</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Произошла ошибка при загрузке словаря
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.titleContainer}>
        <Text style={commonStyles.title}>Словарь</Text>
      </View>
      <View style={styles.fixedContentContainer}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
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
              <Ionicons name="close-circle" size={20} color="#8484a9" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={filteredTerms}
        renderItem={renderTermCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Термины не найдены</Text>
          </View>
        }
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#c8c8e0",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#3a3a5e",
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fixedContentContainer: {
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#2d2d4a",
    borderRadius: 16,
    width: "100%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a5e",
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#f0f0f0",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  definitionContainer: {
    marginBottom: 24,
  },
  definitionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#a0a0d0",
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#f0f0f0",
  },
  relatedTermsContainer: {
    marginBottom: 16,
  },
  relatedTermsLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#a0a0d0",
    marginBottom: 12,
  },
  relatedTermButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3a5e",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  relatedTermIcon: {
    marginRight: 8,
  },
  relatedTermText: {
    fontSize: 15,
    color: "#f0f0f0",
    fontWeight: "500",
  },
  // Search container
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d2d4a",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#f0f0f0",
    fontSize: 16,
    height: "100%",
  },
  clearButton: {
    padding: 4,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#3a3a5e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#f0f0f0",
    flex: 1,
  },
  definition: {
    fontSize: 14,
    color: "#c8c8e0",
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyText: {
    color: "#8484a9",
    fontSize: 16,
  },
});
