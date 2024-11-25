import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { router } from "expo-router"; // Import the router directly

const QuizReport = ({ report }) => {
  // Format the creation date to a readable format
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can customize the format based on your needs
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Report</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Score:</Text> {report.score} /{" "}
          {report.total}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Percentage:</Text>{" "}
          {report.percentage.toFixed(2)}%
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Result:</Text> {report.result}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Quiz Date:</Text>{" "}
          {formatDate(report.createdAt)}
        </Text>
      </View>

      {/* Conditionally show a message based on the result */}
      {report.result === "Pass" ? (
        <Text style={styles.successMessage}>
          Congratulations! You passed the quiz!
        </Text>
      ) : (
        <Text style={styles.failMessage}>
          Better luck next time! Keep practicing!
        </Text>
      )}

      {/* Button to go to the home screen */}
      <Button
        title="Go to Home"
        onPress={() => router.push("/(tabs)")}
        color="#2467EC"
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2467EC",
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  successMessage: {
    fontSize: 20,
    color: "#28a745",
    textAlign: "center",
    fontWeight: "bold",
  },
  failMessage: {
    fontSize: 20,
    color: "#dc3545",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default QuizReport;
