import { useScrollToTop } from "@react-navigation/native";
import { router } from "expo-router";
import { useRef } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Block from "../../components/theory/Block";
import { useData } from "../../contexts/DataContext";
import commonStyles from "../../styles/commonStyles";

export default function Theory() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const { theory, isLoading, error } = useData();

  const theoryGroups = theory?.groups || [];

  useScrollToTop(scrollViewRef);

  const handleSectionPress = (blockId) => {
    console.log(`Module ${blockId} pressed`);
    router.push(`/block/${blockId}`);
  };

  // Show loading indicator if data is being loaded
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.titleContainer}>
          <Text style={commonStyles.title}>Теория</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#c8c8e0" />
          <Text style={styles.loadingText}>Загрузка данных...</Text>
        </View>
      </View>
    );
  }

  // Show error message if something went wrong
  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.titleContainer}>
          <Text style={commonStyles.title}>Теория</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Произошла ошибка при загрузке</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.titleContainer}>
        <Text style={commonStyles.title}>Теория</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {theoryGroups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Нет доступных материалов</Text>
          </View>
        ) : (
          theoryGroups.map((group, groupIndex) => (
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
                // Find block by ID
                const block = theory.blocks.find((b) => b.id === blockId);
                if (!block) {
                  return null;
                }

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
          ))
        )}
      </ScrollView>
    </View>
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#c8c8e0",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#c8c8e0",
    textAlign: "center",
  },
});
