import { Text, View } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import Block from "../../components/theory/Block";
import commonStyles from "../../styles/commonStyles";

export default function Theory() {
  const handleSectionPress = (title) => {
    console.log(`Модуль ${title} нажат`);
  };
  
  const modules = [
    {
      id: 1,
      title: "Основы ДПТ",
      description: "Введение в диалектическую поведенческую терапию",
      icon: "book-outline",
      color: "#2E7D32",
      progress: 0.3,
      onPress: () => handleSectionPress("Основы ДПТ"),
    },
    {
      id: 2,
      title: "Осознанность",
      description: "Навыки осознанности и присутствия в настоящем моменте",
      icon: "leaf-outline",
      color: "#AED581",
      progress: 0.9,
      onPress: () => handleSectionPress("Осознанность"),
    },
  ];

  return (
    <ScreenContainer>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Теория</Text>
        <Text style={commonStyles.subtitle}>
          Навыки, принципы и философия ДПТ
        </Text>
      </View>

      <View>
        {modules.map((module) => (
          <Block
            key={module.id}
            id={module.id}
            title={module.title}
            description={module.description}
            icon={module.icon}
            color={module.color}
            progress={module.progress}
            onPress={module.onPress}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}
