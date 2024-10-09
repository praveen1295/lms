import React, { useState, useRef } from "react";
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
import Header from "@/components/header/header";
import SearchInput from "@/components/common/search.input";

const quizzes = [
  {
    _id: "quiz1",
    title: "General Knowledge Quiz",
    description: "Test your knowledge on various subjects.",
    thumbnailUrl: "https://example.com/quiz1-thumbnail.jpg",
  },
  {
    _id: "quiz2",
    title: "Science Quiz",
    description: "Challenge yourself with science questions.",
    thumbnailUrl: "https://example.com/quiz2-thumbnail.jpg",
  },
  // More quizzes...
];

export default function QuizList({ isPayed = false }) {
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const handleQuizPress = (quizId: any) => {
    console.log(`Quiz selected: ${quizId}`);
    // Implement navigation to quiz detail or quiz start screen
  };

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      {/* <Header /> */}
      {/* <SearchInput homeScreen={true} /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headingText}>Quiz</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading Quizzes...</Text>
        ) : (
          <FlatList
            ref={flatListRef}
            data={quizzes}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.quizCard}>
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={styles.quizImage}
                />
                <View style={styles.quizContent}>
                  <Text style={styles.quizTitle}>{item.title}</Text>
                  <Text style={styles.quizDescription}>{item.description}</Text>
                  <View style={styles.buttonContainer}>
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
                  </View>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// Define PropTypes for the component
QuizList.propTypes = {
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
  quizCard: {
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
  quizImage: {
    width: 80, // Smaller width
    height: 80, // Smaller height
    borderRadius: 10,
  },
  quizContent: {
    flex: 1,
    paddingLeft: 10,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  quizDescription: {
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
