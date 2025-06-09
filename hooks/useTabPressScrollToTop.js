import { useRoute } from "@react-navigation/native";
import { useFocusEffect, useNavigation } from "expo-router";
import React, { useEffect, useRef } from "react";

export default function useTabPressScrollToTop(scrollRef, options = {}) {
  const navigation = useNavigation();
  const route = useRoute();
  const ref = scrollRef || useRef(null);
  const { resetOnFocus = true, animated = false } = options;
  const isScreenFocused = useRef(false);

  const scrollToTop = (useAnimation = true) => {
    if (ref.current) {
      if (typeof ref.current.scrollToOffset === "function") {
        // For FlatList
        ref.current.scrollToOffset({ offset: 0, animated: useAnimation });
      } else if (typeof ref.current.scrollTo === "function") {
        // For ScrollView
        ref.current.scrollTo({ y: 0, animated: useAnimation });
      }
    }
  };

  // Reset position on focus (like in ScreenContainer)
  useFocusEffect(
    React.useCallback(() => {
      if (resetOnFocus && ref.current) {
        scrollToTop(animated);
      }

      isScreenFocused.current = true;

      return () => {
        isScreenFocused.current = false;
      };
    }, [animated, resetOnFocus])
  );

  useEffect(() => {
    // Subscribe to tabPress event
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // Check if the current tab is focused
      const isFocused = navigation.isFocused();

      // Check if the target route matches the current route (like in ScreenContainer)
      const currentRoute = route.name;
      const targetRoute = e.target?.split("-")[0] || "";

      // If the tab is already focused or it's the same route and the screen is focused, scroll to top
      if (
        isFocused ||
        (currentRoute === targetRoute && isScreenFocused.current)
      ) {
        e.preventDefault(); // Prevent default behavior
        scrollToTop(true); // Always animate on tab press
      }
    });

    // Unsubscribe on unmount
    return unsubscribe;
  }, [navigation, ref]);

  return ref;
}
