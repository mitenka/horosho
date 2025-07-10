import AsyncStorage from "@react-native-async-storage/async-storage";

import dictionary from "../data/dictionary.json";
import meta from "../data/meta.json";
import theory from "../data/theory.json";

const STORAGE_KEYS = {
  DICTIONARY: "@horosho/dictionary",
  THEORY: "@horosho/theory",
  DICTIONARY_VERSION: "@horosho/dictionary_version",
  THEORY_VERSION: "@horosho/theory_version",
  LAST_UPDATE_CHECK: "@horosho/last_update_check",
  READ_ARTICLES: "@horosho/read_articles",
  // DBT Diary Card storage keys
  DBT_BEHAVIORS: "@horosho/dbt/behaviors",
  DBT_DIARY_ENTRIES: "@horosho/dbt/diary_entries",
  DBT_SETTINGS: "@horosho/dbt/settings",
};

// GitHub raw content configuration
const GITHUB_USER = "mitenka";
const GITHUB_REPO = "horosho";
const GITHUB_BRANCH = "main";
const API_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/data`;

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

/**
 * Retrieves dictionary from AsyncStorage
 * @returns {Promise<Array>} - array of dictionary articles
 */
export const getDictionary = async () => {
  try {
    const dictionaryData = await AsyncStorage.getItem(STORAGE_KEYS.DICTIONARY);
    return dictionaryData ? JSON.parse(dictionaryData) : [];
  } catch (error) {
    console.error("Error getting dictionary:", error);
    return [];
  }
};

/**
 * Retrieves theory from AsyncStorage
 * @returns {Promise<Object>} - object with theory
 */
export const getTheory = async () => {
  try {
    const theoryData = await AsyncStorage.getItem(STORAGE_KEYS.THEORY);
    return theoryData ? JSON.parse(theoryData) : {};
  } catch (error) {
    console.error("Error getting theory:", error);
    return {};
  }
};

/**
 * Retrieves versions of data
 * @returns {Promise<{dictionaryVersion: string, theoryVersion: string}>}
 */
export const getDataVersions = async () => {
  try {
    const [dictionaryVersion, theoryVersion] = await AsyncStorage.multiGet([
      STORAGE_KEYS.DICTIONARY_VERSION,
      STORAGE_KEYS.THEORY_VERSION,
    ]);

    return {
      dictionaryVersion: dictionaryVersion[1] || "0",
      theoryVersion: theoryVersion[1] || "0",
    };
  } catch (error) {
    console.error("Error getting data versions:", error);
    return {
      dictionaryVersion: "0",
      theoryVersion: "0",
    };
  }
};

/**
 * Updates the timestamp of the last update check
 */
const updateLastCheckTime = async () => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_UPDATE_CHECK,
      Date.now().toString()
    );
  } catch (error) {
    console.error("Error updating last check time:", error);
  }
};

/**
 * Gets the timestamp of the last update check
 * @returns {Promise<number|null>} Timestamp in milliseconds or null if never checked
 */
export const getLastUpdateCheckTime = async () => {
  try {
    const lastCheckTime = await AsyncStorage.getItem(STORAGE_KEYS.LAST_UPDATE_CHECK);
    return lastCheckTime ? parseInt(lastCheckTime) : null;
  } catch (error) {
    console.error("Error getting last check time:", error);
    return null;
  }
};

/**
 * Checks if updates are available on GitHub and updates AsyncStorage if needed
 * @returns {Promise<Object>} - Result of the update check
 */
/**
 * Gets the read articles from AsyncStorage
 * @returns {Promise<Object>} - Object with block IDs as keys and arrays of article IDs as values
 */
export const getReadArticles = async () => {
  try {
    const readArticlesData = await AsyncStorage.getItem(
      STORAGE_KEYS.READ_ARTICLES
    );
    return readArticlesData ? JSON.parse(readArticlesData) : {};
  } catch (error) {
    console.error("Error getting read articles:", error);
    return {};
  }
};

/**
 * Marks an article as read
 * @param {string} blockId - ID of the block containing the article
 * @param {string} articleId - ID of the article to mark as read
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const markArticleAsRead = async (blockId, articleId) => {
  try {
    const readArticles = await getReadArticles();

    // Initialize the block array if it doesn't exist
    if (!readArticles[blockId]) {
      readArticles[blockId] = [];
    }

    // Add the article ID if it's not already in the array
    if (!readArticles[blockId].includes(articleId)) {
      readArticles[blockId].push(articleId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.READ_ARTICLES,
        JSON.stringify(readArticles)
      );
    }

    return true;
  } catch (error) {
    console.error("Error marking article as read:", error);
    return false;
  }
};

/**
 * Marks an article as unread
 * @param {string} blockId - ID of the block containing the article
 * @param {string} articleId - ID of the article to mark as unread
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const markArticleAsUnread = async (blockId, articleId) => {
  try {
    const readArticles = await getReadArticles();

    // If the block doesn't exist or the article is not in the array, nothing to do
    if (!readArticles[blockId] || !readArticles[blockId].includes(articleId)) {
      return true;
    }

    // Remove the article ID from the array
    readArticles[blockId] = readArticles[blockId].filter(
      (id) => id !== articleId
    );

    // If the block array is empty, remove the block key
    if (readArticles[blockId].length === 0) {
      delete readArticles[blockId];
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.READ_ARTICLES,
      JSON.stringify(readArticles)
    );
    return true;
  } catch (error) {
    console.error("Error marking article as unread:", error);
    return false;
  }
};



// ========== DBT Diary Card Functions ==========

/**
 * Retrieves all behaviors from AsyncStorage
 * @returns {Promise<Array>} - array of behavior objects
 */
export const getBehaviors = async () => {
  try {
    const behaviorsData = await AsyncStorage.getItem(STORAGE_KEYS.DBT_BEHAVIORS);
    return behaviorsData ? JSON.parse(behaviorsData) : [];
  } catch (error) {
    console.error("Error getting behaviors:", error);
    return [];
  }
};

/**
 * Adds a new behavior to AsyncStorage
 * @param {Object} behavior - behavior object with name and type
 * @returns {Promise<Object>} - saved behavior with generated id
 */
export const addBehavior = async (behavior) => {
  try {
    // Get existing behaviors
    const behaviors = await getBehaviors();
    
    // Create a new behavior with ID and timestamps
    const newBehavior = {
      ...behavior,
      id: Date.now().toString(), // Simple ID generation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add the new behavior
    behaviors.push(newBehavior);
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.DBT_BEHAVIORS, JSON.stringify(behaviors));
    
    return newBehavior;
  } catch (error) {
    console.error("Error adding behavior:", error);
    throw error;
  }
};

/**
 * Updates an existing behavior
 * @param {string} id - ID of the behavior to update
 * @param {Object} updates - Object with properties to update
 * @returns {Promise<Object|null>} - Updated behavior or null if not found
 */
export const updateBehavior = async (id, updates) => {
  try {
    // Get existing behaviors
    const behaviors = await getBehaviors();
    
    // Find the behavior index
    const index = behaviors.findIndex(b => b.id === id);
    
    // If behavior not found
    if (index === -1) {
      return null;
    }
    
    // Update the behavior
    const updatedBehavior = {
      ...behaviors[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    behaviors[index] = updatedBehavior;
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.DBT_BEHAVIORS, JSON.stringify(behaviors));
    
    return updatedBehavior;
  } catch (error) {
    console.error("Error updating behavior:", error);
    throw error;
  }
};

/**
 * Deletes a behavior
 * @param {string} id - ID of the behavior to delete
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const deleteBehavior = async (id) => {
  try {
    // Get existing behaviors
    const behaviors = await getBehaviors();
    
    // Filter out the behavior with the given ID
    const updatedBehaviors = behaviors.filter(b => b.id !== id);
    
    // If no behavior was removed
    if (updatedBehaviors.length === behaviors.length) {
      return false;
    }
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.DBT_BEHAVIORS, JSON.stringify(updatedBehaviors));
    
    return true;
  } catch (error) {
    console.error("Error deleting behavior:", error);
    return false;
  }
};

/**
 * Retrieves all diary entries from AsyncStorage
 * @returns {Promise<Array>} - array of diary entry objects
 */
export const getDiaryEntries = async () => {
  try {
    const entriesData = await AsyncStorage.getItem(STORAGE_KEYS.DBT_DIARY_ENTRIES);
    return entriesData ? JSON.parse(entriesData) : [];
  } catch (error) {
    console.error("Error getting diary entries:", error);
    return [];
  }
};

/**
 * Gets a diary entry for a specific date
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {Promise<Object|null>} - diary entry or null if not found
 */
export const getDiaryEntryByDate = async (dateString) => {
  try {
    const entries = await getDiaryEntries();
    return entries.find(entry => entry.date.substring(0, 10) === dateString) || null;
  } catch (error) {
    console.error("Error getting diary entry by date:", error);
    return null;
  }
};

/**
 * Adds a new diary entry or updates an existing one
 * @param {Object} entry - diary entry object
 * @returns {Promise<Object>} - saved diary entry
 */
export const saveDiaryEntry = async (entry) => {
  try {
    const entries = await getDiaryEntries();
    
    // Check if entry for this date already exists
    const dateString = entry.date.substring(0, 10);
    const existingIndex = entries.findIndex(e => e.date.substring(0, 10) === dateString);
    
    let updatedEntry;
    
    if (existingIndex >= 0) {
      // Update existing entry
      updatedEntry = {
        ...entries[existingIndex],
        ...entry,
        updatedAt: new Date().toISOString()
      };
      entries[existingIndex] = updatedEntry;
    } else {
      // Add new entry
      updatedEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      entries.push(updatedEntry);
    }
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.DBT_DIARY_ENTRIES, JSON.stringify(entries));
    
    return updatedEntry;
  } catch (error) {
    console.error("Error saving diary entry:", error);
    throw error;
  }
};

/**
 * Deletes a diary entry
 * @param {string} id - ID of the entry to delete
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const deleteDiaryEntry = async (id) => {
  try {
    const entries = await getDiaryEntries();
    
    // Filter out the entry with the given ID
    const updatedEntries = entries.filter(entry => entry.id !== id);
    
    // If no entry was removed
    if (updatedEntries.length === entries.length) {
      return false;
    }
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.DBT_DIARY_ENTRIES, JSON.stringify(updatedEntries));
    
    return true;
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    return false;
  }
};

/**
 * Gets entries for a date range
 * @param {string} startDate - Start date in ISO format (YYYY-MM-DD)
 * @param {string} endDate - End date in ISO format (YYYY-MM-DD)
 * @returns {Promise<Array>} - array of diary entries in the range
 */
export const getDiaryEntriesInRange = async (startDate, endDate) => {
  try {
    const entries = await getDiaryEntries();
    
    return entries.filter(entry => {
      const entryDate = entry.date.substring(0, 10);
      return entryDate >= startDate && entryDate <= endDate;
    });
  } catch (error) {
    console.error("Error getting diary entries in range:", error);
    return [];
  }
};

export const checkForUpdates = async () => {
  try {
    console.log("Checking for updates from GitHub...");

    // Fetch meta.json from CDN with cache-busting parameter
    const response = await fetch(`${API_BASE_URL}/meta.json?v=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const serverMeta = await response.json();
    const localVersions = await getDataVersions();

    console.log("Server versions:", serverMeta);
    console.log("Local versions:", localVersions);

    // Check if updates are needed
    const needDictionaryUpdate =
      parseInt(serverMeta.dictionaryVersion) >
      parseInt(localVersions.dictionaryVersion);
    const needTheoryUpdate =
      parseInt(serverMeta.theoryVersion) >
      parseInt(localVersions.theoryVersion);

    // If no updates needed
    if (!needDictionaryUpdate && !needTheoryUpdate) {
      console.log("No updates available");
      
      // Update last check timestamp even when no updates are available
      await updateLastCheckTime();
      
      return { checked: true, updated: false, message: "No updates available" };
    }

    const storageOperations = [];

    // Update dictionary if needed
    if (needDictionaryUpdate) {
      console.log("Updating dictionary from GitHub...");
      const dictionaryResponse = await fetch(
        `${API_BASE_URL}/dictionary.json?v=${Date.now()}`
      );

      if (!dictionaryResponse.ok) {
        throw new Error("Failed to fetch dictionary");
      }

      const dictionaryData = await dictionaryResponse.json();
      storageOperations.push(
        AsyncStorage.setItem(
          STORAGE_KEYS.DICTIONARY,
          JSON.stringify(dictionaryData)
        ),
        AsyncStorage.setItem(
          STORAGE_KEYS.DICTIONARY_VERSION,
          serverMeta.dictionaryVersion
        )
      );
    }

    // Update theory if needed
    if (needTheoryUpdate) {
      console.log("Updating theory from GitHub...");
      const theoryResponse = await fetch(
        `${API_BASE_URL}/theory.json?v=${Date.now()}`
      );

      if (!theoryResponse.ok) {
        throw new Error("Failed to fetch theory");
      }

      const theoryData = await theoryResponse.json();
      storageOperations.push(
        AsyncStorage.setItem(STORAGE_KEYS.THEORY, JSON.stringify(theoryData)),
        AsyncStorage.setItem(
          STORAGE_KEYS.THEORY_VERSION,
          serverMeta.theoryVersion
        )
      );
    }

    // Execute all storage operations in parallel
    if (storageOperations.length > 0) {
      await Promise.all(storageOperations);
      console.log("Data successfully updated from GitHub");
    } else {
      console.log("No updates needed");
    }

    // Update last check timestamp after successful check
    await updateLastCheckTime();

    return {
      checked: true,
      updated: true,
      dictionaryUpdated: needDictionaryUpdate,
      theoryUpdated: needTheoryUpdate,
    };
  } catch (error) {
    console.error("Error checking for updates:", error);
    return { checked: true, updated: false, error: error.message };
  }
};
