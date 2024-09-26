import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_600SemiBold } from "@expo-google-fonts/nunito"; // Import from the correct package
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { router } from "expo-router";

export default function StartExam({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [attemptedAnswers, setAttemptedAnswers] = useState<Record<string, any>>(
    {}
  );

  let [fontsLoaded] = useFonts({
    Raleway_700Bold,
    Nunito_600SemiBold, // Use Nunito from the correct package
  });

  useEffect(() => {
    axios
      .get(`${SERVER_URI}/quizzes/${quizId}`)
      .then((res) => {
        setQuiz(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error", "Failed to load quiz.");
        setLoading(false);
      });
  }, [quizId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAttemptedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    axios
      .post(`${SERVER_URI}/submit-quiz`, {
        quizId,
        attemptedQuestion: attemptedAnswers,
      })
      .then((res) => {
        Alert.alert("Success", res.data.message);
        router.push("/results");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error", "Failed to submit quiz.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{quiz?.name}</Text>
      <FlatList
        data={quiz?.questionList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{item.question}</Text>
            {item.options.map((option: any) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleAnswerChange(item.id, option)}
                style={styles.optionButton}
              >
                <Text>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Submit Exam</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Raleway_700Bold",
    marginBottom: 16,
  },
  questionContainer: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  optionButton: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#2467EC",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontFamily: "Nunito_600SemiBold",
  },
});
