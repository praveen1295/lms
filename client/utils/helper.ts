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

const { initPaymentSheet, presentPaymentSheet } = useStripe();

const handlePayment = async (cartItems: any, setOrderSuccess: any) => {
  console.log("handlePayment");

  try {
    const accessToken = await AsyncStorage.getItem("access_token");
    const refreshToken = await AsyncStorage.getItem("refresh_token");

    if (!accessToken) {
      throw new Error("Access token not found");
    }

    let amount: number = 0;

    if (cartItems.courses) {
      amount = Math.round(
        cartItems.courses.reduce((total, item) => total + item.price, 0) * 100
      );
    } else if (cartItems.tests) {
      amount = Math.round(
        cartItems.tests.reduce((total, item) => total + item.price, 0) * 100
      );
    }

    // const totalAmount = coursesAmount + testsAmount;

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
      merchantDisplayName: "entrance exam warriors Private Ltd.",
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
      await createOrder(paymentResponse, setOrderSuccess, cartItems);
      alert("Payment successful!");
    }
  } catch (error: any) {
    console.error("Payment error:", error.message);
    alert(`Payment error: ${error.message}`);
  }
};

const createOrder = async (
  paymentResponse: any,
  setOrderSuccess: any,
  cartItems: any
) => {
  console.log("createOrder calllled");
  const accessToken = await AsyncStorage.getItem("access_token");
  const refreshToken = await AsyncStorage.getItem("refresh_token");
  console.log("cartItems", accessToken, refreshToken, cartItems);

  let keyId = "";
  let valueId = "";

  if (cartItems.tests) {
    keyId = "testId";
    valueId = cartItems.tests[0]._id;
  } else if (cartItems.courses) {
    keyId = "courseId";
    valueId = cartItems.courses[0]._id;
  }
  console.log("cartItems", cartItems);
  await axios
    .post(
      `${SERVER_URI}/create-mobile-order`,
      {
        [keyId]: valueId,
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

export { handlePayment, createOrder };
