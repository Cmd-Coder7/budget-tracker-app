const WIDTH = 640
const HEIGHT = 260
const MARGIN_LEFT = 56
const MARGIN_RIGHT = 12
const MARGIN_TOP = 16
const MARGIN_BOTTOM = 34
const CHART_WIDTH = WIDTH - MARGIN_LEFT - MARGIN_RIGHT
const CHART_HEIGHT = HEIGHT - MARGIN_TOP - MARGIN_BOTTOM
const GRID_FRACTIONS = [0.25, 0.5, 0.75, 1]

/**
 * Simple SVG vertical bar chart with gridlines, axis labels, and hover
 * tooltips. Deliberately dependency-free (no charting library) to keep the
 * bundle small.
 * @param {{label: string, value: number}[]} data - One bar per entry.
 * @param {string} [color] - Fill color (CSS color string) for every bar.
 * @param {(value: number) => string} [formatValue] - Formats axis labels and tooltip values.
 */
export default function BarChart({ data, color = '#6366f1', formatValue = (v) => v }) {
  const maxValue = Math.max(...data.map((d) => d.value), 0)
  const scaleMax = maxValue === 0 ? 1 : maxValue
  const barSlot = CHART_WIDTH / data.length
  const barWidth = barSlot * 0.55
  const baselineY = MARGIN_TOP + CHART_HEIGHT

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="bar-chart"
      role="img"
      aria-label="Monthly breakdown chart"
    >
      {GRID_FRACTIONS.map((fraction) => {
        const y = MARGIN_TOP + CHART_HEIGHT * (1 - fraction)
        return (
          <g key={fraction}>
            <line
              x1={MARGIN_LEFT}
              x2={WIDTH - MARGIN_RIGHT}
              y1={y}
              y2={y}
              className="bar-chart-gridline"
            />
            <text x={MARGIN_LEFT - 8} y={y + 4} textAnchor="end" className="bar-chart-axis-label">
              {formatValue(scaleMax * fraction)}
            </text>
          </g>
        )
      })}

      <line
        x1={MARGIN_LEFT}
        x2={WIDTH - MARGIN_RIGHT}
        y1={baselineY}
        y2={baselineY}
        className="bar-chart-baseline"
      />

      {data.map((d, i) => {
        const barHeight = (d.value / scaleMax) * CHART_HEIGHT
        const x = MARGIN_LEFT + i * barSlot + (barSlot - barWidth) / 2
        const y = baselineY - barHeight

        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={3}
              style={{ fill: color }}
            >
              <title>{`${d.label}: ${formatValue(d.value)}`}</title>
            </rect>
            <text
              x={x + barWidth / 2}
              y={baselineY + 18}
              textAnchor="middle"
              className="bar-chart-x-label"
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
