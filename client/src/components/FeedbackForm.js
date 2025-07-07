import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './feedback.css'; // Import the CSS file

const FeedbackForm = () => {
  const [stationIds, setStationIds] = useState([]);
  const [stationId, setStationId] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fetchStationIds = async () => {
      setLoading(true); // Show spinner
      try {
        const response = await axios.get('/api/stations/list');
        setStationIds(response.data.station_ids || []);
      } catch (error) {
        setError('Failed to fetch station IDs.');
        console.error('Error fetching station IDs:', error);
      } finally {
        setLoading(false); // Hide spinner
      }
    };
    fetchStationIds();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // Show spinner

    if (!stationId || !review || !rating) {
      setError('All fields are required.');
      setLoading(false); // Hide spinner
      return;
    }

    try {
      const response = await axios.post('/api/submit-feedback', {
        station_id: stationId,
        review,
        rating: parseFloat(rating),
      });
      setSuccess(response.data.message || 'Feedback submitted successfully!');
      setStationId('');
      setReview('');
      setRating('');
    } catch (error) {
      setError(
        error.response?.data?.error ||
        'An error occurred while submitting feedback.'
      );
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <div className="container">
      <h2>Submit Feedback</h2>

      {/* Show error or success messages */}
      {error && (
        <div style={{
          backgroundColor: "#fff9c4",  // Soft yellow background
          color: "#f57f17",            // Dark orange text
          padding: "10px 20px",        // Smaller padding for compactness
          borderRadius: "8px",         // Slightly rounded corners
          textAlign: "center",
          fontSize: "14px",             // Smaller text size for a less prominent message
          fontWeight: "normal",        // Make the font weight normal (less bold)
          maxWidth: "400px",           // Reduced width to make it more compact
          margin: "0 auto",            // Center the error box horizontally
          marginBottom: "20px",        // Add some space below the error box
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)", // Soft shadow to make it stand out
        }}>
          <strong>{"No Data available"}</strong>
        </div>
      )}
      {success && (
        <div style={{
          backgroundColor: "#e8f5e9", // Soft green background for success
          color: "#388e3c",           // Dark green text
          padding: "10px 20px",       // Padding for the success message
          borderRadius: "8px",        // Slightly rounded corners
          textAlign: "center",
          fontSize: "14px",            // Smaller text size for less prominence
          fontWeight: "normal",       // Make the font weight normal
          maxWidth: "400px",          // Reduced width for compactness
          margin: "0 auto",           // Center the success box horizontally
          marginBottom: "20px",       // Add space below the message
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)", // Soft shadow to make it stand out
        }}>
          <strong>{success}</strong>
        </div>
      )}

      {/* Form to submit feedback */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Station ID:</label>
          <select
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            required
          >
            <option value="">Select a Station</option>
            {stationIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Rating:</label>
          <div className="rating">
            <input
              type="radio"
              id="star5"
              name="rating"
              value="5"
              onChange={(e) => setRating(e.target.value)}
            />
            <label htmlFor="star5" title="5 stars">
              ★
            </label>
            <input
              type="radio"
              id="star4"
              name="rating"
              value="4"
              onChange={(e) => setRating(e.target.value)}
            />
            <label htmlFor="star4" title="4 stars">
              ★
            </label>
            <input
              type="radio"
              id="star3"
              name="rating"
              value="3"
              onChange={(e) => setRating(e.target.value)}
            />
            <label htmlFor="star3" title="3 stars">
              ★
            </label>
            <input
              type="radio"
              id="star2"
              name="rating"
              value="2"
              onChange={(e) => setRating(e.target.value)}
            />
            <label htmlFor="star2" title="2 stars">
              ★
            </label>
            <input
              type="radio"
              id="star1"
              name="rating"
              value="1"
              onChange={(e) => setRating(e.target.value)}
            />
            <label htmlFor="star1" title="1 star">
              ★
            </label>
          </div>
        </div>
        <button type="submit" disabled={loading}>Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
