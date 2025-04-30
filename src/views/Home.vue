<template>
    <main>
      <!-- Содержимое из index.html -->
      <div class="backSharck">
        <img src="../assets/pictures/backSharck.png" alt="Фоновое изображение Хижины чудес">
        <div class="welcome-message day-mode">Добро пожаловать...</div>
        <!-- Остальное содержимое -->
      </div>
    </main>
  </template>
  
  <script>
  export default {
    name: 'HomeView',
    methods: {
      setDayMode() { /* ... */ },
      setNightMode() { /* ... */ }
    }
  }
  </script>
  
  <style scoped src="../assets/css/style.css"></style>