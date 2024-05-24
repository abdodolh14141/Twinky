import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbarLast.css";

export const NavbarLast = () => {
  return (
    <>
      <div className="LastContainer">
        <div className="LinksSocial">
          <ul class="wrapper">
            <li class="icon facebook">
              <span>
                <Link
                  to={"https://www.facebook.com/profile.php?id=100090162679609"}
                >
                  <i class="fab fa-facebook-f"></i>
                </Link>
              </span>
            </li>
            <li class="icon youtube">
              <span>
                <i class="fab fa-youtube"></i>
              </span>
            </li>
            <li class="icon tiktok">
              <span>
                <i class="fab fa-tiktok"></i>
              </span>
            </li>
            <li class="icon instagram">
              <span>
                <Link to={"https://www.instagram.com/just_dolh/"}>
                  <i class="fab fa-instagram"></i>
                </Link>
              </span>
            </li>
          </ul>
        </div>
        <div className="par">
          <h1>Phone: 15248</h1>
          <p>
            This Website Is Orignial <Link to={"/api/about"}>About Us</Link>
          </p>
        </div>
      </div>
    </>
  );
};
