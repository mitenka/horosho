import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./storageConfig";

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
