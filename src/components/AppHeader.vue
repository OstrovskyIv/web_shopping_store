<template>
  <header>
    <div class="logo">
      <router-link to="/">
        <img src="@/assets/pictures/LoGo.png" alt="Логотип Хижины чудес">
      </router-link>
    </div>
    <nav>
      <ul>
        <li>
          <router-link 
            to="/" 
            :class="{ 'active': $route.path === '/' }"
          >
            Главная
          </router-link>
        </li>
        <li>
          <router-link 
            to="/shop" 
            :class="{ 'active': $route.path === '/shop' }"
          >
            Товары
          </router-link>
        </li>
        <li>
          <router-link 
            to="/basket" 
            :class="{ 'active': $route.path === '/basket' }"
          >
            Корзина
          </router-link>
        </li>
        <li>
          <router-link 
            to="/account" 
            :class="{ 'active': $route.path === '/account' }"
          >
            <i class="fas fa-user"></i> Аккаунт
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  // Можно добавить логику для мобильного меню, если нужно
}
</script>

<style scoped>
/* Основные стили хедера */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo img {
  height: 50px;
  transition: transform 0.3s ease;
}

.logo img:hover {
  transform: scale(1.05);
}

nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav li {
  margin-left: 2rem;
}

nav a {
  color: #ecf0f1;
  text-decoration: none;
  font-family: 'MedievalSharp', cursive;
  font-size: 1.1rem;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

nav a:hover {
  color: #f39c12;
}

nav a.active {
  color: #f1c40f;
  font-weight: bold;
  position: relative;
}

nav a.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #f1c40f;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  header {
    flex-direction: column;
    padding: 1rem;
  }
  
  nav ul {
    margin-top: 1rem;
  }
  
  nav li {
    margin-left: 1rem;
    margin-right: 1rem;
  }
}
</style>