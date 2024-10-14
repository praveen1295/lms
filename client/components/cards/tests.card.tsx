import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router"; // Import the router directly
import { LinearGradient } from "expo-linear-gradient"; // Gradient background
import { Ionicons } from "@expo/vector-icons"; // For lock icon

const TestsCard = ({ item }: { item: any }) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      disabled={item.locked} // Disable the touchable if locked
    >
      {/* Card Background with Gradient */}
      <LinearGradient
        colors={["#2467EC", "#4A90E2"]}
        style={[styles.cardBackground, item.locked && styles.lockedCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.demoText}>
            {item.isDemo ? "Demo Quiz" : "Full Quiz"}
          </Text>

          {/* Display Quiz Category */}
          <Text style={styles.description}>Category: {item.category}</Text>

          {/* Display Passing Percentage */}
          <Text style={styles.description}>
            Passing Percentage: {item.passingPercentage}%
          </Text>

          {/* Display if it's a public quiz */}
          <Text style={styles.description}>
            {item.isPublicQuiz ? "Public Quiz" : "Private Quiz"}
          </Text>

          {/* Show lock icon if the quiz is locked */}
          {item.locked && (
            <View style={styles.lockContainer}>
              <Ionicons name="lock-closed" size={24} color="#fff" />
              <Text style={styles.lockText}>Locked</Text>
            </View>
          )}

          {/* Show Start Quiz button if not locked */}
          {!item.locked && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                !item.locked && // Prevent navigation if the quiz is locked
                router.push({
                  pathname: "/(routes)/quiz-instruction",
                  params: { quiz: JSON.stringify(item) },
                })
              }
            >
              <Text style={styles.buttonText}>Start Quiz</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardBackground: {
    borderRadius: 12,
    padding: 20,
  },
  lockedCard: {
    opacity: 0.5, // Add opacity to indicate the quiz is locked
  },
  cardContent: {
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  demoText: {
    fontSize: 14,
    color: "#F5A623",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#F5A623",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  lockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  lockText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
});

export default TestsCard;
