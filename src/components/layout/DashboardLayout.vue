<template>
  <v-app>
    <!-- Responsive Navigation Drawer -->
    <v-navigation-drawer 
      v-model="drawer" 
      :rail="rail && $vuetify.display.lgAndUp"
      :permanent="$vuetify.display.lgAndUp"
      :temporary="$vuetify.display.mdAndDown"
      @click="rail = false" 
      color="surface" 
      elevation="2" 
      class="d-flex flex-column"
    >
      <!-- Fixed Header -->
      <div class="d-flex align-center pa-2 flex-shrink-0" :class="(rail && $vuetify.display.lgAndUp) ? 'justify-center' : 'pa-4'">
        <v-avatar color="primary" rounded size="40" :class="(rail && $vuetify.display.lgAndUp) ? 'mr-0' : 'mr-3'">
          <span class="text-white font-weight-bold">HR</span>
        </v-avatar>
        <div v-show="!(rail && $vuetify.display.lgAndUp)" class="lh-tight">
          <div class="font-weight-bold text-h6 text-grey-darken-4">HRMS Pro</div>
          <div class="text-caption text-grey-darken-1 font-weight-medium">Human Resources</div>
        </div>
        <v-spacer v-show="!(rail && $vuetify.display.lgAndUp)"></v-spacer>
        <v-btn v-show="!(rail && $vuetify.display.lgAndUp) && $vuetify.display.lgAndUp" icon="mdi-chevron-left" variant="text" density="comfortable" @click.stop="rail = !rail"></v-btn>
      </div>
      
      <v-divider class="flex-shrink-0"></v-divider>
 
      <!-- Scrollable Menu -->
      <div class="flex-grow-1 overflow-y-auto custom-scrollbar">
        <v-list density="comfortable" nav class="px-3 mt-4" :class="(rail && $vuetify.display.lgAndUp) ? 'px-1' : 'px-3'">
          <v-list-item v-for="item in menuItems" :key="item.value"
            :prepend-icon="item.icon" 
            :title="item.title" 
            :value="item.value" 
            :to="item.to"
            class="mb-1 rounded-lg"
            :class="(rail && $vuetify.display.lgAndUp) ? 'px-2' : 'px-4'" 
            active-class="bg-primary text-white shadow-item"
          ></v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>

    <v-app-bar elevation="0" color="background" class="border-b px-4">
      <v-app-bar-nav-icon v-if="$vuetify.display.mdAndDown" @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-toolbar-title class="font-weight-bold text-md-h5 text-subtitle-1 text-grey-darken-3">{{ pageTitle }}</v-toolbar-title>
      
      <v-spacer></v-spacer>

      <v-btn icon class="mr-2" @click="toggleFullscreen">
        <v-icon>{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
      </v-btn>
      <v-btn icon class="mr-2">
        <v-badge dot color="error">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>
      <v-btn icon @click="toggleTheme" class="mr-2">
        <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-menu min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="primary" size="36">
              <v-img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Admin"></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
            title="Admin User"
            subtitle="admin@synergy.com"
          >
          </v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list-item prepend-icon="mdi-account-outline" title="My Profile" value="profile"></v-list-item>
          <v-list-item prepend-icon="mdi-cog-outline" title="Settings" value="settings"></v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list-item prepend-icon="mdi-logout" title="Logout" value="logout" color="error" @click="logout"></v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="bg-background main-content">
      <div class="scroll-container pa-4 pa-md-6 custom-scrollbar">
        <div class="content-wrapper">
          <router-view></router-view>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useTheme } from 'vuetify'
import { useFullscreen } from '@vueuse/core'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const theme = useTheme()
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

const drawer = ref(null)
const rail = ref(true)

const menuItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', value: 'dashboard', to: { name: 'dashboard' } },
  { title: 'Employees', icon: 'mdi-account-group-outline', value: 'employees', to: { name: 'employees' } },
  { title: 'Attendance', icon: 'mdi-clock-outline', value: 'attendance', to: { name: 'attendance' } },
  { title: 'Leave Management', icon: 'mdi-calendar-remove-outline', value: 'leave', to: { name: 'leave' } },
  { title: 'Overtime', icon: 'mdi-clock-time-four-outline', value: 'overtime', to: { name: 'overtime' } },
  { title: 'Payroll', icon: 'mdi-cash-multiple', value: 'payroll', to: { name: 'payroll' } },
  { title: 'Performance', icon: 'mdi-star-outline', value: 'performance', to: { name: 'performance' } },
  { title: 'My Reviews', icon: 'mdi-account-star-outline', value: 'reviews', to: { name: 'reviews' } },
  { title: 'Recruitment', icon: 'mdi-briefcase-outline', value: 'recruitment', to: { name: 'recruitment' } },
  { title: 'User Management', icon: 'mdi-shield-account-outline', value: 'user-management', to: { name: 'user-management' } },
]

const pageTitle = computed(() => {
  return route.name ? route.name.charAt(0).toUpperCase() + route.name.slice(1) : 'Dashboard'
})

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}
.v-theme--dark .border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.main-content {
  height: 100vh;
  overflow: hidden;
}

.scroll-container {
  height: calc(100vh - 64px); /* Subtract AppBar height */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
}

.content-wrapper {
  flex: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
}
.lh-tight {
  line-height: 1.2;
}
.shadow-item {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3) !important;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.05);
  border-radius: 10px;
}
.v-theme--dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
}
</style>
