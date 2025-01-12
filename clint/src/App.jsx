import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { Register } from "./Page/Users/Register";
import { Login } from "./Page/Users/Login";
import { Home } from "./Page/Compones/Home";
import { Toaster } from "react-hot-toast";
import { Navbar } from "./Page/Compones/Navbar";
import { NavbarLast } from "./Page/Compones/NavbarLast";
import { Shop } from "./Page/Compones/Shop";
import { ProductDetails } from "./Page/Compones/ProductDetails";
import { User } from "./Page/Users/User";
import { Purchases } from "./Page/Compones/Purchases";
import { Specialty } from "./Page/Specialty/Specialty_1";
import { Specialty_1 } from "./Page/Specialty/Specialty_2";
import { Specialty_2 } from "./Page/Specialty/Specialty_3";
import { Specialty_3 } from "./Page/Specialty/Specialty_4";
import { About } from "./Page/Compones/About";

// Set axios defaults outside the component
try {
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true;
} catch (error) {
  console.error("Error setting axios defaults:", error);
}

function App() {
  return (
    <div className="App">
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/api/login" element={<Login />} />
        <Route path="/api/register" element={<Register />} />
        <Route path="/api/shopping" element={<Shop />} />
        <Route path="/api/user" element={<User />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/api/1" element={<Specialty />} />
        <Route path="/api/2" element={<Specialty_1 />} />
        <Route path="/api/3" element={<Specialty_2 />} />
        <Route path="/api/4" element={<Specialty_3 />} />
        <Route path="/api/about" element={<About />} />
        <Route path="/api/buy/product" element={<Purchases />} />
      </Routes>
      <NavbarLast />
    </div>
  );
}

export default App;
