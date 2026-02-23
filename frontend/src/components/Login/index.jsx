import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.css";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    const url = "https://backend-resume-ats-analyzer.onrender.com/auth/login";
    const userDetails = {
      username,
      password
    }
  
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userDetails)
    }
    
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      console.log(data)
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setLoading(false)
        navigate("/");
      } else {
        setError(data.message || "Login failed");
        setLoading(false)
      }
    } catch (err) {
      setError(err.message || "Network error");
      setLoading(false)
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error-text">{error}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={username}
          onChange={handleUsername}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handlePassword}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
