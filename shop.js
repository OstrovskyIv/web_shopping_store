// ============== Глобальные переменные для карты ==============
let map;
let currentPlacemark;

// ============== Основной код при загрузке страницы ==============
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем Яндекс.Карты
    loadYandexMap();

    // Обработка формы доставки
    const form = document.getElementById('deliveryForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(form);
        });
    }

    // Инициализация ночного режима
    initNightMode();
});

// ============== Функция загрузки API Яндекс.Карт ==============
function loadYandexMap() {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_api_ключ&lang=ru_RU';
    script.onload = function() {
        ymaps.ready(initMap);
    };
    document.head.appendChild(script);
}

// ============== Инициализация карты ==============
function initMap() {
    map = new ymaps.Map('map', {
        center: [55.751244, 37.618423], // Москва по умолчанию
        zoom: 10,
        controls: ['zoomControl']
    });
}

// ============== Обработчик отправки формы ==============
function handleFormSubmit(form) {
    const country = document.getElementById('country');
    const city = document.getElementById('city');
    const address = document.getElementById('address');
    const zip = document.getElementById('zip');
    
    const inputs = [country, city, address, zip];
    let isValid = true;
    
    // Валидация полей
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
    
    // Поиск на карте (если API загружено)
    if (typeof ymaps !== 'undefined') {
        searchOnMap(country.value, city.value, address.value)
            .then(() => showSuccessMessage(country.value, city.value, address.value))
            .catch(error => {
                console.error('Ошибка поиска:', error);
                showSuccessMessage(country.value, city.value, address.value);
            });
    } else {
        showSuccessMessage(country.value, city.value, address.value);
    }
}

// ============== Поиск адреса на карте ==============
function searchOnMap(country, city, address) {
    return new Promise((resolve, reject) => {
        const searchQuery = `${country}, ${city}, ${address}`;
        
        ymaps.geocode(searchQuery, {
            results: 1
        }).then(function(res) {
            const firstGeoObject = res.geoObjects.get(0);
            
            if (!firstGeoObject) {
                reject('Адрес не найден');
                return;
            }
            
            const coordinates = firstGeoObject.geometry.getCoordinates();
            
            // Удаляем предыдущую метку
            if (currentPlacemark) {
                map.geoObjects.remove(currentPlacemark);
            }
            
            // Добавляем новую метку
            currentPlacemark = new ymaps.Placemark(coordinates, {
                balloonContent: firstGeoObject.getAddress()
            }, {
                preset: 'islands#redDotIcon'
            });
            
            map.geoObjects.add(currentPlacemark);
            map.setCenter(coordinates);
            
            // Настраиваем зум в зависимости от точности адреса
            if (address) map.setZoom(17);
            else if (city) map.setZoom(12);
            else map.setZoom(5);
            
            resolve();
        }).catch(reject);
    });
}

// ============== Показать сообщение об успехе ==============
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
    
    document.getElementById('closeModalBtn').addEventListener('click', function() {
        document.body.removeChild(modal);
        document.querySelector('.delivery-form').reset();
    });
}

// ============== Инициализация ночного режима ==============
function initNightMode() {
    if (document.body.classList.contains('night-mode')) {
        document.body.style.backgroundColor = '#111';
    }
}