<template>
  <div class="dashboard-page">
    <h1 class="text-h5 text-md-h4 font-weight-bold text-grey-darken-4 mb-6">HR Overview</h1>
    
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-4 pa-md-6 elevation-2 border-l-4" :style="`border-left-color: ${stat.color}`">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-caption text-grey-darken-1 font-weight-bold text-uppercase mb-1">{{ stat.title }}</div>
              <div class="text-h5 text-md-h4 font-weight-bold">{{ stat.value }}</div>
            </div>
            <v-avatar :color="stat.color" variant="tonal" rounded="lg" size="40" class="d-none d-sm-flex">
              <v-icon>{{ stat.icon }}</v-icon>
            </v-avatar>
          </div>
          <div class="mt-4 d-flex align-center text-caption font-weight-bold" :class="stat.trendUp ? 'text-success' : 'text-error'">
            <v-icon size="14" class="mr-1">{{ stat.trendUp ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
            {{ stat.trend }} vs last month
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="8">
        <v-card class="rounded-xl elevation-2 pa-6 h-100">
          <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center mb-6 gap-4">
            <h2 class="text-h6 font-weight-bold">Employee Growth</h2>
            <v-btn-toggle v-model="growthFilter" mandatory color="primary" density="compact" rounded="lg">
              <v-btn value="6m" class="text-none">6 Months</v-btn>
              <v-btn value="1y" class="text-none">1 Year</v-btn>
            </v-btn-toggle>
          </div>
          <div class="chart-container" style="height: 300px;">
             <!-- Simplified visualization of a chart -->
             <div class="d-flex align-end justify-space-between h-100 px-4">
               <div v-for="(h, i) in [40, 60, 45, 80, 70, 95]" :key="i" 
                    class="bg-primary rounded-t-lg" 
                    :style="`height: ${h}%; width: 40px; opacity: ${0.5 + (i*0.1)}`"
               ></div>
             </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card class="rounded-xl elevation-2 pa-6 h-100">
          <h2 class="text-h6 font-weight-bold mb-6">Recent Activities</h2>
          <v-timeline density="compact" side="end">
            <v-timeline-item v-for="activity in activities" :key="activity.id" 
                            :dot-color="activity.color" size="x-small">
              <div class="mb-4">
                <div class="text-subtitle-2 font-weight-bold">{{ activity.title }}</div>
                <div class="text-caption text-grey-darken-1">{{ activity.desc }}</div>
                <div class="text-caption text-grey-lighten-1 mt-1">{{ activity.time }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const growthFilter = ref('6m')

const stats = [
  { title: 'Total Employees', value: '1,248', icon: 'mdi-account-group', color: '#8b5cf6', trend: '12%', trendUp: true },
  { title: 'New Hires', value: '52', icon: 'mdi-account-plus', color: '#10b981', trend: '5%', trendUp: true },
  { title: 'On Leave', value: '18', icon: 'mdi-calendar-clock', color: '#f59e0b', trend: '2%', trendUp: false },
  { title: 'Open Jobs', value: '24', icon: 'mdi-briefcase-search', color: '#3b82f6', trend: '8%', trendUp: true },
]

const activities = [
  { id: 1, title: 'New Employee Onboarded', desc: 'Thein Thein joined Engineering team', time: '2 hours ago', color: 'success' },
  { id: 2, title: 'Payroll Processed', desc: 'Monthly salary for February released', time: '5 hours ago', color: 'info' },
  { id: 3, title: 'Leave Request', desc: 'Michael Chen requested 3 days leave', time: 'Yesterday', color: 'warning' },
  { id: 4, title: 'Job Posted', desc: 'Senior Frontend Developer opening', time: '2 days ago', color: 'primary' },
]
</script>

<style scoped>
.gap-4 { gap: 16px; }

.border-l-4 {
  border-left-width: 4px !important;
  border-left-style: solid !important;
}

@media (max-width: 600px) {
  .chart-container .bg-primary {
    width: 25px !important;
  }
}
</style>
