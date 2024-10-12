import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import QuizCard from "./quiz.card"; // Ensure the correct import path
import useUser from "@/hooks/auth/useUser";
import Loader from "../loader/loader";
import TestsCard from "../cards/tests.card";

export default function AllQuizzes({ examName, filter }) {
  const [quizzes, setQuizzes] = useState<any>([]);
  const { user, loading, setRefetch } = useUser();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    axios
      .get(
        `${SERVER_URI}/quiz/allpublishedquiz/test?filterType=${filter}&examName=${examName}`
      )
      .then((res) => {
        console.log("Fetched quizzes", res.data);
        const demoTest = res.data.data.filter(
          (item: any) => item.isDemo === true
        );
        const paidTests = res.data.data.filter(
          (item: any) => item.isDemo === false
        );

        const data = paidTests.map((i: any) => {
          if (user?.tests?.some((d: any) => d._id === i._id)) {
            return { ...i, locked: false };
          } else {
            return { ...i, locked: true };
          }
        });

        setQuizzes([...demoTest, ...data]);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [filter]);

  if (loading || loader) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Text style={styles.header}>Available Quizzes</Text>

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "paid" && styles.activeFilter,
          ]}
        >
          <Text style={styles.filterText}>Paid</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "free" && styles.activeFilter,
          ]}
        >
          <Text style={styles.filterText}>Free</Text>
        </TouchableOpacity>
      </View>

      {quizzes.length > 0 ? (
        <FlatList
          data={quizzes}
          keyExtractor={(item: any) => item?._id.toString()}
          renderItem={({ item }) => <TestsCard item={item} />}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      ) : (
        <Text style={styles.noQuizText}>No quizzes available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
