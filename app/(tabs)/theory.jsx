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

  const theoryGroups = [
    {
      id: "basics",
      title: "Основы",
      blocks: [
        {
          id: "basics-1",
          title: "Основы ДПТ",
          description: "Введение в диалектическую поведенческую терапию",
          icon: "book-outline",
          color: "#2E7D32",
          progress: 0.3,
          onPress: () => handleSectionPress("Основы ДПТ"),
        },
        {
          id: "basics-2",
          title: "История развития",
          description: "Как развивалась ДПТ и её основные принципы",
          icon: "time-outline",
          color: "#1565C0",
          progress: 0.2,
          onPress: () => handleSectionPress("История развития"),
        },
      ],
    },
    {
      id: "mindfulness",
      title: "Осознанность",
      blocks: [
        {
          id: "mindfulness-1",
          title: "Осознанность",
          description: "Навыки осознанности и присутствия в настоящем моменте",
          icon: "leaf-outline",
          color: "#AED581",
          progress: 0.9,
          onPress: () => handleSectionPress("Осознанность"),
        },
        {
          id: "mindfulness-2",
          title: "Медитация",
          description: "Практики медитации для развития осознанности",
          icon: "flower-outline",
          color: "#7CB342",
          progress: 0.6,
          onPress: () => handleSectionPress("Медитация"),
        },
      ],
    },
    {
      id: "emotion-regulation",
      title: "Регуляция эмоций",
      blocks: [
        {
          id: "emotion-1",
          title: "Понимание эмоций",
          description: "Как распознавать и понимать свои эмоции",
          icon: "heart-outline",
          color: "#D32F2F",
          progress: 0.4,
          onPress: () => handleSectionPress("Понимание эмоций"),
        },
        {
          id: "emotion-2",
          title: "Управление эмоциями",
          description: "Стратегии для эффективной регуляции эмоций",
          icon: "shield-outline",
          color: "#C62828",
          progress: 0.3,
          onPress: () => handleSectionPress("Управление эмоциями"),
        },
      ],
    },
    {
      id: "interpersonal",
      title: "Межличностные отношения",
      blocks: [
        {
          id: "interpersonal-1",
          title: "Эффективное общение",
          description: "Навыки коммуникации и построения отношений",
          icon: "people-outline",
          color: "#7B1FA2",
          progress: 0.1,
          onPress: () => handleSectionPress("Эффективное общение"),
        },
        {
          id: "interpersonal-2",
          title: "Границы",
          description: "Установление и поддержание здоровых границ",
          icon: "git-merge-outline",
          color: "#9C27B0",
          progress: 0.0,
          onPress: () => handleSectionPress("Границы"),
        },
      ],
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
        {theoryGroups.map((group, groupIndex) => (
          <View 
            key={group.id} 
            style={[styles.groupContainer, groupIndex === theoryGroups.length - 1 && styles.lastGroupContainer]}
          >
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.blocks.map((block, blockIndex) => (
              <Block
                key={block.id}
                id={block.id}
                title={block.title}
                description={block.description}
                icon={block.icon}
                color={block.color}
                progress={block.progress}
                onPress={block.onPress}
                isLast={blockIndex === group.blocks.length - 1}
              />
            ))}
          </View>
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
  groupContainer: {
    marginBottom: 24,
  },
  lastGroupContainer: {
    marginBottom: 0,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 16,
    marginLeft: 4,
  },
});
