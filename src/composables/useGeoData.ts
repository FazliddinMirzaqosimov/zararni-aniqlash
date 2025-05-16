export default {
  getPosition(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        reject,
      )
    })
  },

  async getWeather(lat: number, lon: number) {
    const apiKey = '4b2403a70dd730244b040b41dd4848dc'
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    )
    return await res.json()
  },

  async getPollution(lat: number, lon: number) {
    const apiKey = '4b2403a70dd730244b040b41dd4848dc'
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    )

    if (!res.ok) {
      throw new Error(`API xatosi: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    if (!data.list || !data.list[0]) {
      throw new Error("Ma'lumotlar topilmadi")
    }

    const components = data.list[0].components
    return {
      pm25: components.pm2_5 || 0,
      pm10: components.pm10 || 0,
      co: components.co || 0,
      no2: components.no2 || 0,
      so2: components.so2 || 0,
      o3: components.o3 || 0,
    }
  },

  async getYearlyPollution(lat: number, lon: number, year: number) {
    const apiKey = '4b2403a70dd730244b040b41dd4848dc'
    const monthlyData = {
      pm25: Array(12).fill(0),
      pm10: Array(12).fill(0),
      co: Array(12).fill(0),
      no2: Array(12).fill(0),
      so2: Array(12).fill(0),
      o3: Array(12).fill(0),
    }

    try {
      // Получаем данные за весь год одним запросом
      const startDate = new Date(year, 0, 1) // 1 января выбранного года
      const endDate = new Date(year, 11, 31) // 31 декабря выбранного года

      const startTimestamp = Math.floor(startDate.getTime() / 1000)
      const endTimestamp = Math.floor(endDate.getTime() / 1000)

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&appid=${apiKey}&start=${startTimestamp}&end=${endTimestamp}`,
      )

      if (!res.ok) {
        throw new Error(`API xatosi: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()

      if (!data.list || data.list.length === 0) {
        throw new Error("Ma'lumotlar topilmadi")
      }

      // Группируем данные по месяцам
      const monthlyAverages: Record<
        number,
        {
          count: number
          pm25: number
          pm10: number
          co: number
          no2: number
          so2: number
          o3: number
        }
      > = {}

      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000)
        const month = date.getMonth()

        if (!monthlyAverages[month]) {
          monthlyAverages[month] = {
            count: 0,
            pm25: 0,
            pm10: 0,
            co: 0,
            no2: 0,
            so2: 0,
            o3: 0,
          }
        }

        monthlyAverages[month].count++
        monthlyAverages[month].pm25 += item.components.pm2_5 || 0
        monthlyAverages[month].pm10 += item.components.pm10 || 0
        monthlyAverages[month].co += item.components.co || 0
        monthlyAverages[month].no2 += item.components.no2 || 0
        monthlyAverages[month].so2 += item.components.so2 || 0
        monthlyAverages[month].o3 += item.components.o3 || 0
      })

      // Вычисляем средние значения для каждого месяца
      Object.keys(monthlyAverages).forEach((monthStr) => {
        const month = parseInt(monthStr, 10)
        const monthData = monthlyAverages[month]
        const count = monthData.count || 1

        monthlyData.pm25[month] = monthData.pm25 / count
        monthlyData.pm10[month] = monthData.pm10 / count
        monthlyData.co[month] = monthData.co / count
        monthlyData.no2[month] = monthData.no2 / count
        monthlyData.so2[month] = monthData.so2 / count
        monthlyData.o3[month] = monthData.o3 / count
      })

      return monthlyData
    } catch (error) {
      console.error("Yillik ma'lumotlarni olishda xatolik:", error)
      throw error
    }
  },
}
