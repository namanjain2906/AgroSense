import axios from "axios";
import NodeCache from "node-cache";

const WEATHER_CACHE_TTL_SECONDS = 3 * 60 * 60;
const OPEN_WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

const weatherCache = new NodeCache({
  stdTTL: WEATHER_CACHE_TTL_SECONDS,
  checkperiod: 15 * 60,
});

const normalizeLocationKey = (location) => {
  if (typeof location === "string") {
    return location.trim().toLowerCase();
  }

  const lat = Number(location?.coordinates?.lat);
  const lon = Number(location?.coordinates?.lon);

  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    return `${lat},${lon}`;
  }

  if (location?.name) {
    return location.name.trim().toLowerCase();
  }

  if (location?.city) {
    let locStr = location.city.trim();
    if (location.state) locStr += `, ${location.state.trim()}`;
    if (location.country) locStr += `, ${location.country.trim()}`;
    return locStr.toLowerCase();
  }

  return "";
};

const buildLocationParams = (location) => {
  if (typeof location === "string") {
    return { q: location.trim() };
  }

  const lat = Number(location?.coordinates?.lat);
  const lon = Number(location?.coordinates?.lon);

  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    return {
      lat,
      lon,
    };
  }

  if (location?.name) {
    return { q: location.name.trim() };
  }

  if (location?.city) {
    let locStr = location.city.trim();
    if (location.state) locStr += `, ${location.state.trim()}`;
    if (location.country) locStr += `, ${location.country.trim()}`;
    return { q: locStr };
  }

  return null;
};

const hasRainTomorrow = (forecastList = []) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().slice(0, 10);

  return forecastList.some((item) => {
    const forecastDate = item.dt_txt?.slice(0, 10);
    const rainVolume = item.rain?.["3h"] || item.rain?.["1h"] || 0;
    const weatherMain = item.weather?.[0]?.main?.toLowerCase();

    return (
      forecastDate === tomorrowDate &&
      (rainVolume > 0 || weatherMain === "rain" || weatherMain === "drizzle")
    );
  });
};

const getOpenWeatherApiKey = () => {
  if (!process.env.OPENWEATHER_API_KEY) {
    throw new Error("OPENWEATHER_API_KEY is not defined in environment variables.");
  }

  return process.env.OPENWEATHER_API_KEY;
};

export const getWeatherForLocation = async (location) => {
  const cacheKey = normalizeLocationKey(location);
  const locationParams = buildLocationParams(location);

  if (!cacheKey || !locationParams) {
    throw new Error("A valid location is required to fetch weather data.");
  }

  const cachedWeather = weatherCache.get(cacheKey);
  if (cachedWeather) {
    return cachedWeather;
  }

  const apiKey = getOpenWeatherApiKey();
  const requestParams = {
    ...locationParams,
    appid: apiKey,
    units: "metric",
  };

  const [currentResponse, forecastResponse] = await Promise.all([
    axios.get(`${OPEN_WEATHER_BASE_URL}/weather`, { params: requestParams }),
    axios.get(`${OPEN_WEATHER_BASE_URL}/forecast`, { params: requestParams }),
  ]);

  const weather = {
    current_temp: currentResponse.data?.main?.temp,
    humidity: currentResponse.data?.main?.humidity,
    forecast_rain_tomorrow_bool: hasRainTomorrow(forecastResponse.data?.list),
    description: currentResponse.data?.weather?.[0]?.description,
    icon: currentResponse.data?.weather?.[0]?.icon,
  };

  if (
    !Number.isFinite(weather.current_temp) ||
    !Number.isFinite(weather.humidity)
  ) {
    throw new Error("OpenWeatherMap returned incomplete weather data.");
  }

  weatherCache.set(cacheKey, weather);
  return weather;
};

export const getCurrentWeather = async (location) => {
  const weather = await getWeatherForLocation(location);

  return {
    current_temp: weather.current_temp,
    humidity: weather.humidity,
    forecast_rain_tomorrow: weather.forecast_rain_tomorrow_bool,
    description: weather.description,
    icon: weather.icon,
  };
};
