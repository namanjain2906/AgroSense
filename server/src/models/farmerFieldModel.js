import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        country: { type: String, default: "India", trim: true },
        coordinates: {
            lat: { type: Number, min: -90, max: 90 },
            lon: { type: Number, min: -180, max: 180 }
        }
  },
  { _id: false },
);

const farmerFieldSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    cropProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CropProfile",
      required: true,
      index: true,
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      index: true,
    },
    sowing_date: {
      type: Date,
      required: true,
    },
    last_watered_date: {
      type: Date,
      default: null,
    },
    latest_reported_height_cm: {
      type: Number,
      min: 0,
      default: null,
    },
    location: {
      type: locationSchema,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    harvested_date: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const FarmerField = mongoose.model("FarmerField", farmerFieldSchema);
export default FarmerField;
