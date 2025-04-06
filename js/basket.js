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
    const modal = document.createElement('div');
    modal.className = 'delivery-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Запрос принят!</h3>
            <p>Ваш адрес доставки:</p>
            <p><strong>${country}, ${city}, ${address}</strong></p>
            <p class="modal-note">(Мы вас обязательно найдем)</p>
            <button id="closeModalBtn">Закрыть</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('closeModalBtn').addEventListener('click', function () {
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
        alert('Ваша корзина пуста!');
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

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });

    if (!isValid) {
        alert('Пожалуйста, заполните все обязательные поля!');
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
        totalPriceElement.textContent = '0 $.';
        checkoutBtn.disabled = true;
        return;
    }

    let totalQuantity = 0;
    let totalPrice = 0;

    basketItemsContainer.innerHTML = basket.map(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;

        return `
            <div class="basket-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="basket-item-image">
                <div class="basket-item-details">
                    <h3 class="basket-item-title">${item.name}</h3>
                    <p class="basket-item-price">${item.price} $.</p>
                </div>
                <div class="basket-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn minus-btn">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus-btn">+</button>
                    </div>
                    <button class="remove-item-btn">✕</button>
                </div>
            </div>
        `;
    }).join('');

    totalQuantityElement.textContent = totalQuantity;
    totalPriceElement.textContent = `${totalPrice} $.`;
    checkoutBtn.disabled = false;

    // Навешиваем обработчики событий
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

    item.quantity++;
    saveBasket();
    updateBasketDisplay();
}

function updateQuantity(e) {
    const itemElement = e.target.closest('.basket-item');
    const itemId = itemElement.dataset.id;
    const item = basket.find(item => item.id === itemId);
    const newQuantity = parseInt(e.target.value);

    if (newQuantity > 0) {
        item.quantity = newQuantity;
        saveBasket();
        updateBasketDisplay();
    } else {
        e.target.value = item.quantity;
    }
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
}

function clearBasket() {
    basket = [];
    saveBasket();
    updateBasketDisplay();
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