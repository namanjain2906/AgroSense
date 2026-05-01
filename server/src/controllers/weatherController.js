import Farm from "../models/farmModel.js";
import { getCurrentWeather } from "../services/weatherService.js";

export const getMyWeather = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      owner: req.user._id,
      is_active: true,
    });

    if (!farm || !farm.location) {
      return res.status(404).json({ message: "Farm location not found" });
    }

    // Convert farm.location (which has city, state, country) into a string
    // OpenWeather API works very well with "City, Country" or "City, State, Country"
    let locationQuery = farm.location.city;
    if (farm.location.state) locationQuery += `, ${farm.location.state}`;
    if (farm.location.country) locationQuery += `, ${farm.location.country}`;

    // If coordinates exist, weatherService handles an object with { coordinates: { lat, lon } }
    const locationParam = farm.location.coordinates?.lat 
      ? { coordinates: farm.location.coordinates } 
      : locationQuery;

    const weather = await getCurrentWeather(locationParam);

    return res.status(200).json({ weather });
  } catch (error) {
    console.error("Error fetching weather:", error);
    return res.status(500).json({ message: "Error fetching weather data" });
  }
};
