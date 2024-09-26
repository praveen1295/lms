import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { Nunito_400Regular, Nunito_700Bold } from "@expo-google-fonts/nunito";
import { SERVER_URI } from "@/utils/uri"; // Adjust the path if needed
import useUser from "@/hooks/auth/useUser";
import Loader from "../loader/loader";

const { width } = Dimensions.get("window"); // Get the device width

export default function QuizBannerSlider() {
  const { user, loading, setRefetch } = useUser();
  const [loader, setLoader] = useState(false);

  const [banners, setBanners] = useState([]);
  const [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
  });

  useEffect(() => {
    setLoader(true);
    axios
      .get(`${SERVER_URI}/get-quiz-banners`) // Update the endpoint based on your API
      .then((res) => {
        setBanners(res.data.banners); // Adjust based on your response structure
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false); // Set loading to false once data is fetched
      });
  }, []);

  if (loading || loader) {
    return (
      <View style={styles.loadingContainer}>
        <Loader />
        {/* <ActivityIndicator size="large" color="#0000ff" /> */}
      </View>
    );
  }

  if (fontError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading fonts!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Featured Quizzes</Text>
      <FlatList
        data={banners}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bannerCard}>
            <Image
              source={{ uri: item.bannerImageUrl }} // Assuming each banner has an image URL
              style={{ width: width * 0.7, height: 200 }} // Responsive width
              resizeMode="cover"
            />
            <Text style={styles.title}>{item.title}</Text>
            {/* Add more details and styles as needed */}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  bannerCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 8,
    elevation: 3,
    alignItems: "center", // Center items in the card
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
