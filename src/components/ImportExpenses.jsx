import { useState } from 'react'
import { parseExpenseFile } from '../utils/importExpenses'

/** Builds the user-facing summary line after a parse attempt (e.g. "Imported 18 of 20 rows (2 skipped)."). */
function buildStatusMessage(imported, skipped, total) {
  if (imported.length === 0) {
    return 'No valid rows found. Make sure the sheet has Date and Amount columns.'
  }
  const skippedNote = skipped ? ` (${skipped} skipped)` : ''
  return `Imported ${imported.length} of ${total} row${total === 1 ? '' : 's'}${skippedNote}.`
}

/**
 * File-upload card for bulk-importing expenses from an Excel/CSV spreadsheet.
 * @param {(expenses: object[]) => void} onImport - Called with the successfully parsed rows.
 */
export default function ImportExpenses({ onImport }) {
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleFileChange(event) {
    const file = event.target.files[0]
    if (!file) return

    setIsLoading(true)
    setStatus(null)

    try {
      const { imported, skipped, total } = await parseExpenseFile(file)

      if (imported.length > 0) {
        onImport(imported)
      }

      setStatus({
        type: imported.length > 0 ? 'success' : 'error',
        message: buildStatusMessage(imported, skipped, total),
      })
    } catch {
      setStatus({
        type: 'error',
        message: 'Could not read that file. Please upload a valid .xlsx, .xls or .csv file.',
      })
    } finally {
      setIsLoading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="card import-card">
      <h2>Import from Excel</h2>
      <p className="import-hint">
        Upload a spreadsheet with <strong>Date</strong>, <strong>Description</strong>,{' '}
        <strong>Category</strong> and <strong>Amount</strong> columns — expenses land in the
        right month automatically.
      </p>
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      {status && <p className={`import-status ${status.type}`}>{status.message}</p>}
    </div>
  )
}
