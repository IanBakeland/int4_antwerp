import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from '../components/Loading';
import css module here

export default function Account({ setToken }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
  };

  return (
    <div>
      <div style={{ paddingTop: "1rem" }} className="noDesktop noTablet"></div>

      <div className="toolbar noDesktop noTablet">
        <div>
          <button onClick={() => navigate(-1)} className="backButton">
            Back
          </button>
        </div>
      </div>
      {loading ? (
        <Loading message="Loading you story" />
      ) : (
        <>
        </>
      )}
    </div>
  );
}