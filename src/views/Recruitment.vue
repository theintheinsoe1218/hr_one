<template>
  <div class="recruitment-page">
    <!-- Header -->
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-sm-space-between mb-8 gap-4">
      <div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-1">Recruitment</h1>
        <div class="text-subtitle-1 text-grey-darken-1">Manage job postings and track applicants</div>
      </div>
      <div class="d-flex gap-2">
        <v-btn 
          variant="outlined" 
          prepend-icon="mdi-plus" 
          rounded="lg" 
          class="text-none font-weight-bold border-grey"
          @click="addApplicantDialog = true"
        >
          Add Applicant
        </v-btn>
        <v-btn 
          color="primary" 
          prepend-icon="mdi-plus" 
          rounded="lg" 
          class="text-none font-weight-bold px-4 shadow-primary"
          @click="postJobDialog = true"
        >
          Post Job
        </v-btn>
      </div>
    </div>

    <!-- Stats Cards -->
    <v-row class="mb-8">
      <v-col v-for="stat in recruitmentStats" :key="stat.label" cols="12" sm="6" md="3">
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

    <!-- Content Tabs & View Toggle -->
    <div class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-4">
      <div class="d-flex align-center gap-4">
        <div class="tab-container bg-surface pa-1 rounded-lg d-flex border-light">
          <v-btn 
            v-for="tab in ['Job Postings', 'Applicants']" 
            :key="tab"
            variant="flat" 
            :color="activeTab === tab ? 'primary' : 'transparent'"
            :class="{'active-tab elevation-1': activeTab === tab, 'text-grey-darken-1': activeTab !== tab}"
            rounded="lg"
            class="text-none font-weight-bold px-6"
            @click="activeTab = tab"
          >
            {{ tab }}
          </v-btn>
        </div>

        <!-- View Toggle for Applicants -->
        <div v-if="activeTab === 'Applicants'" class="bg-surface pa-1 rounded-lg d-flex border-light">
          <v-btn 
            icon="mdi-view-list" 
            variant="flat" 
            :color="applicantViewType === 'table' ? 'primary' : 'transparent'" 
            size="small"
            rounded="lg"
            class="elevation-0"
            :class="{'elevation-1': applicantViewType === 'table'}"
            @click="applicantViewType = 'table'"
          ></v-btn>
          <v-btn 
            icon="mdi-view-column" 
            variant="flat" 
            :color="applicantViewType === 'board' ? 'primary' : 'transparent'" 
            size="small"
            rounded="lg"
            class="elevation-0"
            :class="{'elevation-1': applicantViewType === 'board'}"
            @click="applicantViewType = 'board'"
          ></v-btn>
        </div>
      </div>
      
      <v-text-field
        v-model="search"
        placeholder="Search..."
        prepend-inner-icon="mdi-magnify"
        density="comfortable"
        variant="outlined"
        hide-details
        rounded="lg"
        class="bg-white search-box"
        style="max-width: 300px;"
      ></v-text-field>
    </div>

    <!-- Job Postings Table -->
    <v-card v-if="activeTab === 'Job Postings'" class="rounded-xl elevation-2 overflow-hidden border-light">
      <v-data-table
        :headers="jobHeaders"
        :items="jobs"
        :search="search"
        class="recruitment-table"
        hover
      >
        <template v-slot:item.position="{ item }">
          <div class="py-3">
            <div class="font-weight-bold text-grey-darken-4">{{ item.title }}</div>
            <div class="text-caption text-grey-darken-1">{{ item.department }}</div>
          </div>
        </template>

        <template v-slot:item.salaryRange="{ item }">
          <span class="text-grey-darken-3 font-weight-medium">{{ item.salaryRange }}</span>
        </template>

        <template v-slot:item.applicants="{ item }">
          <span class="font-weight-bold text-primary">{{ item.applicants }}</span>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip size="small" variant="tonal" class="font-weight-bold rounded" color="success">
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-select
            v-model="item.status"
            :items="['Open', 'Closed', 'Draft']"
            density="compact"
            variant="outlined"
            hide-details
            rounded="lg"
            class="status-select bg-white"
            style="width: 120px"
          ></v-select>
        </template>
      </v-data-table>
    </v-card>

    <!-- Applicants Content -->
    <template v-else>
      <!-- Table View -->
      <v-card v-if="applicantViewType === 'table'" class="rounded-xl elevation-2 overflow-hidden border-light">
        <v-data-table
          :headers="applicantHeaders"
          :items="applicants"
          :search="search"
          class="recruitment-table"
          hover
        >
          <template v-slot:item.name="{ item }">
            <div class="d-flex align-center py-3">
              <v-avatar color="primary-lighten-5" size="36" class="mr-3 text-primary font-weight-bold">
                {{ getInitials(item.name) }}
              </v-avatar>
              <span class="font-weight-medium text-grey-darken-3">{{ item.name }}</span>
            </div>
          </template>

          <template v-slot:item.stage="{ item }">
            <v-chip size="small" variant="tonal" class="font-weight-bold rounded" :color="getStageColor(item.stage)">
              {{ item.stage }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex align-center gap-2">
              <v-select
                v-model="item.stage"
                :items="recruitmentStages"
                density="compact"
                variant="outlined"
                hide-details
                rounded="lg"
                class="status-select bg-white"
                style="width: 140px"
              ></v-select>
              <v-btn icon="mdi-file-document-outline" variant="outlined" size="small" class="rounded-lg border-grey text-grey-darken-1"></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <!-- Board View -->
      <div v-else class="kanban-board-wrapper mt-4 custom-scrollbar pb-6">
        <div class="kanban-containers d-flex gap-4">
          <div 
            v-for="stage in recruitmentStages" 
            :key="stage" 
            class="kanban-column bg-background rounded-xl pa-3 transition-all border-light" 
            :class="{'column-highlight': dragTargetStage === stage}"
            style="min-width: 300px; width: 300px;"
            @dragover.prevent="dragTargetStage = stage"
            @dragleave="dragTargetStage = null"
            @drop="handleDrop(stage)"
          >
            <div class="d-flex align-center justify-space-between mb-4 px-2 pt-1 border-b-light pb-2">
              <div class="d-flex align-center">
                <div :class="`stage-dot bg-${getStageColor(stage)} mr-2`"></div>
                <span class="text-subtitle-2 font-weight-black text-on-surface">{{ stage }}</span>
              </div>
              <v-chip size="x-small" color="surface" class="font-weight-bold text-on-surface elevation-0 border-light px-2">
                {{ getApplicantsByStage(stage).length }}
              </v-chip>
            </div>
            
            <div class="kanban-items d-flex flex-column gap-3 h-100">
              <v-card 
                v-for="applicant in getApplicantsByStage(stage)" 
                :key="applicant.name" 
                class="rounded-xl pa-4 elevation-1 border-light hover-card"
                draggable="true"
                @dragstart="handleDragStart(applicant)"
                @dragend="handleDragEnd"
              >
                <div class="d-flex align-start justify-space-between mb-2">
                  <v-avatar :color="`${getStageColor(stage)}-lighten-5`" size="32" class="text-caption font-weight-bold" :class="`text-${getStageColor(stage)}`">
                    {{ getInitials(applicant.name) }}
                  </v-avatar>
                  <v-btn icon="mdi-dots-horizontal" variant="text" size="x-small" density="compact" class="text-grey-lighten-1"></v-btn>
                </div>
                
                <div class="text-subtitle-2 font-weight-bold text-on-surface mb-1">{{ applicant.name }}</div>
                <div class="text-caption text-on-surface opacity-70 mb-3 line-clamp-1">{{ applicant.position }}</div>
                
                <v-divider class="mb-3 border-light opacity-30"></v-divider>
                
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center text-caption text-on-surface opacity-60">
                    <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
                    Exp: {{ applicant.experience }}
                  </div>
                  <v-avatar size="20" class="border-light">
                    <v-img src="https://i.pravatar.cc/100"></v-img>
                  </v-avatar>
                </div>
              </v-card>
              
              <!-- Drop area filler -->
              <div v-if="getApplicantsByStage(stage).length === 0" class="flex-grow-1 d-flex flex-column justify-center align-center py-10 opacity-30 border-dashed rounded-xl">
                <v-icon color="on-surface">mdi-tray-arrow-down</v-icon>
                <span class="text-caption mt-2 text-on-surface">Drop here</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Add New Applicant Dialog -->
    <v-dialog v-model="addApplicantDialog" max-width="600px">
      <v-card class="rounded-xl overflow-hidden">
        <v-card-title class="d-flex align-center justify-space-between pa-6 pb-2">
          <span class="text-h6 font-weight-bold">Add New Applicant</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="addApplicantDialog = false"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0 custom-scrollbar" style="max-height: 70vh; overflow-y: auto;">
          <div class="mb-4">
            <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Job Position</label>
            <v-select
              placeholder="Select position"
              :items="['Full Stack Developer', 'Product Manager', 'UX Designer']"
              variant="outlined"
              hide-details
              rounded="lg"
            ></v-select>
          </div>

          <v-row class="mb-4">
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block">First Name</label>
              <v-text-field placeholder="First name" variant="outlined" hide-details rounded="lg"></v-text-field>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Last Name</label>
              <v-text-field placeholder="Last name" variant="outlined" hide-details rounded="lg"></v-text-field>
            </v-col>
          </v-row>

          <v-row class="mb-4">
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Email</label>
              <v-text-field placeholder="Email address" variant="outlined" hide-details rounded="lg"></v-text-field>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Phone</label>
              <v-text-field placeholder="Phone number" variant="outlined" hide-details rounded="lg"></v-text-field>
            </v-col>
          </v-row>

          <v-row class="mb-4">
            <v-col cols="4">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block text-truncate">Experience (years)</label>
              <v-text-field variant="outlined" hide-details rounded="lg" type="number"></v-text-field>
            </v-col>
            <v-col cols="4">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Current Salary</label>
              <v-text-field variant="outlined" hide-details rounded="lg"></v-text-field>
            </v-col>
            <v-col cols="4">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Expected Salary</label>
              <v-text-field variant="outlined" hide-details rounded="lg"></v-text-field>
            </v-col>
          </v-row>

          <div class="mb-2">
            <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Cover Letter</label>
            <v-textarea variant="outlined" hide-details rounded="lg" rows="4"></v-textarea>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded="lg" class="px-6 border-grey text-none" @click="addApplicantDialog = false">Cancel</v-btn>
          <v-btn color="primary" rounded="lg" class="px-6 text-none font-weight-bold shadow-primary ml-2" @click="saveApplicant">Add Applicant</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Job Posting Dialog -->
    <v-dialog v-model="postJobDialog" max-width="600px">
      <v-card class="rounded-xl overflow-hidden">
        <v-card-title class="d-flex align-center justify-space-between pa-6 pb-2">
          <span class="text-h6 font-weight-bold">Create Job Posting</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="postJobDialog = false"></v-btn>
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0 custom-scrollbar" style="max-height: 70vh; overflow-y: auto;">
          <div class="mb-4">
            <v-text-field placeholder="Job Title" variant="outlined" hide-details rounded="lg" class="font-weight-bold text-h6"></v-text-field>
          </div>

          <v-row class="mb-4">
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Department</label>
              <v-select
                placeholder="Select"
                :items="['Engineering', 'Marketing', 'Human Resources', 'Sales', 'Product']"
                variant="outlined"
                hide-details
                rounded="lg"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Employment Type</label>
              <v-select
                :items="['Full-time', 'Part-time', 'Contract', 'Temporary']"
                placeholder="Full-time"
                variant="outlined"
                hide-details
                rounded="lg"
              ></v-select>
            </v-col>
          </v-row>

          <div class="mb-4">
            <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Location</label>
            <v-text-field placeholder="e.g., New York, Remote" variant="outlined" hide-details rounded="lg"></v-text-field>
          </div>

          <v-row class="mb-4">
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Min Salary</label>
              <v-text-field variant="outlined" hide-details rounded="lg" prefix="$"></v-text-field>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Max Salary</label>
              <v-text-field variant="outlined" hide-details rounded="lg" prefix="$"></v-text-field>
            </v-col>
          </v-row>

          <div class="mb-4">
            <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Job Description</label>
            <v-textarea variant="outlined" hide-details rounded="lg" rows="4"></v-textarea>
          </div>

          <div class="mb-4">
            <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Requirements</label>
            <v-textarea variant="outlined" hide-details rounded="lg" rows="4"></v-textarea>
          </div>

          <v-row class="mb-2">
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block">Status</label>
              <v-select
                :items="['Draft', 'Open', 'Closed']"
                placeholder="Draft"
                variant="outlined"
                hide-details
                rounded="lg"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block text-on-surface">Closing Date</label>
              <v-menu v-model="closingDateMenu" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="jobForm.closingDate"
                    placeholder="YYYY-MM-DD"
                    variant="outlined"
                    hide-details
                    rounded="lg"
                    readonly
                    prepend-inner-icon="mdi-calendar"
                  ></v-text-field>
                </template>
                <v-date-picker
                  @update:model-value="(val) => { jobForm.closingDate = val.toISOString().split('T')[0]; closingDateMenu = false }"
                  color="primary"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded="lg" class="px-6 border-grey text-none" @click="postJobDialog = false">Cancel</v-btn>
          <v-btn color="primary" rounded="lg" class="px-6 text-none font-weight-bold shadow-primary ml-2" @click="saveJob">Create Job</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('Job Postings')
const applicantViewType = ref('board')
const search = ref('')
const addApplicantDialog = ref(false)
const postJobDialog = ref(false)
const draggedApplicant = ref(null)
const dragTargetStage = ref(null)
const closingDateMenu = ref(false)

const jobForm = ref({
  title: '',
  department: '',
  type: 'Full-time',
  location: '',
  minSalary: '',
  maxSalary: '',
  description: '',
  requirements: '',
  status: 'Draft',
  closingDate: ''
})

const recruitmentStages = ['Sourced', 'Screening', 'Interview', 'Offer', 'Onboarding', 'Rejected']

const recruitmentStats = [
  { label: 'Open Jobs', value: '2', icon: 'mdi-briefcase-variant-outline', color: 'indigo' },
  { label: 'Total Applicants', value: '3', icon: 'mdi-account-group-outline', color: 'primary' },
  { label: 'Interviews', value: '1', icon: 'mdi-calendar-check-outline', color: 'warning' },
  { label: 'Hired', value: '0', icon: 'mdi-account-check-outline', color: 'success' },
]

const jobs = ref([
  { title: 'Full Stack Developer', department: 'Engineering', type: 'Full-time', location: 'New York / Remote', salaryRange: '$85,000 - $120,000', applicants: 12, status: 'Open' },
  { title: 'Product Manager', department: 'Marketing', type: 'Full-time', location: 'San Francisco', salaryRange: '$100,000 - $140,000', applicants: 8, status: 'Open' },
])

const applicants = ref([
  { name: 'John Doe', position: 'Full Stack Developer', experience: '5 years', stage: 'Interview', email: 'john@example.com' },
  { name: 'Jane Smith', position: 'Product Manager', experience: '3 years', stage: 'Screening', email: 'jane@example.com' },
  { name: 'Alex Johnson', position: 'Full Stack Developer', experience: '8 years', stage: 'Sourced', email: 'alex@example.com' },
])

const jobHeaders = [
  { title: 'Position', key: 'position' },
  { title: 'Type', key: 'type' },
  { title: 'Location', key: 'location' },
  { title: 'Salary Range', key: 'salaryRange' },
  { title: 'Applicants', key: 'applicants', align: 'center' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const applicantHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Applied Position', key: 'position' },
  { title: 'Experience', key: 'experience' },
  { title: 'Stage', key: 'stage' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getStageColor = (stage) => {
  const colors = {
    'Sourced': 'grey',
    'Screening': 'info',
    'Interview': 'warning',
    'Offer': 'primary',
    'Onboarding': 'success',
    'Rejected': 'error'
  }
  return colors[stage] || 'grey'
}

const getApplicantsByStage = (stage) => {
  return applicants.value.filter(a => a.stage === stage)
}

const handleDragStart = (applicant) => {
  draggedApplicant.value = applicant
}

const handleDragEnd = () => {
  dragTargetStage.value = null
}

const handleDrop = (stage) => {
  if (draggedApplicant.value) {
    draggedApplicant.value.stage = stage
    draggedApplicant.value = null
    dragTargetStage.value = null
  }
}

const saveApplicant = () => {
  addApplicantDialog.value = false
}

const saveJob = () => {
  postJobDialog.value = false
}
</script>

<style scoped>
.gap-4 { gap: 16px; }
.gap-2 { gap: 8px; }

.bg-indigo-lighten-5-flat { background-color: #f5f7ff !important; }
.bg-deep-purple-lighten-5-flat { background-color: #f8f5ff !important; }
.bg-amber-lighten-5-flat { background-color: #fffaf0 !important; }
.bg-success-lighten-5-flat { background-color: #f0fff4 !important; }

.border-light { border: 1px solid rgba(0, 0, 0, 0.05) !important; }
.border-grey { border: 1px solid #e2e8f0 !important; }

.tab-container { width: fit-content; }
.active-tab { color: var(--v-theme-primary) !important; }

.recruitment-table :deep(th) {
  color: #64748b !important;
  font-weight: 600 !important;
  border-bottom: 1px solid #f1f5f9;
  text-transform: none !important;
}

.status-select :deep(.v-field__outline) {
  --v-field-border-opacity: 0.1;
}

.shadow-primary {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3) !important;
}

.kanban-board-wrapper {
  overflow-x: auto;
  min-height: 500px;
}

.kanban-containers {
  height: 100%;
}

.kanban-column {
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.column-highlight {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
  border: 2px dashed rgb(var(--v-theme-primary)) !important;
  transform: scale(1.01);
}

.stage-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.hover-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.border-dashed {
  border: 2px dashed var(--v-border-color) !important;
  background: transparent !important;
}
</style>
