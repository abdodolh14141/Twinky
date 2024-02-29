import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import "../styles/navbarLast.css";

export const NavbarLast = () => {
  return (
    <>
      <div className="LastContainer">
        <div className="LinksSocial">
          <a href="https://www.instagram.com/just_dolh/" target="_blank">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="https://mail.google.com/mail/u/0/?pli=1#inbox"
            target="_blank"
          >
            <FontAwesomeIcon icon={faGoogle} />
          </a>
        </div>
        <div className="par">
          <h1>Phone: 15248</h1>
          <p>
            This Website Is Orignial <Link to={"/about"}>About Us</Link>
          </p>
        </div>
      </div>
    </>
  );
};
