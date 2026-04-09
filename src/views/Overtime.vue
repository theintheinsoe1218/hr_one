<template>
  <div class="overtime-page">
    <!-- Header -->
    <div
      class="d-flex flex-column flex-sm-row align-sm-center justify-sm-space-between mb-6 gap-4"
    >
      <div>
        <h1 class="text-h5 text-md-h4 font-weight-bold text-grey-darken-4 mb-1">
          Overtime Management
        </h1>
        <div class="text-caption text-md-subtitle-1 text-grey-darken-1">
          Track and approve overtime requests
        </div>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        size="large"
        class="font-weight-bold px-6 text-none shadow-primary"
        @click="dialog = true"
      >
        Log Overtime
      </v-btn>
    </div>

    <v-row class="mb-6">
      <v-col v-for="stat in otStats" :key="stat.label" cols="12" sm="4">
        <v-card
          class="rounded-xl pa-4 elevation-1 border-light"
          :class="`bg-${stat.color}-lighten-5`"
        >
          <div
            class="text-subtitle-2 font-weight-bold mb-1"
            :class="`text-${stat.color}`"
          >
            {{ stat.label }}
          </div>
          <div class="text-h4 font-weight-bold text-on-surface">
            {{ stat.value }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filter & Table -->
    <v-card class="rounded-xl elevation-2 pa-6">
      <div
        class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-6 gap-4"
      >
        <v-btn-toggle
          v-model="statusFilter"
          mandatory
          color="primary"
          density="compact"
          rounded="lg"
          class="overflow-x-auto"
        >
          <v-btn value="all" class="text-none px-4">All</v-btn>
          <v-btn value="Pending" class="text-none px-4">Pending</v-btn>
          <v-btn value="Approved" class="text-none px-4">Approved</v-btn>
          <v-btn value="Rejected" class="text-none px-4">Rejected</v-btn>
        </v-btn-toggle>

        <v-text-field
          v-model="search"
          density="comfortable"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search..."
          hide-details
          color="primary"
          class="border-light rounded-lg search-field border-light"
          style="max-width: 300px"
        ></v-text-field>
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredLogs"
        :search="search"
        class="attendance-table elevation-0"
        hover
      >
        <template v-slot:item.employee="{ item }">
          <div class="d-flex align-center py-3">
            <v-avatar
              color="primary-lighten-5"
              size="36"
              class="mr-3 text-primary font-weight-bold border-light"
            >
              {{ getInitials(item.employee) }}
            </v-avatar>
            <span class="font-weight-medium text-on-surface">{{
              item.employee
            }}</span>
          </div>
        </template>

        <template v-slot:item.hours="{ item }">
          <span class="font-weight-bold">{{ item.hours }}h</span>
        </template>

        <template v-slot:item.rate="{ item }">
          <span class="text-primary font-weight-bold">{{ item.rate }}</span>
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

        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-2" v-if="item.status === 'Pending'">
            <v-btn
              icon="mdi-check"
              variant="outlined"
              size="x-small"
              color="success"
              class="rounded-lg"
              @click="updateStatus(item, 'Approved')"
            ></v-btn>
            <v-btn
              icon="mdi-close"
              variant="outlined"
              size="x-small"
              color="error"
              class="rounded-lg"
              @click="updateStatus(item, 'Rejected')"
            ></v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Log Overtime Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="rounded-xl">
        <v-card-title
          class="d-flex align-center justify-space-between pa-6 pb-2"
        >
          <span class="text-h5 font-weight-bold">Log Overtime</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            density="comfortable"
            @click="dialog = false"
          ></v-btn>
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <div class="mb-5">
            <label class="text-subtitle-2 font-weight-bold mb-1 d-block"
              >Employee</label
            >
            <v-select
              placeholder="Select employee"
              :items="employees"
              variant="outlined"
              hide-details
              rounded="lg"
              color="primary"
            ></v-select>
          </div>

          <div class="mb-5">
            <label
              class="text-subtitle-2 font-weight-bold text-on-surface mb-1 d-block"
              >Date</label
            >
            <v-menu v-model="dateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  v-model="form.date"
                  placeholder="YYYY-MM-DD"
                  variant="outlined"
                  hide-details
                  rounded="lg"
                  color="primary"
                  readonly
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker
                @update:model-value="
                  (val) => {
                    form.date = val.toISOString().split('T')[0];
                    dateMenu = false;
                  }
                "
                color="primary"
              ></v-date-picker>
            </v-menu>
          </div>

          <v-row class="mb-5">
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block"
                >Hours</label
              >
              <v-text-field
                placeholder="0"
                variant="outlined"
                hide-details
                rounded="lg"
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <label class="text-subtitle-2 font-weight-bold mb-1 d-block"
                >Rate Multiplier</label
              >
              <v-select
                :items="['1.5x (Regular OT)', '2.0x (Holiday/Weekend)']"
                placeholder="Select rate"
                variant="outlined"
                hide-details
                rounded="lg"
                color="primary"
              ></v-select>
            </v-col>
          </v-row>

          <div>
            <label class="text-subtitle-2 font-weight-bold mb-1 d-block"
              >Reason</label
            >
            <v-textarea
              placeholder="Reason for overtime work"
              variant="outlined"
              hide-details
              rounded="lg"
              color="primary"
              rows="3"
            ></v-textarea>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            rounded="lg"
            class="px-6 border-grey text-none"
            @click="dialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            rounded="lg"
            class="px-6 text-none font-weight-bold ml-3 shadow-primary"
            @click="dialog = false"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const dialog = ref(false);
const search = ref("");
const statusFilter = ref("all");
const dateMenu = ref(false);

const form = ref({
  employee: "",
  date: new Date().toISOString().split("T")[0],
  hours: "",
  rate: "1.5x (Regular OT)",
  reason: "",
});

const employees = [
  "James Wilson",
  "Sarah Johnson",
  "Michael Chen",
  "Thein Thein",
];

const logs = ref([
  {
    id: 1,
    employee: "James Wilson",
    date: "Jan 17, 2025",
    hours: 3,
    rate: "1.5x",
    reason: "Quarter-end financial reporting",
    status: "Approved",
  },
  {
    id: 2,
    employee: "Sarah Johnson",
    date: "Jan 18, 2025",
    hours: 4,
    rate: "1.5x",
    reason: "Product launch deadline",
    status: "Pending",
  },
  {
    id: 3,
    employee: "Michael Chen",
    date: "Jan 15, 2025",
    hours: 2,
    rate: "2.0x",
    reason: "System emergency maintenance",
    status: "Rejected",
  },
]);

const headers = [
  { title: "Employee", key: "employee" },
  { title: "Date", key: "date" },
  { title: "Hours", key: "hours" },
  { title: "Rate", key: "rate" },
  { title: "Reason", key: "reason" },
  { title: "Status", key: "status", align: "center" },
  { title: "Actions", key: "actions", align: "end", sortable: false },
];

const filteredLogs = computed(() => {
  if (statusFilter.value === "all") return logs.value;
  return logs.value.filter((l) => l.status === statusFilter.value);
});

const otStats = computed(() => {
  const pending = logs.value.filter((l) => l.status === "Pending").length;
  const approved = logs.value.filter((l) => l.status === "Approved").length;
  const totalHours = logs.value
    .filter((l) => l.status === "Approved")
    .reduce((acc, curr) => acc + curr.hours, 0);

  return [
    {
      label: "Pending Requests",
      value: pending,
      color: "warning",
      bgColor: "warning-lighten-5",
    },
    {
      label: "Approved",
      value: approved,
      color: "success",
      bgColor: "success-lighten-5",
    },
    {
      label: "Total OT Hours",
      value: `${totalHours}h`,
      color: "primary",
      bgColor: "primary-lighten-5",
    },
  ];
});

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const getStatusColor = (status) => {
  if (status === "Approved") return "success";
  if (status === "Pending") return "warning";
  if (status === "Rejected") return "error";
  return "grey";
};

const updateStatus = (item, status) => {
  item.status = status;
};
</script>

<style scoped>
.border-stat {
  transition: all 0.3s ease;
}

.border-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

.gap-4 {
  gap: 16px;
}
.gap-2 {
  gap: 8px;
}

.attendance-table :deep(th) {
  text-transform: none !important;
  font-size: 0.875rem !important;
}

.search-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08) !important;
}

.shadow-primary {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3) !important;
}
</style>
