import React, { useState, useRef } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header/header"; // You can uncomment this if you want to use Header
import SearchInput from "@/components/common/search.input"; // You can uncomment this if you want to use SearchInput

const ebooks = [
  {
    _id: "ebook1",
    title: "Introduction to React",
    description:
      "Learn the fundamentals of React for building interactive UIs.",
    thumbnailUrl: "https://example.com/ebook1-thumbnail.jpg",
  },
  {
    _id: "ebook2",
    title: "Mastering Node.js",
    description:
      "A comprehensive guide to Node.js for server-side development.",
    thumbnailUrl: "https://example.com/ebook2-thumbnail.jpg",
  },
  // More eBooks...
];

export default function EbookList({ isPayed }) {
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const handleEbookPress = (ebookId) => {
    console.log(`eBook selected: ${ebookId}`);
    // Implement navigation to eBook detail or download screen
  };

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      {/* <Header /> */}
      {/* <SearchInput homeScreen={true} /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headingText}>
          {isPayed ? "Paid eBooks" : "Free eBooks"}
        </Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading eBooks...</Text>
        ) : (
          <FlatList
            ref={flatListRef}
            data={ebooks}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.ebookCard}>
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={styles.ebookImage}
                />
                <View style={styles.ebookContent}>
                  <Text style={styles.ebookTitle}>{item.title}</Text>
                  <Text style={styles.ebookDescription}>
                    {item.description}
                  </Text>
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
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// Define PropTypes for the component
EbookList.propTypes = {
  isPayed: PropTypes.bool.isRequired, // Prop validation
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 7,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  ebookCard: {
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
  ebookImage: {
    width: 80, // Smaller width
    height: 80, // Smaller height
    borderRadius: 10,
  },
  ebookContent: {
    flex: 1,
    paddingLeft: 10,
  },
  ebookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  ebookDescription: {
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
