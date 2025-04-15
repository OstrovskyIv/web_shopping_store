document.addEventListener("DOMContentLoaded", function() {
  // Инициализация рейтинга товаров
  const ratingContainers = document.querySelectorAll(".rating");
  
  ratingContainers.forEach(container => {
      const stars = container.querySelectorAll(".star");
      const ratingValue = container.querySelector(".rating-value");
      let currentRating = parseFloat(ratingValue.textContent);
      
      // Инициализация звезд по умолчанию
      stars.forEach(star => {
          const starValue = parseInt(star.getAttribute("data-rating"));
          
          if (starValue <= Math.round(currentRating)) {
              star.classList.add("active");
          }
      });
      
      // Обработка кликов по звездам
      stars.forEach(star => {
          star.addEventListener("click", function() {
              const newRating = parseInt(this.getAttribute("data-rating"));
              
              stars.forEach((s, index) => {
                  if (index < newRating) {
                      s.classList.add("active");
                  } else {
                      s.classList.remove("active");
                  }
              });
              
              ratingValue.textContent = newRating.toFixed(1);
              console.log(`Пользователь поставил оценку: ${newRating} для товара`);
          });
      });
  });

  // Обработчики для кнопок "Заказать"
  const orderButtons = document.querySelectorAll(".order-btn");
  orderButtons.forEach(button => {
      button.addEventListener("click", function() {
          const productCard = this.closest(".product-card");
          const productName = productCard.querySelector("h3").textContent;
          const productImage = productCard.querySelector(".product-image img").src;
          const productPrice = parseFloat(this.closest(".product-info").querySelector(".details-btn").getAttribute("data-price"));
          
          addToBasket({
              id: generateProductId(productName),
              name: productName,
              image: productImage,
              price: productPrice,
              quantity: 1
          });
      });
  });

  // Инициализация ночного режима
  initNightMode();
  
  // Инициализация счетчика корзины
  updateBasketCounter();
  
  // Обработчики для кнопок "Подробнее"
  const detailsButtons = document.querySelectorAll('.details-btn');
  detailsButtons.forEach(button => {
      button.addEventListener('click', function() {
          const card = this.closest('.product-card');
          const name = card.querySelector('h3').textContent;
          const image = card.querySelector('.product-image img').src;
          const description = this.getAttribute('data-description');
          const price = this.getAttribute('data-price');
          
          showProductDetails(name, image, description, price);
      });
  });

  // Обработчик для кнопки "В корзину" в модальном окне
  const modalOrderBtn = document.querySelector('.modal-order-btn');
  if (modalOrderBtn) {
      modalOrderBtn.addEventListener('click', function() {
          const modal = document.getElementById('productModal');
          const productName = document.getElementById('productModalTitle').textContent;
          const productImage = document.getElementById('productModalImage').src;
          const productPriceText = document.getElementById('productModalPrice').textContent;
          const productPrice = parseFloat(productPriceText.replace('Цена: ', '').replace(' $.', ''));
          
          addToBasket({
              id: generateProductId(productName),
              name: productName,
              image: productImage,
              price: productPrice,
              quantity: 1
          });
          
          closeProductModal(); // Закрываем модалку после добавления
      });
  }
  
  // Закрытие модального окна при клике вне его
  window.addEventListener('click', function(event) {
      const modal = document.getElementById('productModal');
      if (event.target === modal) {
          closeProductModal();
      }
  });
});

// Функции для работы с корзиной
function generateProductId(productName) {
    return productName.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-zа-яё0-9-]/g, '') // Добавлена поддержка кириллицы
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + Date.now().toString(36); // Добавление временной метки
}

function addToBasket(product) {
    // Получаем текущую корзину из localStorage
    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    
    // Проверка валидности объекта товара
    if (!product || !product.name || typeof product.price !== 'number') {
        console.error('Invalid product object:', product);
        showToast('Ошибка добавления товара');
        return;
    }

    // Генерация уникального ID с временной меткой
    const generateProductId = (name) => {
        return `${name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-zа-яё0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')}-${Date.now().toString(36)}`;
    };

    // Создаем объект товара с обязательными полями
    const basketItem = {
        id: product.id || generateProductId(product.name),
        name: product.name,
        image: product.image || 'images/default-product.png',
        price: parseFloat(product.price.toFixed(2)),
        quantity: Math.min(Math.max(1, product.quantity || 1), 999)
    };

    // Поиск существующего товара
    const existingIndex = basket.findIndex(item => 
        item.id === basketItem.id && 
        item.price === basketItem.price
    );

    if (existingIndex > -1) {
        // Обновление количества
        basket[existingIndex].quantity = Math.min(
            basket[existingIndex].quantity + (product.quantity || 1),
            999
        );
        showToast(`Количество "${product.name}" обновлено: ${basket[existingIndex].quantity}`);
    } else {
        // Добавление нового товара
        basket.push(basketItem);
        showToast(`"${product.name}" добавлен в корзину!`);
    }

    // Сохраняем обновленную корзину
    localStorage.setItem('basket', JSON.stringify(basket));
    updateBasketCounter();
    
    // Обновляем связанные вкладки
    if (window.location.pathname.includes('basket.html')) {
        updateBasketDisplay();
    }
}

