import { useState, useEffect } from "react";
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function AccountPage({ onLogout }) {
  useDocumentTitle('Account');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      if (onLogout) onLogout();
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
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setLoading(false);
        if (onLogout) onLogout();
      });
  }, [token, onLogout]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
  };

  if (loading) {
    return <div>Loading account data...</div>;
  }

  if (!user) {
    return <div>No user logged in.</div>;
  }

  return (
    <div>
      <h2>My Account</h2>
      <div>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}