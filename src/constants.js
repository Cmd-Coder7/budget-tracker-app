/** Full month names, January first, for building calendar labels and dropdowns. */
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** The preset expense categories offered in the add-expense form and filters. */
export const CATEGORIES = [
  'Food',
  'Groceries',
  'Rent',
  'Utilities',
  'Transport',
  'Shopping',
  'Health',
  'Entertainment',
  'Subscriptions',
  'Investment',
  'Self Development',
  'Education',
  'Savings',
  'Other',
]

/** Accent color used for each category's dot/bar/badge across the UI. */
export const CATEGORY_COLORS = {
  Food: '#f97316',
  Groceries: '#22c55e',
  Rent: '#8b5cf6',
  Utilities: '#06b6d4',
  Transport: '#3b82f6',
  Shopping: '#ec4899',
  Health: '#ef4444',
  Entertainment: '#eab308',
  Subscriptions: '#14b8a6',
  Investment: '#6366f1',
  'Self Development': '#a855f7',
  Education: '#0ea5e9',
  Savings: '#84cc16',
  Other: '#94a3b8',
}

/**
 * Returns the display color for a category, falling back to the "Other" color
 * for categories outside the preset list (e.g. a custom category from an Excel import).
 */
export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other
}
