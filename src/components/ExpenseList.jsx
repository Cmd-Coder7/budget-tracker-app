import { useState } from 'react'
import { CATEGORIES, getCategoryColor } from '../constants'
import { formatCurrency, formatShortDate } from '../utils/format'
import { sortByDateDesc } from '../utils/expenses'

/** Whether a draft has everything required to be saved (non-empty description, positive amount, a date). */
function isDraftValid(draft) {
  const amount = Number(draft.amount)
  return Boolean(draft.description.trim()) && amount > 0 && Boolean(draft.date)
}

/**
 * Transaction list with inline delete and inline edit-in-place.
 * @param {object[]} expenses
 * @param {(id: string) => void} onDelete
 * @param {(expense: object) => void} onUpdate - Called with the full updated expense on save.
 */
export default function ExpenseList({ expenses, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(null)

  /** Enters edit mode for one row, seeding the draft from its current values. */
  function startEdit(expense) {
    setEditingId(expense.id)
    setDraft({ ...expense, necessary: expense.necessary !== false })
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft(null)
  }

  /** Commits the current draft via `onUpdate` if it's valid, then exits edit mode. */
  function saveEdit() {
    if (!isDraftValid(draft)) {
      return
    }
    onUpdate({ ...draft, description: draft.description.trim(), amount: Number(draft.amount) })
    setEditingId(null)
    setDraft(null)
  }

  return (
    <div className="card">
      <h2>Transactions</h2>
      {expenses.length === 0 ? (
        <p className="empty-state">No expenses logged for this month yet.</p>
      ) : (
        <ul className="expense-list">
          {sortByDateDesc(expenses).map((expense) =>
            editingId === expense.id ? (
              <li className="expense-row expense-row-editing" key={expense.id}>
                <input
                  className="edit-input edit-description"
                  value={draft.description}
                  onChange={(event) =>
                    setDraft({ ...draft, description: event.target.value })
                  }
                />
                <select
                  className="edit-input"
                  value={draft.category}
                  onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  className="edit-input"
                  value={draft.date}
                  onChange={(event) => setDraft({ ...draft, date: event.target.value })}
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="edit-input edit-amount"
                  value={draft.amount}
                  onChange={(event) => setDraft({ ...draft, amount: event.target.value })}
                />
                <select
                  className="edit-input"
                  value={draft.necessary ? 'yes' : 'no'}
                  onChange={(event) =>
                    setDraft({ ...draft, necessary: event.target.value === 'yes' })
                  }
                >
                  <option value="yes">Necessary</option>
                  <option value="no">Not necessary</option>
                </select>
                <div className="edit-actions">
                  <button type="button" className="btn-save" onClick={saveEdit}>
                    Save
                  </button>
                  <button type="button" className="btn-cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </li>
            ) : (
              <li className="expense-row" key={expense.id}>
                <span
                  className="category-dot"
                  style={{ background: getCategoryColor(expense.category) }}
                />
                <div className="expense-details">
                  <span className="expense-description">{expense.description}</span>
                  <span className="expense-meta">
                    {expense.category} · {formatShortDate(expense.date)}
                  </span>
                </div>
                <span
                  className={`necessary-badge${expense.necessary === false ? ' optional' : ''}`}
                >
                  {expense.necessary === false ? 'Optional' : 'Necessary'}
                </span>
                <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                <button
                  className="btn-edit"
                  aria-label={`Edit ${expense.description}`}
                  onClick={() => startEdit(expense)}
                >
                  ✎
                </button>
                <button
                  className="btn-delete"
                  aria-label={`Delete ${expense.description}`}
                  onClick={() => onDelete(expense.id)}
                >
                  ×
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}
