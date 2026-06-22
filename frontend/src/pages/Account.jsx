import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from '../components/Loading';
import styles from "./Account.module.css";
import antwerpLogo from "../assets/images/antwerpLogo.png";
import PersonFilledIcon from "../assets/icons/PersonFilled";

const HashtagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.66699 6H13.3337" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M2.66699 10H13.3337" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M6.66634 2L5.33301 14" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M10.6663 2L9.33301 14" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.66667 3.33301H13.3333C14.0667 3.33301 14.6667 3.93301 14.6667 4.66634V11.333C14.6667 12.0663 14.0667 12.6663 13.3333 12.6663H2.66667C1.93333 12.6663 1.33333 12.0663 1.33333 11.333V4.66634C1.33333 3.93301 1.93333 3.33301 2.66667 3.33301Z" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M14.6667 4.66699L8 9.33366L1.33333 4.66699" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.6667 7.33301H3.33333C2.59695 7.33301 2 7.92996 2 8.66634V13.333C2 14.0694 2.59695 14.6663 3.33333 14.6663H12.6667C13.403 14.6663 14 14.0694 14 13.333V8.66634C14 7.92996 13.403 7.33301 12.6667 7.33301Z" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4.66699 7.33398V4.66732C4.66699 3.78326 5.01818 2.93542 5.6433 2.3103C6.26842 1.68517 7.11627 1.33398 8.00033 1.33398C8.88438 1.33398 9.73223 1.68517 10.3573 2.3103C10.9825 2.93542 11.3337 3.78326 11.3337 4.66732V7.33398" stroke="#0A0A0A" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);

export default function Account({ setToken }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("https://necessary-light-a082e19892.strapiapp.com/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Invalid session");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setUsernameInput(data.username || "");
        setEmailInput(data.email || "");
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setLoading(false);
        navigate("/login");
      });
  }, [token, setToken, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const handleCancel = () => {
    if (user) {
      setUsernameInput(user.username || "");
      setEmailInput(user.email || "");
      setPasswordInput("");
      setError("");
      setSuccess("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        username: usernameInput,
        email: emailInput,
      };
      if (passwordInput) {
        updateData.password = passwordInput;
      }

      const res = await fetch(`https://necessary-light-a082e19892.strapiapp.com/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "Failed to update account settings.");
      }

      const data = await res.json();
      setUser(data);
      setSuccess("Account settings updated successfully!");
      setPasswordInput("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action is permanent.")) {
      alert("Account deletion placeholder.");
      handleLogout();
    }
  };

  if (loading) {
    return <Loading message="Loading account settings..." />;
  }

  return (
    <>
      <div className="toolbar noDesktop noTablet">
        <div className="alignNext">
          <img src={antwerpLogo} alt="Antwerpen Logo" className={styles['auth__mobile-logo-image']} />
          <Link to="/account" className={`${styles['auth__active-icon-button']} iconbutton`} aria-label="Account"><PersonFilledIcon /></Link>
        </div>
      </div>

      <div className={styles.auth}>
        <div className={styles.auth__content}>
          <div className={styles['auth__welcome-container']}>
            <div className={styles['auth__welcome-text']}>
              <h1>Hey <span>{user?.username}</span>,</h1>
              <p className={styles.auth__subtitle}>Manage your personal information</p>
            </div>

            {error && <p className={styles['auth__status-message--error']} role="alert">{error}</p>}
            {success && <p className={styles['auth__status-message--success']} role="status">{success}</p>}

            <div className={styles['auth__account-layout']}>
              <div className={styles['auth__account-left']}>
                <form onSubmit={handleSave} className={styles.auth__form}>
                  <h2 className={styles['auth__card-title']}>Account settings</h2>

                  <div className={styles['auth__input-group']}>
                    <label htmlFor="account-username-input" className={styles['auth__input-label']}>
                      <HashtagIcon />
                      Username <span className={styles['auth__required-asterisk']}>*</span>
                    </label>
                    <input
                      id="account-username-input"
                      type="text"
                      className={styles['auth__input-field']}
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles['auth__input-group']}>
                    <label htmlFor="account-email-input" className={styles['auth__input-label']}>
                      <MailIcon />
                      E-mail <span className={styles['auth__required-asterisk']}>*</span>
                    </label>
                    <input
                      id="account-email-input"
                      type="email"
                      className={styles['auth__input-field']}
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles['auth__input-group']}>
                    <label htmlFor="account-password-input" className={styles['auth__input-label']}>
                      <LockIcon />
                      Change Password
                    </label>
                    <input
                      id="account-password-input"
                      type="password"
                      className={styles['auth__input-field']}
                      placeholder="••••••••••••••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                  </div>

                  <div className={styles['auth__form-actions']}>
                    <button type="submit" disabled={saving} className={styles['auth__save-button']}>
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button type="button" onClick={handleCancel} className={styles['auth__cancel-button']}>
                      Cancel
                    </button>
                  </div>
                </form>

                <div className={styles['auth__delete-card']}>
                  <h3 className={styles['auth__delete-title']}>Delete account</h3>
                  <p className={styles['auth__delete-subtitle']}>This action cannot be undone.</p>
                  <button type="button" onClick={handleDeleteAccount} className={styles['auth__delete-link']}>
                    Delete my account
                  </button>
                </div>
              </div>

              <div className={styles['auth__account-right']}>
                <div className={styles['auth__actions-card']}>
                  <Link to="/favourites" className={styles['auth__action-button']}>
                    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.00033 13.877C8.00033 13.877 1.4834 10.2051 1.4834 5.72168C1.4834 4.09375 2.68555 2.84375 4.21094 2.84375C5.12793 2.84375 5.92285 3.28418 6.44434 3.96875L8.00033 6.00977L9.55633 3.96875C10.0778 3.28418 10.8727 2.84375 11.7897 2.84375C13.3151 2.84375 14.5173 4.09375 14.5173 5.72168C14.5173 10.2051 8.00033 13.877 8.00033 13.877Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>My favourites</span>
                  </Link>
                  <button type="button" onClick={handleLogout} className={styles['auth__action-button--logout']}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 14H3C2.46957 14 1.96086 13.7893 1.58579 13.4142C1.21071 13.0391 1 12.5304 1 12V4C1 3.46957 1.21071 2.96086 1.58579 2.58579C1.96086 2.21071 2.46957 2 3 2H6" stroke="#FF3B30" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M11 11L15 8L11 5" stroke="#FF3B30" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M15 8H6" stroke="#FF3B30" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['auth__background--account']}></div>
    </>
  );
}