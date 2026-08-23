import { useEffect, useState } from 'react'
import { CATEGORIES } from '../constants'
import { firstDayOfMonth, lastDayOfMonth, todayISO } from '../utils/format'

const now = new Date()

/** Default date for a new expense: today if the form is showing the current month, otherwise the 1st of that month. */
function defaultDateFor(year, month) {
  if (year === now.getFullYear() && month === now.getMonth()) {
    return todayISO()
  }
  return firstDayOfMonth(year, month)
}

/**
 * Validates the add-expense form fields.
 * @returns {string|null} An error message, or `null` if everything is valid.
 */
function getValidationError({ description, amount, date, minDate, maxDate }) {
  if (!description.trim()) {
    return 'Please enter a description.'
  }

  const numericAmount = Number(amount)
  if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
    return 'Please enter a valid amount greater than 0.'
  }

  if (date < minDate || date > maxDate) {
    return 'The date must fall within the month currently shown on the dashboard.'
  }

  return null
}

/**
 * Form for logging a new expense. The date is constrained to the month/year
 * currently shown on the dashboard, so entries always land in the right place.
 * @param {number} year - Dashboard's currently selected year.
 * @param {number} month - Dashboard's currently selected month (0-indexed).
 * @param {(expense: object) => void} onAdd
 */
export default function ExpenseForm({ year, month, onAdd }) {
  const minDate = firstDayOfMonth(year, month)
  const maxDate = lastDayOfMonth(year, month)

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [necessary, setNecessary] = useState(true)
  const [date, setDate] = useState(() => defaultDateFor(year, month))
  const [error, setError] = useState('')

  // Keep the date field pinned to whichever month the dashboard is showing,
  // even after the user navigates months without submitting.
  useEffect(() => {
    setDate(defaultDateFor(year, month))
  }, [year, month])

  function handleSubmit(event) {
    event.preventDefault()

    const validationError = getValidationError({ description, amount, date, minDate, maxDate })
    if (validationError) {
      setError(validationError)
      return
    }

    onAdd({
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: Number(amount),
      category,
      necessary,
      date,
    })

    setDescription('')
    setAmount('')
    setNecessary(true)
    setDate(defaultDateFor(year, month))
    setError('')
  }

  return (
    <form className="card expense-form" onSubmit={handleSubmit}>
      <h2>Add an expense</h2>

      <div className="field-row">
        <div className="field">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            placeholder="e.g. Coffee with friends"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="field field-amount">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            min={minDate}
            max={maxDate}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Is this necessary?</label>
          <div className="necessary-toggle" role="group" aria-label="Is this expense necessary?">
            <button
              type="button"
              className={`toggle-btn${necessary ? ' active' : ''}`}
              onClick={() => setNecessary(true)}
            >
              Necessary
            </button>
            <button
              type="button"
              className={`toggle-btn${!necessary ? ' active' : ''}`}
              onClick={() => setNecessary(false)}
            >
              Not necessary
            </button>
          </div>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary">
        Add expense
      </button>
    </form>
  )
}
