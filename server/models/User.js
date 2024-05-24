import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  Name: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
  },
  Email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  Age: {
    type: Number,
    required: true,
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

const User = mongoose.model("User", UserSchema);

export default User;
