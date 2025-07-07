// UpdatePassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function UpdatePassword() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleUpdate = async () => {
        if (password.trim() === '') {
            alert('Password cannot be empty!');
            return;
        }

        const response = await fetch('http://localhost:5000/update_password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (data.success) {
            alert('Password updated successfully!');
            navigate('/signin');
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Update Your Password</h2>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleUpdate}>Update Password</button>
            </div>
        </div>
    );
}

export default UpdatePassword;
