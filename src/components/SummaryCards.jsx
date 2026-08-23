import { formatCurrency } from '../utils/format'

/**
 * Three-card summary row: amount spent, an editable monthly budget target
 * with a progress bar, and the remaining balance.
 * @param {number} total - Amount spent so far in the current period.
 * @param {number} budget - User-set budget target (0 = not set).
 * @param {number} count - Number of expenses making up `total`.
 * @param {(amount: number) => void} onBudgetChange
 */
export default function SummaryCards({ total, budget, count, onBudgetChange }) {
  const remaining = budget - total
  const percentUsed = budget > 0 ? Math.min((total / budget) * 100, 100) : 0
  const overBudget = budget > 0 && total > budget

  return (
    <div className="summary-grid">
      <div className="card summary-card">
        <span className="summary-label">Spent this month</span>
        <span className="summary-value">{formatCurrency(total)}</span>
        <span className="summary-sub">{count} expense{count === 1 ? '' : 's'}</span>
      </div>

      <div className="card summary-card">
        <span className="summary-label">Monthly budget</span>
        <input
          type="number"
          min="0"
          step="1"
          className="budget-input"
          value={budget || ''}
          placeholder="Set a budget"
          onChange={(event) => onBudgetChange(Number(event.target.value) || 0)}
        />
        {budget > 0 && (
          <div className="progress-track">
            <div
              className={`progress-fill ${overBudget ? 'over' : ''}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        )}
      </div>

      <div className="card summary-card">
        <span className="summary-label">Remaining</span>
        <span
          className={`summary-value ${budget > 0 && remaining < 0 ? 'negative' : ''}`}
        >
          {budget > 0 ? formatCurrency(remaining) : '—'}
        </span>
        {overBudget && <span className="summary-sub negative">Over budget</span>}
      </div>
    </div>
  )
}
