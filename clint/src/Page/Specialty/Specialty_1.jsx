import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const Specialty = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/1");
        setData(response.data);
      } catch (error) {
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="container-shop">
        {data.map(({ id, imgSrc, text, price }) => (
          <Link key={id} to={`/product/${id}`}>
            <div className="product-card">
              <img src={imgSrc} alt={text} className="product-image" />
              <h2 className="product-text">{text}</h2>
              <span>Price: {price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
