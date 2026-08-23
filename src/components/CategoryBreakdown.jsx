import { getCategoryColor } from '../constants'
import { formatCurrency } from '../utils/format'

/**
 * Renders a colored bar per category showing its share of `total`,
 * sorted highest-spend first. Renders nothing if there are no expenses.
 * @param {object[]} expenses
 * @param {number} total - Combined amount of `expenses`, used to compute percentages.
 */
export default function CategoryBreakdown({ expenses, total }) {
  if (expenses.length === 0) {
    return null
  }

  const totalByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const rows = Object.entries(totalByCategory).sort((a, b) => b[1] - a[1])

  return (
    <div className="card">
      <h2>Spending by category</h2>
      <div className="category-list">
        {rows.map(([category, amount]) => {
          const percent = total > 0 ? (amount / total) * 100 : 0
          return (
            <div className="category-row" key={category}>
              <div className="category-row-header">
                <span>
                  <span
                    className="category-dot"
                    style={{ background: getCategoryColor(category) }}
                  />
                  {category}
                </span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <div className="category-track">
                <div
                  className="category-fill"
                  style={{
                    width: `${percent}%`,
                    background: getCategoryColor(category),
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
