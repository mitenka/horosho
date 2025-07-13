import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./storageConfig";

/**
 * Gets the read articles from AsyncStorage
 * @returns {Promise<Object>} - Object with block IDs as keys and arrays of article IDs as values
 */
export const getReadArticles = async () => {
  try {
    const readArticlesData = await AsyncStorage.getItem(STORAGE_KEYS.READ_ARTICLES);
    
    if (!readArticlesData) {
      return {};
    }
    
    return JSON.parse(readArticlesData);
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
    if (!blockId || !articleId) {
      console.error("Invalid blockId or articleId");
      return false;
    }
    
    const readArticles = await getReadArticles();
    
    // Initialize the block array if it doesn't exist
    if (!readArticles[blockId]) {
      readArticles[blockId] = [];
    }
    
    // Check if article is already marked as read
    if (!readArticles[blockId].includes(articleId)) {
      readArticles[blockId].push(articleId);
      
      // Save back to AsyncStorage
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
    if (!blockId || !articleId) {
      console.error("Invalid blockId or articleId");
      return false;
    }
    
    const readArticles = await getReadArticles();
    
    // Check if the block exists
    if (!readArticles[blockId]) {
      // Nothing to do if the block doesn't exist
      return true;
    }
    
    // Check if article is marked as read
    const articleIndex = readArticles[blockId].indexOf(articleId);
    if (articleIndex !== -1) {
      // Remove the article from the read list
      readArticles[blockId].splice(articleIndex, 1);
      
      // If the block is now empty, remove it
      if (readArticles[blockId].length === 0) {
        delete readArticles[blockId];
      }
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem(
        STORAGE_KEYS.READ_ARTICLES,
        JSON.stringify(readArticles)
      );
    }
    
    return true;
  } catch (error) {
    console.error("Error marking article as unread:", error);
    return false;
  }
};

/**
 * Resets all reading progress by clearing the read articles data
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const resetReadingProgress = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.READ_ARTICLES);
    return true;
  } catch (error) {
    console.error("Error resetting reading progress:", error);
    return false;
  }
};
