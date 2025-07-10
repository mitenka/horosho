import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
} from 'react-native';
import { useData } from '../../contexts/DataContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * BehaviorsSection component displays a list of tracked behaviors
 */
const BehaviorsSection = ({ onAddBehavior }) => {
  const { behaviors } = useData();

  // Memoize behaviors array to prevent unnecessary re-renders
  const sortedBehaviors = useMemo(() => {
    return [...behaviors].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }, [behaviors]);
  
  // Empty state content
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        Добавьте поведения, которые вы хотите отслеживать в своей карточке.
      </Text>
      <Ionicons name="clipboard-outline" size={48} color="rgba(255, 255, 255, 0.3)" style={styles.emptyIcon} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Add behavior button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={onAddBehavior}
      >
        <Ionicons name="add-circle-outline" size={18} color="#fff" />
        <Text style={styles.addButtonText}>Добавить</Text>
      </TouchableOpacity>
      
      {/* Behaviors list */}
      <View style={styles.listContent}>
        {sortedBehaviors.length > 0 ? (
          sortedBehaviors.map((item) => (
            <View key={item.id} style={styles.behaviorItem}>
              <View style={styles.behaviorInfo}>
                <Text style={styles.behaviorName}>{item.name}</Text>
                <Text style={styles.behaviorType}>
                  {item.type === 'boolean' ? 'Да/Нет' : 'Шкала 0-5'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          renderEmptyComponent()
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  listContent: {
    paddingBottom: 8,
  },
  behaviorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  behaviorInfo: {
    flex: 1,
  },
  behaviorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  behaviorType: {
    fontSize: 14,
    color: '#cccccc',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 6,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  emptyIcon: {
    marginTop: 16,
    opacity: 0.7,
  },
});

export default BehaviorsSection;
