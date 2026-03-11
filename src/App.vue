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
:root {
  --v-border-color: rgba(0, 0, 0, 0.08);
}

.v-theme--dark {
  --v-border-color: rgba(255, 255, 255, 0.08);
}

html, body {
  scroll-behavior: smooth;
  font-family: 'Inter', 'Outfit', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}

.bg-background {
  background-color: rgb(var(--v-theme-background)) !important;
}

/* Eye-friendly text colors */
.text-grey-darken-4, .text-grey-darken-3 {
  color: rgb(var(--v-theme-on-surface)) !important;
}

.text-grey-darken-1 {
  color: rgba(var(--v-theme-on-surface), 0.7) !important;
}

.v-data-table {
  background: transparent !important;
}

.v-data-table :deep(th) {
  color: rgba(var(--v-theme-on-surface), 0.6) !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  font-size: 0.75rem !important;
  letter-spacing: 0.05em;
}

.v-data-table :deep(td) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

.border-light {
  border: 1px solid var(--v-border-color) !important;
}

.border-b-light {
  border-bottom: 1px solid var(--v-border-color) !important;
}

/* Custom scrollbar to match theme */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-on-surface), 0.2);
}
</style>
