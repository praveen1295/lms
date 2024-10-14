import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
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
import Header from "@/components/header/header";
import SearchInput from "@/components/common/search.input";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import { createNavigatorFactory } from "@react-navigation/native";
import { handlePayment } from "@/utils/helper";
import useUser from "@/hooks/auth/useUser";

export default function TestListLayout({}) {
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const { category: item } = useLocalSearchParams();
  const category = JSON.parse(item as string);
  const { user, setRefetch } = useUser();

  const [layout, setLayout] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  const handleCoursePress = (courseId: String) => {
    console.log(`Quiz selected: ${courseId}`);
  };

  useEffect(() => {
    setLoader(true);
    axios
      .get(`${SERVER_URI}/get-test-courses?isPaid=${category.filter}`)
      .then((res) => {
        setLayout(res.data.testCourses);
        console.log("res.data.+++++++", res.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [createNavigatorFactory]);

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={styles.container}>
      {orderSuccess ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/images/account_confirmation.png")}
            style={{
              width: 200,
              height: 200,
              resizeMode: "contain",
              marginBottom: 20,
            }}
          />
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 22, fontFamily: "Raleway_700Bold" }}>
              Payment Successful!
            </Text>
            <Text
              style={{
                fontSize: 15,
                marginTop: 5,
                color: "#575757",
                fontFamily: "Nunito_400Regular",
              }}
            >
              Thank you for your purchase!
            </Text>
          </View>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 16, color: "575757" }}>
              You will receive one email shortly!
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {loader ? (
            <Text style={styles.loadingText}>Loading Tests...</Text>
          ) : layout.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No Tests Found</Text>
              <Text style={styles.suggestionText}>
                Please try a different category or refresh the page.
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={layout}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <View style={styles.courseCard}>
                  <Image
                    source={require("@/assets/images/icon.png")}
                    style={styles.courseImage}
                  />
                  <View style={styles.courseContent}>
                    <Text style={styles.courseTitle}>{item.name}</Text>
                    <Text style={styles.courseDescription}>
                      {item.description.split(" ").slice(0, 7).join(" ") +
                        (item.description.split(" ").length > 7 ? "..." : "")}
                    </Text>
                    <View style={styles.buttonContainer}>
                      <View>
                        {user?.tests?.some((d: any) => d._id === item._id) ? (
                          <TouchableOpacity
                            style={[styles.button, styles.goButton]}
                            onPress={() =>
                              router.push({
                                pathname: "/(routes)/test-list",
                                params: {
                                  item: JSON.stringify({
                                    ...item,
                                    filter: category.filter,
                                  }),
                                },
                              })
                            }
                          >
                            <Text style={styles.buttonText}>Start </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                              const cartItems = { tests: [{ ...item }] };
                              handlePayment(cartItems, setOrderSuccess);
                            }}
                          >
                            <Text style={styles.buttonText}>Buy Test</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      {!user?.tests?.some((d: any) => d._id === item._id) && (
                        <TouchableOpacity
                          style={[styles.button, styles.demoButton]}
                          onPress={() =>
                            router.push({
                              pathname: "/(routes)/test-list",
                              params: {
                                item: JSON.stringify({
                                  ...item,
                                  filter: category.filter,
                                }),
                              },
                            })
                          }
                        >
                          <Text style={styles.buttonText}>View Demo</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

TestListLayout.propTypes = {
  isPayed: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
    color: "#555",
  },
  noDataContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  noDataText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#777",
  },
  suggestionText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  courseImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  courseContent: {
    flex: 1,
    paddingLeft: 10,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  courseDescription: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  demoButton: {
    backgroundColor: "#34D399",
  },
  goButton: {
    backgroundColor: "#6C63FF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
