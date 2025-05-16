<template>
  <div class="bg-white rounded-lg shadow-lg p-6 mb-4">
    <div class="flex justify-between flex-wrap">
      <div>
        <div class="mb-4">
          <h2 class="text-xl font-semibold mb-2">📍 Joylashuv</h2>
          <p>{{ location }}</p>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <h2 class="text-xl font-semibold mb-2">💨 Shamol</h2>
            <p>Tezlik: {{ wind.speed }} m/s</p>
            <p>Yo'nalish: {{ wind.direction }}°</p>
          </div>
        </div>
      </div>
      <div>
        <h2 class="text-xl font-semibold mb-2">🌡️ Havo</h2>
        <p>Harorati: {{ main.temp }}°C</p>
        <p>Havo bosimi: {{ main.pressure }} hPa</p>
        <p>Havo nisbiy namligi: {{ main.humidity }}%</p>
      </div>
    </div>

    <div>
      <h2 class="text-xl font-semibold mb-2">🏭 Ifloslantiruvchi moddalar</h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 p-3 rounded">
          <p class="font-medium">PM2.5</p>
          <p>{{ pollutants.pm25 }} µg/m³</p>
        </div>
        <div v-if="pollutants.pm10" class="bg-gray-50 p-3 rounded">
          <p class="font-medium">PM10</p>
          <p>{{ pollutants.pm10 }} µg/m³</p>
        </div>
        <div v-if="pollutants.co" class="bg-gray-50 p-3 rounded">
          <p class="font-medium">CO</p>
          <p>{{ pollutants.co }} mg/m³</p>
        </div>
        <div v-if="pollutants.no2" class="bg-gray-50 p-3 rounded">
          <p class="font-medium">NO₂</p>
          <p>{{ pollutants.no2 }} mg/m³</p>
        </div>
        <div v-if="pollutants.so2" class="bg-gray-50 p-3 rounded">
          <p class="font-medium">SO₂</p>
          <p>{{ pollutants.so2 }} mg/m³</p>
        </div>
        <div v-if="pollutants.o3" class="bg-gray-50 p-3 rounded">
          <p class="font-medium">O₃</p>
          <p>{{ pollutants.o3 }} mg/m³</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  location: string
  wind: {
    speed: number
    direction: number
  }
  main: {
    temp: number
    pressure: number
    humidity: number
  }
  pollutants: {
    pm25: string | number
    pm10?: string | number
    co?: string | number
    no2?: string | number
    so2?: string | number
    o3?: string | number
  }
}

defineProps<Props>()
</script>
