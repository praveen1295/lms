import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import QuizCard from "./quiz.card"; // Ensure the correct import path
import useUser from "@/hooks/auth/useUser";
import Loader from "../loader/loader";
import TestsCard from "../cards/tests.card";

export default function AllQuizzes({ examName, filter, examId, isPaid }) {
  const [quizzes, setQuizzes] = useState<any>([]);
  const { user, loading, setRefetch } = useUser();
  const [loader, setLoader] = useState(false);
  const [featuredTest, setFeaturedTest] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<any>(null);

  useEffect(() => {
    setLoader(true);
    axios
      .get(
        `${SERVER_URI}/quiz/allpublishedquiz/test?filterType=${filter}&examName=${examName}`
      )
      .then((res) => {
        const demoTest = res.data.data.filter(
          (item: any) => item.isDemo === true
        );
        let newTests = [];

        if (isPaid) {
          newTests = res.data.data.filter((item: any) => item.isDemo === false);
        } else {
          newTests = res.data.data.filter((item: any) => item.isPaid === false);
        }

        const data = newTests.map((i: any) => {
          if (isPaid) {
            if (user?.tests?.some((d: any) => d._id === examId)) {
              return { ...i, locked: false };
            } else {
              return { ...i, locked: true };
            }
          } else {
            return { ...i, locked: false };
          }
        });

        if (user?.tests?.some((d: any) => d._id === examId))
          setFeaturedTest(data[0]);
        setShowBanner(false);

        setQuizzes([...demoTest, ...data]);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [user]);

  console.log("user0000000", user);

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
      {featuredTest && showBanner && (
        <View style={styles.bannerCard}>
          <Image
            source={require("@/assets/images/icon1.png")}
            style={styles.bannerImage}
          />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>{featuredTest.name}</Text>
            <Text style={styles.bannerDescription}>
              {featuredTest.description}
            </Text>
            <View style={styles.bannerButtonContainer}>
              {!user?.tests?.some(
                (test: any) => test._id === featuredTest._id
              ) ? (
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => console.log("Buy Now pressed")}
                >
                  <Text style={styles.buttonText}>Buy Now</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.purchasedText}>Test Purchased</Text>
              )}
            </View>
          </View>
        </View>
      )}
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
  bannerCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  bannerContent: {
    flex: 1,
    paddingLeft: 15,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  bannerDescription: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  bannerButtonContainer: {
    marginTop: 15,
  },
  buyButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  purchasedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#28A745",
  },
});
