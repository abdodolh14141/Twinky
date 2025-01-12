import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user.css";
import toast from "react-hot-toast";

export const User = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resData = await axios.get("/api/user");

        if (resData.status === 200) {
          const { Name, Email } = resData.data.dataFind;
          setFormData({
            name: Name || "", // Initialize with empty strings if null
            email: Email || "",
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
    };

    fetchUser();
  }, []);

  async function funcLogout() {
    try {
      const res = await axios.get("/api/logout");
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const resDataUpdate = await axios.put("/api/userEdit", formData);

      if (resDataUpdate.status === 200) {
        toast.success("Successfully updated user data");
        await funcLogout();
        nav("/"); // Redirect to a profile or confirmation page
      } else {
        toast.error(resDataUpdate.data.message);
      }
    } catch (error) {
      console.error("Error updating user data", error);
      setError("Error updating user data. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="containerError">
        <h1>{error}</h1>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="containerUser">
      <div>
        <form onSubmit={handleFormSubmit}>
          <h2>
            UserName:{" "}
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleInputChange}
              value={formData.name}
            />
          </h2>
          <h2>
            Email:{" "}
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </h2>
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};
