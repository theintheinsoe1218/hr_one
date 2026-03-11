<template>
  <div class="overtime-page">
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h4 font-weight-bold text-grey-darken-4">Overtime</h1>
      <v-btn color="primary" prepend-icon="mdi-clock-plus" rounded="lg" size="large">Log Overtime</v-btn>
    </div>

    <v-card class="rounded-xl elevation-2">
      <div class="pa-6 border-b d-flex align-center justify-space-between">
        <span class="text-h6 font-weight-bold">Overtime Logs</span>
        <div class="d-flex gap-2">
           <v-select
             v-model="monthFilter"
             :items="months"
             density="compact"
             variant="outlined"
             hide-details
             class="bg-grey-lighten-4 rounded-lg"
             style="width: 150px;"
           ></v-select>
        </div>
      </div>
      <v-data-table :headers="headers" :items="logs" class="elevation-0">
        <template v-slot:item.hours="{ item }">
          <span class="font-weight-bold text-primary">{{ item.hours }} hrs</span>
        </template>
        <template v-slot:item.status="{ item }">
           <v-chip :color="item.status === 'Approved' ? 'success' : 'warning'" size="small">
             {{ item.status }}
           </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const monthFilter = ref('March 2026')
const months = ['March 2026', 'February 2026', 'January 2026']

const headers = [
  { title: 'Date', key: 'date' },
  { title: 'Task/Project', key: 'task' },
  { title: 'Hours', key: 'hours', align: 'center' },
  { title: 'Rate', key: 'rate' },
  { title: 'Status', key: 'status', align: 'center' },
]

const logs = [
  { date: 'Mar 05, 2026', task: 'HR Portal Bug Fixes', hours: 4.5, rate: '1.5x', status: 'Approved' },
  { date: 'Mar 08, 2026', task: 'Database Migration', hours: 2.0, rate: '2.0x', status: 'Pending' },
  { date: 'Feb 28, 2026', task: 'Quarterly Report Prep', hours: 6.0, rate: '1.5x', status: 'Approved' },
]
</script>

<style scoped>
.border-b { border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important; }
.gap-2 { gap: 8px; }
</style>
