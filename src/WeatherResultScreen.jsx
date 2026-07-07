import React, { useMemo, useState, useEffect } from "react";
import "./WeatherResultScreen.css";

/**
 * WeatherResultScreen
 * ---------------------------------------------------------------
 * Presentational screen shown after a city is searched/selected.
 * Consumes a raw OpenWeatherMap "current weather" response object
 * (the exact shape returned by /data/2.5/weather) and renders a
 * cinematic sky scene (sun/moon arc + live weather effects) behind
 * a glass stats card.
 *
 * Props:
 *  - data      : OpenWeatherMap current-weather response (required)
 *  - unit      : 'metric' | 'imperial'  (default 'metric')
 *  - onBack    : () => void   called when the user taps back/close
 *  - onToggleUnit : () => void  optional, shown as a °C/°F pill if passed
 *  - loading   : bool  optional external loading flag
 *  - error     : string optional external error message
 */

const WEATHER_GROUP = {
  Thunderstorm: "storm",
  Drizzle: "rain",
  Rain: "rain",
  Snow: "snow",
  Mist: "fog",
  Smoke: "fog",
  Haze: "fog",
  Dust: "fog",
  Fog: "fog",
  Sand: "fog",
  Ash: "fog",
  Squall: "rain",
  Tornado: "storm",
  Clear: "clear",
  Clouds: "clouds",
};

function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// Returns 0..1 progress of the sun/moon across its arc, and whether it's "day"
function useCelestial(data, now) {
  return useMemo(() => {
    if (!data || !data.sys) {
      return { progress: 0.5, isDay: true };
    }
    const { sunrise, sunset } = data.sys;
    const tzOffsetSec = data.timezone ?? 0;
    const currentUtc = now / 1000;
    const localNow = currentUtc + tzOffsetSec;

    if (!sunrise || !sunset) return { progress: 0.5, isDay: true };

    if (localNow >= sunrise && localNow <= sunset) {
      const progress = (localNow - sunrise) / (sunset - sunrise);
      return { progress: Math.min(Math.max(progress, 0), 1), isDay: true };
    }
    // Night: map from sunset -> next sunrise (approximate with 12h night)
    const nightLength = 12 * 3600;
    let intoNight;
    if (localNow > sunset) {
      intoNight = localNow - sunset;
    } else {
      intoNight = localNow + (24 * 3600 - sunset);
    }
    const progress = Math.min(Math.max(intoNight / nightLength, 0), 1);
    return { progress, isDay: false };
  }, [data, now]);
}

