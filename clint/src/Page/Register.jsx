import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import "../styles/register.css";

export const Register = () => {
  const [user, setUser] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();

    // Disable the submit button during registration
    setLoading(true);

    try {
      const resData = await axios.post("/register", user);

      if (resData.data.success) {
        toast.success(resData.data.message);
        setUser({ email: "", name: "", password: "" });
        nav("/login");
      } else {
        toast.error(resData.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      // Re-enable the submit button after registration attempt completes
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
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter Email"
            required
          />
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            placeholder="Enter Name"
            required
          />
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter Password"
            required
          />
          {/* Disable the submit button when loading is true */}
          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <div className="toolRegister">
            <Link to="/login">
              <p>Do You Have an Account?</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
