import mongoose from "mongoose";
const cropsSchema=new mongoose.Schema({
    farmerId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    name:{type:String,required:true},
    type:{type:String,required:true},
    season:{type:String,required:true},
    duration:{type:Number,required:true}, // in days
    soilType:{type:String,required:true},
    lastWatered:{type:Date},
    yield:{type:Number}, // in kg
    sowingDate:{type:Date,required:true},
    harvestDate:{type:Date},
    revenue:{type:Number}, // in Rupees
    fertilizersUsed:[{type:String}], // array of fertilizer names
    pesticidesUsed:[{type:String}], // array of pesticide names
    status:{type:String,enum:['Planted','Growing','Harvested'],default:'Planted'}
});

const Crops=mongoose.model('Crops',cropsSchema);
export default Crops;