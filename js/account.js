document.addEventListener('DOMContentLoaded', function() {
    // Загружаем данные пользователя сразу (без проверки авторизации)
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
                // Сохраняем в localStorage
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
                // Тестовые данные
                const fullValue = {
                    'email': 'ivanov@gmail.com',
                    'phone': '+375 29 123 45 67'
                }[field];
                
                valueElement.textContent = fullValue;
                this.textContent = 'Скрыть';
            } else {
                // Маскируем данные
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
            
            // Убираем активный класс у всех кнопок в контейнере
            tabContainer.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Фильтрация заказов/экскурсий
            if (tabContainer.classList.contains('orders-tabs')) {
                filterOrders(tab);
            } else {
                filterExcursions(tab);
            }
        });
    });
});

function loadUserData() {
    // Тестовые данные пользователя
    const userData = {
        name: 'Иван Иванов',
        email: 'ivanov@gmail.com',
        phone: '+375 29 123 45 67'
    };
    
    document.querySelector('.profile-name').textContent = userData.name;
    document.getElementById('userEmail').textContent = 'iva*****@gmail.com';
    document.getElementById('userPhone').textContent = '+375 ** *** ** 67';
}

function loadOrders() {
    // Тестовые данные заказов (можно заменить на свои)
    const orders = [
        {
            id: '1001',
            date: '15.04.2023',
            status: 'В обработке',
            items: [
                { name: 'Книга "Тайны Хижины"', quantity: 1, image: 'pictures/book.jpg' },
                { name: 'Футболка Gravity Falls', quantity: 2, image: 'pictures/t-shirt.jpg' }
            ],
            total: '45.99'
        }
    ];
    
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
    
    ordersList.innerHTML = orders.map(order => `
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
                    </div>
                `).join('')}
                ${order.items.length > 3 ? `<div class="more-items">+${order.items.length - 3} еще</div>` : ''}
            </div>
            <div class="order-summary">
                <span class="order-total">Итого: ${order.total} $.</span>
                <button class="order-details-btn">Подробнее</button>
            </div>
        </div>
    `).join('');
}

function loadExcursions() {
    // Тестовые данные экскурсий (можно заменить на свои)
    const excursions = [
        {
            name: 'Тур по тайным местам',
            date: '20.05.2023',
            status: 'Забронировано',
            guide: 'Диппер Пайнс'
        }
    ];
    
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
            <button class="excursion-details-btn">Подробнее</button>
        </div>
    `).join('');
}

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