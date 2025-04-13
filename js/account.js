// Очистка некорректных данных заказов
function cleanUpOrdersData() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const cleanedOrders = orders.map(order => {
        if (typeof order.total === 'object') {
            return {
                ...order,
                total: parseFloat(order.items?.reduce((sum, item) => 
                    sum + (item.price * item.quantity), 0) || 0)
            };
        }
        return order;
    }).filter(order => order.items && order.items.length > 0);
    
    localStorage.setItem('orders', JSON.stringify(cleanedOrders));
}

// Загрузка данных пользователя
function loadUserData() {
    const userData = {
        name: 'Иван Иванов',
        email: 'ivanov@gmail.com',
        phone: '+375 29 123 45 67'
    };
    
    document.querySelector('.profile-name').textContent = userData.name;
    document.getElementById('userEmail').textContent = 'iva*****@gmail.com';
    document.getElementById('userPhone').textContent = '+375 ** *** ** 67';
}

// Загрузка заказов (исправленная версия)
function loadOrders() {
    cleanUpOrdersData();
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-box-open"></i>
                <p>У вас пока нет заказов</p>
                <a href="shop.html" class="btn-shop">Перейти в магазин</a>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = orders.map(order => {
        const total = typeof order.total === 'number' ? 
            order.total.toFixed(2) : 
            parseFloat(order.total || 0).toFixed(2);
            
        return `
        <div class="order-card" data-status="${order.status === 'В обработке' ? 'active' : 'completed'}">
            <div class="order-header">
                <span class="order-id">Заказ #${order.id}</span>
                <span class="order-date">${order.date}</span>
                <span class="order-status ${order.status === 'В обработке' ? 'status-active' : 'status-completed'}">
                    ${order.status}
                </span>
            </div>
            <div class="order-items">
                ${order.items.slice(0, 3).map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="item-image">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">${item.quantity} шт.</span>
                        <span class="item-price">${item.price.toFixed(2)} $</span>
                    </div>
                `).join('')}
                ${order.items.length > 3 ? `<div class="more-items">+${order.items.length - 3} еще</div>` : ''}
            </div>
            <div class="order-summary">
                <span class="order-total">Итого: ${total} $</span>
                <button class="order-details-btn" data-order-id="${order.id}">Подробнее</button>
            </div>
        </div>
        `;
    }).join('');

    // Обработчики для кнопок "Подробнее"
    document.querySelectorAll('.order-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
            const order = orders.find(o => o.id === orderId);
            if (order) showOrderDetails(order);
        });
    });
}

// Показ деталей заказа
function showOrderDetails(order) {
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    
    const total = typeof order.total === 'number' ? 
        order.total.toFixed(2) : 
        parseFloat(order.total || 0).toFixed(2);
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Детали заказа #${order.id}</h2>
            <div class="order-info">
                <p><strong>Дата:</strong> ${order.date}</p>
                <p><strong>Статус:</strong> ${order.status}</p>
                <p><strong>Итого:</strong> ${total} $</p>
            </div>
            <div class="order-items-details">
                <h3>Товары:</h3>
                ${order.items.map(item => `
                    <div class="order-item-detail">
                        <img src="${item.image}" alt="${item.name}" class="item-image">
                        <div class="item-info">
                            <h4>${item.name}</h4>
                            <p>Цена: ${item.price.toFixed(2)} $</p>
                            <p>Количество: ${item.quantity}</p>
                            <p>Сумма: ${(item.price * item.quantity).toFixed(2)} $</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Загрузка экскурсий
function loadExcursions() {
    const excursions = JSON.parse(localStorage.getItem('excursions')) || [];
    const excursionsList = document.getElementById('excursionsList');
    
    if (excursions.length === 0) {
        excursionsList.innerHTML = `
            <div class="empty-excursions">
                <i class="fas fa-binoculars"></i>
                <p>У вас нет активных экскурсий</p>
                <a href="shop.html#excursions" class="btn-shop">Посмотреть экскурсии</a>
            </div>
        `;
        return;
    }
    
    excursionsList.innerHTML = excursions.map(exc => `
        <div class="excursion-card" data-status="${exc.status === 'Забронировано' ? 'upcoming' : 'past'}">
            <div class="excursion-header">
                <h3 class="excursion-title">${exc.name}</h3>
                <span class="excursion-date">${exc.date}</span>
            </div>
            <div class="excursion-details">
                <div class="excursion-guide">
                    <i class="fas fa-user-tie"></i>
                    <span>${exc.guide}</span>
                </div>
                <div class="excursion-status ${exc.status === 'Забронировано' ? 'status-upcoming' : 'status-past'}">
                    ${exc.status}
                </div>
            </div>
            <button class="excursion-details-btn" data-excursion-id="${exc.id}">Подробнее</button>
        </div>
    `).join('');
}

// Фильтрация заказов
function filterOrders(filter) {
    const orderCards = document.querySelectorAll('.order-card');
    
    orderCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-status') === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Фильтрация экскурсий
function filterExcursions(filter) {
    const excursionCards = document.querySelectorAll('.excursion-card');
    
    excursionCards.forEach(card => {
        if (filter === 'upcoming' || card.getAttribute('data-status') === filter) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    cleanUpOrdersData();
    loadUserData();
    loadOrders();
    loadExcursions();

    // Загрузка/изменение аватарки
    const avatarUpload = document.getElementById('avatarUpload');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const userAvatar = document.getElementById('userAvatar');
    
    changeAvatarBtn.addEventListener('click', function() {
        avatarUpload.click();
    });
    
    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                userAvatar.src = event.target.result;
                localStorage.setItem('userAvatar', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Проверяем сохраненную аватарку
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        userAvatar.src = savedAvatar;
    }
    
    // Кнопки "Показать" для данных
    document.querySelectorAll('.btn-show').forEach(btn => {
        btn.addEventListener('click', function() {
            const field = this.getAttribute('data-field');
            const valueElement = document.getElementById(`user${field.charAt(0).toUpperCase() + field.slice(1)}`);
            
            if (this.textContent === 'Показать') {
                const fullValue = {
                    'email': 'ivanov@gmail.com',
                    'phone': '+375 29 123 45 67'
                }[field];
                
                valueElement.textContent = fullValue;
                this.textContent = 'Скрыть';
            } else {
                const maskedValue = {
                    'email': 'iva*****@gmail.com',
                    'phone': '+375 ** *** ** 67'
                }[field];
                
                valueElement.textContent = maskedValue;
                this.textContent = 'Показать';
            }
        });
    });
    
    // Кнопки табов
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            const tabContainer = this.closest('.orders-tabs') || this.closest('.excursions-tabs');
            
            tabContainer.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            this.classList.add('active');
            
            if (tabContainer.classList.contains('orders-tabs')) {
                filterOrders(tab);
            } else {
                filterExcursions(tab);
            }
        });
    });
});