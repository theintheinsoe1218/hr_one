<template>
  <div class="employees-page">
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-2">Employees</h1>
        <div class="text-subtitle-1 text-grey-darken-1">Manage your workforce</div>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" size="large" class="font-weight-bold px-6 text-none">
        Add Employee
      </v-btn>
    </div>

    <v-card class="rounded-xl elevation-2 pa-6">
      <div class="d-flex align-center justify-space-between mb-6 gap-4">
        <v-text-field
          v-model="search"
          density="comfortable"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search employees..."
          hide-details
          color="primary"
          class="bg-grey-lighten-4 rounded-lg search-field w-50"
          style="max-width: 500px;"
        ></v-text-field>
        
        <v-select
          v-model="departmentFilter"
          :items="departments"
          density="comfortable"
          variant="outlined"
          hide-details
          class="bg-grey-lighten-4 rounded-lg ml-0 ml-sm-4 w-25"
          style="max-width: 250px;"
        ></v-select>
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredEmployees"
        :search="search"
        :items-per-page="10"
        class="employee-table elevation-0"
        hover
      >
        <template v-slot:item.employee="{ item }">
          <div class="d-flex align-center py-3">
            <v-avatar color="primary-lighten-4" size="48" class="mr-4 text-primary font-weight-bold border">
              {{ getInitials(item.employee) }}
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold text-grey-darken-3">{{ item.employee }}</div>
              <div class="text-caption text-grey-darken-1">{{ item.id }}</div>
            </div>
          </div>
        </template>
        
        <template v-slot:item.department="{ item }">
          <span class="text-grey-darken-3 font-weight-medium">{{ item.department }}</span>
        </template>
        
        <template v-slot:item.position="{ item }">
          <span class="text-grey-darken-3">{{ item.position }}</span>
        </template>
        
        <template v-slot:item.type="{ item }">
          <span class="text-grey-darken-2">{{ item.type }}</span>
        </template>
        
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            label
            class="font-weight-bold rounded px-3"
            variant="tonal"
          >
            {{ item.status }}
          </v-chip>
        </template>
        
        <template v-slot:item.hireDate="{ item }">
          <span class="text-grey-darken-3 font-weight-medium">{{ item.hireDate }}</span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const departmentFilter = ref('All Departments')
const departments = ['All Departments', 'Engineering', 'Marketing', 'Human Resources', 'Sales']

const headers = [
  { title: 'Employee', align: 'start', key: 'employee', sortable: true },
  { title: 'Department', align: 'start', key: 'department', sortable: true },
  { title: 'Position', align: 'start', key: 'position', sortable: true },
  { title: 'Type', align: 'start', key: 'type', sortable: false },
  { title: 'Status', align: 'start', key: 'status', sortable: true },
  { title: 'Hire Date', align: 'start', key: 'hireDate', sortable: true },
]

const employeeData = ref([
  { id: 'EMP005', employee: 'Thein Thein', department: 'Engineering', position: 'Junior Web Developer', type: 'Full-time', status: 'Active', hireDate: 'Feb 5, 2026' },
  { id: 'EMP003', employee: 'Emily Rodriguez', department: 'Marketing', position: 'Marketing Specialist', type: 'Full-time', status: 'Active', hireDate: 'Jan 10, 2023' },
  { id: 'EMP002', employee: 'Michael Chen', department: 'Human Resources', position: 'HR Manager', type: 'Full-time', status: 'Active', hireDate: 'Aug 1, 2021' },
  { id: 'EMP005', employee: 'Lisa Thompson', department: 'Sales', position: 'Sales Representative', type: 'Full-time', status: 'On Leave', hireDate: 'Apr 5, 2023' },
  { id: 'EMP001', employee: 'Sarah Johnson', department: 'Engineering', position: 'Senior Software Engineer', type: 'Full-time', status: 'Active', hireDate: 'Mar 15, 2022' },
])

const filteredEmployees = computed(() => {
  if (departmentFilter.value === 'All Departments') {
    return employeeData.value
  }
  return employeeData.value.filter(emp => emp.department === departmentFilter.value)
})

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'success'
    case 'On Leave': return 'primary'
    case 'Terminated': return 'error'
    default: return 'grey'  
  }
}
</script>

<style scoped>
.search-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0;
}
.employee-table :deep(th) {
  color: #64748b !important;
  font-weight: 600 !important;
  text-transform: none !important;
  font-size: 0.875rem !important;
  background-color: transparent !important;
  border-bottom: 1px solid #f1f5f9;
}
.employee-table :deep(td) {
  border-bottom: 1px solid #f8fafc !important;
}
.gap-4 {
  gap: 16px;
}
.primary-lighten-4 {
  background-color: rgb(var(--v-theme-primary), 0.1) !important;
}
.border {
  border: 1px solid rgb(var(--v-theme-primary), 0.2) !important;
}
</style>
