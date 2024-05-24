import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../styles/product_detail.css";

export const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const [productResponse, shoppingResponse] = await Promise.all([
          axios.get(`/product/${productId}`),
          axios.get("/api/shopping"),
        ]);

        if (productResponse.status === 200 && shoppingResponse.status === 200) {
          const { id, text, imgSrc, par, price } = productResponse.data;
          setProduct({ id, text, imgSrc, par: par || "", price });
          setRelatedProducts(shoppingResponse.data.slice(0, 4));
        } else {
          throw new Error("Error fetching product or shopping data");
        }
      } catch (error) {
        console.error("Error fetching product or shopping data:", error);
        toast.error("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleBuy = async (e) => {
    e.preventDefault();
    try {
      const { id, text, imgSrc, par, price } = product;
      const saveProductResponse = await axios.post("/api/buy/product", {
        id,
        text,
        par,
        imgSrc,
        price,
      });

      if (saveProductResponse.data.success) {
        const buyResponse = await axios.put("/api/buy", product);
        if (buyResponse.data.success) {
          toast.success(buyResponse.data.message);
        } else {
          toast.error("Error saving product details after purchase");
        }
      } else {
        toast.error(saveProductResponse.data.message || "Error purchasing");
      }
    } catch (error) {
      console.error("Error purchasing:", error);
      toast.error("Error purchasing, please try Login In");
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!product || !product.id) {
    return <h1>Product not found</h1>;
  }

  return (
    <>
      <div className="product-details">
        <div className="images">
          <img
            src={product.imgSrc}
            alt={product.text}
            className="product-image"
          />
        </div>
        <form onSubmit={handleBuy}>
          <div className="textProduct">
            <h1>{product.text}</h1>
            <p>{product.par}</p>
            <h2>Price: ${product.price}</h2>
            <button type="submit">Buy</button>
          </div>
        </form>
      </div>
      <div className="container-shop">
        {relatedProducts.map(({ id, imgSrc, text }) => (
          <Link key={id} to={`/product/${id}`}>
            <div className="product-card relatedProduct">
              <img src={imgSrc} alt={text} className="product-image" />
              <h2 className="product-text">{text}</h2>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};
