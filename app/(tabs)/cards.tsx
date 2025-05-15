import { StyleSheet, Text, View } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";

export default function Cards() {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Игры и упражнения</Text>
        <Text style={styles.subtitle}>Изучайте навыки ДПТ в игровой форме</Text>
      </View>

      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>
          Здесь будут игры и упражнения для изучения навыков ДПТ
        </Text>
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
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3a3a5e",
    borderRadius: 12,
    padding: 30,
    marginTop: 20,
  },
  emptyStateText: {
    color: "#f0f0f0",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
