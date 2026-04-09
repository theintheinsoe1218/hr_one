<template>
  <div class="attendance-page">
    <div
      class="d-flex flex-column flex-sm-row align-sm-center justify-sm-space-between mb-6 gap-4"
    >
      <div>
        <h1 class="text-h5 text-md-h4 font-weight-bold text-grey-darken-4 mb-1">
          Attendance
        </h1>
        <div class="text-caption text-md-subtitle-1 text-grey-darken-1">
          Track daily employee attendance
        </div>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        rounded="lg"
        size="large"
        class="font-weight-bold px-6 text-none"
        @click="dialog = true"
      >
        Mark Attendance
      </v-btn>
    </div>

    <v-row class="mb-6">
      <v-col
        v-for="stat in attendanceStats"
        :key="stat.label"
        cols="12"
        sm="6"
        md="3"
      >
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

    <!-- Calendar Stripe Card -->
    <v-card class="rounded-xl elevation-2 pa-6 mb-6">
      <div class="d-flex align-center justify-center mb-6">
        <v-btn
          icon="mdi-chevron-left"
          variant="outlined"
          density="comfortable"
          class="rounded-lg mr-4 border-grey"
          @click="changeWeek(-1)"
        ></v-btn>
        <span class="text-h6 font-weight-bold text-on-surface">{{
          weekRangeText
        }}</span>
        <v-btn
          icon="mdi-chevron-right"
          variant="outlined"
          density="comfortable"
          class="rounded-lg ml-4 border-grey"
          @click="changeWeek(1)"
        ></v-btn>
      </div>

      <div class="d-flex justify-space-between overflow-x-auto pb-2 gap-2">
        <div
          v-for="day in currentWeekDays"
          :key="day.fullDate"
          class="day-card flex-grow-1 d-flex flex-column align-center justify-center pa-4 rounded-xl cursor-pointer transition-all"
          :class="
            selectedDate === day.fullDate
              ? 'bg-primary text-white shadow-item active-day'
              : 'bg-grey-lighten-4 text-grey-darken-1'
          "
          @click="selectedDate = day.fullDate"
        >
          <div class="text-caption font-weight-bold">{{ day.name }}</div>
          <div class="text-h6 font-weight-bold">{{ day.date }}</div>
        </div>
      </div>
    </v-card>

    <!-- Search & Table -->
    <v-card class="rounded-xl elevation-2 pa-6">
      <v-text-field
        v-model="search"
        density="comfortable"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search by employee name..."
        hide-details
        color="primary"
        class="rounded-lg search-field w-100 mb-6 bg-surface"
      ></v-text-field>

      <v-data-table
        :headers="headers"
        :items="filteredRecords"
        :search="search"
        class="attendance-table elevation-0"
        hover
      >
        <template v-slot:item.employee="{ item }">
          <div class="d-flex align-center py-3">
            <v-avatar
              color="primary-lighten-5"
              size="40"
              class="mr-3 text-primary font-weight-bold border-light"
            >
              {{ getInitials(item.employee) }}
            </v-avatar>
            <span class="font-weight-bold text-on-surface">{{
              item.employee
            }}</span>
          </div>
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
          <v-select
            v-model="item.status"
            :items="['Present', 'Absent', 'Late', 'On Leave']"
            density="compact"
            variant="outlined"
            hide-details
            rounded="lg"
            class="status-select bg-white"
            style="width: 140px"
          ></v-select>
        </template>
      </v-data-table>
    </v-card>

    <!-- Mark Attendance Dialog -->
    <v-dialog v-model="dialog" max-width="500px" scrollable>
      <v-card class="rounded-xl d-flex flex-column" style="max-height: 90vh">
        <v-card-title
          class="d-flex align-center justify-space-between pa-5 flex-shrink-0"
        >
          <span class="text-h6 font-weight-bold text-on-surface"
            >Mark Attendance</span
          >
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="dialog = false"
          ></v-btn>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text class="pa-5 overflow-y-auto flex-grow-1">
          <!-- Employee -->
          <div class="mb-4">
            <label
              class="text-subtitle-2 font-weight-bold mb-2 d-block text-on-surface"
              >Employee</label
            >
            <v-select
              v-model="attendanceForm.employee"
              placeholder="Select employee"
              :items="[
                'Thein Thein',
                'Emily Rodriguez',
                'Michael Chen',
                'Lisa Thompson',
                'Sarah Johnson',
              ]"
              variant="outlined"
              hide-details
              rounded="lg"
              prepend-inner-icon="mdi-account-outline"
            ></v-select>
          </div>

          <!-- Date Picker -->
          <div class="mb-4">
            <label
              class="text-subtitle-2 font-weight-bold mb-2 d-block text-on-surface"
              >Date</label
            >
            <v-menu v-model="dateMenu" :close-on-content-click="false" offset-y>
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  :model-value="attendanceForm.date"
                  variant="outlined"
                  hide-details
                  rounded="lg"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  placeholder="Select date"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="datePicker"
                @update:model-value="onDatePick"
                color="primary"
                show-adjacent-months
              ></v-date-picker>
            </v-menu>
          </div>

          <!-- Clock In & Clock Out -->
          <v-row class="mb-4">
            <v-col cols="6">
              <label
                class="text-subtitle-2 font-weight-bold mb-2 d-block text-on-surface"
                >Clock In</label
              >
              <v-menu v-model="clockInMenu" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="attendanceForm.clockIn"
                    variant="outlined"
                    hide-details
                    rounded="lg"
                    prepend-inner-icon="mdi-clock-outline"
                    placeholder="--:--"
                    readonly
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-model="attendanceForm.clockIn"
                  format="24hr"
                  color="primary"
                  @update:model-value="clockInMenu = false"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="6">
              <label
                class="text-subtitle-2 font-weight-bold mb-2 d-block text-on-surface"
                >Clock Out</label
              >
              <v-menu v-model="clockOutMenu" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="attendanceForm.clockOut"
                    variant="outlined"
                    hide-details
                    rounded="lg"
                    prepend-inner-icon="mdi-clock-outline"
                    placeholder="--:--"
                    readonly
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-model="attendanceForm.clockOut"
                  format="24hr"
                  color="primary"
                  @update:model-value="clockOutMenu = false"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>

          <!-- Status -->
          <div class="mb-4">
            <label
              class="text-subtitle-2 font-weight-bold mb-2 d-block text-on-surface"
              >Status</label
            >
            <v-select
              v-model="attendanceForm.status"
              :items="['Present', 'Absent', 'Late', 'On Leave']"
              variant="outlined"
              hide-details
              rounded="lg"
              prepend-inner-icon="mdi-check-circle-outline"
            ></v-select>
          </div>

          <!-- Notes -->
          <div class="mb-2">
            <label
              class="text-subtitle-2 font-weight-bold mb-2 d-block text-on-surface"
              >Notes</label
            >
            <v-textarea
              v-model="attendanceForm.notes"
              placeholder="Optional notes"
              variant="outlined"
              hide-details
              rounded="lg"
              rows="2"
              no-resize
            ></v-textarea>
          </div>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="pa-5 flex-shrink-0">
          <v-spacer></v-spacer>
          <v-btn
            variant="outlined"
            rounded="lg"
            class="px-6 text-none"
            @click="dialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            rounded="lg"
            class="px-6 text-none font-weight-bold ml-2"
            @click="saveAttendance"
            >Save Attendance</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const today = new Date();
