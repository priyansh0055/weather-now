# 🌦️ WeatherNow

A React weather app with a cinematic, glassmorphic landing screen — animated skyline scenes, a breathing search bar, and quick-select city chips — that hands off into a live weather dashboard powered by the OpenWeatherMap API.

## ✨ Features

- **Cinematic landing screen** — four CSS/SVG skyline scenes (Mumbai, Tokyo, New York, Reykjavik) cross-fade on a loop with a subtle Ken Burns zoom
- **Glassmorphic search bar** with a breathing glow animation
- **Quick-select city chips** for popular Indian cities
- **Live weather lookup** by city name via the OpenWeatherMap API
- **Seamless handoff** from search screen to dashboard, with the selected city auto-fetched on arrival

## 🛠️ Tech Stack

| Layer | Tool |
|---|---|
| Framework | React (Create React App) |
| HTTP client | Axios |
| Styling | Custom CSS (scoped with a `wn-` prefix) |
| Weather data | [OpenWeatherMap API](https://openweathermap.org/api) |

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- npm
- A free API key from [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)

### Installation

```bash
# Clone the repo
git clone https://github.com/priyansh0055/weather-now.git
cd weather-now

# Install dependencies
npm install

# Axios is used by the app but isn't currently pinned in package.json —
# install it explicitly if `npm install` doesn't pull it in
npm install axios
```

### Environment variables

Create a `.env` file in the project root:

```
REACT_APP_WEATHER_KEY=your_openweathermap_api_key_here
```

> ⚠️ **Security note:** this repo currently has a real API key committed in `.env`, and `.gitignore` only excludes `.env.local`/`.env.*.local` variants — not `.env` itself. It's worth rotating that key on OpenWeatherMap and adding `.env` to `.gitignore` so future keys stay private.

### Run locally

```bash
npm start
```

Open [https://weather-now-coral-six.vercel.app/] to view it in the browser. The page reloads automatically on changes.

### Build for production

```bash
npm run build
```

## 📁 Project Structure

```
weather-now/
├── public/
├── src/
│   ├── App.jsx                    # Top-level state: toggles between search screen and dashboard
│   ├── WeatherSearchScreen.jsx    # Landing screen: skyline scenes, search bar, city chips
│   ├── WeatherSearchScreen.css    # Scoped styles for the landing screen
│   ├── weather.js                 # Weather dashboard: fetches and displays live data
│   ├── App.css
│   └── index.js
├── .env                            # OpenWeatherMap API key (see note above)
└── package.json
```

## 🗺️ Roadmap

- [ ] °C / °F toggle
- [ ] Geolocation-based weather lookup
- [ ] Recent searches via localStorage
- [ ] Weather condition icons
- [ ] Enter-key search + input debouncing
- [ ] Real city skyline photography (Unsplash/Pexels) behind the weather card
- [ ] Split into `SearchBar.jsx` / `WeatherCard.jsx` + a `useWeather` hook
- [ ] Deploy to Vercel/Netlify

## 📄 License

No license specified yet — consider adding one (e.g. MIT) if you plan to accept contributions or want to clarify reuse terms.
