// src/components/lnding_pge.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './lnding.css'; // Ensure this file has the necessary styles

const LandingPage = () => {
  const navigate = useNavigate();

  // Navigate to the sign-in page after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signin'); // Adjusted to match the correct route in App.js
    }, 5000); // 3000ms = 3 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigate]);

  return (
    <div className="landing-container">
      <div className="landing-video">
        <video
          src="/vedio/logo.mp4" // Ensure this path is correct and the video is in the public folder
          autoPlay
          loop
          muted
          className="animated-video"
        />
      </div>
    </div>
  );
};

export default LandingPage;
