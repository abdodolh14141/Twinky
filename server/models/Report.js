import mongoose from "mongoose"; // Correct import
import AutoIncrementFactory from "mongoose-sequence"; // Import auto-increment factory

const AutoIncrement = AutoIncrementFactory(mongoose); // Initialize auto-increment with the Mongoose instance

const Schema = mongoose.Schema; // Destructure Schema from Mongoose

const ReportSchema = new Schema({
  Id: {
    type: Number,
    unique: true,
    index: true,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming it references a User
    ref: "User", // References the User model
  },
  UserName: {
    type: String,
    required: true,
  },
  Message: {
    type: String,
    required: true,
  },
  DateRegistered: {
    type: Date,
    default: Date.now,
  },
});

// Apply auto-increment to 'Id' field in ReportSchema
ReportSchema.plugin(AutoIncrement, { inc_field: "Id", start_seq: 1 });

const ReportModel = mongoose.model("Report", ReportSchema); // Create the Report model

export default ReportModel; // Export the model
