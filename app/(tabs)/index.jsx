import { useScrollToTop } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddBehaviorModal from "../../components/practice/AddBehaviorModal";
import BehaviorsSection from "../../components/practice/BehaviorsSection";
import DaySelector from "../../components/practice/DaySelector";
import { useData } from "../../contexts/DataContext";

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
    <LinearGradient
      colors={["#3f3f68", "#2a2a45"]}
      style={[styles.container, { paddingTop: insets.top + 8 }]}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Практика</Text>
      </View>

      <View style={[styles.fixedContentContainer, { marginTop: 10 }]}>
        <DaySelector onDaySelected={handleDaySelected} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <BehaviorsSection onAddBehavior={handleOpenAddBehaviorModal} />
      </ScrollView>

      <AddBehaviorModal
        visible={isAddBehaviorModalVisible}
        onClose={handleCloseAddBehaviorModal}
      />
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
  fixedContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    marginBottom: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 18,
  },
});
