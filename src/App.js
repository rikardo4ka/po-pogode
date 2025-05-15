// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Убедитесь, что расширения файлов совпадают (.js или .jsx)
import MainPage from './components/MainPage/MainPage';
import WeatherPage from './components/WeatherPage/WeatherPage'
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;