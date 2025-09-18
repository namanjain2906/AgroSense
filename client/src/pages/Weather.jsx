import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Weather = () => {
  const { token } = useContext(AuthContext);
  const [farm, setFarm] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFarmAndWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get user's farm info
          const farmRes = await axios.get('https://agrosense-server.vercel.app/api/myfarm/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarm(farmRes.data);
        // Get weather for farm location
        const location = farmRes.data.location;
        // If location is a city name, use q=city; if lat/lon, parse and use lat/lon
        let weatherUrl = '';
        if (/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(location)) {
          // Location is "lat,lon"
          const [lat, lon] = location.split(',').map(Number);
          weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHERMAP_API_KEY}&units=metric`;
        } else {
          // Assume city name
          weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${import.meta.env.VITE_OPENWEATHERMAP_API_KEY}&units=metric`;
        }
        const weatherRes = await axios.get(weatherUrl);
        setWeather(weatherRes.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
      setLoading(false);
    };
    if (token) fetchFarmAndWeather();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101613] px-2 sm:px-6 md:px-16 lg:px-36">
      <div className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 rounded-xl p-6 shadow-xl w-full max-w-md text-center border border-green-900">
        <h2 className="text-xl font-bold mb-2 text-green-200">Current Weather</h2>
        {loading && <div className="text-lg text-green-100">Loading...</div>}
        {error && <div className="text-green-400">{error}</div>}
        {farm && (
          <div className="mb-4">
            <div className="font-semibold text-green-300">Farm Location:</div>
            <div className="text-green-100">{farm.location}</div>
          </div>
        )}
        {weather && (
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl font-bold text-green-200">{weather.name || farm.location}</div>
            <div className="text-4xl text-green-100">{Math.round(weather.main.temp)}°C</div>
            <div className="capitalize text-green-300">{weather.weather[0].description}</div>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" className="mx-auto" />
            <div className="text-green-200">Humidity: {weather.main.humidity}%</div>
            <div className="text-green-200">Wind: {Math.round(weather.wind.speed)} m/s</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather