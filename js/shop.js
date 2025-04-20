document.addEventListener("DOMContentLoaded", function() {
    initRatings();
    initProductHandlers();
    initExcursionHandlers();
    updateBasketCounter();
});

function initRatings() {
    const ratingContainers = document.querySelectorAll(".rating");
    
    ratingContainers.forEach(container => {
        const stars = container.querySelectorAll(".star");
        const ratingValue = container.querySelector(".rating-value");
        const currentRating = parseFloat(ratingValue.textContent);
        
        stars.forEach(star => {
            star.classList.remove("full", "partial");
            star.style.setProperty('--fill-percent', '0%');
        });

        stars.forEach((star, index) => {
            const starPosition = index + 1;
            
            if (currentRating >= starPosition) {
                star.classList.add("full");
            } else if (currentRating > starPosition - 1) {
                star.classList.add("partial");
                const fillPercent = (currentRating - (starPosition - 1)) * 100;
                star.style.setProperty('--fill-percent', `${fillPercent}%`);
            }
        });
        
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
}

function initProductHandlers() {
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
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('productModal');
        if (event.target === modal) {
            closeProductModal();
        }
    });
}

function initExcursionHandlers() {
    document.querySelectorAll('.excursion-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.excursion-card');
            if (!card) {
                console.error('Excursion card not found');
                return;
            }
            const excursionData = getExcursionData(card);
            showExcursionDetailsModal(excursionData);
        });
    });
    
    document.querySelectorAll('.book-excursion-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.excursion-card');
            if (!card) {
                console.error('Excursion card not found');
                return;
            }
            const excursionData = getExcursionData(card);
            showBookingModal(excursionData);
        });
    });
}

function getExcursionData(card) {
    try {
        const photos = card.dataset.photos ? JSON.parse(card.dataset.photos) : [];
        const locations = card.dataset.locations ? JSON.parse(card.dataset.locations) : [];
        
        return {
            id: card.dataset.id || Date.now().toString(),
            name: card.querySelector('.product-title')?.textContent || 'Экскурсия',
            photos: Array.isArray(photos) ? photos : [],
            locations: Array.isArray(locations) ? locations : [],
            price: parseFloat(card.dataset.basePrice || '0'),
            duration: card.dataset.duration || 'Не указано',
            description: card.querySelector('.description')?.textContent || '',
            guide: card.querySelector('.meta-item span')?.textContent || 'Не указан',
            time: card.querySelectorAll('.meta-item span')[1]?.textContent || 'Не указано'
        };
    } catch (e) {
        console.error('Error parsing excursion data:', e);
        return getDefaultExcursionData();
    }
}

function getDefaultExcursionData() {
    return {
        id: Date.now().toString(),
        name: 'Экскурсия',
        photos: [],
        locations: ['Основные достопримечательности'],
        price: 0,
        duration: '2 часа',
        description: 'Увлекательная экскурсия по интересным местам',
        guide: 'Стэнли Пайнс',
        time: '19:00 - 21:00'
    };
}

function showExcursionDetailsModal(excursion) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    
    const photosHTML = excursion.photos && excursion.photos.length > 0 
        ? excursion.photos.map(photo => `
            <img src="${photo || 'pictures/default-excursion.jpg'}" alt="Фото экскурсии" onerror="this.src='pictures/default-excursion.jpg'">
        `).join('')
        : `<img src="pictures/default-excursion.jpg" alt="Фото экскурсии">`;
    
    modal.innerHTML = `
        <div class="details-modal">
            <div class="details-modal-content">
                <div class="details-modal-header">
                    <h2 class="details-modal-title">${excursion.name}</h2>
                    <button class="close-modal-btn">&times;</button>
                </div>
                <div class="details-modal-body">
                    <div class="excursion-carousel">
                        ${photosHTML}
                    </div>
                    <div class="order-info-grid">
                        <div class="order-info-item">
                            <strong>Продолжительность:</strong> 
                            <span class="order-info-text">${excursion.duration}</span>
                        </div>
                        <div class="order-info-item">
                            <strong>Гид:</strong> 
                            <span class="order-info-text">${excursion.guide}</span>
                        </div>
                        <div class="order-info-item">
                            <strong>Время:</strong> 
                            <span class="order-info-text">${excursion.time}</span>
                        </div>
                        <div class="order-info-item">
                            <strong>Цена:</strong> 
                            <span class="order-info-text">${excursion.price} $</span>
                        </div>
                    </div>
                    <p class="details-modal-description">${excursion.description}</p>
                    <div class="locations-list">
                        <h3>Маршрут:</h3>
                        <ul>
                            ${excursion.locations.map(location => `
                                <li>${location}</li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="guides-selection">
                        <h3>Доступные гиды:</h3>
                        ${getStaff().map((guide, index) => `
                            <div class="guide-item">
                                <input type="radio" name="guide" id="guide${index}" ${index === 0 ? 'checked' : ''}>
                                <label for="guide${index}">${guide.name} (опыт: ${guide.experience})</label>
                            </div>
                        `).join('')}
                    </div>
                    <div class="excursion-actions">
                        <button class="btn-book-now" data-excursion-id="${excursion.id}">
                            <i class="fas fa-calendar-check"></i> Забронировать сейчас
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal-btn').addEventListener('click', () => {
        closeModal(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    modal.querySelector('.btn-book-now').addEventListener('click', () => {
        closeModal(modal);
        showBookingModal(excursion);
    });
}

