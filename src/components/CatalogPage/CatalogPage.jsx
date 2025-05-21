import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CatalogPage.css';

function CatalogPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [tempPhoto, setTempPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const fileInputRef = useRef(null);

  // Категории и их элементы
  const categories = {
    outerwear: [
      { id: 1, name: 'Зимняя куртка' },
      { id: 2, name: 'Демисезон' },
      { id: 3, name: 'Пальто' },
      { id: 4, name: 'Ветровка' }
    ],
    top: [
      { id: 1, name: 'Майка' },
      { id: 2, name: 'Футболка' },
      { id: 3, name: 'Водолазка' },
      { id: 4, name: 'Толстовка' }
    ],
    bottom: [
      { id: 1, name: 'Брюки' },
      { id: 2, name: 'Джинсы' },
      { id: 3, name: 'Юбка' },
      { id: 4, name: 'Шорты' }
    ],
    footwear: [
      { id: 1, name: 'Кроссовки' },
      { id: 2, name: 'Ботинки' },
      { id: 3, name: 'Туфли' },
      { id: 4, name: 'Сандалии' }
    ],
    headwear: [
      { id: 1, name: 'Шапка' },
      { id: 2, name: 'Шляпа' },
      { id: 3, name: 'Кепка' }
    ],
    accessories: [
      { id: 1, name: 'Шарф' },
      { id: 2, name: 'Перчатки' },
      { id: 3, name: 'Солнечные очки' },
      { id: 4, name: 'Зонт' }
    ]
  };

  // Определяем текущую категорию
  const currentCategory = location.state?.category || 'bottom';
  const categoryItems = categories[currentCategory] || [];
  const categoryTitles = {
    outerwear: 'ВЕРХНЯЯ ОДЕЖДА',
    top: 'ВЕРХ',
    bottom: 'НИЗ',
    footwear: 'ОБУВЬ',
    headwear: 'ГОЛОВНЫЕ УБОРЫ',
    accessories: 'АКСЕССУАРЫ'
  };

  // Устанавливаем выбранный элемент при загрузке
  useEffect(() => {
    if (location.state?.itemId) {
      setSelectedItem(location.state.itemId);
    }
  }, [location.state]);

  const handleItemSelect = (itemId) => {
    setSelectedItem(itemId);
  };

 const handleAddClick = () => {
    if (selectedItem && tempPhoto) {
      // Переносим фото из временного в постоянное хранилище
      setPhotos([...photos, tempPhoto]);
      setTempPhoto(null); // Очищаем временное фото
    }
  };

const handleAddPhotoClick = () => {
  fileInputRef.current.click();
};

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const photo = {
        id: Date.now(),
        file,
        preview: URL.createObjectURL(file)
      };
      setTempPhoto(photo); // Устанавливаем временное фото только в preview
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * 4 < photos.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="catalog-page">
      <div 
        className="left-half"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/фоны/Фон_Шкаф_Каталог.png)` }}
      >
        <div className="left-content-wrapper">
          <div 
            className="add-photo-cell"
            onClick={handleAddPhotoClick}
          >
            {tempPhoto ? (
              <div className="photo-preview-container">
                <img 
                  src={tempPhoto.preview} 
                  alt="Добавленное фото" 
                  className="uploaded-photo"
                />
              </div>
            ) : (
              <div className="add-photo-placeholder">
                <span className="plus-icon"><img src="/pic/Кнопка_ДобавитьФото_.png" alt="" /></span>
              </div>
            )}
          </div>
          
          <div className="category-selection">
            <h2 className="category-title">{categoryTitles[currentCategory]}</h2>
            
            <div className="radio-items">
              {categoryItems.map(item => (
                <label key={item.id} className="radio-item">
                  <input
                    type="radio"
                    name="categoryItem"
                    value={item.id}
                    checked={selectedItem === item.id}
                    onChange={() => handleItemSelect(item.id)}
                  />
                  <span className="radio-custom"></span>
                  <span className="item-name">{item.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="action-buttons">
          <button className="back-button-ctgr" onClick={handleBackClick}>
            НАЗАД
          </button>
          <button 
            className="add-button"
            onClick={handleAddClick}
            disabled={!selectedItem || !tempPhoto}
          >
            ДОБАВИТЬ
          </button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
       {/* Правая половина с загруженными фото */}
      <div className="right-half">
        <div className="photos-grid">
          {photos.slice(currentPage * 4, (currentPage + 1) * 4).map(photo => (
            <div key={photo.id} className="photo-item">
              <div className="photo-container">
                <img src={photo.preview} alt="Фото предмета" />
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
              <img src={process.env.PUBLIC_URL + "/pic/Кнопка_Лист_Назад_.png"} alt="Вперед"/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogPage;