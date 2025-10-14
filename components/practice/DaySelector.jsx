import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getTodayDate, isFutureDate, getDaysArray } from "../../utils/dateUtils";

export default function DaySelector({
  onDaySelected,
  selectedDate: propSelectedDate,
}) {
  const scrollViewRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(
    propSelectedDate || getTodayDate()
  );
  const [days, setDays] = useState([]);

  const generateDays = () => {
    const daysArray = getDaysArray(getTodayDate());
    setDays(daysArray);

    // Use propSelectedDate if provided, otherwise use today
    const initialDate = propSelectedDate || getTodayDate();
    setSelectedDate(initialDate);

    // Notify parent of initial date
    if (onDaySelected && !propSelectedDate) {
      onDaySelected(getTodayDate());
    }
  };

  useEffect(() => {
    generateDays();
  }, []);

  useEffect(() => {
    if (days.length > 0 && scrollViewRef.current) {
      const todayIndex = days.findIndex((day) => isToday(day));
      if (todayIndex !== -1) {
        const timer = setTimeout(() => {
          const dayWidth = 48;
          scrollViewRef.current?.scrollTo({
            x: todayIndex * dayWidth,
            y: 0,
            animated: true,
          });
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [days]);

  useEffect(() => {
    if (propSelectedDate) {
      setSelectedDate(propSelectedDate);
    }
  }, [propSelectedDate]);

  const handleDayPress = (date) => {
    if (isFutureDate(date)) return;

    setSelectedDate(date);
    if (onDaySelected) {
      onDaySelected(date);
    }
  };

  const isToday = (date) => {
    const today = getTodayDate();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getDayName = (date) => {
    const dayNames = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
    return dayNames[date.getDay()];
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={48}
        scrollEventThrottle={16}
      >
        {days.map((day, index) => {
          const today = isToday(day);
          const selected = isSelected(day);
          const futureDate = isFutureDate(day);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayContainer,
                selected && styles.selectedDayContainer,
                today && styles.todayContainer,
                futureDate && styles.futureDayContainer,
              ]}
              onPress={() => handleDayPress(day)}
              disabled={futureDate}
            >
              <Text
                style={[
                  styles.dayNumber,
                  selected && styles.selectedDayText,
                  today && !selected && styles.todayNumber,
                  futureDate && styles.futureDayText,
                ]}
              >
                {day.getDate()}
              </Text>
              <Text
                style={[
                  styles.dayName,
                  selected && styles.selectedDayText,
                  today && !selected && styles.todayText,
                  futureDate && styles.futureDayText,
                ]}
              >
                {getDayName(day)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  scrollContent: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  dayContainer: {
    width: 46,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  selectedDayContainer: {
    backgroundColor: "#ff3b30",
  },
  todayContainer: {
    borderWidth: 2,
    borderColor: "#ff3b30",
  },
  futureDayContainer: {
    opacity: 0.5,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f0f0f0",
    marginBottom: 3,
  },
  dayName: {
    fontSize: 12,
    color: "#cccccc",
    textTransform: "lowercase",
    fontWeight: "500",
  },
  selectedDayText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  todayNumber: {
    color: "#ff3b30",
  },
  todayText: {
    color: "#ff3b30",
  },
  futureDayText: {
    color: "#666680",
  },
});
