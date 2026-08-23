import { useEffect, useMemo, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import SummaryCards from '../components/SummaryCards'
import CategoryBreakdown from '../components/CategoryBreakdown'
import MonthSelector from '../components/MonthSelector'
import ImportExpenses from '../components/ImportExpenses'
import { filterByMonth, sumAmounts } from '../utils/expenses'

const now = new Date()

/**
 * Home page: add/import/edit expenses for a single month, with a budget
 * progress summary and category breakdown for that month.
 * Supports deep-linking via `?year=&month=` (used by the "View month" link
 * on the Yearly Analysis page) to open directly on a specific month.
 */
export default function Dashboard() {
  const { expenses, budget, onAdd, onDelete, onUpdate, onImport, onBudgetChange } =
    useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()

  const [year, setYear] = useState(() => {
    const y = searchParams.get('year')
    return y !== null ? Number(y) : now.getFullYear()
  })
  const [month, setMonth] = useState(() => {
    const m = searchParams.get('month')
    return m !== null ? Number(m) : now.getMonth()
  })

  // The deep-link params are only needed to seed initial state above; strip
  // them from the URL once so manual in-page month navigation afterwards
  // doesn't fight with a stale query string.
  useEffect(() => {
    if (searchParams.toString()) {
      setSearchParams({}, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const monthExpenses = useMemo(
    () => filterByMonth(expenses, year, month),
    [expenses, year, month],
  )

  const total = useMemo(() => sumAmounts(monthExpenses), [monthExpenses])

  return (
    <>
      <MonthSelector
        year={year}
        month={month}
        onChange={(y, m) => {
          setYear(y)
          setMonth(m)
        }}
      />

      <SummaryCards
        total={total}
        budget={budget}
        count={monthExpenses.length}
        onBudgetChange={onBudgetChange}
      />

      <div className="app-grid">
        <div className="app-column">
          <ExpenseForm year={year} month={month} onAdd={onAdd} />
          <ImportExpenses onImport={onImport} />
          <CategoryBreakdown expenses={monthExpenses} total={total} />
        </div>
        <div className="app-column">
          <ExpenseList expenses={monthExpenses} onDelete={onDelete} onUpdate={onUpdate} />
        </div>
      </div>
    </>
  )
}
