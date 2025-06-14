import AsyncStorage from "@react-native-async-storage/async-storage";

import dictionary from "../data/dictionary.json";
import meta from "../data/meta.json";
import theory from "../data/theory.json";

const STORAGE_KEYS = {
  DICTIONARY: "@horosho/dictionary",
  THEORY: "@horosho/theory",
  DICTIONARY_VERSION: "@horosho/dictionary_version",
  THEORY_VERSION: "@horosho/theory_version",
};

const checkStorageData = async () => {
  try {
    const [dictionary, theory, dictionaryVersion, theoryVersion] =
      await AsyncStorage.multiGet([
        STORAGE_KEYS.DICTIONARY,
        STORAGE_KEYS.THEORY,
        STORAGE_KEYS.DICTIONARY_VERSION,
        STORAGE_KEYS.THEORY_VERSION,
      ]);

    return {
      hasDictionary: !!dictionary[1],
      hasTheory: !!theory[1],
      dictionaryVersion: dictionaryVersion[1] || "0",
      theoryVersion: theoryVersion[1] || "0",
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
