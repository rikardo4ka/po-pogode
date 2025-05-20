import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CatalogPage.css';

function CatalogPage() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [tempPhoto, setTempPhoto] = useState(null); // Временное фото для preview
  const [photos, setPhotos] = useState([]); // Постоянные фото в сетке
  const [currentPage, setCurrentPage] = useState(0);
  const fileInputRef = useRef(null);

  // Предметы для категории "Низ"
  const bottomItems = [
    { id: 1, name: 'Брюки' },
    { id: 2, name: 'Джинсы' },
    { id: 3, name: 'Юбка' },
    { id: 4, name: 'Шорты' },
    { id: 5, name: 'Утепленные брюки' }
  ];

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
                <span className="plus-icon">+</span>
                <span>Добавить фото</span>
              </div>
            )}
          </div>
          
          <div className="category-selection">
            <h2 className="category-title">НИЗ</h2>
            <div className="radio-items">
              {bottomItems.map(item => (
                <label key={item.id} className="radio-item">
                  <input
                    type="radio"
                    name="bottomItem"
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
              <img src={process.env.PUBLIC_URL + "/pic/стрелка.png"} alt="Назад" />
            </button>
            <span className="page-number">Страница {currentPage + 1}</span>
            <button 
              className="pagination-arrow right-arrow"
              onClick={handleNextPage}
              disabled={(currentPage + 1) * 4 >= photos.length}
            >
              <img src={process.env.PUBLIC_URL + "/pic/стрелка.png"} alt="Вперед" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogPage;