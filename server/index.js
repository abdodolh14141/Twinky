import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv/config";
import bodyParser from "body-parser";
import route from "./routes/route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", route);

const PORT = parseInt(process.env.PORT || "4000", 10);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
