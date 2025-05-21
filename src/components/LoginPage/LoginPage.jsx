import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import ModalNoPassword from '../ModalNoPassword/ModalNoPassword';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Ошибка авторизации');
      }

      // Сохраняем токен и данные пользователя
      if (formData.rememberMe) {
        localStorage.setItem('authToken', responseData.token);
        localStorage.setItem('user', JSON.stringify(responseData.user));
      } else {
        sessionStorage.setItem('authToken', responseData.token);
        sessionStorage.setItem('user', JSON.stringify(responseData.user));
      }

      // Перенаправляем на защищенный роут
      navigate('/weather');

    } catch (err) {
      console.error('Ошибка авторизации:', err);
      setError(err.message || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="entrance-page">
      <div className="ep-containter">
        <div className="ep-bg">
          <img src="/pic/Фон.png" alt="" />
        </div>
        <div className="ep-content">
          <div className="ep-qa">
            <span className="ep-question">Нет аккаунта?</span>
            <Link to="/register" className="ep-answer-reg">
              Зарегистрируйтесь!
            </Link>
          </div>
          
          {/* Форма входа */}
          <form onSubmit={handleSubmit}>
            <div className="ep-input">
              <span className="ep-text">Почта</span>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Введите вашу почту" 
                required 
                disabled={loading}
              />
            </div>
            <div className="ep-input">
              <span className="ep-text">Пароль</span>
              <input 
                type="password" 
                name="password" 
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Введите ваш пароль" 
                required 
                disabled={loading}
              />
            </div>
            <label className="custom-radio">
              <input 
                type="checkbox" 
                className="radio-input" 
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={loading}
              />
              <span className="radio-mark"></span>
              <span className="ep-text-remem">Сохранить вход</span>
            </label>
            <a 
              href="#" 
              className="ep-answer-pw" 
              onClick={(e) => {
                e.preventDefault();
                handleOpenModal();
              }}
            >
              Забыл пароль?
            </a>
            <ModalNoPassword 
              isOpen={isModalOpen} 
              onClose={handleCloseModal} 
            />
            {error && <div className="error-message">{error}</div>}
            <button 
              type="submit" 
              className="ep-button"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;