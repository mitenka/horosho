import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";

type ScreenContainerProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
};

export default function ScreenContainer({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
}: ScreenContainerProps) {
  const containerStyle = {
    ...styles.container,
    ...style,
  };

  if (scrollable) {
    return (
      <View style={containerStyle}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return <View style={[containerStyle, { padding: 20 }]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#323248",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
});
