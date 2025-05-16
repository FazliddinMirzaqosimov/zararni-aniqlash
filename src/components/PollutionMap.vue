<template>
  <div id="map" class="h-96 rounded shadow"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  location: string,
  wind: { speed: number, direction: number },
  pollutants: { pm25: number | string }
}>()

let map: L.Map

const initMap = (lat: number, lon: number) => {
  map = L.map('map').setView([lat, lon], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  L.marker([lat, lon]).addTo(map)
    .bindPopup(`PM2.5: ${props.pollutants.pm25}`).openPopup()

  const arrow = L.polyline([
    [lat, lon],
    [lat + 0.02 * Math.cos(props.wind.direction * Math.PI / 180),
     lon + 0.02 * Math.sin(props.wind.direction * Math.PI / 180)]
  ], { color: 'blue' }).addTo(map)
}

onMounted(async () => {
  const position = await new Promise<{ lat: number, lon: number }>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      reject
    )
  })
  initMap(position.lat, position.lon)
})
</script>
