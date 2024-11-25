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
import Loader from "../loader/loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ShowAllReports() {
  const [reports, setReports] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      setLoader(true);
      axios
        .get(`${SERVER_URI}/report`, {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        })
        .then((res) => {
          setReports(res.data.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoader(false);
        });
    };

    fetchReport();
  }, []);

  if (loader) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Quiz Reports</Text>

      {reports.length > 0 ? (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>Quiz ID: {item.quizId}</Text>
              <Text>
                Score: {item.score} / {item.total}
              </Text>
              <Text>Percentage: {item.percentage.toFixed(2)}%</Text>
              <Text>Result: {item.result}</Text>
              <Text>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      ) : (
        <Text style={styles.noReportsText}>No reports available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  noReportsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
