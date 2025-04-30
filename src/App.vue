<template>
    <AppHeader />
    <router-view></router-view>
    <AppFooter />
  </template>
  
  <script>
  import AppHeader from './components/AppHeader.vue'
  import AppFooter from './components/AppFooter.vue'
  
  export default {
    components: {
      AppHeader,
      AppFooter
    }
  }
  </script>
  
  <style>
  /* Глобальные стили */
  @import './assets/css/style.css';
  </style>