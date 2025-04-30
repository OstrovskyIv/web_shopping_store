<template>
    <main>
      <section class="products-section">
        <h2 class="section-title">Товары от дяди Стена!</h2>
        <div class="products-container">
          <div v-for="product in products" :key="product.id" class="product-card">
            <!-- Карточка товара -->
          </div>
        </div>
      </section>
  
      <section class="excursions-section" id="excursions">
        <!-- Секция экскурсий -->
      </section>
  
      <!-- Модальные окна -->
      <ProductModal v-if="showModal" :product="selectedProduct" @close="closeModal"/>
    </main>
  </template>
  
  <script>
  import ProductModal from '@/components/ProductModal.vue'
  
  export default {
    name: 'ShopView',
    components: { ProductModal },
    data() {
      return {
        products: [], // Заполняется из API или Vuex
        selectedProduct: null,
        showModal: false
      }
    },
    methods: {
      showProductDetails(product) {
        this.selectedProduct = product
        this.showModal = true
      },
      closeModal() {
        this.showModal = false
      }
    }
  }
  </script>
  
  <style scoped src="@/assets/css/shop.css"></style>