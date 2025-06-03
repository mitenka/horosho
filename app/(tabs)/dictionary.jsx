import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import commonStyles from "../../styles/commonStyles";

export default function Dictionary() {
  const terms = [
    {
      id: 1,
      headword: "Анализ поведенческой цепочки",
      definition:
        "Метод анализа последовательности событий, мыслей, эмоций и действий, которые привели к проблемному поведению, с целью выявления точек для вмешательства.",
      relatedTermIds: [2],
    },
    {
      id: 2,
      headword: "Осознанность",
      definition:
        "Наблюдение за фактами и опытом без навешивания ярлыков «хорошо» или «плохо», «правильно» или «неправильно».",
      relatedTermIds: [1],
    },
    {
      id: 3,
      headword: "Мудрый разум",
      definition:
        "Состояние, в котором интегрированы **эмоциональный** и **рациональный** разум, позволяя принимать решения, учитывающие как эмоции, так и логику.",
      relatedTermIds: [1],
    },
  ];

  return (
    <ScreenContainer>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Словарь</Text>
        <Text style={commonStyles.subtitle}>
          Способ быстро вспомнить забытый термин
        </Text>
      </View>

      <View>
        {terms.map((term) => (
          <TouchableOpacity
            key={term.id}
            style={styles.card}
            onPress={() => console.log(`Термин ${term.headword} нажат`)}
          >
            <Text style={styles.title}>{term.headword}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#3a3a5e",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f0f0f0",
    marginBottom: 5,
  },
});
