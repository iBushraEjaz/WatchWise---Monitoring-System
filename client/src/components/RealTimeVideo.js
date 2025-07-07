// src/components/RealTimeVideo.js
import React, { useEffect, useState } from 'react';
import { Typography, Paper } from '@mui/material';
import io from 'socket.io-client';

// Connect to your Flask-SocketIO server
const socket = io('http://localhost:5000');

const RealTimeVideo = () => {
  const [videoFrame, setVideoFrame] = useState(null);

  useEffect(() => {
    // Listen for incoming video frames
    socket.on('video_frame', (data) => {
      setVideoFrame(`data:image/jpeg;base64,${data.frame}`);
    });

    // Cleanup when component unmounts
    return () => {
      socket.off('video_frame');
    };
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5' 
    }}>
      <Paper
        elevation={4}
        style={{
          padding: '20px',
          maxWidth: '800px',
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" style={{ color: '#004D40', marginBottom: '20px', fontWeight: 600 }}>
          Real-Time Video
        </Typography>

        {videoFrame ? (
          <img
            src={videoFrame}
            alt="Real-time stream"
            style={{
              width: '100%',
              maxHeight: '450px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Typography variant="h6" style={{ color: '#aaa' }}>
            Waiting for video stream...
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default RealTimeVideo;
