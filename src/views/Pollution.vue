<script setup lang="ts">
import InfoPanel from '@/components/InfoPanel.vue'
import PollutionMap from '@/components/PollutionMap.vue'
import PollutionChart from '@/components/PollutionChart.vue'
import useGeoData from '@/composables/useGeoData'
import { ref, onMounted } from 'vue'

interface WindData {
  speed: number
  direction: number
}

interface MainData {
  temp: number
  pressure: number
  humidity: number
}

interface PollutantsData {
  pm25: string | number
  pm10?: string | number
  co?: string | number
  no2?: string | number
  so2?: string | number
  o3?: string | number
}

const location = ref('')
const wind = ref<WindData>({ speed: 0, direction: 0 })
const main = ref<MainData>({
  temp: 0,
  pressure: 0,
  humidity: 0,
})
const pollutants = ref<PollutantsData>({
  pm25: '...',
  pm10: '...',
  co: '...',
  no2: '...',
  so2: '...',
  o3: '...',
})
const loading = ref(true)
const error = ref<string | null>(null)

const formatValue = (value: number): string => {
  return value.toFixed(2)
}

const fetchData = async () => {
  try {
    loading.value = true
    error.value = null

    // Joylashuvni aniqlash
    const { lat, lon } = await useGeoData.getPosition()

    // Ob-havo ma'lumotlarini olish
    const weather = await useGeoData.getWeather(lat, lon)
    location.value = weather.name
    wind.value = {
      speed: Number(formatValue(weather.wind.speed)),
      direction: Math.round(weather.wind.deg),
    }
    main.value = {
      temp: Number(formatValue(weather.main.temp)),
      pressure: Number(formatValue(weather.main.pressure)),
      humidity: Number(formatValue(weather.main.humidity)),
    }

    // Havo ifloslanishi ma'lumotlarini olish
    const air = await useGeoData.getPollution(lat, lon)
    pollutants.value = {
      pm25: formatValue(air.pm25),
      pm10: formatValue(air.pm10 || 0),
      co: formatValue(air.co || 0),
      no2: formatValue(air.no2 || 0),
      so2: formatValue(air.so2 || 0),
      o3: formatValue(air.o3 || 0),
    }
  } catch (e) {
    console.error('Xatolik:', e)
    error.value = e instanceof Error ? e.message : "Ma'lumotlarni olishda xatolik yuz berdi."
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-2xl font-bold mb-4 text-center">🌍 Havo ifloslanishi prognozi</h1>

    <div v-if="loading" class="text-center py-8">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
      ></div>
      <p class="mt-2 text-gray-600">Ma'lumotlar yuklanmoqda...</p>
    </div>

    <div v-else>
      <div
        v-if="error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        <p>{{ error }}</p>
        <button
          @click="fetchData"
          class="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Qayta urinish
        </button>
      </div>

      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <InfoPanel :location="location" :wind="wind" :pollutants="pollutants" :main="main" />
          <PollutionChart :pollutants="pollutants" />
        </div>
        <PollutionMap :location="location" :wind="wind" :pollutants="pollutants" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
