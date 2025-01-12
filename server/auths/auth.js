import User from "../models/User.js";
import ProductBuy from "../models/ProductBuy.js";
import ReportModel from "../models/Report.js";
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
  const { UserName: Name, Email: EmailUser, Age: AgeUser, Password } = req.body;

  try {
    const existingUserByEmail = await User.findOne({ Email: EmailUser });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered. Please try logging in.",
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      UserName: Name,
      Email: EmailUser,
      Age: AgeUser,
      Password: hashedPassword,
      Price: 5000,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Registration successful. You can now log in.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.Email) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered. Please try logging in.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again later.",
    });
  }
};

export const authLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email && password) {
      const checkUser = await User.findOne({ Email: email });

      if (checkUser) {
        const passwordMatch = await bcrypt.compare(
          password,
          checkUser.Password
        );

        if (passwordMatch) {
          const jwtToken = jwt.sign(
            {
              id: checkUser._id,
              email: checkUser.Email,
              name: checkUser.UserName,
              price: checkUser.Price,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "3h",
            }
          );

          return res.cookie("token", jwtToken).status(200).json({
            success: true,
            message: "Login successful",
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

    // Fetch user and product from the database
    const checkUser = await User.findOne({ _id: idUser });
    const checkProduct = await ProductBuy.findOne({ Id: idProduct });

    // Check if user and product exist
    if (!checkUser || !checkProduct) {
      return res
        .status(404)
        .json({ success: false, message: "User or product not found" });
    }

    // Check if user has sufficient balance
    if (checkUser.Price >= checkProduct.Price) {
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
      checkUser.Price -= checkProduct.Price;
      await checkUser.save();

      return res.status(200).json({
        success: true,
        message: "Purchase count incremented successfully",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }
  } catch (error) {
    console.error("Error in authPurchaseAdd:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
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
    const resDel = await ProductBuy.findOneAndDelete({
      Id: idDelete,
      IdUser: id,
    });
    if (resDel) {
      if (resDel.Count > 1) {
        // Find the user
        const resUploadPrice = await User.findOne({ _id: id });
        if (!resUploadPrice) {
          // Return 400 if user not found
          return res
            .status(400)
            .json({ success: false, message: "User Not Found" });
        }

        const resPriceUser = resDel.Count * resDel.Price;

        // Update user's price
        resUploadPrice.Price += resPriceUser;
        await resUploadPrice.save();

        // Return success message
        return res
          .status(200)
          .json({ success: true, message: "Success Delete Product" });
      }
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
    const { id } = req.dataAuto;
    const { price } = req.body;

    if (!price || !id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request data" });
    }

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.Price < price) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    user.Price -= price;
    await user.save();

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
    const { id, text, imgSrc, par, price } = req.body;
    const { id: idUser } = req.dataAuto;

    const user = await User.findOne({ _id: idUser });
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
  try {
    // Extract the new name and email from the request body
    const { name: newName, email: newEmail } = req.body;
    const { name: UserAuto } = req.dataAuto;
    // Check if the new name or email already exists in a different user
    const existingUser = await User.findOne(
      { Name: newName, Email: newEmail } // Ensure it's not the same user
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This Name or Email is already in use by another user.",
      });
    }

    // Update the user data if no existing user with the same name or email
    const updatedUser = await User.findOneAndUpdate(
      { Name: UserAuto },
      {
        Name: newName,
        Email: newEmail,
      },
      { new: true }
    );

    if (updatedUser) {
      console.log("User updated successfully");
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } else {
      console.log("Failed to update user");
      return res.status(404).json({
        success: false,
        message: "User not found",
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

export const authAbout = (req, res) => {
  return res.status(200).json({ success: true, message: "About Page" });
};

export const authAboutPost = async (req, res) => {
  const { report } = req.body;
  const { id: idUser, name: NameUser } = req.dataAuto;

  if (!report || typeof report !== "string" || report.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Report message is required and must not be empty.",
    });
  }

  try {
    // Create a new report with the incoming data
    const newReport = new ReportModel({
      UserId: idUser,
      UserName: NameUser,
      Message: report.trim(), // Use trim to remove leading/trailing spaces
    });

    // Save the report in the database
    await newReport.save();

    return res.status(200).json({
      success: true,
      message: "Report submitted successfully!",
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while submitting the report.",
    });
  }
};

export const authNavbar = async (req, res) => {
  const { id } = req.dataAuto;
  const foundName = await User.findOne({ _id: id });

  return res
    .status(200)
    .json({ dataToken: req.dataAuto, PriceUser: foundName });
};
