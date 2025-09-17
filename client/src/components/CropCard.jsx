import React from "react";

const CropCard = ({ CropImage,CropName,CropType, CropDescription, SoilType,OptimalSoilPH, MinimumTemp, MaximumTemp, MinimumRainfall, CommonPests, CommonDiseases}) => {
  return (
  <div className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 flex flex-col sm:flex-row mb-10 w-full rounded-xl p-3 sm:p-5 shadow-xl border border-green-900">
      <img
        className="object-contain h-40 sm:h-55 w-full sm:w-1/2 rounded-xl"
        src={CropImage}
        alt="crop image"
      />
      <div className="flex flex-col gap-2 m-3 sm:m-5 w-full">
        <p className="text-lg sm:text-2xl font-bold text-green-300">{CropName}</p>
        <p className="text-sm sm:text-base text-green-200">Crop Type: {CropType}</p>
        <div>
          <span className="text-sm sm:text-base mr-2 text-green-100">Minimum Temperature: {MinimumTemp}</span>
          <span className="text-sm sm:text-base mr-2 text-green-100">Maximum Temperature: {MaximumTemp}</span>
        </div>
        <div>
          <span className="text-sm sm:text-base mr-2 text-green-100">Soil Type: {SoilType}</span>
          <span className="text-sm sm:text-base mr-2 text-green-100">Optimal Soil pH: {OptimalSoilPH}</span>
        </div>
        <p className="text-xs sm:text-base text-green-100">{CropDescription}</p>
      </div>
    </div>
  );
};

export default CropCard;
