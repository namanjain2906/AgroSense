import mongoose from "mongoose";

const myfarmSchema=new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmName: { type: String, required: true },
    location: { type: String, required: true },
    size: { type: Number, required: true }, // in acres
    soilType: { type: String, required: true },
    irrigationType: { type: String, required: true },
});

const Myfarm=mongoose.model('Myfarm',myfarmSchema);
export default Myfarm;