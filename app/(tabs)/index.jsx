import { useScrollToTop } from "@react-navigation/native";
import { useRef } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DaySelector from "../../components/practice/DaySelector";
import useTabPressScrollToTop from "../../hooks/useTabPressScrollToTop";
import commonStyles from "../../styles/commonStyles";

export default function Index() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);

  useScrollToTop(scrollViewRef);

  useTabPressScrollToTop(scrollViewRef);
  const handleDaySelected = (date) => {
    console.log("Selected date:", date);
  };
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
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
      ></ScrollView>
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
  fixedContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
