<template>
    <div class="account-container">
      <div id="userView" class="user-view">
        <div class="profile-section">
          <div class="profile-picture">
            <img id="userAvatar" :src="user.avatar" alt="Аватар пользователя">
            <div class="avatar-actions">
              <button id="changeAvatarBtn" class="btn-avatar" @click="changeAvatar">
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
                <button class="btn-show" @click="toggleShow('email')">
                  {{ showEmail ? 'Скрыть' : 'Показать' }}
                </button>
              </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-phone"></i> Телефон:</span>
                <span class="detail-value" id="userPhone">{{ maskedPhone }}</span>
                <button class="btn-show" @click="toggleShow('phone')">
                  {{ showPhone ? 'Скрыть' : 'Показать' }}
                </button>
              </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-shopping-bag"></i> Заказов:</span>
                <span class="detail-value" id="orderCount">{{ user.orders }}</span>
              </div>
            </div>
            <div class="profile-actions">
              <button class="btn-details" @click="toggleDetails">
                <i class="fas" :class="detailsIcon"></i> {{ detailsButtonText }}
              </button>
              <button class="btn-edit-profile" @click="editProfile">
                <i class="fas fa-edit"></i> Редактировать
              </button>
            </div>
            <div class="full-details" id="fullDetails" v-if="showDetails">
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-home"></i> Адрес:</span>
                <span class="detail-value" id="userAddress">{{ user.address }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-birthday-cake"></i> Дата рождения:</span>
                <span class="detail-value" id="userBirthday">{{ user.birthday }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label"><i class="fas fa-user"></i> О себе:</span>
                <span class="detail-value" id="userAbout">{{ user.about }}</span>
              </div>
            </div>
          </div>
        </div>
  
        <section class="orders-section">
          <h2 class="section-title">
            <i class="fas fa-shopping-bag"></i> Мои заказы
          </h2>
          
          <div class="tabs-container">
            <div class="tabs-nav">
              <button class="tab-btn active" @click="setOrderTab('all')">Все заказы</button>
              <button class="tab-btn" @click="setOrderTab('active')">Активные</button>
              <button class="tab-btn" @click="setOrderTab('completed')">Завершенные</button>
            </div>
          </div>
          
          <div class="orders-list" id="ordersList">
            <div class="empty-state" v-if="orders.length === 0">
              <i class="fas fa-box-open"></i>
              <p>У вас пока нет заказов</p>
              <router-link to="/shop" class="btn-shop">Перейти в магазин</router-link>
            </div>
            
            <div class="order-card" v-for="(order, index) in filteredOrders" :key="index" v-else>
              <div class="order-header">
                <h3>Заказ #{{ order.id }}</h3>
                <span class="order-status" :class="order.status">{{ order.statusText }}</span>
              </div>
              <div class="order-details">
                <div class="order-items">
                  <div class="order-item" v-for="(item, i) in order.items" :key="i">
                    <img :src="item.image" :alt="item.name" class="item-image">
                    <div class="item-info">
                      <h4>{{ item.name }}</h4>
                      <p>{{ item.price }} $</p>
                    </div>
                  </div>
                </div>
                <div class="order-summary">
                  <div class="summary-row">
                    <span>Дата заказа:</span>
                    <span>{{ order.date }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Сумма:</span>
                    <span>{{ order.total }} $</span>
                  </div>
                  <button class="order-action-btn" @click="viewOrderDetails(order)">
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        <section class="excursions-section">
          <h2 class="section-title">
            <i class="fas fa-map-marked-alt"></i> Мои экскурсии
          </h2>
          
          <div class="tabs-container">
            <div class="tabs-nav">
              <button class="tab-btn active" @click="setExcursionTab('upcoming')">Предстоящие</button>
              <button class="tab-btn" @click="setExcursionTab('past')">Прошедшие</button>
            </div>
          </div>
          
          <div class="excursions-list" id="excursionsList">
            <div class="empty-state" v-if="excursions.length === 0">
              <i class="fas fa-binoculars"></i>
              <p>У вас нет активных экскурсий</p>
              <router-link to="/shop#excursions" class="btn-shop">Посмотреть экскурсии</router-link>
            </div>
            
            <div class="excursion-card" v-for="(excursion, index) in filteredExcursions" :key="index" v-else>
              <div class="excursion-image">
                <img :src="excursion.image" :alt="excursion.title">
              </div>
              <div class="excursion-info">
                <h3>{{ excursion.title }}</h3>
                <div class="excursion-meta">
                  <div class="meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>{{ excursion.date }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="fas fa-clock"></i>
                    <span>{{ excursion.time }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="fas fa-users"></i>
                    <span>{{ excursion.people }} человек</span>
                  </div>
                </div>
                <p class="excursion-description">
                  {{ excursion.description }}
                </p>
                <button class="excursion-action-btn" @click="viewExcursionDetails(excursion)">
                  Подробнее
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['user'],
    data() {
      return {
        showDetails: false,
        showEmail: false,
        showPhone: false,
        orderTab: 'all',
        excursionTab: 'upcoming',
        orders: [],
        excursions: []
      };
    },
    computed: {
      maskedEmail() {
        return this.showEmail ? this.user.email : this.user.email.replace(/(.{3}).*@/, '$1*****@');
      },
      maskedPhone() {
        return this.showPhone ? this.user.phone : this.user.phone.replace(/(\+\d{3} \d{2})(\d{3})(\d{2})(\d{2})/, '$1 *** $3 $4');
      },
      detailsButtonText() {
        return this.showDetails ? 'Скрыть детали' : 'Подробнее';
      },
      detailsIcon() {
        return this.showDetails ? 'fa-eye-slash' : 'fa-info-circle';
      },
      filteredOrders() {
        if (this.orderTab === 'all') return this.orders;
        return this.orders.filter(order => order.status === this.orderTab);
      },
      filteredExcursions() {
        if (this.excursionTab === 'upcoming') {
          return this.excursions.filter(ex => new Date(ex.date) > new Date());
        }
        return this.excursions.filter(ex => new Date(ex.date) <= new Date());
      }
    },
    methods: {
      toggleDetails() {
        this.showDetails = !this.showDetails;
      },
      toggleShow(field) {
        if (field === 'email') this.showEmail = !this.showEmail;
        if (field === 'phone') this.showPhone = !this.showPhone;
      },
      changeAvatar() {
        document.getElementById('avatarUpload').click();
      },
      handleAvatarChange(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.user.avatar = event.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      editProfile() {
        this.$emit('open-modal', 'Редактирование профиля');
      },
      setOrderTab(tab) {
        this.orderTab = tab;
      },
      setExcursionTab(tab) {
        this.excursionTab = tab;
      },
      viewOrderDetails(order) {
        this.$emit('open-modal', `Детали заказа #${order.id}`);
      },
      viewExcursionDetails(excursion) {
        this.$emit('open-modal', `Детали экскурсии "${excursion.title}"`);
      }
    },
    mounted() {
      // Загрузка заказов и экскурсий пользователя
    }
  };
  </script>