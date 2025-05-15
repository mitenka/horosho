import { StyleSheet, Text, View } from "react-native";

export default function Theory() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Учим и учим</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#323248",
  },
  text: {
    textAlign: "center",
    color: "#f0f0f0",
  },
});
