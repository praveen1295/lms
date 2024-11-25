import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Loader from "@/components/loader/loader";
import useUser from "@/hooks/auth/useUser";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URI } from "@/utils/uri";
import { Toast } from "react-native-toast-notifications";

export default function UserProfile() {
  const { user, loading } = useUser();
  const [userInfo, setUserInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loader, setLoader] = useState(false);

  // Initialize state with user data when it's loaded
  useEffect(() => {
    if (user) {
      setUserInfo(user);
    }
  }, [user]);

  // Save the updated information (you can replace this with an API call)
  const saveChanges = async () => {
    // Save logic goes here (API call, etc.)
    const accessToken = await AsyncStorage.getItem("access_token");
    const refreshToken = await AsyncStorage.getItem("refresh_token");

    try {
      const response = await axios.put(
        `${SERVER_URI}/update-user-info`,
        userInfo,
        {
          headers: {
            "access-token": accessToken,
            "refresh-token": refreshToken,
          },
        }
      );
      if (response.data) {
        setUserInfo(response.data.data);
        setLoader(false);
        Toast.show(response.data.message, {
          type: "success",
        });
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }

    setIsEditing(false);
  };

  if (loading || loader) return <Loader />;

  return (
    <ScrollView style={{ padding: 15, backgroundColor: "#f8f9fa" }}>
      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 10,
            color: "#333",
          }}
        >
          User Profile
        </Text>

        {userInfo && (
          <>
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 18, color: "#555", marginBottom: 5 }}>
                Name
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 5,
                  padding: 10,
                  fontSize: 16,
                  backgroundColor: isEditing ? "#fff" : "#f1f1f1",
                }}
                value={userInfo?.name}
                editable={isEditing}
                onChangeText={(value) =>
                  setUserInfo({ ...userInfo, name: value })
                }
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 18, color: "#555", marginBottom: 5 }}>
                Email
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 5,
                  padding: 10,
                  fontSize: 16,
                  backgroundColor: isEditing ? "#fff" : "#f1f1f1",
                }}
                value={userInfo?.email}
                editable={isEditing}
                onChangeText={(value) =>
                  setUserInfo({ ...userInfo, email: value })
                }
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 18, color: "#555", marginBottom: 5 }}>
                Phone Number
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 5,
                  padding: 10,
                  fontSize: 16,
                  backgroundColor: isEditing ? "#fff" : "#f1f1f1",
                }}
                keyboardType="numeric"
                value={String(userInfo?.phone_number)}
                editable={isEditing}
                onChangeText={(value) =>
                  setUserInfo({
                    ...userInfo,
                    phone_number: value.replace(/[^0-9]/g, ""),
                  })
                }
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 18, color: "#555", marginBottom: 5 }}>
                Verification Status
              </Text>
              <Text style={{ fontSize: 16 }}>
                {userInfo?.isVerified ? "Verified" : "Not Verified"}
              </Text>
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 18, color: "#555", marginBottom: 5 }}>
                Account Status
              </Text>
              <Text style={{ fontSize: 16 }}>
                {userInfo?.accountBlocked ? "Blocked" : "Active"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => (isEditing ? saveChanges() : setIsEditing(true))}
              style={{
                backgroundColor: isEditing ? "#28a745" : "#007bff",
                padding: 12,
                borderRadius: 5,
                marginTop: 20,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}
