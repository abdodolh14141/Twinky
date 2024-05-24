import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUser,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/navbar.css";
import axios from "axios";
import toast from "react-hot-toast";

export const Navbar = () => {
  const [user, setUser] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  async function funcLogout() {
    try {
      const res = await axios.get("/api/logout");
      if (res.data.success) {
        setUser(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/navbar");
        if (res.status === 200) {
          setUser(true);
          setTotalPrice(res.data.PriceUser.Price);
        } else {
          setUser(false);
        }
      } catch (error) {
        setUser(false);
      }
    };
    fetchData();
  }, []);

  return (
    <nav className="navbar">
      <ul className="ContainerIcon">
        <li>
          <Link to="/api/shopping" title="تسوق" className="icon-link iconShop">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>
        </li>
        <li>
          <Link to="/api/buy/product" title="مشتريات">
            <FontAwesomeIcon icon={faShop} />
          </Link>
        </li>
        <li>
          <span>{totalPrice.toFixed(2)} $</span>
        </li>
        <li>
          <Link to={"/api/1"}>شرقي</Link>
        </li>
        <li>
          <Link to={"/api/2"}>مخبوزات</Link>
        </li>
        <li>
          <Link to={"/api/3"}>تورت</Link>
        </li>
        <li>
          <Link to={"/api/4"}>مشروبات</Link>
        </li>
      </ul>
      <Link to="/" className="logo">
        Twinky
      </Link>
      <ul className="nav-links">
        {user ? (
          <>
            <li>
              <Link
                to="/api/user"
                className="icon-link iconUser"
                style={{ display: user ? "block" : "none" }}
              >
                <FontAwesomeIcon icon={faUser} />
              </Link>
            </li>
            <li>
              <button className="btnLogout" onClick={funcLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/api/login" title="تسجيل الدخول">
                Login In
              </Link>
            </li>
            <li>
              <Link to="/api/register" title="تسجيل">
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
