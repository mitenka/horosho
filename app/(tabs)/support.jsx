import React, { useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useScrollToTop } from '@react-navigation/native';
import SkillRules from '../../components/support/SkillRules';
import BoxBreathing from '../../components/article/BoxBreathing';

export default function SupportScreen() {
  const scrollViewRef = useRef(null);

  useScrollToTop(scrollViewRef);

  return (
    <LinearGradient
      colors={['#4a5568', '#667eea', '#b794f6']}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.skillsSection}>
            <Text style={styles.sectionTitle}>Интенсивность эмоций по десятибальной шкале и навыки</Text>
            <SkillRules />
          </View>
          
          <View style={styles.breathingSection}>
            <Text style={styles.sectionTitle}>Дыхание по квадрату</Text>
            <BoxBreathing color="#ffffff" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  skillsSection: {
    marginVertical: 24,
    marginHorizontal: 20,
  },
  breathingSection: {
    marginVertical: 24,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 24,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
