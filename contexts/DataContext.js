import React, { createContext, useContext, useEffect, useState } from "react";
import {
  checkForUpdates,
  getDictionary,
  getTheory,
} from "../services/dataService";

// Create context
const DataContext = createContext();

// Provider
export const DataProvider = ({ children }) => {
  const [dictionary, setDictionary] = useState([]);
  const [theory, setTheory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [dictionaryData, theoryData] = await Promise.all([
        getDictionary(),
        getTheory(),
      ]);

      setDictionary(dictionaryData);
      setTheory(theoryData);
      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Ошибка при загрузке данных");
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const refreshData = async () => {
    try {
      setIsLoading(true);
      const result = await checkForUpdates();

      if (result.updated) {
        await loadData();
        return { success: true, message: "Данные успешно обновлены" };
      }

      return { success: true, message: "Данные уже актуальны" };
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Ошибка при обновлении данных");
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on first render
  useEffect(() => {
    loadData();
  }, []);

  // Context value
  const value = {
    dictionary,
    theory,
    isLoading,
    error,
    refreshData,
    loadData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook for using context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
