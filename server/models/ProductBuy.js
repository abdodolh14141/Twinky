import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productBuySchema = new Schema({
  Id: {
    type: String,
    required: true,
  },
  Text: {
    type: String,
    required: true,
  },
  ImgSrc: {
    type: String,
    required: true,
  },
  Par: {
    type: String,
  },
  Price: {
    type: Number,
    required: true,
  },
  IdUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Count: {
    type: Number,
    default: 1,
  },
  DateBought: {
    type: Date,
    default: Date.now,
  },
});

const ProductBuy = mongoose.model("ProductBuy", productBuySchema);

export default ProductBuy;
