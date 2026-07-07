import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherResultScreen from "./WeatherResultScreen";

export default function WEATHER({ initialCity , onBack}) {
  const [, setcity] = useState(initialCity || "");
  const [weather, setweather] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [unit, setunit] = useState("metric"); // 'metric' = °C, 'imperial' = °F


  const fetchweather = async (cityToFetch, unitToUse = unit) => {
    setloading(true);
    seterror("");
    setweather(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: cityToFetch,
            appid: process.env.REACT_APP_WEATHER_KEY,
            units: unitToUse, // now asking OWM for °C/°F directly, no more manual Kelvin math
          },
        }
      );
      setweather(response.data);
      seterror("");
    } catch (error) {
      console.log("error fetching weather data ", error);
      setweather(null);
      seterror("Couldn't find that city. Check the spelling and try again.");
    } finally {
      setloading(false);
    }
  };

  const handletoggleunit = () => {
    const nextunit = unit === "metric" ? "imperial" : "metric";
    setunit(nextunit);
    if (weather?.name) {
      fetchweather(weather.name, nextunit);
    }
  };

  // Auto-fetch when a city arrives from WeatherSearchScreen
  useEffect(() => {
    if (initialCity && initialCity.trim()) {
      setcity(initialCity);
      fetchweather(initialCity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCity]);

  return (
    <WeatherResultScreen
      data={weather}
      loading={loading}
      error={error}
      unit={unit}
      onToggleUnit={handletoggleunit}
     onBack={() => {
    setweather(null);
    setcity("");
    seterror("");
    onBack?.();
}}
    />
  );
} 