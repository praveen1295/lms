import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

// Define the type for the quiz object
type QuizType = {
  id: string;
  title: string;
  description: string;
  timeLimit?: number; // Assuming there is a time limit field for the quiz
};

const QuizInstructionScreen = () => {
  const router = useRouter();
  const { quiz: item } = useLocalSearchParams(); // Access the quiz data from the search params
  const quiz: any = JSON.parse(item as string);

  console.log("quiz222", quiz);

  const handleStartQuiz = () => {
    router.push({
      pathname: "/(routes)/questions",
      params: { quizId: quiz._id }, // Navigate to the QuizScreen with quizId
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Instructions</Text>
      <Text style={styles.instructions}>
        1. Read each question carefully.
        {"\n"}2. Choose the correct answer from the options provided.
        {"\n"}3. You have {quiz.timeLimit} minutes to complete the quiz.
        {"\n"}4. Your score will be calculated based on correct answers.
        {"\n"}5. You can review your answers before submitting.
      </Text>
      <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
        <Text style={styles.startButtonText}>Start Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5ECF9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  instructions: {
    fontSize: 16,
    textAlign: "left",
    marginBottom: 30,
    lineHeight: 24,
    color: "#333",
  },
  startButton: {
    backgroundColor: "#2467EC",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default QuizInstructionScreen;
