// Очистка некорректных данных заказов
function cleanUpOrdersData() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const cleanedOrders = orders.map(order => {
        if (typeof order.total === 'object' || isNaN(order.total)) {
            return {
                ...order,
                total: parseFloat(order.items?.reduce((sum, item) => 
                    sum + (item.price * item.quantity), 0) || 0).toFixed(2)
            };
        }
        return order;
    }).filter(order => order.items && order.items.length > 0);
    
    localStorage.setItem('orders', JSON.stringify(cleanedOrders));
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Валидация телефона
function validatePhone(phone) {
    const re = /^\+?[0-9\s\-()]{7,20}$/;
    return re.test(phone);
}

// Загрузка данных пользователя
function loadUserData() {
    const defaultUserData = {
        name: 'Иван Иванов',
        email: 'ivanov@gmail.com',
        phone: '+375 (XX) XXX-XX-XX',
        address: '',
        birthday: '',
        about: ''
    };
    
    const savedUserData = JSON.parse(localStorage.getItem('userData')) || {};
    const userData = {...defaultUserData, ...savedUserData};
    
    document.querySelector('.profile-name').textContent = userData.name;
    
    // Маскировка данных
    const maskEmail = (email) => {
        const [name, domain] = email.split('@');
        return name.length > 3 
            ? `${name[0]}${'*'.repeat(name.length-2)}${name.slice(-1)}@${domain}`
            : `${'*'.repeat(name.length)}@${domain}`;
    };

    const maskPhone = (phone) => {
        const numbers = phone.replace(/\D/g, '').slice(-9);
        return phone.replace(/\d(?=\d{4})/g, '*');
    };

    const maskedEmail = maskEmail(userData.email);
    const maskedPhone = maskPhone(userData.phone);

    document.getElementById('userEmail').textContent = maskedEmail;
    document.getElementById('userPhone').textContent = maskedPhone;
    document.getElementById('userAddress').textContent = userData.address || 'Не указан';
    document.getElementById('userBirthday').textContent = userData.birthday || 'Не указана';
    document.getElementById('userAbout').textContent = userData.about || 'Не указано';
    
    localStorage.setItem('userEmailMasked', maskedEmail);
    localStorage.setItem('userPhoneMasked', maskedPhone);
    localStorage.setItem('userEmailFull', userData.email);
    localStorage.setItem('userPhoneFull', userData.phone);
    
    // Обновление статистики
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
    
    let totalSpentElement = document.getElementById('totalSpent');
    if (!totalSpentElement) {
        totalSpentElement = document.createElement('div');
        totalSpentElement.id = 'totalSpent';
        totalSpentElement.className = 'total-spent';
        document.querySelector('.profile-details').appendChild(totalSpentElement);
    }
    totalSpentElement.innerHTML = `
        <i class="fas fa-coins"></i>
        Сумма выкупа: ${totalSpent.toFixed(2)} $
    `;
    
    document.getElementById('orderCount').textContent = orders.length;
}

