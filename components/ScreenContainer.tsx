import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  ParamListBase,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
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
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation<BottomTabNavigationProp<ParamListBase>>();
  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
      }

      return () => {};
    }, [])
  );

  const isScreenFocused = useRef(false);

  useEffect(() => {
    const handleTabPress = (e: any) => {
      const currentRoute = route.name;
      const targetRoute = e.target?.split("-")[0] || "";

      if (currentRoute === targetRoute && isScreenFocused.current) {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
        }
      }
    };

    const focusUnsubscribe = navigation.addListener("focus", () => {
      isScreenFocused.current = true;
    });

    const blurUnsubscribe = navigation.addListener("blur", () => {
      isScreenFocused.current = false;
    });

    const tabPressUnsubscribe = navigation.addListener(
      "tabPress",
      handleTabPress
    );

    return () => {
      focusUnsubscribe();
      blurUnsubscribe();
      tabPressUnsubscribe();
    };
  }, [navigation, route.name]);
  const containerStyle = {
    ...styles.container,
    ...style,
  };

  if (scrollable) {
    return (
      <View style={containerStyle}>
        <ScrollView
          ref={scrollViewRef}
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
