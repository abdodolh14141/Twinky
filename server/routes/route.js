import express from "express";
import cors from "cors";
import {
  authLogin,
  authNavbar,
  authProductId,
  authRegister,
  authUser,
  authBuy,
  authEditUser,
  authPageOne,
  authPageTwo,
  authPageThree,
  authBuyProduct,
  authPageFour,
  authPurchase,
  authPurchaseDelete,
  authPurchaseAdd,
  authAbout,
  authPurchasePost,
  authAboutPost,
  products,
} from "../auths/auth.js";
import { authenticateJWT } from "../jwtAuto/autoMation.js";

const route = express.Router();

// Middleware for CORS
route.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// Middleware for error handling
route.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Home route
route.get("/", (req, res) => {
  res.json({ success: true, message: "Home Page" });
});

// Abou Page Route
route.get("/api/about", authAbout);

route.post("/api/about/Report", authenticateJWT, authAboutPost);

// Authentication Routes
route.post("/api/register", authRegister);
route.post("/api/login", authLogin);
route.get("/navbar", authenticateJWT, authNavbar);
route.get("/api/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ success: true, message: "Success Logout" });
});

// User Routes
route.get("/api/user", authenticateJWT, authUser);
route.put("/api/userEdit", authenticateJWT, authEditUser);
route.post("/api/buy", authenticateJWT, authBuy);

// Shopping Routes
route.get("/api/shopping", (req, res) => {
  const shuffledProducts = shuffleArray(products);
  return res.json(shuffledProducts);
});

// Specialty Product Routes Api
route.get("/api/1", authPageOne);
route.get("/api/2", authPageTwo);
route.get("/api/3", authPageThree);
route.get("/api/4", authPageFour);

// Save Product Buying In Database
route.post("/api/buy/product", authenticateJWT, authBuyProduct);

// Display All Product User Buying
route.get("/api/buy/purchases", authenticateJWT, authPurchase);

// Delete Product From DataBase
route.delete(
  "/api/buy/purchases/:idProduct",
  authenticateJWT,
  authPurchaseDelete
);

// Add Product From DataBase
route.put("/api/buy/purchases/:id", authenticateJWT, authPurchaseAdd);

// Add More Product
route.post("/api/buy/purchases/:idProduct", authenticateJWT, authPurchasePost);

// Product Route
route.get("/product/:productId", authProductId);

// Function to shuffle an array
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export default route;
