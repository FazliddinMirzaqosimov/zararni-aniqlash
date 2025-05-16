export interface IMapSession {
  id: number
  category_title: string
  lat: number
  lon: number
  Si: number
  date: string
  title?: string
  substances?: string
  CO?: string
  NO?: string
  NO2?: string
  O3?: string
  SO2?: string
  NH3?: string
  C6H6O?: string
  PM25?: string
  PM10?: string
}

export interface LocalizedString {
  ru: string
  uz: string
  oz: string
  en: string
}

export interface IStationData {
  title: string
  address: string
  measurements: {
    pm25: string
    pm10: string
    co: string
    so2: string
    no: string
    no2: string
    o3: string
  }
  updatedAt: string
  iza: string
}
