import { useState } from 'react'
import { loadExpenses, saveExpenses, loadBudget, saveBudget } from '../utils/storage'

/**
 * Central state + persistence for expenses and the monthly budget.
 * Every mutation updates React state and writes through to localStorage in
 * the same call, so the two can never drift apart.
 *
 * @returns {{
 *   expenses: object[],
 *   budget: number,
 *   addExpense: (expense: object) => void,
 *   deleteExpense: (id: string) => void,
 *   updateExpense: (expense: object) => void,
 *   importExpenses: (expenses: object[]) => void,
 *   changeBudget: (amount: number) => void,
 * }}
 */
export function useExpenseStore() {
  const [expenses, setExpenses] = useState(loadExpenses)
  const [budget, setBudget] = useState(loadBudget)

  /** Applies a new expenses array to state and persists it. */
  function commitExpenses(updated) {
    setExpenses(updated)
    saveExpenses(updated)
  }

  /** Appends a single new expense. */
  function addExpense(expense) {
    commitExpenses([...expenses, expense])
  }

  /** Removes the expense with the given id. */
  function deleteExpense(id) {
    commitExpenses(expenses.filter((expense) => expense.id !== id))
  }

  /** Replaces the expense matching `updatedExpense.id` with the new values. */
  function updateExpense(updatedExpense) {
    commitExpenses(
      expenses.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)),
    )
  }

  /** Appends a batch of expenses, e.g. from an Excel import. */
  function importExpenses(newExpenses) {
    commitExpenses([...expenses, ...newExpenses])
  }

  /** Sets the monthly budget target and persists it. */
  function changeBudget(amount) {
    setBudget(amount)
    saveBudget(amount)
  }

  return { expenses, budget, addExpense, deleteExpense, updateExpense, importExpenses, changeBudget }
}
