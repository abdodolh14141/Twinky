import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  Password: {
    type: String,
    required: true,
    minlength: 6,
  },
  Price: {
    type: Number,
    default: 5000,
  },
  DateRegistered: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
