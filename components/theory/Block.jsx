import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useData } from "../../contexts/DataContext";

const Block = ({ id, title, description, icon, color, onPress, isLast = false }) => {
  const { getBlockProgress } = useData();
  
  // Получаем прогресс для этого блока из контекста
  const progress = getBlockProgress(id);
  
  return (
    <TouchableOpacity style={[styles.card, isLast && styles.lastCard]} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}30` }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: color }]}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progress * 100}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={22}
        color="rgba(255, 255, 255, 0.4)"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(45, 45, 74, 0.6)",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  lastCard: {
    marginBottom: 0,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  content: {
    flex: 1,
    paddingRight: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 15,
    color: "rgba(200, 200, 224, 0.9)",
    lineHeight: 20,
    marginBottom: 12,
  },
  progressContainer: {
    height: 5,
    backgroundColor: "rgba(68, 68, 100, 0.5)",
    borderRadius: 2.5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});

export default Block;
