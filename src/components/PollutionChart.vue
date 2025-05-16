<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface PollutantsData {
  pm25: string | number
  pm10?: string | number
  co?: string | number
  no2?: string | number
  so2?: string | number
  o3?: string | number
}

const props = defineProps<{
  pollutants: PollutantsData
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const createChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  // Уничтожаем предыдущий график, если он существует
  if (chart) {
    chart.destroy()
  }

  // Преобразуем строковые значения в числа
  const data = {
    pm25: Number(props.pollutants.pm25),
    pm10: Number(props.pollutants.pm10 || 0),
    co: Number(props.pollutants.co || 0),
    no2: Number(props.pollutants.no2 || 0),
    so2: Number(props.pollutants.so2 || 0),
    o3: Number(props.pollutants.o3 || 0),
  }

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['PM2.5', 'PM10', 'CO', 'NO₂', 'SO₂', 'O₃'],
      datasets: [
        {
          label: 'Havo ifloslanishi',
          data: [data.pm25, data.pm10, data.co, data.no2, data.so2, data.o3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Havo ifloslanishi ko'rsatkichlari",
          font: {
            size: 16,
          },
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
      },
    },
  })
}

// Обновляем график при изменении данных
watch(() => props.pollutants, createChart, { deep: true })

onMounted(() => {
  createChart()
})
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow-md">
    <div class="h-80">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>
