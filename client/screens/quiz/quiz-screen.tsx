import Loader from "@/components/loader/loader";
import useUser from "@/hooks/auth/useUser";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  // const handleSubmit = async () => {
  //   if (Object.keys(selectedAnswers).length !== quiz.questionList.length) {
  //     Alert.alert(
  //       "Incomplete",
  //       "Please answer all questions before submitting."
  //     );
  //     return;
  //   }

  //   let correctAnswers = 0;
  //   let attemptedAnswers: any = [];

  //   quiz.questionList.forEach((question: any) => {
  //     const userAnswer = selectedAnswers[question.questionNumber];

  //     console.log("hs call", question, userAnswer, quiz);
  //     const correctAnswer = quiz.answers[question.questionNumber];

  //     attemptedAnswers.push({
  //       questionNumber: question.questionNumber,
  //       attemptedAnswer: userAnswer,
  //       rightAnswer: correctAnswer,
  //     });
  //     if (userAnswer === correctAnswer) {
  //       correctAnswers++;
  //     }
  //   });

  //   const percentage = (correctAnswers / quiz.questionList.length) * 100;
  //   const result = percentage >= quiz.passingPercentage ? "Pass" : "Fail";

  //   const reportData = {
  //     quizId,
  //     attemptedQuestion: selectedAnswers,
  //     score: correctAnswers,
  //     total: quiz.questionList.length,
  //     percentage,
  //     result,
  //     attemptedAnswers,
  //   };

  //   const accessToken = await AsyncStorage.getItem("access_token");
  //   const refreshToken = await AsyncStorage.getItem("refresh_token");

  //   try {
  //     setLoader(true);
  //     const response = await axios.post(
  //       `${SERVER_URI}/exam/submit-exam`,
  //       reportData,
  //       {
  //         headers: {
  //           "access-token": accessToken,
  //           "refresh-token": refreshToken,
  //         },
  //       }
  //     );

  //     console.log("qresponse", response);

  //     setSubmitted(true);
  //     Alert.alert(
  //       response.data.data.result === "Pass" ? "Congrats!" : "Try again",
  //       `You ${response.data.data.result.toLowerCase()} with ${percentage.toFixed(
  //         2
  //       )}%.`
  //     );
  //   } catch (error) {
  //     console.error("Failed to submit quiz:", error);
  //     Alert.alert(
  //       "Submission failed",
  //       "There was an error submitting the quiz."
  //     );
  //   } finally {
  //     setLoader(false);
  //   }
  // };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(selectedAnswers).length !== quiz.questionList.length) {
      Alert.alert(
        "Incomplete",
        "Please answer all questions before submitting."
      );
      return;
    }

    const reportData = {
      quizId,
      attemptedQuestion: selectedAnswers,
    };

    const accessToken = await AsyncStorage.getItem("access_token");
    const refreshToken = await AsyncStorage.getItem("refresh_token");

    try {
      setLoader(true);
      const response = await axios.post(
        `${SERVER_URI}/exam/submit-exam`,
        reportData,
        {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        }
      );

      console.log("response", response);

      const { score, result, percentage, attemptedAnswerWithRightAnswer } =
        response.data.data;

      setSubmitted(true);

      Alert.alert(
        result === "Pass" ? "Congrats!" : "Try again",
        `You ${result.toLowerCase()}. \nYour score is ${score}/${
          quiz.questionList.length
        }.`
      );
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      Alert.alert(
        "Submission failed",
        "There was an error submitting the quiz."
      );
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      setLoader(true);

      try {
        const accessToken = await AsyncStorage.getItem("access_token");
        const refreshToken = await AsyncStorage.getItem("refresh_token");

        const response = await axios.get(`${SERVER_URI}/exam/${quizId}`, {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        });

        console.log("Fetched quizzes", response.data);
        setQuiz(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    };

    // Call the async function
    fetchQuizData();
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
