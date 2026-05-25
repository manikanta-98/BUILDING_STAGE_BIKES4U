import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    year: {
      type: Number,
      default: null,
      index: true,
    },
    number: {
      type: String,
      default: null,
      trim: true,
    },
    price: {
      type: Number,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ["unsold", "sold"],
      default: "unsold",
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    images: {
      type: [String],
      default: ["", "", "", ""],
    },
  },
  {
    timestamps: true,
  }
);

bikeSchema.index({ model: "text", description: "text", number: "text" });

bikeSchema.index(
  { number: 1 },
  {
    unique: true,
    partialFilterExpression: {
      number: { $type: "string", $ne: "" },
    },
  }
);

export default mongoose.model("Bike", bikeSchema);
