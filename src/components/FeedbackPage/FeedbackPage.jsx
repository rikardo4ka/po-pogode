import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedbackPage.css';
import '../CatalogPage/CatalogPage.css';  // Подняться на уровень выше и зайти в CatalogPage

function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const navigate = useNavigate();

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleSubmit = () => {
    // Здесь можно добавить логику отправки отзыва
    console.log('Отправлен отзыв:', { rating, feedbackText });
    // Перенаправление после отправки
    navigate('/feedback-thank-you'); // Можно создать отдельную страницу благодарности
  };

  return (
    <div className="feedback-container">
      {/* Левая часть - форма отзыва */}
      <div className="feedback-form">
        <div className="feedback-header">
          <img 
            src={process.env.PUBLIC_URL + '/pic/Логотип.png'} 
            alt="Логотип" 
            className="feedback-logo"
          />
        </div>
        
        <div className="feedback-content">
          <h2 className="feedback-title">
            Понравился подбор?<br />
            Поделитесь впечатлением! Нам важно ваше мнение.
          </h2>
          
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${(hoverRating || rating) >= star ? 'gold' : ''}`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </span>
            ))}
          </div>
          
          <textarea
            className="feedback-textarea"
            placeholder="Напишите ваш отзыв здесь..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          
          <button 
            className="submit-button"
            onClick={handleSubmit}
          >
            ОТПРАВИТЬ
          </button>
        </div>
      </div>
      
     {/* Правая часть - фотографии */}
<div 
  className="feedback-photos"
  style={{ 
    backgroundImage: `url(${process.env.PUBLIC_URL + '/фоны/Фон_Отзыв_Каталог.png'})` 
  }}
>
  <div className="feedback-gallery">
    {/* Верхний ряд - 2 больших прямоугольника */}
    <div className="gallery-row top-row">
      <div 
        className="photo-item large" 
        onClick={() => navigate('/feedback_catalog', { state: { category: 'upperClothing' } })}
      >
        <div className="add-photo-placeholder">
          <span className="plus-icon"><img src="/pic/Кнопка_ДобавитьФото_.png" alt="" /></span>
          <span>Добавить фото</span>
        </div>
      </div>
      <div 
        className="photo-item large" 
        onClick={() => navigate('/feedback_catalog', { state: { category: 'upper' } })}
      >
        <div className="add-photo-placeholder">
          <span className="plus-icon"><img src="/pic/Кнопка_ДобавитьФото_.png" alt="" /></span>
          <span>Добавить фото</span>
        </div>
      </div>
    </div>
    
    {/* Нижний ряд */}
    <div className="gallery-row bottom-row">
      {/* Левый большой прямоугольник (низ) */}
      <div 
        className="photo-item large" 
        onClick={() => navigate('/feedback_catalog', { state: { category: 'lower' } })}
      >
        <div className="add-photo-placeholder">
          <span className="plus-icon">+</span>
        </div>
      </div>
      
      {/* Правый столбец */}
      <div className="right-column">
        {/* Средний прямоугольник (обувь) */}
        <div 
          className="photo-item medium" 
          onClick={() => navigate('/feedback_catalog', { state: { category: 'footwear' } })}
        >
          <div className="add-photo-placeholder">
            <span className="plus-icon"><img src="/pic/Кнопка_ДобавитьФото_.png" alt="" /></span>
          </div>
        </div>
        
        {/* Нижние 3 маленьких прямоугольника */}
        <div className="small-items-row">
          {/* Головной убор */}
          <div 
            className="photo-item small" 
            onClick={() => navigate('/feedback_catalog', { state: { category: 'headwear' } })}
          >
            <div className="add-photo-placeholder">
              <span className="plus-icon"><img src="/pic/Кнопка_ДобавитьФото_.png" alt="" /></span>
            </div>
          </div>
          
          {/* Аксессуары (2 элемента) */}
          {[1, 2].map(item => (
            <div 
              key={item} 
              className="photo-item small" 
              onClick={() => navigate('/feedback_catalog', { state: { category: 'accessories' } })}
            >
              <div className="add-photo-placeholder">
                <span className="plus-icon"><img src="/pic/Кнопка_ДобавитьФото_.png" alt="" /></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}

export default FeedbackPage;