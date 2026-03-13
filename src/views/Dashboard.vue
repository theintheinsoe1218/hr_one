<template>
  <div class="dashboard-page">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-h5 text-md-h4 font-weight-bold text-on-surface mb-1">Dashboard</h1>
      <div class="text-body-2 text-medium-emphasis">
        Welcome back! <span class="text-primary font-weight-medium">Here's</span> what's happening today, {{ todayText }}
      </div>
    </div>

    <!-- Stat Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-5 elevation-1 stat-card">
          <div class="d-flex justify-space-between align-start">
            <div>
              <div class="text-caption text-medium-emphasis font-weight-medium mb-2">{{ stat.title }}</div>
              <div class="text-h4 font-weight-bold text-on-surface mb-1">{{ stat.value }}</div>
              <div class="text-caption text-medium-emphasis">{{ stat.subtitle }}</div>
            </div>
            <v-avatar :color="stat.color" size="52" rounded="lg" class="stat-icon-avatar">
              <v-icon size="26" color="white">{{ stat.icon }}</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pending Leave & Overtime Requests -->
    <v-row class="mb-6">
      <!-- Pending Leave Requests -->
      <v-col cols="12" md="6">
        <v-card class="rounded-xl elevation-1 pa-5 h-100">
          <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-subtitle-1 font-weight-bold text-on-surface">Pending Leave Requests</h2>
            <v-btn to="/leave" variant="text" color="primary" size="small" class="text-none font-weight-medium px-0" append-icon="mdi-arrow-right">
              View All
            </v-btn>
          </div>
          <div v-for="req in leaveRequests" :key="req.id" class="d-flex align-center justify-space-between py-3 request-row">
            <div class="d-flex align-center gap-3">
              <v-avatar :color="req.color" size="38" class="font-weight-bold text-caption">
                {{ getInitials(req.name) }}
              </v-avatar>
              <div>
                <div class="text-subtitle-2 font-weight-bold text-on-surface">{{ req.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ req.type }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-caption font-weight-bold text-on-surface">{{ req.duration }}</div>
              <div class="text-caption text-medium-emphasis">{{ req.date }}</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Pending Overtime Requests -->
      <v-col cols="12" md="6">
        <v-card class="rounded-xl elevation-1 pa-5 h-100">
          <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-subtitle-1 font-weight-bold text-on-surface">Pending Overtime Requests</h2>
            <v-btn to="/overtime" variant="text" color="primary" size="small" class="text-none font-weight-medium px-0" append-icon="mdi-arrow-right">
              View All
            </v-btn>
          </div>
          <div v-for="req in overtimeRequests" :key="req.id" class="d-flex align-center justify-space-between py-3 request-row">
            <div class="d-flex align-center gap-3">
              <v-avatar :color="req.color" size="38" class="font-weight-bold text-caption">
                {{ getInitials(req.name) }}
              </v-avatar>
              <div>
                <div class="text-subtitle-2 font-weight-bold text-on-surface">{{ req.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ req.date }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-caption font-weight-bold text-on-surface">{{ req.hours }}</div>
              <div class="text-caption text-medium-emphasis">{{ req.rate }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Applicants & Open Positions -->
    <v-row>
      <!-- Recent Applicants -->
      <v-col cols="12" md="6">
        <v-card class="rounded-xl elevation-1 pa-5">
          <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-subtitle-1 font-weight-bold text-on-surface">Recent Applicants</h2>
            <v-btn to="/recruitment" variant="text" color="primary" size="small" class="text-none font-weight-medium px-0" append-icon="mdi-arrow-right">
              View All
            </v-btn>
          </div>
          <div v-for="applicant in recentApplicants" :key="applicant.id" class="d-flex align-center justify-space-between py-3 request-row">
            <div class="d-flex align-center gap-3">
              <v-avatar :color="applicant.color" size="38" class="font-weight-bold text-caption">
                {{ getInitials(applicant.name) }}
              </v-avatar>
              <div>
                <div class="text-subtitle-2 font-weight-bold text-on-surface">{{ applicant.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ applicant.role }}</div>
              </div>
            </div>
            <v-chip
              :color="getStatusColor(applicant.status)"
              size="small"
              variant="tonal"
              class="font-weight-medium text-caption"
            >{{ applicant.status }}</v-chip>
          </div>
        </v-card>
      </v-col>

      <!-- Open Positions -->
      <v-col cols="12" md="6">
        <v-card class="rounded-xl elevation-1 pa-5">
          <div class="d-flex justify-space-between align-center mb-4">
            <h2 class="text-subtitle-1 font-weight-bold text-on-surface">Open Positions</h2>
            <v-btn to="/recruitment" variant="text" color="primary" size="small" class="text-none font-weight-medium px-0" append-icon="mdi-arrow-right">
              View All
            </v-btn>
          </div>
          <div v-for="pos in openPositions" :key="pos.id" class="d-flex align-center justify-space-between py-3 request-row">
            <div>
              <div class="text-subtitle-2 font-weight-bold text-on-surface">{{ pos.title }}</div>
              <div class="text-caption text-primary">{{ pos.dept }} · {{ pos.type }}</div>
            </div>
            <div class="text-caption font-weight-medium text-primary">{{ pos.applicants }} applicants</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDashboardEmployees, getDashboardLeaves } from '../services/dashboardService'

const todayText = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
})

