import Loader from "@/components/loader/loader";
import useUser from "@/hooks/auth/useUser";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";

const QuizScreen = () => {
  const { quizId }: any = useLocalSearchParams();
  const { user, loading, setRefetch }: any = useUser();
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: any;
  }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // State for timer in seconds

  // Helper function to convert time from seconds to minutes and seconds format
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleAnswerSelect = (questionNumber: any, answer: any) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionNumber]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz?.questionList.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // if (Object.keys(selectedAnswers).length !== quiz.questionList.length) {
    //   Alert.alert(
    //     "Incomplete",
    //     "Please answer all questions before submitting."
    //   );
    //   return;
    // }

    const reportData = {
      quizId,
      attemptedQuestion: selectedAnswers,
    };

    const accessToken = await AsyncStorage.getItem("access_token");
    const refreshToken = await AsyncStorage.getItem("refresh_token");

    console.log("reportData", reportData);
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

      console.log("response", response.data);

      const { score, result, percentage, attemptedAnswerWithRightAnswer } =
        response.data.data;

      if (response.data.status === "success") {
        setSubmitted(true);
        router.push({
          pathname: "/(routes)/quiz-result",
          params: { item: JSON.stringify(response.data.data) },
        });
      }

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
        const quizData = response.data.data;
        setQuiz(quizData);

        // Initialize the timer based on the quiz duration
        if (quizData?.duration) {
          setTimeLeft(quizData.duration * 60); // Convert minutes to seconds
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || submitted) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime !== null ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, submitted]);

  // Auto-submit when the timer reaches zero
  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      Alert.alert("Time's up!", "The quiz will be auto-submitted.");
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  if (loading || loader) {
    return (
      <View>
        <Loader />
      </View>
    );
  }

  const currentQuestion = quiz?.questionList[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.quizTitle}>{quiz?.name}</Text>
        {timeLeft !== null && (
          <Text style={styles.timerText}>
            Time left: {formatTime(timeLeft)}
          </Text>
        )}
      </View>
      {currentQuestion && (
        <View style={styles.questionContainer}>
          <Text
            style={styles.questionText}
          >{`${currentQuestion.questionNumber}. ${currentQuestion.question}`}</Text>

          {/* Display question images if available */}
          {currentQuestion.questionImg &&
            currentQuestion.questionImg.length > 0 && (
              <View style={styles.imageContainer}>
                {currentQuestion.questionImg.map(
                  (imageUrl: string, index: number) => (
                    <Image
                      key={index}
                      source={{ uri: imageUrl }}
                      style={styles.questionImage}
                      resizeMode="contain"
                    />
                  )
                )}
              </View>
            )}

          {Object.entries(currentQuestion.options).map(
            ([optionKey, optionValue]: any) => (
              <TouchableOpacity
                key={optionKey}
                style={[
                  styles.optionButton,
                  selectedAnswers[currentQuestion.questionNumber] ===
                    optionKey && styles.selectedOption,
                ]}
                onPress={() =>
                  handleAnswerSelect(currentQuestion.questionNumber, optionKey)
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
      )}

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestionIndex === 0 && styles.disabledButton,
          ]}
          onPress={handlePrev}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestionIndex === quiz?.questionList.length - 1 &&
              styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={currentQuestionIndex === quiz?.questionList.length - 1}
        >
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {!submitted && currentQuestionIndex === quiz?.questionList.length - 1 && (
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
    marginTop: 12,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF0000",
    textAlign: "right",
    marginBottom: 10,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 15,
  },
  questionImage: {
    width: 200,
    height: 150,
    margin: 5,
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
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    backgroundColor: "#2467EC",
    padding: 10,
    borderRadius: 8,
    width: 100,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  navButtonText: {
    color: "#ffffff",
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QuizScreen;
