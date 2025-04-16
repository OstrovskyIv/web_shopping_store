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

// Загрузка заказов
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
                <span class="order-status ${getStatusClass(order.status)}">
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
                <div class="order-buttons">
                    <button class="order-details-btn" data-order-id="${order.id}">Подробнее</button>
                    ${order.status === 'В обработке' ? 
                    `<button class="order-cancel-btn" data-order-id="${order.id}">Отказаться</button>` : ''}
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Обработчик кнопки "Подробнее"
    document.querySelectorAll('.order-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
            const order = orders.find(o => o.id === orderId);
            if (order) showOrderDetails(order);
        });
    });

    // Обработчик кнопки "Отказаться" (без подтверждения)
    document.querySelectorAll('.order-cancel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
            const updatedOrders = orders.filter(o => o.id !== orderId);
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            loadOrders(); // Мгновенное обновление списка
        });
    });
}

// Определение класса статуса
function getStatusClass(status) {
    switch(status) {
        case 'В обработке': return 'status-processing';
        case 'Завершен': return 'status-completed';
        case 'Отменен': return 'status-cancelled';
        default: return 'status-pending';
    }
}

// Отображение деталей заказа
function showOrderDetails(order) {
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Детали заказа #${order.id}</h2>
            <div class="order-info">
                <p><strong>Дата:</strong> ${order.date}</p>
                <p><strong>Статус:</strong> ${order.status}</p>
                <p><strong>Итого:</strong> ${order.total.toFixed(2)} $</p>
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
    modal.style.display = 'flex';

    // Закрытие модального окна
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
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
    document.querySelectorAll('.order-card').forEach(card => {
        card.style.display = (filter === 'all' || card.getAttribute('data-status') === filter) 
            ? 'block' 
            : 'none';
    });
}

// Фильтрация экскурсий
function filterExcursions(filter) {
    document.querySelectorAll('.excursion-card').forEach(card => {
        card.style.display = (filter === 'upcoming' || card.getAttribute('data-status') === filter)
            ? 'flex'
            : 'none';
    });
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    cleanUpOrdersData();
    loadUserData();
    loadOrders();
    loadExcursions();

    // Работа с аватаркой
    const avatarUpload = document.getElementById('avatarUpload');
    const userAvatar = document.getElementById('userAvatar');
    document.getElementById('changeAvatarBtn').addEventListener('click', () => avatarUpload.click());
    avatarUpload.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = event => {
                userAvatar.src = event.target.result;
                localStorage.setItem('userAvatar', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    if (localStorage.getItem('userAvatar')) userAvatar.src = localStorage.getItem('userAvatar');

    // Кнопки "Показать/Скрыть"
    document.querySelectorAll('.btn-show').forEach(btn => {
        btn.addEventListener('click', function() {
            const field = this.dataset.field;
            const element = document.getElementById(`user${field.charAt(0).toUpperCase() + field.slice(1)}`);
            const values = {
                email: ['iva*****@gmail.com', 'ivanov@gmail.com'],
                phone: ['+375 ** *** ** 67', '+375 29 123 45 67']
            };
            element.textContent = this.textContent === 'Показать' ? values[field][1] : values[field][0];
            this.textContent = this.textContent === 'Показать' ? 'Скрыть' : 'Показать';
        });
    });

    // Переключение табов
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabContainer = this.closest('.orders-tabs, .excursions-tabs');
            tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.tab;
            tabContainer.classList.contains('orders-tabs') 
                ? filterOrders(filter) 
                : filterExcursions(filter);
        });
    });
});

// Редактирование профиля
document.querySelector('.btn-edit-profile').addEventListener('click', function() {
    const editModal = document.createElement('div');
    editModal.className = 'edit-modal';
    editModal.innerHTML = `
        <div class="modal-content">
            <h2>Редактирование профиля</h2>
            <form id="editProfileForm">
                <div class="form-group">
                    <label>Имя:</label>
                    <input type="text" id="editName" value="Иван Иванов">
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="editEmail" value="ivanov@gmail.com">
                </div>
                <div class="form-group">
                    <label>Телефон:</label>
                    <input type="tel" id="editPhone" value="+375291234567">
                </div>
                <div class="form-group">
                    <label>Новый пароль:</label>
                    <input type="password" id="newPassword" placeholder="Введите новый пароль">
                </div>
                <div class="form-group">
                    <label>Повторите пароль:</label>
                    <input type="password" id="confirmPassword" placeholder="Повторите пароль">
                </div>
                <button type="submit" class="btn-save">Сохранить</button>
                <button type="button" class="btn-cancel">Отмена</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(editModal);
    
    // Обработчики
    editModal.querySelector('.btn-cancel').addEventListener('click', () => {
        editModal.remove();
    });
    
    editModal.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        const newName = document.getElementById('editName').value;
        const newEmail = document.getElementById('editEmail').value;
        const newPhone = document.getElementById('editPhone').value;
        
        // Обновляем данные
        document.querySelector('.profile-name').textContent = newName;
        document.getElementById('userEmail').textContent = newEmail.replace(/(?<=.).(?=.*@)/g, '*');
        document.getElementById('userPhone').textContent = newPhone.replace(/(?<=\+375)\d{2}(?=\d{3}\d{2}\d{2})/g, '**');
        
        editModal.remove();
    });
});

// Изменение пароля
document.querySelectorAll('.btn-change').forEach(btn => {
    btn.addEventListener('click', function() {
        const passwordModal = document.createElement('div');
        passwordModal.className = 'password-modal';
        passwordModal.innerHTML = `
            <div class="modal-content">
                <h2>Изменение пароля</h2>
                <form id="changePasswordForm">
                    <div class="form-group">
                        <label>Текущий пароль:</label>
                        <input type="password" required>
                    </div>
                    <div class="form-group">
                        <label>Новый пароль:</label>
                        <input type="password" required>
                    </div>
                    <div class="form-group">
                        <label>Повторите пароль:</label>
                        <input type="password" required>
                    </div>
                    <button type="submit" class="btn-save">Изменить</button>
                    <button type="button" class="btn-cancel">Отмена</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(passwordModal);
        
        // Обработчики
        passwordModal.querySelector('.btn-cancel').addEventListener('click', () => {
            passwordModal.remove();
        });
        
        passwordModal.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            // Здесь должна быть логика проверки и сохранения пароля
            alert('Пароль успешно изменен!');
            passwordModal.remove();
        });
    });
});