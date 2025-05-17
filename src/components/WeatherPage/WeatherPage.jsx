import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WeatherPage.css';

function WeatherPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    const mainContent = document.querySelector('.weather-page');
    if (mainContent) {
      mainContent.style.animation = 'fadeOut 0.5s forwards';
      setTimeout(() => navigate('/login'), 500);
    }
  };

  const [selectedCity, setSelectedCity] = useState('Voronezh');
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Координаты городов
  const cities = {
    'Voronezh': { lat: 51.672, lon: 39.1843 },
    'Moscow': { lat: 55.7558, lon: 37.6176 }
  };

  // Получение данных о погоде
  useEffect(() => {
    const API_KEY = '6a93e74d69182916e85c3f13ee1b43ce';
    const { lat, lon } = cities[selectedCity];
    
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`
        );
        
        setWeatherData({
          temperature: `${Math.round(response.data.main.temp)} °C`,
          condition: response.data.weather[0].description,
          feelsLike: `${Math.round(response.data.main.feels_like)} °C`,
          wind: `${response.data.wind.speed} м/с`,
          humidity: `${response.data.main.humidity}%`,
          pressure: `${Math.round(response.data.main.pressure * 0.750062)} мм рт.ст.`,
          date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity, selectedDate]);

  // Данные для календаря
  const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const currentMonth = months[new Date().getMonth()];
  const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  
  const calendarDays = [
    [28, 29, 30, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, 1 ]
  ];

  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
      setLoading(true);
    }
  };

  if (loading) return <div className="loading">Загрузка данных о погоде...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="weather-page">
      <div className="weather-side">
        <div className="weather-bg">
          <img src="/pic/Фон (3).png" alt="" />
        </div>
        <div className='weather-content'>
          <div className="weather-header">
            <div className="city-selector">
              <button 
                className={`city-btn ${selectedCity === 'Voronezh' ? 'active' : ''}`}
                onClick={() => setSelectedCity('Voronezh')}
              >
                Воронеж
              </button>
              <button 
                className={`city-btn ${selectedCity === 'Moscow' ? 'active' : ''}`}
                onClick={() => setSelectedCity('Moscow')}
              >
                Москва
              </button>
            </div>
          </div>

          <div className="weather-calendar">
            <div className="calendar-month">{currentMonth}</div>
            <div className="calendar-weekdays">
              {weekdays.map(day => (
                <span key={day} className="weekday">{day}</span>
              ))}
            </div>
            <div className="calendar-grid">
              {calendarDays.map((week, weekIndex) => (
                <div key={weekIndex} className="calendar-row">
                  {week.map((day, dayIndex) => (
                    <div 
                      key={dayIndex} 
                      className={`calendar-day ${day === selectedDate ? 'selected' : ''} ${day ? '' : 'empty'}`}
                      onClick={() => handleDateClick(day)}
                    >
                      {day || ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {weatherData && (
            <div className="weather-info">
              <div className="weather-date">{weatherData.date}</div>
              <div className="temperature">{weatherData.temperature}</div>
              <div className="weather-details">
                <p>{weatherData.condition}</p>
                <p>Ощущается как {weatherData.feelsLike}</p>
                <p>Ветер {weatherData.wind}</p>
                <p>Влажность {weatherData.humidity}</p>
                <p>Давление {weatherData.pressure}</p>
              </div>
            </div>
          )}

          <button className="recommendation-button">
            ПОЛУЧИТЬ РЕКОМЕНДАЦИЮ
          </button>
        </div>
      </div>

      <div className="reviews-side-container">
        <div className="reviews-side">
          <div className='reviews-header'>
            <div className="rev-h-logo">
              <img src="/pic/Логотип.png" alt="Логотип" className="logo" />
            </div>
            <button className="rev-h-button" onClick={handleLoginClick}>
              ВОЙТИ
            </button>
          </div>
          <h3>Отзывы</h3>
          <div className="reviews-scrollable">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(review => (
              <div key={review} className="review">
                <div className="review-header">
                  <span className="review-author">Роман ★★★★★★</span>
                  <span className="review-time">16:16</span>
                </div>
                <p className="review-text">
                  Однажды идеально подошла под погоду. Благодаря рекомендациям не замерзла.
                </p>
                <p className="review-recommendation">
                  Рекомендацию по погоде: ① куртка, ② шапка, ③ джинсы, ④ ботинки
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;