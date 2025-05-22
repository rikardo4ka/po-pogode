import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Добавлен useLocation
import './FeedbackPage.css';
import '../CatalogPage/CatalogPage.css';

function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Состояние для выбранных фотографий
  const [selectedPhotos, setSelectedPhotos] = useState({
    upperClothing: null,
    upper: null,
    lower: null,
    footwear: null,
    headwear: null,
    accessories: [null, null]
  });

  // Обновление состояния при возврате из каталога
  useEffect(() => {
    if (location.state?.selectedPhotos) {
      setSelectedPhotos(location.state.selectedPhotos);
    }
  }, [location.state]);

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Валидация данных
    if (!rating || rating < 1 || rating > 5) {
      alert('Пожалуйста, выберите оценку от 1 до 5 звезд');
      return;
    }

    if (!feedbackText.trim()) {
      alert('Пожалуйста, напишите текст отзыва');
      return;
    }
    
    const sanitizedItems = Object.entries(selectedPhotos).reduce((acc, [key, value]) => {
      if (value) {
        // Обрабатываем массив accessories отдельно
        if (key === 'accessories') {
          acc[key] = value.map(item => 
            item ? String(item).split('/').pop() : null
          );
        } else {
          acc[key] = String(value).split('/').pop();
        }
      }
      return acc;
    }, {});

    const response = await fetch('http://localhost:8080/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        rating: rating,
        text: feedbackText,
        items: JSON.stringify(sanitizedItems)
      })
    });
    

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка сервера');
    }

    navigate('/weather');
  } catch (error) {
    console.error('Ошибка:', error);
    alert(error.message || 'Ошибка при отправке отзыва');
  }
};
  // Функция отображения фото/плейсхолдера
  const renderPhoto = (category, index = -1) => {
    const photoUrl = index >= 0 
      ? selectedPhotos.accessories[index]
      : selectedPhotos[category];

    if (photoUrl) {
      return (
        <img 
          src={photoUrl} 
          alt="Selected item" 
          className="selected-photo"
        />
      );
    }
    
    // Возвращаем плейсхолдер если фото нет
    return (
      <div className="add-photo-placeholder">
        <span className="plus-icon">
          <img 
            src={process.env.PUBLIC_URL + "/pic/Кнопка_ДобавитьФото_.png"} 
            alt="Добавить фото" 
          />
        </span>
      </div>
    );
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
          {/* Верхний ряд */}
          <div className="gallery-row top-row">
            <div 
              className="photo-item large" 
              onClick={() => navigate('/feedback_catalog', { 
                state: { 
                  category: 'upperClothing',
                  selectedPhotos 
                } 
              })}
            >
              {renderPhoto('upperClothing')}
            </div>
            <div 
              className="photo-item large" 
              onClick={() => navigate('/feedback_catalog', { 
                state: { 
                  category: 'upper',
                  selectedPhotos 
                } 
              })}
            >
              {renderPhoto('upper')}
            </div>
          </div>
          
          {/* Нижний ряд */}
          <div className="gallery-row bottom-row">
            <div 
              className="photo-item large" 
              onClick={() => navigate('/feedback_catalog', { 
                state: { 
                  category: 'lower',
                  selectedPhotos 
                } 
              })}
            >
              {renderPhoto('lower')}
            </div>
            
            <div className="right-column">
              <div 
                className="photo-item medium" 
                onClick={() => navigate('/feedback_catalog', { 
                  state: { 
                    category: 'footwear',
                    selectedPhotos 
                  } 
                })}
              >
                {renderPhoto('footwear')}
              </div>
              
              <div className="small-items-row">
                <div 
                  className="photo-item small" 
                  onClick={() => navigate('/feedback_catalog', { 
                    state: { 
                      category: 'headwear',
                      selectedPhotos 
                    } 
                  })}
                >
                  {renderPhoto('headwear')}
                </div>
                
                {/* Аксессуары с индексами */}
              {[0, 1].map(index => (
          <div 
    key={index}
    className="photo-item small" 
    onClick={() => navigate('/feedback_catalog', { 
      state: { 
        category: 'accessories',
        accessoryIndex: index, // Добавлен индекс
        selectedPhotos 
      } 
             })}
        >
          {renderPhoto('accessories', index)}
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