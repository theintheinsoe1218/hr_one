<template>
  <div class="leave-page">
    <!-- Header -->
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-sm-space-between mb-6 gap-4">
      <div>
        <h1 class="text-h5 text-md-h4 font-weight-bold text-grey-darken-4 mb-1">Leave Management</h1>
        <div class="text-caption text-md-subtitle-1 text-grey-darken-1">Manage employee leave requests</div>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" size="large" class="font-weight-bold px-6 text-none" @click="dialog = true">
        Request Leave
      </v-btn>
    </div>

    <!-- Leave Stats Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in leaveStats" :key="stat.label" cols="12" sm="4">
        <v-card class="rounded-xl pa-4 elevation-1 border-light" :class="`bg-${stat.color}-lighten-5`">
          <div class="text-subtitle-2 font-weight-bold mb-1" :class="`text-${stat.color}`">{{ stat.label }}</div>
          <div class="text-h4 font-weight-bold text-on-surface">{{ stat.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabs + Table -->
    <v-card class="rounded-xl elevation-2">
      <v-card-title class="pa-4 pa-md-6 border-b d-flex flex-column flex-md-row align-md-center justify-space-between gap-4">
        <span class="text-h6 font-weight-bold">Leave Requests</span>
        <v-btn-toggle v-model="statusFilter" mandatory color="primary" density="compact" rounded="lg" class="overflow-x-auto">
          <v-btn value="all" class="text-none px-3 px-sm-4">All</v-btn>
          <v-btn value="Pending" class="text-none px-3 px-sm-4">Pending</v-btn>
          <v-btn value="Approved" class="text-none px-3 px-sm-4">Approved</v-btn>
          <v-btn value="Rejected" class="text-none px-3 px-sm-4">Rejected</v-btn>
        </v-btn-toggle>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredRequests"
        class="attendance-table elevation-0"
        hover
      >
        <template v-slot:item.type="{ item }">
          <v-chip size="small" :color="getTypeColor(item.type)" variant="tonal" label class="font-weight-bold">
            {{ item.type }}
          </v-chip>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" size="small" class="font-weight-bold rounded px-3" label variant="flat">
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn v-if="item.status === 'Pending'" icon="mdi-check-circle-outline" variant="text" size="small" color="success" @click="updateStatus(item, 'Approved')"></v-btn>
            <v-btn v-if="item.status === 'Pending'" icon="mdi-close-circle-outline" variant="text" size="small" color="error" @click="updateStatus(item, 'Rejected')"></v-btn>
            <v-btn icon="mdi-eye-outline" variant="text" size="small" color="primary"></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- New Leave Request Dialog -->
    <v-dialog v-model="dialog" max-width="520px">
      <v-card class="rounded-xl">
        <v-card-title class="d-flex align-center justify-space-between pa-6 pb-4">
          <span class="text-h5 font-weight-bold">New Leave Request</span>
          <v-btn icon="mdi-close" variant="text" density="comfortable" @click="closeDialog"></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="formError" type="error" variant="tonal" class="mb-4" closable @click:close="formError = ''">
            {{ formError }}
          </v-alert>

          <div class="mb-5">
            <label class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-2 d-block">Employee</label>
            <v-select
              v-model="form.employee"
              :items="employees"
              placeholder="Select employee"
              variant="outlined"
              hide-details
              rounded="lg"
              color="primary"
            ></v-select>
          </div>

          <div class="mb-5">
            <label class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-2 d-block">Leave Type</label>
            <v-select
              v-model="form.leaveType"
              :items="leaveTypeOptions"
              placeholder="Select leave type"
              variant="outlined"
              hide-details
              rounded="lg"
              color="primary"
            ></v-select>
          </div>

          <v-row class="mb-5">
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-2 d-block">Start Date</label>
              <v-text-field
                v-model="form.startDate"
                type="date"
                variant="outlined"
                hide-details
                rounded="lg"
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-2 d-block">End Date</label>
              <v-text-field
                v-model="form.endDate"
                type="date"
                variant="outlined"
                hide-details
                rounded="lg"
                color="primary"
              ></v-text-field>
            </v-col>
          </v-row>

          <div>
            <label class="text-subtitle-2 font-weight-bold text-grey-darken-3 mb-2 d-block">Reason</label>
            <v-textarea
              v-model="form.reason"
              placeholder="Briefly describe the reason for leave"
              variant="outlined"
              hide-details
              rounded="lg"
              color="primary"
              rows="3"
              auto-grow
            ></v-textarea>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded="lg" class="px-6 text-none border-grey mr-2" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" rounded="lg" class="px-6 text-none font-weight-bold" @click="submitRequest" :loading="submitting">
            Submit Request
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const dialog = ref(false)
const statusFilter = ref('all')
const submitting = ref(false)
const formError = ref('')

const form = ref({
  employee: null,
  leaveType: null,
  startDate: '',
  endDate: '',
  reason: ''
})

const employees = ['Thein Thein', 'Emily Rodriguez', 'Michael Chen', 'Lisa Thompson', 'Sarah Johnson']
const leaveTypeOptions = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity/Paternity Leave', 'Emergency Leave']

const leaveStats = computed(() => {
  return [
    { label: 'Pending', value: requests.value.filter(r => r.status === 'Pending').length, color: 'warning', bgColor: 'warning-lighten-5' },
    { label: 'Approved', value: requests.value.filter(r => r.status === 'Approved').length, color: 'success', bgColor: 'success-lighten-5' },
    { label: 'Rejected', value: requests.value.filter(r => r.status === 'Rejected').length, color: 'error', bgColor: 'error-lighten-5' },
  ]
})

const headers = [
  { title: 'Employee', key: 'employee', sortable: true },
  { title: 'Leave Type', key: 'type' },
  { title: 'Start Date', key: 'startDate' },
  { title: 'End Date', key: 'endDate' },
  { title: 'Days', key: 'days', align: 'center' },
  { title: 'Reason', key: 'reason' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

const requests = ref([
  { id: 1, employee: 'Thein Thein', type: 'Annual Leave', startDate: 'Mar 15, 2026', endDate: 'Mar 17, 2026', days: 3, reason: 'Family Vacation', status: 'Pending' },
  { id: 2, employee: 'Emily Rodriguez', type: 'Sick Leave', startDate: 'Feb 20, 2026', endDate: 'Feb 20, 2026', days: 1, reason: 'Fever', status: 'Approved' },
  { id: 3, employee: 'Michael Chen', type: 'Casual Leave', startDate: 'Apr 05, 2026', endDate: 'Apr 06, 2026', days: 2, reason: 'Personal work', status: 'Pending' },
  { id: 4, employee: 'Lisa Thompson', type: 'Emergency Leave', startDate: 'Mar 01, 2026', endDate: 'Mar 03, 2026', days: 3, reason: 'Family emergency', status: 'Approved' },
  { id: 5, employee: 'Sarah Johnson', type: 'Annual Leave', startDate: 'Mar 25, 2026', endDate: 'Mar 26, 2026', days: 2, reason: 'Rest & Recovery', status: 'Rejected' },
])

const filteredRequests = computed(() => {
  if (statusFilter.value === 'all') return requests.value
  return requests.value.filter(r => r.status === statusFilter.value)
})

const getStatusColor = (status) => {
  if (status === 'Approved') return 'success'
  if (status === 'Pending') return 'warning'
  if (status === 'Rejected') return 'error'
  return 'grey'
}

const getTypeColor = (type) => {
  if (type === 'Annual Leave') return 'primary'
  if (type === 'Sick Leave') return 'error'
  if (type === 'Casual Leave') return 'warning'
  if (type === 'Emergency Leave') return 'error'
  return 'info'
}

const updateStatus = (item, status) => {
  item.status = status
}

const submitRequest = async () => {
  if (!form.value.employee || !form.value.leaveType || !form.value.startDate || !form.value.endDate) {
    formError.value = 'Please fill in all required fields.'
    return
  }
  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 800))

  const start = new Date(form.value.startDate)
  const end = new Date(form.value.endDate)
  const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1

  requests.value.unshift({
    id: Date.now(),
    employee: form.value.employee,
    type: form.value.leaveType,
    startDate: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    endDate: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    days: days > 0 ? days : 1,
    reason: form.value.reason || '-',
    status: 'Pending'
  })
  submitting.value = false
  closeDialog()
}

const closeDialog = () => {
  dialog.value = false
  formError.value = ''
  form.value = { employee: null, leaveType: null, startDate: '', endDate: '', reason: '' }
}
</script>

<style scoped>
.border-stat {
  transition: all 0.3s ease;
}

.border-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}

.gap-4 { gap: 16px; }
.gap-1 { gap: 4px; }
.attendance-table :deep(th) {
  text-transform: none !important;
  font-size: 0.875rem !important;
}
</style>