// Загрузка заказов
function loadOrders() {
    cleanUpOrdersData();
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
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
                ${order.items.length > 3 ? `<div class="more-items">+${order.items.length-3} еще</div>` : ''}
            </div>
            <div class="order-summary">
                <span class="order-total">Итого: ${parseFloat(order.total).toFixed(2)} $</span>
                <div class="order-buttons">
                    <button class="order-details-btn" data-order-id="${order.id}">Подробнее</button>
                    ${order.status === 'В обработке' ? 
                    `<button class="order-cancel-btn" data-order-id="${order.id}">Отказаться</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.order-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.dataset.orderId);
            const order = orders.find(o => o.id === orderId);
            if (order) showOrderDetails(order);
        });
    });

    document.querySelectorAll('.order-cancel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.dataset.orderId);
            const updatedOrders = orders.filter(o => o.id !== orderId);
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            loadOrders();
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
            <div class="order-info-grid">
                <div class="order-info-item">
                    <strong>Дата:</strong> 
                    <span class="order-info-text">${order.date}</span>
                </div>
                <div class="order-info-item">
                    <strong>Статус:</strong> 
                    <span class="order-status ${getStatusClass(order.status)}">${order.status}</span>
                </div>
                <div class="order-info-item">
                    <strong>Способ оплаты:</strong> 
                    <span class="order-info-text">
                        ${order.paymentMethodText || 'Не указан'}
                    </span>
                </div>
                <div class="order-info-item">
                    <strong>Итого:</strong> 
                    <span class="order-info-text">${parseFloat(order.total).toFixed(2)} $</span>
                </div>
            </div>
            <h3>Товары в заказе:</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Товар</th>
                        <th>Цена</th>
                        <th>Количество</th>
                        <th>Сумма</th>
                        <th>Оценка</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td class="item-name-cell">
                                <img src="${item.image}" alt="${item.name}" class="item-image-table">
                                <span class="item-name-text">${item.name}</span>
                            </td>
                            <td class="item-price-text">${item.price.toFixed(2)} $</td>
                            <td class="item-quantity-text">${item.quantity}</td>
                            <td class="item-total-text">${(item.price * item.quantity).toFixed(2)} $</td>
                            <td class="rating-stars">
                                ${item.rating ? '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating) : 'Не оценено'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.classList.add('active');

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modal.remove();
        }
    });
}

// Функция для парсинга даты экскурсии (поддержка разных форматов)
function parseExcursionDate(dateString, timeString = '00:00') {
    if (!dateString) return null;
    
    try {
        let day, month, year;
        
        // Поддержка формата "2025-04-20"
        if (dateString.includes('-')) {
            [year, month, day] = dateString.split('-');
        } 
        // Поддержка формата "20.04.2025"
        else if (dateString.includes('.')) {
            [day, month, year] = dateString.split('.');
        } 
        // Неизвестный формат
        else {
            return null;
        }
        
        const [hours = '00', minutes = '00'] = timeString.split(':');
        
        return new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes)
        );
    } catch (e) {
        console.error('Ошибка парсинга даты экскурсии:', e);
        return null;
    }
}

// Проверка и обновление статусов экскурсий
function updateExcursionsStatus() {
    const excursions = JSON.parse(localStorage.getItem('excursions')) || [];
    const now = new Date();
    
    const updatedExcursions = excursions.map(exc => {
        const excDate = parseExcursionDate(exc.date, exc.time);
        const isPast = excDate && excDate < now;
        
        return {
            ...exc,
            status: isPast ? 'Завершена' : (exc.status || 'Забронировано')
        };
    });
    
    localStorage.setItem('excursions', JSON.stringify(updatedExcursions));
    return updatedExcursions;
}

// Загрузка и отображение экскурсий
function loadExcursions() {
    const excursions = updateExcursionsStatus();
    const now = new Date();
    
    // Определяем активную вкладку
    const activeTab = document.querySelector('.excursions-section .tab-btn.active')?.dataset.tab || 'upcoming';
    
    // Фильтруем экскурсии
    const filteredExcursions = excursions.filter(exc => {
        const excDate = parseExcursionDate(exc.date, exc.time);
        return activeTab === 'upcoming' 
            ? !excDate || excDate >= now 
            : excDate && excDate < now;
    });
    
    renderExcursionsList(
        filteredExcursions, 
        activeTab === 'upcoming' 
            ? 'У вас нет активных экскурсий' 
            : 'У вас нет прошедших экскурсий'
    );
}

// Рендер списка экскурсий
function renderExcursionsList(excursions, emptyMessage) {
    const excursionsList = document.getElementById('excursionsList');
    
    if (excursions.length === 0) {
        excursionsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-binoculars"></i>
                <p>${emptyMessage}</p>
                <a href="shop.html#excursions" class="btn-shop">Посмотреть экскурсии</a>
            </div>
        `;
        return;
    }
    
    excursionsList.innerHTML = excursions.map(exc => {
        const excDate = parseExcursionDate(exc.date, exc.time);
        const isPast = excDate && excDate < new Date();
        
        return `
        <div class="excursion-card" data-status="${isPast ? 'past' : 'upcoming'}">
            <div class="excursion-header">
                <h3 class="excursion-title">${exc.name || 'Экскурсия'}</h3>
                <span class="excursion-date">${exc.date || 'Не указана'} ${exc.time || ''}</span>
            </div>
            <div class="excursion-details">
                <div class="excursion-guide">
                    <i class="fas fa-user-tie"></i>
                    <span>${exc.guide || 'Не указан'}</span>
                </div>
                <div class="excursion-info">
                    <span class="excursion-payment">
                        <i class="fas fa-wallet"></i>
                        ${exc.payment === 'card' ? 'Карта' : 'Наличные'}
                    </span>
                    <span class="excursion-price">
                        <i class="fas fa-tag"></i>
                        ${exc.price || '0'} $
                    </span>
                </div>
                <div class="excursion-status ${isPast ? 'status-past' : 'status-upcoming'}">
                    ${isPast ? 'Завершена' : exc.status || 'Забронировано'}
                </div>
            </div>
            ${!isPast ? `
            <button class="excursion-details-btn" data-excursion-id="${exc.id}">
                <i class="fas fa-info-circle"></i> Подробнее
            </button>
            ` : ''}
        </div>
        `;
    }).join('');

    // Добавляем обработчики событий для кнопок
    document.querySelectorAll('.excursion-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const excursionId = this.dataset.excursionId;
            const excursion = excursions.find(e => e.id == excursionId);
            
            if(excursion) {
                showExcursionDetailsModal(excursion);
            }
        });
    });
}

