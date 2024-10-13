import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function NoDataCard({ message }) {
  return (
    <View style={styles.card}>
      <MaterialIcons name="info-outline" size={50} color="#2467EC" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#EAF2FE",
    borderRadius: 15,
    marginVertical: 20,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  message: {
    fontSize: 18,
    color: "#2467EC",
    textAlign: "center",
    fontFamily: "Nunito_600SemiBold",
    marginTop: 10,
  },
});
