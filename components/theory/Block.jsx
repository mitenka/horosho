import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Block = ({ title, description, icon, color, progress, onPress, isLast = false }) => {
  return (
    <TouchableOpacity style={[styles.card, isLast && styles.lastCard]} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}30` }]}>
        <Ionicons name={icon} size={26} color={color} />
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
        size={20}
        color="rgba(255, 255, 255, 0.3)"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(45, 45, 74, 0.6)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  lastCard: {
    marginBottom: 0,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
    paddingRight: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 14,
    color: "rgba(200, 200, 224, 0.9)",
    lineHeight: 19,
    marginBottom: 10,
  },
  progressContainer: {
    height: 4,
    backgroundColor: "rgba(68, 68, 100, 0.5)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});

export default Block;
