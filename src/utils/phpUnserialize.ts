export interface LocalizedString {
  ru: string
  uz: string
  oz: string
  en: string
}

export function phpUnserialize(serialized: string): LocalizedString {
  const result: LocalizedString = {
    ru: '',
    uz: '',
    oz: '',
    en: '',
  }

  try {
    // Простой парсер для формата a:4:{s:2:"ru";s:N:"value";...}
    const matches = serialized.match(/s:2:"(\w+)";s:\d+:"([^"]+)"/g)
    if (matches) {
      matches.forEach((match) => {
        const [, lang, value] = match.match(/s:2:"(\w+)";s:\d+:"([^"]+)"/) || []
        if (lang && value && lang in result) {
          result[lang as keyof LocalizedString] = value
        }
      })
    }
  } catch (error) {
    console.error('Error parsing PHP serialized string:', error)
  }

  return result
}
