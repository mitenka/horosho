import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { initializeData } from "../services/dataService";

import { useBehaviorsContext } from "./behaviorsContext";
import { useContentContext } from "./contentContext";
import { useDiaryContext } from "./diaryContext";
import { useReadingProgressContext } from "./readingProgressContext";
import { useUpdateContext } from "./updateContext";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const contentContext = useContentContext();
  const readingProgressContext = useReadingProgressContext();
  const behaviorsContext = useBehaviorsContext();
  const diaryContext = useDiaryContext();
  const updateContext = useUpdateContext();

  const { dictionary, theory, loadContent } = contentContext;
  const {
    readArticles,
    blockProgress,
    loadReadingProgress,
    updateBlockProgress,
    markAsRead,
    markAsUnread,
    checkIfRead,
    getBlockProgress,
  } = readingProgressContext;

  const loadData = async () => {
    try {
      setIsLoading(true);

      const { theory: theoryData } = await loadContent();
      const readArticlesData = await loadReadingProgress();

      await updateBlockProgress(theoryData, readArticlesData);

      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Ошибка при загрузке данных");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const setupData = async () => {
      try {
        await initializeData();

        await loadData();

        await Promise.all([
          behaviorsContext.loadBehaviors(),
          diaryContext.loadDiaryEntries(),
        ]);

        await diaryContext.loadDiaryEntryByDate(new Date());

        updateContext.checkForUpdatesAndReload(
          loadContent,
          loadReadingProgress,
          updateBlockProgress
        );
      } catch (error) {
        console.error("Error in setupData:", error);
        setError("Ошибка при инициализации данных");
      }
    };

    setupData();
  }, []);

  useEffect(() => {
    const appStateRef = { current: AppState.currentState };

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appStateRef.current === "background" && nextAppState === "active") {
        console.log("App has come to the foreground!");
        updateContext.checkForUpdatesAndReload(
          loadContent,
          loadReadingProgress,
          updateBlockProgress
        );
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const value = {
    isLoading,
    error,

    dictionary,
    theory,

    readArticles,
    blockProgress,
    markAsRead: (blockId, articleId) => markAsRead(blockId, articleId, theory),
    markAsUnread: (blockId, articleId) =>
      markAsUnread(blockId, articleId, theory),
    checkIfRead,
    getBlockProgress,

    refreshData: () =>
      updateContext.refreshData(
        loadContent,
        loadReadingProgress,
        updateBlockProgress
      ),
    loadData,

    ...behaviorsContext,

    ...diaryContext,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
