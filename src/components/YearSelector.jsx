import RangeHeader from './RangeHeader'

/**
 * Prev/next header for stepping through a single year.
 * @param {number} year
 * @param {(year: number) => void} onChange
 */
export default function YearSelector({ year, onChange }) {
  return (
    <RangeHeader
      label={year}
      onPrevious={() => onChange(year - 1)}
      onNext={() => onChange(year + 1)}
      previousLabel="Previous year"
      nextLabel="Next year"
    />
  )
}
