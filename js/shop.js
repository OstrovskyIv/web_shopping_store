document.addEventListener("DOMContentLoaded", function() {
    // Инициализация рейтинга товаров с поддержкой дробных значений
    const ratingContainers = document.querySelectorAll(".rating");
    
    ratingContainers.forEach(container => {
        const stars = container.querySelectorAll(".star");
        const ratingValue = container.querySelector(".rating-value");
        const currentRating = parseFloat(ratingValue.textContent);
        
        // Очищаем предыдущие стили
        stars.forEach(star => {
            star.classList.remove("full", "partial");
            star.style.setProperty('--fill-percent', '0%');
        });

        // Заполняем звезды в соответствии с рейтингом
        stars.forEach((star, index) => {
            const starPosition = index + 1;
            
            if (currentRating >= starPosition) {
                // Полностью заполненная звезда
                star.classList.add("full");
            } else if (currentRating > starPosition - 1) {
                // Частично заполненная звезда
                star.classList.add("partial");
                const fillPercent = (currentRating - (starPosition - 1)) * 100;
                star.style.setProperty('--fill-percent', `${fillPercent}%`);
            }
        });
        
        // Обработка кликов по звездам
        stars.forEach(star => {
            star.addEventListener("click", function() {
                const newRating = parseInt(this.getAttribute("data-rating"));
                
                stars.forEach((s, idx) => {
                    const starPos = idx + 1;
                    s.classList.remove("full", "partial");
                    s.style.setProperty('--fill-percent', '0%');
                    
                    if (newRating >= starPos) {
                        s.classList.add("full");
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
                name: productName,
                image: productImage,
                price: productPrice,
                quantity: 1
            });
            
            closeProductModal();
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

// Функция добавления товара в корзину
function addToBasket(product) {
    // Получаем текущую корзину из localStorage
    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    
    // Проверка валидности объекта товара
    if (!product || !product.name || typeof product.price !== 'number') {
        console.error('Invalid product object:', product);
        showToast('Ошибка добавления товара');
        return;
    }

    // Создаем ключ для сравнения товаров (на основе имени и цены)
    const productKey = `${product.name.toLowerCase()}_${product.price}`;
    
    // Поиск существующего товара
    const existingIndex = basket.findIndex(item => 
        `${item.name.toLowerCase()}_${item.price}` === productKey
    );

    if (existingIndex > -1) {
        // Обновление количества существующего товара
        basket[existingIndex].quantity += product.quantity || 1;
        showToast(`Количество "${product.name}" обновлено: ${basket[existingIndex].quantity}`);
    } else {
        // Добавление нового товара с базовым ID
        const basketItem = {
            id: Date.now().toString(),
            name: product.name,
            image: product.image || 'images/default-product.png',
            price: parseFloat(product.price.toFixed(2)),
            quantity: Math.min(Math.max(1, product.quantity || 1), 999)
        };
        basket.push(basketItem);
        showToast(`"${product.name}" добавлен в корзину!`);
    }

    localStorage.setItem('basket', JSON.stringify(basket));
    updateBasketCounter();
    
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

// Функции для экскурсий
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