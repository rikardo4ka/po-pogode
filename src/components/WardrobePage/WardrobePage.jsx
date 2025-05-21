import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './WardrobePage.css';

function WardrobePage() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState({ view: 'main', category: null });
  const [selectedItem, setSelectedItem] = useState(null);
  const fileInputRef = useRef(null);
  
  // Фоны для разных состояний
  const backgrounds = {
    main: process.env.PUBLIC_URL + '/фоны/фон-гард.png',
    outerwear: process.env.PUBLIC_URL + '/фоны/гардероб_верхОдежда.png',
    top: process.env.PUBLIC_URL + '/фоны/гардероб_верх.png',
    bottom: process.env.PUBLIC_URL + '/фоны/гардероб_низ.png',
    shoes: process.env.PUBLIC_URL + '/фоны/гардероб_обувь.png',
    hats: process.env.PUBLIC_URL + '/фоны/гардероб_голова.png',
    accessories: process.env.PUBLIC_URL + '/фоны/гардероб_аксессуары.png'
  };

  // Категории гардероба с разными иконками для главной и категорий
  const categories = [
    { 
      id: 0, 
      name: 'ВЕРХНЯЯ ОДЕЖДА', 
      mainIcon: '/иконки_гардероба/верхняяОдежда_Default.png',
      categoryIcon: '/иконки_гардероба/верхняяОдежда.png'
    },
    { 
      id: 1, 
      name: 'ВЕРХ', 
      mainIcon: '/иконки_гардероба/верх_Default.png',
      categoryIcon: '/иконки_гардероба/Верх.png'
    },
    { 
      id: 2, 
      name: 'НИЗ', 
      mainIcon: '/иконки_гардероба/низ_Default.png',
      categoryIcon: '/иконки_гардероба/Низ.png'
    },
    { 
      id: 3, 
      name: 'ОБУВЬ', 
      mainIcon: '/иконки_гардероба/обувь_Default.png',
      categoryIcon: '/иконки_гардероба/Обувь.png'
    },
    { 
      id: 4, 
      name: 'ГОЛОВНЫЕ УБОРЫ', 
      mainIcon: '/иконки_гардероба/головныеУборы_Default.png',
      categoryIcon: '/иконки_гардероба/головныеУборы.png'
    },
    { 
      id: 5, 
      name: 'АКСЕССУАРЫ', 
      mainIcon: '/иконки_гардероба/аксессуары_Default.png',
      categoryIcon: '/иконки_гардероба/Аксессуары.png'
    }
  ];

  // Предметы для всех категорий
  const categoryItems = [
    [ // Верхняя одежда (0)
      { id: 1, name: 'Зимняя куртка' },
      { id: 2, name: 'Демисезон' },
      { id: 3, name: 'Пальто' },
      { id: 4, name: 'Ветровка' }
    ],
    [ // Верх (1)
      { id: 1, name: 'Майка' },
      { id: 2, name: 'Футболка' },
      { id: 3, name: 'Водолазка' },
      { id: 4, name: 'Толстовка' }
    ],
    [ // Низ (2)
      { id: 1, name: 'Брюки' },
      { id: 2, name: 'Джинсы' },
      { id: 3, name: 'Юбка' },
      { id: 4, name: 'Шорты' }
    ],
    [ // Обувь (3)
      { id: 1, name: 'Кроссовки' },
      { id: 2, name: 'Ботинки' },
      { id: 3, name: 'Туфли' },
      { id: 4, name: 'Сандалии' }
    ],
    [ // Головные уборы (4)
      { id: 1, name: 'Шапка' },
      { id: 2, name: 'Шляпа' },
      { id: 3, name: 'Кепка' }
    ],
    [ // Аксессуары (5)
      { id: 1, name: 'Шарф' },
      { id: 2, name: 'Перчатки' },
      { id: 3, name: 'Солнечные очки' },
      { id: 4, name: 'Зонт' }
    ]
  ];

  const handleCategoryClick = (categoryId) => {
    setCurrentView({ view: 'category', category: categoryId });
    setSelectedItem(null);
  };

  const handleBackClick = () => {
    if (currentView.view === 'category') {
      setCurrentView({ view: 'main', category: null });
    } else {
      navigate(-1);
    }
  };

  const handleItemSelect = (itemId) => {
    setSelectedItem(itemId);
  };

  const handleAddPhotoClick = () => {
  if (!selectedItem) return;
  
  const categoryMap = {
    0: 'outerwear',
    1: 'top',
    2: 'bottom', 
    3: 'footwear',
    4: 'headwear',
    5: 'accessories'
  };
  
  navigate('/catalog', { 
    state: { 
      category: categoryMap[currentView.category],
      itemId: selectedItem
    }
  });
};

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Файл для загрузки:', file);
      console.log('Категория:', categories[currentView.category]?.name);
      console.log('Предмет:', categoryItems[currentView.category]?.find(item => item.id === selectedItem)?.name);
    }
  };

  const getBackground = () => {
    if (currentView.view === 'main') return backgrounds.main;
    switch(currentView.category) {
      case 0: return backgrounds.outerwear;
      case 1: return backgrounds.top;
      case 2: return backgrounds.bottom;
      case 3: return backgrounds.shoes;
      case 4: return backgrounds.hats;
      case 5: return backgrounds.accessories;
      default: return backgrounds.main;
    }
  };

  return (
    <div 
      className={`wardrobe-page ${currentView.view === 'category' ? 'zoom-effect' : ''}`} 
      style={{ backgroundImage: `url(${getBackground()})` }}
    >
      {currentView.view === 'main' ? (
        <div className="wardrobe-icons-container">
          {categories.map((category) => (
            <button 
              key={category.id} 
              className="wardrobe-icon-button"
              onClick={() => handleCategoryClick(category.id)}
              style={{ backgroundImage: `url(${process.env.PUBLIC_URL + category.mainIcon})` }}
              aria-label={category.name}
            />
          ))}
          
        </div>
      ) : (
        <div className="items-selection-container">
          <h2 className="items-title">
            <img 
              src={process.env.PUBLIC_URL + categories[currentView.category]?.categoryIcon} 
              alt="" 
              className="category-icon-title"
            />
            {categories[currentView.category]?.name}
          </h2>
          
          <div className="radio-items-container">
            {categoryItems[currentView.category]?.map((item) => (
              <label key={item.id} className="radio-item">
                <input
                  type="radio"
                  name="wardrobeItem"
                  value={item.id}
                  checked={selectedItem === item.id}
                  onChange={() => handleItemSelect(item.id)}
                />
                <span className="radio-custom"></span>
                <span className="item-name">{item.name}</span>
              </label>
            ))}
          </div>
          
          <button 
            className="add-photo-button"
            onClick={handleAddPhotoClick}
            disabled={!selectedItem}
          >
            ДОБАВИТЬ ФОТО
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      )}
      <button className="back-button" onClick={handleBackClick}>
        <img src={process.env.PUBLIC_URL + "/pic/назад_Default.png"} alt="Назад" />
      </button>
      {/* РЕАЛИЗОВАТЬ СОХРАНЕНИЕ */}
      <button className="save-button" onClick={handleBackClick}>
        <img src={process.env.PUBLIC_URL + "/pic/Иконка_Сохранить.png"} alt="Сохранить" />
      </button>
    </div>
  );
}

export default WardrobePage;