import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Account({ setToken }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <div>Loading account data...</div>;
  }

  if (!user) {
    return <div>No user logged in.</div>;
  }

  return (
    <div>
      <div style={{ paddingTop: "1rem" }} className={`noDesktop noTablet`}></div>
      <div className={`toolbar noDesktop noTablet`}>
        <div className="">
          <button onClick={() => navigate(-1)} className="backButton">Back</button>
          <h1>Hey <span>{user.username}</span></h1>
        </div>
      </div>
      <div className="noMobile">
        <h1>My Account</h1>
      </div>
      <div>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}