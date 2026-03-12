<template>
  <div class="employees-page">
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h4 font-weight-bold text-on-surface mb-2">Employees</h1>
        <div class="text-subtitle-1 text-medium-emphasis">Manage your workforce and organization</div>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" size="large" class="font-weight-bold px-6 text-none shadow-primary" @click="activeMainTab === 'Employees' ? openAddDialog() : openAddDeptDialog()">
        {{ activeMainTab === 'Employees' ? 'Add Employee' : 'Add Department' }}
      </v-btn>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-5 elevation-1 border-light">
          <div class="d-flex align-center">
            <v-avatar color="primary-lighten-5" variant="flat" rounded="lg" size="48" class="mr-4">
              <v-icon color="primary">mdi-account-group</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-2 font-weight-bold text-primary">Total Employees</div>
              <div class="text-h4 font-weight-black text-on-surface">{{ employeeData.length }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-5 elevation-1 border-light">
          <div class="d-flex align-center">
            <v-avatar color="success-lighten-5" variant="flat" rounded="lg" size="48" class="mr-4">
              <v-icon color="success">mdi-check-circle-outline</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-2 font-weight-bold text-success">Active</div>
              <div class="text-h4 font-weight-black text-on-surface">{{ employeeData.filter(e => e.status === 'Active').length }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-5 elevation-1 border-light">
          <div class="d-flex align-center">
            <v-avatar color="info-lighten-5" variant="flat" rounded="lg" size="48" class="mr-4">
              <v-icon color="info">mdi-domain</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-2 font-weight-bold text-info">Departments</div>
              <div class="text-h4 font-weight-black text-on-surface">{{ departmentsList.length }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-5 elevation-1 border-light">
          <div class="d-flex align-center">
            <v-avatar color="warning-lighten-5" variant="flat" rounded="lg" size="48" class="mr-4">
              <v-icon color="warning">mdi-account-clock</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-2 font-weight-bold text-warning">On Leave</div>
              <div class="text-h4 font-weight-black text-on-surface">{{ employeeData.filter(e => e.status === 'On Leave').length }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Content Tabs -->
    <div class="tab-container bg-surface pa-1 rounded-xl d-inline-flex border-light mb-8">
      <v-btn 
        v-for="tab in ['Employees', 'Departments']" 
        :key="tab"
        variant="flat" 
        :color="activeMainTab === tab ? 'primary' : 'transparent'"
        :class="{'active-tab elevation-2': activeMainTab === tab, 'text-medium-emphasis': activeMainTab !== tab}"
        rounded="lg"
        class="text-none font-weight-bold px-8"
        size="large"
        @click="activeMainTab = tab"
      >
        {{ tab }}
      </v-btn>
    </div>

    <!-- Employee List Section -->
    <div v-if="activeMainTab === 'Employees'">
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
            class="bg-surface rounded-lg search-field w-50 border-light"
            style="max-width: 500px;"
          ></v-text-field>
          
          <v-select
            v-model="departmentFilter"
            :items="departments"
            density="comfortable"
            variant="outlined"
            hide-details
            class="bg-surface rounded-lg ml-0 ml-sm-4 w-25 border-light"
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
          @click:row="(_, { item }) => openDetail(item)"
        >
          <template v-slot:item.employee="{ item }">
            <div class="d-flex align-center py-3">
              <v-avatar color="primary-lighten-4" size="48" class="mr-4 text-primary font-weight-bold border">
                {{ getInitials(item.employee) }}
              </v-avatar>
              <div>
                <div class="text-subtitle-1 font-weight-bold text-on-surface">{{ item.employee }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.id }}</div>
              </div>
            </div>
          </template>
          
          <template v-slot:item.department="{ item }">
            <span class="text-on-surface font-weight-medium text-body-2">{{ item.department }}</span>
          </template>
          
          <template v-slot:item.position="{ item }">
            <span class="text-on-surface text-body-2">{{ item.position }}</span>
          </template>
          
          <template v-slot:item.type="{ item }">
            <span class="text-on-surface opacity-70 text-body-2">{{ item.type }}</span>
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
            <span class="text-on-surface font-weight-medium text-body-2">{{ item.hireDate }}</span>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- Departments Section -->
    <div v-else>
      <v-card class="rounded-xl elevation-2 pa-6">
        <v-data-table
          :headers="deptHeaders"
          :items="departmentsWithStats"
          hide-default-footer
          class="dept-table elevation-0"
        >
          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center py-3">
              <v-avatar color="info-lighten-5" rounded="lg" size="40" class="mr-3">
                <v-icon color="info" size="20">mdi-domain</v-icon>
              </v-avatar>
              <span class="text-subtitle-1 font-weight-bold text-on-surface">{{ item.name }}</span>
            </div>
          </template>

          <template v-slot:item.employees="{ item }">
            <div class="d-flex align-center">
              <v-avatar-group density="comfortable">
                <v-avatar v-for="n in Math.min(item.employeesCount, 3)" :key="n" size="32" class="border">
                  <v-img :src="`https://randomuser.me/api/portraits/thumb/${item.name === 'Engineering' ? 'men' : 'women'}/${n+10}.jpg`"></v-img>
                </v-avatar>
              </v-avatar-group>
              <span class="text-body-2 font-weight-medium ml-2">{{ item.employeesCount }} total</span>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-end gap-1">
              <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="primary" @click="openEditDeptDialog(item)"></v-btn>
              <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" @click="deleteDept(item.name)"></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- Add/Edit Department Dialog -->
    <v-dialog v-model="deptFormDialog" max-width="450px">
      <v-card class="rounded-xl pa-2">
        <v-card-title class="pa-4 d-flex align-center justify-space-between">
          <span class="text-h6 font-weight-bold">{{ isEditingDept ? 'Edit' : 'Add' }} Department</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="deptFormDialog = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <label class="text-subtitle-2 font-weight-bold d-block mb-2 text-on-surface">Department Name</label>
          <v-text-field
            v-model="deptForm.name"
            placeholder="e.g. Finance, UX Design"
            variant="outlined"
            hide-details
            rounded="lg"
            color="primary"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" rounded="lg" class="px-6 text-none font-weight-bold" @click="deptFormDialog = false">Cancel</v-btn>
          <v-btn color="primary" rounded="lg" class="px-8 text-none font-weight-black elevation-2" @click="saveDept">{{ isEditingDept ? 'Update' : 'Create' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Employee Dialog -->
    <v-dialog v-model="addDialog" max-width="680px" scrollable>
      <v-card class="rounded-xl d-flex flex-column" style="max-height: 92vh;">
        <!-- Title -->
        <v-card-title class="d-flex align-center justify-space-between pa-6 flex-shrink-0">
          <span class="text-h6 font-weight-bold text-on-surface">Add New Employee</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="addDialog = false"></v-btn>
        </v-card-title>

        <!-- Tab Headers -->
        <div class="px-6 pb-2 flex-shrink-0">
          <v-btn-toggle v-model="activeTab" mandatory variant="outlined" density="compact" rounded="lg" color="on-surface" class="w-100 tab-toggle">
            <v-btn value="basic" class="text-none font-weight-medium flex-grow-1">Basic Info</v-btn>
            <v-btn value="employment" class="text-none font-weight-medium flex-grow-1">Employment</v-btn>
            <v-btn value="banking" class="text-none font-weight-medium flex-grow-1">Banking &amp; Contact</v-btn>
          </v-btn-toggle>
        </div>
        <v-divider></v-divider>

        <!-- Tab Content -->
        <v-card-text class="pa-6 overflow-y-auto flex-grow-1">

          <!-- Basic Info Tab -->
          <div v-if="activeTab === 'basic'">
            <div class="mb-5">
              <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Employee ID</label>
              <v-text-field v-model="form.id" placeholder="EMP001" variant="outlined" hide-details rounded="lg" style="max-width: 200px;"></v-text-field>
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">First Name <span class="text-error">*</span></label>
                <v-text-field v-model="form.firstName" variant="outlined" hide-details rounded="lg"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Last Name <span class="text-error">*</span></label>
                <v-text-field v-model="form.lastName" variant="outlined" hide-details rounded="lg"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Email <span class="text-error">*</span></label>
                <v-text-field v-model="form.email" variant="outlined" hide-details rounded="lg" type="email"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Phone</label>
                <v-text-field v-model="form.phone" variant="outlined" hide-details rounded="lg"></v-text-field>
              </v-col>
              <v-col cols="12">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Address</label>
                <v-text-field v-model="form.address" variant="outlined" hide-details rounded="lg"></v-text-field>
              </v-col>
            </v-row>
          </div>

          <!-- Employment Tab -->
          <div v-if="activeTab === 'employment'">
            <v-row>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Department <span class="text-error">*</span></label>
                <v-select v-model="form.department" :items="departments.filter(d => d !== 'All Departments')" placeholder="Select department" variant="outlined" hide-details rounded="lg"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Position <span class="text-error">*</span></label>
                <v-text-field v-model="form.position" variant="outlined" hide-details rounded="lg"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Employment Type</label>
                <v-select v-model="form.type" :items="['Full-time', 'Part-time', 'Contract', 'Intern']" variant="outlined" hide-details rounded="lg"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Status</label>
                <v-select v-model="form.status" :items="['Active', 'On Leave', 'Terminated']" variant="outlined" hide-details rounded="lg"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Hire Date</label>
                <v-menu v-model="hireDateMenu" :close-on-content-click="false">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      v-model="form.hireDate"
                      placeholder="YYYY-MM-DD"
                      variant="outlined"
                      hide-details
                      rounded="lg"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    @update:model-value="(val) => { form.hireDate = val.toISOString().split('T')[0]; hireDateMenu = false }"
                    color="primary"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Base Salary</label>
                <v-text-field v-model="form.salary" type="number" placeholder="0.00" variant="outlined" hide-details rounded="lg" prefix="$"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Leave Balance (Days)</label>
                <v-text-field v-model="form.leaveBalance" type="number" value="20" variant="outlined" hide-details rounded="lg"></v-text-field>
              </v-col>
            </v-row>
          </div>

          <!-- Banking & Contact Tab -->
          <div v-if="activeTab === 'banking'">
            <v-row>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Bank Name</label>
                <v-text-field v-model="form.bankName" variant="outlined" hide-details rounded="lg"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Bank Account</label>
                <v-text-field v-model="form.bankAccount" variant="outlined" hide-details rounded="lg"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Tax ID</label>
                <v-text-field v-model="form.taxId" variant="outlined" hide-details rounded="lg"></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Emergency Contact</label>
                <v-text-field v-model="form.emergencyContact" variant="outlined" hide-details rounded="lg"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <label class="text-subtitle-2 font-weight-medium d-block mb-2 text-on-surface">Emergency Phone</label>
                <v-text-field v-model="form.emergencyPhone" variant="outlined" hide-details rounded="lg"></v-text-field>
              </v-col>
            </v-row>
          </div>

        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-5 flex-shrink-0">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded="lg" class="px-6 text-none" @click="addDialog = false">Cancel</v-btn>
          <v-btn color="primary" rounded="lg" class="px-6 text-none font-weight-bold ml-2" @click="saveEmployee">Create Employee</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Employee Detail Side Panel -->
    <v-navigation-drawer
      v-model="detailPanel"
      location="end"
      :width="520"
      temporary
      class="detail-drawer"
    >
      <template v-if="selectedEmployee">
        <!-- Header -->
        <div class="d-flex align-center justify-space-between pa-5">
          <span class="text-h6 font-weight-bold text-on-surface">Employee Details</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="detailPanel = false"></v-btn>
        </div>
        <v-divider></v-divider>

        <!-- Profile Section -->
        <div class="pa-5">
          <div class="d-flex align-center gap-4 mb-5">
            <v-avatar color="primary-lighten-4" size="56" class="text-primary font-weight-bold text-h6">
              {{ getInitials(selectedEmployee.employee) }}
            </v-avatar>
            <div>
              <div class="text-h6 font-weight-bold text-on-surface">{{ selectedEmployee.employee }}</div>
              <div class="text-body-2 text-medium-emphasis mb-2">{{ selectedEmployee.position }}</div>
              <v-chip :color="getStatusColor(selectedEmployee.status)" size="small" variant="tonal" class="font-weight-medium">
                {{ selectedEmployee.status }}
              </v-chip>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="detail-info-list mb-5">
            <div class="d-flex align-center gap-3 py-2">
              <v-icon size="18" color="medium-emphasis">mdi-email-outline</v-icon>
              <span class="text-body-2 text-on-surface">{{ selectedEmployee.email || (selectedEmployee.employee.toLowerCase().replace(' ','') + '@gmail.com') }}</span>
            </div>
            <div class="d-flex align-center gap-3 py-2">
              <v-icon size="18" color="medium-emphasis">mdi-phone-outline</v-icon>
              <span class="text-body-2 text-on-surface">{{ selectedEmployee.phone || '—' }}</span>
            </div>
            <div class="d-flex align-center gap-3 py-2">
              <v-icon size="18" color="medium-emphasis">mdi-domain</v-icon>
              <span class="text-body-2 text-on-surface">{{ selectedEmployee.department }}</span>
            </div>
            <div class="d-flex align-center gap-3 py-2">
              <v-icon size="18" color="medium-emphasis">mdi-map-marker-outline</v-icon>
              <span class="text-body-2 text-on-surface">{{ selectedEmployee.address || '—' }}</span>
            </div>
          </div>

          <v-divider class="mb-5"></v-divider>

          <!-- Employment Grid -->
          <div class="detail-grid">
            <div class="detail-grid-item">
              <div class="text-caption text-primary font-weight-medium mb-1">Employee ID</div>
              <div class="text-body-2 font-weight-bold text-on-surface">{{ selectedEmployee.id }}</div>
            </div>
            <div class="detail-grid-item">
              <div class="text-caption text-primary font-weight-medium mb-1">Employment Type</div>
              <div class="text-body-2 font-weight-bold text-on-surface">{{ selectedEmployee.type }}</div>
            </div>
            <div class="detail-grid-item">
              <div class="text-caption text-primary font-weight-medium mb-1">Hire Date</div>
              <div class="text-body-2 font-weight-bold text-on-surface">{{ selectedEmployee.hireDate }}</div>
            </div>
            <div class="detail-grid-item">
              <div class="text-caption text-primary font-weight-medium mb-1">Base Salary</div>
              <div class="text-body-2 font-weight-bold text-on-surface">{{ selectedEmployee.salary ? '$' + Number(selectedEmployee.salary).toLocaleString() : '$500,000' }}</div>
            </div>
            <div class="detail-grid-item">
              <div class="text-caption text-primary font-weight-medium mb-1">Leave Balance</div>
              <div class="text-body-2 font-weight-bold text-on-surface">{{ selectedEmployee.leaveBalance || 20 }} days</div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="detail-footer pa-4 d-flex align-center justify-space-between">
          <v-btn variant="outlined" rounded="lg" prepend-icon="mdi-pencil-outline" class="text-none flex-grow-1 mr-2">
            Edit
          </v-btn>
          <v-btn icon="mdi-delete-outline" variant="outlined" color="error" rounded="lg" @click="deleteEmployee(selectedEmployee)"></v-btn>
        </div>
      </template>
    </v-navigation-drawer>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ── Detail Panel ─────────────────────────────────────────
const detailPanel = ref(false)
const hireDateMenu = ref(false)
const toISODate = (d) => d ? new Date(d).toISOString().split('T')[0] : ''

const selectedEmployee = ref(null)

const openDetail = (item) => {
  selectedEmployee.value = item
  detailPanel.value = true
}

const deleteEmployee = (item) => {
  employeeData.value = employeeData.value.filter(e => e !== item)
  detailPanel.value = false
}

const addDialog = ref(false)
const activeTab = ref('basic')

const form = ref({
  id: '', firstName: '', lastName: '', email: '', phone: '', address: '',
  department: '', position: '', type: 'Full-time', status: 'Active',
  hireDate: '', salary: '', leaveBalance: 20,
  bankName: '', bankAccount: '', taxId: '', emergencyContact: '', emergencyPhone: ''
})

const openAddDialog = () => {
  activeTab.value = 'basic'
  form.value = {
    id: '', firstName: '', lastName: '', email: '', phone: '', address: '',
    department: '', position: '', type: 'Full-time', status: 'Active',
    hireDate: '', salary: '', leaveBalance: 20,
    bankName: '', bankAccount: '', taxId: '', emergencyContact: '', emergencyPhone: ''
  }
  addDialog.value = true
}

const saveEmployee = () => {
  if (!form.value.firstName || !form.value.email) return
  employeeData.value.push({
    id: form.value.id || `EMP00${employeeData.value.length + 1}`,
    employee: `${form.value.firstName} ${form.value.lastName}`.trim(),
    department: form.value.department,
    position: form.value.position,
    type: form.value.type,
    status: form.value.status,
    hireDate: form.value.hireDate
  })
  addDialog.value = false
}

const headers = [
  { title: 'Employee', align: 'start', key: 'employee', sortable: true },
  { title: 'Department', align: 'start', key: 'department', sortable: true },
  { title: 'Position', align: 'start', key: 'position', sortable: true },
  { title: 'Type', align: 'start', key: 'type', sortable: false },
  { title: 'Status', align: 'start', key: 'status', sortable: true },
  { title: 'Hire Date', align: 'start', key: 'hireDate', sortable: true },
]

const employeeData = ref([
  { id: 'EMP001', employee: 'Thein Thein', department: 'Engineering', position: 'Junior Web Developer', type: 'Full-time', status: 'Active', hireDate: '2026-02-05', salary: '1200', leaveBalance: 18 },
  { id: 'EMP002', employee: 'Emily Rodriguez', department: 'Marketing', position: 'Marketing Specialist', type: 'Full-time', status: 'Active', hireDate: '2023-01-10', salary: '2500', leaveBalance: 15 },
  { id: 'EMP003', employee: 'Michael Chen', department: 'Human Resources', position: 'HR Manager', type: 'Full-time', status: 'Active', hireDate: '2021-08-01', salary: '3500', leaveBalance: 10 },
  { id: 'EMP004', employee: 'Lisa Thompson', department: 'Sales', position: 'Sales Representative', type: 'Full-time', status: 'On Leave', hireDate: '2023-04-05', salary: '2200', leaveBalance: 5 },
  { id: 'EMP005', employee: 'Sarah Johnson', department: 'Engineering', position: 'Senior Software Engineer', type: 'Full-time', status: 'Active', hireDate: '2022-03-15', salary: '4500', leaveBalance: 20 },
])

const search = ref('')
const activeMainTab = ref('Employees')
const departmentFilter = ref('All Departments')
const departmentsList = ref(['Engineering', 'Marketing', 'Human Resources', 'Sales'])
const departments = computed(() => ['All Departments', ...departmentsList.value])

const filteredEmployees = computed(() => {
  let data = employeeData.value
  if (departmentFilter.value !== 'All Departments') {
    data = data.filter(emp => emp.department === departmentFilter.value)
  }
  return data
})

// ── Department CRUD ─────────────────────────────────────
const deptFormDialog = ref(false)
const isEditingDept = ref(false)
const oldDeptName = ref('')
const deptForm = ref({ name: '' })

const deptHeaders = [
  { title: 'Department Name', align: 'start', key: 'name', sortable: true },
  { title: 'Employees', align: 'start', key: 'employees', sortable: true },
  { title: 'Actions', align: 'end', key: 'actions', sortable: false },
]

const departmentsWithStats = computed(() => {
  return departmentsList.value.map(dept => ({
    name: dept,
    employeesCount: employeeData.value.filter(e => e.department === dept).length
  }))
})

const openAddDeptDialog = () => {
  isEditingDept.value = false
  deptForm.value = { name: '' }
  deptFormDialog.value = true
}

const openEditDeptDialog = (dept) => {
  isEditingDept.value = true
  oldDeptName.value = dept.name
  deptForm.value = { name: dept.name }
  deptFormDialog.value = true
}

const saveDept = () => {
  if (!deptForm.value.name) return
  
  if (isEditingDept.value) {
    const index = departmentsList.value.indexOf(oldDeptName.value)
    if (index !== -1) {
      departmentsList.value[index] = deptForm.value.name
      // Update employees in this department
      employeeData.value.forEach(emp => {
        if (emp.department === oldDeptName.value) emp.department = deptForm.value.name
      })
    }
  } else {
    departmentsList.value.push(deptForm.value.name)
  }
  deptFormDialog.value = false
}

const deleteDept = (name) => {
  departmentsList.value = departmentsList.value.filter(d => d !== name)
}

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
.search-field :deep(.v-field__outline), .tab-container {
  --v-field-border-opacity: 0;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08) !important;
}
.employee-table :deep(th), .dept-table :deep(th) {
  text-transform: uppercase !important;
  font-size: 0.75rem !important;
  letter-spacing: 0.05em;
  font-weight: 700 !important;
  color: rgba(var(--v-theme-on-surface), 0.5) !important;
  background-color: transparent !important;
}
.employee-table :deep(tbody tr), .dept-table :deep(tbody tr) {
  cursor: pointer;
}
.tab-container {
  background: rgba(var(--v-theme-on-surface), 0.03) !important;
}
.active-tab {
  background: white !important;
  color: rgb(var(--v-theme-primary)) !important;
}
.v-theme--dark .active-tab {
  background: rgba(255,255,255,0.1) !important;
}
.shadow-primary {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2) !important;
}
.gap-4 { gap: 16px; }
.gap-3 { gap: 12px; }
.primary-lighten-4 {
  background-color: rgb(var(--v-theme-primary), 0.1) !important;
}
.border {
  border: 1px solid rgb(var(--v-theme-primary), 0.2) !important;
}

/* Detail panel */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  background: rgba(var(--v-theme-primary), 0.04);
  border-radius: 12px;
  padding: 16px;
}
.detail-info-list .d-flex {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.detail-info-list .d-flex:last-child {
  border-bottom: none;
}
.detail-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
}
</style>
