// QuizHomeScreen.tsx

import { View, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header/header"; // Ensure this is the correct path for your Header component
import SearchInput from "@/components/common/search.input"; // Ensure this is the correct path for your SearchInput component
import QuizBannerSlider from "@/components/quiz/quiz.banner.slider"; // Create a banner slider specific to quizzes
import AllQuizzes from "@/components/quiz/all.quizzes"; // Create a component to display all quizzes

export default function QuizHomeScreen() {
  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, paddingTop: 50 }}
    >
      <Header />
      {/* <SearchInput quizScreen={true} /> */}
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      <QuizBannerSlider />
      <AllQuizzes />
      {/* </ScrollView> */}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Add any styles you need here
});
