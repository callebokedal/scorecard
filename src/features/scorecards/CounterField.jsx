/**
 * A labelled (+) value (−) counter row.
 * @param {object} props
 * @param {string} props.label
 * @param {number|null} props.value
 * @param {(v: number) => void} props.onChange
 * @param {number} [props.min]
 * @param {number} [props.max]
 * @param {boolean} [props.nullable] - When true, decrementing below min sets value to null
 * @param {() => void} [props.onSkip] - When provided, shows a skip (—) button to the left of minus
 * @param {() => void} [props.onValueClick] - When provided, the value is tappable (e.g. opens a quick-entry modal)
 */
export function CounterField({ label, value, onChange, min = 0, max = 99, nullable = false, onSkip, onValueClick }) {
  const display = value == null ? '—' : value;
  const isSkipped = value == null;

  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-4">
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
              isSkipped
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-red-400 hover:bg-red-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </button>
        )}
        <button
          type="button"
          onClick={() => nullable && value === min ? onChange(null) : onChange(Math.max(min, (value ?? 0) - 1))}
          disabled={isSkipped || value == null || (value <= min && !nullable)}
          className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 text-xl font-semibold flex items-center justify-center hover:bg-gray-200 active:scale-95 disabled:opacity-30 transition-transform cursor-pointer"
        >
          −
        </button>
        {onValueClick ? (
          <button
            type="button"
            onClick={onValueClick}
            className="w-7 text-center font-bold text-gray-900 text-xl tabular-nums hover:text-green-700 cursor-pointer"
          >
            {display}
          </button>
        ) : (
          <span className="w-7 text-center font-bold text-gray-900 text-xl tabular-nums">
            {display}
          </span>
        )}
        <button
          type="button"
          onClick={() => onChange(Math.min(max, (value ?? 0) + 1))}
          disabled={value != null && value >= max}
          className="w-10 h-10 rounded-full bg-green-100 text-green-700 text-xl font-semibold flex items-center justify-center hover:bg-green-200 active:scale-95 disabled:opacity-30 transition-transform cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}
