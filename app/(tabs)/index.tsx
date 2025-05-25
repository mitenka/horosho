import { Text, View } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import DaySelector from "../../components/practice/DaySelector";
import commonStyles from "../../styles/commonStyles";

export default function Index() {
  const handleDaySelected = (date: Date) => {
    console.log("Selected date:", date);
  };
  return (
    <ScreenContainer>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Практика</Text>
        <Text style={commonStyles.subtitle}>
          Дневник и использованные за день навыки
        </Text>
      </View>

      <DaySelector onDaySelected={handleDaySelected} />
    </ScreenContainer>
  );
}
