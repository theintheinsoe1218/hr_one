<template>
  <div class="performance-page">
    <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-6">Performance Analytics</h1>

    <v-row>
      <v-col cols="12" md="7">
        <v-card class="rounded-xl elevation-2 pa-6 h-100">
           <h2 class="text-h6 font-weight-bold mb-6">Key Performance Indicators</h2>
           <div v-for="kpi in kpis" :key="kpi.label" class="mb-6">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-subtitle-1 font-weight-medium text-grey-darken-3">{{ kpi.label }}</span>
                <span class="font-weight-bold text-primary">{{ kpi.value }}%</span>
              </div>
              <v-progress-linear
                :model-value="kpi.value"
                color="primary"
                height="10"
                rounded
              ></v-progress-linear>
           </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card class="rounded-xl elevation-2 pa-6 h-100">
           <h2 class="text-h6 font-weight-bold mb-4">Goal Progress</h2>
           <v-list class="pa-0">
             <v-list-item v-for="goal in goals" :key="goal.title" class="px-0 py-3">
               <template v-slot:prepend>
                 <v-icon :color="goal.color" class="mr-3">{{ goal.icon }}</v-icon>
               </template>
               <v-list-item-title class="font-weight-bold">{{ goal.title }}</v-list-item-title>
               <v-list-item-subtitle>{{ goal.status }}</v-list-item-subtitle>
               <template v-slot:append>
                  <v-progress-circular
                    :model-value="goal.progress"
                    :color="goal.color"
                    size="40"
                    width="4"
                    class="text-caption font-weight-bold"
                  >{{ goal.progress }}%</v-progress-circular>
               </template>
             </v-list-item>
           </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const kpis = [
  { label: 'Work Quality', value: 92 },
  { label: 'Efficiency', value: 85 },
  { label: 'Communication', value: 78 },
  { label: 'Leadership', value: 65 },
]

const goals = [
  { title: 'Frontend Refactor', icon: 'mdi-web', color: 'primary', status: 'On Track', progress: 75 },
  { title: 'New Onboarding Flow', icon: 'mdi-account-arrow-right', color: 'success', status: 'Ahead', progress: 90 },
  { title: 'Testing Coverage', icon: 'mdi-test-tube', color: 'warning', status: 'Behind', progress: 40 },
]
</script>