const toISODate = (d) => d.toISOString().split("T")[0];

const dialog = ref(false);
const search = ref("");
const selectedDate = ref(toISODate(today));
const baseDate = ref(today);

const attendanceForm = ref({
  employee: "",
  date: toISODate(today),
  clockIn: "",
  clockOut: "",
  status: "Present",
  notes: "",
});

const dateMenu = ref(false);
const clockInMenu = ref(false);
const clockOutMenu = ref(false);
const datePicker = ref(new Date());

const onDatePick = (val) => {
  // val is a Date object from v-date-picker
  attendanceForm.value.date = toISODate(val);
  dateMenu.value = false;
};

const saveAttendance = () => {
  if (!attendanceForm.value.employee) return;
  const calcHours = () => {
    if (!attendanceForm.value.clockIn || !attendanceForm.value.clockOut)
      return "-";
    const [ih, im] = attendanceForm.value.clockIn.split(":").map(Number);
    const [oh, om] = attendanceForm.value.clockOut.split(":").map(Number);
    const diff = oh * 60 + om - (ih * 60 + im);
    if (diff <= 0) return "-";
    return `${Math.floor(diff / 60)}h${diff % 60 ? " " + (diff % 60) + "m" : ""}`;
  };
  allAttendanceRecords.value.push({
    employee: attendanceForm.value.employee,
    clockIn: attendanceForm.value.clockIn || "--:--",
    clockOut: attendanceForm.value.clockOut || "--:--",
    workHours: calcHours(),
    status: attendanceForm.value.status,
    date: attendanceForm.value.date,
  });
  dialog.value = false;
};

