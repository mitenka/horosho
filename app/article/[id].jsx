import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ArticleElement from "../../components/article/ArticleElement";
import { useData } from "../../contexts/DataContext";

export default function ArticleScreen() {
  const scrollViewRef = useRef(null);
  const { id } = useLocalSearchParams();
  const { theory, isLoading, checkIfRead, markAsRead, markAsUnread } =
    useData();
  const [isRead, setIsRead] = useState(false);

  // Find the article by ID
  let article = null;
  let block = null;

  // Search through all blocks to find the article
  if (theory?.blocks) {
    for (const b of theory.blocks) {
      if (b.articles) {
        const foundArticle = b.articles.find((a) => a.id === id);
        if (foundArticle) {
          article = foundArticle;
          block = b;
          break;
        }
      }
    }
  }

  // Check if the article is marked as read when it loads
  useEffect(() => {
    if (block && article) {
      setIsRead(checkIfRead(block.id, article.id));
    }
  }, [block, article, checkIfRead]);

  // Animation values
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Animated styles for the button
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const toggleReadStatus = async () => {
    if (!block || !article) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    scale.value = withTiming(0.97, { duration: 150 });

    if (isRead) {
      await markAsUnread(block.id, article.id);
    } else {
      await markAsRead(block.id, article.id);

      translateY.value = withTiming(-3, { duration: 200 });
      opacity.value = withTiming(0.9, { duration: 150 });

      setTimeout(() => {
        translateY.value = withTiming(0, { duration: 200 });
        opacity.value = withTiming(1, { duration: 250 });

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 200);
    }
    setTimeout(() => {
      scale.value = withTiming(1, { duration: 150 });
    }, 150);

    setIsRead(!isRead);
  };

  // Show loading indicator if data is being loaded
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "",
            headerBackTitle: "Назад",
            headerStyle: {
              backgroundColor: "#3a3a5e",
            },
            headerTintColor: "#f0f0f0",
            headerShadowVisible: false,
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#c8c8e0" />
          <Text style={styles.loadingText}>Загрузка статьи...</Text>
        </View>
      </View>
    );
  }

  // Show message if article not found
  if (!article) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: "",
            headerBackTitle: "Назад",
            headerStyle: {
              backgroundColor: "#3a3a5e",
            },
            headerTintColor: "#f0f0f0",
            headerShadowVisible: false,
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Статья не найдена</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          headerBackTitle: "Назад",
          headerStyle: {
            backgroundColor: "#3a3a5e",
          },
          headerTintColor: "#f0f0f0",
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.articleTitle}>{article.title}</Text>

        <View style={styles.articleMeta}>
          <Ionicons
            name="time-outline"
            size={16}
            color={block?.color || "#7CB342"}
          />
          <Text style={[styles.readTime, { color: block?.color || "#7CB342" }]}>
            {article.readTime} мин
          </Text>
        </View>

        {article.elements &&
          article.elements.map((element, index) => (
            <ArticleElement key={index} element={element} />
          ))}

        <View style={styles.readStatusContainer}>
          <Animated.View style={animatedStyle}>
            <TouchableOpacity
              style={[styles.readButton, isRead && styles.readButtonActive]}
              onPress={toggleReadStatus}
              activeOpacity={0.9}
            >
              <Ionicons
                name={isRead ? "checkmark-circle" : "checkmark-circle-outline"}
                size={26}
                color={isRead ? "#ffffff" : "#c8c8e0"}
                style={styles.readIcon}
              />
              <Text
                style={[
                  styles.readButtonText,
                  isRead && styles.readButtonTextActive,
                ]}
              >
                {isRead ? "Прочитано" : "Отметить как прочитанное"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3a3a5e",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  articleTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#f0f0f0",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  readTime: {
    fontSize: 15,
    marginLeft: 6,
    opacity: 0.9,
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
  readStatusContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  readButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(45, 45, 74, 0.8)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 240,
  },
  readButtonActive: {
    backgroundColor: "#7CB342",
    borderColor: "#7CB342",
    shadowColor: "#7CB342",
    shadowOpacity: 0.4,
  },
  readIcon: {
    marginRight: 10,
  },
  readButtonText: {
    fontSize: 18,
    color: "#c8c8e0",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  readButtonTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
