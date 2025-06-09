import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Block = ({ title, description, icon, color, progress, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
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
      <Ionicons name="chevron-forward" size={24} color="#cccccc" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#2d2d4a",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#444464",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#f0f0f0",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#c8c8e0",
    lineHeight: 20,
    marginBottom: 10,
  },
  progressContainer: {
    height: 5,
    backgroundColor: "#444464",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
});

export default Block;
