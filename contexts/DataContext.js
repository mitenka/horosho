import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, InteractionManager } from "react-native";
import {
  checkForUpdates,
  getDictionary,
  getReadArticles,
  getTheory,
  initializeData,
  markArticleAsRead,
  markArticleAsUnread,
  getLastUpdateCheckTime,
} from "../services/dataService";

// Create context
const DataContext = createContext();

// Provider
export const DataProvider = ({ children }) => {
  const [dictionary, setDictionary] = useState([]);
  const [theory, setTheory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readArticles, setReadArticles] = useState({});
  const [blockProgress, setBlockProgress] = useState({});
  const appState = useRef(AppState.currentState);
  const lastUpdateCheck = useRef(null);

  // Load data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [dictionaryData, theoryData, readArticlesData] = await Promise.all([
        getDictionary(),
        getTheory(),
        getReadArticles(),
      ]);

      setDictionary(dictionaryData);
      setTheory(theoryData);
      setReadArticles(readArticlesData);
      setError(null);

      // Calculate progress for each block
      await updateBlockProgress(theoryData, readArticlesData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Ошибка при загрузке данных");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate progress for a single block
  const calculateSingleBlockProgress = (
    blockId,
    theoryData,
    readArticlesData
  ) => {
    const block = theoryData.blocks.find((b) => b.id === blockId);
    if (!block || !block.articles || block.articles.length === 0) {
      return 0;
    }

    const totalArticles = block.articles.length;
    const readCount = readArticlesData[blockId]?.length || 0;
    return readCount / totalArticles;
  };

  // Update progress for all blocks
  const updateBlockProgress = async (theoryData, readArticlesData) => {
    try {
      const progress = {};

      if (theoryData && theoryData.blocks) {
        for (const block of theoryData.blocks) {
          progress[block.id] = calculateSingleBlockProgress(
            block.id,
            theoryData,
            readArticlesData
          );
        }
      }

      setBlockProgress(progress);
    } catch (err) {
      console.error("Error updating block progress:", err);
    }
  };

  // Mark article as read
  const markAsRead = async (blockId, articleId) => {
    try {
      const success = await markArticleAsRead(blockId, articleId);
      if (success) {
        // Update local state
        const updatedReadArticles = { ...readArticles };
        if (!updatedReadArticles[blockId]) {
          updatedReadArticles[blockId] = [];
        }
        if (!updatedReadArticles[blockId].includes(articleId)) {
          updatedReadArticles[blockId].push(articleId);
          setReadArticles(updatedReadArticles);

          // Update progress
          const updatedProgress = { ...blockProgress };
          updatedProgress[blockId] = calculateSingleBlockProgress(
            blockId,
            theory,
            updatedReadArticles
          );
          setBlockProgress(updatedProgress);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error marking article as read:", err);
      return false;
    }
  };

  // Mark article as unread
  const markAsUnread = async (blockId, articleId) => {
    try {
      const success = await markArticleAsUnread(blockId, articleId);
      if (success) {
        // Update local state
        const updatedReadArticles = { ...readArticles };
        if (updatedReadArticles[blockId]) {
          updatedReadArticles[blockId] = updatedReadArticles[blockId].filter(
            (id) => id !== articleId
          );
          if (updatedReadArticles[blockId].length === 0) {
            delete updatedReadArticles[blockId];
          }
          setReadArticles(updatedReadArticles);

          // Update progress
          const updatedProgress = { ...blockProgress };
          updatedProgress[blockId] = calculateSingleBlockProgress(
            blockId,
            theory,
            updatedReadArticles
          );
          setBlockProgress(updatedProgress);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error marking article as unread:", err);
      return false;
    }
  };

  // Check if article is read
  const checkIfRead = (blockId, articleId) => {
    return readArticles[blockId] && readArticles[blockId].includes(articleId);
  };

  // Get progress for a block
  const getBlockProgress = (blockId) => {
    return blockProgress[blockId] || 0;
  };

  // Refresh data from AsyncStorage to memory
  const refreshData = async () => {
    try {
      setIsLoading(true);

      // Load data from AsyncStorage to update the state
      await loadData();
      return { success: true, message: "Данные успешно обновлены" };
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Ошибка при обновлении данных");
      return { success: false, message: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Check for updates and reload data if needed
  const checkForUpdatesAndReload = async () => {
    try {
      // Get the last update check time from AsyncStorage using the existing service function
      if (lastUpdateCheck.current === null) {
        lastUpdateCheck.current = await getLastUpdateCheckTime() || 0;
      }
      
      const now = Date.now();
      // Check if at least 1 hour has passed since last update check
      if (now - lastUpdateCheck.current < 60 * 60 * 1000) {
        console.log("Skipping update check, last check was less than 1 hour ago");
        return;
      }
      
      // The checkForUpdates function will update the last check timestamp internally

      // Check for updates after animations complete
      InteractionManager.runAfterInteractions(async () => {
        try {
          const updateResult = await checkForUpdates();
          if (updateResult.updated) {
            // Reload data only if there were updates
            await loadData();
          }
        } catch (error) {
          console.log("Failed to check for updates:", error);
        }
      });
    } catch (error) {
      console.log("Error in checkForUpdatesAndReload:", error);
    }
  };

  // Load data on first render
  useEffect(() => {
    const setupData = async () => {
      try {
        // First initialize data from local files if needed
        await initializeData();

        // Then load data from AsyncStorage to show content immediately
        await loadData();

        // Check for updates in background
        checkForUpdatesAndReload();
      } catch (error) {
        console.error("Error in setupData:", error);
        setError("Ошибка при инициализации данных");
      }
    };

    setupData();
  }, []);

  // Monitor app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // App has come to the foreground
      if (appState.current === "background" && nextAppState === "active") {
        console.log("App has come to the foreground!");
        checkForUpdatesAndReload();
      }

      // Update app state reference
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Context value
  const value = {
    dictionary,
    theory,
    isLoading,
    error,
    readArticles,
    blockProgress,
    refreshData,
    loadData,
    markAsRead,
    markAsUnread,
    checkIfRead,
    getBlockProgress,
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
