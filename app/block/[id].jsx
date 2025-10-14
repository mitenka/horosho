import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomBackButton from "../../components/CustomBackButton";
import { useData } from "../../contexts/DataContext";

export default function BlockArticles() {
  const scrollViewRef = useRef(null);
  const { id } = useLocalSearchParams();
  const { theory, checkIfRead } = useData();

  // Find the block by ID
  const block = theory?.blocks?.find((b) => b.id === id);
  const articles = block?.articles || [];

  // Handle article press
  const handleArticlePress = (articleId) => {
    console.log(`Article ${articleId} pressed`);
    router.push(`/article/${articleId}`);
  };

  return (
    <LinearGradient colors={["#3a3a5e", "#2d2d4a"]} style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "#3a3a5e",
          },
          headerTintColor: "#f0f0f0",
          headerShadowVisible: false,
          headerLeft: () => <CustomBackButton title="Теория" color="#f0f0f0" />,
          contentStyle: {
            backgroundColor: "#2d2d4a",
          },
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
          articles.map((article, index) => {
            const isArticleRead = checkIfRead(block.id, article.id);
            return (
              <TouchableOpacity
                key={article.id}
                style={[
                  styles.articleCard,
                  index === articles.length - 1 && styles.lastArticleCard,
                  isArticleRead && styles.articleCardRead,
                ]}
                onPress={() => handleArticlePress(article.id)}
                activeOpacity={0.7}
              >
                <View style={styles.articleContent}>
                  <Text
                    style={[
                      styles.articleTitle,
                      isArticleRead && styles.articleTitleRead,
                    ]}
                  >
                    {article.title}
                  </Text>
                  <View style={styles.articleMeta}>
                    {isArticleRead && (
                      <View style={styles.readStatusIndicator}>
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color={block.color}
                        />
                        <Text
                          style={[
                            styles.readStatusText,
                            { color: block.color },
                          ]}
                        >
                          Прочитано
                        </Text>
                      </View>
                    )}
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color={block.color}
                    />
                    <Text style={[styles.readTime, { color: block.color }]}>
                      {article.readTime} мин
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
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
    marginBottom: 10,
  },
  blockTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f0f0f0",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  articleCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  articleCardRead: {
    backgroundColor: "rgba(124, 179, 66, 0.08)",
    borderColor: "rgba(124, 179, 66, 0.2)",
  },
  lastArticleCard: {
    marginBottom: 0,
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  articleTitleRead: {
    fontWeight: "600",
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  readStatusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  readStatusText: {
    fontSize: 13,
    marginLeft: 4,
    opacity: 0.9,
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
