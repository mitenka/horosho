import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./storageConfig";

/**
 * Get all app settings from storage
 * @returns {Promise<Object>} The settings object
 */
export const getSettings = async () => {
  try {
    const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsData ? JSON.parse(settingsData) : {};
  } catch (error) {
    console.error("Error getting settings:", error);
    return {};
  }
};

/**
 * Save all app settings to storage
 * @param {Object} settings - The settings object to save
 * @returns {Promise<boolean>} Whether the operation was successful
 */
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    return false;
  }
};

/**
 * Initialize app settings with default values if they don't exist
 * @returns {Promise<Object>} The initialized settings
 */
export const initializeSettings = async () => {
  try {
    const currentSettings = await getSettings();
    
    // Define default settings
    const defaultSettings = {
      useFeminineVerbs: true,
    };
    
    // Merge existing settings with defaults for any missing settings
    const updatedSettings = {
      ...defaultSettings,
      ...currentSettings,
    };
    
    // Save the merged settings
    await saveSettings(updatedSettings);
    
    return updatedSettings;
  } catch (error) {
    console.error("Error initializing settings:", error);
    return { useFeminineVerbs: true };
  }
};

/**
 * Update a specific setting
 * @param {string} key - The setting key to update
 * @param {any} value - The new value for the setting
 * @returns {Promise<Object>} The updated settings object
 */
export const updateSetting = async (key, value) => {
  try {
    const currentSettings = await getSettings();
    const updatedSettings = {
      ...currentSettings,
      [key]: value,
    };
    
    await saveSettings(updatedSettings);
    return updatedSettings;
  } catch (error) {
    console.error(`Error updating setting ${key}:`, error);
    return null;
  }
};
