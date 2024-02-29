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
      const res = await axios.get("/logout");
      if (res.data.success) {
        setUser(false);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // check if the user is logged in
        const res = await axios.get("/navbar");
        if (res.status === 200) {
          setUser(true);
          setTotalPrice(res.data.PriceUser.Price);
        } else {
          setUser(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(false);
      }
    };

    fetchData();
  }, []); // Added an empty dependency array to run the effect only once

  return (
    <nav className="navbar">
      <ul className="ContainerIcon">
        <li>
          <Link to="/shopping" className="icon-link iconShop">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>
        </li>
        <li>
          <Link to="/api/buy/product">
            <FontAwesomeIcon icon={faShop} />
          </Link>
        </li>
        {totalPrice > 0 ? (
          <li>
            <span>{totalPrice} $</span>
          </li>
        ) : (
          <li>
            <span>0 $</span>
          </li>
        )}

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
            {/* If user is logged in, show the User link */}
            <li>
              <Link
                to="/user"
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
          // If user is not logged in, show the Sign In and Sign Up links
          <>
            <li>
              <Link to="/login">Sign In</Link>
            </li>
            <li>
              <Link to="/register">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
