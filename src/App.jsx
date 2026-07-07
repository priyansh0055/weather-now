import { useState } from 'react';
import WeatherSearchScreen from './WeatherSearchScreen';
import Weather from './weather';

function App() {
  const [showSearch, setShowSearch] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');

  const goToWeather = (cityName) => {
    setSelectedCity(cityName);
    setShowSearch(false);
  };

  return showSearch ? (
    <WeatherSearchScreen
      onSearch={goToWeather}
      onSelectCity={goToWeather}
      onClose={() => setShowSearch(false)}
    />
  ) : (
   <Weather
    initialCity={selectedCity}
    onBack={() => {
        setShowSearch(true);
        setSelectedCity("");
    }}
/>
  );
}

export default App;