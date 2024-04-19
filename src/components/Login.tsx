import React, { useState, FormEvent } from "react";
import "../styles/Login.css"; // Import the CSS file for styling

interface LoginProps {
  onLogin: (username: string) => void;
}

const allowedUsernames = ["mai", "azaken"];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();

    // Convert the username to lowercase for case-insensitive comparison
    const normalizedUsername = username.trim().toLowerCase();

    // Check if the entered username is one of the allowed usernames
    if (allowedUsernames.includes(normalizedUsername)) {
      onLogin(normalizedUsername);
      setError("");
    } else {
      setError("Invalid username. Please enter a valid username.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
