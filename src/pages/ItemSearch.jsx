import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import BarChart from '../components/BarChart'
import ExpenseList from '../components/ExpenseList'
import YearSelector from '../components/YearSelector'
import { CATEGORIES, MONTH_NAMES } from '../constants'
import { formatCurrency, parseLocalDate } from '../utils/format'
import { sumAmounts, groupAmountsByMonth } from '../utils/expenses'

const now = new Date()

/** Whether `expense` satisfies every active filter (year is always required; the rest are optional). */
function matchesFilters(expense, { year, query, category, necessaryFilter }) {
  if (parseLocalDate(expense.date).getFullYear() !== year) return false
  if (query && !expense.description.toLowerCase().includes(query)) return false
  if (category !== 'All' && expense.category !== category) return false
  if (necessaryFilter === 'necessary' && expense.necessary === false) return false
  if (necessaryFilter === 'not-necessary' && expense.necessary !== false) return false
  return true
}

/**
 * Lets the user filter expenses by description text, category, and/or the
 * necessary/optional flag, then shows the matching total, a monthly bar
 * chart, and the editable list of matches for a chosen year.
 */
export default function ItemSearch() {
  const { expenses, onDelete, onUpdate } = useOutletContext()
  const [year, setYear] = useState(now.getFullYear())
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [necessaryFilter, setNecessaryFilter] = useState('all')

  const trimmedQuery = query.trim().toLowerCase()
  const hasActiveFilter = trimmedQuery !== '' || category !== 'All' || necessaryFilter !== 'all'

  const matches = useMemo(() => {
    if (!hasActiveFilter) return []
    const filters = { year, query: trimmedQuery, category, necessaryFilter }
    return expenses.filter((expense) => matchesFilters(expense, filters))
  }, [expenses, year, trimmedQuery, category, necessaryFilter, hasActiveFilter])

  const total = useMemo(() => sumAmounts(matches), [matches])

  const monthlyData = useMemo(
    () => groupAmountsByMonth(matches).map((value, i) => ({ label: MONTH_NAMES[i].slice(0, 3), value })),
    [matches],
  )

  const filterLabel = useMemo(() => {
    const parts = []
    if (trimmedQuery) parts.push(`"${query.trim()}"`)
    if (category !== 'All') parts.push(category)
    if (necessaryFilter !== 'all') {
      parts.push(necessaryFilter === 'necessary' ? 'Necessary' : 'Not necessary')
    }
    return parts.length > 0 ? parts.join(' · ') : 'All expenses'
  }, [trimmedQuery, query, category, necessaryFilter])

  return (
    <>
      <div className="month-selector">
        <h1>Search &amp; filter</h1>
      </div>

      <div className="card">
        <h2>Filter your expenses</h2>

        <div className="field-row">
          <div className="field">
            <label htmlFor="search-query">Description contains</label>
            <input
              id="search-query"
              type="text"
              placeholder="e.g. Netflix, Coffee, Uber…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="filter-category">Category</label>
            <select
              id="filter-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="All">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="filter-necessary">Necessary</label>
            <select
              id="filter-necessary"
              value={necessaryFilter}
              onChange={(event) => setNecessaryFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="necessary">Necessary only</option>
              <option value="not-necessary">Not necessary only</option>
            </select>
          </div>
        </div>
      </div>

      {hasActiveFilter && (
        <>
          <YearSelector year={year} onChange={setYear} />

          <div className="card summary-card search-summary-card">
            <span className="summary-label">
              Total spent on {filterLabel} in {year}
            </span>
            <span className="summary-value">{formatCurrency(total)}</span>
            <span className="summary-sub">
              {matches.length} matching expense{matches.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="card">
            <h2>Monthly breakdown</h2>
            {total === 0 ? (
              <p className="empty-state">No expenses matching {filterLabel} found in {year}.</p>
            ) : (
              <BarChart data={monthlyData} formatValue={(v) => formatCurrency(v)} />
            )}
          </div>

          {matches.length > 0 && (
            <ExpenseList expenses={matches} onDelete={onDelete} onUpdate={onUpdate} />
          )}
        </>
      )}
    </>
  )
}
