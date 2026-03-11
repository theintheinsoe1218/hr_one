<template>
  <div>
    <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-6">Recruitment</h1>
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="rounded-xl elevation-2 h-100">
          <v-card-title class="pa-6 border-b d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-bold">Active Job Openings</span>
            <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg">Post New Job</v-btn>
          </v-card-title>
          <v-list class="pa-0">
            <template v-for="(job, index) in jobs" :key="index">
              <v-list-item class="pa-6">
                <div class="d-flex align-center justify-space-between w-100">
                  <div class="d-flex align-center">
                    <v-avatar color="primary" variant="tonal" rounded size="48" class="mr-4">
                      <v-icon>mdi-briefcase-outline</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-subtitle-1 font-weight-bold">{{ job.title }}</div>
                      <div class="text-caption text-grey-darken-1">{{ job.department }} • {{ job.location }}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <v-chip size="small" color="success" class="mb-1">{{ job.applicants }} Applicants</v-chip>
                    <div class="text-caption text-grey-darken-1">Posted {{ job.date }}</div>
                  </div>
                </div>
              </v-list-item>
              <v-divider v-if="index < jobs.length - 1"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="rounded-xl elevation-2 pa-6 h-100">
          <h3 class="text-h6 font-weight-bold mb-6">Candidate Pipeline</h3>
          <div v-for="stage in pipeline" :key="stage.name" class="mb-6">
            <div class="d-flex justify-space-between mb-2">
              <span class="text-subtitle-2 font-weight-bold">{{ stage.name }}</span>
              <span class="text-caption font-weight-bold">{{ stage.count }}</span>
            </div>
            <v-progress-linear
              :model-value="stage.percentage"
              color="primary"
              height="8"
              rounded
            ></v-progress-linear>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const jobs = [
  { title: 'Senior Frontend Developer', department: 'Engineering', location: 'Remote', applicants: 12, date: '2 days ago' },
  { title: 'HR Manager', department: 'Human Resources', location: 'Yangon', applicants: 8, date: '5 days ago' },
  { title: 'Marketing Specialist', department: 'Marketing', location: 'Bagan', applicants: 15, date: '1 week ago' },
  { title: 'UX Designer', department: 'Engineering', location: 'Remote', applicants: 24, date: '3 days ago' },
]

const pipeline = [
  { name: 'Sourced', count: 45, percentage: 80 },
  { name: 'Screening', count: 28, percentage: 50 },
  { name: 'Interview', count: 12, percentage: 25 },
  { name: 'Offer', count: 4, percentage: 10 },
]
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}
</style>
