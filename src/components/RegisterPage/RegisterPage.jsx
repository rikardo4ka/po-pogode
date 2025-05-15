import { Link } from 'react-router-dom';
import './RegisterPage.css'; 
import LoginPage from '../LoginPage/LoginPage';

function RegisterPage() {
  return (
    <div className="reg-page">
      <div className="reg-containter">
        <div className="reg-content">
          <span className="reg-title">РЕГИСТРАЦИЯ <br /></span>
          <span className="reg-welcome">* обязательные поля для заполнения</span>
          
          <div className="reg-input">
            <span className="reg-text">Имя*</span>
            <input type="text" id="name" placeholder="Введите ваше имя" />
          </div>
          
          <div className="reg-input">
            <span className="reg-text">Пол</span>
            <input type="text" id="sex" placeholder="Введите ваш пол" />
          </div>
          
          <div className="reg-input">
            <span className="reg-text">Почта*</span>
            <input type="email" id="email" placeholder="Введите вашу почту" />
          </div>
          
          <div className="reg-input">
            <span className="reg-text">Пароль*</span>
            <input type="password" id="password" placeholder="Введите ваш пароль" />
          </div>
          
          <button className="reg-button" id="flipButton3">
            ЗАРЕГИСТИРОВАТЬСЯ
          </button>

          {/* Ссылка для возврата на страницу входа */}
          <div className="reg-login-link">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </div>
        </div>
        
        <div className="reg-bg">
          <img src="/pic/Фон (2).png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;