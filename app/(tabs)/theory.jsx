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
  const theoryGroups = [];

  useScrollToTop(scrollViewRef);
  useTabPressScrollToTop(scrollViewRef);

  const handleSectionPress = (blockId) => {
    console.log(`Модуль ${blockId} нажат`);
  };

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
            key={groupIndex}
            style={[
              styles.groupContainer,
              groupIndex === theoryGroups.length - 1 &&
                styles.lastGroupContainer,
            ]}
          >
            <Text style={styles.groupTitle}>{group.title}</Text>
            {group.blocks.map((blockId, blockIndex) => {
              const block = theoryBlocks[blockId];
              if (!block) return null;

              return (
                <Block
                  key={block.id}
                  id={block.id}
                  title={block.title}
                  description={block.description}
                  icon={block.icon}
                  color={block.color}
                  progress={0}
                  onPress={() => handleSectionPress(block.id)}
                  isLast={blockIndex === group.blocks.length - 1}
                />
              );
            })}
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
    color: "#f0f0f0",
    marginBottom: 16,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
});
