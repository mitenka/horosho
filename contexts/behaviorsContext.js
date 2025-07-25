import { useState } from "react";
import {
  addBehavior,
  deleteBehavior,
  getBehaviors,
  updateBehavior,
} from "../services/dataService";
export const useBehaviorsContext = () => {
  const [behaviors, setBehaviors] = useState([]);
  const [isLoadingBehaviors, setIsLoadingBehaviors] = useState(true);

  const loadBehaviors = async () => {
    try {
      setIsLoadingBehaviors(true);
      const behaviorsData = await getBehaviors();
      setBehaviors(behaviorsData);
      return behaviorsData;
    } catch (error) {
      console.error("Error loading behaviors:", error);
      return [];
    } finally {
      setIsLoadingBehaviors(false);
    }
  };

  const handleAddBehavior = async (behavior) => {
    try {
      const newBehavior = await addBehavior(behavior);
      setBehaviors((prev) => [...prev, newBehavior]);
      return newBehavior;
    } catch (error) {
      console.error("Error adding behavior:", error);
      throw error;
    }
  };
  const handleUpdateBehavior = async (id, updates) => {
    try {
      const updatedBehavior = await updateBehavior(id, updates);
      setBehaviors((prev) =>
        prev.map((b) => (b.id === id ? updatedBehavior : b))
      );
      return updatedBehavior;
    } catch (error) {
      console.error("Error updating behavior:", error);
      throw error;
    }
  };

  const handleDeleteBehavior = async (id) => {
    try {
      const success = await deleteBehavior(id);
      if (success) {
        setBehaviors((prev) => prev.filter((b) => b.id !== id));
      }
      return success;
    } catch (error) {
      console.error("Error deleting behavior:", error);
      return false;
    }
  };

  return {
    behaviors,
    isLoadingBehaviors,
    loadBehaviors,
    addBehavior: handleAddBehavior,
    updateBehavior: handleUpdateBehavior,
    deleteBehavior: handleDeleteBehavior,
  };
};