const totalEmployees = ref(0)
const activeEmployees = ref(0)
const totalLeaves = ref(0)
const pendingLeavesCount = ref(0)
const leaveRequestsRaw = ref([])

onMounted(async () => {
  try {
    const empRes = await getDashboardEmployees()
    totalEmployees.value = empRes.data.length
    activeEmployees.value = empRes.data.length // assuming all are active for now

    const leavesRes = await getDashboardLeaves('Pending')
    leaveRequestsRaw.value = leavesRes.data
    pendingLeavesCount.value = leavesRes.data.length

    // Just count total leaves for interest length
    const allLeavesRes = await getDashboardLeaves()
    totalLeaves.value = allLeavesRes.data.length

  } catch (err) {
    console.error('Error fetching dashboard data', err)
  }
})

const stats = computed(() => [
  { title: 'Total Employees', value: totalEmployees.value.toString(),  subtitle: `${totalEmployees.value} total`, icon: 'mdi-account-group-outline', color: '#7C3AED' },
  { title: 'Present Today',   value: activeEmployees.value.toString(),  subtitle: `of ${activeEmployees.value} active`, icon: 'mdi-calendar-check-outline', color: '#059669' },
  { title: 'Pending Leaves',  value: pendingLeavesCount.value.toString(),  subtitle: 'Awaiting approval', icon: 'mdi-calendar-clock-outline', color: '#D97706' },
  { title: 'Open Positions',  value: '2',  subtitle: 'Active job postings', icon: 'mdi-briefcase-outline',   color: '#DC2626' },
])

const leaveRequests = computed(() => {
  return leaveRequestsRaw.value.slice(0, 3).map(r => ({
    id: r.id,
    name: r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : 'Unknown',
    type: r.type,
    duration: `${r.days} days`,
    date: r.startDate,
    color: 'purple-lighten-3'
  }))
})

// Mock Data for currently unavailable backend features
const overtimeRequests = [
  { id: 1, name: 'Sarah Johnson', date: 'Jan 18, 2026', hours: '4 hours', rate: '1.5x rate', color: 'yellow-darken-2' },
]

const recentApplicants = [
  { id: 1, name: 'Anna Martinez',  role: 'Full Stack Developer', status: 'Screening', color: 'pink-lighten-2' },
  { id: 2, name: 'Robert Kim',     role: 'Product Manager',      status: 'New',       color: 'red-lighten-2' },
  { id: 3, name: 'David Park',     role: 'Full Stack Developer', status: 'Interview', color: 'deep-purple-lighten-2' },
]

const openPositions = [
  { id: 1, title: 'Full Stack Developer', dept: 'Engineering', type: 'Full-time', applicants: '12' },
  { id: 2, title: 'Product Manager',      dept: 'Marketing',   type: 'Full-time', applicants: '8'  },
]

const getInitials = (name) => {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Screening': return 'purple'
    case 'New':       return 'grey'
    case 'Interview': return 'blue'
    default:          return 'grey'
  }
}
</script>

<style scoped>
.stat-card {
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important;
}

.stat-icon-avatar {
  opacity: 0.92;
}

.request-row {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.request-row:last-child {
  border-bottom: none;
}

.gap-3 { gap: 12px; }
</style>