// Отображение деталей экскурсии
function showExcursionDetailsModal(excursion) {
    const excDate = parseExcursionDate(excursion.date, excursion.time);
    const isPast = excDate && excDate < new Date();
    
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${excursion.name || 'Экскурсия'}</h2>
            
            <div class="order-info-grid excursion-grid">
                <div class="order-info-item">
                    <strong>📅 Дата и время:</strong> 
                    <span class="order-info-text">${excursion.date || 'Не указана'} ${excursion.time || ''}</span>
                </div>
                <div class="order-info-item">
                    <strong>📌 Место сбора:</strong> 
                    <span class="order-info-text">${excursion.location || 'Центральный вход в Хижину Чудес'}</span>
                </div>
                <div class="order-info-item">
                    <strong>🕒 Продолжительность:</strong> 
                    <span class="order-info-text">${excursion.duration || '2 часа'}</span>
                </div>
                <div class="order-info-item">
                    <strong>📝 Описание:</strong> 
                    <p class="excursion-description">${excursion.description || 'Описание отсутствует'}</p>
                </div>
                <div class="order-info-item">
                    <strong>👨🏫 Гид:</strong> 
                    <span class="order-info-text">${excursion.guide || 'Не указан'}</span>
                </div>
                <div class="order-info-item">
                    <strong>💳 Способ оплаты:</strong> 
                    <span class="order-info-text">
                        ${excursion.payment === 'card' ? 'Карта' : 'Наличные'}
                    </span>
                </div>
                <div class="order-info-item">
                    <strong>💰 Цена:</strong> 
                    <span class="order-info-text">${excursion.price || '0'} $</span>
                </div>
            </div>
            
            <div class="excursion-actions">
                ${!isPast ? `
                <button class="btn-cancel-excursion" data-id="${excursion.id}">
                    <i class="fas fa-times"></i> Отменить бронь
                </button>
                ` : ''}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.classList.add('active');
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modal.remove();
        }
    });

    if (!isPast) {
        modal.querySelector('.btn-cancel-excursion').addEventListener('click', function() {
            const excursions = JSON.parse(localStorage.getItem('excursions')) || [];
            const updatedExcursions = excursions.filter(e => e.id != this.dataset.id);
            localStorage.setItem('excursions', JSON.stringify(updatedExcursions));
            loadExcursions();
            modal.classList.remove('active');
            modal.remove();
        });
    }
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
    // Обновляем активную вкладку
    document.querySelectorAll('.excursions-section .tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === filter);
    });
    
    // Загружаем экскурсии с учетом фильтра
    loadExcursions();
}

