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

const tests = [
  {
    _id: "test1",
    title: "Math Test",
    description: "Test your knowledge on various math topics.",
    thumbnailUrl: "https://example.com/test1-thumbnail.jpg",
  },
  {
    _id: "test2",
    title: "English Test",
    description: "Challenge yourself with grammar and vocabulary questions.",
    thumbnailUrl: "https://example.com/test2-thumbnail.jpg",
  },
  // More tests...
];

export default function TestsList({ isPayed }) {
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const handleTestPress = (testId) => {
    console.log(`Test selected: ${testId}`);
    // Implement navigation to test detail or test start screen
  };

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headingText}>
          {isPayed ? "Paid Tests" : "Free Tests"}
        </Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading Tests...</Text>
        ) : (
          <FlatList
            ref={flatListRef}
            data={tests}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.testCard}>
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={styles.testImage}
                />
                <View style={styles.testContent}>
                  <Text style={styles.testTitle}>{item.title}</Text>
                  <Text style={styles.testDescription}>{item.description}</Text>
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
TestsList.propTypes = {
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
    textAlign: "left",
    marginVertical: 7,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  testCard: {
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
  testImage: {
    width: 80, // Smaller width
    height: 80, // Smaller height
    borderRadius: 10,
  },
  testContent: {
    flex: 1,
    paddingLeft: 10,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  testDescription: {
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
