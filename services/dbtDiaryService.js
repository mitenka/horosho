import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./storageConfig";

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
    if (!behavior || !behavior.name || !behavior.type) {
      throw new Error("Invalid behavior data");
    }
    
    const behaviors = await getBehaviors();
    
    // Generate a unique ID
    const id = Date.now().toString();
    const newBehavior = {
      ...behavior,
      id,
      createdAt: new Date().toISOString(),
    };
    
    // Add to behaviors array
    behaviors.push(newBehavior);
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEYS.DBT_BEHAVIORS,
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
    const index = behaviors.findIndex(b => b.id === id);
    
    if (index === -1) {
      console.warn(`Behavior with id ${id} not found`);
      return null;
    }
    
    // Update the behavior
    const updatedBehavior = {
      ...behaviors[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    behaviors[index] = updatedBehavior;
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEYS.DBT_BEHAVIORS,
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
    const updatedBehaviors = behaviors.filter(b => b.id !== id);
    
    // If no behavior was removed, return false
    if (updatedBehaviors.length === behaviors.length) {
      return false;
    }
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEYS.DBT_BEHAVIORS,
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
    if (!entry || !entry.date) {
      throw new Error("Invalid diary entry data");
    }
    
    const entries = await getDiaryEntries();
    const dateString = entry.date.substring(0, 10);
    
    // Check if an entry for this date already exists
    const existingIndex = entries.findIndex(e => e.date.substring(0, 10) === dateString);
    
    let updatedEntry;
    
    if (existingIndex !== -1) {
      // Update existing entry
      updatedEntry = {
        ...entries[existingIndex],
        ...entry,
        updatedAt: new Date().toISOString(),
      };
      
      entries[existingIndex] = updatedEntry;
    } else {
      // Create new entry
      updatedEntry = {
        ...entry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      entries.push(updatedEntry);
    }
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEYS.DBT_DIARY_ENTRIES,
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
    const updatedEntries = entries.filter(entry => entry.id !== id);
    
    // If no entry was removed, return false
    if (updatedEntries.length === entries.length) {
      return false;
    }
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEYS.DBT_DIARY_ENTRIES,
      JSON.stringify(updatedEntries)
    );
    
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
