import { useState } from "react";
import {
  deleteDiaryEntry,
  getDiaryEntries,
  getDiaryEntryByDate,
  saveDiaryEntry,
} from "../services/dataService";

export const useDbtDiaryContext = () => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDiaryEntry, setCurrentDiaryEntry] = useState(null);

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

  const loadDiaryEntryByDate = async (date) => {
    try {
      // Format date to YYYY-MM-DD
      const dateString =
        date instanceof Date
          ? date.toISOString().substring(0, 10)
          : date.substring(0, 10);

      const entry = await getDiaryEntryByDate(dateString);
      setCurrentDiaryEntry(entry);
      return entry;
    } catch (error) {
      console.error("Error loading diary entry:", error);
      return null;
    }
  };

  const handleSaveDiaryEntry = async (entry) => {
    try {
      const savedEntry = await saveDiaryEntry(entry);

      // Update the current entry if it's for the currently selected date
      if (
        savedEntry.date.substring(0, 10) ===
        selectedDate.toISOString().substring(0, 10)
      ) {
        setCurrentDiaryEntry(savedEntry);
      }

      // Update the entries list
      await loadDiaryEntries();

      return savedEntry;
    } catch (error) {
      console.error("Error saving diary entry:", error);
      throw error;
    }
  };

  const handleDeleteDiaryEntry = async (id) => {
    try {
      const success = await deleteDiaryEntry(id);
      if (success) {
        // If the deleted entry was the current one, clear current entry
        if (currentDiaryEntry && currentDiaryEntry.id === id) {
          setCurrentDiaryEntry(null);
        }

        // Update the entries list
        await loadDiaryEntries();
      }
      return success;
    } catch (error) {
      console.error("Error deleting diary entry:", error);
      return false;
    }
  };

  const handleSelectDate = async (date) => {
    setSelectedDate(date);
    await loadDiaryEntryByDate(date);
  };

  return {
    diaryEntries,
    selectedDate,
    currentDiaryEntry,
    loadDiaryEntries,
    loadDiaryEntryByDate,
    saveDiaryEntry: handleSaveDiaryEntry,
    deleteDiaryEntry: handleDeleteDiaryEntry,
    selectDate: handleSelectDate,
  };
};
