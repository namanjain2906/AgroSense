import React, { useState, useEffect } from "react";
import CropCard from "../components/CropCard";
import axios from "axios";

const Crops = () => {
  const [crops, setCrops] = useState([]);

  const getCrops = async () => {
    try {
      const { data } = await axios.get("https://agrosense-server.vercel.app/api/crops/cropdata");

      if (data.success) {
        setCrops(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCrops();
  }, []);

  return (
    <div className="w-full min-h-screen py-25 px-2 sm:px-6 md:px-16 lg:px-36">
      {crops.map((crop) => (
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
