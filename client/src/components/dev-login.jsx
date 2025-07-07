import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./dev-login.css";
import { useNavigate } from 'react-router-dom';

const DevSignIn = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    if (email && password) {
        var aemail = "sidrasherazi@gmail.com"
        var apassword = "working2323"
        if (email ===  aemail    && password === apassword){
            navigate('/admin-panel');
        }
        else{
          alert("Incorrect email or Password")

        }


       } else {
      alert('Please enter valid credentials');
    }
  };

  return (
    <>
    <div className="Adm">
    <button className="Admin"  onClick={() => navigate('/Login')}>Admin</button> 
    </div>
    <div>
      <h1 className="video-heading">Hey! Developer</h1>
      </div>
    <div className="signin-container">
    
          <div className="signin-form">
        <h2>Enter your Credentials</h2>
        <form onSubmit={handleSignIn}> {/* Use a form to handle submission */}
          <input
            type="email"
            placeholder="Email"
            required
            value={email} // Bind the value to the state
            onChange={(e) => setEmail(e.target.value)} // Update email state
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password} // Bind the value to the state
            onChange={(e) => setPassword(e.target.value)} // Update password state
          />
          <button className="signin-button" type="submit">Sign In</button> {/* Use type="submit" */}

          <div className="google-signin">
            <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
                  // You can navigate here as well if you want to redirect on successful Google sign-in
                  navigate('/admin-panel');
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </GoogleOAuthProvider>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default DevSignIn;
