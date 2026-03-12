<template>
  <div class="user-management-page">
    <!-- Header -->
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-sm-space-between mb-8 gap-4">
      <div>
        <h1 class="text-h4 font-weight-bold text-on-surface mb-1">User Management</h1>
        <div class="text-subtitle-1 opacity-70">Manage system access and roles for staff</div>
      </div>
      <v-btn 
        color="primary" 
        prepend-icon="mdi-account-plus" 
        rounded="lg" 
        size="large" 
        class="font-weight-bold px-6 text-none shadow-primary"
        @click="openAddDialog"
      >
        Create Account
      </v-btn>
    </div>

    <!-- Stats summary -->
    <v-row class="mb-8">
      <v-col v-for="stat in userStats" :key="stat.label" cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-5 elevation-1 border-light">
          <div class="d-flex align-center">
            <v-avatar :color="`${stat.color}-lighten-5`" variant="flat" rounded="lg" size="48" class="mr-4">
              <v-icon :color="stat.color" size="24">{{ stat.icon }}</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-2 font-weight-bold" :class="`text-${stat.color}`">{{ stat.label }}</div>
              <div class="text-h4 font-weight-black text-on-surface">{{ stat.value }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Users Table Card -->
    <v-card class="rounded-xl elevation-2 pa-6 border-light">
      <div class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-4">
        <v-text-field
          v-model="search"
          placeholder="Search by name, email or role..."
          prepend-inner-icon="mdi-magnify"
          density="comfortable"
          variant="outlined"
          hide-details
          rounded="lg"
          class="bg-surface border-light search-box w-100"
          style="max-width: 400px;"
        ></v-text-field>

        <v-select
          v-model="roleFilter"
          :items="['All Roles', 'Super Admin', 'Admin', 'HR Manager', 'Employee']"
          placeholder="Filter by Role"
          density="comfortable"
          variant="outlined"
          hide-details
          rounded="lg"
          class="bg-surface border-light"
          style="max-width: 200px;"
        ></v-select>
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        :search="search"
        hover
        class="users-table"
      >
        <template v-slot:item.user="{ item }">
          <div class="d-flex align-center py-3">
            <v-avatar color="primary-lighten-5" size="42" class="mr-3 text-primary font-weight-bold border-light">
              <v-img v-if="item.avatar" :src="item.avatar"></v-img>
              <span v-else>{{ getInitials(item.name) }}</span>
            </v-avatar>
            <div>
              <div class="font-weight-bold text-on-surface">{{ item.name }}</div>
              <div class="text-caption opacity-60">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.role="{ item }">
          <v-chip size="small" variant="tonal" :color="getRoleColor(item.role)" class="font-weight-bold rounded px-3">
            {{ item.role }}
          </v-chip>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip size="small" variant="flat" :color="item.status === 'Active' ? 'success' : 'grey'" class="font-weight-bold rounded px-3 text-white">
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex align-center justify-end gap-2">
            <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="primary" @click="editUser(item)"></v-btn>
            <v-btn icon="mdi-delete-outline" variant="text" size="small" color="error" @click="confirmDelete(item)"></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit User Dialog -->
    <v-dialog v-model="userDialog" max-width="600px" persistent scrollable>
      <v-card class="rounded-xl shadow-xl d-flex flex-column" style="max-height: 90vh;">
        <v-card-title class="d-flex align-center justify-space-between pa-6 border-b-light flex-shrink-0">
          <span class="text-h6 font-weight-bold text-on-surface">{{ isEditing ? 'Edit Account' : 'Create New Account' }}</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="userDialog = false"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6 overflow-y-auto flex-grow-1">
          <v-alert v-if="errorMsg" type="error" variant="tonal" class="mb-4 rounded-lg" closable>
            {{ errorMsg }}
          </v-alert>

          <v-row>
            <v-col cols="12" md="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block text-on-surface">Full Name</label>
              <v-text-field v-model="form.name" placeholder="Staff Name" variant="outlined" hide-details rounded="lg"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block text-on-surface">Employee ID</label>
              <v-text-field v-model="form.employeeId" placeholder="e.g., EMP-001" variant="outlined" hide-details rounded="lg"></v-text-field>
            </v-col>
            <v-col cols="12">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block text-on-surface">Email Address</label>
              <v-text-field v-model="form.email" placeholder="email@synergy.com" variant="outlined" hide-details rounded="lg"></v-text-field>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block text-on-surface">Role</label>
              <v-select
                v-model="form.role"
                :items="['Super Admin', 'Admin', 'HR Manager', 'Employee']"
                placeholder="Select role"
                variant="outlined"
                hide-details
                rounded="lg"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block text-on-surface">Status</label>
              <v-select
                v-model="form.status"
                :items="['Active', 'Disabled']"
                variant="outlined"
                hide-details
                rounded="lg"
              ></v-select>
            </v-col>
            <v-col cols="12" v-if="!isEditing">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block text-on-surface">Password</label>
              <v-text-field 
                v-model="form.password" 
                type="password" 
                placeholder="Create password" 
                variant="outlined" 
                hide-details 
                rounded="lg"
                prepend-inner-icon="mdi-lock-outline"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-6 border-t-light flex-shrink-0">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded="lg" class="px-6 text-none border-grey" @click="userDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            rounded="lg" 
            class="px-6 text-none font-weight-bold shadow-primary ml-2" 
            @click="saveUser"
          >
            {{ isEditing ? 'Update Account' : 'Create Account' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="rounded-xl pa-4">
        <v-card-title class="text-h6 font-weight-bold text-center">Delete Account?</v-card-title>
        <v-card-text class="text-center opacity-70">
          This will remove <strong>{{ userToDelete?.name }}</strong>'s access to the system. This action cannot be undone.
        </v-card-text>
        <v-card-actions class="justify-center gap-2 mt-4">
          <v-btn variant="outlined" rounded="lg" class="px-4 text-none border-grey" @click="deleteDialog = false">No, Cancel</v-btn>
          <v-btn color="error" rounded="lg" class="px-4 text-none font-weight-bold" @click="deleteUser">Yes, Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const roleFilter = ref('All Roles')
const userDialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const errorMsg = ref('')
const userToDelete = ref(null)

const form = ref({
  name: '',
  email: '',
  role: 'Employee',
  employeeId: '',
  status: 'Active',
  password: ''
})

const users = ref([
  { id: 1, name: 'Admin User', email: 'admin@synergy.com', role: 'Super Admin', employeeId: 'SYS-001', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Thein Thein', email: 'theinthein@synergy.com', role: 'HR Manager', employeeId: 'EMP-005', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Michael Chen', email: 'michael@synergy.com', role: 'Admin', employeeId: 'EMP-002', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Sarah Johnson', email: 'sarah@synergy.com', role: 'Employee', employeeId: 'EMP-001', status: 'Disabled', avatar: 'https://i.pravatar.cc/150?u=4' },
])

const headers = [
  { title: 'User Account', key: 'user' },
  { title: 'ID', key: 'employeeId' },
  { title: 'System Role', key: 'role' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', align: 'end', sortable: false },
]

const userStats = computed(() => {
  return [
    { label: 'Total Users', value: users.value.length, icon: 'mdi-account-group-outline', color: 'primary' },
    { label: 'Admins', value: users.value.filter(u => u.role.includes('Admin')).length, icon: 'mdi-shield-check-outline', color: 'indigo' },
    { label: 'HR Managers', value: users.value.filter(u => u.role === 'HR Manager').length, icon: 'mdi-account-tie-outline', color: 'deep-purple' },
    { label: 'Active Sessions', value: '2', icon: 'mdi-web-clock', color: 'success' },
  ]
})

const filteredUsers = computed(() => {
  let result = users.value
  if (roleFilter.value !== 'All Roles') {
    result = result.filter(u => u.role === roleFilter.value)
  }
  return result
})

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getRoleColor = (role) => {
  switch (role) {
    case 'Super Admin': return 'error'
    case 'Admin': return 'indigo'
    case 'HR Manager': return 'deep-purple'
    default: return 'primary'
  }
}

const openAddDialog = () => {
  isEditing.value = false
  form.value = { name: '', email: '', role: 'Employee', employeeId: '', status: 'Active', password: '' }
  userDialog.value = true
}

const editUser = (user) => {
  isEditing.value = true
  form.value = { ...user }
  userDialog.value = true
}

const saveUser = () => {
  if (!form.value.name || !form.value.email) {
    errorMsg.value = 'Name and Email are required'
    return
  }
  
  if (isEditing.value) {
    const index = users.value.findIndex(u => u.id === form.value.id)
    if (index !== -1) users.value[index] = { ...form.value }
  } else {
    users.value.push({
      id: Date.now(),
      ...form.value,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    })
  }
  userDialog.value = false
}

const confirmDelete = (user) => {
  userToDelete.value = user
  deleteDialog.value = true
}

const deleteUser = () => {
  users.value = users.value.filter(u => u.id !== userToDelete.value.id)
  deleteDialog.value = false
  userToDelete.value = null
}
</script>

<style scoped>
.users-table :deep(th) {
  text-transform: none !important;
  font-size: 0.875rem !important;
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}
</style>
