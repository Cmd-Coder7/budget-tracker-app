const EXPENSES_KEY = 'budget-tracker-expenses'
const BUDGET_KEY = 'budget-tracker-monthly-budget'

/** Loads the saved expense list from localStorage, or `[]` if none exists or it's corrupted. */
export function loadExpenses() {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Persists the full expense list to localStorage. */
export function saveExpenses(expenses) {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
}

/** Loads the saved monthly budget from localStorage, or `0` if none is set. */
export function loadBudget() {
  const raw = localStorage.getItem(BUDGET_KEY)
  return raw ? Number(raw) : 0
}

/** Persists the monthly budget to localStorage. */
export function saveBudget(amount) {
  localStorage.setItem(BUDGET_KEY, String(amount))
}
