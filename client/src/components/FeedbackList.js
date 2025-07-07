import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './feedback.css';

const FeedbackList = () => {
  const [stationIds, setStationIds] = useState([]);
  const [stationId, setStationId] = useState('');
  const [feedbacks, setFeedbacks] = useState({});
  const [error, setError] = useState('');
  const [allFeedback, setAllFeedback] = useState(false);

  useEffect(() => {
    const fetchStationIds = async () => {
      try {
        const response = await axios.get('/api/stations/list');
        setStationIds(response.data.station_ids || []);
      } catch (error) {
        setError('Failed to fetch station IDs.');
        console.error('Error fetching station IDs:', error);
      }
    };
    fetchStationIds();
  }, []);

  const fetchFeedback = async () => {
    setError('');
    setFeedbacks({});

    if (!allFeedback && !stationId) {
      setError('Please select a station ID.');
      return;
    }

    try {
      const endpoint = allFeedback
        ? '/api/feedback-report/all'
        : `/api/feedback-report/${stationId}`;
      const response = await axios.get(endpoint);
      setFeedbacks(response.data || {});
      console.log(response.data);
    } catch (error) {
      setError('Failed to fetch feedback.');
      console.error('Error fetching feedback:', error);
    }
  };

  return (
    <div className="container feedback-list">
      <h2>View Feedback</h2>

      {/* Station Selector */}
      {!allFeedback && (
        <div>
          <label htmlFor="stationSelect">Select Station ID:</label>
          <select
            id="stationSelect"
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
          >
            <option value="">-- Select Station --</option>
            {stationIds.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
      )}

      {/* All Feedback Toggle */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={allFeedback}
            onChange={(e) => setAllFeedback(e.target.checked)}
          />{' '}
          Fetch All Feedback
        </label>
      </div>

      {/* Fetch Button */}
      <button onClick={fetchFeedback}>Get Feedback</button>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: "#fff9c4",
          color: "#f57f17",
          padding: "10px 20px",
          borderRadius: "8px",
          textAlign: "center",
          fontSize: "14px",
          fontWeight: "normal",
          maxWidth: "300px",
          margin: "20px auto",
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        }}>
          <strong>{"Data not available"}</strong>
        </div>
      )}

      {/* Feedback Display */}
      {allFeedback && typeof feedbacks === 'object' && !Array.isArray(feedbacks) ? (
        Object.entries(feedbacks).map(([station, feedbackArray], index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h3>Feedback for Station <span style={{ color: '#2c3e50' }}>{station}</span></h3>
            {Array.isArray(feedbackArray) && feedbackArray.length > 0 ? (
              <ul>
                {feedbackArray.map((fb, idx) => (
                  <li key={idx}>
                    <strong>{fb.admin_name}</strong> ({new Date(fb.timestamp).toLocaleString()}): {fb.review} - {fb.rating}/5
                  </li>
                ))}
              </ul>
            ) : (
              <p>No feedback for this station.</p>
            )}
          </div>
        ))
      ) : (
        feedbacks && feedbacks.feedbacks && (
          <div style={{ marginBottom: '20px' }}>
            <h3>Feedback for Station <span style={{ color: '#2c3e50' }}>{feedbacks.station_id}</span></h3>
            {feedbacks.feedbacks.length > 0 ? (
              <ul>
                {feedbacks.feedbacks.map((fb, idx) => (
                  <li key={idx}>
                    <strong>{fb.admin_name}</strong> ({new Date(fb.timestamp).toLocaleString()}): {fb.review} - {fb.rating}/5
                  </li>
                ))}
              </ul>
            ) : (
              <p>No feedback found for this station.</p>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default FeedbackList;
