import { Link } from 'react-router-dom';
import React, { useState } from 'react'; // Добавлен импорт useState
import ModalNoPassword from '../ModalNoPassword/ModalNoPassword';
import './LoginPage.css';

function LoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <form action="/login" method="POST"> 
          <div class="ep-input">
            <span class="ep-text">Почта</span>
            <input type="email" name="email" placeholder="Введите вашу почту" required />
          </div>
          <div class="ep-input">
            <span class="ep-text">Пароль</span>
            <input type="password" name="password" placeholder="Введите ваш пароль" required />
          </div>
          <label class="custom-radio">
            <input type="checkbox" class="radio-input" />
            <span class="radio-mark"></span>
            <span class="ep-text-remem">Сохранить вход</span>
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
        onClose={() => setIsModalOpen(false)} />
          <button type="submit" class="ep-button">Войти</button>
        </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;