// Функция обновления счетчика корзины
function updateBasketCounter() {
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
    const basketLinks = document.querySelectorAll('nav ul li a[href="basket.html"]');
    
    basketLinks.forEach(link => {
        let counter = link.querySelector('.basket-counter');
        
        if (!counter) {
            counter = document.createElement('span');
            counter.className = 'basket-counter';
            link.appendChild(counter);
        }
        
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'inline-block' : 'none';
    });
  }
  
  // Обновляем счетчик при загрузке страницы
  document.addEventListener('DOMContentLoaded', updateBasketCounter);
  
  // Обновляем счетчик при изменениях в других вкладках
  window.addEventListener('storage', function(e) {
    if (e.key === 'basket') {
        updateBasketCounter();
    }
  });

// Функции для модального окна товара
function showProductDetails(name, image, description, price) {
  const modal = document.getElementById('productModal');
  document.getElementById('productModalTitle').textContent = name;
  document.getElementById('productModalImage').src = image;
  document.getElementById('productModalDescription').textContent = description;
  document.getElementById('productModalPrice').textContent = `Цена: ${price} $.`;
  modal.style.display = 'block';
}

function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
}

// Вспомогательные функции
function initNightMode() {
  if (document.body.classList.contains('night-mode')) {
      document.body.style.backgroundColor = '#111';
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
      toast.remove();
  }, 3000);
}

// Модальное окно для отзывов
function showReviewModal(productName, currentRating) {
    const modal = document.createElement('div');
    modal.className = 'review-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-review">&times;</span>
            <h2>Оставить отзыв: ${productName}</h2>
            
            <div class="your-rating">
                <h3>Ваша оценка:</h3>
                <div class="rating-stars">
                    <span class="star" data-rating="1">★</span>
                    <span class="star" data-rating="2">★</span>
                    <span class="star" data-rating="3">★</span>
                    <span class="star" data-rating="4">★</span>
                    <span class="star" data-rating="5">★</span>
                </div>
            </div>
            
            <div class="review-form">
                <textarea placeholder="Ваш отзыв..." rows="5"></textarea>
                <button class="submit-review">Отправить отзыв</button>
            </div>
            
            <div class="other-reviews">
                <h3>Другие отзывы:</h3>
                <div class="reviews-list">
                    <div class="review">
                        <div class="review-author">Иван Иванов</div>
                        <div class="review-rating">★★★★★</div>
                        <div class="review-text">Отличный товар, всем рекомендую!</div>
                        <div class="review-date">01.01.2023</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Обработчики событий
    modal.querySelector('.close-review').addEventListener('click', () => {
        modal.remove();
    });
    
    // Инициализация звезд
    const stars = modal.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, idx) => {
                s.classList.toggle('active', idx < rating);
            });
        });
    });
    
    // Отправка отзыва
    modal.querySelector('.submit-review').addEventListener('click', () => {
        const text = modal.querySelector('textarea').value;
        if (!text) {
            alert('Пожалуйста, напишите отзыв');
            return;
        }
        alert('Отзыв отправлен! Спасибо!');
        modal.remove();
    });
}

// В обработчике клика по звездам добавьте:
star.addEventListener('click', function() {
    const productCard = this.closest('.product-card');
    const productName = productCard.querySelector('h3').textContent;
    showReviewModal(productName, newRating);
});

document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.excursion-card');
        const name = card.querySelector('h3').textContent;
        const image = card.querySelector('.product-image img').src;
        const price = card.querySelector('.price').textContent;
        
        showExcursionModal(name, image, price);
    });
});

function showExcursionModal(name, image, price) {
    const modal = document.getElementById('excursionModal');
    document.getElementById('excursionModalTitle').textContent = name;
    document.getElementById('excursionModalImage').src = image;
    document.getElementById('excursionModalPrice').textContent = `Цена: ${price}`;
    
    // Заполняем места остановок (пример)
    const stopsList = document.getElementById('excursionStops');
    stopsList.innerHTML = `
        <li>Главная площадь</li>
        <li>Исторический музей</li>
        <li>Старый город</li>
        <li>Смотровая площадка</li>
    `;
    
    // Заполняем отзывы (пример)
    const reviewsList = document.getElementById('excursionReviews');
    reviewsList.innerHTML = `
        <div class="review">
            <div class="review-author">Анна</div>
            <div class="review-rating">★★★★★</div>
            <div class="review-text">Отличная экскурсия, гид очень знающий!</div>
            <div class="review-date">15.05.2023</div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeExcursionModal() {
    document.getElementById('excursionModal').style.display = 'none';
}

// В basket.js в handleFormSubmit после успешного оформления:
const order = {
    id: Date.now(),
    date: new Date().toLocaleDateString(),
    items: basket,
    total: totalPrice,
    status: 'В обработке'
};
const orders = JSON.parse(localStorage.getItem('orders')) || [];
orders.push(order);
localStorage.setItem('orders', JSON.stringify(orders));

// В shop.js для экскурсий:
document.querySelector('.book-excursion-btn').addEventListener('click', function() {
    const excursion = {
        id: Date.now(),
        name: document.getElementById('excursionModalTitle').textContent,
        date: 'Выберите дату', // Можно добавить выбор даты
        guide: document.getElementById('excursionGuides').selectedOptions[0].text,
        status: 'Забронировано'
    };
    
    const excursions = JSON.parse(localStorage.getItem('excursions')) || [];
    excursions.push(excursion);
    localStorage.setItem('excursions', JSON.stringify(excursions));
    
    alert('Экскурсия забронирована!');
    closeExcursionModal();
});

