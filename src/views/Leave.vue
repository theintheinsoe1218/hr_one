<template>
  <div class="leave-page">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-1">Leave Management</h1>
        <div class="text-subtitle-1 text-grey-darken-1">Manage employee leave requests</div>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" size="large" class="font-weight-bold px-6 text-none" @click="dialog = true">
        Request Leave
      </v-btn>
    </div>

    <!-- Leave Balance Cards -->
    <v-row class="mb-6">
      <v-col v-for="type in leaveTypes" :key="type.name" cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-5 elevation-2 h-100">
          <div class="d-flex align-center justify-space-between mb-3">
            <v-avatar :color="type.color" variant="tonal" rounded="lg" size="40">
              <v-icon size="22">{{ type.icon }}</v-icon>
            </v-avatar>
            <v-chip :color="type.color" size="small" variant="tonal" class="font-weight-bold">
              {{ type.total - type.used }} left
            </v-chip>
          </div>
          <div class="text-subtitle-2 text-grey-darken-1 font-weight-bold mb-1">{{ type.name }}</div>
          <div class="d-flex align-end justify-space-between mb-2">
            <span class="text-h4 font-weight-bold text-grey-darken-4">{{ type.used }}</span>
            <span class="text-caption text-grey-darken-1 mb-1">/ {{ type.total }} days</span>
          </div>
          <v-progress-linear
            :model-value="(type.used / type.total) * 100"
            :color="type.color"
            height="6"
            rounded
          ></v-progress-linear>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabs + Table -->
    <v-card class="rounded-xl elevation-2">
      <v-card-title class="pa-6 border-b d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">Leave Requests</span>
        <v-btn-toggle v-model="statusFilter" mandatory color="primary" density="compact" rounded="lg">
          <v-btn value="all" class="text-none px-4">All</v-btn>
          <v-btn value="Pending" class="text-none px-4">Pending</v-btn>
          <v-btn value="Approved" class="text-none px-4">Approved</v-btn>
          <v-btn value="Rejected" class="text-none px-4">Rejected</v-btn>
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

const leaveTypes = [
  { name: 'Annual Leave', used: 8, total: 15, color: 'primary', icon: 'mdi-umbrella-beach' },
  { name: 'Sick Leave', used: 2, total: 10, color: 'success', icon: 'mdi-medical-bag' },
  { name: 'Casual Leave', used: 3, total: 6, color: 'warning', icon: 'mdi-briefcase-clock' },
  { name: 'Maternity/Paternity', used: 0, total: 90, color: 'info', icon: 'mdi-baby-carriage' },
]

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
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}
.border-grey {
  border-color: #e2e8f0 !important;
}
.gap-1 { gap: 4px; }
.attendance-table :deep(th) {
  color: #64748b !important;
  font-weight: 600 !important;
  border-bottom: 1px solid #f1f5f9;
  text-transform: none !important;
}
</style>
