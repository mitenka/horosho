import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getDailyComment, saveDailyComment } from "../../services/dataService";
import { formatDateToString } from "../../utils/dateUtils";

const MAX_COMMENT_LENGTH = 2000;

const DailyComment = ({ selectedDate, scrollViewRef }) => {
  const [comment, setComment] = useState("");
  // Refs so flush() sees the latest values when called from cleanup or AppState
  const commentRef = useRef("");
  const dateStringRef = useRef(null);
  const lastSavedRef = useRef("");
  const isFocusedRef = useRef(false);

  const scrollToInput = () => {
    scrollViewRef?.current?.scrollToEnd({ animated: true });
  };

  const flush = async () => {
    if (!dateStringRef.current) return;
    if (commentRef.current.trim() === lastSavedRef.current.trim()) return;
    lastSavedRef.current = commentRef.current;
    await saveDailyComment(dateStringRef.current, commentRef.current);
  };

  // Load comment for the selected date, saving pending text for the previous date first
  useEffect(() => {
    const loadComment = async () => {
      await flush();

      if (!selectedDate) {
        dateStringRef.current = null;
        setComment("");
        commentRef.current = "";
        lastSavedRef.current = "";
        return;
      }

      try {
        const dateString = formatDateToString(selectedDate);
        dateStringRef.current = dateString;
        const savedComment = await getDailyComment(dateString);
        setComment(savedComment);
        commentRef.current = savedComment;
        lastSavedRef.current = savedComment;
      } catch (error) {
        console.error("Error loading daily comment:", error);
      }
    };

    loadComment();
  }, [selectedDate]);

  // Save pending text when the app goes to background or the component unmounts
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        flush();
      }
    });

    return () => {
      subscription.remove();
      flush();
    };
  }, []);

  // Scroll the input above the keyboard once it has appeared; the small delay
  // lets the ScrollView apply its keyboard padding/insets first
  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidShow", () => {
      if (isFocusedRef.current) {
        setTimeout(() => {
          scrollViewRef?.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    });

    return () => subscription.remove();
  }, [scrollViewRef]);

  const handleFocus = () => {
    isFocusedRef.current = true;
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    flush();
  };

  const handleChangeText = (text) => {
    setComment(text);
    commentRef.current = text;
  };

  if (!selectedDate) {
    return null;
  }

  return (
    <View>
      <Text style={styles.title}>Комментарий</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onContentSizeChange={() => {
            // Keep the cursor visible while the multiline input grows
            if (isFocusedRef.current) {
              scrollToInput();
            }
          }}
          placeholder="Заметка о дне…"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          multiline
          scrollEnabled={false}
          textAlignVertical="top"
          maxLength={MAX_COMMENT_LENGTH}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
    textAlign: "left",
    letterSpacing: 0.4,
  },
  inputContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  input: {
    minHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    lineHeight: 22,
    color: "#fff",
    letterSpacing: 0.2,
  },
});

export default DailyComment;