// Редактирование профиля
document.querySelector('.btn-edit-profile').addEventListener('click', function() {
    const savedUserData = JSON.parse(localStorage.getItem('userData')) || {};
    const currentEmail = savedUserData.email || 'ivanov@gmail.com';
    const currentPhone = savedUserData.phone || '+375 (XX) XXX-XX-XX';

    const editModal = document.createElement('div');
    editModal.className = 'edit-modal';
    editModal.innerHTML = `
        <div class="modal-content">
            <h2>Редактирование профиля</h2>
            <form id="editProfileForm">
                <div class="form-group">
                    <label>Имя:</label>
                    <input type="text" id="editName" value="${savedUserData.name || 'Иван Иванов'}" required>
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="editEmail" value="${currentEmail}" required>
                    <small class="error-message" id="emailError"></small>
                </div>
                <div class="form-group">
                    <label>Телефон:</label>
                    <input type="tel" id="editPhone" value="${currentPhone}" required maxlength="16">
                    <small class="error-message" id="phoneError"></small>
                </div>
                <div class="form-group">
                    <label>Адрес:</label>
                    <input type="text" id="editAddress" value="${savedUserData.address || ''}" placeholder="Введите ваш адрес">
                </div>
                <div class="form-group">
                    <label>Дата рождения:</label>
                    <input type="date" id="editBirthday" value="${savedUserData.birthday || ''}">
                </div>
                <div class="form-group">
                    <label>О себе:</label>
                    <textarea id="editAbout" rows="3" placeholder="Расскажите о себе" maxlength="500">${savedUserData.about || ''}</textarea>
                    <div class="char-counter"><span id="charCount">${(savedUserData.about || '').length}</span>/500</div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-save">Сохранить</button>
                    <button type="button" class="btn-cancel">Отмена</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(editModal);
    editModal.classList.add('active');

    const textarea = editModal.querySelector('#editAbout');
    const charCount = editModal.querySelector('#charCount');
    textarea.addEventListener('input', () => {
        charCount.textContent = textarea.value.length;
    });

    editModal.querySelector('.btn-cancel').addEventListener('click', () => {
        editModal.remove();
    });
    
    editModal.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newName = document.getElementById('editName').value;
        const newEmail = document.getElementById('editEmail').value;
        const newPhone = document.getElementById('editPhone').value;
        const newAddress = document.getElementById('editAddress').value;
        const newBirthday = document.getElementById('editBirthday').value;
        const newAbout = document.getElementById('editAbout').value;
        
        if (!validateEmail(newEmail)) {
            document.getElementById('emailError').textContent = 'Введите корректный email';
            return;
        } else {
            document.getElementById('emailError').textContent = '';
        }
        
        if (!validatePhone(newPhone)) {
            document.getElementById('phoneError').textContent = 'Введите корректный номер телефона';
            return;
        } else {
            document.getElementById('phoneError').textContent = '';
        }
        
        const userData = {
            name: newName,
            email: newEmail,
            phone: newPhone,
            address: newAddress,
            birthday: newBirthday,
            about: newAbout
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        loadUserData();
        editModal.remove();
    });
});

// Показать/скрыть подробную информацию
document.querySelector('.btn-details').addEventListener('click', function() {
    const fullDetails = document.getElementById('fullDetails');
    if (fullDetails.style.display === 'none') {
        fullDetails.style.display = 'block';
        this.innerHTML = '<i class="fas fa-eye-slash"></i> Скрыть';
    } else {
        fullDetails.style.display = 'none';
        this.innerHTML = '<i class="fas fa-info-circle"></i> Подробнее';
    }
});

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('userData')) {
        localStorage.setItem('userData', JSON.stringify({
            name: 'Иван Иванов',
            email: 'ivanov@gmail.com',
            phone: '+375 (XX) XXX-XX-XX'
        }));
    }
    
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
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = e => {
                userAvatar.src = e.target.result;
                localStorage.setItem('userAvatar', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    if (localStorage.getItem('userAvatar')) {
        userAvatar.src = localStorage.getItem('userAvatar');
    }

    // Кнопки "Показать/Скрыть"
    document.querySelectorAll('.btn-show').forEach(btn => {
        btn.addEventListener('click', function() {
            const field = this.dataset.field;
            const element = document.getElementById(`user${field.charAt(0).toUpperCase() + field.slice(1)}`);
            const masked = localStorage.getItem(`user${field.charAt(0).toUpperCase() + field.slice(1)}Masked`);
            const full = localStorage.getItem(`user${field.charAt(0).toUpperCase() + field.slice(1)}Full`);

            if (!full || full === 'undefined') {
                this.style.display = 'none';
                return;
            }

            if (element.textContent === masked) {
                element.textContent = full;
                this.textContent = 'Скрыть';
                this.classList.add('btn-hide');
            } else {
                element.textContent = masked;
                this.textContent = 'Показать';
                this.classList.remove('btn-hide');
            }
        });
    });

    // Переключение табов
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabContainer = this.closest('.tabs-container');
            tabContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.tab;
            if (tabContainer.parentElement.classList.contains('orders-section')) {
                filterOrders(filter);
            } else {
                filterExcursions(filter);
            }
        });
    });
    
    // Периодическая проверка экскурсий (каждую минуту)
    setInterval(() => {
        updateExcursionsStatus();
        loadExcursions();
    }, 60000);
});