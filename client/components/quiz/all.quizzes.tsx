import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import QuizCard from "./quiz.card"; // Ensure the correct import path
import useUser from "@/hooks/auth/useUser";
import Loader from "../loader/loader";

export default function AllQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const { user, loading, setRefetch } = useUser();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    axios
      .get(`${SERVER_URI}/quiz/allpublishedquiz/test`)
      .then((res) => {
        console.log("Fetched quizzes", res.data);
        setQuizzes(res.data.data); // Access the `data` field inside `res.data`
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, []);

  if (loading || loader) {
    return (
      <View>
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Quizzes</Text>
      {quizzes.length > 0 && (
        <FlatList
          data={quizzes}
          keyExtractor={(item: any) => item?._id.toString()} // Use the correct key extractor
          renderItem={({ item }) => <QuizCard item={item} />} // Pass each quiz object to QuizCard
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});
