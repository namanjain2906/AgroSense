import mongoose from "mongoose";
const cropdataSchema=new mongoose.Schema({
    cropType:{type:String,required:true}, //rabi, kharif, zaid,etc.
    imageLink:{type:String}, // link to an image of the crop
    cropName:{type:String,required:true},
    soilType:{type:String,required:true}, //loamy, sandy, clayey, silty, peaty, chalky
    description:{type:String}, // brief description about the crop in about 30-40 words
    optimalSoilPH:{type:Number,required:true}, 
    minimumTemp:{type:Number,required:true}, // in Celsius
    maximumTemp:{type:Number,required:true}, // in Celsius
    minimumHumidity:{type:Number,required:true}, // in percentage
    maximumHumidity:{type:Number,required:true}, // in percentage
    optimalSunlightHours:{type:Number,required:true}, // in hours per day
    minimumRainfall:{type:Number,required:true}, // in mm per month
    maximumRainfall:{type:Number,required:true}, // in mm per month
    commonPests:{type:[String]}, // array of pest names
    commonDiseases:{type:[String]}, // array of disease names
    price:{type:Number} // in Rupees per kg
});

const Cropdata=mongoose.model('Cropdata',cropdataSchema);
export default Cropdata;