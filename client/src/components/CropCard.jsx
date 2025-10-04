import React from "react";
import { toast } from 'react-hot-toast';

const CropCard = ({ CropImage,CropName,CropType, CropDescription, SoilType,OptimalSoilPH, MinimumTemp, MaximumTemp, MinimumRainfall, CommonPests, CommonDiseases}) => {
  return (
  <div className="flex flex-col sm:flex-row mb-10 w-full rounded-xl p-3 sm:p-5  border-2 border-green-900">
      <img
        className="object-contain h-40 sm:h-55 w-full sm:w-1/2 rounded-xl"
        src={CropImage}
        alt="crop image"
      />
      <div className="flex flex-col gap-2 m-3 sm:m-5 w-full">
        <p className="text-lg sm:text-2xl font-bold text-green-900">{CropName}</p>
        <p className="text-sm sm:text-base text-green-700 font-semibold">Crop Type: <span className="text-black font-normal">{CropType}</span></p>
        <div>
          <span className="text-sm sm:text-base mr-2 text-green-700 font-semibold">Minimum Temperature: <span className="text-black font-normal">{MinimumTemp}</span></span>
          <span className="text-sm sm:text-base mr-2 text-green-700 font-semibold">Maximum Temperature: <span className="text-black font-normal">{MaximumTemp}</span></span>
        </div>
        <div>
          <span className="text-sm sm:text-base mr-2 text-green-700 font-semibold">Soil Type: <span className="text-black font-normal">{SoilType}</span></span>
          <span className="text-sm sm:text-base mr-2 text-green-700 font-semibold">Optimal Soil pH: <span className="text-black font-normal">{OptimalSoilPH}</span></span>
        </div>
        <p className="text-xs sm:text-base text-black">{CropDescription}</p>
      </div>
    </div>
  );
};

export default CropCard;
