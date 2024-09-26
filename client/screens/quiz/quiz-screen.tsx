import Loader from "@/components/loader/loader";
import useUser from "@/hooks/auth/useUser";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

const QuizScreen = () => {
  const { quizId }: any = useLocalSearchParams(); // Add type any for quizId

  const { user, loading, setRefetch }: any = useUser(); // Add type any for user-related hooks
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: any;
  }>({}); // Explicitly set selectedAnswers type
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [quiz, setQuiz] = useState<any>(null); // Add type any for quiz

  const handleAnswerSelect = (questionNumber: any, answer: any) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionNumber]: answer,
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length !== quiz.questionList.length) {
      Alert.alert(
        "Incomplete",
        "Please answer all questions before submitting."
      );
      return;
    }

    let correctAnswers = 0;
    quiz.questionList.forEach((question: any) => {
      // Add any for question
      const userAnswer = selectedAnswers[question.questionNumber];
      const correctAnswer = quiz.answers[question.questionNumber];
      if (userAnswer === correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = (correctAnswers / quiz.questionList.length) * 100;
    setSubmitted(true);

    if (percentage >= quiz.passingPercentage) {
      Alert.alert("Congrats!", `You passed with ${percentage.toFixed(2)}%!`);
    } else {
      Alert.alert("Try again", `You scored ${percentage.toFixed(2)}%.`);
    }
  };

  useEffect(() => {
    setLoader(true);
    axios
      .get(`${SERVER_URI}/quiz/${quizId}`)
      .then((res) => {
        console.log("Fetched quizzes", res.data);
        setQuiz(res.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [quizId]);

  if (loading || loader) {
    return (
      <View>
        <Loader />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.quizTitle}>{quiz?.name}</Text>
      {quiz?.questionList?.map((question: any, index: number) => (
        <View key={index} style={styles.questionContainer}>
          <Text
            style={styles.questionText}
          >{`${question.questionNumber}. ${question.question}`}</Text>
          {Object.entries(question.options).map(
            ([optionKey, optionValue]: any) => (
              <TouchableOpacity
                key={optionKey}
                style={[
                  styles.optionButton,
                  selectedAnswers[question.questionNumber] === optionKey &&
                    styles.selectedOption,
                ]}
                onPress={() =>
                  handleAnswerSelect(question.questionNumber, optionKey)
                }
                disabled={submitted}
              >
                <Text
                  style={styles.optionText}
                >{`${optionKey}. ${optionValue}`}</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      ))}

      {!submitted && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "#d0e8ff",
  },
  optionText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#2467EC",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QuizScreen;