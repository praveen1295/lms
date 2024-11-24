import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import AllQuizzes from "@/components/quiz/all.quizzes";
import useUser from "@/hooks/auth/useUser";

export default function TestsList() {
  const { loading, user } = useUser();
  const [loader, setLoader] = useState(false);
  const flatListRef = useRef(null);
  const { item } = useLocalSearchParams();
  const testCourse = JSON.parse(item as string);

  console.log("testCourse+++++++++++++++++++++>>>>", testCourse.filter);

  const [tests, setTests] = useState<any>([]);
  const [featuredTest, setFeaturedTest] = useState(null);

  useEffect(() => {
    setLoader(true);
    axios
      .get(
        `${SERVER_URI}/quiz/allpublishedquiz/test?filterType=${testCourse?.filter}&examName=${testCourse.value}&isDemo=${testCourse?.isDemo}`
      )
      .then((res) => {
        console.log("rrrrrrrrrrrrrr", res.data);
        const demoTest = res.data.data.filter(
          (item: any) => item.isDemo === true
        );

        let newTests;

        if (testCourse.isPaid) {
          newTests = res.data.data.filter((item: any) => item.isDemo === false);
        } else {
          newTests = res.data.data.filter((item: any) => item.isPaid === false);
        }

        // Set the first test as the featured test (you can modify this logic)
        setFeaturedTest(newTests[0]);

        setTests([...demoTest, ...newTests]);
      })
      .catch((error) => {
        console.error(JSON.stringify(error));
      })
      .finally(() => {
        setLoader(false);
      });
  }, []);

  const renderNoData = () => (
    <View style={styles.noDataContainer}>
      {/* <Image source={require("@/assets/images/noData.png")} /> */}
      <Text style={styles.noDataText}>
        No tests available. Please try again later.
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      {loader ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
      ) : tests.length === 0 ? (
        renderNoData()
      ) : (
        <AllQuizzes
          filter={testCourse.filter}
          examName={testCourse.value}
          examId={testCourse._id}
          isPaid={testCourse?.isPaid}
          // tests={tests}
          // featuredTest={featuredTest}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noDataImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: "contain",
  },
  noDataText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    fontWeight: "bold",
  },
});
