import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router"; // Import useSearchParams
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import AllQuizzes from "@/components/quiz/all.quizzes";
import useUser from "@/hooks/auth/useUser";

export default function TestsList() {
  const { loading, user } = useUser();
  const [loader, setLoader] = useState(false);
  const flatListRef = useRef(null);
  const { item } = useLocalSearchParams();
  const layout: any = JSON.parse(item as string);

  console.log("layout.value", layout.value);
  const [tests, setTests] = useState<any>([]);
  const [featuredTest, setFeaturedTest] = useState<any>(null);

  useEffect(() => {
    setLoader(true);
    axios
      .get(
        `${SERVER_URI}/quiz/allpublishedquiz/test?filterType=${layout?.filter}&examName=${layout.value}`
      )
      .then((res) => {
        const demoTest = res.data.data.filter(
          (item: any) => item.isDemo === true
        );
        const paidTests = res.data.data.filter(
          (item: any) => item.isDemo === false
        );

        // Set the first test as the featured test (you can modify this logic)
        setFeaturedTest(paidTests[0]);

        setTests([...demoTest, ...paidTests]);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, []);

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      <AllQuizzes
        filter={layout.filter}
        examName={layout.value}
        examId={layout._id}
      />
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
});
