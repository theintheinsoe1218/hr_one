<template>
  <div class="performance-page">

    <!-- Header -->
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-sm-space-between mb-6 gap-4">
      <div>
        <h1 class="text-h5 text-md-h4 font-weight-bold text-on-surface mb-1">Performance Reviews</h1>
        <div class="text-body-2 text-medium-emphasis">Manage employee performance evaluations</div>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        size="large"
        class="font-weight-bold px-6 text-none"
        @click="activeTab === 'reviews' ? (assignDialog = true) : (templateDialog = true)"
      >
        {{ activeTab === 'reviews' ? 'Assign Review' : 'New Template' }}
      </v-btn>
    </div>

    <!-- Stat Cards -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="3">
        <v-card class="rounded-xl pa-5 elevation-0 border" :style="`background:${stat.bg}`">
          <div class="d-flex align-center gap-3 mb-2">
            <v-icon :color="stat.color" size="22">{{ stat.icon }}</v-icon>
            <span class="text-subtitle-2 font-weight-bold" :style="`color:${stat.color}`">{{ stat.label }}</span>
          </div>
          <div class="text-h4 font-weight-bold" :style="`color:${stat.color}`">{{ stat.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabs + Search -->
    <v-card class="rounded-xl elevation-1 pa-0 border" variant="outlined">
      <div class="d-flex align-center justify-space-between px-4 pt-4 pb-0 gap-4 flex-wrap">
        <v-btn-toggle v-model="activeTab" mandatory variant="outlined" density="compact" rounded="lg" color="on-surface">
          <v-btn value="reviews" class="text-none font-weight-medium px-5">Reviews</v-btn>
          <v-btn value="templates" class="text-none font-weight-medium px-5">Templates</v-btn>
        </v-btn-toggle>

        <v-text-field
          v-model="search"
          placeholder="Search..."
          prepend-inner-icon="mdi-magnify"
          density="compact"
          variant="outlined"
          hide-details
          rounded="lg"
          style="max-width: 240px;"
          class="search-field"
        ></v-text-field>
      </div>

      <v-divider class="mt-4"></v-divider>

      <!-- Reviews Table -->
      <div v-if="activeTab === 'reviews'">
        <v-data-table
          :headers="reviewHeaders"
          :items="filteredReviews"
          :search="search"
          class="perf-table"
          hover
        >
          <template v-slot:item.employee="{ item }">
            <div class="d-flex align-center gap-3 py-2">
              <v-avatar color="primary-lighten-4" size="36" class="text-primary font-weight-bold text-caption">
                {{ getInitials(item.name) }}
              </v-avatar>
              <div>
                <div class="font-weight-bold text-on-surface text-body-2">{{ item.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.year }}</div>
              </div>
            </div>
          </template>

          <template v-slot:item.reviewType="{ item }">
            <div>
              <div class="font-weight-bold text-on-surface text-body-2">{{ item.type }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.template }}</div>
            </div>
          </template>

          <template v-slot:item.rating="{ item }">
            <div class="d-flex align-center gap-1">
              <v-icon color="amber" size="18">mdi-star</v-icon>
              <span class="font-weight-bold text-on-surface">{{ item.rating }}</span>
              <span class="text-medium-emphasis">/ 5</span>
            </div>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.status === 'Completed' ? 'default' : item.status === 'In Progress' ? 'info' : 'warning'"
              variant="outlined"
              size="small"
              class="font-weight-medium"
            >{{ item.status }}</v-chip>
          </template>
        </v-data-table>
      </div>

      <!-- Templates Table -->
      <div v-if="activeTab === 'templates'">
        <v-data-table
          :headers="templateHeaders"
          :items="filteredTemplates"
          :search="search"
          class="perf-table"
          hover
        >
          <template v-slot:item.name="{ item }">
            <div>
              <div class="font-weight-bold text-on-surface text-body-2">{{ item.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.desc }}</div>
            </div>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip color="success" variant="tonal" size="small" class="font-weight-medium">{{ item.status }}</v-chip>
          </template>

          <template v-slot:item.actions>
            <v-btn variant="outlined" size="small" rounded="lg" class="text-none font-weight-medium">Edit</v-btn>
          </template>
        </v-data-table>
      </div>
    </v-card>

    <!-- Assign Review Dialog -->
    <v-dialog v-model="assignDialog" max-width="540px" scrollable>
      <v-card class="rounded-xl d-flex flex-column" style="max-height: 90vh;">
        <v-card-title class="d-flex align-center justify-space-between pa-6 flex-shrink-0">
          <span class="text-h6 font-weight-bold text-on-surface">Assign Performance Review</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="assignDialog = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-6 overflow-y-auto flex-grow-1">
          <div class="mb-5">
            <label class="text-subtitle-2 font-weight-bold d-block mb-2 text-on-surface">Employee</label>
            <v-select
              v-model="assignForm.employee"
              :items="employeeOptions"
              placeholder="Select employee"
              variant="outlined"
              hide-details
              rounded="lg"
            ></v-select>
          </div>

          <div class="mb-5">
            <label class="text-subtitle-2 font-weight-bold d-block mb-2 text-on-surface">Review Template</label>
            <v-select
              v-model="assignForm.template"
              :items="templateOptions"
              variant="outlined"
              hide-details
              rounded="lg"
            ></v-select>
          </div>

          <v-row class="mb-1">
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold d-block mb-2 text-on-surface">Review Period</label>
              <v-text-field
                v-model="assignForm.period"
                placeholder="e.g., Q1 2025, 2024 Annual"
                variant="outlined"
                hide-details
                rounded="lg"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold d-block mb-2 text-on-surface">Due Date</label>
              <v-menu v-model="dueDateMenu" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="assignForm.dueDate"
                    placeholder="YYYY-MM-DD"
                    variant="outlined"
                    hide-details
                    rounded="lg"
                    readonly
                  ></v-text-field>
                </template>
                <v-date-picker
                  @update:model-value="(val) => { assignForm.dueDate = val.toISOString().split('T')[0]; dueDateMenu = false }"
                  color="primary"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold d-block mb-2 text-on-surface">Reviewer Name</label>
              <v-text-field
                v-model="assignForm.reviewerName"
                placeholder="Manager name"
                variant="outlined"
                hide-details
                rounded="lg"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold d-block mb-2 text-on-surface">Reviewer Email</label>
              <v-text-field
                v-model="assignForm.reviewerEmail"
                placeholder="manager@company.com"
                variant="outlined"
                hide-details
                rounded="lg"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-5 flex-shrink-0">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded="lg" class="px-5 text-none" @click="assignDialog = false">Cancel</v-btn>
          <v-btn color="primary" rounded="lg" class="px-5 text-none font-weight-bold ml-2" @click="assignDialog = false">Assign Review</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Template Dialog -->
    <v-dialog v-model="templateDialog" max-width="600px" scrollable>
      <v-card class="rounded-xl d-flex flex-column" style="max-height: 92vh;">
        <v-card-title class="d-flex align-center justify-space-between pa-6 flex-shrink-0">
          <span class="text-h6 font-weight-bold text-on-surface">Create Review Template</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="templateDialog = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-6 overflow-y-auto flex-grow-1">
          <!-- Template Name -->
          <div class="mb-5">
            <label class="text-subtitle-2 font-weight-bold d-block mb-2 text-on-surface">Template Name <span class="text-error">*</span></label>
            <v-text-field
              v-model="templateForm.name"
              placeholder="e.g., Annual Performance Review 2025"
              variant="outlined"
              hide-details
              rounded="lg"
              color="primary"
            ></v-text-field>
          </div>

          <!-- Review Type & Rating Scale -->
          <v-row class="mb-1">
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold d-block mb-2 text-on-surface">Review Type</label>
              <v-select
                v-model="templateForm.type"
                :items="['Annual', 'Quarterly', 'Monthly', 'Probation']"
                variant="outlined"
                hide-details
                rounded="lg"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold d-block mb-2 text-on-surface">Rating Scale (1 to X)</label>
              <v-select
                v-model="templateForm.scale"
                :items="['1-3', '1-5', '1-10']"
                variant="outlined"
                hide-details
                rounded="lg"
              ></v-select>
            </v-col>
          </v-row>

          <!-- Description -->
          <div class="mb-6">
            <label class="text-subtitle-2 font-weight-bold d-block mb-2 text-on-surface">Description</label>
            <v-textarea
              v-model="templateForm.description"
              placeholder="Describe the purpose of this review template"
              variant="outlined"
              hide-details
              rounded="lg"
              rows="3"
              no-resize
            ></v-textarea>
          </div>

          <!-- Review Criteria -->
          <div class="d-flex align-center justify-space-between mb-3">
            <span class="text-subtitle-1 font-weight-bold text-on-surface">Review Criteria</span>
            <v-btn variant="outlined" size="small" prepend-icon="mdi-plus" rounded="lg" class="text-none" @click="addCriterion">
              Add Criterion
            </v-btn>
          </div>

          <div v-for="(criterion, i) in templateForm.criteria" :key="i" class="d-flex align-center gap-2 mb-3">
            <v-icon color="grey-lighten-1" size="18" class="cursor-grab">mdi-drag-vertical</v-icon>
            <v-select
              v-model="criterion.name"
              :items="criteriaOptions"
              variant="outlined"
              density="compact"
              hide-details
              rounded="lg"
              style="max-width: 160px;"
            ></v-select>
            <v-text-field
              v-model="criterion.desc"
              variant="outlined"
              density="compact"
              hide-details
              rounded="lg"
              class="flex-grow-1"
            ></v-text-field>
            <v-text-field
              v-model="criterion.weight"
              variant="outlined"
              density="compact"
              hide-details
              rounded="lg"
              style="width: 64px;"
              type="number"
            ></v-text-field>
            <span class="text-medium-emphasis text-body-2">%</span>
            <v-btn icon="mdi-delete-outline" variant="text" size="small" color="grey" @click="templateForm.criteria.splice(i, 1)"></v-btn>
          </div>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-5 flex-shrink-0">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded="lg" class="px-5 text-none" @click="templateDialog = false">Cancel</v-btn>
          <v-btn color="primary" rounded="lg" class="px-5 text-none font-weight-bold ml-2" @click="templateDialog = false">Create Template</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('reviews')
const search = ref('')
const assignDialog = ref(false)
const templateDialog = ref(false)
const dueDateMenu = ref(false)

// ── Stat Cards ──────────────────────────────────────────
const stats = [
  { label: 'Total Reviews', value: 1, icon: 'mdi-clipboard-list-outline',  color: '#4f46e5', bg: '#eef2ff' },
  { label: 'In Progress',   value: 0, icon: 'mdi-clock-outline',            color: '#d97706', bg: '#fffbeb' },
  { label: 'Completed',     value: 1, icon: 'mdi-check-circle-outline',     color: '#059669', bg: '#ecfdf5' },
  { label: 'Templates',     value: 2, icon: 'mdi-file-document-outline',    color: '#7c3aed', bg: '#f5f3ff' },
]

// ── Reviews ──────────────────────────────────────────────
const reviews = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    year: '2025',
    type: 'Annual',
    template: 'Annual Performance Review 2025',
    reviewer: '-',
    dueDate: 'Jan 23, 2026',
    rating: 2,
    status: 'Completed',
  },
])

