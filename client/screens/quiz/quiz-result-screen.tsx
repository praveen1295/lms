import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import QuizReport from "./quiz-report";
import Header from "@/components/header/header";
import { useLocalSearchParams } from "expo-router";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QuizResultScreen = () => {
  const { item } = useLocalSearchParams();
  const result: any = JSON.parse(item as string);
  const [loader, setLoader] = useState<boolean>(false);

  // Example report data
  const [report, setReport] = useState(null);

  useEffect(() => {
    // Simulate fetching report data from server
    const fetchReport = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("access_token");
        const refreshToken = await AsyncStorage.getItem("refresh_token");

        setLoader(true);
        const response = await axios.get(
          `${SERVER_URI}/report/${result.reportId}`,
          {
            headers: {
              "access-token": accessToken,
              "refresh-token": refreshToken,
            },
          }
        );
        setReport(response.data.data);
      } catch (error) {
        console.log("error, report", error);
      }
    };

    fetchReport();
  }, []);

  return (
    <View style={styles.container}>
      {report && <QuizReport report={report} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
});
export default QuizResultScreen;
