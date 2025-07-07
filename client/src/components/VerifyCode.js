// VerifyCode.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function VerifyCode() {
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleVerify = async () => {
        const response = await fetch('http://localhost:5000/verify_code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (data.success) {
            alert('Code matched!');
            navigate('/updatepassword');
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Enter Verification Code</h2>
                <input
                    type="text"
                    placeholder="Enter code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <button onClick={handleVerify}>Verify Code</button>
            </div>
        </div>
    );
}

export default VerifyCode;