import { parseLocalDate } from './format'

/** Sums the `amount` field across a list of expenses. */
export function sumAmounts(expenses) {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0)
}

/** Returns only the expenses whose date falls in the given calendar year. */
export function filterByYear(expenses, year) {
  return expenses.filter((expense) => parseLocalDate(expense.date).getFullYear() === year)
}

/** Returns only the expenses whose date falls in the given calendar month (0-indexed) and year. */
export function filterByMonth(expenses, year, month) {
  return expenses.filter((expense) => {
    const date = parseLocalDate(expense.date)
    return date.getFullYear() === year && date.getMonth() === month
  })
}

/** Buckets expense amounts into a 12-element array (index 0 = January) by their month. */
export function groupAmountsByMonth(expenses) {
  const totals = Array.from({ length: 12 }, () => 0)
  expenses.forEach((expense) => {
    totals[parseLocalDate(expense.date).getMonth()] += expense.amount
  })
  return totals
}

/** Returns a new array of expenses sorted oldest-first. */
export function sortByDateAsc(expenses) {
  return expenses.slice().sort((a, b) => (a.date < b.date ? -1 : 1))
}

/** Returns a new array of expenses sorted newest-first. */
export function sortByDateDesc(expenses) {
  return expenses.slice().sort((a, b) => (a.date < b.date ? 1 : -1))
}
