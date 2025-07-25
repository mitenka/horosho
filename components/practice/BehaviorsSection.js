import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { useData } from "../../contexts/DataContext";
import {
  getBehaviorEntry,
  removeBehaviorEntry,
  saveBehaviorEntry,
} from "../../services/dataService";
import { formatDateToString } from "../../utils/dateUtils";
import ActionButtons from "./ActionButtons";
import AddBehaviorModal from "./AddBehaviorModal";
import AddButton from "./AddButton";
import BehaviorsList from "./BehaviorsList";
import DailyStateAssessment from "./DailyStateAssessment";
import DiaryCompletionToggle from "./DiaryCompletionToggle";
import EmptyState from "./EmptyState";
import ExportModal from "./ExportModal";
import SkillsAssessment from "./SkillsAssessment";
import UsedSkills from "./UsedSkills";

const BehaviorsSection = ({ selectedDate }) => {
  const { behaviors, deleteBehavior, isLoadingBehaviors } = useData();
  const [isDeleting, setIsDeleting] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDays, setExportDays] = useState(7);
  const [behaviorEntries, setBehaviorEntries] = useState({});

  // Fade-in animation when loading completes
  useEffect(() => {
    if (!isLoadingBehaviors) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoadingBehaviors, fadeAnim]);

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

  // Show nothing while behaviors are being loaded to prevent flickering
  if (isLoadingBehaviors) {
    return null;
  }

  // If no behaviors exist, show only the add button and empty state
  if (behaviors.length === 0) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <AddButton onAddBehavior={() => setShowAddModal(true)} />
        <EmptyState />

        <AddBehaviorModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      </Animated.View>
    );
  }

  // If behaviors exist, show all sections
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ActionButtons
        onAddBehavior={() => setShowAddModal(true)}
        onExport={() => setShowExportModal(true)}
      />

      <DiaryCompletionToggle />

      <DailyStateAssessment selectedDate={selectedDate} />

      <BehaviorsList
        behaviors={behaviors}
        behaviorEntries={behaviorEntries}
        onDesireChange={handleDesireChange}
        onActionChange={handleActionChange}
        onDeleteBehavior={handleDeleteBehavior}
        isDeleting={isDeleting}
      />

      <SkillsAssessment selectedDate={selectedDate} />

      <UsedSkills />

      <AddBehaviorModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <ExportModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
        exportDays={exportDays}
        onExportDaysChange={setExportDays}
        selectedDate={selectedDate}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BehaviorsSection;
