import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WeatherPage.css';

export const withAuth = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    
    useEffect(() => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) navigate('/login');
    }, [navigate]);

    return <Component {...props} />;
  };
};

function WeatherPage() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '' }); // Храним данные пользователя здесь
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    setIsLoggedIn(!!token);
    if (user) {
      setUserData({
        name: user.name || 'Пользователь' // Устанавливаем имя пользователя
      });
    }
  }, []);



  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('user');
  navigate('/login');
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
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [reviews, setReviews] = useState([
  {
    id: 1,
    author: 'Роман',
    rating: 5,
    time: '16:16',
    text: 'Все круто! Одежда идеально подошла под погоду.',
    recommendation: 'Рекомендация по погоде: куртка, водолазка, джинсы, ботинки',
    photo: process.env.PUBLIC_URL + '/pic/Лук1.png'
  },
  {
    id: 2,
    author: 'Анна',
    rating: 4,
    time: '14:30',
    text: 'Хороший сервис, но можно добавить больше вариантов одежды.',
    recommendation: 'Рекомендация по погоде: пальто, свитер, брюки, сапоги',
    photo: process.env.PUBLIC_URL + '/pic/Лук2.png'
  },
  {
    id: 3,
    author: 'Иван',
    rating: 5,
    time: '09:45',
    text: 'Советовал куртку - не прогадал! Отлично согревает в такую погоду.',
    recommendation: 'Рекомендация по погоде: пуховик, шапка, джинсы, кроссовки',
    photo: process.env.PUBLIC_URL + '/pic/Лук3.png'
  },
  {
    id: 4,
    author: 'Елена',
    rating: 3,
    time: '18:20',
    text: 'Неплохо, но мне было немного прохладно в рекомендованной одежде.',
    recommendation: 'Рекомендация по погоде: ветровка, футболка, шорты, кеды',
    photo: process.env.PUBLIC_URL + '/pic/Лук.png'
  },
  {
    id: 5,
    author: 'Дмитрий',
    rating: 5,
    time: '12:10',
    text: 'Точно угадали с рекомендацией! Ни капли не замёрз.',
    recommendation: 'Рекомендация по погоде: парка, термобельё, утеплённые брюки, ботинки',
    photo: process.env.PUBLIC_URL + '/pic/Лук1.png'
  }
]);

  const [newReview, setNewReview] = useState({
    text: '',
    rating: 0,
    photo: null,
    preview: null
  });

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReview({
          ...newReview,
          photo: file,
          preview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle review submission
  const handleSubmitReview = () => {
    if (newReview.text.trim() === '' || newReview.rating === 0) return;
    
    const review = {
      id: reviews.length + 1,
      author: userData.name, // Используем userData.name вместо userName
      rating: newReview.rating,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      text: newReview.text,
      recommendation: weatherData ? `Рекомендация по погоде: ${weatherData.recommendation || 'куртка, водолазка, джинсы, ботинки'}` : '',
      photo: newReview.preview || process.env.PUBLIC_URL + '/pic/review-placeholder.jpg'
    };
    
    setReviews([review, ...reviews]);
    setNewReview({
      text: '',
      rating: 0,
      photo: null,
      preview: null
    });
  };

  // Координаты городов
  const cities = {
  'Voronezh': { lat: 51.672, lon: 39.1843 },
  'Moscow': { lat: 55.7558, lon: 37.6176 },
  'Tula': { lat: 54.193, lon: 37.617 } // Добавляем координаты для Тулы
};

  // Получение данных о погоде
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = (condition) => {
    const weatherIcons = {
      'ветер': 'ветер.png',
      'облачно': 'облачно.png',
      'дождь': 'дождь.png',
      'пасмурно': 'дождь.png',
      'снег': 'снег.png',
      'ясно': 'солнечно.png',
    };

    const lowerCondition = condition.toLowerCase();
    for (const [key, icon] of Object.entries(weatherIcons)) {
      if (lowerCondition.includes(key)) {
        return process.env.PUBLIC_URL + `/иконки_погоды/${icon}`;
      }
    }
    
    return process.env.PUBLIC_URL + '/иконки_погоды/облачно.png';
  };

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

  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = (firstDay + 6) % 7;
    
    const weeks = [];
    let day = 1;
    let prevMonthDay = daysInPrevMonth - firstDayOfWeek + 1;
    
    for (let i = 0; i < 6; i++) {
      const week = [];
      
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfWeek) {
          week.push(prevMonthDay++);
        } else if (day > daysInMonth) {
          week.push(day - daysInMonth);
          day++;
        } else {
          week.push(day++);
        }
      }
      
      weeks.push(week);
      if (day > daysInMonth) break;
    }
    
    return { weeks, firstDayOfWeek, daysInMonth };
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const { weeks: calendarDays, firstDayOfWeek, daysInMonth } = generateCalendar(currentYear, currentMonth);
  
  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
      setLoading(true);
    }
  };

  if (loading) return <div className="loading">Загрузка данных о погоде...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };
  
   const citiesList = [
    { id: 'Voronezh', name: 'Воронеж' },
    { id: 'Moscow', name: 'Москва' },
    { id: 'Tula', name: 'Тула' }
  ];

  const handleCitySelect = (cityId) => {
    setSelectedCity(cityId);
    setShowCityDropdown(false);
    setLoading(true);
  };
  return (
    <div className="weather-page">
      <div className="weather-side">
        <div className="weather-bg">
          <img src={process.env.PUBLIC_URL + "/pic/Фон (3).png"} alt="" />
        </div>
        <div className='weather-content'>
          <div className="weather-header">
        <div className="city-selector">
          <div className="city-dropdown">
            <button 
              className="city-dropdown-toggle"
              onClick={() => setShowCityDropdown(!showCityDropdown)}
            >
              {citiesList.find(c => c.id === selectedCity)?.name}
              <span className="dropdown-arrow">▼</span>
            </button>
            {showCityDropdown && (
              <div className="city-dropdown-menu">
                {citiesList.map(city => (
                  <div
                    key={city.id}
                    className={`city-dropdown-item ${selectedCity === city.id ? 'active' : ''}`}
                    onClick={() => handleCitySelect(city.id)}
                  >
                    {city.name}
                  </div>
                ))}
              </div>
            )}
          </div>
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

          <button 
  className="recommendation-button" 
  onClick={() => navigate('/weather-recommendation', { 
    state: { weatherData: weatherData } 
  })}
>
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
          
          {/* New Review Form */}
          {isLoggedIn && (
            <div className="new-review">
              <div className="review-photo-upload">
                <label htmlFor="review-photo">
                  {newReview.preview ? (
                    <img src={newReview.preview} alt="Preview" className="review-photo-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <span>+</span>
                      <p>Добавить фото</p>
                    </div>
                  )}
                </label>
                <input
                  id="review-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="review-content">
                <div className="review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= newReview.rating ? 'filled' : ''}`}
                      onClick={() => setNewReview({...newReview, rating: star})}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  className="review-textarea"
                  placeholder="Напишите ваш отзыв..."
                  value={newReview.text}
                  onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                />
                <button 
                  className="submit-review-button"
                  onClick={handleSubmitReview}
                  disabled={!newReview.text || newReview.rating === 0}
                >
                  Опубликовать
                </button>
              </div>
            </div>
          )}
          
          <div className="reviews-scrollable">
        {reviews.map((review) => (
          <div key={review.id} className="review">
            <div className="review-content-wrapper">
              <div className="review-text-content">
                <div className="review-header">
                  <span className="review-author">
                    {review.author} {Array(review.rating).fill('★').join('')}
                  </span>
                  <span className="review-time">{review.time}</span>
                </div>
                <p className="review-text">{review.text}</p>
                {review.recommendation && (
                  <p className="review-recommendation">{review.recommendation}</p>
                )}
              </div>
              {review.photo && (
                <div className="review-photo-container" onClick={() => openPhotoModal(review.photo)}>
                  <img src={review.photo} alt="Review" className="review-photo" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="photo-modal-overlay" onClick={closePhotoModal}>
          <div className="photo-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closePhotoModal}>×</button>
            <img src={selectedPhoto} alt="Увеличенное фото" className="enlarged-photo" />
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
}

export default WeatherPage;