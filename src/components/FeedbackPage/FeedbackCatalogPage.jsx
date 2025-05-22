import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FeedbackCatalogPage.css';

function FeedbackCatalogPage() {
   const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [selectedPhotos, setSelectedPhotos] = useState(
    location.state?.selectedPhotos || {
      upperClothing: null,
      upper: null,
      lower: null,
      footwear: null,
      headwear: null,
      accessories: [null, null]
    }
  );

  // Маппинг категорий фронтенда на бэкенд
  const categoryMapping = {
    upperClothing: 'OUTERWEAR',
    upper: 'TOP',
    lower: 'BOTTOM',
    footwear: 'FOOTWEAR',
    headwear: 'HEADWEAR',
    accessories: 'ACCESSORIES'
  };
  

  // Определяем категорию на основе того, какой элемент был кликнут
  const getCategory = () => location.state?.category || 'upper';
  const category = getCategory();
  const backendCategory = categoryMapping[category];
  
    useEffect(() => {
    const loadWardrobe = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const response = await fetch(
          `http://localhost:8080/api/wardrobe/${backendCategory}`, 
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) throw new Error('Failed to load wardrobe');
        
        const data = await response.json();
        setPhotos(data.map(item => ({
          ...item,
          preview: `http://localhost:8080/uploads/${item.filePath}`
        })));
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWardrobe();
  }, [backendCategory]);  

 

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (photos.length > (prev + 1) * 4 ? prev + 1 : prev));
  };

     const handlePhotoSelect = (photo) => {
    const updatedPhotos = { ...selectedPhotos };
    const accessoryIndex = location.state?.accessoryIndex;

    if (typeof accessoryIndex === 'number') {
      updatedPhotos.accessories[accessoryIndex] = photo.preview;
    } else {
      updatedPhotos[category] = photo.preview;
    }

    navigate('/feedback', { 
      state: { 
        selectedPhotos: updatedPhotos 
      } 
    });
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  const renderPhotoPlaceholder = (currentCategory, index = -1) => {
    let photoUrl;
    if (currentCategory === 'accessories') {
      photoUrl = selectedPhotos.accessories[index];
    } else {
      photoUrl = selectedPhotos[currentCategory];
    }

    if (photoUrl) {
      return (
        <div className="photo-container">
          <img 
            src={photoUrl} // Убрать process.env.PUBLIC_URL
            alt="Выбранный предмет" 
            className="selected-photo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: 'white'
            }}
          />
        </div>
      );
    }
    
     return (
      <div 
        className="add-photo-placeholder"
        style={{ backgroundColor: 'white' }}
      >
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
                
               {[0, 1].map(index => (
  <div 
    key={index}
    className="photo-item small" 
    onClick={() => navigate('/feedback_catalog', { 
      state: { 
        category: 'accessories',
        accessoryIndex: index,
        selectedPhotos 
      } 
    })}
  >
    {renderPhotoPlaceholder('accessories', index)}
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