<template>
  <main class="account-container">
    <div id="userView" class="user-view">
      <!-- Секция профиля -->
      <div class="profile-section">
        <div class="profile-picture">
          <img id="userAvatar" :src="user.avatar" alt="Аватар пользователя">
          <div class="avatar-actions">
            <button id="changeAvatarBtn" class="btn-avatar" @click="triggerAvatarUpload">
              <i class="fas fa-camera"></i> Изменить фото
            </button>
            <input type="file" id="avatarUpload" accept="image/*" style="display: none;" @change="handleAvatarChange">
          </div>
        </div>

        <div class="profile-info">
          <h2 class="profile-name">{{ user.name }}</h2>
          <div class="profile-details">
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-envelope"></i> Email:</span>
              <span class="detail-value" id="userEmail">{{ maskedEmail }}</span>
              <button class="btn-show" :class="{ 'btn-hide': showEmail }" @click="toggleEmail">
                {{ showEmail ? 'Скрыть' : 'Показать' }}
              </button>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-phone"></i> Телефон:</span>
              <span class="detail-value" id="userPhone">{{ maskedPhone }}</span>
              <button class="btn-show" :class="{ 'btn-hide': showPhone }" @click="togglePhone">
                {{ showPhone ? 'Скрыть' : 'Показать' }}
              </button>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-shopping-bag"></i> Заказов:</span>
              <span class="detail-value" id="orderCount">{{ orders.length }}</span>
            </div>
          </div>
          <div class="profile-actions">
            <button class="btn-details" @click="toggleDetails">
              <i class="fas fa-info-circle"></i> {{ showDetails ? 'Скрыть детали' : 'Подробнее' }}
            </button>
            <button class="btn-edit-profile" @click="openEditModal">
              <i class="fas fa-edit"></i> Редактировать
            </button>
          </div>
          <div class="full-details" id="fullDetails" v-if="showDetails">
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-home"></i> Адрес:</span>
              <span class="detail-value" id="userAddress">{{ user.address || 'Не указан' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-birthday-cake"></i> Дата рождения:</span>
              <span class="detail-value" id="userBirthday">{{ user.birthday || 'Не указана' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label"><i class="fas fa-user"></i> О себе:</span>
              <span class="detail-value" id="userAbout">{{ user.about || 'Не указано' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Секция заказов -->
      <section class="orders-section">
        <h2 class="section-title">
          <i class="fas fa-shopping-bag"></i> Мои заказы
        </h2>
        
        <div class="tabs-container">
          <div class="tabs-nav">
            <button class="tab-btn" :class="{ active: orderTab === 'all' }" @click="orderTab = 'all'">Все заказы</button>
            <button class="tab-btn" :class="{ active: orderTab === 'active' }" @click="orderTab = 'active'">Активные</button>
            <button class="tab-btn" :class="{ active: orderTab === 'completed' }" @click="orderTab = 'completed'">Завершенные</button>
          </div>
        </div>
        
        <div class="orders-list" id="ordersList">
          <div v-if="filteredOrders.length === 0" class="empty-state">
            <i class="fas fa-box-open"></i>
            <p>У вас пока нет заказов</p>
            <router-link to="/shop" class="btn-shop">Перейти в магазин</router-link>
          </div>
          
          <div v-else class="order-card" v-for="order in filteredOrders" :key="order.id">
            <div class="order-header">
              <div>
                <span class="order-id">Заказ #{{ order.id }}</span>
                <span class="order-date">{{ formatDate(order.date) }}</span>
              </div>
              <span class="order-status" :class="'status-' + order.status">{{ getStatusText(order.status) }}</span>
            </div>
            
            <div class="order-items">
              <div class="order-item" v-for="item in order.items.slice(0, 2)" :key="item.id">
                <img :src="item.image" :alt="item.name" class="item-image">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-quantity">x{{ item.quantity }}</span>
              </div>
              <div v-if="order.items.length > 2" class="order-item">
                <span class="item-name">+{{ order.items.length - 2 }} ещё</span>
              </div>
            </div>
            
            <div class="order-summary">
              <span class="order-total">Итого: {{ formatPrice(order.total) }}</span>
              <div class="order-buttons">
                <button class="order-details-btn" @click="openOrderModal(order)">
                  <i class="fas fa-info-circle"></i> Подробнее
                </button>
                <button v-if="order.status === 'pending'" class="order-cancel-btn" @click="cancelOrder(order.id)">
                  <i class="fas fa-times"></i> Отменить
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Секция экскурсий -->
      <section class="excursions-section">
        <h2 class="section-title">
          <i class="fas fa-map-marked-alt"></i> Мои экскурсии
        </h2>
        
        <div class="tabs-container">
          <div class="tabs-nav">
            <button class="tab-btn" :class="{ active: excursionTab === 'upcoming' }" @click="excursionTab = 'upcoming'">Предстоящие</button>
            <button class="tab-btn" :class="{ active: excursionTab === 'past' }" @click="excursionTab = 'past'">Прошедшие</button>
          </div>
        </div>
        
        <div class="excursions-list" id="excursionsList">
          <div v-if="filteredExcursions.length === 0" class="empty-state">
            <i class="fas fa-binoculars"></i>
            <p>У вас нет активных экскурсий</p>
            <router-link to="/shop#excursions" class="btn-shop">Посмотреть экскурсии</router-link>
          </div>
          
          <div v-else class="excursion-card" v-for="excursion in filteredExcursions" :key="excursion.id">
            <div class="excursion-header">
              <h3 class="excursion-title">{{ excursion.title }}</h3>
              <span class="excursion-date">{{ formatDate(excursion.date) }}</span>
            </div>
            
            <div class="excursion-details">
              <div class="excursion-guide">
                <i class="fas fa-user"></i>
                <span>Гид: {{ excursion.guide }}</span>
              </div>
              <div class="excursion-info">
                <i class="fas fa-map-marker-alt"></i>
                <span>Место: {{ excursion.location }}</span>
              </div>
              <div class="excursion-info">
                <i class="fas fa-clock"></i>
                <span>Длительность: {{ excursion.duration }} часов</span>
              </div>
              <span class="excursion-status" :class="'status-' + excursion.status">
                {{ excursion.status === 'upcoming' ? 'Предстоящая' : 'Завершена' }}
              </span>
            </div>
            
            <div class="order-summary">
              <span class="order-total">Цена: {{ formatPrice(excursion.price) }}</span>
              <div class="order-buttons">
                <button class="excursion-details-btn" @click="openExcursionModal(excursion)">
                  <i class="fas fa-info-circle"></i> Подробнее
                </button>
                <button v-if="excursion.status === 'upcoming'" class="btn-cancel-excursion" @click="cancelExcursion(excursion.id)">
                  <i class="fas fa-times"></i> Отменить
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Модальное окно редактирования профиля -->
    <div class="modal-overlay edit-modal" :class="{ active: showEditModal }">
      <div class="modal-content">
        <button class="close-modal" @click="closeEditModal">
          <i class="fas fa-times"></i>
        </button>
        <h2>Редактировать профиль</h2>
        
        <div class="form-group">
          <label for="editName">Имя:</label>
          <input type="text" id="editName" v-model="editForm.name">
        </div>
        
        <div class="form-group">
          <label for="editEmail">Email:</label>
          <input type="email" id="editEmail" v-model="editForm.email">
        </div>
        
        <div class="form-group">
          <label for="editPhone">Телефон:</label>
          <input type="tel" id="editPhone" v-model="editForm.phone">
        </div>
        
        <div class="form-group">
          <label for="editAddress">Адрес:</label>
          <input type="text" id="editAddress" v-model="editForm.address">
        </div>
        
        <div class="form-group">
          <label for="editBirthday">Дата рождения:</label>
          <input type="date" id="editBirthday" v-model="editForm.birthday">
        </div>
        
        <div class="form-group">
          <label for="editAbout">О себе:</label>
          <textarea id="editAbout" v-model="editForm.about"></textarea>
          <span class="char-counter">{{ editForm.about.length }}/500</span>
        </div>
        
        <div class="form-actions">
          <button class="btn-cancel" @click="closeEditModal">
            <i class="fas fa-times"></i> Отмена
          </button>
          <button class="btn-save" @click="saveProfile">
            <i class="fas fa-save"></i> Сохранить
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно деталей заказа -->
    <div class="modal-overlay order-modal" :class="{ active: showOrderModal }">
      <div class="modal-content">
        <button class="close-modal" @click="closeOrderModal">
          <i class="fas fa-times"></i>
        </button>
        <h2>Детали заказа #{{ currentOrder?.id }}</h2>
        
        <div class="order-info-grid">
          <div class="order-info-item">
            <strong><i class="fas fa-calendar-alt"></i> Дата заказа:</strong>
            <span class="order-info-text">{{ currentOrder ? formatDate(currentOrder.date) : '' }}</span>
          </div>
          <div class="order-info-item">
            <strong><i class="fas fa-truck"></i> Статус:</strong>
            <span class="order-info-text">{{ currentOrder ? getStatusText(currentOrder.status) : '' }}</span>
          </div>
          <div class="order-info-item">
            <strong><i class="fas fa-map-marker-alt"></i> Адрес доставки:</strong>
            <span class="order-info-text">{{ currentOrder?.deliveryAddress || 'Не указан' }}</span>
          </div>
          <div class="order-info-item">
            <strong><i class="fas fa-credit-card"></i> Способ оплаты:</strong>
            <span class="order-info-text">{{ currentOrder?.paymentMethod || 'Не указан' }}</span>
          </div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Итого</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentOrder?.items" :key="item.id">
              <td class="item-image-cell">
                <img :src="item.image" :alt="item.name" class="item-image-table">
                <span class="item-name-text">{{ item.name }}</span>
              </td>
              <td class="item-price-text">{{ formatPrice(item.price) }}</td>
              <td class="item-quantity-text">{{ item.quantity }}</td>
              <td class="item-total-text">{{ formatPrice(item.price * item.quantity) }}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="total-spent">
          <i class="fas fa-wallet"></i>
          <span>Общая сумма: {{ currentOrder ? formatPrice(currentOrder.total) : '' }}</span>
        </div>
      </div>
    </div>

    <!-- Модальное окно деталей экскурсии -->
    <div class="modal-overlay order-modal" :class="{ active: showExcursionModal }">
      <div class="modal-content">
        <button class="close-modal" @click="closeExcursionModal">
          <i class="fas fa-times"></i>
        </button>
        <h2>{{ currentExcursion?.title }}</h2>
        
        <div class="excursion-grid">
          <div class="order-info-item">
            <strong><i class="fas fa-calendar-alt"></i> Дата:</strong>
            <span class="order-info-text">{{ currentExcursion ? formatDate(currentExcursion.date) : '' }}</span>
          </div>
          <div class="order-info-item">
            <strong><i class="fas fa-clock"></i> Время:</strong>
            <span class="order-info-text">{{ currentExcursion?.time || 'Не указано' }}</span>
          </div>
          <div class="order-info-item">
            <strong><i class="fas fa-user"></i> Гид:</strong>
            <span class="order-info-text">{{ currentExcursion?.guide || 'Не указан' }}</span>
          </div>
          <div class="order-info-item">
            <strong><i class="fas fa-map-marker-alt"></i> Место встречи:</strong>
            <span class="order-info-text">{{ currentExcursion?.meetingPoint || 'Не указано' }}</span>
          </div>
        </div>
        
        <div class="excursion-description">
          <h3>Описание экскурсии:</h3>
          <p>{{ currentExcursion?.description || 'Описание отсутствует' }}</p>
        </div>
        
        <div v-if="currentExcursion?.features" class="excursion-features">
          <h3>Что включено:</h3>
          <ul>
            <li v-for="(feature, index) in currentExcursion.features" :key="index">{{ feature }}</li>
          </ul>
        </div>
        
        <div class="total-spent">
          <i class="fas fa-tag"></i>
          <span>Цена: {{ currentExcursion ? formatPrice(currentExcursion.price) : '' }}</span>
        </div>
        
        <button v-if="currentExcursion?.status === 'upcoming'" class="btn-cancel-excursion" @click="cancelExcursion(currentExcursion?.id)">
          <i class="fas fa-times"></i> Отменить экскурсию
        </button>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'AccountView',
  data() {
    return {
      user: {
        name: 'Иван Иванов',
        email: 'ivanov@gmail.com',
        phone: '+375 29 123 45 67',
        avatar: require('@/assets/pictures/default-avatar.jpg'),
        address: 'г. Минск, ул. Ленина, д. 10, кв. 5',
        birthday: '1985-05-15',
        about: 'Люблю путешествия и приключения. Особенно нравятся места с историей и загадками.'
      },
      orders: [
        {
          id: '1001',
          date: '2023-05-15',
          status: 'completed',
          deliveryAddress: 'г. Минск, ул. Ленина, д. 10, кв. 5',
          paymentMethod: 'Картой онлайн',
          items: [
            { id: '1', name: 'Старинный глобус', price: 120, quantity: 1, image: require('@/assets/pictures/globus.jpg') },
            { id: '2', name: 'Книга тайн', price: 45, quantity: 2, image: require('@/assets/pictures/book.jpg') }
          ],
          total: 210
        },
        {
          id: '1002',
          date: '2023-06-20',
          status: 'processing',
          deliveryAddress: 'г. Минск, ул. Ленина, д. 10, кв. 5',
          paymentMethod: 'Картой онлайн',
          items: [
            { id: '3', name: 'Карта сокровищ', price: 75, quantity: 1, image: require('@/assets/pictures/map.jpg') }
          ],
          total: 75
        }
      ],
      excursions: [
        {
          id: '2001',
          title: 'Тайны старого города',
          date: '2023-07-10',
          time: '10:00',
          status: 'upcoming',
          guide: 'Александр Петров',
          location: 'Исторический центр',
          duration: 3,
          meetingPoint: 'Площадь Свободы, у фонтана',
          description: 'Увлекательная экскурсия по самым загадочным местам старого города, где сохранились следы древних цивилизаций и средневековые тайны.',
          features: [
            'Экскурсия с профессиональным гидом',
            'Посещение 5 исторических мест',
            'Фотосессия в старинном стиле',
            'Чай в старинной кофейне'
          ],
          price: 50
        },
        {
          id: '2002',
          title: 'По следам древних легенд',
          date: '2023-04-22',
          time: '14:00',
          status: 'past',
          guide: 'Мария Иванова',
          location: 'Старый замок',
          duration: 2,
          meetingPoint: 'У главных ворот замка',
          description: 'Экскурсия по древнему замку с рассказом о его легендах и призраках.',
          features: [
            'Экскурсия с профессиональным гидом',
            'Посещение замковых покоев',
            'Рассказы о местных легендах'
          ],
          price: 35
        }
      ],
      showDetails: false,
      showEmail: false,
      showPhone: false,
      showEditModal: false,
      showOrderModal: false,
      showExcursionModal: false,
      orderTab: 'all',
      excursionTab: 'upcoming',
      currentOrder: null,
      currentExcursion: null,
      editForm: {
        name: '',
        email: '',
        phone: '',
        address: '',
        birthday: '',
        about: ''
      }
    }
  },
  computed: {
    maskedEmail() {
      return this.showEmail ? this.user.email : this.user.email.replace(/(.{3}).*@/, '$1*****@')
    },
    maskedPhone() {
      if (this.showPhone) return this.user.phone
      const parts = this.user.phone.split(' ')
      return `${parts[0]} ${parts[1].replace(/\d/g, '*')} ${parts[2].replace(/\d/g, '*')} ${parts[3].substring(0, 2)}**`
    },
    filteredOrders() {
      if (this.orderTab === 'all') return this.orders
      return this.orders.filter(order => {
        if (this.orderTab === 'active') return ['pending', 'processing'].includes(order.status)
        return order.status === 'completed'
      })
    },
    filteredExcursions() {
      if (this.excursionTab === 'upcoming') {
        return this.excursions.filter(ex => ex.status === 'upcoming')
      }
      return this.excursions.filter(ex => ex.status === 'past')
    }
  },
  created() {
    this.resetEditForm()
  },
  methods: {
    toggleDetails() {
      this.showDetails = !this.showDetails
    },
    toggleEmail() {
      this.showEmail = !this.showEmail
    },
    togglePhone() {
      this.showPhone = !this.showPhone
    },
    openEditModal() {
      this.resetEditForm()
      this.showEditModal = true
      document.body.classList.add('modal-open')
    },
    closeEditModal() {
      this.showEditModal = false
      document.body.classList.remove('modal-open')
    },
    openOrderModal(order) {
      this.currentOrder = order
      this.showOrderModal = true
      document.body.classList.add('modal-open')
    },
    closeOrderModal() {
      this.showOrderModal = false
      document.body.classList.remove('modal-open')
    },
    openExcursionModal(excursion) {
      this.currentExcursion = excursion
      this.showExcursionModal = true
      document.body.classList.add('modal-open')
    },
    closeExcursionModal() {
      this.showExcursionModal = false
      document.body.classList.remove('modal-open')
    },
    resetEditForm() {
      this.editForm = {
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
        address: this.user.address,
        birthday: this.user.birthday,
        about: this.user.about
      }
    },
    saveProfile() {
      this.user.name = this.editForm.name
      this.user.email = this.editForm.email
      this.user.phone = this.editForm.phone
      this.user.address = this.editForm.address
      this.user.birthday = this.editForm.birthday
      this.user.about = this.editForm.about
      this.closeEditModal()
      // Здесь можно добавить вызов API для сохранения изменений
    },
    cancelOrder(orderId) {
      if (confirm('Вы уверены, что хотите отменить этот заказ?')) {
        const order = this.orders.find(o => o.id === orderId)
        if (order) {
          order.status = 'cancelled'
          // Здесь можно добавить вызов API для отмены заказа
        }
      }
    },
    cancelExcursion(excursionId) {
      if (confirm('Вы уверены, что хотите отменить эту экскурсию?')) {
        const excursion = this.excursions.find(ex => ex.id === excursionId)
        if (excursion) {
          excursion.status = 'cancelled'
          // Здесь можно добавить вызов API для отмены экскурсии
        }
        this.closeExcursionModal()
      }
    },
    triggerAvatarUpload() {
      document.getElementById('avatarUpload').click()
    },
    handleAvatarChange(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.user.avatar = e.target.result
          // Здесь можно добавить вызов API для сохранения аватарки
        }
        reader.readAsDataURL(file)
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('ru-RU', options)
    },
    formatPrice(price) {
      return `${price.toFixed(2)} руб.`
    },
    getStatusText(status) {
      const statusMap = {
        'pending': 'Ожидает обработки',
        'processing': 'В обработке',
        'completed': 'Завершен',
        'cancelled': 'Отменен'
      }
      return statusMap[status] || status
    }
  }
}
</script>

<style scoped>
/* Основные стили уже подключены через account.css */
/* Добавляем только специфичные для Vue стили, если они нужны */

.modal-open {
  overflow: hidden;
}
</style>