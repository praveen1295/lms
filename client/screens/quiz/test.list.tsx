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
  const [tests, setTests] = useState<any>([]);
  const [featuredTest, setFeaturedTest] = useState<any>(null);

  useEffect(() => {
    setLoader(true);
    axios
      .get(
        `${SERVER_URI}/quiz/allpublishedquiz/test?filterType=${layout?.filter}&examName=${layout.examName}`
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
      {featuredTest && (
        <View style={styles.bannerCard}>
          <Image
            source={{ uri: featuredTest.thumbnailUrl }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>{featuredTest.name}</Text>
            <Text style={styles.bannerDescription}>
              {featuredTest.description}
            </Text>
            <View style={styles.bannerButtonContainer}>
              {!user?.tests?.some(
                (test: any) => test._id === featuredTest._id
              ) ? (
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => console.log("Buy Now pressed")}
                >
                  <Text style={styles.buttonText}>Buy Now</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.purchasedText}>Test Purchased</Text>
              )}
            </View>
          </View>
        </View>
      )}

      <AllQuizzes filter={layout.filter} examName={layout.examName} />
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
  bannerCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  bannerImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  bannerContent: {
    flex: 1,
    paddingLeft: 15,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  bannerDescription: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  bannerButtonContainer: {
    marginTop: 15,
  },
  buyButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  purchasedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#28A745",
  },
});
