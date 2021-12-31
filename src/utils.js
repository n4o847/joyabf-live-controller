export function parseSecond(epochSecond) {
  return new Date(epochSecond * 1000)
}

export function formatDate(date) {
  return (
    date.getFullYear() +
    `-` +
    (date.getMonth() + 1).toString().padStart(2, `0`) +
    `-` +
    date.getDate().toString().padStart(2, `0`)
  )
}

export function formatTime(date) {
  return (
    date.getHours().toString().padStart(2, `0`) +
    `:` +
    date.getMinutes().toString().padStart(2, `0`) +
    `:` +
    date.getSeconds().toString().padStart(2, `0`)
  )
}

export function formatDateTime(date) {
  return formatDate(date) + ` ` + formatTime(date)
}
