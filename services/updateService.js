import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDataVersions } from "./contentService";
import { API_BASE_URL, STORAGE_KEYS } from "./storageConfig";

/**
 * Updates the timestamp of the last update check
 */
export const updateLastCheckTime = async () => {
  try {
    const timestamp = Date.now();
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_UPDATE_CHECK,
      timestamp.toString()
    );
    return timestamp;
  } catch (error) {
    console.error("Error updating last check time:", error);
    return null;
  }
};

/**
 * Gets the timestamp of the last update check
 * @returns {Promise<number|null>} Timestamp in milliseconds or null if never checked
 */
export const getLastUpdateCheckTime = async () => {
  try {
    const timestamp = await AsyncStorage.getItem(
      STORAGE_KEYS.LAST_UPDATE_CHECK
    );
    return timestamp ? parseInt(timestamp) : null;
  } catch (error) {
    console.error("Error getting last update check time:", error);
    return null;
  }
};

/**
 * Checks for updates from GitHub repository
 * @returns {Promise<Object>} Result of the update check
 */
export const checkForUpdates = async () => {
  try {
    console.log("Checking for updates from GitHub... 📡");

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
