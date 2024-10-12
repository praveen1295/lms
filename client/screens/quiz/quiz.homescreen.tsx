import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header/header";
import SearchInput from "@/components/common/search.input";
import QuizBannerSlider from "@/components/quiz/quiz.banner.slider";
import AllQuizzes from "@/components/quiz/all.quizzes";
import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { useLocalSearchParams } from "expo-router";

export default function QuizHomeScreen() {
  const { category: item } = useLocalSearchParams();
  let category: any;
  try {
    category = JSON.parse(item as string);
  } catch (error) {
    console.log("Error parsing category:", error);
  }

  const [courses, setCourses] = useState<CoursesType[]>([]);
  const [originalCourses, setOriginalCourses] = useState<CoursesType[]>([]);
  const [loading, setLoading] = useState(true); // Now we'll use this
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    axios
      .get(`${SERVER_URI}/get-layout/${category.layout}`)
      .then((res) => {
        setCategories(res.data.layout.categories);
        setLoading(false); // Loading complete
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // In case of an error, stop loading
      });
  }, []);

  const handleCategories = (e: string) => {
    setActiveCategory(e);
    if (e === "All") {
      setCourses(originalCourses);
    } else {
      const filterCourses = originalCourses.filter(
        (i: CoursesType) => i.categories === e
      );
      setCourses(filterCourses);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2467EC" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 50 }}
    >
      <Header />
      {/* Add SearchInput here if needed */}
      {/* <QuizBannerSlider /> */}

      <View style={{ padding: 10 }}>
        {/* <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity
              style={[
                styles.categoryCard,
                {
                  backgroundColor:
                    activeCategory === item.title ? "#2467EC" : "#000",
                },
              ]}
              onPress={() => handleCategories(item.title)}
            >
              <Image
                source={{ uri: item.iconUrl }} // Make sure your API returns this field
                style={styles.categoryImage}
              />
              <Text style={styles.categoryTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        /> */}

        <FlatList
          // ref={flatListRef}
          data={categories}
          keyExtractor={(item: any) => item._id.toString()}
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
      </View>

      {/* Ensure filter is defined in AllQuizzes */}
      {/* <AllQuizzes filter={activeCategory} /> */}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  categoryCard: {
    padding: 10,
    borderRadius: 20,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    alignItems: "center",
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  categoryTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

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
