import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./Login.css";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    if (email && password) {
      try {
        const response = await axios.post('http://localhost:5000/api/login', { email, password });
        console.log('Login Response:', response.data);
  
        if (response.data.success) {
          // Store JWT token in localStorage
          localStorage.setItem('token', response.data.token);
          
          // Success, navigate to Home
          navigate('/home'); // Or whichever protected route you want
        } else {
          setErrorMessage(response.data.message || "Incorrect email or password");
        }
      } catch (error) {
        console.error("Error during login:", error);
        setErrorMessage("Login failed. Please try again.");
      }
    } else {
      setErrorMessage('Please enter both email and password');
    }
  };
  

  return (
    <>
      <div>
        <h1 className="video-heading">Hey! Admin</h1>
      </div>

      <div className="signin-container">
        <div className="signin-form">
          <h2>Enter your Credentials</h2>
          <form onSubmit={handleSignIn}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="forgot-password">
              <Link to="/forgotpassword" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>

            {errorMessage && <p className="error-message">{"Incorrect Password or Email"}</p>}

<button 
  className="signin-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
  type="submit"
>
  Sign In
</button>

           

          </form>
        </div>
      </div>
    </>
  );
};

export default Login;