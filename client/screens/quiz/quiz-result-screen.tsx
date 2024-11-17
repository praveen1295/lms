import React, { useState, useEffect } from "react";
import { View } from "react-native";
import QuizReport from "./quiz-report";

const QuizResultScreen = () => {
  // Example report data
  const [report, setReport] = useState(null);

  useEffect(() => {
    // Simulate fetching report data from server
    const fetchReport = async () => {
      // Here you would fetch the report data from the API
      // Example data:
      const fetchedReport: any = {
        _id: { $oid: "66f658929857c19ec3ca1d2e" },
        userId: { $oid: "66ef923d01858bdedf225022" },
        quizId: { $oid: "66f656859d672a2ae5e7ece0" },
        score: 7,
        total: 25,
        percentage: 28.0,
        result: "Fail",
        createdAt: { $date: "2024-09-27T07:02:42.238Z" },
        updatedAt: { $date: "2024-09-27T07:02:42.238Z" },
        __v: 0,
      };
      setReport(fetchedReport);
    };

    fetchReport();
  }, []);

  return <View>{report && <QuizReport report={report} />}</View>;
};

export default QuizResultScreen;