// MOCK DATA with dates
const allAttendanceRecords = ref([
  {
    employee: "Thein Thein",
    clockIn: "09:00",
    clockOut: "17:00",
    workHours: "8h",
    status: "Present",
    date: "2026-03-11",
  },
  {
    employee: "Emily Rodriguez",
    clockIn: "09:15",
    clockOut: "17:30",
    workHours: "8h 15m",
    status: "Late",
    date: "2026-03-11",
  },
  {
    employee: "Michael Chen",
    clockIn: "--:--",
    clockOut: "--:--",
    workHours: "-",
    status: "Absent",
    date: "2026-03-11",
  },
  {
    employee: "Lisa Thompson",
    clockIn: "08:45",
    clockOut: "16:50",
    workHours: "8h 5m",
    status: "Present",
    date: "2026-03-10",
  },
  {
    employee: "Thein Thein",
    clockIn: "08:52",
    clockOut: "17:05",
    workHours: "8h 13m",
    status: "Present",
    date: "2026-03-10",
  },
]);

const filteredRecords = computed(() => {
  return allAttendanceRecords.value.filter(
    (r) => r.date === selectedDate.value,
  );
});

const attendanceStats = computed(() => {
  const records = filteredRecords.value;
  return [
    {
      label: "Present",
      value: records.filter((r) => r.status === "Present").length,
      bgColor: "success-lighten-5",
      color: "success",
    },
    {
      label: "Absent",
      value: records.filter((r) => r.status === "Absent").length,
      bgColor: "error-lighten-5",
      color: "error",
    },
    {
      label: "Late",
      value: records.filter((r) => r.status === "Late").length,
      bgColor: "warning-lighten-5",
      color: "warning",
    },
    {
      label: "On Leave",
      value: records.filter((r) => r.status === "On Leave").length,
      bgColor: "primary-lighten-5",
      color: "primary",
    },
  ];
});

const weekRangeText = computed(() => {
  const start = getStartOfWeek(baseDate.value);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const options = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", { ...options, year: "numeric" })}`;
});

const currentWeekDays = computed(() => {
  const start = getStartOfWeek(baseDate.value);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      name: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
      fullDate: d.toISOString().split("T")[0],
    };
  });
});

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // ISO week starts on Monday
  return new Date(d.setDate(diff));
}

function changeWeek(direction) {
  const newDate = new Date(baseDate.value);
  newDate.setDate(newDate.getDate() + direction * 7);
  baseDate.value = newDate;
}

const headers = [
  { title: "Employee", align: "start", key: "employee", sortable: true },
  { title: "Clock In", align: "start", key: "clockIn" },
  { title: "Clock Out", align: "start", key: "clockOut" },
  { title: "Work Hours", align: "start", key: "workHours" },
  { title: "Status", align: "start", key: "status" },
  { title: "Actions", align: "start", key: "actions", sortable: false },
];

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const getStatusColor = (status) => {
  switch (status) {
    case "Present":
      return "success";
    case "Late":
      return "warning";
    case "Absent":
      return "error";
    case "On Leave":
      return "primary";
    default:
      return "grey";
  }
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

.day-card {
  min-width: 80px;
  transition: transform 0.2s;
}
.day-card:hover:not(.active-day) {
  background-color: rgba(var(--v-theme-on-surface), 0.05) !important;
  transform: translateY(-2px);
}

.active-day {
  transform: scale(1.05);
}

.attendance-table :deep(th) {
  text-transform: none !important;
  font-size: 0.875rem !important;
}

.status-select :deep(.v-field__outline) {
  --v-field-border-opacity: 0.1;
}

.search-field :deep(.v-field__outline) {
  --v-field-border-opacity: 0;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08) !important;
}

.shadow-item {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3) !important;
}

.gap-4 {
  gap: 16px;
}
.gap-2 {
  gap: 8px;
}
</style>
