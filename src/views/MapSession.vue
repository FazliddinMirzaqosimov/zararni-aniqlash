<script setup lang="ts">
import { useMainStore } from '@/stores/mainStore'
import { onMounted, ref, watch } from 'vue'
import { phpUnserialize } from '@/utils/phpUnserialize'
import type { IMapSession, IStationData } from '@/stores/types'
import { storeToRefs } from 'pinia'
import 'leaflet/dist/leaflet.css'
import type { Map as LeafletMap } from 'leaflet'
import L from 'leaflet'
import { parseDateTime } from '@/utils/parseDateTime'

const mainStore = useMainStore()
const { mapSessionList, loading, mapSession } = storeToRefs(mainStore)
const mapContainer = ref<HTMLElement | null>(null)
let map: LeafletMap | null = null

const getLocalizedTitle = (station: IMapSession) => {
  if (station.category_title) {
    const titles = phpUnserialize(station.category_title)
    return titles.uz
  }
  return ''
}

const formatValue = (value: string | undefined) => {
  if (!value || value === '-' || value === '-9999') return '0'
  return value
}

const getMapSessionById = (id: number) => {
  mainStore.fetchMapSessionById(id)
}

onMounted(() => {
  mainStore.fetchMapSession()

  if (mapContainer.value) {
    map = L.map(mapContainer.value).setView([41.3775, 64.5853], 6)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)

    watch(
      mapSessionList,
      (stations: IMapSession[]) => {
        if (!map || !stations) return

        stations.forEach((station: IMapSession) => {
          if (station.lat && station.lon) {
            const marker = L.marker([station.lat, station.lon]).addTo(map!)
            marker.on('click', () => {
              getMapSessionById(station.id)
            })
          }
        })
      },
      { immediate: true },
    )
  }
})
</script>

<template>
  <div>
    <div v-if="loading" class="absolute top-4 left-4 z-[1000] bg-white p-2 rounded shadow">
      Ma'lumotlar yuklanmoqda...
    </div>
    <div>
      <div v-if="mapSession" class="bg-white rounded-lg shadow-lg p-6 mb-4 mx-auto">
        <div class="text-blue-600 text-xl font-medium mb-2">
          {{ mapSession.title }}
        </div>
        <div class="text-lg mb-3 text-gray-700">{{ mapSession.address }}</div>

        <div class="grid gap-4">
          <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
            <span class="text-gray-600">PM 2.5:</span>
            <span class="badge"> {{ formatValue(mapSession.measurements?.pm25) }} </span>
          </div>
          <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
            <span class="text-gray-600">PM 10:</span>
            <span class="badge"> {{ formatValue(mapSession.measurements?.pm10) }} </span>
          </div>
          <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
            <span class="text-gray-600">Uglerod oksidi:</span>
            <span class="badge"> {{ formatValue(mapSession.measurements?.co) }} </span>
          </div>
          <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
            <span class="text-gray-600">Oltingugurt dioksidi :</span>
            <span class="badge"> {{ formatValue(mapSession.measurements?.so2) }} </span>
          </div>
          <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
            <span class="text-gray-600">Azot oksidi:</span>
            <span class="badge"> {{ formatValue(mapSession.measurements?.no) }} </span>
          </div>
          <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
            <span class="text-gray-600">Azot dioksidi:</span>
            <span class="badge"> {{ formatValue(mapSession.measurements?.no2) }} </span>
          </div>
          <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lpg">
            <span class="text-gray-600">Ozon (O₃):</span>
            <span class="badge"> {{ formatValue(mapSession.measurements?.o3) }} </span>
          </div>
        </div>

        <div class="mt-4 flex justify-between items-center">
          <span class="text-gray-600">Yangilandi:</span>
          <span> {{ parseDateTime(mapSession.updatedAt || '') }}</span>
        </div>
      </div>
      <div ref="mapContainer" class="h-[80vh] w-full rounded-lg overflow-hidden"></div>
    </div>
  </div>
</template>

<style>
.badge {
  padding: 4px 12px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  background-color: #2b80d3;
}
.grid {
  display: grid;
  gap: 0.75rem;
}
</style>
