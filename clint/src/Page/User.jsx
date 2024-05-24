import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/user.css";

export const User = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const resData = await axios.get("/api/user");

        if (resData.status === 200) {
          const { Name, Email } = resData.data.dataFind;
          setData({
            name: Name,
            email: Email,
          });
        } else {
          setError("Error getting user data");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        setError("Error fetching user data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="containerError">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="containerUser">
      <div>
        <h2>
          UserName = <em>{data.name}</em>
        </h2>
        <h2>
          Email = <em>{data.email}</em>
        </h2>
        <Link to="/api/userEdit">
          <button>Edit</button>
        </Link>
      </div>
    </div>
  );
};
