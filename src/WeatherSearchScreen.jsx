import { useState } from 'react';
import './WeatherSearchScreen.css';

/**
 * Skyline silhouette + sky gradient for one "scene" in the background shuffle.
 * Kept as data so adding/removing cities is a one-line change.
 */
const SCENES = [
  {
    key: 'mumbai',
    skyClass: 'wn-sky-mumbai',
    stars: false,
    buildings: [
      [0, 140, 60, 120], [70, 100, 45, 160], [125, 160, 70, 100], [205, 80, 40, 180],
      [255, 130, 55, 130], [320, 60, 35, 200], [365, 150, 90, 110], [465, 110, 50, 150],
      [525, 170, 65, 90], [600, 90, 42, 170], [650, 140, 80, 120], [740, 70, 38, 190],
      [785, 160, 60, 100], [855, 100, 46, 160], [910, 150, 70, 110], [990, 80, 40, 180],
      [1040, 130, 60, 130], [1110, 160, 90, 100],
    ],
  },
  {
    key: 'tokyo',
    skyClass: 'wn-sky-tokyo',
    stars: true,
    buildings: [
      [0, 120, 50, 140], [60, 170, 80, 90], [150, 90, 30, 170], [190, 140, 60, 120],
      [260, 60, 45, 200], [315, 150, 70, 110], [395, 100, 35, 160], [440, 170, 90, 90],
      [540, 80, 40, 180], [590, 130, 65, 130], [665, 50, 28, 210], [700, 160, 75, 100],
      [785, 110, 42, 150], [835, 170, 60, 90], [905, 90, 35, 170], [950, 140, 80, 120],
      [1040, 70, 38, 190], [1090, 160, 100, 100],
    ],
  },
  {
    key: 'newyork',
    skyClass: 'wn-sky-newyork',
    stars: false,
    buildings: [
      [0, 150, 55, 110], [65, 90, 40, 170], [115, 130, 60, 130], [185, 40, 34, 220],
      [225, 120, 50, 140], [285, 170, 80, 90], [375, 70, 30, 190], [415, 140, 65, 120],
      [490, 20, 36, 240], [535, 130, 55, 130], [600, 160, 90, 100], [700, 80, 40, 180],
      [750, 150, 60, 110], [820, 50, 32, 210], [860, 140, 70, 120], [940, 110, 45, 150],
      [995, 170, 85, 90], [1090, 90, 38, 170], [1140, 150, 60, 110],
    ],
  },
  {
    key: 'reykjavik',
    skyClass: 'wn-sky-reykjavik',
    stars: true,
    buildings: [
      [0, 200, 90, 60], [100, 180, 60, 80], [170, 210, 100, 50], [290, 190, 70, 70],
      [380, 150, 40, 110], [430, 205, 120, 55], [570, 185, 55, 75], [640, 215, 90, 45],
      [740, 195, 60, 65], [810, 160, 34, 100], [855, 210, 110, 50], [980, 190, 65, 70],
      [1060, 215, 140, 45],
    ],
  },
];

const INDIA_CHIPS = [
  { name: 'Mumbai', icon: 'wb_sunny', accent: 'wn-amber' },
  { name: 'Delhi', icon: 'cloud', accent: 'wn-slate' },
  { name: 'Bangalore', icon: 'rainy', accent: 'wn-sky' },
  { name: 'Kolkata', icon: 'wb_twilight', accent: 'wn-amber' },
  { name: 'Jaipur', icon: 'partly_cloudy_day', accent: 'wn-slate' },
];

const PREVIEWS = [
  { city: 'Mumbai', icon: 'wb_sunny', color: 'var(--wn-amber)', temp: '31°', cond: 'Humid & clear' },
  { city: 'Tokyo', icon: 'clear_night', color: 'var(--wn-slate)', temp: '18°', cond: 'Clear night' },
  { city: 'New York', icon: 'partly_cloudy_day', color: 'var(--wn-slate)', temp: '21°', cond: 'Partly cloudy' },
  { city: 'Reykjavik', icon: 'ac_unit', color: 'var(--wn-sky)', temp: '4°', cond: 'Cold & crisp' },
];

function Skyline({ buildings }) {
  return (
    <div className="wn-skyline">
      <svg viewBox="0 0 1200 260" preserveAspectRatio="none">
        <g fill="#0b0a1a" opacity="0.9">
          {buildings.map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/**
 * WeatherSearchScreen
 *
 * Props:
 *  - onSearch(query: string)   called when the user submits the search box
 *  - onSelectCity(cityName: string)  called when a chip or preview card is clicked
 *  - onClose()                 called when the close (X) button is clicked
 */
export default function WeatherSearchScreen({ onSearch, onSelectCity, onClose }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && onSearch) onSearch(query.trim());
  };

  return (
    <div className="wn-stage">
      <div className="wn-bg-cycle">
        {SCENES.map((scene) => (
          <div className="wn-scene" key={scene.key}>
            <div className={`wn-kenburns ${scene.skyClass}`}>
              {scene.stars && <div className="wn-stars" />}
              <Skyline buildings={scene.buildings} />
              <div className="wn-haze" />
            </div>
          </div>
        ))}
      </div>

      <div className="wn-scrim" />

      <div className="wn-content">
        <header className="wn-header">
          <div className="wn-logo">WeatherNow</div>
          <button className="wn-close-btn" onClick={onClose} aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <main className="wn-hero">
          <h1>Where's the sky looking at?</h1>
          <p className="wn-subtext">Enter a city to reveal its current atmosphere.</p>

          <form className="wn-search-wrap" onSubmit={handleSubmit}>
            <div className="wn-search-bar">
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Search city, zip code, or airport..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="wn-go-btn" aria-label="Search">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  arrow_forward
                </span>
              </button>
            </div>
          </form>

          <div>
            <div className="wn-chip-row">
              {INDIA_CHIPS.map((chip) => (
                <div
                  key={chip.name}
                  className={`wn-chip ${chip.accent}`}
                  onClick={() => onSelectCity && onSelectCity(chip.name)}
                >
                  <span className="material-symbols-outlined">{chip.icon}</span>
                  {chip.name}
                </div>
              ))}
            </div>
            <div className="wn-chip-label">Popular in India</div>
          </div>
        </main>

        <footer className="wn-strip-wrap">
          <div className="wn-preview-strip">
            {PREVIEWS.map((p) => (
              <div
                key={p.city}
                className="wn-preview-card"
                onClick={() => onSelectCity && onSelectCity(p.city)}
              >
                <div className="wn-preview-row">
                  <span className="wn-city">{p.city}</span>
                  <span className="material-symbols-outlined" style={{ color: p.color, fontSize: 18 }}>
                    {p.icon}
                  </span>
                </div>
                <div className="wn-preview-temp">{p.temp}</div>
                <div className="wn-preview-cond">{p.cond}</div>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
