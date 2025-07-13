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
  // DBT Diary Card storage keys
  DBT_BEHAVIORS: "@horosho/dbt/behaviors",
  DBT_DIARY_ENTRIES: "@horosho/dbt/diary_entries",
  DBT_SETTINGS: "@horosho/dbt/settings",
};

// GitHub raw content configuration
export const GITHUB_USER = "mitenka";
export const GITHUB_REPO = "horosho";
export const GITHUB_BRANCH = "main";
export const API_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/data`;

// Export initial data
export { dictionary, meta, theory };
