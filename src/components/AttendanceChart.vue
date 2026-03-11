<template>
  <div class="pa-4 bg-white rounded-lg elevation-1 wrapper">
    <Typography variant="h6" class="mb-4">Attendance Trends</Typography>
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  }
})

const chartData = computed(() => {
  return {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Present',
        backgroundColor: '#22c55e',
        data: [42, 45, 41, 46, 39]
      },
      {
        label: 'Absent',
        backgroundColor: '#ef4444',
        data: [2, 1, 3, 0, 5]
      },
      {
        label: 'Late',
        backgroundColor: '#f59e0b',
        data: [4, 2, 4, 2, 4]
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
    }
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      beginAtZero: true
    }
  }
}
</script>

<style scoped>
.chart-container {
  height: 300px;
  position: relative;
}
.wrapper {
  height: 100%;
}
</style>
