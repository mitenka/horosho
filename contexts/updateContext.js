import { useRef } from "react";
import { InteractionManager } from "react-native";
import {
  checkForUpdates,
  getLastUpdateCheckTime,
} from "../services/dataService";

export const useUpdateContext = () => {
  const lastUpdateCheck = useRef(null);

  const refreshData = async (
    loadContent,
    loadReadingProgress,
    updateBlockProgress
  ) => {
    try {
      const { dictionary, theory } = await loadContent();
      const readArticlesData = await loadReadingProgress();

      await updateBlockProgress(theory, readArticlesData);

      return { dictionary, theory, readArticlesData };
    } catch (err) {
      console.error("Error refreshing data:", err);
      throw err;
    }
  };

  const checkForUpdatesAndReload = async (
    loadContent,
    loadReadingProgress,
    updateBlockProgress
  ) => {
    try {
      if (lastUpdateCheck.current === null) {
        lastUpdateCheck.current = (await getLastUpdateCheckTime()) || 0;
      }

      const now = Date.now();
      // Check if last update check was less than an hour ago
      if (now - lastUpdateCheck.current < 60 * 60 * 1000) {
        console.log(
          "Skipping update check, last check was less than an hour ago 🕰️"
        );
        return { checked: false, updated: false, skipped: true };
      }

      // Use InteractionManager to run update check after animations finish
      return new Promise((resolve) => {
        InteractionManager.runAfterInteractions(async () => {
          try {
            // Check for updates
            const updateResult = await checkForUpdates();

            // If updates are available, reload data
            if (updateResult.updated) {
              console.log("Updates found, reloading data...");
              await refreshData(
                loadContent,
                loadReadingProgress,
                updateBlockProgress
              );
              resolve({ ...updateResult, reloaded: true });
            } else {
              resolve({ ...updateResult, reloaded: false });
            }
          } catch (error) {
            // Silently log error, do not show to user
            console.log(
              "Failed to check for updates, will try again later:",
              error
            );
            resolve({ checked: false, updated: false });
          }
        });
      });
    } catch (error) {
      // Silently log error, do not show to user
      console.log("Failed to check for updates, will try again later:", error);
      return { checked: false, updated: false };
    }
  };

  return {
    lastUpdateCheck,
    refreshData,
    checkForUpdatesAndReload,
  };
};
