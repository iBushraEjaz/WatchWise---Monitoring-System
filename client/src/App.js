// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ActivityReport from './components/ActivityReport';
import RealTimeVideo from './components/RealTimeVideo';
import GraphicalRepresentation from './components/GraphicalRepresentation';
import OccupancyData from './components/OccupancyData';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import SignInPage from './components/Login.jsx';
import LandingPage from './components/lnding_pge';
import ForgotPassword from './components/ForgotPassword';
import VerifyCode from './components/VerifyCode';
import UpdatePassword from './components/UpdatePassword';
import WorkingReport from './components/working_report.js';
import 'bootstrap/dist/css/bootstrap.min.css';

// 🔐 Auth wrapper to protect private routes
// 🔐 Auth wrapper to protect private routes
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verifycode" element={<VerifyCode />} />
        <Route path="/updatepassword" element={<UpdatePassword />} />

        {/* Protected routes with sidebar layout */}
        <Route path="/" element={<Layout />}>
          <Route
            path="graphical-representation"
            element={
              <RequireAuth>
                <GraphicalRepresentation />
              </RequireAuth>
            }
          />
          <Route
            path="activity-report"
            element={
              <RequireAuth>
                <ActivityReport />
              </RequireAuth>
            }
          />
          {/* Continue this for other protected routes */}
          <Route
            path="real-time-video"
            element={
              <RequireAuth>
                <RealTimeVideo />
              </RequireAuth>
            }
          />
          <Route
            path="occupancy-data"
            element={
              <RequireAuth>
                <OccupancyData />
              </RequireAuth>
            }
          />
          <Route
            path="feedback-form"
            element={
              <RequireAuth>
                <FeedbackForm />
              </RequireAuth>
            }
          />
          <Route
            path="feedback-list"
            element={
              <RequireAuth>
                <FeedbackList />
              </RequireAuth>
            }
          />
          <Route
            path="Working"
            element={
              <RequireAuth>
                <WorkingReport />
              </RequireAuth>
            }
          />
          
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/graphical-representation" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

