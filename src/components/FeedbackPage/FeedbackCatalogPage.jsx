import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FeedbackCatalogPage.css';

function FeedbackCatalogPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState({
    upperClothing: null,
    upper: null,
    lower: null,
    footwear: null,
    headwear: null,
    accessories: null
  });

  // Определяем категорию на основе того, какой элемент был кликнут
  const getCategory = () => {
    if (location.state?.category) {
      return location.state.category;
    }
    return 'upper'; // значение по умолчанию
  };

  const category = getCategory();
  
  // Моковые данные для разных категорий
  const categoryPhotos = {
    'upperClothing': [
      { id: 1, preview: '/одежда_пнг/ж_гард/верх_одежда/демисезон.png' },
      { id: 2, preview: '/одежда_пнг/ж_гард/верх_одежда/зимняя_куртка.png' },
      { id: 3, preview: '/одежда_пнг/ж_гард/верх_одежда/пальто.png' }
    ],
    'upper': [
      { id: 1, preview: '/одежда_пнг/ж_гард/верх/футболка.png' },
      { id: 2, preview: '/одежда_пнг/ж_гард/верх/майка.png' },
      { id: 3, preview: '/одежда_пнг/ж_гард/верх/водолазка1.png' },
      { id: 4, preview: '/одежда_пнг/ж_гард/верх/толстовка.png' },
      { id: 5, preview: '/одежда_пнг/ж_гард/верх/водолазка2.png' }
    ],
    'lower': [
      { id: 1, preview: '/одежда_пнг/ж_гард/низ/джинсы1.png' },
      { id: 2, preview: '/одежда_пнг/ж_гард/низ/джинсы2.png' },
      { id: 3, preview: '/одежда_пнг/ж_гард/низ/юбка.png' },
      { id: 4, preview: '/одежда_пнг/ж_гард/низ/шорты.png' }
    ],
    'footwear': [
      { id: 1, preview: '/одежда_пнг/ж_гард/обувь/кроссовки.png' },
      { id: 2, preview: '/одежда_пнг/ж_гард/обувь/ботинки1.png' },
      { id: 3, preview: '/одежда_пнг/ж_гард/обувь/туфли.png' },
      { id: 4, preview: '/одежда_пнг/ж_гард/обувь/сандалии.png' }
    ],
    'headwear': [
      { id: 1, preview: '/одежда_пнг/ж_гард/голова/шапка.png' },
      { id: 2, preview: '/одежда_пнг/ж_гард/голова/кепка.png' },
      { id: 3, preview: '/одежда_пнг/ж_гард/голова/шляпа.png' }
    ],
    'accessories': [
      { id: 1, preview: '/одежда_пнг/ж_гард/аксессуары/шарф.png' },
      { id: 2, preview: '/одежда_пнг/ж_гард/аксессуары/перчатки.png' },
      { id: 3, preview: '/одежда_пнг/ж_гард/аксессуары/очки.png' },
      { id: 4, preview: '/одежда_пнг/ж_гард/аксессуары/зонт.png' }
    ]
  };

  const photos = categoryPhotos[category] || [];

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (photos.length > (prev + 1) * 4 ? prev + 1 : prev));
  };

  const handlePhotoSelect = (photo) => {
    setSelectedPhotos(prev => ({
      ...prev,
      [category]: photo.preview
    }));
  };

  const renderPhotoPlaceholder = (category) => {
    if (selectedPhotos[category]) {
      return (
        <img 
          src={process.env.PUBLIC_URL + selectedPhotos[category]} 
          alt="Выбранный предмет" 
          className="selected-photo"
        />
      );
    }
    return (
      <div className="add-photo-placeholder">
        <span className="plus-icon"><img src="/pic/Кнопка_ДобавитьФото_.png" alt="" /></span>
        {category === 'upperClothing' || category === 'upper' ? (
          <span>Добавить фото</span>
        ) : null}
      </div>
    );
  };

  return (
    <div className="feedback-catalog-container">
      {/* Левая часть - правая сторона CatalogPage */}
      <div className="catalog-right-side">
        <div className="photos-grid">
          {photos.slice(currentPage * 4, (currentPage + 1) * 4).map(photo => (
            <div 
              key={photo.id} 
              className="photo-item"
              onClick={() => handlePhotoSelect(photo)}
            >
              <div className="photo-container">
                <img src={process.env.PUBLIC_URL + photo.preview} alt="Фото предмета" />
              </div>
            </div>
          ))}
        </div>

        {photos.length > 4 && (
          <div className="pagination-controls">
            <button 
              className="pagination-arrow"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              <img src={process.env.PUBLIC_URL + "/pic/Кнопка_Лист_Назад_.png"} alt="Назад" />
            </button>
            <span className="page-number">Страница {currentPage + 1}</span>
            <button 
              className="pagination-arrow right-arrow"
              onClick={handleNextPage}
              disabled={(currentPage + 1) * 4 >= photos.length}
            >
              <img src={process.env.PUBLIC_URL + "/pic/Кнопка_Лист_Назад_.png"} alt="Вперед" />
            </button>
          </div>
        )}
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
              {renderPhotoPlaceholder('upperClothing')}
            </div>
            <div 
              className="photo-item large" 
              onClick={() => navigate('/feedback_catalog', { state: { category: 'upper' } })}
            >
              {renderPhotoPlaceholder('upper')}
            </div>
          </div>
          
          {/* Нижний ряд */}
          <div className="gallery-row bottom-row">
            {/* Левый большой прямоугольник (низ) */}
            <div 
              className="photo-item large" 
              onClick={() => navigate('/feedback_catalog', { state: { category: 'lower' } })}
            >
              {renderPhotoPlaceholder('lower')}
            </div>
            
            {/* Правый столбец */}
            <div className="right-column">
              {/* Средний прямоугольник (обувь) */}
              <div 
                className="photo-item medium" 
                onClick={() => navigate('/feedback_catalog', { state: { category: 'footwear' } })}
              >
                {renderPhotoPlaceholder('footwear')}
              </div>
              
              {/* Нижние 3 маленьких прямоугольника */}
              <div className="small-items-row">
                {/* Головной убор */}
                <div 
                  className="photo-item small" 
                  onClick={() => navigate('/feedback_catalog', { state: { category: 'headwear' } })}
                >
                  {renderPhotoPlaceholder('headwear')}
                </div>
                
                {/* Аксессуары (2 элемента) */}
                {[1, 2].map(item => (
                  <div 
                    key={item}
                    className="photo-item small" 
                    onClick={() => navigate('/feedback_catalog', { state: { category: 'accessories' } })}
                  >
                    {renderPhotoPlaceholder('accessories')}
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

export default FeedbackCatalogPage;