const reviewHeaders = [
  { title: 'Employee',    key: 'employee',   sortable: true },
  { title: 'Review Type', key: 'reviewType', sortable: false },
  { title: 'Reviewer',   key: 'reviewer',   sortable: false },
  { title: 'Due Date',   key: 'dueDate',    sortable: true },
  { title: 'Rating',     key: 'rating',     sortable: true },
  { title: 'Status',     key: 'status',     sortable: true },
]

const filteredReviews = computed(() => reviews.value)

// ── Templates ─────────────────────────────────────────────
const templates = ref([
  { id: 1, name: 'Annual Performance Review 2025', desc: 'Comprehensive annual review for all employees', type: 'Annual',    criteria: '8 items', scale: '1-5', status: 'Active' },
  { id: 2, name: 'Quarterly Check-in',             desc: 'Quick quarterly performance check',            type: 'Quarterly', criteria: '3 items', scale: '1-5', status: 'Active' },
])

const templateHeaders = [
  { title: 'Template Name', key: 'name',     sortable: true },
  { title: 'Type',          key: 'type',     sortable: true },
  { title: 'Criteria',      key: 'criteria', sortable: false },
  { title: 'Scale',         key: 'scale',    sortable: false },
  { title: 'Status',        key: 'status',   sortable: true },
  { title: 'Actions',       key: 'actions',  sortable: false },
]

