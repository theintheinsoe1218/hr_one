<template>
  <div class="profile-page">
    <!-- Profile Header / Cover -->
    <v-card class="rounded-xl overflow-hidden elevation-2 mb-6">
      <div class="profile-cover"></div>
      <div class="px-6 pb-6 pt-0 mt-n12 relative-z">
        <div class="d-flex flex-column flex-md-row align-center align-md-end gap-4">
          <v-avatar size="140" class="profile-avatar border-white-thick elevation-3">
            <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
          </v-avatar>
          <div class="text-center text-md-left mb-2 flex-grow-1">
            <h1 class="text-h4 font-weight-black text-on-surface mb-1">Admin User</h1>
            <div class="d-flex align-center justify-center justify-md-start gap-2">
              <v-chip color="primary" size="small" class="font-weight-bold">Super Admin</v-chip>
              <span class="text-subtitle-1 text-medium-emphasis">System Administrator</span>
            </div>
          </div>
          <div class="d-flex gap-2 mb-2">
            <v-btn color="primary" variant="flat" rounded="lg" prepend-icon="mdi-pencil" class="text-none font-weight-bold">
              Edit Profile
            </v-btn>
          </div>
        </div>
      </div>
    </v-card>

    <v-row>
      <!-- Left Column: Personal Info -->
      <v-col cols="12" md="8">
        <v-card class="rounded-xl pa-6 mb-6">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-account-details-outline</v-icon>
            <h2 class="text-h6 font-weight-bold mb-0">Personal Information</h2>
          </div>
          
          <v-row>
            <v-col cols="12" sm="6">
              <div class="info-group">
                <label class="text-caption font-weight-bold text-medium-emphasis text-uppercase letter-spacing-1">Email Address</label>
                <div class="text-body-1 font-weight-medium text-on-surface">admin@synergy.com</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-group">
                <label class="text-caption font-weight-bold text-medium-emphasis text-uppercase letter-spacing-1">Phone Number</label>
                <div class="text-body-1 font-weight-medium text-on-surface">+1 (555) 123-4567</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-group">
                <label class="text-caption font-weight-bold text-medium-emphasis text-uppercase letter-spacing-1">Birth Date</label>
                <div class="text-body-1 font-weight-medium text-on-surface">May 15, 1990</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-group">
                <label class="text-caption font-weight-bold text-medium-emphasis text-uppercase letter-spacing-1">Gender</label>
                <div class="text-body-1 font-weight-medium text-on-surface">Male</div>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="info-group">
                <label class="text-caption font-weight-bold text-medium-emphasis text-uppercase letter-spacing-1">Address</label>
                <div class="text-body-1 font-weight-medium text-on-surface">123 Tech Avenue, Silicon Valley, CA 94025</div>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <v-card class="rounded-xl pa-6">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-briefcase-outline</v-icon>
            <h2 class="text-h6 font-weight-bold mb-0">Employment Details</h2>
          </div>
          
          <v-row>
            <v-col cols="12" sm="4">
              <div class="info-group">
                <label class="text-caption font-weight-bold text-medium-emphasis text-uppercase letter-spacing-1">Employee ID</label>
                <div class="text-body-1 font-weight-medium text-on-surface">SYS-001</div>
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="info-group">
                <label class="text-caption font-weight-bold text-medium-emphasis text-uppercase letter-spacing-1">Joining Date</label>
                <div class="text-body-1 font-weight-medium text-on-surface">Jan 10, 2022</div>
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="info-group">
                <label class="text-caption font-weight-bold text-medium-emphasis text-uppercase letter-spacing-1">Department</label>
                <div class="text-body-1 font-weight-medium text-on-surface">Administration</div>
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="info-group">
                <label class="text-caption font-weight-bold text-medium-emphasis text-uppercase letter-spacing-1">Work Location</label>
                <div class="text-body-1 font-weight-medium text-on-surface">Main Office (Headquarters)</div>
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="info-group">
                <label class="text-caption font-weight-bold text-medium-emphasis text-uppercase letter-spacing-1">Reporting Manager</label>
                <div class="text-body-1 font-weight-medium text-on-surface">CEO Office</div>
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="info-group">
                <label class="text-caption font-weight-bold text-medium-emphasis text-uppercase letter-spacing-1">Work Type</label>
                <div class="text-body-1 font-weight-medium text-on-surface">Full-Time (Remote)</div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Right Column: Settings / Stats -->
      <v-col cols="12" md="4">
        <v-card class="rounded-xl pa-6 mb-6">
          <div class="d-flex align-center justify-space-between mb-6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-3">mdi-shield-lock-outline</v-icon>
              <h2 class="text-h6 font-weight-bold mb-0">Security</h2>
            </div>
            <v-btn icon="mdi-chevron-right" variant="text" size="small"></v-btn>
          </div>
          
          <v-list density="compact" class="pa-0">
            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <v-icon size="20" color="medium-emphasis">mdi-key-outline</v-icon>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">Change Password</v-list-item-title>
              <template v-slot:append>
                <v-icon size="16">mdi-chevron-right</v-icon>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <v-icon size="20" color="medium-emphasis">mdi-form-textbox-password</v-icon>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">Two-Factor Authentication</v-list-item-title>
              <template v-slot:append>
                <v-chip size="x-small" color="success" class="font-weight-bold">Enabled</v-chip>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="px-0 py-2">
              <template v-slot:prepend>
                <v-icon size="20" color="medium-emphasis">mdi-devices</v-icon>
              </template>
              <v-list-item-title class="text-body-2 font-weight-medium">Active Sessions</v-list-item-title>
              <template v-slot:append>
                <span class="text-caption font-weight-bold">2 devices</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <v-card class="rounded-xl pa-6">
          <div class="d-flex align-center mb-6">
            <v-icon color="primary" class="mr-3">mdi-chart-line</v-icon>
            <h2 class="text-h6 font-weight-bold mb-0">Activity Overview</h2>
          </div>
          
          <div class="activity-stats">
            <div class="d-flex justify-space-between align-center mb-4 pa-4 rounded-xl bg-grey-lighten-4">
              <div class="d-flex align-center">
                <v-icon color="success" class="mr-3">mdi-calendar-check</v-icon>
                <span class="text-subtitle-2 font-weight-bold">Attendance</span>
              </div>
              <span class="text-h6 font-weight-black">98%</span>
            </div>
            <div class="d-flex justify-space-between align-center mb-4 pa-4 rounded-xl bg-grey-lighten-4">
              <div class="d-flex align-center">
                <v-icon color="warning" class="mr-3">mdi-timer-sand</v-icon>
                <span class="text-subtitle-2 font-weight-bold">Overtime</span>
              </div>
              <span class="text-h6 font-weight-black">12h</span>
            </div>
            <div class="d-flex justify-space-between align-center pa-4 rounded-xl bg-grey-lighten-4">
              <div class="d-flex align-center">
                <v-icon color="info" class="mr-3">mdi-beach</v-icon>
                <span class="text-subtitle-2 font-weight-bold">Leave Taken</span>
              </div>
              <span class="text-h6 font-weight-black">5d</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
// No complex logic needed for current static profile view
</script>

<style scoped>
.profile-cover {
  height: 180px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  position: relative;
}

.profile-cover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 1;
}

.relative-z {
  position: relative;
  z-index: 1;
}

.profile-avatar {
  background-color: white;
}

.border-white-thick {
  border: 4px solid white !important;
}

.gap-4 { gap: 16px; }
.gap-2 { gap: 8px; }

.letter-spacing-1 {
  letter-spacing: 0.1em;
}

.info-group {
  margin-bottom: 8px;
}

.info-group label {
  display: block;
  margin-bottom: 4px;
}

.bg-grey-lighten-4 {
  background-color: #f8fafc !important;
}

.v-theme--dark .bg-grey-lighten-4 {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>
