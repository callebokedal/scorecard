/**
 * A labelled (+) value (−) counter row.
 * @param {object} props
 * @param {string} props.label
 * @param {number|null} props.value
 * @param {(v: number) => void} props.onChange
 * @param {number} [props.min]
 * @param {number} [props.max]
 */
export function CounterField({ label, value, onChange, min = 0, max = 99 }) {
  const display = value == null ? '—' : value;

  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, (value ?? 0) - 1))}
          disabled={value == null || value <= min}
          className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 text-xl font-semibold flex items-center justify-center hover:bg-gray-200 active:scale-95 disabled:opacity-30 transition-transform"
        >
          −
        </button>
        <span className="w-7 text-center font-bold text-gray-900 text-xl tabular-nums">
          {display}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, (value ?? 0) + 1))}
          disabled={value != null && value >= max}
          className="w-10 h-10 rounded-full bg-green-100 text-green-700 text-xl font-semibold flex items-center justify-center hover:bg-green-200 active:scale-95 disabled:opacity-30 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  );
}
