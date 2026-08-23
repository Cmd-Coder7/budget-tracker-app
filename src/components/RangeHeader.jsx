/**
 * Presentational prev/next header used by both MonthSelector and YearSelector.
 * @param {string} label - Text shown between the two nav buttons.
 * @param {() => void} onPrevious - Called when the "‹" button is clicked.
 * @param {() => void} onNext - Called when the "›" button is clicked.
 * @param {string} previousLabel - Accessible label for the "‹" button.
 * @param {string} nextLabel - Accessible label for the "›" button.
 */
export default function RangeHeader({ label, onPrevious, onNext, previousLabel, nextLabel }) {
  return (
    <div className="month-selector">
      <button className="btn-nav" onClick={onPrevious} aria-label={previousLabel}>
        ‹
      </button>
      <h1>{label}</h1>
      <button className="btn-nav" onClick={onNext} aria-label={nextLabel}>
        ›
      </button>
    </div>
  )
}
