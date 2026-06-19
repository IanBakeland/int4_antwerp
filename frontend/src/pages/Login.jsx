import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import antwerpLogo from "../assets/images/antwerpLogo.png";
import PersonFilledIcon from "../assets/icons/PersonFilled";

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
    <div className={styles.loginContainer}>
      <header className={styles.navbarMobileTop}>
        <Link to="/" className={styles.mobileLogoLink} aria-label="Go to Homepage">
          <img src={antwerpLogo} alt="Antwerpen Logo" className={styles.mobileLogoImg} />
        </Link>
        <div className={styles.navbarMobileTopRight}>
          <Link to="/account" className={`${styles.activeIconButton} iconbutton`} aria-label="Account"><PersonFilledIcon /></Link>
        </div>
      </header>

      <div className={styles.loginContent}>
        <h1>Welcome, <span>log in</span></h1>
        {error && <p style={{ color: "red" }} role="alert">{error}</p>}
      <form onSubmit={handleLogin} className={styles.loginForm}>
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
    </div>
  );
}