function showBookingModal(excursion) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="booking-modal">
            <div class="booking-modal-content">
                <div class="booking-modal-header">
                    <h2 class="booking-modal-title">Бронирование: ${excursion.name}</h2>
                </div>
                <form id="bookingForm">
                    <div class="booking-form-group">
                        <label for="bookingDate">Дата экскурсии:</label>
                        <input type="date" id="bookingDate" required>
                    </div>
                    <div class="booking-form-group">
                        <label for="bookingTime">Время:</label>
                        <input type="time" id="bookingTime" required value="${excursion.time.split(' - ')[0] || '19:00'}">
                    </div>
                    <div class="booking-form-group">
                        <label for="bookingPeople">Количество человек:</label>
                        <input type="number" id="bookingPeople" min="1" value="1" required>
                    </div>
                    <div class="booking-form-group">
                        <label for="paymentMethod">Способ оплаты:</label>
                        <select id="paymentMethod" required>
                            <option value="card">Банковская карта</option>
                            <option value="cash">Наличные</option>
                        </select>
                    </div>
                    <div class="booking-form-group">
                        <label>Итого к оплате:</label>
                        <div id="totalPrice" class="total-price">${excursion.price} $</div>
                    </div>
                    <div class="booking-form-actions">
                        <button type="submit" class="booking-submit-btn">Подтвердить бронь</button>
                        <button type="button" class="booking-cancel-btn">Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#bookingPeople').addEventListener('input', function() {
        const people = parseInt(this.value) || 1;
        const total = excursion.price * people;
        modal.querySelector('#totalPrice').textContent = `${total.toFixed(2)} $`;
    });
    
    modal.querySelector('.booking-cancel-btn').addEventListener('click', () => {
        closeModal(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    modal.querySelector('#bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const bookingData = {
            id: Date.now(),
            excursionId: excursion.id,
            name: excursion.name,
            date: this.querySelector('#bookingDate').value,
            time: this.querySelector('#bookingTime').value,
            people: parseInt(this.querySelector('#bookingPeople').value),
            payment: this.querySelector('#paymentMethod').value,
            price: parseFloat(excursion.price) * parseInt(this.querySelector('#bookingPeople').value),
            status: 'Забронировано',
            guide: getStaff()[0].name
        };
        
        saveBooking(bookingData);
        closeModal(modal);
        showBookingSuccess(bookingData);
    });
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

function saveBooking(bookingData) {
    const excursions = JSON.parse(localStorage.getItem('excursions')) || [];
    excursions.push(bookingData);
    localStorage.setItem('excursions', JSON.stringify(excursions));
}

function showBookingSuccess(booking) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Экскурсия "${booking.name}" успешно забронирована на ${booking.date}!</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function getStaff() {
    return [
        {name: "Стэнли Пайнс", experience: "27 лет"},
        {name: "Венди Кордрой", experience: "3 года"},
        {name: "Зус Рамирес", experience: "7 лет"},
        {name: "Диппер Пайнс", experience: "2 года"}
    ];
}

function addToBasket(product) {
    let basket = JSON.parse(localStorage.getItem('basket')) || [];
    
    if (!product || !product.name || typeof product.price !== 'number') {
        console.error('Invalid product object:', product);
        showToast('Ошибка добавления товара');
        return;
    }

    const productKey = `${product.name.toLowerCase()}_${product.price}`;
    
    const existingIndex = basket.findIndex(item => 
        `${item.name.toLowerCase()}_${item.price}` === productKey
    );

    if (existingIndex > -1) {
        basket[existingIndex].quantity += product.quantity || 1;
        showToast(`Количество "${product.name}" обновлено: ${basket[existingIndex].quantity}`);
    } else {
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

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}