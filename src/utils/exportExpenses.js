import { formatCurrency } from './format'
import { sumAmounts, sortByDateAsc } from './expenses'

/** Maps an expense to a flat row shape shared by both the Excel and PDF exports. */
function toRow(expense) {
  return {
    date: expense.date,
    description: expense.description,
    category: expense.category,
    necessary: expense.necessary === false ? 'No' : 'Yes',
    amount: expense.amount,
  }
}

/**
 * Downloads `expenses` as an .xlsx spreadsheet (Date, Description, Category,
 * Necessary, Amount columns). Loads the `xlsx` library on demand so it
 * doesn't bloat the app's initial bundle.
 * @param {object[]} expenses
 * @param {string} filename
 */
export async function exportToExcel(expenses, filename) {
  const XLSX = await import('xlsx')

  const rows = sortByDateAsc(expenses).map((expense) => {
    const row = toRow(expense)
    return {
      Date: row.date,
      Description: row.description,
      Category: row.category,
      Necessary: row.necessary,
      'Amount (INR)': row.amount,
    }
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)
  worksheet['!cols'] = [{ wch: 12 }, { wch: 32 }, { wch: 18 }, { wch: 10 }, { wch: 14 }]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses')
  XLSX.writeFile(workbook, filename)
}

/**
 * Downloads `expenses` as a formatted PDF table with a title and total.
 * Loads jsPDF + its autotable plugin on demand.
 * @param {object[]} expenses
 * @param {{title: string, filename: string}} options
 */
export async function exportToPDF(expenses, { title, filename }) {
  const [{ default: JsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const doc = new JsPDF()
  const total = sumAmounts(expenses)

  doc.setFontSize(14)
  doc.text(title, 14, 16)
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(
    `Total: ${formatCurrency(total)}  ·  ${expenses.length} expense${expenses.length === 1 ? '' : 's'}`,
    14,
    23,
  )

  autoTable(doc, {
    startY: 28,
    head: [['Date', 'Description', 'Category', 'Necessary', 'Amount']],
    body: sortByDateAsc(expenses).map((expense) => {
      const row = toRow(expense)
      return [row.date, row.description, row.category, row.necessary, formatCurrency(row.amount)]
    }),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [99, 102, 241] },
  })

  doc.save(filename)
}
