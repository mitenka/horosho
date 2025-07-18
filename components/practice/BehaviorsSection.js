import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useData } from "../../contexts/DataContext";
import {
  getBehaviorEntry,
  removeBehaviorEntry,
  saveBehaviorEntry,
} from "../../services/dataService";
import { formatDateToString } from "../../utils/dateUtils";
import AddBehaviorModal from "./AddBehaviorModal";
import ActionButtons from "./ActionButtons";
import BehaviorsList from "./BehaviorsList";
import ExportModal from "./ExportModal";

const BehaviorsSection = ({ selectedDate }) => {
  const { behaviors, deleteBehavior } = useData();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDays, setExportDays] = useState(7);
  const [behaviorEntries, setBehaviorEntries] = useState({});

  // Load behavior entries for the selected date
  useEffect(() => {
    const loadBehaviorEntries = async () => {
      if (!selectedDate || !behaviors.length) return;

      const dateString = formatDateToString(selectedDate);
      const entries = {};

      for (const behavior of behaviors) {
        const entry = await getBehaviorEntry(dateString, behavior.id);
        if (entry) {
          entries[behavior.id] = {
            desire: entry.desire,
            action: entry.action,
          };
        }
      }

      setBehaviorEntries(entries);
    };

    loadBehaviorEntries();
  }, [selectedDate, behaviors]);

  const handleDeleteBehavior = async (behaviorId, behaviorName) => {
    setIsDeleting(true);
    try {
      await deleteBehavior(behaviorId);
    } catch (error) {
      console.error("Error deleting behavior:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDesireChange = async (behaviorId, value) => {
    const dateString = formatDateToString(selectedDate);
    const behavior = behaviors.find((b) => b.id === behaviorId);
    const currentEntry = behaviorEntries[behaviorId] || {};

    // If same value is selected, remove it (toggle behavior)
    const newDesire = currentEntry.desire === value ? undefined : value;
    const newAction = currentEntry.action;

    // Update local state
    const newEntries = { ...behaviorEntries };
    if (newDesire !== undefined || newAction !== undefined) {
      newEntries[behaviorId] = { desire: newDesire, action: newAction };
    } else {
      delete newEntries[behaviorId];
    }
    setBehaviorEntries(newEntries);

    // Save to storage
    if (newDesire !== undefined || newAction !== undefined) {
      await saveBehaviorEntry(dateString, behaviorId, {
        name: behavior.name,
        type: behavior.type,
        desire: newDesire,
        action: newAction,
      });
    } else {
      await removeBehaviorEntry(dateString, behaviorId);
    }
  };

  const handleActionChange = async (behaviorId, value) => {
    const dateString = formatDateToString(selectedDate);
    const behavior = behaviors.find((b) => b.id === behaviorId);
    const currentEntry = behaviorEntries[behaviorId] || {};

    // If same value is selected, remove it (toggle behavior)
    const newAction = currentEntry.action === value ? undefined : value;
    const newDesire = currentEntry.desire;

    // Update local state
    const newEntries = { ...behaviorEntries };
    if (newDesire !== undefined || newAction !== undefined) {
      newEntries[behaviorId] = { desire: newDesire, action: newAction };
    } else {
      delete newEntries[behaviorId];
    }
    setBehaviorEntries(newEntries);

    // Save to storage
    if (newDesire !== undefined || newAction !== undefined) {
      await saveBehaviorEntry(dateString, behaviorId, {
        name: behavior.name,
        type: behavior.type,
        desire: newDesire,
        action: newAction,
      });
    } else {
      await removeBehaviorEntry(dateString, behaviorId);
    }
  };

  return (
    <View style={styles.container}>
      <ActionButtons
        onAddBehavior={() => setShowAddModal(true)}
        onExport={() => setShowExportModal(true)}
      />
      
      <BehaviorsList
        behaviors={behaviors}
        behaviorEntries={behaviorEntries}
        onDesireChange={handleDesireChange}
        onActionChange={handleActionChange}
        onDeleteBehavior={handleDeleteBehavior}
        isDeleting={isDeleting}
      />
      
      <AddBehaviorModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      
      <ExportModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        exportDays={exportDays}
        onExportDaysChange={setExportDays}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BehaviorsSection;
