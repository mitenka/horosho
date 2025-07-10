import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DaySelector({
  onDaySelected,
  selectedDate: propSelectedDate,
}) {
  const scrollViewRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(
    propSelectedDate || new Date()
  );
  const [days, setDays] = useState([]);

  const generateDays = () => {
    const today = new Date();
    const daysArray = [];

    for (let i = 7; i > 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      daysArray.push(date);
    }

    daysArray.push(today);

    for (let i = 1; i <= 2; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      daysArray.push(date);
    }

    setDays(daysArray);
    setSelectedDate(today);
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

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > today;
  };

  const isToday = (date) => {
    const today = new Date();
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
    marginBottom: 0,
  },
  scrollContent: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  dayContainer: {
    width: 40,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 6,
  },
  selectedDayContainer: {
    backgroundColor: "#ff3b30",
    elevation: 2,
    shadowColor: "#ff3b30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  todayContainer: {
    borderWidth: 1,
    borderColor: "#ff3b30",
  },
  futureDayContainer: {
    opacity: 0.5,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 2,
  },
  dayName: {
    fontSize: 10,
    color: "#cccccc",
    textTransform: "lowercase",
  },
  selectedDayText: {
    color: "#ffffff",
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
