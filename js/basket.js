// Прелоадер
document.addEventListener("DOMContentLoaded", function() {
    const preloader = document.getElementById("preloader");
    
    // Проверяем, был ли прелоадер показан в этой сессии
    if (!sessionStorage.getItem('preloaderShown')) {
      // Если нет - запускаем анимацию
      startPreloaderAnimation();
      sessionStorage.setItem('preloaderShown', 'true');
    } else {
      // Если уже был показан - сразу скрываем
      preloader.classList.add("hide");
    }
  });
  
  function startPreloaderAnimation() {
    const preloader = document.getElementById("preloader");
    let percent = 0;
    const interval = 50;
    const duration = 3500;
    
    const updatePercent = () => {
      percent += (100 * interval) / duration;
      if (percent <= 100) {
        setTimeout(updatePercent, interval);
      } else {
        setTimeout(() => {
          preloader.classList.add("hide");
        }, 500);
      }
    };
    
    updatePercent();
  }
  
  // Остальной код basket.js остается без изменений

let map;
let currentPlacemark;

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

document.addEventListener('DOMContentLoaded', function () {
    loadYandexMap();

    const form = document.getElementById('deliveryForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            handleFormSubmit(form);
        });
    }

    initNightMode();
    initLiveGeocoding();
});

function loadYandexMap() {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=8ab80f75-7c79-4d7a-9a2f-f65185863093&lang=ru_RU';
    script.onload = function () {
        ymaps.ready(initMap);
    };
    document.head.appendChild(script);
}

function initMap() {
    map = new ymaps.Map('map', {
        center: [55.751244, 37.618423],
        zoom: 10,
        controls: ['zoomControl'],
        behaviors: ['default', 'scrollZoom']
    });

    map.cursors.push('arrow');
}

function handleFormSubmit(form) {
    const country = document.getElementById('country');
    const city = document.getElementById('city');
    const address = document.getElementById('address');
    const zip = document.getElementById('zip');

    const inputs = [country, city, address, zip];
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

function initNightMode() {
    if (document.body.classList.contains('night-mode')) {
        document.body.style.backgroundColor = '#111';
    }
}
