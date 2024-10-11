import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import QuizCard from "./quiz.card"; // Ensure the correct import path
import useUser from "@/hooks/auth/useUser";
import Loader from "../loader/loader";

export default function AllQuizzes({ filter = "free" }) {
  const [quizzes, setQuizzes] = useState([]);
  const { user, loading, setRefetch } = useUser();
  const [loader, setLoader] = useState(false);
  // const [filter, setFilter] = useState("all"); // Default filter is 'all'

  useEffect(() => {
    setLoader(true);
    axios
      .get(`${SERVER_URI}/quiz/allpublishedquiz/test?filterType=${filter}`) // API call with filter
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
  }, [filter]); // Re-run effect when filter changes

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

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => setFilter("all")}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "paid" && styles.activeFilter,
          ]}
          onPress={() => setFilter("paid")}
        >
          <Text style={styles.filterText}>Paid</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "free" && styles.activeFilter,
          ]}
          onPress={() => setFilter("free")}
        >
          <Text style={styles.filterText}>Free</Text>
        </TouchableOpacity>
      </View>

      {quizzes.length > 0 ? (
        <FlatList
          data={quizzes}
          keyExtractor={(item: any) => item?._id.toString()} // Use the correct key extractor
          renderItem={({ item }) => <QuizCard item={item} />} // Pass each quiz object to QuizCard
        />
      ) : (
        <Text style={styles.noQuizText}>No quizzes available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    backgroundColor: "#ddd",
    borderRadius: 4,
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#007bff",
  },
  filterText: {
    color: "#fff",
  },
  noQuizText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
