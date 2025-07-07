import React from "react";
import "./LoadingSpinner.css"; // Import your styles

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <video 
        src="/vedio/11.mp4" // Replace with the actual path to your MP4 video
        autoPlay 
        loop 
        muted 
        className="loading-video"
      />
    </div>
  );
};

export default LoadingSpinner;
