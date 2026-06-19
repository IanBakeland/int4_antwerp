import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setToken }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://necessary-light-a082e19892.strapiapp.com/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Login failed");
      }

      localStorage.setItem("token", data.jwt);
      setToken(data.jwt);
      navigate("/account");
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ paddingTop: "1rem" }} className={`noDesktop noTablet`}></div>
      <div className={`toolbar noDesktop noTablet`}>
        <div className="">
          <button onClick={() => navigate(-1)} className="backButton">Back</button>
          <h1><span>Welcome,</span> log in</h1>
        </div>
      </div>
      <div className="noMobile">
        <h1>Welcome, <span>log in</span> </h1>
      </div>
      {error && <p style={{ color: "red" }} role="alert">{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="login-username-input">Username or Email:</label>
          <input
            id="login-username-input"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autocomplete="username"
            required
          />
        </div>
        <div>
          <label htmlFor="login-password-input">Password:</label>
          <input
            id="login-password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autocomplete="current-password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}