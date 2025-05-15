import { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    sex: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Отправка данных:', formData);
    
    try {
      // Явно указываем метод POST
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          sex: formData.sex // необязательное поле
        }),
      });

      console.log('Статус ответа:', response.status);
      
      // Обрабатываем случай когда сервер возвращает 200 OK
      if (response.ok) {
        const data = await response.text();
        alert(data);
        window.location.href = "/login";
        return;
      }

      // Обрабатываем ошибки валидации (400 Bad Request)
      if (response.status === 400) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      // Обрабатываем другие ошибки
      throw new Error(`HTTP error! status: ${response.status}`);

    } catch (error) {
      console.error('Ошибка регистрации:', error);
      alert(error.message);
    }
  };

  return (
    <div className="reg-page">
      <div className="reg-containter">
        {/* Добавляем novalidate для отключения браузерной валидации */}
        <form 
          onSubmit={handleRegister} 
          className="reg-content"
          noValidate
        >
          <span className="reg-title">РЕГИСТРАЦИЯ <br /></span>
          <span className="reg-welcome">* обязательные поля для заполнения</span>
          
          <div className="reg-input">
            <span className="reg-text">Имя*</span>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Введите ваше имя" 
              required
              minLength={2}
            />
          </div>
          
          <div className="reg-input">
            <span className="reg-text">Пол</span>
            <select 
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
            >
              <option value="">Не указано</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
          
          <div className="reg-input">
            <span className="reg-text">Почта*</span>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Введите вашу почту" 
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            />
          </div>
          
          <div className="reg-input">
            <span className="reg-text">Пароль*</span>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Введите ваш пароль" 
              required
              minLength={6}
            />
          </div>
          
          <button 
            className="reg-button" 
            type="submit"
            // Добавляем индикатор загрузки
            disabled={!formData.name || !formData.email || !formData.password}
          >
            ЗАРЕГИСТРИРОВАТЬСЯ
          </button>

          <div className="reg-login-link">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </div>
        </form>
        
        <div className="reg-bg">
          <img src="/pic/Фон (2).png" alt="Фон регистрации" />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;