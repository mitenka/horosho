import { useScrollToTop } from "@react-navigation/native";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddBehaviorModal from "../../components/dbt/AddBehaviorModal";
import BehaviorsSection from "../../components/dbt/BehaviorsSection";
import DaySelector from "../../components/practice/DaySelector";
import { useData } from "../../contexts/DataContext";
import commonStyles from "../../styles/commonStyles";

export default function Index() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const [isAddBehaviorModalVisible, setIsAddBehaviorModalVisible] =
    useState(false);
  const { selectedDate, selectDate } = useData();

  useScrollToTop(scrollViewRef);

  const handleDaySelected = (date) => {
    selectDate(date);
  };

  const handleOpenAddBehaviorModal = () => {
    setIsAddBehaviorModalVisible(true);
  };

  const handleCloseAddBehaviorModal = () => {
    setIsAddBehaviorModalVisible(false);
  };
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.titleContainer}>
        <Text style={commonStyles.title}>Практика</Text>
      </View>

      <View style={styles.fixedContentContainer}>
        <DaySelector onDaySelected={handleDaySelected} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <BehaviorsSection onAddBehavior={handleOpenAddBehaviorModal} />
      </ScrollView>

      <AddBehaviorModal
        visible={isAddBehaviorModalVisible}
        onClose={handleCloseAddBehaviorModal}
      />
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
  fixedContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4, // Уменьшили с 12 до 4
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 0, // Убрали верхний отступ
    paddingBottom: 12,
  },
  sectionContainer: {
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
});
