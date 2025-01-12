import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/editUser.css";
import toast from "react-hot-toast";

export const EditUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const nav = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const resData = await axios.get("/api/user");

        if (resData.status === 200) {
          const { Name, Email } = resData.data.dataFind;
          setFormData({
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const resDataUpdate = await axios.put("/api/userEdit", {
        name: formData.name,
        email: formData.email,
      });

      if (resDataUpdate.status === 200) {
        console.log("Success Update");
        await axios.get("logout");
        nav("/api/login");
      } else {
        toast.error(resDataUpdate.data.message);
      }
      // After successful update, navigate back to the user page
    } catch (error) {
      console.error("Error updating user data", error);
      setError("Error updating user data. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="errorMsg">
        <h1>{error}</h1>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="containerUpdate">
      <div className="formData">
        <form onSubmit={handleFormSubmit}>
          <label>
            UserName:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </label>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};
