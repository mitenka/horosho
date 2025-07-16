import dictionary from "../data/dictionary.json";
import meta from "../data/meta.json";
import theory from "../data/theory.json";

// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
  DICTIONARY: "@horosho/dictionary",
  THEORY: "@horosho/theory",
  DICTIONARY_VERSION: "@horosho/dictionary_version",
  THEORY_VERSION: "@horosho/theory_version",
  LAST_UPDATE_CHECK: "@horosho/last_update_check",
  READ_ARTICLES: "@horosho/read_articles",
  // Diary Card storage keys
  BEHAVIORS: "@horosho/behaviors",
  DIARY_ENTRIES: "@horosho/diary_entries",
  SETTINGS: "@horosho/settings",
};

// GitHub raw content configuration
export const GITHUB_USER = "mitenka";
export const GITHUB_REPO = "horosho";
export const GITHUB_BRANCH = "main";
export const API_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/data`;

// Export initial data
export { dictionary, meta, theory };
