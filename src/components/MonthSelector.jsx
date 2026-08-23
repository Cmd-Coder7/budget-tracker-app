import RangeHeader from './RangeHeader'
import { MONTH_NAMES } from '../constants'

/**
 * Prev/next header for stepping through a specific month + year.
 * Wraps December -> January (and back) across a year boundary.
 * @param {number} year
 * @param {number} month - 0-indexed (0 = January).
 * @param {(year: number, month: number) => void} onChange
 */
export default function MonthSelector({ year, month, onChange }) {
  /** Moves `delta` months forward/backward, rolling the year over as needed. */
  function shift(delta) {
    let newMonth = month + delta
    let newYear = year
    if (newMonth < 0) {
      newMonth = 11
      newYear -= 1
    } else if (newMonth > 11) {
      newMonth = 0
      newYear += 1
    }
    onChange(newYear, newMonth)
  }

  return (
    <RangeHeader
      label={`${MONTH_NAMES[month]} ${year}`}
      onPrevious={() => shift(-1)}
      onNext={() => shift(1)}
      previousLabel="Previous month"
      nextLabel="Next month"
    />
  )
}
