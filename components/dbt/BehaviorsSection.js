import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useData } from "../../contexts/DataContext";
import { deleteBehavior } from "../../services/dataService";

/**
 * BehaviorsSection component displays a list of tracked behaviors
 */
const BehaviorsSection = ({ onAddBehavior }) => {
  const { behaviors, loadBehaviors } = useData();

  const displayBehaviors = [...behaviors];

  // Handle behavior deletion with confirmation
  const handleDeleteBehavior = async (id, name) => {
    Alert.alert(
      "Удалить поведение",
      `Вы уверены, что хотите удалить "${name}"?`,
      [
        { text: "Отмена", style: "cancel" },
        { 
          text: "Удалить", 
          style: "destructive",
          onPress: async () => {
            const success = await deleteBehavior(id);
            if (success) {
              // Refresh behaviors list after deletion
              loadBehaviors();
            } else {
              Alert.alert("Ошибка", "Не удалось удалить поведение");
            }
          }
        }
      ]
    );
  };

  // Render right actions for swipe
  const renderRightActions = (id, name) => {
    return (
      <TouchableOpacity 
        style={styles.deleteAction}
        onPress={() => handleDeleteBehavior(id, name)}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
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
              <Swipeable
                key={item.id}
                renderRightActions={() => renderRightActions(item.id, item.name)}
                friction={2}
                rightThreshold={40}
              >
                <View style={styles.behaviorItem}>
                  <View style={styles.behaviorInfo}>
                    <Text style={styles.behaviorName}>{item.name}</Text>
                    <Text style={styles.behaviorType}>
                      {item.type === "boolean" ? "Да/Нет" : "Шкала 0-5"}
                    </Text>
                  </View>
                </View>
              </Swipeable>
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
  deleteAction: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    marginBottom: 6,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});

export default BehaviorsSection;
