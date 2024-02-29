import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../styles/purchases.css";

export const Purchases = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/buy/purchases");
        setData(response.data.purchases);
        toast.success(response.data.message);
      } catch (error) {
        setError(true);
        toast.error("Error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deletePurchases = async (id) => {
    try {
      const resDelete = await axios.delete(`/api/buy/purchases/${id}`);
      if (resDelete.data.success) {
        toast.success(resDelete.data.message);
        setData(data.filter((product) => product.Id !== id)); // Remove deleted product from UI
      } else {
        toast.error(resDelete.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error occurred while deleting the product.");
    }
  };

  const addPurchases = async (id) => {
    try {
      const resAdd = await axios.put(`/api/buy/purchases/${id}`);
      if (resAdd.data.success) {
        toast.success(resAdd.data.message);
        const updatedData = data.map((product) =>
          product.Id === id ? { ...product, Count: product.Count + 1 } : product
        );
        setData(updatedData);
      } else {
        toast.error(resAdd.data.message || "Error adding purchase");
      }
    } catch (error) {
      console.log("Error Server: " + error);
      toast.error("Error adding purchase");
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error. Please try again later.</h1>;
  }

  return (
    <div className="container-shop">
      <div className="card">
        {data.map(({ Id, ImgSrc, Text, Price, Count }) => (
          <div key={Id} className="product-card purchases">
            <img src={ImgSrc} alt={Text} className="product-image" />
            <p>Count: {Count}</p>
            <span className="spanProduct">Price: {Price}</span>
            <button>
              <Link to={`/product/${Id}`}>Show</Link>
            </button>

            <button onClick={() => deletePurchases(Id)}>Delete</button>
            <button onClick={() => addPurchases(Id)}>Add</button>
          </div>
        ))}
      </div>
    </div>
  );
};
