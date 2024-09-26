// QuizResults.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import {
  Nunito_600SemiBold,
  Nunito_500Medium,
} from "@expo-google-fonts/nunito";
import { router } from "expo-router";

export default function QuizResults({ route }: { route: any }) {
  const { score, total, result } = route.params;

  let [fontsLoaded] = useFonts({
    Raleway_700Bold,
    Nunito_600SemiBold,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>
      <Text style={styles.resultText}>
        Score: {score}/{total}
      </Text>
      <Text style={styles.resultText}>Result: {result}</Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/courses")}
        style={styles.backButton}
      >
        <Text style={styles.backText}>Back to Courses</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Raleway_700Bold",
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    marginVertical: 10,
  },
  backButton: {
    backgroundColor: "#2467EC",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  backText: {
    color: "#fff",
    fontFamily: "Nunito_600SemiBold",
  },
});
