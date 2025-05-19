import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WeatherPage.css';
import './WeatherRecommendation.css';

function WeatherRecommendation({ onClose }) {
  const [items, setItems] = useState([
    { 
      id: 1, 
      name: 'Куртка', 
      checked: false, 
      icon: process.env.PUBLIC_URL + '/иконки_гардероба/верхняяОдежда.png' 
    },
    { 
      id: 2, 
      name: 'Свитер', 
      checked: true, 
      icon: process.env.PUBLIC_URL + '/иконки_гардероба/Верх.png' 
    },
    { 
      id: 3, 
      name: 'Джинсы', 
      checked: false, 
      icon: process.env.PUBLIC_URL + '/иконки_гардероба/Низ.png' 
    },
    { 
      id: 4, 
      name: 'Кроссовки или ботинки', 
      checked: false, 
      icon: process.env.PUBLIC_URL + '/иконки_гардероба/Обувь.png' 
    }
  ]);

  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('authData') || !!sessionStorage.getItem('authData');

  const handleFeedbackClick = () => {
    if (isLoggedIn) {
      navigate('/feedbackPage');
      onClose(); // Закрываем модальное окно рекомендаций
    } else {
      setShowLoginAlert(true);
    }
  };

  const backgroundImage = process.env.PUBLIC_URL + '/pic/Фон_Образ.png';
  const logoImage = process.env.PUBLIC_URL + '/pic/Логотип.png';

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className="recommendation-overlay" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="recommendation-header">
        <img src={logoImage} alt="Логотип" className="recommendation-logo" />
      </div>
      
      <div className="recommendation-container">
        <h1 className="recommendation-title">По Погоде</h1>
        
        <div className="recommendation-list">
          <p className="recommendation-subtitle">Рекомендованный образ:</p>
          
          <div className="recommendation-items-grid">
            {items.map(item => (
              <div 
                key={item.id} 
                className={`recommendation-item ${item.checked ? 'selected' : ''}`}
                onClick={() => toggleItem(item.id)}
              >
                <img src={item.icon} alt={item.name} className="item-icon" />
                <span className="item-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="recommendation-tip">
          <p>Совет: на улице прохладный ветер, лучше взять с собой шарф, чтобы не замерзнуть. Если планируете долго гулять, выберите удобную обувь.</p>
        </div>

        <div className="recommendation-footer">
          <button className="close-button" onClick={onClose}>ЗАКРЫТЬ</button>
          <button className="feedback-button" onClick={handleFeedbackClick}>
            ОСТАВИТЬ ОТЗЫВ
          </button>
        </div>
      </div>

      {/* Модальное окно с требованием авторизации */}
      {showLoginAlert && (
        <div className="login-alert-overlay">
          <div className="login-alert">
            <h3>Требуется авторизация</h3>
            <p>Чтобы оставить отзыв, пожалуйста, войдите в свой аккаунт.</p>
            <div className="alert-buttons">
              <button 
                className="alert-button login"
                onClick={() => {
                  setShowLoginAlert(false);
                  onClose();
                  navigate('/login');
                }}
              >
                ВОЙТИ
              </button>
              <button 
                className="alert-button cancel"
                onClick={() => setShowLoginAlert(false)}
              >
                ОТМЕНА
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WeatherPage() {
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authData = localStorage.getItem('authData') || sessionStorage.getItem('authData');
    setIsLoggedIn(!!authData);
  }, []);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    // Очищаем хранилище
    localStorage.removeItem('authData');
    sessionStorage.removeItem('authData');
    // Обновляем страницу
    window.location.reload();
  };

  const handleWardrobeClick = () => {
    navigate('/wardrobe');
  };

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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Обновляем время каждую минуту
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Обновление каждую минуту

    return () => clearInterval(timer);
  }, []);

  // Функция для получения иконки погоды
  const getWeatherIcon = (condition) => {
    const weatherIcons = {
      'ветер': 'ветер.png',
      'облачно': 'облачно.png',
      'дождь': 'дождь.png',
      'пасмурно': 'дождь.png',
      'снег': 'снег.png',
      'ясно': 'солнечно.png',
    };

    // Поиск подходящей иконки
    const lowerCondition = condition.toLowerCase();
    for (const [key, icon] of Object.entries(weatherIcons)) {
      if (lowerCondition.includes(key)) {
        return process.env.PUBLIC_URL + `/иконки_погоды/${icon}`;
      }
    }
    
    // Иконка по умолчанию
    return process.env.PUBLIC_URL + '/иконки_погоды/облачно.png';
  };

  // Получение данных о погоде (модифицированный useEffect)
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
          date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
          icon: getWeatherIcon(response.data.weather[0].description)
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
  const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  // Функция для генерации календаря
  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Корректировка дня недели (пн = 0, вс = 6)
    const firstDayOfWeek = (firstDay + 6) % 7;
    
    const weeks = [];
    let day = 1;
    let prevMonthDay = daysInPrevMonth - firstDayOfWeek + 1;
    
    for (let i = 0; i < 6; i++) {
      const week = [];
      
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfWeek) {
          // Дни предыдущего месяца
          week.push(prevMonthDay++);
        } else if (day > daysInMonth) {
          // Дни следующего месяца
          week.push(day - daysInMonth);
          day++;
        } else {
          // Дни текущего месяца
          week.push(day++);
        }
      }
      
      weeks.push(week);
      if (day > daysInMonth) break;
    }
    
    return { weeks, firstDayOfWeek, daysInMonth };
  };

  // Получаем текущую дату
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Генерируем календарь для текущего месяца
  const { weeks: calendarDays, firstDayOfWeek, daysInMonth } = generateCalendar(currentYear, currentMonth);
  
  // Обработчик выбора даты
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
          <img src={process.env.PUBLIC_URL + "/pic/Фон (3).png"} alt="" />
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
            <div className="calendar-month">{months[currentMonth]} {currentYear}</div>
            <div className="calendar-weekdays">
              {weekdays.map(day => (
                <span key={day} className="weekday">{day}</span>
              ))}
            </div>
            <div className="calendar-grid">
              {calendarDays.map((week, weekIndex) => (
                <div key={weekIndex} className="calendar-row">
                  {week.map((day, dayIndex) => {
                    const isCurrentMonth = (
                      (weekIndex > 0 || dayIndex >= firstDayOfWeek) && 
                      (weekIndex < calendarDays.length - 1 || day <= daysInMonth)
                    );
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`calendar-day 
                          ${day === selectedDate && isCurrentMonth ? 'selected' : ''} 
                          ${isCurrentMonth ? '' : 'other-month'}`}
                        onClick={() => isCurrentMonth && handleDateClick(day)}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {weatherData && (
            <div className="weather-info">
              <div className="weather-header-info">
                <div className="weather-icon-container">
                  <img 
                    src={weatherData.icon} 
                    alt={weatherData.condition} 
                    className="weather-icon"
                  />
                </div>
                <div className="weather-temp-time">
                  <div className="temperature">{weatherData.temperature}</div>
                  <div className="current-time">
                    {currentTime.toLocaleTimeString('ru-RU', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false 
                    })}
                  </div>
                </div>
              </div>
              
              <div className="weather-details">
                <p className="weather-condition">{weatherData.condition}</p>
                <p>Ощущается как {weatherData.feelsLike}</p>
                <p>Ветер {weatherData.wind}</p>
                <p>Влажность {weatherData.humidity}</p>
                <p>Давление {weatherData.pressure}</p>
              </div>
            </div>
          )}

          <button className="recommendation-button" onClick={() => setShowRecommendation(true)}>
            ПОЛУЧИТЬ<br />РЕКОМЕНДАЦИЮ
          </button>
        </div>
      </div>

      <div className="reviews-side-container">
        <div className="reviews-side">
          <div className='reviews-header'>
            <div className="rev-h-logo">
              <img src={process.env.PUBLIC_URL + "/pic/Логотип.png"} alt="Логотип" className="logo" />
            </div>
            {isLoggedIn ? (
              <div className="profile-container">
                <img 
                  src={process.env.PUBLIC_URL + "/pic/Иконка_Профиля.png"} 
                  alt="Профиль" 
                  className="profile-icon"
                  onClick={handleProfileClick}
                />
                {showProfileMenu && (
                  <div className="profile-menu">
                    <div className="profile-menu-item" onClick={() => navigate('/profile')}>
                      Профиль
                    </div>
                    <div className="profile-menu-item" onClick={handleWardrobeClick}>
                      Гардероб
                    </div>
                    <div className="profile-menu-item" onClick={handleLogout}>
                      Выход
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button className="rev-h-button" onClick={handleLoginClick}>
                ВОЙТИ
              </button>
            )}
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
      {showRecommendation && (
        <WeatherRecommendation onClose={() => setShowRecommendation(false)} />
      )}
    </div>
  );
}

export default WeatherPage;