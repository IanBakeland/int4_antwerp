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
        <h1>Welcome!</h1>
        <p className={styles.loginSubtitle}>Log in to your account</p>
        {error && <p style={{ color: "red" }} role="alert">{error}</p>}
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <h2 className={styles.cardTitle}>Sign in</h2>
        
        <div className={styles.inputGroup}>
          <label htmlFor="login-username-input" className={styles.inputLabel}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.66699 6H13.3337" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2.66699 10H13.3337" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6.66634 2L5.33301 14" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10.6663 2L9.33301 14" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Username
          </label>
          <input
            id="login-username-input"
            type="text"
            className={styles.inputField}
            placeholder="Emma"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="login-password-input" className={styles.inputLabel}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.6667 7.33301H3.33333C2.59695 7.33301 2 7.92996 2 8.66634V13.333C2 14.0694 2.59695 14.6663 3.33333 14.6663H12.6667C13.403 14.6663 14 14.0694 14 13.333V8.66634C14 7.92996 13.403 7.33301 12.6667 7.33301Z" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4.66699 7.33398V4.66732C4.66699 3.78326 5.01818 2.93542 5.6433 2.3103C6.26842 1.68517 7.11627 1.33398 8.00033 1.33398C8.88438 1.33398 9.73223 1.68517 10.3573 2.3103C10.9825 2.93542 11.3337 3.78326 11.3337 4.66732V7.33398" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Password
          </label>
          <input
            id="login-password-input"
            type="password"
            className={styles.inputField}
            placeholder="••••••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Link to="/login" className={styles.forgotLink}>Forgot password?</Link>
        </div>
        
        <div className={styles.formFooter}>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
          
          <div className={styles.divider}></div>
          
          <p className={styles.signUpText}>
            Don't have an account yet?
            <Link to="/signup" className={styles.signUpLink}>Sign up</Link>
          </p>
        </div>
      </form>
      </div>
    </div>
  );
}