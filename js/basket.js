// Инициализация корзины
let basket = JSON.parse(localStorage.getItem('basket')) || [];
let map;
let currentPlacemark;

// Функция для дебаунса (задержки выполнения)
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Загрузка API Яндекс.Карт
function loadYandexMap() {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=8ab80f75-7c79-4d7a-9a2f-f65185863093&lang=ru_RU';
    script.onload = function () {
        ymaps.ready(initMap);
    };
    document.head.appendChild(script);
}

// Инициализация карты
function initMap() {
    map = new ymaps.Map('map', {
        center: [55.751244, 37.618423],
        zoom: 10,
        controls: ['zoomControl'],
        behaviors: ['default', 'scrollZoom']
    });
    map.cursors.push('arrow');
}

// Поиск адреса на карте
function searchOnMap(country, city, address) {
    return new Promise((resolve, reject) => {
        const searchQuery = `${country}, ${city}, ${address}`;

        ymaps.geocode(searchQuery, { results: 1 }).then(res => {
            const firstGeoObject = res.geoObjects.get(0);
            if (!firstGeoObject) return reject('Адрес не найден');

            const coordinates = firstGeoObject.geometry.getCoordinates();
            const addressText = firstGeoObject.properties.get('text');

            if (currentPlacemark) map.geoObjects.remove(currentPlacemark);

            currentPlacemark = createAnimatedPlacemark(coordinates, addressText);
            map.geoObjects.add(currentPlacemark);
            map.setCenter(coordinates, address ? 17 : city ? 12 : 5, {
                duration: 600,
                timingFunction: 'easeOut'
            });

            resolve();
        }).catch(reject);
    });
}

// Создание анимированной метки
function createAnimatedPlacemark(coords, balloonText) {
    return new ymaps.Placemark(coords, {
        balloonContent: balloonText,
        hintContent: 'Выбранная точка'
    }, {
        iconLayout: 'default#imageWithContent',
        iconImageHref: 'https://yastatic.net/s3/mapsapi-icons/v1.0/placemark-blue.svg',
        iconImageSize: [40, 40],
        iconImageOffset: [-20, -40],
        iconContentOffset: [0, 0],
        iconContentLayout: null,
        openBalloonOnClick: true
    });
}

// Живое геокодирование при вводе адреса
function initLiveGeocoding() {
    const country = document.getElementById('country');
    const city = document.getElementById('city');
    const address = document.getElementById('address');
    const loader = document.getElementById('mapLoader');

    const debouncedSearch = debounce(() => {
        if (typeof ymaps === 'undefined') return;

        const parts = [
            country.value.trim(),
            city.value.trim(),
            address.value.trim()
        ];

        let query = '';
        if (parts[0]) query = parts[0];
        if (parts[0] && parts[1]) query = `${parts[0]}, ${parts[1]}`;
        if (parts[0] && parts[1] && parts[2]) query = `${parts[0]}, ${parts[1]}, ${parts[2]}`;

        if (!query) return;

        loader.style.display = 'block';

        ymaps.geocode(query, { results: 1 }).then(res => {
            loader.style.display = 'none';

            const geoObj = res.geoObjects.get(0);
            if (!geoObj) return;

            const coords = geoObj.geometry.getCoordinates();
            const balloonText = geoObj.properties.get('text');

            if (currentPlacemark) map.geoObjects.remove(currentPlacemark);

            currentPlacemark = createAnimatedPlacemark(coords, balloonText);
            map.geoObjects.add(currentPlacemark);

            const zoomLevel = parts[2] ? 17 : parts[1] ? 12 : 5;
            map.setCenter(coords, zoomLevel, {
                duration: 600,
                timingFunction: 'easeOut'
            });

            currentPlacemark.balloon.open();
        }).catch(() => {
            loader.style.display = 'none';
        });
    }, 500);

    [country, city, address].forEach(input => {
        input.addEventListener('input', debouncedSearch);
    });
}

// Отображение сообщения об успешном оформлении
function showSuccessMessage(country, city, address) {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').nextElementSibling.textContent;
    
    const modal = document.createElement('div');
    modal.className = 'delivery-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Заказ оформлен!</h3>
            <div class="order-details">
                <p><strong>Клиент:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Телефон:</strong> ${phone}</p>
                <p><strong>Способ оплаты:</strong> ${paymentMethod}</p>
                <p><strong>Адрес доставки:</strong> ${country}, ${city}, ${address}</p>
            </div>
            <p class="modal-note">Спасибо за заказ! Мы свяжемся с вами для подтверждения.</p>
            <button id="closeModalBtn">Закрыть</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('closeModalBtn').addEventListener('click', function() {
        document.body.removeChild(modal);
        document.querySelector('.delivery-form').reset();
    });
}

// Ночной режим
function initNightMode() {
    if (document.body.classList.contains('night-mode')) {
        document.body.style.backgroundColor = '#111';
    }
}

// Обработка отправки формы
function handleFormSubmit(form) {
    if (basket.length === 0) {
        const basketSection = document.querySelector('.basket-section');
        // Прокрутка к корзине с анимацией
        basketSection.scrollIntoView({ behavior: 'smooth' });
        // Подсветка корзины
        basketSection.style.border = '2px solid red';
        basketSection.style.animation = 'shake 0.5s';
        setTimeout(() => {
            basketSection.style.border = '';
            basketSection.style.animation = '';
        }, 1000);
        return;
    }

    const inputs = [
        document.getElementById('firstName'),
        document.getElementById('lastName'),
        document.getElementById('phone'),
        document.getElementById('email'),
        document.getElementById('country'),
        document.getElementById('city'),
        document.getElementById('address'),
        document.getElementById('zip')
    ];

    let isValid = true;

    // Проверка обязательных полей
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });

    // Проверка email
    const email = document.getElementById('email').value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('email').classList.add('error');
        isValid = false;
        alert('Пожалуйста, введите корректный email адрес!');
    }

    if (!isValid) {
        return;
    }

    if (typeof ymaps !== 'undefined') {
        const country = document.getElementById('country').value;
        const city = document.getElementById('city').value;
        const address = document.getElementById('address').value;
        
        searchOnMap(country, city, address)
            .then(() => {
                showSuccessMessage(country, city, address);
                clearBasket();
            })
            .catch(error => {
                console.error('Ошибка поиска:', error);
                showSuccessMessage(country, city, address);
                clearBasket();
            });
    } else {
        const country = document.getElementById('country').value;
        const city = document.getElementById('city').value;
        const address = document.getElementById('address').value;
        showSuccessMessage(country, city, address);
        clearBasket();
    }
}

