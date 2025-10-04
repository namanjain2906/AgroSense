import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

axios.defaults.baseURL = "https://agrosense-server.vercel.app/api";
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [crops, setCrops] = useState([]);
  const [allCrops, setAllCrops] = useState([]);
  const [farmDetails, setFarmDetails] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (token) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, [token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const fetchCrops = async () => {
    try {
      const { data } = await axios.get("/crops/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.crops) {
        setCrops(data.crops);
      } else {
        toast.error(data.error || "Failed to load crops");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllCrops = async () => {
    try {
      const { data } = await axios.get("/crops/cropdata");
      if (data.success) {
        setAllCrops(data.message);
      }
    } catch (err) {
      // handle error
    }
  };

  const fetchFarmDetails = async () => {
    try {
      const { data } = await axios.get("/myfarm/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data && data.location) {
        setFarmDetails(data);
      } else {
        toast.error(data.error || "Failed to load farm details");
      }
    } catch (err) {
      if (err.response?.status !== 404) toast.error("Error loading farm details");
    }
  };

  const fetchWeatherData = async () => {
    try {
      if (farmDetails && farmDetails.location) {
        let weatherUrl = '';
        const location = farmDetails.location;
        if (/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(location)) {
          const [lat, lon] = location.split(',').map(Number);
          weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_OPENWEATHERMAP_API_KEY}&units=metric`;
        } else {
          weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${import.meta.env.VITE_OPENWEATHERMAP_API_KEY}&units=metric`;
        }
        const { data } = await axios.get(weatherUrl);
        setWeatherData(data);
      }
    } catch (err) {
      if (err.response?.status !== 404) toast.error("Error loading weather data");
    }
  };

  useEffect(() => {
    if (token) {
      fetchCrops();
      fetchFarmDetails();
    }
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if (farmDetails) {
      fetchWeatherData();
    }
    // eslint-disable-next-line
  }, [farmDetails]);

  useEffect(() => {
    fetchAllCrops();
    // eslint-disable-next-line
  }, []);

  // Compute current crops and past crops from crops array
  const today = dayjs();
  const currentCrops = crops.filter((crop) => {
    const sowing = crop.sowingDate ? dayjs(crop.sowingDate) : null;
    const harvest = crop.harvestDate ? dayjs(crop.harvestDate) : null;
    return (
      sowing &&
      harvest &&
      today.isAfter(sowing) &&
      today.isBefore(harvest)
    );
  });

  const pastCrops = crops.filter((crop) => {
    const harvest = crop.harvestDate ? dayjs(crop.harvestDate) : null;
    return harvest && today.isAfter(harvest);
  });

  const value = {
    user,
    token,
    login,
    logout,
    crops,
    fetchCrops,
    farmDetails,
    fetchFarmDetails,
    currentCrops,
    pastCrops,
    weatherData,
    fetchWeatherData,
    allCrops,
    fetchAllCrops,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

