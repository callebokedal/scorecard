/**
 * A labelled chip/pill button that increments a count on tap.
 * Shows a (−) button when count > 0.
 * @param {object} props
 * @param {string} props.label
 * @param {number} props.value
 * @param {(v: number) => void} props.onChange
 */
export function ChipCounter({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors active:scale-95 ${
          value > 0
            ? 'bg-amber-100 text-amber-800'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        {label}
        {value > 0 && (
          <span className="bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {value}
          </span>
        )}
      </button>
      {value > 0 && (
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-sm flex items-center justify-center hover:bg-gray-300 active:scale-95"
          aria-label={`Remove ${label}`}
        >
          −
        </button>
      )}
    </div>
  );
}
