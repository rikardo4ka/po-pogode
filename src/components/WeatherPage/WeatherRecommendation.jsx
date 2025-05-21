import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './WeatherRecommendation.css';
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

function WeatherRecommendationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const isLoggedIn = !!localStorage.getItem('authToken') || !!sessionStorage.getItem('authToken');
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    if (location.state?.weatherData) {
      const temp = parseInt(location.state.weatherData.temperature);
      setTemperature(isNaN(temp) ? null : temp);
    }
  }, [location.state]);

  const getWardrobeRecommendation = (temp) => {
    if (temp === null) return null;

    if (temp <= -20) {
      return {
        items: [
          { name: 'Зимняя куртка', icon: '/иконки_гардероба/верхняяОдежда.png', checked: true },
          { name: 'Водолазка', icon: '/иконки_гардероба/Верх.png', checked: true },
          { name: 'Утепленные штаны', icon: '/иконки_гардероба/Низ.png', checked: true },
          { name: 'Теплые ботинки', icon: '/иконки_гардероба/Обувь.png', checked: true },
          { name: 'Шапка', icon: '/иконки_гардероба/головныеУборы.png', checked: true },
          { name: 'Перчатки', icon: '/иконки_гардероба/Аксессуары.png', checked: true }
        ],
        tip: "Очень холодно! Наденьте всё самое тёплое и постарайтесь не находиться долго на улице."
      };
    } else if (temp <= -10) {
      return {
        items: [
          { name: 'Зимняя куртка', icon: '/иконки_гардероба/верхняяОдежда.png', checked: true },
          { name: 'Толстовка', icon: '/иконки_гардероба/Верх.png', checked: true },
          { name: 'Джинсы', icon: '/иконки_гардероба/Низ.png', checked: true },
          { name: 'Ботинки', icon: '/иконки_гардероба/Обувь.png', checked: true },
          { name: 'Шапка', icon: '/иконки_гардероба/головныеУборы.png', checked: true },
          { name: 'Шарф', icon: '/иконки_гардероба/Аксессуары.png', checked: true }
        ],
        tip: "Сильный мороз. Обязательно наденьте шапку и шарф."
      };
    } else if (temp <= 0) {
      return {
        items: [
          { name: 'Пальто', icon: '/иконки_гардероба/верхняяОдежда.png', checked: true },
          { name: 'Толстовка', icon: '/иконки_гардероба/Верх.png', checked: true },
          { name: 'Джинсы', icon: '/иконки_гардероба/Низ.png', checked: true },
          { name: 'Кроссовки', icon: '/иконки_гардероба/Обувь.png', checked: true },
          { name: 'Шапка', icon: '/иконки_гардероба/головныеУборы.png', checked: false }
        ],
        tip: "Довольно холодно. Тёплая куртка и шапка обязательны."
      };
    } else if (temp <= 10) {
      return {
        items: [
          { name: 'Демисезонная куртка', icon: '/иконки_гардероба/верхняяОдежда.png', checked: true },
          { name: 'Футболка', icon: '/иконки_гардероба/Верх.png', checked: true },
          { name: 'Джинсы', icon: '/иконки_гардероба/Низ.png', checked: true },
          { name: 'Кроссовки', icon: '/иконки_гардероба/Обувь.png', checked: true }
        ],
        tip: "Прохладная погода. Демисезонная куртка будет в самый раз."
      };
    } else if (temp <= 20) {
      return {
        items: [
          { name: 'Футболка', icon: '/иконки_гардероба/Верх.png', checked: true },
          { name: 'Юбка/Шорты', icon: temp <= 15 ? '/иконки_гардероба/Низ.png' : '/иконки_гардероба/Низ.png', checked: true },
          { name: 'Кроссовки/Туфли', icon: temp <= 15 ? '/иконки_гардероба/Обувь.png' : '/иконки_гардероба/Обувь.png', checked: true },
          { name: 'Кепка', icon: '/иконки_гардероба/головныеУборы.png', checked: false }
        ],
        tip: "Тёплая погода. Можно надеть лёгкую одежду."
      };
    } else {
      return {
        items: [
          { name: 'Майка', icon: '/иконки_гардероба/верх.png', checked: true },
          { name: 'Шорты', icon: '/иконки_гардероба/Низ.png', checked: true },
          { name: 'Сандалии', icon: '/иконки_гардероба/Обувь.png', checked: true },
          { name: 'Шляпа', icon: '/иконки_гардероба/головныеУборы.png', checked: true },
          { name: 'Очки', icon: '/иконки_гардероба/Аксессуары.png', checked: true }
        ],
        tip: "Очень жарко. Не забудьте про солнцезащитные очки и головной убор."
      };
    }
  };

  const recommendation = temperature !== null ? getWardrobeRecommendation(temperature) : null;

  const handleFeedbackClick = () => {
    if (isLoggedIn) {
      navigate('/feedback');
    } else {
      setShowLoginAlert(true);
    }
  };

  return (
    <div className="weather-recommendation-page">
      <div className="weather-recommendation-container">
        <div className="recommendation-header">
          <img src={process.env.PUBLIC_URL + "/pic/Логотип.png"} alt="Логотип" className="logo" />
         
        </div>

        {recommendation ? (
          <>
            <div className="recommendation-content">
              <div className="recommendation-items">
                <h2>Рекомендованный образ:</h2>
                <div className="items-list">
                  {recommendation.items.map((item, index) => (
                    <div key={index} className={`item ${item.checked ? 'checked' : ''}`}>
                      <img 
                        src={process.env.PUBLIC_URL + item.icon} 
                        alt={item.name} 
                        className="item-icon" 
                      />
                      <span className="item-name-wr">{item.name}</span>
                      <div className={`checkbox ${item.checked ? 'checked' : ''}`}>
                        {item.checked ? '✓' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="recommendation-tip">
                <h3>СОВЕТ:</h3>
                <p>{recommendation.tip}</p>
              </div>
            </div>

            <div className="recommendation-footer">
              <button className="close-button" onClick={() => navigate(-1)}>ЗАКРЫТЬ</button>
              <button className="feedback-button" onClick={handleFeedbackClick}>
                ОСТАВИТЬ ОТЗЫВ
              </button>
            </div>
          </>
        ) : (
          <div className="no-data-message">
            <p>Не удалось получить данные о погоде</p>
            <button className="close-button" onClick={() => navigate(-1)}>ЗАКРЫТЬ</button>
          </div>
        )}

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
    </div>
  );
}

export default withAuth(WeatherRecommendationPage);