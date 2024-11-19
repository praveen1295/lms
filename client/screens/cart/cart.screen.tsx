import { SERVER_URI } from "@/utils/uri";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Toast } from "react-native-toast-notifications";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
interface CartItemsType {
  courses: CoursesType[];
  tests: CoursesType[];
}

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItemsType>({
    courses: [],
    tests: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    const subscription = async () => {
      const cart: any = await AsyncStorage.getItem("cart");
      console.log("cart=====>", cart);
      setCartItems(JSON.parse(cart) || { courses: [], tests: [] });
    };
    subscription();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const cart: any = await AsyncStorage.getItem("cart");
    setCartItems(cart);
    setRefreshing(false);
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.courses.reduce(
      (total, item) => total + item.price,
      0
    );
    return totalPrice.toFixed(2);
  };

  const handleCourseDetails = (courseDetails: any) => {
    router.push({
      pathname: "/(routes)/course-details",
      params: { item: JSON.stringify(courseDetails) },
    });
  };

  const handleRemoveItem = async (item: any) => {
    const existingCartData = await AsyncStorage.getItem("cart");
    const cartData = existingCartData ? JSON.parse(existingCartData) : {};
    const updatedCartData = cartData.courses.filter(
      (i: any) => i._id !== item._id
    );
    const cartObj = { ...cartData, courses: updatedCartData };
    await AsyncStorage.setItem("cart", JSON.stringify(cartObj));
    setCartItems(updatedCartData);
  };

  // const handlePayment = async () => {
  //   console.log("handlePayment");

  //   try {
  //     const accessToken = await AsyncStorage.getItem("access_token");
  //     const refreshToken = await AsyncStorage.getItem("refresh_token");
  //     const amount = Math.round(
  //       cartItems.reduce((total, item) => total + item.price, 0) * 100
  //     );

  //     console.log("handlePayment", accessToken, refreshToken, amount);

  //     const paymentIntentResponse = await axios.post(
  //       `${SERVER_URI}/payment`,
  //       { amount },
  //       {
  //         headers: {
  //           "access-token": accessToken,
  //           "refresh-token": refreshToken,
  //         },
  //       }
  //     );

  //     const { client_secret: clientSecret } = paymentIntentResponse.data;
  //     console.log("clientSecret", clientSecret);

  //     const initSheetResponse = await initPaymentSheet({
  //       merchantDisplayName: "concept leader Private Ltd.",
  //       paymentIntentClientSecret: clientSecret,
  //     });

  //     console.log("Init sheet response:", initSheetResponse);

  //     if (initSheetResponse.error) {
  //       console.error(
  //         "Error initializing payment sheet:",
  //         initSheetResponse.error
  //       );
  //       return;
  //     }

  //     const paymentResponse = await presentPaymentSheet();

  //     if (paymentResponse.error) {
  //       console.error("Payment failed:", paymentResponse.error);
  //     } else {
  //       console.log("Payment successful:", paymentResponse);
  //       await createOrder(paymentResponse);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handlePayment = async () => {
    console.log("handlePayment");

    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const coursesAmount = Math.round(
        cartItems.courses.reduce((total, item) => total + item.price, 0) * 100
      );
      const testsAmount = Math.round(
        cartItems.tests.reduce((total, item) => total + item.price, 0) * 100
      );

      const amount = coursesAmount + testsAmount;

      console.log("handlePayment", accessToken, refreshToken, amount);

      // Step 1: Create payment intent on the server
      const paymentIntentResponse = await axios.post(
        `${SERVER_URI}/payment`,
        { amount },
        {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        }
      );

      const { client_secret: clientSecret } = paymentIntentResponse.data;
      console.log("clientSecret", clientSecret);

      // Step 2: Initialize the payment sheet
      const initSheetResponse = await initPaymentSheet({
        merchantDisplayName: "concept leader Private Ltd.",
        paymentIntentClientSecret: clientSecret,
        // Ensure default payment method is enabled
        defaultBillingDetails: {
          name: "Customer Name",
          email: "customer@example.com",
        },
      });

      if (initSheetResponse.error) {
        console.error(
          "Error initializing payment sheet:",
          initSheetResponse.error.message
        );
        alert(
          `Payment initialization failed: ${initSheetResponse.error.message}`
        );
        return;
      }

      // Step 3: Present the payment sheet to the user
      const paymentResponse = await presentPaymentSheet();

      if (paymentResponse.error) {
        if (paymentResponse.error.code === "Canceled") {
          console.log("Payment was canceled by the user");
          alert("Payment flow was canceled. Please try again.");
        } else {
          console.error("Payment failed:", paymentResponse.error.message);
          alert(`Payment failed: ${paymentResponse.error.message}`);
        }
      } else {
        console.log("Payment successful:", paymentResponse);
        await createOrder(paymentResponse);
        alert("Payment successful!");
      }
    } catch (error: any) {
      console.error("Payment error:", error.message);
      alert(`Payment error: ${error.message}`);
    }
  };

  const createOrder = async (paymentResponse: any) => {
    const accessToken = await AsyncStorage.getItem("access_token");
    const refreshToken = await AsyncStorage.getItem("refresh_token");

    await axios
      .post(
        `${SERVER_URI}/create-mobile-order`,
        {
          courseId: cartItems.courses[0]._id,
          payment_info: paymentResponse,
        },
        {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        }
      )
      .then((res) => {
        setOrderSuccess(true);
        AsyncStorage.removeItem("cart");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <LinearGradient
      colors={["#E5ECF9", "#F6F7F9"]}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      {orderSuccess ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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
        <>
          <FlatList
            data={[...cartItems?.courses, ...cartItems?.tests]}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  marginVertical: 8,
                  borderRadius: 8,
                  padding: 10,
                  backgroundColor: "white",
                }}
              >
                <TouchableOpacity onPress={() => handleCourseDetails(item)}>
                  <Image
                    source={{ uri: item.thumbnail.url! }}
                    style={{
                      width: 100,
                      height: 100,
                      marginRight: 16,
                      borderRadius: 8,
                    }}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: "space-between" }}>
                  <TouchableOpacity onPress={() => handleCourseDetails(item)}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        fontFamily: "Nunito_700Bold",
                      }}
                    >
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: 16,
                        }}
                      >
                        <Entypo name="dot-single" size={24} color={"gray"} />
                        <Text
                          style={{
                            fontSize: 16,
                            color: "#808080",
                            fontFamily: "Nunito_400Regular",
                          }}
                        >
                          {item.level}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginRight: 16,
                        }}
                      >
                        <FontAwesome
                          name="dollar"
                          size={14}
                          color={"#808080"}
                        />
                        <Text
                          style={{
                            marginLeft: 3,
                            fontSize: 16,
                            color: "#808080",
                          }}
                        >
                          {item.price}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#FF6347",
                      borderRadius: 5,
                      padding: 5,
                      marginTop: 10,
                      width: 100,
                      alignSelf: "flex-start",
                    }}
                    onPress={() => handleRemoveItem(item)}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        textAlign: "center",
                        fontFamily: "Nunito_600SemiBold",
                      }}
                    >
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <Image
                  source={require("@/assets/empty_cart.png")}
                  style={{ width: 200, height: 200, resizeMode: "contain" }}
                />
                <Text
                  style={{
                    fontSize: 24,
                    marginTop: 20,
                    color: "#333",
                    fontFamily: "Raleway_600SemiBold",
                  }}
                >
                  Your Cart is Empty!
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <View style={{ marginBottom: 25 }}>
            {cartItems?.courses?.length === 0 ||
              (cartItems?.courses?.length > 0 && (
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    marginTop: 20,
                    fontFamily: "Nunito_700Bold",
                  }}
                >
                  Total Price: ${calculateTotalPrice()}
                </Text>
              ))}
            {cartItems?.courses?.length === 0 ||
              (cartItems?.courses?.length > 0 && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#007BFF",
                    borderRadius: 5,
                    padding: 10,
                    marginTop: 20,
                    width: "80%",
                    alignSelf: "center",
                  }}
                  onPress={() => handlePayment()}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      textAlign: "center",
                      fontFamily: "Nunito_600SemiBold",
                    }}
                  >
                    Go for payment
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </>
      )}
    </LinearGradient>
  );
}
