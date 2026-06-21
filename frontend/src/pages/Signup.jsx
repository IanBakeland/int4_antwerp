import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import antwerpLogo from "../assets/images/antwerpLogo.png";
import PersonFilledIcon from "../assets/icons/PersonFilled";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Non-functional placeholder as requested by the user
  };

  const asterisk = <span style={{ color: "#FF7D3C", marginLeft: "4px" }}>*</span>;

  return (
    <div className={`${styles.loginContainer} ${styles.signupContainer}`}>
      <header className={styles.navbarMobileTop}>
        <Link to="/" className={styles.mobileLogoLink} aria-label="Go to Homepage">
          <img src={antwerpLogo} alt="Antwerpen Logo" className={styles.mobileLogoImg} />
        </Link>
        <div className={styles.navbarMobileTopRight}>
          <Link to="/account" className={`${styles.activeIconButton} iconbutton`} aria-label="Account">
            <PersonFilledIcon />
          </Link>
        </div>
      </header>

      <div className={styles.loginContent}>
       < div className={styles.welcomeTextContainer}>
        <div className={styles.welcomeText}>
        <h1>Welcome!</h1>
        <p className={styles.loginSubtitle}>Create a new account to get started</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <h2 className={styles.cardTitle}>Create an account</h2>

          {/* Username Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="signup-username-input" className={styles.inputLabel}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.66699 6H13.3337" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.66699 10H13.3337" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6.66634 2L5.33301 14" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.6663 2L9.33301 14" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Username {asterisk}
            </label>
            <input
              id="signup-username-input"
              type="text"
              className={styles.inputField}
              placeholder="Emma"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          {/* E-mail Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="signup-email-input" className={styles.inputLabel}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.66667 3.33301H13.3333C14.0667 3.33301 14.6667 3.93301 14.6667 4.66634V11.333C14.6667 12.0663 14.0667 12.6663 13.3333 12.6663H2.66667C1.93333 12.6663 1.33333 12.0663 1.33333 11.333V4.66634C1.33333 3.93301 1.93333 3.33301 2.66667 3.33301Z" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.6667 4.66699L8 9.33366L1.33333 4.66699" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              E-mail {asterisk}
            </label>
            <input
              id="signup-email-input"
              type="email"
              className={styles.inputField}
              placeholder="emma.devries@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="signup-password-input" className={styles.inputLabel}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6667 7.33301H3.33333C2.59695 7.33301 2 7.92996 2 8.66634V13.333C2 14.0694 2.59695 14.6663 3.33333 14.6663H12.6667C13.403 14.6663 14 14.0694 14 13.333V8.66634C14 7.92996 13.403 7.33301 12.6667 7.33301Z" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.66699 7.33398V4.66732C4.66699 3.78326 5.01818 2.93542 5.6433 2.3103C6.26842 1.68517 7.11627 1.33398 8.00033 1.33398C8.88438 1.33398 9.73223 1.68517 10.3573 2.3103C10.9825 2.93542 11.3337 3.78326 11.3337 4.66732V7.33398" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Password {asterisk}
            </label>
            <input
              id="signup-password-input"
              type="password"
              className={styles.inputField}
              placeholder="••••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="signup-confirm-password-input" className={styles.inputLabel}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6667 7.33301H3.33333C2.59695 7.33301 2 7.92996 2 8.66634V13.333C2 14.0694 2.59695 14.6663 3.33333 14.6663H12.6667C13.403 14.6663 14 14.0694 14 13.333V8.66634C14 7.92996 13.403 7.33301 12.6667 7.33301Z" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.66699 7.33398V4.66732C4.66699 3.78326 5.01818 2.93542 5.6433 2.3103C6.26842 1.68517 7.11627 1.33398 8.00033 1.33398C8.88438 1.33398 9.73223 1.68517 10.3573 2.3103C10.9825 2.93542 11.3337 3.78326 11.3337 4.66732V7.33398" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Confirm Password {asterisk}
            </label>
            <input
              id="signup-confirm-password-input"
              type="password"
              className={styles.inputField}
              placeholder="••••••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className={styles.formFooter}>
              <button type="submit" className={`${styles.submitButton} ${styles.submitButtonDesktop}`}>
              Create account
            </button>

              <div className={`${styles.divider} ${styles.dividerDesktop}`}></div>

            <p className={styles.signUpText}>
              Do you already have an account?
              <Link to="/login" className={styles.signUpLink}>Sign in</Link>
            </p>
          </div>
        </form>
        </div>
      </div>
       <div className={styles.imageMobileContainerSignup}></div>
      <div className={styles.imageDesktopContainerSignup}></div>
    </div>
  );
}
