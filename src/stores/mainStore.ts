import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IMapSession, IStationData } from './types'
import axios from 'axios'
import { parseStationHtml } from '@/utils/parseHtmlData'

export const useMainStore = defineStore('main', () => {
  const mapSessionList = ref<IMapSession[]>([])
  const mapSession = ref<IStationData | null>(null)
  const loading = ref(false)

  const setMapSession = (value: IMapSession[]) => {
    mapSessionList.value = value
  }

  const fetchMapSession = async () => {
    loading.value = true
    axios
      .get('https://monitoring.meteo.uz/ru/api/maps?horiba=1')
      .then((response) => {
        setMapSession(response.data.data[0]?.stations)
        loading.value = false
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const fetchMapSessionById = async (id: number) => {
    //https://monitoring.meteo.uz/uz//api/maps/si_ajax/722
    axios.get(`https://monitoring.meteo.uz/uz/api/maps/si_ajax/${id}`).then((response) => {
      mapSession.value = JSON.parse(JSON.stringify(parseStationHtml(response.data), null, 2))
    })
  }

  return { mapSessionList, mapSession, loading, fetchMapSession, fetchMapSessionById }
})
