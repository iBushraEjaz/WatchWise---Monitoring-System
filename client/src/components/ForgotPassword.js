// ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSendCode = async () => {
        const response = await fetch('http://localhost:5000/send_verification_code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
            alert('Verification code sent to your email!');
            navigate('/verifycode');
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Forgot Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleSendCode}>Send Verification Code</button>
                <p onClick={() => navigate('/signin')}>Back to Login Page</p>
            </div>
        </div>
    );
}

export default ForgotPassword;
