import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import "../../styles/register.css";

export const Register = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Age: null,
    Password: "",
  });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resData = await axios.post("/api/register", formData);

      if (resData.data.success) {
        toast.success(resData.data.message);
        setFormData({ Name: "", Email: "", Age: "", Password: "" });
        nav("/api/login");
      } else {
        toast.error(resData.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Welcome To Register Page</h1>
      <div className="form-container">
        <form onSubmit={handleRegistration}>
          <input
            type="email"
            name="email"
            value={formData.Email}
            onChange={(e) =>
              setFormData({ ...formData, Email: e.target.value })
            }
            placeholder="Enter Email"
            required
          />
          <input
            type="text"
            name="name"
            value={formData.Name}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            placeholder="Enter Name"
            required
          />
          <input
            type="number"
            name="age"
            value={formData.Age}
            onChange={(e) => setFormData({ ...formData, Age: e.target.value })}
            min={18}
            max={55}
            placeholder="Enter Age"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.Password}
            onChange={(e) =>
              setFormData({ ...formData, Password: e.target.value })
            }
            placeholder="Enter Password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <div className="toolRegister">
            <p>
              Do You Have an Account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
