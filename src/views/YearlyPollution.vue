<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
Chart.register(...registerables)

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const selectedYear = ref(2025)
const years = ref([2025, 2024, 2023, 2022, 2021])
const selectedLocation = ref<L.LatLng | null>(null)
const marker = ref<L.Marker | null>(null)

const isLoading = ref(false)

const tashkentCoordinates: L.LatLngExpression = [41.2995, 69.2401]

type SubstanceType = 'PM25' | 'PM10' | 'CO' | 'NO2' | 'SO2' | 'O3'

interface Substance {
  name: string
  unit: string
  color: string
  range: {
    min: number
    max: number
  }
}

interface YearlyData {
  [key: number]: {
    [key in SubstanceType]: number[]
  }
}

const substances: Record<SubstanceType, Substance> = {
  PM25: {
    name: 'PM2.5',
    unit: 'µg/m³',
    color: 'rgb(255, 99, 132)',
    range: { min: 4, max: 8 },
  },
  PM10: {
    name: 'PM10',
    unit: 'µg/m³',
    color: 'rgb(54, 162, 235)',
    range: { min: 10, max: 15 },
  },
  CO: {
    name: 'CO',
    unit: 'mg/m³',
    color: 'rgb(75, 192, 192)',
    range: { min: 100, max: 150 },
  },
  NO2: {
    name: 'NO₂',
    unit: 'mg/m³',
    color: 'rgb(153, 102, 255)',
    range: { min: 1, max: 2 },
  },
  SO2: {
    name: 'SO₂',
    unit: 'mg/m³',
    color: 'rgb(255, 159, 64)',
    range: { min: 0.4, max: 0.8 },
  },
  O3: {
    name: 'O₃',
    unit: 'mg/m³',
    color: 'rgb(205, 220, 57)',
    range: { min: 60, max: 80 },
  },
}

const generateRandomData = (min: number, max: number): number => {
  return Number((Math.random() * (max - min) + min).toFixed(2))
}

const generateSubstanceData = (min: number, max: number): number[] => {
  return Array(12)
    .fill(0)
    .map(() => generateRandomData(min, max))
}

// @ts-ignore
const yearlyData: YearlyData = Object.fromEntries(
  years.value.map((year) => [
    year,
    Object.fromEntries(
      Object.entries(substances).map(([key, substance]) => [
        key,
        generateSubstanceData(substance.range.min, substance.range.max),
      ]),
    ),
  ]),
)

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

const updateLocation = (latlng: L.LatLng) => {
  isLoading.value = true
  selectedLocation.value = latlng

  if (marker.value) {
    marker.value.setLatLng(latlng)
  } else if (map.value) {
    marker.value = L.marker(latlng)
      .addTo(map.value as L.Map)
      .bindPopup(`Широта: ${latlng.lat.toFixed(4)}, Долгота: ${latlng.lng.toFixed(4)}`)
  }

  setTimeout(() => {
    Object.keys(yearlyData).forEach((year) => {
      const yearNum = parseInt(year)
      // @ts-ignore
      yearlyData[yearNum] = Object.fromEntries(
        Object.entries(substances).map(([key, substance]) => [
          key,
          generateSubstanceData(substance.range.min, substance.range.max),
        ]),
      )
    })

    Object.keys(substances).forEach((substance) => {
      const canvas = chartRefs.value[substance as SubstanceType]
      if (canvas && canvas.getContext('2d')) {
        createChart(canvas, substance as SubstanceType)
      }
    })

    isLoading.value = false
  }, 1000)
}

const chartRefs = ref<{ [key in SubstanceType]?: HTMLCanvasElement | null }>({})
const charts = ref<{ [key: string]: Chart | null }>({})

const createChart = (canvas: HTMLCanvasElement, substance: SubstanceType) => {
  if (charts.value[substance]) {
    charts.value[substance]?.destroy()
  }

  const data = yearlyData[selectedYear.value][substance]
  charts.value[substance] = new Chart(canvas, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: `${substances[substance].name} (${substances[substance].unit})`,
          data: data,
          borderColor: substances[substance].color,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `${selectedYear.value} yil bo‘yicha oylik ${substances[substance].name} ko‘rsatkichlari`,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  })
}

onMounted(async () => {
  await nextTick()

  if (mapContainer.value) {
    map.value = L.map(mapContainer.value).setView(tashkentCoordinates, 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map.value as L.Map)

    marker.value = L.marker(tashkentCoordinates as L.LatLngTuple)
      .addTo(map.value as L.Map)
      .bindPopup('Ташкент')
      .openPopup()

    selectedLocation.value = L.latLng(tashkentCoordinates[0], tashkentCoordinates[1])

    map.value.on('click', (e: L.LeafletMouseEvent) => {
      updateLocation(e.latlng)
    })
  }

  Object.keys(substances).forEach((substance) => {
    const canvas = chartRefs.value[substance as SubstanceType]
    if (canvas && canvas.getContext('2d')) {
      createChart(canvas, substance as SubstanceType)
    }
  })
})

watch(selectedYear, async () => {
  await nextTick()
  isLoading.value = true

  setTimeout(() => {
    const yearData = Object.fromEntries(
      Object.entries(substances).map(([key, substance]) => [
        key,
        generateSubstanceData(substance.range.min, substance.range.max),
      ]),
    )

    // @ts-ignore
    yearlyData[selectedYear.value] = yearData

    Object.keys(substances).forEach((substance) => {
      const canvas = chartRefs.value[substance as SubstanceType]
      if (canvas && canvas.getContext('2d')) {
        createChart(canvas, substance as SubstanceType)
      }
    })

    isLoading.value = false
  }, 1000)
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Zaharli moddalarni tarqalish ko‘rsatkichlari</h1>

    <div class="grid grid-cols-1 gap-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="mb-4">
          <h2 class="text-lg font-semibold mb-2">Xaritadagi joyni tanlang</h2>
          <p class="text-sm text-gray-600 mb-2">
            Joriy koordinatalar:
            <span v-if="selectedLocation">
              {{ selectedLocation.lat.toFixed(4) }}°, {{ selectedLocation.lng.toFixed(4) }}°
            </span>
          </p>
        </div>
        <div ref="mapContainer" class="h-[600px] w-full"></div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Yilni tanlang:</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="year in years"
              :key="year"
              @click="selectedYear = year"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                selectedYear === year
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
              ]"
            >
              {{ year }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(substance, key) in substances"
          :key="key"
          class="bg-white p-4 rounded-lg shadow relative flex justify-center"
        >
          <div
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10"
          >
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <!-- @vue-ignore -->
          <canvas
            :ref="(el) => (chartRefs[key] = el)"
            class="h-[150px] md:h-[300px] w-1/2"
          ></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
canvas {
  min-height: 150px;
}
</style>
