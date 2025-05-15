import { useNavigate } from 'react-router-dom';
import './MainPage.css';

function MainPage() {  // Убрали export default отсюда
  const navigate = useNavigate();

  const handleLoginClick = () => {
    document.getElementById('mainContent').style.animation = 'fadeOut 0.5s forwards';
    setTimeout(() => navigate('/login'), 500);
  };
  const handleWeatherClick = () => {
    navigate('/weather');
  };
  return (
    <div id="mainContent" className="main-page">
      <header className="header">
        <div className="container">
          <div className="header-line">
            <div className="header-logo">
              <img src="/pic/Логотип.png" alt="Логотип" className="logo" />
            </div>
            <button className="login-button" onClick={handleLoginClick}>
              ВОЙТИ
            </button>
          </div>
          <div className="header-bg">
            <img src={process.env.PUBLIC_URL + "/pic/главная.png"} alt="" height="800px" />
          </div>
          <div className="header-content">
            <div className="questions-block">
              - ЧТО НАДЕТЬ СЕГОДНЯ?<br />
              - МЫ ПОДСКАЖЕМ!
            </div>
            <button 
        className="main-button" 
        onClick={handleWeatherClick}>ПОСМОТРЕТЬ ГОТОВЫЕ ОБРАЗЫ</button>
            <div className="header-people">
              <img src="/pic/люди.png" alt="" />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default MainPage; // ← Оставляем только ОДИН экспорт