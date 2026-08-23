import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { MONTH_NAMES } from '../constants'
import { formatCurrency, firstDayOfMonth, lastDayOfMonth, parseLocalDate } from '../utils/format'
import { sumAmounts } from '../utils/expenses'
import { exportToExcel, exportToPDF } from '../utils/exportExpenses'

const now = new Date()
const CURRENT_YEAR = now.getFullYear()
const CURRENT_MONTH = now.getMonth()

/** Years that appear in `expenses`, plus the current year, newest first — used to populate the range dropdowns. */
function buildYearOptions(expenses) {
  const years = new Set([CURRENT_YEAR])
  expenses.forEach((expense) => years.add(parseLocalDate(expense.date).getFullYear()))
  return Array.from(years).sort((a, b) => b - a)
}

/**
 * Lets the user pick a month/year range (or a quick preset) and download the
 * matching expenses as an Excel spreadsheet or a PDF table.
 */
export default function Export() {
  const { expenses } = useOutletContext()
  const yearOptions = useMemo(() => buildYearOptions(expenses), [expenses])

  const [fromYear, setFromYear] = useState(CURRENT_YEAR)
  const [fromMonth, setFromMonth] = useState(CURRENT_MONTH)
  const [toYear, setToYear] = useState(CURRENT_YEAR)
  const [toMonth, setToMonth] = useState(CURRENT_MONTH)
  const [isExporting, setIsExporting] = useState(false)

  const fromISO = firstDayOfMonth(fromYear, fromMonth)
  const toISO = lastDayOfMonth(toYear, toMonth)
  const rangeValid = fromISO <= toISO

  const filtered = useMemo(() => {
    if (!rangeValid) return []
    return expenses.filter((expense) => expense.date >= fromISO && expense.date <= toISO)
  }, [expenses, fromISO, toISO, rangeValid])

  const total = useMemo(() => sumAmounts(filtered), [filtered])

  /** Sets the from/to range to one of the quick presets: this month, this year, or the full history. */
  function applyPreset(preset) {
    if (preset === 'month') {
      setFromYear(CURRENT_YEAR)
      setFromMonth(CURRENT_MONTH)
      setToYear(CURRENT_YEAR)
      setToMonth(CURRENT_MONTH)
    } else if (preset === 'year') {
      setFromYear(CURRENT_YEAR)
      setFromMonth(0)
      setToYear(CURRENT_YEAR)
      setToMonth(11)
    } else if (preset === 'all') {
      const minYear = Math.min(...yearOptions)
      const maxYear = Math.max(...yearOptions)
      setFromYear(minYear)
      setFromMonth(0)
      setToYear(maxYear)
      setToMonth(11)
    }
  }

  const rangeLabel =
    fromYear === toYear && fromMonth === toMonth
      ? `${MONTH_NAMES[fromMonth]} ${fromYear}`
      : `${MONTH_NAMES[fromMonth]} ${fromYear} – ${MONTH_NAMES[toMonth]} ${toYear}`

  async function handleExportExcel() {
    setIsExporting(true)
    try {
      await exportToExcel(filtered, `expenses_${fromISO}_to_${toISO}.xlsx`)
    } finally {
      setIsExporting(false)
    }
  }

  async function handleExportPDF() {
    setIsExporting(true)
    try {
      await exportToPDF(filtered, {
        title: `Expenses: ${rangeLabel}`,
        filename: `expenses_${fromISO}_to_${toISO}.pdf`,
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <div className="month-selector">
        <h1>Export expenses</h1>
      </div>

      <div className="card">
        <h2>Choose a range</h2>
        <div className="export-presets">
          <button type="button" className="btn-preset" onClick={() => applyPreset('month')}>
            This month
          </button>
          <button type="button" className="btn-preset" onClick={() => applyPreset('year')}>
            This year
          </button>
          <button type="button" className="btn-preset" onClick={() => applyPreset('all')}>
            All time
          </button>
        </div>

        <div className="export-range">
          <div className="export-range-group">
            <span className="export-range-label">From</span>
            <select
              value={fromMonth}
              onChange={(event) => setFromMonth(Number(event.target.value))}
            >
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={fromYear}
              onChange={(event) => setFromYear(Number(event.target.value))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="export-range-group">
            <span className="export-range-label">To</span>
            <select value={toMonth} onChange={(event) => setToMonth(Number(event.target.value))}>
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select value={toYear} onChange={(event) => setToYear(Number(event.target.value))}>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!rangeValid && <p className="form-error">"From" must be before or equal to "To".</p>}
      </div>

      <div className="card summary-card export-summary-card">
        <span className="summary-label">{rangeLabel}</span>
        <span className="summary-value">{formatCurrency(total)}</span>
        <span className="summary-sub">
          {filtered.length} expense{filtered.length === 1 ? '' : 's'} in this range
        </span>
      </div>

      <div className="card">
        <h2>Download</h2>
        {filtered.length === 0 ? (
          <p className="empty-state">No expenses in this range to export.</p>
        ) : (
          <div className="export-actions">
            <button
              type="button"
              className="btn-primary"
              disabled={isExporting}
              onClick={handleExportExcel}
            >
              {isExporting ? 'Preparing…' : 'Export as Excel (.xlsx)'}
            </button>
            <button
              type="button"
              className="btn-primary btn-secondary"
              disabled={isExporting}
              onClick={handleExportPDF}
            >
              {isExporting ? 'Preparing…' : 'Export as PDF'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
