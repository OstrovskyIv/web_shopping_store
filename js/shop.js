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
  return productName.toLowerCase().replace(/\s+/g, '-');
}

function addToBasket(product) {
  let basket = JSON.parse(localStorage.getItem('basket')) || [];
  const existingItemIndex = basket.findIndex(item => item.id === product.id);
  
  if (existingItemIndex !== -1) {
      // Товар уже есть - увеличиваем количество
      basket[existingItemIndex].quantity += 1;
      showToast(`Количество "${product.name}" увеличено до ${basket[existingItemIndex].quantity}`);
  } else {
      // Новый товар - добавляем
      basket.push(product);
      showToast(`"${product.name}" добавлен в корзину!`);
  }
  
  localStorage.setItem('basket', JSON.stringify(basket));
  updateBasketCounter();
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