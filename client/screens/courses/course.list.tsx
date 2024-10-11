import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header/header"; // You can uncomment this if you want to use Header
import SearchInput from "@/components/common/search.input"; // You can uncomment this if you want to use SearchInput
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { createNavigatorFactory } from "@react-navigation/native";

export default function CourseList({}) {
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const { category: item } = useLocalSearchParams();
  const category: any = JSON.parse(item as string);

  const [courses, setCourses] = useState([]);
  const [loader, setLoader] = useState(false);

  const handleCoursePress = (courseId) => {
    console.log(`Course selected: ${courseId}`);
    // Implement navigation to course detail or course start screen
  };

  useEffect(() => {
    setLoader(true);
    axios
      .get(`${SERVER_URI}/get-courses?filterType=${category.filter}`)
      .then((res: any) => {
        setCourses(res.data.courses);
        console.log("res.data.+++++++", res.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [createNavigatorFactory]); // Re-run effect when filter changes

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      {/* <Header /> */}
      {/* <SearchInput homeScreen={true} /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headingText}>
          {category.filter.charAt(0).toUpperCase() + category.filter.slice(1)}{" "}
          Courses
        </Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading Courses...</Text>
        ) : (
          <FlatList
            ref={flatListRef}
            data={courses}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity
                style={styles.courseCard}
                onPress={() =>
                  router.push({
                    pathname: "/(routes)/course-details",
                    params: { item: JSON.stringify(item) },
                  })
                }
              >
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={styles.courseImage}
                />
                <View style={styles.courseContent}>
                  <Text style={styles.courseTitle}>{item.name}</Text>
                  <Text style={styles.courseDescription}>
                    {item.description.split(" ").slice(0, 7).join(" ") +
                      (item.description.split(" ").length > 7 ? "..." : "")}
                  </Text>
                  {/* <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => console.log("Buy Now pressed")}
                    >
                      <Text style={styles.buttonText}>Buy Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.demoButton]}
                      onPress={() => console.log("View Demo pressed")}
                    >
                      <Text style={styles.buttonText}>View Demo</Text>
                    </TouchableOpacity>
                  </View> */}
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// Define PropTypes for the component
CourseList.propTypes = {
  isPayed: PropTypes.bool.isRequired, // Prop validation
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 7,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  courseImage: {
    width: 80, // Smaller width
    height: 80, // Smaller height
    borderRadius: 10,
  },
  courseContent: {
    flex: 1,
    paddingLeft: 10,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  courseDescription: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  demoButton: {
    backgroundColor: "#28A745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
