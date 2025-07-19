import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useData } from "../../contexts/DataContext";
import { getAvailableSkills, getUsedSkills, saveUsedSkills } from "../../services/dataService";
import { formatDateToString } from "../../utils/dateUtils";

const UsedSkills = () => {
  const { selectedDate } = useData();
  const [usedSkillsList, setUsedSkillsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableSkills, setAvailableSkills] = useState({});

  const dateString = formatDateToString(selectedDate);

  // Load available skills on component mount
  useEffect(() => {
    const skills = getAvailableSkills();
    setAvailableSkills(skills);
  }, []);

  // Load used skills when date changes
  useEffect(() => {
    const loadUsedSkills = async () => {
      setIsLoading(true);
      try {
        const skills = await getUsedSkills(dateString);
        setUsedSkillsList(skills);
      } catch (error) {
        console.error("Error loading used skills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsedSkills();
  }, [dateString]);

  const handleSkillToggle = async (skillName) => {
    const newUsedSkills = usedSkillsList.includes(skillName)
      ? usedSkillsList.filter(skill => skill !== skillName)
      : [...usedSkillsList, skillName];
    
    // Optimistic update
    setUsedSkillsList(newUsedSkills);
    
    try {
      await saveUsedSkills(dateString, newUsedSkills);
    } catch (error) {
      console.error("Error saving used skills:", error);
      // Revert on error
      setUsedSkillsList(usedSkillsList);
    }
  };

  const getCategoryColor = (categoryKey) => {
    switch (categoryKey) {
      case "mindfulness":
        return "#4CAF50"; // green
      case "interpersonal":
        return "#2196F3"; // blue
      case "emotionRegulation":
        return "#FF9800"; // orange
      case "stressTolerance":
        return "#FF5722"; // coral/deep orange
      default:
        return "#9E9E9E"; // grey
    }
  };

  // Parse markdown-style bold text
  const parseMarkdownText = (text) => {
    const parts = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the bold part
      if (match.index > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, match.index),
          bold: false
        });
      }
      
      // Add the bold part
      parts.push({
        text: match[1],
        bold: true
      });
      
      lastIndex = regex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        bold: false
      });
    }
    
    return parts.length > 0 ? parts : [{ text, bold: false }];
  };

  const renderSkillItem = (skill, categoryKey) => {
    const isSelected = usedSkillsList.includes(skill);
    const categoryColor = getCategoryColor(categoryKey);
    const textParts = parseMarkdownText(skill);
    
    return (
      <TouchableOpacity
        key={skill}
        style={[
          styles.skillItem,
          isSelected && {
            ...styles.skillItemSelected,
            backgroundColor: `${categoryColor}15`, // 15 = 8.5% opacity
            borderColor: `${categoryColor}4D`, // 4D = 30% opacity
          },
        ]}
        onPress={() => handleSkillToggle(skill)}
        activeOpacity={0.7}
      >
        <Text style={styles.skillText}>
          {textParts.map((part, index) => (
            <Text
              key={index}
              style={[
                part.bold && styles.boldText,
                isSelected && { color: categoryColor },
              ]}
            >
              {part.text}
            </Text>
          ))}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategory = (categoryKey, categoryData) => {
    const categoryColor = getCategoryColor(categoryKey);
    
    return (
      <View key={categoryKey} style={styles.categoryContainer}>
        <Text style={[styles.categoryTitle, { color: categoryColor }]}>
          {categoryData.title}
        </Text>
        <View style={styles.skillsList}>
          {categoryData.skills.map(skill => renderSkillItem(skill, categoryKey))}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Использованные за день навыки</Text>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Использованные за день навыки</Text>
      
      {Object.entries(availableSkills).map(([categoryKey, categoryData]) =>
        renderCategory(categoryKey, categoryData)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    letterSpacing: 0.4,
    textAlign: "left",
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  skillsList: {
    gap: 10,
  },
  skillItem: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skillItemSelected: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  skillText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
    lineHeight: 22,
    textAlign: "left",
  },
  boldText: {
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});

export default UsedSkills;
