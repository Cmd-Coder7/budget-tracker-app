/** Formats a number as an Indian Rupee currency string, e.g. 125000 -> "₹1,25,000.00". */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value)
}

/** Parses an ISO "YYYY-MM-DD" string as a local-timezone Date (avoids the UTC-midnight shift that `new Date(iso)` causes). */
export function parseLocalDate(iso) {
  return new Date(`${iso}T00:00:00`)
}

/** Formats an ISO date string as a short local label, e.g. "2026-03-05" -> "Mar 5". */
export function formatShortDate(iso) {
  return parseLocalDate(iso).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  })
}

/** Zero-pads a number to at least 2 digits, e.g. 5 -> "05". */
function pad2(n) {
  return String(n).padStart(2, '0')
}

/** Builds an ISO "YYYY-MM-DD" string from calendar parts (month is 1-indexed). */
export function toISODate(year, month, day) {
  return `${year}-${pad2(month)}-${pad2(day)}`
}

/** Returns the ISO date of the 1st day of the given month (month is 0-indexed, JS Date style). */
export function firstDayOfMonth(year, month) {
  return toISODate(year, month + 1, 1)
}

/** Returns the ISO date of the last day of the given month (month is 0-indexed, JS Date style). */
export function lastDayOfMonth(year, month) {
  // Day 0 of "next month" is the last day of the current month.
  const d = new Date(year, month + 1, 0)
  return toISODate(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

/** Returns today's date as an ISO "YYYY-MM-DD" string, in the user's local timezone. */
export function todayISO() {
  const d = new Date()
  const offsetMs = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 10)
}
