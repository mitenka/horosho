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
import { LinearGradient } from "expo-linear-gradient";
import Block from "../../components/theory/Block";
import { useData } from "../../contexts/DataContext";

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
      <LinearGradient
        colors={["#3f3f68", "#2a2a45"]}
        style={[styles.container, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>Теория</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#c8c8e0" />
          <Text style={styles.loadingText}>Загрузка данных...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Show error message if something went wrong
  if (error) {
    return (
      <LinearGradient
        colors={["#3f3f68", "#2a2a45"]}
        style={[styles.container, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>Теория</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Произошла ошибка при загрузке</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#3f3f68", "#2a2a45"]}
      style={[styles.container, { paddingTop: insets.top + 8 }]}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Теория</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView, { marginTop: 10 }]}
        contentContainerStyle={[styles.scrollViewContent, { paddingBottom: insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
        bounces={true}
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  groupContainer: {
    marginBottom: 28,
  },
  lastGroupContainer: {
    marginBottom: 0,
  },
  groupTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f0f0f0",
    marginBottom: 18,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 18,
    color: "#c8c8e0",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 20,
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
    fontSize: 20,
    color: "#c8c8e0",
    textAlign: "center",
  },
});