function formatTime(unixSeconds, tzOffsetSeconds) {
  if (!unixSeconds) return "--:--";
  const d = new Date((unixSeconds + tzOffsetSeconds) * 1000);
  let h = d.getUTCHours();
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

function degToCompass(deg) {
  if (deg === undefined || deg === null) return "--";
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

export default function WeatherResultScreen({
  data,
  unit = "metric",
  onBack,
  onToggleUnit,
  loading = false,
  error = "",
}) {
  const now = useNow();
  const { progress, isDay } = useCelestial(data, now);

  const group = data?.weather?.[0]?.main ? WEATHER_GROUP[data.weather[0].main] || "clouds" : "clear";
  const sceneClass = isDay ? `wr-scene-day wr-${group}` : `wr-scene-night wr-${group}`;
  const unitSymbol = unit === "imperial" ? "°F" : "°C";
  const speedUnit = unit === "imperial" ? "mph" : "m/s";
  const tzOffset = data?.timezone ?? 0;

  // Arc position: simple parabola across the sky panel
  const arcX = 8 + progress * 84; // percent
  const arcY = 78 - Math.sin(progress * Math.PI) * 62; // percent, dips at edges

  const cloudSeeds = useMemo(() => [0, 1, 2, 3].map((i) => ({
    id: i,
    top: 10 + i * 14 + ((i * 7) % 11),
    duration: 38 + i * 9,
    delay: -i * 6,
    scale: 0.7 + (i % 3) * 0.25,
  })), []);

  const rainDrops = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: (i * 2.5) % 100,
    delay: (i % 20) * 0.1,
    duration: 0.6 + (i % 5) * 0.08,
  })), []);

  const snowFlakes = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: (i * 3.3) % 100,
    delay: (i % 15) * 0.4,
    duration: 8 + (i % 6),
    size: 3 + (i % 4),
  })), []);

  const stars = useMemo(() => Array.from({ length: 45 }, (_, i) => ({
    id: i,
    top: (i * 13) % 60,
    left: (i * 37) % 100,
    delay: (i % 10) * 0.3,
    size: 1 + (i % 3),
  })), []);

  if (loading) {
    return (
      <div className="wr-root wr-scene-day wr-clear">
        <div className="wr-loading">
          <div className="wr-loading-spinner" />
          <p>Fetching skies…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="wr-root wr-scene-night wr-clouds">
        <div className="wr-error-card">
          <span className="wr-error-icon">⚠</span>
          <h2>Couldn't find that sky</h2>
          <p>{error || "Something went wrong fetching this city's weather."}</p>
          {onBack && (
            <button className="wr-back-btn" onClick={onBack}>← Try another city</button>
          )}
        </div>
      </div>
    );
  }

  const cityName = data.name || "Unknown";
  const country = data.sys?.country || "";
  const temp = Math.round(data.main?.temp ?? 0);
  const feelsLike = Math.round(data.main?.feels_like ?? 0);
  const description = data.weather?.[0]?.description || "";
  const humidity = data.main?.humidity ?? "--";
  const windSpeed = data.wind?.speed ?? "--";
  const windDeg = data.wind?.deg;
  const pressure = data.main?.pressure ?? "--";
  const visibility = data.visibility != null ? (data.visibility / 1000).toFixed(1) : "--";
  const sunrise = formatTime(data.sys?.sunrise, tzOffset);
  const sunset = formatTime(data.sys?.sunset, tzOffset);
  const tempMin = Math.round(data.main?.temp_min ?? temp);
  const tempMax = Math.round(data.main?.temp_max ?? temp);

  return (
    <div className={`wr-root ${sceneClass}`}>
      {/* ---------- Sky layer ---------- */}
      <div className="wr-sky">
        {!isDay &&
          stars.map((s) => (
            <span
              key={s.id}
              className="wr-star"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}

        <div
          className={`wr-celestial ${isDay ? "wr-sun" : "wr-moon"}`}
          style={{ left: `${arcX}%`, top: `${arcY}%` }}
        />

        {(group === "clouds" || group === "rain" || group === "storm" || group === "fog") &&
          cloudSeeds.map((c) => (
            <span
              key={c.id}
              className="wr-cloud"
              style={{
                top: `${c.top}%`,
                animationDuration: `${c.duration}s`,
                animationDelay: `${c.delay}s`,
                transform: `scale(${c.scale})`,
              }}
            />
          ))}

        {(group === "rain" || group === "storm") && (
          <div className="wr-rain-layer">
            {rainDrops.map((r) => (
              <span
                key={r.id}
                className="wr-raindrop"
                style={{
                  left: `${r.left}%`,
                  animationDelay: `${r.delay}s`,
                  animationDuration: `${r.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        {group === "storm" && <div className="wr-lightning" />}

        {group === "snow" && (
          <div className="wr-snow-layer">
            {snowFlakes.map((s) => (
              <span
                key={s.id}
                className="wr-snowflake"
                style={{
                  left: `${s.left}%`,
                  width: s.size,
                  height: s.size,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        {group === "fog" && <div className="wr-fog-layer" />}

        <div className="wr-horizon" />
      </div>

      {/* ---------- Top bar ---------- */}
      <div className="wr-topbar">
        {onBack && (
          <button className="wr-icon-btn" onClick={onBack} aria-label="Back to search">
            ←
          </button>
        )}
        {onToggleUnit && (
          <button className="wr-unit-pill" onClick={onToggleUnit}>
            {unitSymbol}
          </button>
        )}
      </div>

      {/* ---------- Glass stats card ---------- */}
      <div className="wr-card">
        <div className="wr-card-header">
          <h1 className="wr-city">
            {cityName}
            {country && <span className="wr-country">, {country}</span>}
          </h1>
          <p className="wr-desc">{description}</p>
        </div>

        <div className="wr-temp-row">
          <span className="wr-temp">{temp}°</span>
          <div className="wr-temp-meta">
            <span>Feels like {feelsLike}{unitSymbol}</span>
            <span className="wr-minmax">
              H:{tempMax}° L:{tempMin}°
            </span>
          </div>
        </div>

        <div className="wr-stats-grid">
          <div className="wr-stat">
            <span className="wr-stat-label">Humidity</span>
            <span className="wr-stat-value">{humidity}%</span>
          </div>
          <div className="wr-stat">
            <span className="wr-stat-label">Wind</span>
            <span className="wr-stat-value">{windSpeed} {speedUnit} {degToCompass(windDeg)}</span>
          </div>
          <div className="wr-stat">
            <span className="wr-stat-label">Pressure</span>
            <span className="wr-stat-value">{pressure} hPa</span>
          </div>
          <div className="wr-stat">
            <span className="wr-stat-label">Visibility</span>
            <span className="wr-stat-value">{visibility} km</span>
          </div>
          <div className="wr-stat">
            <span className="wr-stat-label">Sunrise</span>
            <span className="wr-stat-value">{sunrise}</span>
          </div>
          <div className="wr-stat">
            <span className="wr-stat-label">Sunset</span>
            <span className="wr-stat-value">{sunset}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
