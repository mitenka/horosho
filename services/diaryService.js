import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocalISOString } from "../utils/dateUtils";
import { STORAGE_KEYS } from "./storageConfig";

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
export const saveBehaviorEntry = async (
  dateString,
  behaviorId,
  behaviorData
) => {
  try {
    const entries = await getDiaryEntries();

    if (!entries[dateString]) {
      entries[dateString] = { behaviors: [] };
    }

    const behaviorIndex = entries[dateString].behaviors.findIndex(
      (b) => b.id === behaviorId
    );

    if (behaviorIndex >= 0) {
      entries[dateString].behaviors[behaviorIndex] = {
        id: behaviorId,
        ...behaviorData,
      };
    } else {
      entries[dateString].behaviors.push({ id: behaviorId, ...behaviorData });
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.DIARY_ENTRIES,
      JSON.stringify(entries)
    );
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

    entries[dateString].behaviors = entries[dateString].behaviors.filter(
      (b) => b.id !== behaviorId
    );

    // If no behaviors left for this date, remove the date entry
    if (entries[dateString].behaviors.length === 0) {
      delete entries[dateString];
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.DIARY_ENTRIES,
      JSON.stringify(entries)
    );
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

    return (
      entries[dateString].behaviors.find((b) => b.id === behaviorId) || null
    );
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

/**
 * Saves skills assessment for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {number|null} assessmentValue - Assessment value (0-7) or null to remove
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const saveSkillsAssessment = async (dateString, assessmentValue) => {
  try {
    const entries = await getDiaryEntries();

    if (!entries[dateString]) {
      entries[dateString] = { behaviors: [] };
    }

    if (assessmentValue !== null) {
      entries[dateString].skillsAssessment = assessmentValue;
    } else {
      // Remove the property entirely when value is null
      delete entries[dateString].skillsAssessment;
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.DIARY_ENTRIES,
      JSON.stringify(entries)
    );
    return true;
  } catch (error) {
    console.error("Error saving skills assessment:", error);
    return false;
  }
};

/**
 * Gets skills assessment for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Promise<number|null>} - Assessment value or null if not found
 */
export const getSkillsAssessment = async (dateString) => {
  try {
    const entries = await getDiaryEntries();
    const entry = entries[dateString];
    // Important: check for undefined, not falsy, to properly handle index 0
    if (entry && entry.skillsAssessment !== undefined) {
      return entry.skillsAssessment;
    }
    return null;
  } catch (error) {
    console.error("Error getting skills assessment:", error);
    return null;
  }
};

/**
 * Gets skills assessment options with proper gender forms
 * @param {boolean} useFeminineVerbs - Whether to use feminine verb forms
 * @returns {Array<string>} - Array of assessment options
 */
export const getSkillsAssessmentOptions = (useFeminineVerbs = false) => {
  if (useFeminineVerbs) {
    return [
      "Не думала о навыках и не использовала",
      "Думала о навыках, не хотела применять, не использовала",
      "Думала о навыках, хотела применить, но не использовала",
      "Старалась, но не смогла применить навыки",
      "Старалась, смогла применить навыки, но они не помогли",
      "Старалась, смогла применить навыки, они помогли",
      "Использовала навыки, не стараясь (автоматически), они не помогли",
      "Использовала навыки, не стараясь (автоматически), они помогли",
    ];
  } else {
    return [
      "Не думал о навыках и не использовал",
      "Думал о навыках, не хотел применять, не использовал",
      "Думал о навыках, хотел применить, но не использовал",
      "Старался, но не смог применить навыки",
      "Старался, смог применить навыки, но они не помогли",
      "Старался, смог применить навыки, они помогли",
      "Использовал навыки, не стараясь (автоматически), они не помогли",
      "Использовал навыки, не стараясь (автоматически), они помогли",
    ];
  }
};

/**
 * Saves diary completion status for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {boolean} isCompleted - Whether the diary is completed for this date
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const saveDiaryCompletionStatus = async (dateString, isCompleted) => {
  try {
    const entries = await getDiaryEntries();

    if (!entries[dateString]) {
      entries[dateString] = { behaviors: [] };
    }

    if (isCompleted) {
      entries[dateString].isCompleted = true;
    } else {
      // Remove the property entirely when false
      delete entries[dateString].isCompleted;
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.DIARY_ENTRIES,
      JSON.stringify(entries)
    );
    return true;
  } catch (error) {
    console.error("Error saving diary completion status:", error);
    return false;
  }
};

/**
 * Gets diary completion status for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Promise<boolean>} - Whether the diary is completed for this date
 */
export const getDiaryCompletionStatus = async (dateString) => {
  try {
    const entries = await getDiaryEntries();
    const entry = entries[dateString];
    return entry?.isCompleted || false;
  } catch (error) {
    console.error("Error getting diary completion status:", error);
    return false;
  }
};

/**
 * Gets the complete list of available skills organized by categories
 * @returns {Object} - Skills organized by categories
 */
export const getAvailableSkills = () => {
  return {
    mindfulness: {
      title: "Осознанность",
      skills: [
        "**Мудрый разум**",
        "**Наблюдение:** замечать",
        "**Описание:** добавлять слова, только факты",
        "**Участие:** погружаться в происходящее",
        "**Безоценочность**",
        "**Однонаправленность:** здесь и сейчас",
        "**Эффективность:** фокусировка на том, что работает",
      ],
    },
    emotionRegulation: {
      title: "Эмоциональная регуляция",
      skills: [
        "**Проверка фактов**",
        "**Противоположное действие**",
        "**Решение проблемы**",
        "**A:** позитивные эмоции",
        "**B:** мастерство",
        "**C:** заблаговременный поиск решений",
        "**PLEASE:** снижение уязвимости",
        "**Осознанное отношение к текущей эмоции**",
      ],
    },
    stressTolerance: {
      title: "Стрессоустойчивость",
      skills: [
        "**СТОП:** остановись",
        "**За и против**",
        "**Физиологические методы (ТРУД):** холодная вода, интенсивная физнагрузка, медленное дыхание, сканирование и расслабление тела",
        "**ACCEPTS:** отвлечение",
        "**Пять органов чувств:** забота о себе",
        "**IMPROVE:** улучшить момент",
        "**Радикальное принятие**",
        "**Готовность, полуулыбка, раскрытые ладони**",
        "**Осознанное отношение к текущим мыслям**",
      ],
    },
    interpersonal: {
      title: "Межличностная эффективность",
      skills: [
        "**Попроси (DEAR MAN):** навык эффективной просьбы",
        "**Друг (GIVE):** эффективность отношений",
        "**Честь (FAST):** эффективность самоуважения",
        "**Валидация**",
        "**Стратегии изменения поведения**",
      ],
    },
  };
};

/**
 * Saves used skills for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {string[]} usedSkills - Array of skill names that were used
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const saveUsedSkills = async (dateString, usedSkills) => {
  try {
    const entries = await getDiaryEntries();

    if (!entries[dateString]) {
      entries[dateString] = { behaviors: [] };
    }

    if (usedSkills && usedSkills.length > 0) {
      entries[dateString].usedSkills = usedSkills;
    } else {
      // Remove the property entirely when empty
      delete entries[dateString].usedSkills;
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.DIARY_ENTRIES,
      JSON.stringify(entries)
    );
    return true;
  } catch (error) {
    console.error("Error saving used skills:", error);
    return false;
  }
};

/**
 * Gets used skills for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Promise<string[]>} - Array of used skill names
 */
export const getUsedSkills = async (dateString) => {
  try {
    const entries = await getDiaryEntries();
    const entry = entries[dateString];
    return entry?.usedSkills || [];
  } catch (error) {
    console.error("Error getting used skills:", error);
    return [];
  }
};

/**
 * Saves daily state assessment for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @param {Object} dailyState - State object with emotional, physical, and pleasure values (0-5)
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const saveDailyState = async (dateString, dailyState) => {
  try {
    if (!dailyState || typeof dailyState !== "object") {
      throw new Error("Invalid daily state data");
    }

    const { emotional, physical, pleasure } = dailyState;

    // Validate state values - allow null or numbers between 0 and 5
    const validateValue = (value) => {
      return (
        value === null ||
        (typeof value === "number" && value >= 0 && value <= 5)
      );
    };

    if (
      !validateValue(emotional) ||
      !validateValue(physical) ||
      !validateValue(pleasure)
    ) {
      throw new Error(
        "Invalid state values. Values must be null or numbers between 0 and 5"
      );
    }

    const entries = await getDiaryEntries();

    if (!entries[dateString]) {
      entries[dateString] = { behaviors: [] };
    }

    entries[dateString].dailyState = {
      emotional,
      physical,
      pleasure,
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.DIARY_ENTRIES,
      JSON.stringify(entries)
    );
    return true;
  } catch (error) {
    console.error("Error saving daily state:", error);
    return false;
  }
};

/**
 * Gets daily state assessment for a specific date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {Promise<Object|null>} - State object or null if not found
 */
export const getDailyState = async (dateString) => {
  try {
    const entries = await getDiaryEntries();
    const entry = entries[dateString];
    return entry?.dailyState || null;
  } catch (error) {
    console.error("Error getting daily state:", error);
    return null;
  }
};
