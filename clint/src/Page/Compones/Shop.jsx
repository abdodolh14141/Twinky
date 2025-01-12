import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/shopping.css";

// ... (imports)

export const Shop = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("/api/shopping");
      setData(response.data);
    } catch (error) {
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <div className="container-shop">
        {data.map(({ id, imgSrc, text, price }) => (
          <Link key={id} to={`/product/${id}`}>
            <div className="product-card">
              <img src={imgSrc} alt={text} className="product-image" />
              <p className="product-text">{text}</p>
              <span>Price: {price}$</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
