import React from "react";
import CropCard from "../components/CropCard";
import { useAppContext } from "../context/AppContext.jsx";

const Crops = () => {
  const { allCrops } = useAppContext(); // Use allCrops for crop details

  return (
    <div className="w-full min-h-screen py-25 px-2 sm:px-6 md:px-16 lg:px-36">
      {allCrops &&
        allCrops.map((crop) => (
          <CropCard
            key={crop._id}
            CropName={crop.cropName}
            CropImage={crop.imageLink}
            CropType={crop.cropType}
            CropDescription={crop.description}
            SoilType={crop.soilType}
            OptimalSoilPH={crop.optimalSoilPH}
            MinimumRainfall={crop.minimumRainfall}
            MinimumTemp={crop.minimumTemp}
            MaximumTemp={crop.maximumTemp}
            CommonDiseases={crop.commonDiseases}
            CommonPests={crop.commonPests}
          />
        ))}
    </div>
  );
};

export default Crops;

