<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface Props {
  data: {
    pm25: number[]
    pm10: number[]
    co: number[]
    no2: number[]
    so2: number[]
    o3: number[]
  }
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const months = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
]

const createChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  if (chart) {
    chart.destroy()
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'PM2.5',
          data: props.data.pm25,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4,
        },
        {
          label: 'PM10',
          data: props.data.pm10,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4,
        },
        {
          label: 'CO',
          data: props.data.co,
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          tension: 0.4,
        },
        {
          label: 'NO₂',
          data: props.data.no2,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
        },
        {
          label: 'SO₂',
          data: props.data.so2,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.4,
        },
        {
          label: 'O₃',
          data: props.data.o3,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Yillik havo ifloslanishi dinamikasi',
          font: {
            size: 16,
          },
        },
        legend: {
          position: 'top',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Qiymat',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Oylar',
          },
        },
      },
    },
  })
}

watch(() => props.data, createChart, { deep: true })

onMounted(() => {
  createChart()
})
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow-md">
    <div v-if="loading" class="h-96 flex items-center justify-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
      ></div>
      <p class="ml-2 text-gray-600">Ma'lumotlar yuklanmoqda...</p>
    </div>
    <div v-else class="h-96">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>
