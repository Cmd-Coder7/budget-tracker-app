import { useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import YearSelector from '../components/YearSelector'
import CategoryBreakdown from '../components/CategoryBreakdown'
import { MONTH_NAMES } from '../constants'
import { formatCurrency } from '../utils/format'
import { filterByYear, filterByMonth, sumAmounts, groupAmountsByMonth } from '../utils/expenses'

const now = new Date()

/**
 * Yearly totals page: total spend for a selected year, plus a month-by-month
 * bar breakdown. Clicking a month expands its category breakdown inline;
 * a separate "View month" link jumps to the Dashboard for that month.
 */
export default function YearAnalysis() {
  const { expenses } = useOutletContext()
  const navigate = useNavigate()
  const [year, setYear] = useState(now.getFullYear())
  const [expandedMonth, setExpandedMonth] = useState(null)

  const yearExpenses = useMemo(() => filterByYear(expenses, year), [expenses, year])
  const yearTotal = useMemo(() => sumAmounts(yearExpenses), [yearExpenses])
  const monthlyBreakdown = useMemo(() => groupAmountsByMonth(yearExpenses), [yearExpenses])
  const maxMonthTotal = Math.max(...monthlyBreakdown, 0)

  /** Expands/collapses the inline category breakdown for one month row. */
  function toggleMonth(index) {
    setExpandedMonth((current) => (current === index ? null : index))
  }

  /** Navigates to the Dashboard pre-loaded on the given month of the selected year. */
  function viewMonth(index) {
    navigate(`/?year=${year}&month=${index}`)
  }

  return (
    <>
      <YearSelector year={year} onChange={setYear} />

      <div className="card summary-card year-total-card">
        <span className="summary-label">Total spent in {year}</span>
        <span className="summary-value">{formatCurrency(yearTotal)}</span>
        <span className="summary-sub">
          {yearExpenses.length} expense{yearExpenses.length === 1 ? '' : 's'} across the year
        </span>
      </div>

      <div className="card">
        <h2>Monthly breakdown</h2>
        {yearTotal === 0 ? (
          <p className="empty-state">No expenses logged for {year} yet.</p>
        ) : (
          <div className="month-breakdown-list">
            {monthlyBreakdown.map((amount, index) => {
              const percentOfMax = maxMonthTotal > 0 ? (amount / maxMonthTotal) * 100 : 0
              const percentOfYear = yearTotal > 0 ? (amount / yearTotal) * 100 : 0
              const isExpanded = expandedMonth === index
              const monthExpenses = filterByMonth(yearExpenses, year, index)

              return (
                <div className="month-breakdown-item" key={index}>
                  <div className="month-breakdown-row">
                    <button
                      type="button"
                      className="month-breakdown-main"
                      onClick={() => toggleMonth(index)}
                      disabled={amount === 0}
                    >
                      <span className="month-breakdown-name">{MONTH_NAMES[index]}</span>
                      <div className="month-breakdown-track">
                        <div
                          className="month-breakdown-fill"
                          style={{ width: `${percentOfMax}%` }}
                        />
                      </div>
                      <span className="month-breakdown-amount">
                        {formatCurrency(amount)}
                        <span className="month-breakdown-percent">
                          {amount > 0 ? ` · ${percentOfYear.toFixed(0)}%` : ''}
                        </span>
                      </span>
                    </button>
                    {amount > 0 && (
                      <button
                        type="button"
                        className="btn-view-month"
                        onClick={() => viewMonth(index)}
                        aria-label={`View ${MONTH_NAMES[index]} in Dashboard`}
                      >
                        View month →
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="month-breakdown-detail">
                      <CategoryBreakdown expenses={monthExpenses} total={amount} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
