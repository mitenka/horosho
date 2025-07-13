import { useState } from "react";
import { getDictionary, getTheory } from "../services/dataService";

export const useContentContext = () => {
  const [dictionary, setDictionary] = useState([]);
  const [theory, setTheory] = useState({});

  const loadContent = async () => {
    try {
      const [dictionaryData, theoryData] = await Promise.all([
        getDictionary(),
        getTheory(),
      ]);

      setDictionary(dictionaryData);
      setTheory(theoryData);

      return { dictionary: dictionaryData, theory: theoryData };
    } catch (err) {
      console.error("Error loading content data:", err);
      throw err;
    }
  };

  return {
    dictionary,
    theory,
    loadContent,
    setDictionary,
    setTheory,
  };
};
