const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// Импортируем компоненты
const Home = {
    template: `
        <div class="home-container">
            <!-- Здесь будет содержимое Home.vue -->
        </div>
    `,
    // Остальные методы и данные
};

const Shop = {
    template: `
        <div class="shop-container">
            <!-- Здесь будет содержимое Shop.vue -->
        </div>
    `,
    // Остальные методы и данные
};

const Basket = {
    template: `
        <div class="basket-container">
            <!-- Здесь будет содержимое Basket.vue -->
        </div>
    `,
    // Остальные методы и данные
};

const Account = {
    template: `
        <div class="account-container">
            <!-- Здесь будет содержимое Account.vue -->
        </div>
    `,
    // Остальные методы и данные
};

// Создаем маршруты
const routes = [
    { path: '/', component: Home },
    { path: '/shop', component: Shop },
    { path: '/basket', component: Basket },
    { path: '/account', component: Account }
];

// Создаем роутер
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// Создаем приложение Vue
const app = createApp({
    data() {
        return {
            showModal: false,
            modalText: '',
            showRegistrationModal: false,
            showLoginModal: false,
            showProductModal: false,
            showExcursionDetailsModal: false,
            showBookingModal: false,
            registration: {
                username: '',
                email: '',
                password: ''
            },
            loginData: {
                email: '',
                password: ''
            },
            currentProduct: {
                name: '',
                image: '',
                description: '',
                price: ''
            },
            currentExcursion: {
                title: '',
                photos: [],
                description: '',
                duration: ''
            },
            booking: {
                date: '',
                time: '',
                people: 1
            },
            cart: [],
            user: {
                name: 'Иван Иванов',
                email: 'ivan@gmail.com',
                phone: '+375 29 123 45 67',
                avatar: 'pictures/default-avatar.jpg',
                orders: 0,
                address: 'Не указан',
                birthday: 'Не указана',
                about: 'Не указано'
            },
            isNightMode: false
        };
    },
    methods: {
        openModal(text) {
            this.modalText = text;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        openRegistrationModal() {
            this.showRegistrationModal = true;
        },
        closeRegistrationModal() {
            this.showRegistrationModal = false;
        },
        openLoginModal() {
            this.showLoginModal = true;
        },
        closeLoginModal() {
            this.showLoginModal = false;
        },
        openProductModal(product) {
            this.currentProduct = product;
            this.showProductModal = true;
        },
        closeProductModal() {
            this.showProductModal = false;
        },
        openExcursionModal(excursion) {
            this.currentExcursion = excursion;
            this.showExcursionDetailsModal = true;
        },
        closeExcursionModal() {
            this.showExcursionDetailsModal = false;
        },
        openBookingModal() {
            this.showBookingModal = true;
        },
        closeBookingModal() {
            this.showBookingModal = false;
        },
        register() {
            // Логика регистрации
            this.closeRegistrationModal();
            this.openModal('Регистрация прошла успешно!');
        },
        login() {
            // Логика входа
            this.closeLoginModal();
            this.openModal('Вход выполнен успешно!');
        },
        addToCart(product) {
            this.cart.push(product);
            this.closeProductModal();
            this.openModal('Товар добавлен в корзину!');
        },
        bookExcursion() {
            // Логика бронирования экскурсии
            this.closeBookingModal();
            this.openModal('Экскурсия забронирована!');
        },
        setDayMode() {
            this.isNightMode = false;
            document.body.classList.remove('night-mode');
        },
        setNightMode() {
            this.isNightMode = true;
            document.body.classList.add('night-mode');
        },
        toggleDetails() {
            // Логика переключения деталей в аккаунте
        },
        changeAvatar() {
            // Логика смены аватара
        }
    },
    computed: {
        totalCartItems() {
            return this.cart.length;
        },
        totalCartPrice() {
            return this.cart.reduce((total, item) => total + parseFloat(item.price), 0);
        }
    }
});

// Используем роутер
app.use(router);

// Монтируем приложение
app.mount('#app');