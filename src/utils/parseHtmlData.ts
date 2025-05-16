import type { IStationData } from '@/stores/types'

export function parseStationHtml(html: string): IStationData {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Ma'lumotlarni olish
  const title = doc.querySelector('h2')?.textContent?.trim() || ''
  const address = doc.querySelector('.maps-info__item > p')?.textContent?.trim() || ''

  // O'lchovlarni olish
  const measurements = doc.querySelectorAll('.maps-info__concentrations li')
  const measurementData = {
    pm25: '',
    pm10: '',
    co: '',
    so2: '',
    no: '',
    no2: '',
    o3: '',
  }

  measurements.forEach((item) => {
    const label = item.querySelector('span')?.textContent?.toLowerCase() || ''
    const value = item.querySelector('.badge')?.textContent?.trim() || ''

    if (label.includes('pm 2.5')) {
      measurementData.pm25 = value
    } else if (label.includes('pm 10')) {
      measurementData.pm10 = value
    } else if (label.includes('оксид углерода')) {
      measurementData.co = value
    } else if (label.includes('диоксид серы')) {
      measurementData.so2 = value
    } else if (label.includes('оксид азота') && !label.includes('диоксид')) {
      measurementData.no = value
    } else if (label.includes('диоксид азота')) {
      measurementData.no2 = value
    } else if (label.includes('озон')) {
      measurementData.o3 = value
    }
  })

  // Yangilangan vaqtni olish
  const updatedAt =
    doc
      .querySelector('.maps-info__item > p:nth-last-of-type(1)')
      ?.textContent?.replace('Янгиланди :', '')
      .trim() || ''

  // IZA qiymatini olish
  const iza = doc.querySelector('.maps-info__item-footer .badge')?.textContent?.trim() || ''

  return {
    title,
    address,
    measurements: measurementData,
    updatedAt,
    iza,
  }
}
