import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header/header";
import SearchInput from "@/components/common/search.input";
import HomeBannerSlider from "@/components/home/home.banner.slider";
import { router } from "expo-router";
import AllCourses from "@/components/courses/all.courses";

const categories = [
  {
    title: "Paid Courses",
    filter: "paid",
    icon: require("@/assets/images/icon1.png"),
    redirectPath: "/(routes)/course-list",
    layout: "Categories",
  },
  {
    title: "Free Courses",
    filter: "free",
    icon: require("@/assets/images/icon1.png"),

    redirectPath: "/(routes)/course-list",
    layout: "Categories",
  },
  {
    title: "Paid Test",
    filter: "paid",
    icon: require("@/assets/images/icon1.png"),
    redirectPath: "/(routes)/test-list-layout",
    layout: "paidTest",
  },
  {
    title: "Free Test",
    filter: "free",
    icon: require("@/assets/images/icon1.png"),
    redirectPath: "/(routes)/test-list-layout",
    layout: "freeTest",
  },
  // {
  //   title: "Quiz",
  //   filter: "",
  //   icon: require("@/assets/images/icon1.png"),
  //   redirectPath: "/(routes)/quiz",
  //   layout: "freeQuiz",
  // },
  {
    title: "Paid Ebook",
    filter: "paid",
    icon: require("@/assets/images/icon1.png"),
    redirectPath: "/(routes)/ebook-list",
    layout: "freeTest",
  },
  {
    title: "Free Ebook",
    filter: "free",
    icon: require("@/assets/images/icon1.png"),
    redirectPath: "/(routes)/ebook-list",
    layout: "freeTest",
  },
  // {
  //   title: "Social Media",
  //   filter: "",
  //   icon: require("@/assets/images/icon1.png"),
  //   redirectPath: "/(routes)/quiz",
  //   layout: "freeTest",
  // },
  // {
  //   title: "Updates",
  //   filter: "",
  //   icon: require("@/assets/images/icon1.png"),
  //   redirectPath: "/(routes)/quiz-list",
  //   layout: "freeTest",
  // },
];

export default function HomeScreen() {
  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      <Header />
      <SearchInput homeScreen={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.greetingText}>
          Welcome to Our Learning Platform!
        </Text>
        <HomeBannerSlider />
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() =>
                router.push({
                  pathname: category.redirectPath,
                  params: { category: JSON.stringify(category) },
                })
              }
            >
              <Image source={category.icon} style={styles.icon} />
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* <AllCourses /> */}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  categoryCard: {
    width: "30%", // Ensures three cards per row
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
