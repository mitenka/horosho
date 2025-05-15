import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";

// Определяем тип для модулей с правильной типизацией иконок
type ModuleType = {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  progress: number;
};

export default function Theory() {
  const modules: ModuleType[] = [
    {
      id: 1,
      title: "Основы ДПТ",
      description: "Введение в диалектическую поведенческую терапию",
      icon: "book-outline",
      color: "#2E7D32",
      progress: 0.3,
    },
    {
      id: 2,
      title: "Осознанность",
      description: "Навыки осознанности и присутствия в настоящем моменте",
      icon: "leaf-outline",
      color: "#AED581",
      progress: 0.9,
    },
    {
      id: 3,
      title: "Эмоциональная регуляция",
      description: "Управление сильными эмоциями и импульсами",
      icon: "heart-outline",
      color: "#FF9800",
      progress: 1,
    },
    {
      id: 4,
      title: "Толерантность к дистрессу",
      description: "Как пережить трудные моменты без ухудшения ситуации",
      icon: "shield-outline",
      color: "#F44336",
      progress: 0,
    },
    {
      id: 5,
      title: "Межличностная эффективность",
      description: "Навыки общения и построения здоровых отношений",
      icon: "people-outline",
      color: "#9C27B0",
      progress: 0,
    },
  ];

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Теория ДПТ</Text>
        <Text style={styles.subtitle}>
          Изучайте навыки и применяйте их в жизни
        </Text>
      </View>

      <View style={styles.modulesList}>
        {modules.map((module) => (
          <TouchableOpacity key={module.id} style={styles.moduleCard}>
            <View style={styles.moduleIconContainer}>
              <Ionicons name={module.icon} size={28} color={module.color} />
            </View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDescription} numberOfLines={2}>
                {module.description}
              </Text>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${module.progress * 100}%`,
                      backgroundColor: module.color,
                    },
                  ]}
                />
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#cccccc" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.practiceSection}>
        <Text style={styles.sectionTitle}>Практикуйте навыки</Text>
        <TouchableOpacity style={styles.practiceCard}>
          <View style={styles.practiceContent}>
            <Ionicons name="fitness-outline" size={32} color="#ffd700" />
            <Text style={styles.practiceTitle}>Ежедневные упражнения</Text>
          </View>
          <Text style={styles.practiceDescription}>
            Короткие упражнения для развития навыков
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#cccccc",
  },
  modulesList: {
    marginBottom: 30,
  },
  moduleCard: {
    flexDirection: "row",
    backgroundColor: "#3a3a5e",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  moduleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#444464",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  moduleContent: {
    flex: 1,
    marginRight: 10,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f0f0f0",
    marginBottom: 5,
  },
  moduleDescription: {
    fontSize: 14,
    color: "#cccccc",
    marginBottom: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: "#444464",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#f0f0f0",
    marginBottom: 15,
  },
  practiceSection: {
    marginBottom: 20,
  },
  practiceCard: {
    backgroundColor: "#3a3a5e",
    borderRadius: 12,
    padding: 15,
  },
  practiceContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffd700",
    marginLeft: 15,
  },
  practiceDescription: {
    fontSize: 14,
    color: "#cccccc",
  },
});
