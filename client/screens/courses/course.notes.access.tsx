// import React, { useEffect, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Text,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import Loader from "@/components/loader/loader";
// import { Toast } from "react-native-toast-notifications";
// import { FontAwesome } from "@expo/vector-icons";

// export default function PDFViewer() {
//   const pdfUrl =
//     "http://192.168.1.113:8000/api/v1/static/pdf_files/project_file.pdf";

//   const htmlContent = `
//     <html>
//       <body>
//         <iframe
//           src="${pdfUrl}"
//           width="100%"
//           height="100%"
//           style="border: none;"
//         ></iframe>
//       </body>
//     </html>
//   `;

//   return (
//     <View style={styles.container}>
//       <WebView
//         originWhitelist={["*"]}
//         source={{ html: htmlContent }}
//         style={styles.webview}
//         startInLoadingState={true}
//         renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   pdfViewer: {
//     width: "100%",
//     height: "100%",
//   },
//   container: {
//     flex: 1,
//   },
//   webview: {
//     flex: 1,
//   },
//   button: {
//     width: "35%",
//     height: 40,
//     backgroundColor: "#2467EC",
//     marginVertical: 10,
//     borderRadius: 40,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import Pdf from "react-native-pdf";
import { useLocalSearchParams } from "expo-router";

const PDFViewer = () => {
  const { courseData: item } = useLocalSearchParams();
  const courseData: any = JSON.parse(item as string);
  console.log("courseData?.notes.url", courseData?.notes.url);
  const PdfResource = {
    uri: courseData?.notes.url,
    cache: true,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{courseData.name}</Text>
      <Pdf
        trustAllCerts={false}
        source={PdfResource}
        style={styles.pdf}
        onLoadComplete={(numberOfPages: any, filePath: any) => {
          console.log(`number of pages: ${numberOfPages}`);
        }}
      />
    </View>
  );
};

export default PDFViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
