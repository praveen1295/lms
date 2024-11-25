import React from "react";
import { WebView } from "react-native-webview";

const VideoPlayer = ({ videoUrl }: { videoUrl: String }) => {
  // Extract video ID from the URL and use the embed link
  const videoId = videoUrl.split("/").pop()?.split("?")[0];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <WebView
      source={{ uri: embedUrl }}
      allowsFullscreenVideo={true}
      javaScriptEnabled={true}
      mediaPlaybackRequiresUserAction={false}
      domStorageEnabled={true}
      startInLoadingState={true}
    />
  );
};

export default VideoPlayer;
