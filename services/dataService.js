import AsyncStorage from "@react-native-async-storage/async-storage";

// Import from other service modules
import { getDataVersions, getDictionary, getTheory } from "./contentService";
import {
  addBehavior,
  deleteBehavior,
  getBehaviorEntry,
  getBehaviors,
  getDiaryCompletionStatus,
  getDiaryEntries,
  getSkillsAssessment,
  getSkillsAssessmentOptions,
  removeBehaviorEntry,
  saveBehaviorEntry,
  saveDiaryCompletionStatus,
  saveSkillsAssessment,
  updateBehavior,
} from "./diaryService";
import {
  getReadArticles,
  markArticleAsRead,
  markArticleAsUnread,
  resetReadingProgress,
} from "./readingProgressService";
import {
  getSettings,
  initializeSettings,
  saveSettings,
  updateSetting,
} from "./settingsService";
import { STORAGE_KEYS, dictionary, meta, theory } from "./storageConfig";
import {
  checkForUpdates,
  getLastUpdateCheckTime,
  updateLastCheckTime,
} from "./updateService";

// Helper function for initialization
const checkStorageData = async () => {
  try {
    const [dictionary, theory] = await AsyncStorage.multiGet([
      STORAGE_KEYS.DICTIONARY,
      STORAGE_KEYS.THEORY,
    ]);

    const versions = await getDataVersions();

    return {
      hasDictionary: !!dictionary[1],
      hasTheory: !!theory[1],
      ...versions,
    };
  } catch (error) {
    console.error("Error checking AsyncStorage data:", error);
    return {
      hasDictionary: false,
      hasTheory: false,
      dictionaryVersion: "0",
      theoryVersion: "0",
    };
  }
};

// Initialize data function
export const initializeData = async () => {
  try {
    console.log("Initializing data...");

    const storageData = await checkStorageData();
    console.log("Current AsyncStorage data:", storageData);

    const storageOperations = [];

    // Check if the dictionary needs to be updated
    if (
      !storageData.hasDictionary ||
      (storageData.dictionaryVersion &&
        parseInt(storageData.dictionaryVersion) <
          parseInt(meta.dictionaryVersion))
    ) {
      console.log("Loading dictionary from file...");
      storageOperations.push(
        AsyncStorage.setItem(
          STORAGE_KEYS.DICTIONARY,
          JSON.stringify(dictionary)
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.DICTIONARY_VERSION,
          meta.dictionaryVersion
        )
      );
    }

    // Check if the theory needs to be updated
    if (
      !storageData.hasTheory ||
      (storageData.theoryVersion &&
        parseInt(storageData.theoryVersion) < parseInt(meta.theoryVersion))
    ) {
      console.log("Loading theory from file...");
      storageOperations.push(
        AsyncStorage.setItem(STORAGE_KEYS.THEORY, JSON.stringify(theory)),
        AsyncStorage.setItem(STORAGE_KEYS.THEORY_VERSION, meta.theoryVersion)
      );
    }

    // Initialize settings with default values if needed
    await initializeSettings();

    if (storageOperations.length > 0) {
      await Promise.all(storageOperations);
      console.log("Data successfully updated in AsyncStorage");
    } else {
      console.log("Data in AsyncStorage is up to date");
    }
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

// Re-export all functions from other modules
export {
  addBehavior,
  checkForUpdates,
  deleteBehavior,
  // From diaryService
  getBehaviorEntry,
  getBehaviors,
  getDataVersions,
  getDiaryEntries,
  // From dictionaryService
  getDictionary,
  getLastUpdateCheckTime,
  // From readingProgressService
  getReadArticles,
  // From settingsService
  getDiaryCompletionStatus,
  getSettings,
  getSkillsAssessment,
  getSkillsAssessmentOptions,
  getTheory,
  initializeSettings,
  markArticleAsRead,
  markArticleAsUnread,
  removeBehaviorEntry,
  resetReadingProgress,
  saveBehaviorEntry,
  saveDiaryCompletionStatus,
  saveSkillsAssessment,
  saveSettings,
  updateBehavior,
  // From updateService
  updateLastCheckTime,
  updateSetting,
};
