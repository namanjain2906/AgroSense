import mongoose from "mongoose";

// 1. Sub-schema for the 10-20 day intervals
const lifecycleStageSchema = new mongoose.Schema({
  stage_name: { type: String, required: true, trim: true },
  day_start: { type: Number, required: true, min: 0 },
  day_end: { type: Number, required: true, min: 0 },
  ideal_conditions: {
    min_temp: { type: Number, required: true },
    max_temp: { type: Number, required: true },
    max_days_without_water: { type: Number, required: true }
  },
  expected_growth: {
    min_height_cm: { type: Number, default: 0 },
    max_height_cm: { type: Number, default: 0 }
  }
}, { _id: false });

// 2. Main schema for the Crop
const cropProfileSchema = new mongoose.Schema({
  crop_name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  variety: {
    type: String,
    required: true,
    trim: true
  },
  region: {
    type: String,
    default: 'General',
    trim: true
  },
  favorable_weather: {
    type: String,
    required: true,
    trim: true
  },
  sowing_months: [{
    type: String,
    required: true,
    trim: true
  }],
  soil_type: [{
    type: String,
    required: true,
    trim: true
  }],
  lifecycle_stages: [lifecycleStageSchema] 
}, { 
  timestamps: true 
});

const CropProfile = mongoose.model("CropProfile", cropProfileSchema);
export default CropProfile;
