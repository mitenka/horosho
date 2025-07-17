import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BehaviorItem from './BehaviorItem';
import EmptyState from './EmptyState';

const BehaviorsList = ({ 
  behaviors, 
  behaviorEntries, 
  onDesireChange, 
  onActionChange, 
  onDeleteBehavior,
  isDeleting 
}) => {
  if (behaviors.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollView 
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {behaviors.map((behavior) => (
        <BehaviorItem
          key={behavior.id}
          behavior={behavior}
          entry={behaviorEntries[behavior.id]}
          onDesireChange={onDesireChange}
          onActionChange={onActionChange}
          onDelete={onDeleteBehavior}
          isDeleting={isDeleting}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default BehaviorsList;
