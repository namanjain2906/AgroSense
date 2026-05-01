import mongoose from "mongoose";
import dotenv from "dotenv";
import CropProfile from "../models/cropModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI; 

const cropData = [
  // ==========================================
  // CEREALS & GRAINS
  // ==========================================
  {
    crop_name: "wheat", variety: "HD-2967", region: "North India", favorable_weather: "Cool and moist during growth, dry and warm for ripening.", sowing_months: ["October", "November"], soil_type: ["Well-drained Loam", "Clay Loam", "Alluvial"],
    lifecycle_stages: [
      { stage_name: "Germination & CRI", day_start: 0, day_end: 25, ideal_conditions: { min_temp: 10, max_temp: 22, max_days_without_water: 21 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Tillering & Jointing", day_start: 26, day_end: 65, ideal_conditions: { min_temp: 12, max_temp: 25, max_days_without_water: 15 }, expected_growth: { min_height_cm: 16, max_height_cm: 60 } },
      { stage_name: "Flowering & Dough", day_start: 66, day_end: 105, ideal_conditions: { min_temp: 15, max_temp: 30, max_days_without_water: 10 }, expected_growth: { min_height_cm: 61, max_height_cm: 100 } },
      { stage_name: "Maturity & Harvest", day_start: 106, day_end: 135, ideal_conditions: { min_temp: 20, max_temp: 35, max_days_without_water: 30 }, expected_growth: { min_height_cm: 95, max_height_cm: 105 } }
    ]
  },
  {
    crop_name: "rice", variety: "IR64", region: "All India", favorable_weather: "Hot and highly humid. Requires abundant rainfall or continuous irrigation.", sowing_months: ["June", "July"], soil_type: ["Heavy Clay", "Clay Loam"],
    lifecycle_stages: [
      { stage_name: "Seedling Nursery", day_start: 0, day_end: 25, ideal_conditions: { min_temp: 20, max_temp: 35, max_days_without_water: 2 }, expected_growth: { min_height_cm: 0, max_height_cm: 20 } },
      { stage_name: "Active Tillering", day_start: 26, day_end: 55, ideal_conditions: { min_temp: 22, max_temp: 33, max_days_without_water: 3 }, expected_growth: { min_height_cm: 21, max_height_cm: 60 } },
      { stage_name: "Panicle Initiation", day_start: 56, day_end: 90, ideal_conditions: { min_temp: 20, max_temp: 32, max_days_without_water: 3 }, expected_growth: { min_height_cm: 61, max_height_cm: 110 } },
      { stage_name: "Ripening", day_start: 91, day_end: 120, ideal_conditions: { min_temp: 18, max_temp: 30, max_days_without_water: 10 }, expected_growth: { min_height_cm: 100, max_height_cm: 115 } }
    ]
  },
  {
    crop_name: "maize", variety: "Ganga 5", region: "General", favorable_weather: "Warm and humid. Highly susceptible to waterlogging.", sowing_months: ["June", "July", "February"], soil_type: ["Deep Loam", "Silt Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 21, max_temp: 30, max_days_without_water: 7 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Vegetative Phase", day_start: 16, day_end: 50, ideal_conditions: { min_temp: 24, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 16, max_height_cm: 150 } },
      { stage_name: "Tasseling & Silking", day_start: 51, day_end: 75, ideal_conditions: { min_temp: 26, max_temp: 33, max_days_without_water: 5 }, expected_growth: { min_height_cm: 150, max_height_cm: 220 } },
      { stage_name: "Grain Filling", day_start: 76, day_end: 110, ideal_conditions: { min_temp: 20, max_temp: 30, max_days_without_water: 12 }, expected_growth: { min_height_cm: 200, max_height_cm: 250 } }
    ]
  },
  {
    crop_name: "sorghum", variety: "CSH 1", region: "Maharashtra/Karnataka", favorable_weather: "Drought resistant, hot and dry climates.", sowing_months: ["June", "July", "September"], soil_type: ["Heavy Black", "Red Soil"],
    lifecycle_stages: [
      { stage_name: "Seedling", day_start: 0, day_end: 20, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 0, max_height_cm: 20 } },
      { stage_name: "Grand Growth", day_start: 21, day_end: 60, ideal_conditions: { min_temp: 25, max_temp: 40, max_days_without_water: 15 }, expected_growth: { min_height_cm: 21, max_height_cm: 150 } },
      { stage_name: "Booting to Bloom", day_start: 61, day_end: 90, ideal_conditions: { min_temp: 20, max_temp: 35, max_days_without_water: 12 }, expected_growth: { min_height_cm: 151, max_height_cm: 200 } },
      { stage_name: "Maturity", day_start: 91, day_end: 120, ideal_conditions: { min_temp: 18, max_temp: 35, max_days_without_water: 25 }, expected_growth: { min_height_cm: 190, max_height_cm: 220 } }
    ]
  },
  {
    crop_name: "pearl millet", variety: "Pusa 415", region: "Rajasthan/Gujarat", favorable_weather: "Extremely drought and heat tolerant. Thrives in arid regions.", sowing_months: ["June", "July"], soil_type: ["Sandy", "Light Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 25, max_temp: 40, max_days_without_water: 15 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Tillering", day_start: 16, day_end: 40, ideal_conditions: { min_temp: 28, max_temp: 42, max_days_without_water: 20 }, expected_growth: { min_height_cm: 16, max_height_cm: 100 } },
      { stage_name: "Heading & Flowering", day_start: 41, day_end: 65, ideal_conditions: { min_temp: 25, max_temp: 38, max_days_without_water: 15 }, expected_growth: { min_height_cm: 101, max_height_cm: 180 } },
      { stage_name: "Grain Filling", day_start: 66, day_end: 90, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 30 }, expected_growth: { min_height_cm: 150, max_height_cm: 200 } }
    ]
  },
  {
    crop_name: "finger millet", variety: "GPU 28", region: "Karnataka/TN", favorable_weather: "Tolerant to dry spells, prefers moderate rainfall.", sowing_months: ["June", "July"], soil_type: ["Red Lateritic", "Sandy Loam"],
    lifecycle_stages: [
      { stage_name: "Nursery/Seedling", day_start: 0, day_end: 20, ideal_conditions: { min_temp: 20, max_temp: 32, max_days_without_water: 7 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Vegetative Phase", day_start: 21, day_end: 60, ideal_conditions: { min_temp: 22, max_temp: 35, max_days_without_water: 12 }, expected_growth: { min_height_cm: 16, max_height_cm: 60 } },
      { stage_name: "Flowering", day_start: 61, day_end: 90, ideal_conditions: { min_temp: 20, max_temp: 30, max_days_without_water: 10 }, expected_growth: { min_height_cm: 61, max_height_cm: 90 } },
      { stage_name: "Maturity", day_start: 91, day_end: 120, ideal_conditions: { min_temp: 18, max_temp: 30, max_days_without_water: 20 }, expected_growth: { min_height_cm: 80, max_height_cm: 100 } }
    ]
  },
  {
    crop_name: "barley", variety: "K 125", region: "North India", favorable_weather: "Cool, dry weather. More drought tolerant than wheat.", sowing_months: ["October", "November"], soil_type: ["Sandy Loam", "Saline Tolerant"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 20, ideal_conditions: { min_temp: 12, max_temp: 22, max_days_without_water: 20 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Tillering", day_start: 21, day_end: 60, ideal_conditions: { min_temp: 15, max_temp: 28, max_days_without_water: 15 }, expected_growth: { min_height_cm: 16, max_height_cm: 60 } },
      { stage_name: "Heading", day_start: 61, day_end: 90, ideal_conditions: { min_temp: 15, max_temp: 32, max_days_without_water: 12 }, expected_growth: { min_height_cm: 61, max_height_cm: 90 } },
      { stage_name: "Ripening", day_start: 91, day_end: 120, ideal_conditions: { min_temp: 20, max_temp: 35, max_days_without_water: 30 }, expected_growth: { min_height_cm: 85, max_height_cm: 100 } }
    ]
  },
  {
    crop_name: "oats", variety: "Kent", region: "North/Central India", favorable_weather: "Cool and moist conditions. Grown mainly as Rabi fodder.", sowing_months: ["October", "November"], soil_type: ["Loam", "Clay Loam"],
    lifecycle_stages: [
      { stage_name: "Early Growth", day_start: 0, day_end: 30, ideal_conditions: { min_temp: 10, max_temp: 25, max_days_without_water: 15 }, expected_growth: { min_height_cm: 0, max_height_cm: 25 } },
      { stage_name: "Active Vegetative", day_start: 31, day_end: 70, ideal_conditions: { min_temp: 15, max_temp: 28, max_days_without_water: 12 }, expected_growth: { min_height_cm: 26, max_height_cm: 80 } },
      { stage_name: "Boot Stage & Bloom", day_start: 71, day_end: 100, ideal_conditions: { min_temp: 15, max_temp: 30, max_days_without_water: 10 }, expected_growth: { min_height_cm: 81, max_height_cm: 120 } },
      { stage_name: "Grain Formation", day_start: 101, day_end: 130, ideal_conditions: { min_temp: 20, max_temp: 35, max_days_without_water: 20 }, expected_growth: { min_height_cm: 110, max_height_cm: 140 } }
    ]
  },

  // ==========================================
  // PULSES (LEGUMES)
  // ==========================================
  {
    crop_name: "chickpea", variety: "Pusa 256", region: "MP/Rajasthan/UP", favorable_weather: "Cool, dry weather. Cannot tolerate heavy rains.", sowing_months: ["October", "November"], soil_type: ["Sandy Loam", "Black Cotton"],
    lifecycle_stages: [
      { stage_name: "Seedling", day_start: 0, day_end: 25, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 30 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Branching", day_start: 26, day_end: 65, ideal_conditions: { min_temp: 18, max_temp: 28, max_days_without_water: 25 }, expected_growth: { min_height_cm: 16, max_height_cm: 40 } },
      { stage_name: "Flowering & Podding", day_start: 66, day_end: 110, ideal_conditions: { min_temp: 20, max_temp: 30, max_days_without_water: 15 }, expected_growth: { min_height_cm: 41, max_height_cm: 60 } },
      { stage_name: "Maturity", day_start: 111, day_end: 140, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 40 }, expected_growth: { min_height_cm: 50, max_height_cm: 65 } }
    ]
  },
  {
    crop_name: "pigeon pea", variety: "UPAS 120", region: "Maharashtra/UP", favorable_weather: "Warm, tropical. Drought tolerant but sensitive to frost.", sowing_months: ["June", "July"], soil_type: ["Well-drained Alluvial", "Red Loam"],
    lifecycle_stages: [
      { stage_name: "Early Growth", day_start: 0, day_end: 45, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 15 }, expected_growth: { min_height_cm: 0, max_height_cm: 40 } },
      { stage_name: "Grand Vegetative", day_start: 46, day_end: 100, ideal_conditions: { min_temp: 26, max_temp: 38, max_days_without_water: 20 }, expected_growth: { min_height_cm: 41, max_height_cm: 150 } },
      { stage_name: "Flowering", day_start: 101, day_end: 140, ideal_conditions: { min_temp: 20, max_temp: 35, max_days_without_water: 15 }, expected_growth: { min_height_cm: 151, max_height_cm: 200 } },
      { stage_name: "Pod Development", day_start: 141, day_end: 180, ideal_conditions: { min_temp: 18, max_temp: 32, max_days_without_water: 30 }, expected_growth: { min_height_cm: 180, max_height_cm: 220 } }
    ]
  },
  {
    crop_name: "black gram", variety: "Pant U 19", region: "Central/South India", favorable_weather: "Warm and humid. Sensitive to waterlogging.", sowing_months: ["June", "July", "February"], soil_type: ["Heavy Clay", "Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vegetative Phase", day_start: 16, day_end: 40, ideal_conditions: { min_temp: 27, max_temp: 38, max_days_without_water: 12 }, expected_growth: { min_height_cm: 11, max_height_cm: 40 } },
      { stage_name: "Flowering & Podding", day_start: 41, day_end: 65, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 41, max_height_cm: 60 } },
      { stage_name: "Maturity", day_start: 66, day_end: 85, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 20 }, expected_growth: { min_height_cm: 50, max_height_cm: 65 } }
    ]
  },
  {
    crop_name: "green gram", variety: "Pusa Vishal", region: "General", favorable_weather: "Hot and dry climate. Very fast-growing crop.", sowing_months: ["June", "July", "February", "March"], soil_type: ["Well-drained Loam", "Sandy Loam"],
    lifecycle_stages: [
      { stage_name: "Seedling", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Vegetative Growth", day_start: 16, day_end: 35, ideal_conditions: { min_temp: 28, max_temp: 40, max_days_without_water: 15 }, expected_growth: { min_height_cm: 16, max_height_cm: 45 } },
      { stage_name: "Flowering", day_start: 36, day_end: 50, ideal_conditions: { min_temp: 25, max_temp: 38, max_days_without_water: 10 }, expected_growth: { min_height_cm: 46, max_height_cm: 60 } },
      { stage_name: "Pod Maturity", day_start: 51, day_end: 70, ideal_conditions: { min_temp: 25, max_temp: 38, max_days_without_water: 20 }, expected_growth: { min_height_cm: 55, max_height_cm: 65 } }
    ]
  },
  {
    crop_name: "lentil", variety: "DPL 62", region: "UP/MP/Bihar", favorable_weather: "Cool and dry conditions. Cannot survive waterlogging.", sowing_months: ["October", "November"], soil_type: ["Light Loam", "Alluvial"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 20, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 25 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Branching", day_start: 21, day_end: 60, ideal_conditions: { min_temp: 18, max_temp: 28, max_days_without_water: 20 }, expected_growth: { min_height_cm: 11, max_height_cm: 30 } },
      { stage_name: "Flowering", day_start: 61, day_end: 90, ideal_conditions: { min_temp: 20, max_temp: 30, max_days_without_water: 15 }, expected_growth: { min_height_cm: 31, max_height_cm: 45 } },
      { stage_name: "Maturity", day_start: 91, day_end: 120, ideal_conditions: { min_temp: 22, max_temp: 35, max_days_without_water: 30 }, expected_growth: { min_height_cm: 40, max_height_cm: 50 } }
    ]
  },
  {
    crop_name: "peas", variety: "Arkel", region: "North India", favorable_weather: "Cool weather. Very sensitive to frost during flowering.", sowing_months: ["October", "November"], soil_type: ["Well-drained Loam", "Clay Loam"],
    lifecycle_stages: [
      { stage_name: "Seedling", day_start: 0, day_end: 20, ideal_conditions: { min_temp: 10, max_temp: 22, max_days_without_water: 15 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Vegetative Phase", day_start: 21, day_end: 50, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 12 }, expected_growth: { min_height_cm: 16, max_height_cm: 60 } },
      { stage_name: "Flowering & Podding", day_start: 51, day_end: 80, ideal_conditions: { min_temp: 15, max_temp: 28, max_days_without_water: 10 }, expected_growth: { min_height_cm: 61, max_height_cm: 90 } },
      { stage_name: "Harvest (Green)", day_start: 81, day_end: 100, ideal_conditions: { min_temp: 18, max_temp: 30, max_days_without_water: 15 }, expected_growth: { min_height_cm: 80, max_height_cm: 100 } }
    ]
  },

  // ==========================================
  // OILSEEDS
  // ==========================================
  {
    crop_name: "soybean", variety: "JS 335", region: "MP/Maharashtra", favorable_weather: "Warm and moist summer. Sensitive to extreme heat.", sowing_months: ["June", "July"], soil_type: ["Black Cotton", "Well-drained Loam"],
    lifecycle_stages: [
      { stage_name: "Emergence", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 20, max_temp: 30, max_days_without_water: 7 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vegetative Growth", day_start: 16, day_end: 45, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 11, max_height_cm: 50 } },
      { stage_name: "Flowering & Pod Set", day_start: 46, day_end: 80, ideal_conditions: { min_temp: 25, max_temp: 32, max_days_without_water: 8 }, expected_growth: { min_height_cm: 51, max_height_cm: 80 } },
      { stage_name: "Seed Filling & Harvest", day_start: 81, day_end: 110, ideal_conditions: { min_temp: 20, max_temp: 35, max_days_without_water: 20 }, expected_growth: { min_height_cm: 75, max_height_cm: 90 } }
    ]
  },
  {
    crop_name: "groundnut", variety: "TG 37A", region: "Gujarat/AP", favorable_weather: "Warm climate, lots of sunshine. Needs dry period for harvest.", sowing_months: ["June", "July"], soil_type: ["Sandy Loam", "Red Soil"],
    lifecycle_stages: [
      { stage_name: "Seedling", day_start: 0, day_end: 20, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vegetative & Pegging", day_start: 21, day_end: 60, ideal_conditions: { min_temp: 28, max_temp: 38, max_days_without_water: 12 }, expected_growth: { min_height_cm: 11, max_height_cm: 35 } },
      { stage_name: "Pod Development", day_start: 61, day_end: 100, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 36, max_height_cm: 45 } },
      { stage_name: "Maturity", day_start: 101, day_end: 130, ideal_conditions: { min_temp: 22, max_temp: 35, max_days_without_water: 25 }, expected_growth: { min_height_cm: 40, max_height_cm: 50 } }
    ]
  },
  {
    crop_name: "mustard", variety: "Pusa Bold", region: "Rajasthan/UP", favorable_weather: "Cool, dry winter. Frost at flowering causes heavy yield loss.", sowing_months: ["October", "November"], soil_type: ["Light Loam", "Sandy Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 20, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 25 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Vegetative Phase", day_start: 21, day_end: 55, ideal_conditions: { min_temp: 12, max_temp: 25, max_days_without_water: 20 }, expected_growth: { min_height_cm: 16, max_height_cm: 70 } },
      { stage_name: "Flowering & Podding", day_start: 56, day_end: 95, ideal_conditions: { min_temp: 10, max_temp: 25, max_days_without_water: 15 }, expected_growth: { min_height_cm: 71, max_height_cm: 140 } },
      { stage_name: "Ripening", day_start: 96, day_end: 130, ideal_conditions: { min_temp: 15, max_temp: 30, max_days_without_water: 35 }, expected_growth: { min_height_cm: 130, max_height_cm: 150 } }
    ]
  },
  {
    crop_name: "sunflower", variety: "KBSH-1", region: "Karnataka/Maharashtra", favorable_weather: "Highly adaptable, drought tolerant. Requires full sun.", sowing_months: ["February", "March", "June", "July"], soil_type: ["Deep Loam", "Black Soil"],
    lifecycle_stages: [
      { stage_name: "Seedling", day_start: 0, day_end: 20, ideal_conditions: { min_temp: 20, max_temp: 30, max_days_without_water: 10 }, expected_growth: { min_height_cm: 0, max_height_cm: 20 } },
      { stage_name: "Vegetative Phase", day_start: 21, day_end: 55, ideal_conditions: { min_temp: 22, max_temp: 35, max_days_without_water: 15 }, expected_growth: { min_height_cm: 21, max_height_cm: 120 } },
      { stage_name: "Bud & Flowering", day_start: 56, day_end: 80, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 121, max_height_cm: 180 } },
      { stage_name: "Seed Development", day_start: 81, day_end: 110, ideal_conditions: { min_temp: 20, max_temp: 35, max_days_without_water: 20 }, expected_growth: { min_height_cm: 160, max_height_cm: 200 } }
    ]
  },
  {
    crop_name: "sesame", variety: "Pratap", region: "Gujarat/West Bengal", favorable_weather: "Warm, tropical. Very sensitive to frost and waterlogging.", sowing_months: ["June", "July", "February"], soil_type: ["Well-drained Light Loam", "Sandy"],
    lifecycle_stages: [
      { stage_name: "Emergence", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 7 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vegetative", day_start: 16, day_end: 45, ideal_conditions: { min_temp: 27, max_temp: 38, max_days_without_water: 12 }, expected_growth: { min_height_cm: 11, max_height_cm: 60 } },
      { stage_name: "Flowering & Capsule", day_start: 46, day_end: 75, ideal_conditions: { min_temp: 25, max_temp: 38, max_days_without_water: 10 }, expected_growth: { min_height_cm: 61, max_height_cm: 110 } },
      { stage_name: "Maturity", day_start: 76, day_end: 100, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 20 }, expected_growth: { min_height_cm: 100, max_height_cm: 120 } }
    ]
  },
  {
    crop_name: "castor", variety: "GCH-4", region: "Gujarat/Rajasthan", favorable_weather: "Hot, dry climates. Deep-rooted and highly drought tolerant.", sowing_months: ["July", "August"], soil_type: ["Sandy Loam", "Red Soil"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 20, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 15 }, expected_growth: { min_height_cm: 0, max_height_cm: 20 } },
      { stage_name: "Vegetative Phase", day_start: 21, day_end: 70, ideal_conditions: { min_temp: 28, max_temp: 40, max_days_without_water: 25 }, expected_growth: { min_height_cm: 21, max_height_cm: 120 } },
      { stage_name: "Flowering Spike", day_start: 71, day_end: 120, ideal_conditions: { min_temp: 25, max_temp: 38, max_days_without_water: 20 }, expected_growth: { min_height_cm: 121, max_height_cm: 200 } },
      { stage_name: "Capsule Maturation", day_start: 121, day_end: 180, ideal_conditions: { min_temp: 20, max_temp: 38, max_days_without_water: 30 }, expected_growth: { min_height_cm: 180, max_height_cm: 250 } }
    ]
  },

  // ==========================================
  // CASH & COMMERCIAL CROPS
  // ==========================================
  {
    crop_name: "sugarcane", variety: "Co 0238", region: "UP/Maharashtra", favorable_weather: "Hot, humid tropical climate. Requires intense sunlight.", sowing_months: ["February", "March", "October"], soil_type: ["Deep Loam", "Heavy Alluvial"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 45, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 0, max_height_cm: 30 } },
      { stage_name: "Tillering Phase", day_start: 46, day_end: 120, ideal_conditions: { min_temp: 28, max_temp: 38, max_days_without_water: 12 }, expected_growth: { min_height_cm: 31, max_height_cm: 120 } },
      { stage_name: "Grand Growth", day_start: 121, day_end: 270, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 8 }, expected_growth: { min_height_cm: 121, max_height_cm: 300 } },
      { stage_name: "Ripening", day_start: 271, day_end: 360, ideal_conditions: { min_temp: 12, max_temp: 30, max_days_without_water: 25 }, expected_growth: { min_height_cm: 280, max_height_cm: 320 } }
    ]
  },
  {
    crop_name: "cotton", variety: "Bt Cotton", region: "Gujarat/Maharashtra", favorable_weather: "Uniform high temperatures. Extremely sensitive to rain during boll opening.", sowing_months: ["May", "June"], soil_type: ["Black Cotton", "Deep Clay"],
    lifecycle_stages: [
      { stage_name: "Seedling", day_start: 0, day_end: 25, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 15 }, expected_growth: { min_height_cm: 0, max_height_cm: 20 } },
      { stage_name: "Vegetative Branching", day_start: 26, day_end: 65, ideal_conditions: { min_temp: 28, max_temp: 38, max_days_without_water: 20 }, expected_growth: { min_height_cm: 21, max_height_cm: 80 } },
      { stage_name: "Square & Flowering", day_start: 66, day_end: 110, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 15 }, expected_growth: { min_height_cm: 81, max_height_cm: 130 } },
      { stage_name: "Boll Opening", day_start: 111, day_end: 160, ideal_conditions: { min_temp: 22, max_temp: 35, max_days_without_water: 30 }, expected_growth: { min_height_cm: 120, max_height_cm: 150 } }
    ]
  },
  {
    crop_name: "jute", variety: "JRO 524", region: "West Bengal/Bihar", favorable_weather: "Hot and very humid climate. Requires stagnant water for retting post-harvest.", sowing_months: ["March", "April"], soil_type: ["Alluvial", "Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 28, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Early Vegetative", day_start: 16, day_end: 50, ideal_conditions: { min_temp: 30, max_temp: 38, max_days_without_water: 7 }, expected_growth: { min_height_cm: 16, max_height_cm: 100 } },
      { stage_name: "Grand Growth", day_start: 51, day_end: 100, ideal_conditions: { min_temp: 28, max_temp: 36, max_days_without_water: 5 }, expected_growth: { min_height_cm: 101, max_height_cm: 250 } },
      { stage_name: "Harvest Stage", day_start: 101, day_end: 130, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 250, max_height_cm: 350 } }
    ]
  },
  {
    crop_name: "tobacco", variety: "FCV", region: "AP/Karnataka", favorable_weather: "Warm and humid. Sensitive to waterlogging and frost.", sowing_months: ["August", "September", "October"], soil_type: ["Light Sandy Loam", "Red Soil"],
    lifecycle_stages: [
      { stage_name: "Nursery", day_start: 0, day_end: 45, ideal_conditions: { min_temp: 20, max_temp: 30, max_days_without_water: 3 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Transplanting & Estab.", day_start: 46, day_end: 75, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 16, max_height_cm: 60 } },
      { stage_name: "Active Leaf Growth", day_start: 76, day_end: 120, ideal_conditions: { min_temp: 25, max_temp: 32, max_days_without_water: 12 }, expected_growth: { min_height_cm: 61, max_height_cm: 150 } },
      { stage_name: "Leaf Maturation", day_start: 121, day_end: 150, ideal_conditions: { min_temp: 20, max_temp: 32, max_days_without_water: 20 }, expected_growth: { min_height_cm: 140, max_height_cm: 180 } }
    ]
  },

  // ==========================================
  // VEGETABLES
  // ==========================================
  {
    crop_name: "potato", variety: "Kufri Jyoti", region: "UP/West Bengal", favorable_weather: "Cool weather. Frost damages foliage; heat stops tuber formation.", sowing_months: ["October", "November"], soil_type: ["Sandy Loam", "Loose Loam"],
    lifecycle_stages: [
      { stage_name: "Sprouting", day_start: 0, day_end: 25, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 10 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vegetative Growth", day_start: 26, day_end: 50, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 7 }, expected_growth: { min_height_cm: 11, max_height_cm: 45 } },
      { stage_name: "Tuber Initiation", day_start: 51, day_end: 75, ideal_conditions: { min_temp: 12, max_temp: 22, max_days_without_water: 6 }, expected_growth: { min_height_cm: 46, max_height_cm: 60 } },
      { stage_name: "Tuber Bulking", day_start: 76, day_end: 110, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 15 }, expected_growth: { min_height_cm: 50, max_height_cm: 65 } }
    ]
  },
  {
    crop_name: "tomato", variety: "Pusa Ruby", region: "General", favorable_weather: "Warm, clear weather. Very sensitive to frost and waterlogging.", sowing_months: ["June", "July", "October", "November"], soil_type: ["Sandy Loam", "Medium Black"],
    lifecycle_stages: [
      { stage_name: "Nursery", day_start: 0, day_end: 30, ideal_conditions: { min_temp: 18, max_temp: 28, max_days_without_water: 3 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Vegetative Growth", day_start: 31, day_end: 55, ideal_conditions: { min_temp: 20, max_temp: 32, max_days_without_water: 4 }, expected_growth: { min_height_cm: 16, max_height_cm: 50 } },
      { stage_name: "Flowering & Fruit", day_start: 56, day_end: 80, ideal_conditions: { min_temp: 20, max_temp: 30, max_days_without_water: 3 }, expected_growth: { min_height_cm: 51, max_height_cm: 80 } },
      { stage_name: "Harvesting", day_start: 81, day_end: 130, ideal_conditions: { min_temp: 15, max_temp: 30, max_days_without_water: 4 }, expected_growth: { min_height_cm: 70, max_height_cm: 100 } }
    ]
  },
  {
    crop_name: "onion", variety: "Agrifound Light Red", region: "Maharashtra", favorable_weather: "Cool for vegetative growth, warm/dry for bulb maturation.", sowing_months: ["June", "July", "October", "November"], soil_type: ["Loose Loam", "Sandy Loam"],
    lifecycle_stages: [
      { stage_name: "Nursery", day_start: 0, day_end: 45, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 4 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Vegetative Phase", day_start: 46, day_end: 90, ideal_conditions: { min_temp: 18, max_temp: 28, max_days_without_water: 7 }, expected_growth: { min_height_cm: 16, max_height_cm: 40 } },
      { stage_name: "Bulb Formation", day_start: 91, day_end: 120, ideal_conditions: { min_temp: 20, max_temp: 32, max_days_without_water: 6 }, expected_growth: { min_height_cm: 41, max_height_cm: 55 } },
      { stage_name: "Maturation & Curing", day_start: 121, day_end: 140, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 20 }, expected_growth: { min_height_cm: 40, max_height_cm: 50 } }
    ]
  },
  {
    crop_name: "brinjal", variety: "Pusa Purple Long", region: "General", favorable_weather: "Warm-season crop, requires long growing season. Frost sensitive.", sowing_months: ["June", "July", "October", "November"], soil_type: ["Well-drained Loam", "Clay Loam"],
    lifecycle_stages: [
      { stage_name: "Nursery", day_start: 0, day_end: 30, ideal_conditions: { min_temp: 22, max_temp: 30, max_days_without_water: 3 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Transplant & Growth", day_start: 31, day_end: 65, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 16, max_height_cm: 50 } },
      { stage_name: "Flowering", day_start: 66, day_end: 90, ideal_conditions: { min_temp: 25, max_temp: 32, max_days_without_water: 4 }, expected_growth: { min_height_cm: 51, max_height_cm: 80 } },
      { stage_name: "Fruiting & Harvest", day_start: 91, day_end: 150, ideal_conditions: { min_temp: 22, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 70, max_height_cm: 100 } }
    ]
  },
  {
    crop_name: "okra", variety: "Arka Anamika", region: "General", favorable_weather: "Loves hot and humid weather. Seed won't germinate in cold.", sowing_months: ["February", "March", "June", "July"], soil_type: ["Sandy Loam", "Clay Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vegetative", day_start: 16, day_end: 45, ideal_conditions: { min_temp: 25, max_temp: 38, max_days_without_water: 7 }, expected_growth: { min_height_cm: 11, max_height_cm: 60 } },
      { stage_name: "Flowering", day_start: 46, day_end: 60, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 61, max_height_cm: 90 } },
      { stage_name: "Continuous Picking", day_start: 61, day_end: 110, ideal_conditions: { min_temp: 25, max_temp: 38, max_days_without_water: 6 }, expected_growth: { min_height_cm: 91, max_height_cm: 150 } }
    ]
  },
  {
    crop_name: "cabbage", variety: "Golden Acre", region: "General (Winter)", favorable_weather: "Cool, moist climate. Heads crack in sudden heat.", sowing_months: ["September", "October"], soil_type: ["Heavy Loam", "Sandy Loam"],
    lifecycle_stages: [
      { stage_name: "Nursery", day_start: 0, day_end: 25, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 4 }, expected_growth: { min_height_cm: 0, max_height_cm: 12 } },
      { stage_name: "Vegetative Spread", day_start: 26, day_end: 55, ideal_conditions: { min_temp: 12, max_temp: 25, max_days_without_water: 6 }, expected_growth: { min_height_cm: 13, max_height_cm: 30 } },
      { stage_name: "Head Formation", day_start: 56, day_end: 80, ideal_conditions: { min_temp: 10, max_temp: 22, max_days_without_water: 5 }, expected_growth: { min_height_cm: 31, max_height_cm: 45 } },
      { stage_name: "Maturation & Harvest", day_start: 81, day_end: 100, ideal_conditions: { min_temp: 12, max_temp: 25, max_days_without_water: 10 }, expected_growth: { min_height_cm: 40, max_height_cm: 50 } }
    ]
  },
  {
    crop_name: "cauliflower", variety: "Pusa Snowball", region: "General (Winter)", favorable_weather: "Very sensitive to temperature. Needs cool, moist weather.", sowing_months: ["September", "October"], soil_type: ["Rich Loam", "Clay Loam"],
    lifecycle_stages: [
      { stage_name: "Nursery", day_start: 0, day_end: 25, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 4 }, expected_growth: { min_height_cm: 0, max_height_cm: 12 } },
      { stage_name: "Vegetative Growth", day_start: 26, day_end: 60, ideal_conditions: { min_temp: 15, max_temp: 28, max_days_without_water: 6 }, expected_growth: { min_height_cm: 13, max_height_cm: 40 } },
      { stage_name: "Curd Initiation", day_start: 61, day_end: 85, ideal_conditions: { min_temp: 10, max_temp: 20, max_days_without_water: 5 }, expected_growth: { min_height_cm: 41, max_height_cm: 55 } },
      { stage_name: "Curd Development", day_start: 86, day_end: 105, ideal_conditions: { min_temp: 10, max_temp: 22, max_days_without_water: 7 }, expected_growth: { min_height_cm: 50, max_height_cm: 65 } }
    ]
  },
  {
    crop_name: "carrot", variety: "Pusa Kesar", region: "North India", favorable_weather: "Cool weather. High temps cause rough, poor quality roots.", sowing_months: ["August", "September", "October"], soil_type: ["Deep Sandy Loam", "Loose Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 5 }, expected_growth: { min_height_cm: 0, max_height_cm: 5 } },
      { stage_name: "Foliage Growth", day_start: 16, day_end: 45, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 7 }, expected_growth: { min_height_cm: 6, max_height_cm: 25 } },
      { stage_name: "Root Development", day_start: 46, day_end: 75, ideal_conditions: { min_temp: 12, max_temp: 22, max_days_without_water: 6 }, expected_growth: { min_height_cm: 26, max_height_cm: 40 } },
      { stage_name: "Root Maturation", day_start: 76, day_end: 100, ideal_conditions: { min_temp: 10, max_temp: 22, max_days_without_water: 10 }, expected_growth: { min_height_cm: 35, max_height_cm: 50 } }
    ]
  },
  {
    crop_name: "radish", variety: "Pusa Desi", region: "General", favorable_weather: "Fast-growing cool season crop. Tolerates mild heat.", sowing_months: ["September", "October", "January"], soil_type: ["Sandy Loam", "Light Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 10, ideal_conditions: { min_temp: 15, max_temp: 28, max_days_without_water: 4 }, expected_growth: { min_height_cm: 0, max_height_cm: 5 } },
      { stage_name: "Vegetative Phase", day_start: 11, day_end: 25, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 5 }, expected_growth: { min_height_cm: 6, max_height_cm: 20 } },
      { stage_name: "Root Bulking", day_start: 26, day_end: 40, ideal_conditions: { min_temp: 12, max_temp: 25, max_days_without_water: 5 }, expected_growth: { min_height_cm: 21, max_height_cm: 30 } },
      { stage_name: "Harvesting", day_start: 41, day_end: 55, ideal_conditions: { min_temp: 12, max_temp: 28, max_days_without_water: 7 }, expected_growth: { min_height_cm: 25, max_height_cm: 35 } }
    ]
  },
  {
    crop_name: "spinach", variety: "All Green", region: "General", favorable_weather: "Cool weather crop. Bolts (goes to seed) quickly in heat.", sowing_months: ["September", "October", "February"], soil_type: ["Rich Loam", "Sandy Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 10, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 4 }, expected_growth: { min_height_cm: 0, max_height_cm: 5 } },
      { stage_name: "Leaf Growth", day_start: 11, day_end: 25, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 5 }, expected_growth: { min_height_cm: 6, max_height_cm: 15 } },
      { stage_name: "First Cutting", day_start: 26, day_end: 40, ideal_conditions: { min_temp: 15, max_temp: 28, max_days_without_water: 5 }, expected_growth: { min_height_cm: 16, max_height_cm: 25 } },
      { stage_name: "Regrowth & Harvest", day_start: 41, day_end: 70, ideal_conditions: { min_temp: 18, max_temp: 30, max_days_without_water: 5 }, expected_growth: { min_height_cm: 15, max_height_cm: 30 } }
    ]
  },

  // ==========================================
  // SPICES & HERBS & MEDICINAL
  // ==========================================
  {
    crop_name: "chilli", variety: "Guntur Sannam", region: "AP/Telangana", favorable_weather: "Warm and humid vegetative, dry during maturation.", sowing_months: ["June", "July", "September"], soil_type: ["Sandy Loam", "Red Loam"],
    lifecycle_stages: [
      { stage_name: "Seedling", day_start: 0, day_end: 30, ideal_conditions: { min_temp: 20, max_temp: 30, max_days_without_water: 3 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Vegetative & Branching", day_start: 31, day_end: 65, ideal_conditions: { min_temp: 22, max_temp: 32, max_days_without_water: 5 }, expected_growth: { min_height_cm: 16, max_height_cm: 45 } },
      { stage_name: "Flowering & Fruiting", day_start: 66, day_end: 100, ideal_conditions: { min_temp: 20, max_temp: 35, max_days_without_water: 4 }, expected_growth: { min_height_cm: 46, max_height_cm: 70 } },
      { stage_name: "Pod Maturation", day_start: 101, day_end: 160, ideal_conditions: { min_temp: 18, max_temp: 35, max_days_without_water: 7 }, expected_growth: { min_height_cm: 65, max_height_cm: 90 } }
    ]
  },
  {
    crop_name: "coriander", variety: "Pant Haritima", region: "Rajasthan/Gujarat", favorable_weather: "Cool, dry climate. Frost damages flowers.", sowing_months: ["October", "November"], soil_type: ["Well-drained Loam", "Black Soil"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 7 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vegetative Phase", day_start: 16, day_end: 50, ideal_conditions: { min_temp: 15, max_temp: 28, max_days_without_water: 10 }, expected_growth: { min_height_cm: 11, max_height_cm: 40 } },
      { stage_name: "Flowering", day_start: 51, day_end: 80, ideal_conditions: { min_temp: 20, max_temp: 30, max_days_without_water: 8 }, expected_growth: { min_height_cm: 41, max_height_cm: 80 } },
      { stage_name: "Seed Maturation", day_start: 81, day_end: 110, ideal_conditions: { min_temp: 20, max_temp: 35, max_days_without_water: 15 }, expected_growth: { min_height_cm: 75, max_height_cm: 95 } }
    ]
  },
  {
    crop_name: "cumin", variety: "GC 4", region: "Gujarat/Rajasthan", favorable_weather: "Extremely sensitive crop. Needs cool, dry weather. Unseasonal rain causes heavy loss.", sowing_months: ["October", "November"], soil_type: ["Well-drained Sandy Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 12, max_temp: 25, max_days_without_water: 7 }, expected_growth: { min_height_cm: 0, max_height_cm: 5 } },
      { stage_name: "Vegetative Growth", day_start: 16, day_end: 45, ideal_conditions: { min_temp: 15, max_temp: 28, max_days_without_water: 10 }, expected_growth: { min_height_cm: 6, max_height_cm: 20 } },
      { stage_name: "Flowering", day_start: 46, day_end: 75, ideal_conditions: { min_temp: 18, max_temp: 30, max_days_without_water: 8 }, expected_growth: { min_height_cm: 21, max_height_cm: 30 } },
      { stage_name: "Seed Maturation", day_start: 76, day_end: 100, ideal_conditions: { min_temp: 20, max_temp: 32, max_days_without_water: 15 }, expected_growth: { min_height_cm: 25, max_height_cm: 35 } }
    ]
  },
  {
    crop_name: "turmeric", variety: "Prabha", region: "Telangana/Maharashtra", favorable_weather: "Warm, highly humid tropical climate.", sowing_months: ["May", "June"], soil_type: ["Rich Sandy Loam", "Clay Loam"],
    lifecycle_stages: [
      { stage_name: "Sprouting", day_start: 0, day_end: 40, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 7 }, expected_growth: { min_height_cm: 0, max_height_cm: 20 } },
      { stage_name: "Active Tillering", day_start: 41, day_end: 120, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 21, max_height_cm: 80 } },
      { stage_name: "Rhizome Bulking", day_start: 121, day_end: 200, ideal_conditions: { min_temp: 22, max_temp: 32, max_days_without_water: 8 }, expected_growth: { min_height_cm: 81, max_height_cm: 110 } },
      { stage_name: "Maturation", day_start: 201, day_end: 260, ideal_conditions: { min_temp: 20, max_temp: 35, max_days_without_water: 20 }, expected_growth: { min_height_cm: 90, max_height_cm: 110 } }
    ]
  },
  {
    crop_name: "ginger", variety: "Suprabha", region: "Kerala/Karnataka", favorable_weather: "Warm, humid, needs shade. Very sensitive to waterlogging (rot).", sowing_months: ["May", "June"], soil_type: ["Well-drained Rich Loam"],
    lifecycle_stages: [
      { stage_name: "Sprouting", day_start: 0, day_end: 35, ideal_conditions: { min_temp: 25, max_temp: 32, max_days_without_water: 5 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Vegetative Phase", day_start: 36, day_end: 120, ideal_conditions: { min_temp: 25, max_temp: 32, max_days_without_water: 7 }, expected_growth: { min_height_cm: 16, max_height_cm: 60 } },
      { stage_name: "Rhizome Development", day_start: 121, day_end: 200, ideal_conditions: { min_temp: 22, max_temp: 30, max_days_without_water: 6 }, expected_growth: { min_height_cm: 61, max_height_cm: 80 } },
      { stage_name: "Maturation", day_start: 201, day_end: 240, ideal_conditions: { min_temp: 20, max_temp: 32, max_days_without_water: 15 }, expected_growth: { min_height_cm: 70, max_height_cm: 85 } }
    ]
  },
  {
    crop_name: "garlic", variety: "Yamuna Safed", region: "MP/Rajasthan", favorable_weather: "Cool during growth, dry during bulb maturation.", sowing_months: ["October", "November"], soil_type: ["Rich Loam", "Sandy Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 20, ideal_conditions: { min_temp: 12, max_temp: 25, max_days_without_water: 7 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vegetative Growth", day_start: 21, day_end: 70, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 10 }, expected_growth: { min_height_cm: 11, max_height_cm: 40 } },
      { stage_name: "Bulb Initiation", day_start: 71, day_end: 110, ideal_conditions: { min_temp: 18, max_temp: 28, max_days_without_water: 8 }, expected_growth: { min_height_cm: 41, max_height_cm: 60 } },
      { stage_name: "Maturation", day_start: 111, day_end: 140, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 20 }, expected_growth: { min_height_cm: 50, max_height_cm: 65 } }
    ]
  },
  {
    crop_name: "fenugreek", variety: "Pusa Early Bunching", region: "North India", favorable_weather: "Cool, frost tolerant. Grown for both leaves and seeds.", sowing_months: ["October", "November"], soil_type: ["Well-drained Loam", "Clay Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 10, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 5 }, expected_growth: { min_height_cm: 0, max_height_cm: 5 } },
      { stage_name: "Vegetative/Leaf Harvest", day_start: 11, day_end: 45, ideal_conditions: { min_temp: 15, max_temp: 25, max_days_without_water: 8 }, expected_growth: { min_height_cm: 6, max_height_cm: 30 } },
      { stage_name: "Flowering", day_start: 46, day_end: 75, ideal_conditions: { min_temp: 18, max_temp: 28, max_days_without_water: 10 }, expected_growth: { min_height_cm: 31, max_height_cm: 50 } },
      { stage_name: "Seed Maturation", day_start: 76, day_end: 100, ideal_conditions: { min_temp: 20, max_temp: 32, max_days_without_water: 15 }, expected_growth: { min_height_cm: 45, max_height_cm: 60 } }
    ]
  },
  {
    crop_name: "mint", variety: "Kosi", region: "UP/Punjab", favorable_weather: "Warm, sunny days. Requires frequent irrigation.", sowing_months: ["February", "March"], soil_type: ["Rich Loam", "Sandy Loam"],
    lifecycle_stages: [
      { stage_name: "Sprouting", day_start: 0, day_end: 20, ideal_conditions: { min_temp: 20, max_temp: 30, max_days_without_water: 4 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vegetative Spread", day_start: 21, day_end: 50, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 11, max_height_cm: 30 } },
      { stage_name: "First Cutting", day_start: 51, day_end: 80, ideal_conditions: { min_temp: 28, max_temp: 38, max_days_without_water: 5 }, expected_growth: { min_height_cm: 31, max_height_cm: 50 } },
      { stage_name: "Regrowth & Second Cut", day_start: 81, day_end: 120, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 30, max_height_cm: 50 } }
    ]
  },
  {
    crop_name: "lemongrass", variety: "Krishna", region: "Kerala/Assam", favorable_weather: "Warm, humid tropical. Highly drought tolerant once established.", sowing_months: ["June", "July"], soil_type: ["Well-drained Sandy", "Loam"],
    lifecycle_stages: [
      { stage_name: "Establishment", day_start: 0, day_end: 30, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 7 }, expected_growth: { min_height_cm: 0, max_height_cm: 30 } },
      { stage_name: "Tillering Phase", day_start: 31, day_end: 70, ideal_conditions: { min_temp: 28, max_temp: 38, max_days_without_water: 10 }, expected_growth: { min_height_cm: 31, max_height_cm: 80 } },
      { stage_name: "Grand Growth", day_start: 71, day_end: 100, ideal_conditions: { min_temp: 25, max_temp: 38, max_days_without_water: 15 }, expected_growth: { min_height_cm: 81, max_height_cm: 150 } },
      { stage_name: "First Harvest", day_start: 101, day_end: 120, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 15 }, expected_growth: { min_height_cm: 120, max_height_cm: 180 } }
    ]
  },
  {
    crop_name: "ashwagandha", variety: "Jawahar 20", region: "MP/Rajasthan", favorable_weather: "Late Kharif crop, highly drought resistant.", sowing_months: ["August", "September"], soil_type: ["Sandy Loam", "Red Soil"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vegetative Phase", day_start: 16, day_end: 60, ideal_conditions: { min_temp: 25, max_temp: 38, max_days_without_water: 15 }, expected_growth: { min_height_cm: 11, max_height_cm: 40 } },
      { stage_name: "Flowering & Fruiting", day_start: 61, day_end: 110, ideal_conditions: { min_temp: 20, max_temp: 35, max_days_without_water: 20 }, expected_growth: { min_height_cm: 41, max_height_cm: 80 } },
      { stage_name: "Root Maturation", day_start: 111, day_end: 160, ideal_conditions: { min_temp: 18, max_temp: 32, max_days_without_water: 30 }, expected_growth: { min_height_cm: 70, max_height_cm: 100 } }
    ]
  },

  // ==========================================
  // GOURDS & MELONS (SUMMER VINES)
  // ==========================================
  {
    crop_name: "bottle gourd", variety: "Pusa Naveen", region: "General", favorable_weather: "Warm and humid. Frost sensitive.", sowing_months: ["February", "March", "June", "July"], soil_type: ["Sandy Loam", "Rich Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 10, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Vine Growth", day_start: 11, day_end: 35, ideal_conditions: { min_temp: 28, max_temp: 38, max_days_without_water: 6 }, expected_growth: { min_height_cm: 16, max_height_cm: 100 } },
      { stage_name: "Flowering", day_start: 36, day_end: 55, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 101, max_height_cm: 250 } },
      { stage_name: "Fruiting & Harvesting", day_start: 56, day_end: 100, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 6 }, expected_growth: { min_height_cm: 200, max_height_cm: 400 } }
    ]
  },
  {
    crop_name: "bitter gourd", variety: "Pusa Do Mausami", region: "General", favorable_weather: "Warm climate. Susceptible to waterlogging.", sowing_months: ["February", "March", "June", "July"], soil_type: ["Well-drained Sandy Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 12, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vine Extension", day_start: 13, day_end: 40, ideal_conditions: { min_temp: 25, max_temp: 38, max_days_without_water: 6 }, expected_growth: { min_height_cm: 11, max_height_cm: 150 } },
      { stage_name: "Flowering", day_start: 41, day_end: 60, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 151, max_height_cm: 250 } },
      { stage_name: "Continuous Harvesting", day_start: 61, day_end: 110, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 200, max_height_cm: 300 } }
    ]
  },
  {
    crop_name: "cucumber", variety: "Pusa Uday", region: "General", favorable_weather: "Warm weather. Requires high soil moisture during fruiting.", sowing_months: ["February", "March", "June", "July"], soil_type: ["Sandy Loam", "Rich Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 10, ideal_conditions: { min_temp: 22, max_temp: 32, max_days_without_water: 4 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Vine Development", day_start: 11, day_end: 30, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 16, max_height_cm: 80 } },
      { stage_name: "Flowering", day_start: 31, day_end: 50, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 4 }, expected_growth: { min_height_cm: 81, max_height_cm: 150 } },
      { stage_name: "Fruiting", day_start: 51, day_end: 90, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 4 }, expected_growth: { min_height_cm: 150, max_height_cm: 250 } }
    ]
  },
  {
    crop_name: "pumpkin", variety: "Arka Suryamukhi", region: "General", favorable_weather: "Long, warm growing season.", sowing_months: ["February", "March", "June", "July"], soil_type: ["Sandy Loam", "Clay Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 15, ideal_conditions: { min_temp: 25, max_temp: 32, max_days_without_water: 5 }, expected_growth: { min_height_cm: 0, max_height_cm: 15 } },
      { stage_name: "Vine Growth", day_start: 16, day_end: 45, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 7 }, expected_growth: { min_height_cm: 16, max_height_cm: 150 } },
      { stage_name: "Flowering", day_start: 46, day_end: 75, ideal_conditions: { min_temp: 25, max_temp: 32, max_days_without_water: 6 }, expected_growth: { min_height_cm: 151, max_height_cm: 300 } },
      { stage_name: "Fruit Maturation", day_start: 76, day_end: 120, ideal_conditions: { min_temp: 22, max_temp: 35, max_days_without_water: 10 }, expected_growth: { min_height_cm: 250, max_height_cm: 400 } }
    ]
  },
  {
    crop_name: "watermelon", variety: "Sugar Baby", region: "UP/Rajasthan", favorable_weather: "Hot, dry weather. Excess humidity causes disease.", sowing_months: ["February", "March"], soil_type: ["Sandy", "Light Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 12, ideal_conditions: { min_temp: 25, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vine Extension", day_start: 13, day_end: 40, ideal_conditions: { min_temp: 28, max_temp: 40, max_days_without_water: 7 }, expected_growth: { min_height_cm: 11, max_height_cm: 150 } },
      { stage_name: "Flowering & Fruit Set", day_start: 41, day_end: 65, ideal_conditions: { min_temp: 28, max_temp: 38, max_days_without_water: 5 }, expected_growth: { min_height_cm: 151, max_height_cm: 250 } },
      { stage_name: "Fruit Development", day_start: 66, day_end: 95, ideal_conditions: { min_temp: 25, max_temp: 40, max_days_without_water: 10 }, expected_growth: { min_height_cm: 200, max_height_cm: 300 } }
    ]
  },
  {
    crop_name: "muskmelon", variety: "Pusa Sharbati", region: "Punjab/UP", favorable_weather: "Hot and dry air, high sunshine hours.", sowing_months: ["February", "March"], soil_type: ["Well-drained Sandy", "Light Loam"],
    lifecycle_stages: [
      { stage_name: "Germination", day_start: 0, day_end: 10, ideal_conditions: { min_temp: 25, max_temp: 32, max_days_without_water: 5 }, expected_growth: { min_height_cm: 0, max_height_cm: 10 } },
      { stage_name: "Vegetative Phase", day_start: 11, day_end: 35, ideal_conditions: { min_temp: 28, max_temp: 38, max_days_without_water: 6 }, expected_growth: { min_height_cm: 11, max_height_cm: 120 } },
      { stage_name: "Flowering", day_start: 36, day_end: 55, ideal_conditions: { min_temp: 28, max_temp: 35, max_days_without_water: 5 }, expected_growth: { min_height_cm: 121, max_height_cm: 200 } },
      { stage_name: "Fruit Ripening", day_start: 56, day_end: 85, ideal_conditions: { min_temp: 28, max_temp: 40, max_days_without_water: 10 }, expected_growth: { min_height_cm: 180, max_height_cm: 250 } }
    ]
  }
];

async function seedDatabase() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGODB_URI is not defined in the environment variables.");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    console.log("Clearing existing crop data to prevent duplicates...");
    await CropProfile.deleteMany({}); 

    console.log(`Inserting ${cropData.length} highly detailed crop profiles...`);
    await CropProfile.insertMany(cropData);

    console.log("Database seeded successfully with crop profiles and sowing months!");
    process.exit(0); 
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); 
  }
}

seedDatabase();
