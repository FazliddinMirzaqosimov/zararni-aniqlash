export function parseDateTime(dateTimeStr: string): string {
  // "Янгиланди   : 14.04.2025 19:00:00" форматидан вақтни ажратиб олиш
  const match = dateTimeStr.match(/Янгиланди\s*:\s*(.+)/)
  if (match && match[1]) {
    return match[1].trim()
  }
  return dateTimeStr
}