const filteredTemplates = computed(() => templates.value)

// ── Assign Form ───────────────────────────────────────────
const assignForm = ref({
  employee: '',
  template: 'Annual Performance Review 2025 (Annual)',
  period: '',
  dueDate: '',
  reviewerName: '',
  reviewerEmail: '',
})

const employeeOptions = ['Sarah Johnson', 'Thein Thein', 'Michael Chen', 'Emily Rodriguez']
const templateOptions = ['Annual Performance Review 2025 (Annual)', 'Quarterly Check-in (Quarterly)']

// ── Template Form ─────────────────────────────────────────
const criteriaOptions = [
  'Job Knowledge', 'Quality of Work', 'Communication', 'Teamwork',
  'Initiative', 'Attendance', 'Leadership', 'Problem Solving',
]

const templateForm = ref({
  name: '',
  type: 'Annual',
  scale: '1-5',
  description: '',
  criteria: [
    { name: 'Job Knowledge',   desc: 'Demonstrates understanding of job responsibilities', weight: 10 },
    { name: 'Quality of Work', desc: 'Produces accurate, thorough, and professional work', weight: 10 },
    { name: 'Communication',   desc: 'Communicates effectively with team members and',     weight: 10 },
  ],
})

const addCriterion = () => {
  templateForm.value.criteria.push({ name: 'Job Knowledge', desc: '', weight: 10 })
}

// ── Helpers ───────────────────────────────────────────────
const getInitials = (name) =>
  name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
</script>

<style scoped>
.perf-table :deep(th) {
  text-transform: none !important;
  font-size: 0.85rem !important;
  font-weight: 700 !important;
  color: rgba(var(--v-theme-on-surface), 0.7) !important;
}
.gap-3 { gap: 12px; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.border {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
.search-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0.25;
}
.cursor-grab { cursor: grab; }
</style>
