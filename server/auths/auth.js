import User from "../models/User.js";
import ProductBuy from "../models/ProductBuy.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import data_1 from "../products/product_1.json" assert { type: "json" };
import data_2 from "../products/product_2.json" assert { type: "json" };
import data_3 from "../products/product_3.json" assert { type: "json" };
import data_4 from "../products/product_4.json" assert { type: "json" };

export const specialty_product_1 = data_1;

export const specialty_product_2 = data_2;

export const specialty_product_3 = data_3;

export const specialty_product_4 = data_4;

export const products = [
  ...specialty_product_1,
  ...specialty_product_2,
  ...specialty_product_3,
  ...specialty_product_4,
];

export const authRegister = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate user input
  if (!email || !name || !password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration data. Please provide valid information.",
    });
  }

  try {
    // Check if the email is already registered
    const existingUserByEmail = await User.findOne({ Email: email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered. Please try logging in.",
      });
    }

    // Check if the name is already registered
    const existingUserByName = await User.findOne({ Name: name });
    if (existingUserByName) {
      return res.status(400).json({
        success: false,
        message:
          "This username is already taken. Please choose a different one.",
      });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      Name: name,
      Email: email,
      Password: hashedPassword, // Save the hashed password
      Price: 5000, // Assuming Price is a default value or initial balance
    });

    // Save the user to the database
    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      success: false,
      message: "Error Server Please Try Agian",
    });
  }
};

export const authLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email && password) {
      const checkEmail = await User.findOne({ Email: email });

      if (checkEmail) {
        const passwordMatch = bcrypt.compare(password, checkEmail.Password); // Await here

        if (passwordMatch) {
          const jwtToken = jwt.sign(
            {
              id: checkEmail._id,
              email: checkEmail.Email,
              name: checkEmail.Name,
              price: checkEmail.Price,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "3h",
            }
          );

          // Set cookie after successful login
          res.cookie("token", jwtToken).status(200).json({
            success: true,
            message: "Login Success",
          });
        } else {
          return res.status(401).json({
            success: false,
            message: "Incorrect Password",
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "User not found. Please try again or register.",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials. Please provide both email and password.",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

export const authPageOne = (req, res) => {
  return res.json(specialty_product_1);
};

export const authPageTwo = (req, res) => {
  return res.json(specialty_product_2);
};

export const authPageThree = (req, res) => {
  return res.json(specialty_product_3);
};

export const authPageFour = (req, res) => {
  return res.json(specialty_product_4);
};

// Show All Product User Is Buying
export const authPurchase = async (req, res) => {
  try {
    const { id } = req.dataAuto;
    const allData = await ProductBuy.find({ IdUser: id });

    if (allData.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Success loading purchases",
        purchases: allData,
      });
    } else {
      return res
        .status(404)
        .json({ success: true, message: "No purchases found" });
    }
  } catch (error) {
    console.error("Purchase error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const authPurchaseAdd = async (req, res) => {
  try {
    const { id: idUser } = req.dataAuto;
    const { id: idProduct } = req.params;

    // Increment purchase count
    const resPurchase = await ProductBuy.findOneAndUpdate(
      { Id: idProduct },
      { $inc: { Count: 1 } },
      { new: true }
    );

    if (!resPurchase) {
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    // Update user's balance
    const product = await ProductBuy.findOne({ Id: idProduct });
    const user = await User.findOne({ _id: idUser });

    if (!product || !user) {
      return res
        .status(404)
        .json({ success: false, message: "Product or user not found" });
    }

    user.balance += product.Price;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Purchase count incremented successfully",
      purchase,
    });
  } catch (error) {
    console.error("Error in authPurchaseAdd:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const authPurchaseDelete = async (req, res) => {
  const { id } = req.dataAuto;
  const idDelete = req.params.idProduct;
  try {
    // Find the product by id
    const ProductDetail = products.find((e) => e.id == idDelete);
    if (!ProductDetail) {
      // Return 404 if product not found
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete the product
    const resDel = await ProductBuy.deleteOne({ Id: idDelete, IdUser: id });
    if (resDel.deletedCount > 0) {
      // Find the user
      const resUploadPrice = await User.findOne({ _id: id });
      if (!resUploadPrice) {
        // Return 400 if user not found
        return res
          .status(400)
          .json({ success: false, message: "User Not Found" });
      }

      // Update user's price
      resUploadPrice.Price += ProductDetail.price;
      await resUploadPrice.save();

      // Return success message
      return res
        .status(200)
        .json({ success: true, message: "Success Delete Product" });
    } else {
      // Return 404 if product could not be deleted
      return res.status(404).json({
        success: false,
        message: "Can't Delete Product. Please Try Again",
      });
    }
  } catch (error) {
    console.log(error);
    // Return 500 for internal server error
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const authPurchasePost = async (req, res) => {
  return res
    .status(200)
    .json({ success: false, message: "Invalid request data" });
};

export const authBuy = async (req, res) => {
  try {
    const { name } = req.dataAuto;
    const { price } = req.body;

    // Validate the request body
    if (!price || !name) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request data" });
    }

    // Find the user by name
    const user = await User.findOne({ Name: name });

    // If user not found, return error
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if user has sufficient balance
    if (user.Price < price) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    // Subtract price from user's balance and save
    user.Price -= price;
    await user.save();

    // Return the updated user
    return res
      .status(200)
      .json({ success: true, message: "Price updated successfully", user });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const authBuyProduct = async (req, res) => {
  try {
    const { id, text, imgSrc, par, price, Count } = req.body;
    const { name } = req.dataAuto;

    const user = await User.findOne({ Name: name });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const existingProduct = await ProductBuy.findOne({
      Id: id,
    });
    if (existingProduct) {
      existingProduct.Count += 1;
      await existingProduct.save();
      return res.status(200).json({
        success: true,
        message: "This product More",
      });
    }

    const newProduct = new ProductBuy({
      Id: id,
      Text: text,
      ImgSrc: imgSrc,
      Par: par,
      Price: price,
      IdUser: user._id,
    });

    await newProduct.save();

    return res
      .status(200)
      .json({ success: true, message: "Product bought successfully" });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      console.error("Duplicate key error:", error);
      return res
        .status(400)
        .json({ success: false, message: "Duplicate key error" });
    }

    console.error("Buy product error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const authProductId = (req, res) => {
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "ProductId Is Emty" });
  }

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Can't Found Product" });
  }

  return res.json(product);
};

export const authUser = async (req, res) => {
  const { name: UserName } = req.dataAuto;
  const findUser = await User.findOne({ Name: UserName });
  return res.json({ success: true, message: "User Page", dataFind: findUser });
};

export const authEditUser = async (req, res) => {
  const { name: UserName } = req.dataAuto;

  try {
    const { name: newName, email: newEmail } = req.body;

    // Update user data
    const findUserAndUpdate = await User.findOneAndUpdate(
      { Name: UserName },
      {
        Name: newName,
        Email: newEmail,
      },
      { new: true }
    );

    if (findUserAndUpdate) {
      console.log("Success Update");
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: findUserAndUpdate,
      });
    } else {
      console.log("Failed to update user");
      return res.status(500).json({
        success: false,
        message: "Failed to update user",
      });
    }
  } catch (error) {
    console.error("Error updating user data", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const authNavbar = async (req, res) => {
  const { name } = req.dataAuto;
  const foundName = await User.findOne({ Name: name });

  return res
    .status(200)
    .json({ dataToken: req.dataAuto, PriceUser: foundName });
};
