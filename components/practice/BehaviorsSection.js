import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useData } from "../../contexts/DataContext";

/**
 * BehaviorsSection component displays a list of tracked behaviors
 */
const BehaviorsSection = ({ onAddBehavior }) => {
  const { behaviors, deleteBehavior } = useData();
  const [isDeleting, setIsDeleting] = useState(false);

  const displayBehaviors = [...behaviors];
  
  const handleDeleteBehavior = (id, name) => {
    Alert.alert(
      "Удаление поведения",
      `Вы уверены, что хотите удалить "${name}"?`,
      [
        { text: "Отмена", style: "cancel" },
        { 
          text: "Удалить", 
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteBehavior(id);
            } catch (error) {
              console.error("Error deleting behavior:", error);
              Alert.alert("Ошибка", "Не удалось удалить поведение");
            } finally {
              setIsDeleting(false);
            }
          } 
        },
      ]
    );
  };

  // Empty state content
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Добавьте поведения, которые вы хотите отслеживать в своей карточке.
      </Text>
      <Ionicons
        name="clipboard-outline"
        size={48}
        color="rgba(255, 255, 255, 0.3)"
        style={styles.emptyIcon}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Add behavior button */}
      <TouchableOpacity style={styles.addButton} onPress={onAddBehavior}>
        <Ionicons name="add-circle-outline" size={18} color="#fff" />
        <Text style={styles.addButtonText}>Добавить</Text>
      </TouchableOpacity>

      {/* Behaviors list */}
      <View style={styles.listContent}>
        {displayBehaviors.length > 0
          ? displayBehaviors.map((item) => (
              <View key={item.id} style={styles.behaviorItem}>
                <View style={styles.behaviorInfo}>
                  <Text style={styles.behaviorName}>{item.name}</Text>
                  <Text style={styles.behaviorType}>
                    {item.type === "boolean" ? "Да/Нет" : "Шкала 0-5"}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => handleDeleteBehavior(item.id, item.name)}
                  disabled={isDeleting}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                </TouchableOpacity>
              </View>
            ))
          : renderEmptyComponent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  listContent: {
    paddingBottom: 8,
  },
  behaviorItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  behaviorInfo: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  behaviorName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  behaviorType: {
    fontSize: 14,
    color: "#cccccc",
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff3b30",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 6,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#cccccc",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  emptyIcon: {
    marginTop: 16,
    opacity: 0.7,
  },
});

export default BehaviorsSection;
