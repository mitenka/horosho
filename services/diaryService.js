import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./storageConfig";
import { getLocalISOString } from "../utils/dateUtils";

/**
 * Retrieves all behaviors from AsyncStorage
 * @returns {Promise<Array>} - array of behavior objects
 */
export const getBehaviors = async () => {
  try {
    const behaviorsData = await AsyncStorage.getItem(STORAGE_KEYS.BEHAVIORS);
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
    if (!behavior || !behavior.name || !behavior.type) {
      throw new Error("Invalid behavior data");
    }

    const behaviors = await getBehaviors();

    // Generate a unique ID
    const id = Date.now().toString();
    const newBehavior = {
      ...behavior,
      id,
      createdAt: getLocalISOString(),
    };

    // Add to behaviors array
    behaviors.push(newBehavior);

    // Save back to AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEYS.BEHAVIORS,
      JSON.stringify(behaviors)
    );

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
    if (!id || !updates) {
      throw new Error("Invalid update data");
    }

    const behaviors = await getBehaviors();

    // Find the behavior to update
    const index = behaviors.findIndex((b) => b.id === id);

    if (index === -1) {
      console.warn(`Behavior with id ${id} not found`);
      return null;
    }

    // Update the behavior
    const updatedBehavior = {
      ...behaviors[index],
      ...updates,
      updatedAt: getLocalISOString(),
    };

    behaviors[index] = updatedBehavior;

    // Save back to AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEYS.BEHAVIORS,
      JSON.stringify(behaviors)
    );

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
    if (!id) {
      throw new Error("Invalid behavior ID");
    }

    const behaviors = await getBehaviors();

    // Filter out the behavior to delete
    const updatedBehaviors = behaviors.filter((b) => b.id !== id);

    // If no behavior was removed, return false
    if (updatedBehaviors.length === behaviors.length) {
      return false;
    }

    // Save back to AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEYS.BEHAVIORS,
      JSON.stringify(updatedBehaviors)
    );

    return true;
  } catch (error) {
    console.error("Error deleting behavior:", error);
    return false;
  }
};

/**
 * Retrieves all diary entries from AsyncStorage
 * @returns {Promise<Object>} - object with date keys and entry objects
 */
export const getDiaryEntries = async () => {
  try {
    const entriesData = await AsyncStorage.getItem(STORAGE_KEYS.DIARY_ENTRIES);
    return entriesData ? JSON.parse(entriesData) : {};
  } catch (error) {
    console.error("Error getting diary entries:", error);
    return {};
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
    return entries[dateString] || null;
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
    if (!entry || !entry.date) {
      throw new Error("Invalid diary entry data");
    }

    const entries = await getDiaryEntries();
    const dateString = entry.date.substring(0, 10);

    // Check if an entry for this date already exists
    const existingIndex = entries.findIndex(
      (e) => e.date.substring(0, 10) === dateString
    );

    let updatedEntry;

    if (existingIndex !== -1) {
      // Update existing entry
      updatedEntry = {
        ...entries[existingIndex],
        ...entry,
        updatedAt: getLocalISOString(),
      };

      entries[existingIndex] = updatedEntry;
    } else {
      // Create new entry
      updatedEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: getLocalISOString(),
        updatedAt: getLocalISOString(),
      };

      entries.push(updatedEntry);
    }

    // Save back to AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEYS.DIARY_ENTRIES,
      JSON.stringify(entries)
    );

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
    if (!id) {
      throw new Error("Invalid diary entry ID");
    }

    const entries = await getDiaryEntries();

    // Filter out the entry to delete
    const updatedEntries = entries.filter((entry) => entry.id !== id);

    // If no entry was removed, return false
    if (updatedEntries.length === entries.length) {
      return false;
    }

    // Save back to AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEYS.DIARY_ENTRIES,
      JSON.stringify(updatedEntries)
    );

    return true;
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    return false;
  }
};



/**
 * Clears all behaviors data
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const clearBehaviors = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.BEHAVIORS);
    return true;
  } catch (error) {
    console.error("Error clearing behaviors:", error);
    return false;
  }
};

/**
 * Saves a behavior entry for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} behaviorId - ID of the behavior
 * @param {Object} behaviorData - Behavior data with name, type, desire, action
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const saveBehaviorEntry = async (dateString, behaviorId, behaviorData) => {
  try {
    const entries = await getDiaryEntries();
    
    if (!entries[dateString]) {
      entries[dateString] = { behaviors: [] };
    }
    
    const behaviorIndex = entries[dateString].behaviors.findIndex(b => b.id === behaviorId);
    
    if (behaviorIndex >= 0) {
      entries[dateString].behaviors[behaviorIndex] = { id: behaviorId, ...behaviorData };
    } else {
      entries[dateString].behaviors.push({ id: behaviorId, ...behaviorData });
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error("Error saving behavior entry:", error);
    return false;
  }
};

/**
 * Removes a behavior entry for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} behaviorId - ID of the behavior
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const removeBehaviorEntry = async (dateString, behaviorId) => {
  try {
    const entries = await getDiaryEntries();
    
    if (!entries[dateString]) {
      return true;
    }
    
    entries[dateString].behaviors = entries[dateString].behaviors.filter(b => b.id !== behaviorId);
    
    // If no behaviors left for this date, remove the date entry
    if (entries[dateString].behaviors.length === 0) {
      delete entries[dateString];
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(entries));
    return true;
  } catch (error) {
    console.error("Error removing behavior entry:", error);
    return false;
  }
};

/**
 * Gets a behavior entry for a specific date and behavior ID
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string} behaviorId - ID of the behavior
 * @returns {Promise<Object|null>} - Behavior entry or null if not found
 */
export const getBehaviorEntry = async (dateString, behaviorId) => {
  try {
    const entries = await getDiaryEntries();
    
    if (!entries[dateString]) {
      return null;
    }
    
    return entries[dateString].behaviors.find(b => b.id === behaviorId) || null;
  } catch (error) {
    console.error("Error getting behavior entry:", error);
    return null;
  }
};

/**
 * Clears all diary history entries
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const clearDiaryHistory = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.DIARY_ENTRIES);
    return true;
  } catch (error) {
    console.error("Error clearing diary history:", error);
    return false;
  }
};
