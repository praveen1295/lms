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

const categories = [
  { title: "Paid Courses", icon: "", redirectPath: "/(routes)/course-list" },
  { title: "Free Courses", icon: "", redirectPath: "/(routes)/course-list" },
  { title: "Paid Test", icon: "", redirectPath: "/(routes)/test-list" },
  { title: "Free Test", icon: "", redirectPath: "/(routes)/test-list" },
  { title: "Quiz", icon: "", redirectPath: "/(routes)/quiz-list" },
  { title: "Paid Ebook", icon: "", redirectPath: "/(routes)/ebook-list" },
  { title: "Free Ebook", icon: "", redirectPath: "/(routes)/ebook-list" },
  { title: "Social Media", icon: "", redirectPath: "/(routes)/quiz-list" },
  { title: "Updates", icon: "", redirectPath: "/(routes)/quiz-list" },
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
              onPress={() => router.push(category.redirectPath)}
            >
              <Image source={category.icon} style={styles.icon} />
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
