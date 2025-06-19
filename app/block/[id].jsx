import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useData } from "../../contexts/DataContext";

export default function BlockArticles() {
  const scrollViewRef = useRef(null);
  const { id } = useLocalSearchParams();
  const { theory } = useData();

  // Find the block by ID
  const block = theory?.blocks?.find((b) => b.id === id);
  const articles = block?.articles || [];

  // Handle article press
  const handleArticlePress = (articleId) => {
    console.log(`Article ${articleId} pressed`);
    router.push(`/article/${articleId}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          headerBackTitle: "Теория",
          headerStyle: {
            backgroundColor: "#3a3a5e",
          },
          headerTintColor: "#f0f0f0",
          headerShadowVisible: false,
        }}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.blockTitle}>{block.title}</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {articles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Нет доступных статей</Text>
          </View>
        ) : (
          articles.map((article, index) => (
            <TouchableOpacity
              key={article.id}
              style={[
                styles.articleCard,
                index === articles.length - 1 && styles.lastArticleCard,
              ]}
              onPress={() => handleArticlePress(article.id)}
              activeOpacity={0.7}
            >
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <View style={styles.articleMeta}>
                  <Ionicons name="time-outline" size={14} color={block.color} />
                  <Text style={[styles.readTime, { color: block.color }]}>
                    {article.readTime} мин
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
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
  blockTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f0f0f0",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  articleCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  lastArticleCard: {
    marginBottom: 0,
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  readTime: {
    fontSize: 13,
    marginLeft: 4,
    opacity: 0.9,
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
