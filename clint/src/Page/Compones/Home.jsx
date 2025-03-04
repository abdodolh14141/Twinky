import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../styles/home.css";
import twinky_1 from "../../img/twinky_1.jpg";
import twinky_2 from "../../img/twinky_2.jpg";
import twinky_4 from "../../img/twinky_4.jpg";
import twinky_5 from "../../img/twinky_5.jpg";
import twinky_6 from "../../img/twinky_6.jpg";
import twinky_7 from "../../img/twinky_7.jpg";
import twinky_8 from "../../img/twinky_8.jpg";
import twinky_9 from "../../img/twinky_9.jpg";
import twinky_middle from "../../img/twinky_middle.jpg";

export const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const nav = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide % 7) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const showSlide = (slideNumber) => {
    setCurrentSlide(slideNumber);
  };

  const imagesDisplay = [
    twinky_1,
    twinky_2,
    twinky_4,
    twinky_5,
    twinky_6,
    twinky_7,
    twinky_8,
  ];

  return (
    <>
      <div className="bodyHome">
        <div className="img_Switch_Home">
          {imagesDisplay.map((image, index) => (
            <div
              key={index}
              className={`mySlides fade ${
                index + 1 === currentSlide ? "active" : ""
              }`}
            >
              <div className="numbertext">{`${index + 1} / 7`}</div>
              <img
                src={image}
                style={{ width: "100%" }}
                alt={`Caption ${index + 1}`}
                className="imgAuto"
              />
              <div className="text">{`Caption ${index + 1}`}</div>
            </div>
          ))}
          <div style={{ textAlign: "center" }}>
            {[1, 2, 3, 4, 5, 6, 7].map((dotNumber) => (
              <span
                key={dotNumber}
                className={`dot ${dotNumber === currentSlide ? "active" : ""}`}
                onClick={() => showSlide(dotNumber)}
              ></span>
            ))}
          </div>
        </div>
      </div>
      <hr />
      <div className="middleHome">
        <div className="textMiddleHome">
          <h1>بدأ يومك صح مع قهوة مظبوطة من توينكي تصحصحك وتروق مزاجك ☕️☀️</h1>
          <button onClick={() => nav("/api/4")}>تسوق الان</button>
        </div>
        <img src={twinky_middle} alt="صور عرض مشروبات ساخنة" />
      </div>{" "}
      <hr />
      <div className="lastHome">
        <div className="textLastHome">
          <h1>
            فطيرة مشلتته مع شويه عسل وطحينة ! هي دي الوجبة المثالية للرايقين{" "}
          </h1>
          <button>
            <Link to={"/api/3"}>تسوق الان</Link>
          </button>
        </div>
        <img src={twinky_9} alt="فطيرة مشلتت" />
      </div>
    </>
  );
};
