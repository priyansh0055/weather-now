import React, { useState, useEffect } from "react";
import axios from "axios";

export default function WEATHER({ initialCity }) {
  const [city, setcity] = useState(initialCity || "");
  const [weather, setweather] = useState();
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");

  const handlecitychange = (event) => {
    setcity(event.target.value);
  };

  const fetchweather = async (cityToFetch) => {
    setloading(true);
    seterror("");
    setweather(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityToFetch}&appid=${process.env.REACT_APP_WEATHER_KEY}`,
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

  const processcity = () => {
    if (!city.trim()) {
      setweather(null);
      seterror("Please enter a city name.");
      return;
    }
    fetchweather(city);
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
    <div className="weather-container">
      <input
        type="text"
        placeholder="enter your city name"
        value={city}
        onChange={handlecitychange}
      />
      <button onClick={processcity}> get weather </button>
      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {weather && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <p>Temperature: {(weather.main.temp - 273.15).toFixed(1)} °C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Condition: {weather.weather[0].main}</p>
        </div>
      )}
    </div>
  );
}