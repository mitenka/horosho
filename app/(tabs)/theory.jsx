import { useScrollToTop } from "@react-navigation/native";
import { useRef } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Block from "../../components/theory/Block";
import useTabPressScrollToTop from "../../hooks/useTabPressScrollToTop";
import commonStyles from "../../styles/commonStyles";

export default function Theory() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);

  useScrollToTop(scrollViewRef);
  useTabPressScrollToTop(scrollViewRef);

  const handleSectionPress = (title) => {
    console.log(`Модуль ${title} нажат`);
  };

  const blocks = [
    {
      id: 1,
      title: "Основы ДПТ",
      description: "Введение в диалектическую поведенческую терапию",
      icon: "book-outline",
      color: "#2E7D32",
      progress: 0.3,
      onPress: () => handleSectionPress("Основы ДПТ"),
    },
    {
      id: 2,
      title: "Осознанность",
      description: "Навыки осознанности и присутствия в настоящем моменте",
      icon: "leaf-outline",
      color: "#AED581",
      progress: 0.9,
      onPress: () => handleSectionPress("Осознанность"),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.titleContainer}>
        <Text style={commonStyles.title}>Теория</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {blocks.map((block) => (
          <Block
            key={block.id}
            id={block.id}
            title={block.title}
            description={block.description}
            icon={block.icon}
            color={block.color}
            progress={block.progress}
            onPress={block.onPress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3a3a5e",
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
