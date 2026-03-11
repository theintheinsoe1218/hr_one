<template>
  <v-app>
    <v-main>
      <component :is="layout">
        <router-view></router-view>
      </component>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from './components/layout/DashboardLayout.vue'

const route = useRoute()

const layout = computed(() => {
  if (route.name === 'login') return 'div'
  return DashboardLayout
})
</script>

<style>
/* Global styles for dark mode compatibility and sleek rendering */
body {
  font-family: 'Inter', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}
.bg-background {
  background-color: rgb(var(--v-theme-background)) !important;
}
</style>
