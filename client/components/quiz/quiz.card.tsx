import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router"; // Import the router directly

type QuizItemType = {
  _id: string;
  name: string;
  category: string;
  passingPercentage: number;
  isPublicQuiz: boolean;
};

const QuizCard = ({ item }: { item: any }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      // onPress={() =>
      //   router.push({
      //     pathname: "/(routes)/quiz-instruction",
      //     params: { quiz: item },
      //   })
      // }
    >
      {/* Display Quiz Name */}
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.title}>{item.isDemo ? "demo" : "nodemo"}</Text>

      {/* Display Quiz Category */}
      <Text style={styles.description}>Category: {item.category}</Text>

      {/* Display Passing Percentage */}
      <Text style={styles.description}>
        Passing Percentage: {item.passingPercentage}%
      </Text>

      {/* Display if it's a public quiz */}
      <Text style={styles.description}>
        {item.isPublicQuiz ? "Public Quiz" : "Private Quiz"}
      </Text>

      {/* Button to start the quiz */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/(routes)/quiz-instruction",
            params: { quiz: JSON.stringify(item) },
          })
        }
      >
        <Text style={styles.buttonText}>Start Quiz</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#2467EC",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default QuizCard;
