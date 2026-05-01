import mongoose from "mongoose";

const farmSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    location: {
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        country: { type: String, default: "India", trim: true },
        coordinates: {
            lat: { type: Number, min: -90, max: 90 },
            lon: { type: Number, min: -180, max: 180 }
        }
    },
    size: { type: Number, required: true, min: 0 },
    size_unit: { type: String, enum: ["acre", "hectare", "sqm"], default: "acre" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fields: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FarmerField' }],
    soil_type: { type: String, trim: true },
    irrigation_source: { type: String, trim: true },
    is_active: { type: Boolean, default: true },
}, { timestamps: true }); 

const Farm = mongoose.model('Farm', farmSchema);
export default Farm;
