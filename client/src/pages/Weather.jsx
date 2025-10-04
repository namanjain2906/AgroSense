import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const Weather = () => {
  const { farmDetails, weatherData, token } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("You must be logged in to view weather data");
      navigate("/login");
    } else if (!farmDetails) {
      toast.error("Please add your farm details first");
      navigate("/farm-details");
    }
  }, [token, farmDetails, navigate]);

  return (
    <div className="min-h-screen flex pt-25 items-center justify-center px-2 sm:px-6 md:px-16 lg:px-36">
      <div className=" p-6 w-full max-w-md text-center rounded-xl border-2 ">
        <h2 className="text-xl font-bold mb-2 ">Current Weather</h2>
        {!farmDetails && <div className="text-lg ">Loading farm details...</div>}
        {!weatherData && <div className="text-lg ">Loading weather...</div>}
        {farmDetails && (
          <div className="mb-4">
            <div className="font-semibold ">Farm Location:</div>
            <div className="">{farmDetails.location}</div>
          </div>
        )}
        {weatherData && (
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl font-bold ">{weatherData.name || (farmDetails && farmDetails.location)}</div>
            <div className="text-4xl ">{Math.round(weatherData.main.temp)}°C</div>
            <div className="capitalize ">{weatherData.weather[0].description}</div>
            <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="weather icon" className="mx-auto" />
            <div className="">Humidity: {weatherData.main.humidity}%</div>
            <div className="">Wind: {Math.round(weatherData.wind.speed)} m/s</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;