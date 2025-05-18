import React, { useState } from 'react';
import './WeatherRecommendation.css';

function WeatherRecommendation({ onClose }) {
  const [items, setItems] = useState([
    { id: 1, name: 'Куртка', checked: false },
    { id: 2, name: 'Свитер', checked: true },
    { id: 3, name: 'Джинсы', checked: false },
    { id: 4, name: 'Кроссовки или ботинки', checked: false }
  ]);

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className="recommendation-overlay">
      <div className="recommendation-container">
        <h1 className="recommendation-title">По Погоде</h1>
        
        <div className="recommendation-list">
          <p className="recommendation-subtitle">Рекомендованный образ:</p>
          
          {items.map(item => (
            <div key={item.id} className="recommendation-item">
              <label>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.id)}
                />
                <span className="checkmark"></span>
                {item.name}
              </label>
            </div>
          ))}
        </div>

        <div className="recommendation-tip">
          <p>Совет: на улице прохладный ветер, лучше взять с собой шарф, чтобы не замерзнуть. Если планируете долго гулять, выберите удобную обувь.</p>
        </div>

        <div className="recommendation-buttons">
          <button className="close-button" onClick={onClose}>ЗАКРЫТЬ</button>
          <button className="feedback-button">ОСТАВИТЬ ОТЗЫВ</button>
        </div>
      </div>
    </div>
  );
}

export default WeatherRecommendation;