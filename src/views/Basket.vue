<template>
    <section class="basket-section">
      <div class="basket-container">
        <div class="basket-items">
          <div v-if="!basketItems.length" class="empty-basket-message">
            <!-- Сообщение о пустой корзине -->
          </div>
          <div v-else v-for="item in basketItems" :key="item.id" class="basket-item">
            <!-- Отображение товаров -->
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { mapState } from 'vuex'
  
  export default {
    computed: {
      ...mapState(['basketItems'])
    }
  }
  </script>
  
  <style scoped src="../assets/css/basket.css"></style>