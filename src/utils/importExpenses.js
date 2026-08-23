import { CATEGORIES } from '../constants'
import { toISODate } from './format'

const DATE_KEYS = ['date']
const DESCRIPTION_KEYS = ['description', 'desc', 'details', 'particulars', 'note', 'notes', 'item']
const CATEGORY_KEYS = ['category', 'cat', 'type']
const AMOUNT_KEYS = ['amount', 'amt', 'expense', 'value', 'price', 'cost']

/**
 * Converts one spreadsheet cell value into an ISO "YYYY-MM-DD" date string.
 * Handles native Excel dates, Excel's numeric date serials, ISO strings,
 * and "DD/MM/YYYY"-style strings (Indian date convention). Returns `null`
 * if the value can't be confidently parsed as a date.
 */
function parseDateValue(value, XLSX) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toISODate(value.getFullYear(), value.getMonth() + 1, value.getDate())
  }

  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value)
    return parsed ? toISODate(parsed.y, parsed.m, parsed.d) : null
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()

    let match = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
    if (match) {
      return toISODate(Number(match[1]), Number(match[2]), Number(match[3]))
    }

    match = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/)
    if (match) {
      const day = Number(match[1])
      const month = Number(match[2])
      const year = Number(match[3]) < 100 ? Number(match[3]) + 2000 : Number(match[3])
      return toISODate(year, month, day)
    }

    const asDate = new Date(trimmed)
    if (!Number.isNaN(asDate.getTime())) {
      return toISODate(asDate.getFullYear(), asDate.getMonth() + 1, asDate.getDate())
    }
  }

  return null
}

/** Finds the actual column header in `row` matching one of `candidates` (case-insensitive), or `null`. */
function findKey(row, candidates) {
  return Object.keys(row).find((key) => candidates.includes(key.trim().toLowerCase())) || null
}

/**
 * Parses one spreadsheet row into an expense, or returns `null` if it's
 * missing a usable date or a positive amount.
 */
function parseRow(row, XLSX) {
  const dateKey = findKey(row, DATE_KEYS)
  const descKey = findKey(row, DESCRIPTION_KEYS)
  const categoryKey = findKey(row, CATEGORY_KEYS)
  const amountKey = findKey(row, AMOUNT_KEYS)

  const isoDate = dateKey ? parseDateValue(row[dateKey], XLSX) : null
  const amountRaw = amountKey ? row[amountKey] : null
  const amount =
    typeof amountRaw === 'number'
      ? amountRaw
      : Number(String(amountRaw ?? '').replace(/[^0-9.-]/g, ''))

  if (!isoDate || !amount || Number.isNaN(amount) || amount <= 0) {
    return null
  }

  const rawCategory = categoryKey ? String(row[categoryKey]).trim() : ''
  const matchedCategory = CATEGORIES.find((c) => c.toLowerCase() === rawCategory.toLowerCase())

  return {
    id: crypto.randomUUID(),
    description: descKey && row[descKey] ? String(row[descKey]).trim() : 'Imported expense',
    amount,
    category: matchedCategory || rawCategory || 'Other',
    necessary: true,
    date: isoDate,
  }
}

/**
 * Reads an uploaded Excel/CSV file and converts its rows into expenses.
 * Column headers are matched flexibly (e.g. "Amt", "Cost", "Details" all
 * count as an amount/description column).
 * @param {File} file
 * @returns {Promise<{imported: object[], skipped: number, total: number}>}
 */
export async function parseExpenseFile(file) {
  const XLSX = await import('xlsx')
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  const imported = []
  let skipped = 0

  rows.forEach((row) => {
    const expense = parseRow(row, XLSX)
    if (expense) {
      imported.push(expense)
    } else {
      skipped += 1
    }
  })

  return { imported, skipped, total: rows.length }
}
