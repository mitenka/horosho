import { useState } from "react";
import { getDiaryEntries } from "../services/dataService";
import { getTodayDate } from "../utils/dateUtils";

export const useDiaryContext = () => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const loadDiaryEntries = async () => {
    try {
      const entries = await getDiaryEntries();
      setDiaryEntries(entries);
      return entries;
    } catch (error) {
      console.error("Error loading diary entries:", error);
      return [];
    }
  };

  const handleSelectDate = async (date) => {
    setSelectedDate(date);
  };

  return {
    diaryEntries,
    selectedDate,
    loadDiaryEntries,
    selectDate: handleSelectDate,
  };
};
