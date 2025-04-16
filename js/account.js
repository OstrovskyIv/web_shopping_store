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
    const defaultUserData = {
        name: 'Иван Иванов',
        email: 'ivanov@gmail.com',
        phone: '+375 29 123 45 67',
        address: '',
        birthday: '',
        about: ''
    };
    
    const savedUserData = JSON.parse(localStorage.getItem('userData')) || {};
    const userData = {...defaultUserData, ...savedUserData};
    
    document.querySelector('.profile-name').textContent = userData.name;
    document.getElementById('userEmail').textContent = userData.email.replace(/(?<=.).(?=.*@)/g, '*');
    document.getElementById('userPhone').textContent = userData.phone.replace(/(?<=\+375)\d{2}(?=\d{3}\d{2}\d{2})/g, '**');
    document.getElementById('userAddress').textContent = userData.address || 'Не указан';
    document.getElementById('userBirthday').textContent = userData.birthday || 'Не указана';
    document.getElementById('userAbout').textContent = userData.about || 'Не указано';
    
    // Обновляем счетчик заказов
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    document.getElementById('orderCount').textContent = orders.length;
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Валидация телефона
function validatePhone(phone) {
    const re = /^\+?\d{7,15}$/;
    return re.test(phone);
}

// Загрузка заказов
function loadOrders() {
    cleanUpOrdersData();
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersList = document.getElementById('ordersList');
    
    // Обновляем счетчик заказов
    document.getElementById('orderCount').textContent = orders.length;
    
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

    // Обработчик кнопки "Отказаться"
    document.querySelectorAll('.order-cancel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'));
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
                    <strong>Дата:</strong> <span class="order-info-text">${order.date}</span>
                </div>
                <div class="order-info-item">
                    <strong>Статус:</strong> <span class="order-status ${getStatusClass(order.status)}">${order.status}</span>
                </div>
                <div class="order-info-item">
                    <strong>Способ оплаты:</strong> <span class="order-info-text">${order.paymentMethod || 'Не указан'}</span>
                </div>
                <div class="order-info-item">
                    <strong>Итого:</strong> <span class="order-info-text">${order.total.toFixed(2)} $</span>
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
            <div class="empty-state">
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

// Редактирование профиля
document.querySelector('.btn-edit-profile').addEventListener('click', function() {
    const savedUserData = JSON.parse(localStorage.getItem('userData')) || {};
    const currentEmail = savedUserData.email || 'ivanov@gmail.com';
    const currentPhone = savedUserData.phone || '+375 29 123 45 67';

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
                    <label>О себе (макс. 500 символов):</label>
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
    
    // Счетчик символов для "О себе"
    const textarea = editModal.querySelector('#editAbout');
    const charCount = editModal.querySelector('#charCount');
    textarea.addEventListener('input', () => {
        charCount.textContent = textarea.value.length;
    });

    // Обработчик отмены
    editModal.querySelector('.btn-cancel').addEventListener('click', () => {
        editModal.remove();
    });
    
    // Обработчик сохранения
    editModal.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newName = document.getElementById('editName').value;
        const newEmail = document.getElementById('editEmail').value;
        const newPhone = document.getElementById('editPhone').value;
        const newAddress = document.getElementById('editAddress').value;
        const newBirthday = document.getElementById('editBirthday').value;
        const newAbout = document.getElementById('editAbout').value;
        
        // Валидация email
        if (!validateEmail(newEmail)) {
            document.getElementById('emailError').textContent = 'Введите корректный email';
            return;
        } else {
            document.getElementById('emailError').textContent = '';
        }
        
        // Валидация телефона
        if (!validatePhone(newPhone)) {
            document.getElementById('phoneError').textContent = 'Введите корректный номер телефона';
            return;
        } else {
            document.getElementById('phoneError').textContent = '';
        }
        
        // Сохраняем данные
        const userData = {
            name: newName,
            email: newEmail,
            phone: newPhone,
            address: newAddress,
            birthday: newBirthday,
            about: newAbout
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Обновляем данные на странице
        loadUserData();
        
        // Обновляем значения для кнопок "Показать"
        const emailValue = newEmail.replace(/(?<=.).(?=.*@)/g, '*');
        const phoneValue = newPhone.replace(/(?<=\+375)\d{2}(?=\d{3}\d{2}\d{2})/g, '**');
        
        document.getElementById('userEmail').textContent = emailValue;
        document.getElementById('userPhone').textContent = phoneValue;
        
        // Обновляем значения для кнопок "Показать" в localStorage
        localStorage.setItem('userEmailValue', emailValue);
        localStorage.setItem('userPhoneValue', phoneValue);
        localStorage.setItem('userEmailFull', newEmail);
        localStorage.setItem('userPhoneFull', newPhone);
        
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
            
            const hiddenValue = localStorage.getItem(`user${field.charAt(0).toUpperCase() + field.slice(1)}Value`) || 
                (field === 'email' ? 'iva*****@gmail.com' : '+375 ** *** ** 67');
                
            const fullValue = localStorage.getItem(`user${field.charAt(0).toUpperCase() + field.slice(1)}Full`) || 
                (field === 'email' ? 'ivanov@gmail.com' : '+375 29 123 45 67');
            
            element.textContent = this.textContent === 'Показать' ? fullValue : hiddenValue;
            this.textContent = this.textContent === 'Показать' ? 'Скрыть' : 'Показать';
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
});