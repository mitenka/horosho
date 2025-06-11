import { useScrollToTop } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Block from "../../components/theory/Block";
import theoryData from "../../data/theory.json";
import useTabPressScrollToTop from "../../hooks/useTabPressScrollToTop";
import commonStyles from "../../styles/commonStyles";

export default function Theory() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [blocks, setBlocks] = useState({});

  useScrollToTop(scrollViewRef);
  useTabPressScrollToTop(scrollViewRef);

  useEffect(() => {
    loadTheoryData();
  }, []);

  const loadTheoryData = () => {
    try {
      const blocksMap = {};
      theoryData.blocks.forEach((block) => {
        blocksMap[block.id] = block;
      });

      setBlocks(blocksMap);
      setGroups(theoryData.groups);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке данных теории:", error);
      setLoading(false);
    }
  };

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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#f0f0f0" />
          </View>
        ) : (
          groups.map((group, groupIndex) => (
            <View
              key={groupIndex}
              style={[
                styles.groupContainer,
                groupIndex === groups.length - 1 && styles.lastGroupContainer,
              ]}
            >
              <Text style={styles.groupTitle}>{group.title}</Text>
              {group.blocks.map((blockId, blockIndex) => {
                const block = blocks[blockId];
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
          ))
        )}
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
