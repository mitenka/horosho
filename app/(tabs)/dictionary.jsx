import { Text, View } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import commonStyles from "../../styles/commonStyles";

export default function Dictionary() {
  return (
    <ScreenContainer>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Словарь</Text>
        <Text style={commonStyles.subtitle}>
          Способ быстро вспомнить забытый термин
        </Text>
      </View>
    </ScreenContainer>
  );
}