// Функции для работы с корзиной
function updateBasketDisplay() {
    const basketItemsContainer = document.getElementById('basketItems');
    const totalQuantityElement = document.getElementById('totalQuantity');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (basket.length === 0) {
        basketItemsContainer.innerHTML = `
            <div class="empty-basket-message">
                <i class="fas fa-shopping-basket basket-icon"></i>
                <p>Ваша корзина пуста</p>
                <a href="shop.html" class="continue-shopping-btn">Продолжить покупки</a>
            </div>
        `;
        totalQuantityElement.textContent = '0';
        totalPriceElement.textContent = '0.00 $.';
        checkoutBtn.disabled = true;
        updateBasketIndicator();
        return;
    }

    let totalQuantity = 0;
    let totalPrice = 0;
    const showAll = basketItemsContainer.classList.contains('show-all');
    const itemsToShow = showAll ? basket : basket.slice(0, 5);

    basketItemsContainer.innerHTML = itemsToShow.map(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;

        return `
            <div class="basket-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="basket-item-image">
                <div class="basket-item-details">
                    <h3 class="basket-item-title">${item.name}</h3>
                    <p class="basket-item-price">${item.price.toFixed(2)} $.</p>
                </div>
                <div class="basket-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn minus-btn">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="999">
                        <button class="quantity-btn plus-btn">+</button>
                    </div>
                    <button class="remove-item-btn">✕</button>
                </div>
            </div>
        `;
    }).join('');

    // Добавляем кнопку "Показать еще" если товаров больше 5
    if (basket.length > 5 && !showAll) {
        basketItemsContainer.innerHTML += `
            <div class="show-more-container">
                <button id="showMoreBtn" class="show-more-btn">
                    Показать еще ${basket.length - 5} товаров
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
        `;
    }

    totalQuantityElement.textContent = totalQuantity;
    totalPriceElement.textContent = `${totalPrice.toFixed(2)} $.`;
    checkoutBtn.disabled = false;

    // Обработчики событий
    document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });

    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });

    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });

    // Обработчик кнопки "Показать еще"
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            basketItemsContainer.classList.add('show-all');
            updateBasketDisplay();
        });
    }

    // Обновляем индикатор корзины
    updateBasketIndicator();
}

function decreaseQuantity(e) {
    const itemElement = e.target.closest('.basket-item');
    const itemId = itemElement.dataset.id;
    const item = basket.find(item => item.id === itemId);

    if (item.quantity > 1) {
        item.quantity--;
        saveBasket();
        updateBasketDisplay();
    }
}

function increaseQuantity(e) {
    const itemElement = e.target.closest('.basket-item');
    const itemId = itemElement.dataset.id;
    const item = basket.find(item => item.id === itemId);
    
    if (item.quantity < 999) {
        item.quantity++;
        saveBasket();
        updateBasketDisplay();
    }
}

function updateQuantity(e) {
    const itemElement = e.target.closest('.basket-item');
    const itemId = itemElement.dataset.id;
    const item = basket.find(item => item.id === itemId);
    let newQuantity = parseInt(e.target.value);

    if (isNaN(newQuantity)) newQuantity = 1;
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 999) newQuantity = 999;

    item.quantity = newQuantity;
    e.target.value = newQuantity;
    saveBasket();
    updateBasketDisplay();
}

function removeItem(e) {
    const itemElement = e.target.closest('.basket-item');
    const itemId = itemElement.dataset.id;
    
    basket = basket.filter(item => item.id !== itemId);
    saveBasket();
    updateBasketDisplay();
}

function saveBasket() {
    localStorage.setItem('basket', JSON.stringify(basket));
    updateBasketIndicator();
}

function clearBasket() {
    basket = [];
    saveBasket();
    updateBasketDisplay();
}

// Обновление индикатора корзины (зеленый кружок)
function updateBasketIndicator() {
    const totalItems = basket.reduce((total, item) => total + item.quantity, 0);
    const basketIndicator = document.querySelector('.basket-indicator');
    
    if (basketIndicator) {
        basketIndicator.style.display = totalItems > 0 ? 'block' : 'none';
    } else {
        // Создаем индикатор, если его нет
        const basketLink = document.querySelector('a[href="basket.html"]');
        if (basketLink) {
            const indicator = document.createElement('span');
            indicator.className = 'basket-indicator';
            indicator.style.display = totalItems > 0 ? 'block' : 'none';
            basketLink.appendChild(indicator);
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    loadYandexMap();
    updateBasketDisplay();

    const form = document.getElementById('deliveryForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            handleFormSubmit(form);
        });
    }

    // Ограничение ввода для телефона (только цифры)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^\d+]/g, '').slice(0, 16); 
        });
    }

    // Обработчик для кнопки "Оформить заказ" в корзине
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Прокрутка к форме заказа
            document.querySelector('.delivery-form-container').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    initNightMode();
    initLiveGeocoding();
});

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