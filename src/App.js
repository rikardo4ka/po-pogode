// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import WeatherPage from './components/WeatherPage/WeatherPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import WardrobePage from './components/WardrobePage/WardrobePage';
import CatalogPage from './components/CatalogPage/CatalogPage';
import FeedbackPage from './components/FeedbackPage/FeedbackPage';
import FeedbackCatalogPage from './components/FeedbackPage/FeedbackCatalogPage';
import WeatherRecommendation from './components/WeatherPage/WeatherRecommendation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/wardrobe" element={<WardrobePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/feedback_catalog" element={<FeedbackCatalogPage />} />
        <Route path="/weather-recommendation" element={<WeatherRecommendation />} />
      </Routes>
    </Router>
  );
}

export default App;