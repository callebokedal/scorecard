import { useState } from 'react';
import { HoleEntryForm } from './HoleEntryForm';
import { ScoreQuickEntryModal } from './ScoreQuickEntryModal';
import {
  calcPlayingHcp,
  hcpStrokesOnHole,
  calcStablefordPoints,
} from '../../utils/scorecard.utils';

/**
 * Collapsible accordion for one player's hole entry.
 * @param {object} props
 * @param {import('../../types/models').ScorecardPlayer} props.player
 * @param {import('../../types/models').HoleScore} props.holeScore
 * @param {import('../../types/models').HoleInfo|null} props.holeInfo - null if no course selected
 * @param {number|null} props.courseSlope
 * @param {boolean} props.expanded
 * @param {() => void} props.onToggle
 * @param {(updates: Partial<import('../../types/models').HoleScore>) => void} props.onChange
 * @param {boolean} [props.hasMissingScores]
 */
export function PlayerAccordion({
  player,
  holeScore,
  holeInfo,
  courseSlope,
  expanded,
  onToggle,
  onChange,
  hasMissingScores,
}) {
  const [quickEntryOpen, setQuickEntryOpen] = useState(false);

  const playingHcp =
    courseSlope != null ? calcPlayingHcp(player.hcp, courseSlope) : null;

  const hcpStrokes =
    playingHcp != null && holeInfo
      ? hcpStrokesOnHole(playingHcp, holeInfo.slopeIndex, holeInfo.holeNumber <= 9 ? 9 : 18)
      : 0;

  const points =
    holeScore.strokes != null && holeInfo
      ? calcStablefordPoints(holeScore.strokes, holeInfo.par, hcpStrokes)
      : null;

  return (
    <>
      <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-3 text-left bg-green-700 cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-white truncate">{player.name}</span>
            {hasMissingScores && (
              <svg className="shrink-0 text-amber-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            )}
            {hcpStrokes > 0 && (
              <span className="shrink-0 text-xs bg-white/20 text-white font-medium px-1.5 py-0.5 rounded-full">
                +{hcpStrokes}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-2">
            {holeScore.skipped ? (
              <span className="font-bold text-white/60 text-lg tabular-nums">—</span>
            ) : holeScore.strokes != null ? (
              <div className="text-right">
                <span className="font-bold text-white text-lg tabular-nums">
                  {holeScore.strokes}
                </span>
                {points != null && (
                  <span className="ml-1.5 text-sm font-medium text-green-100">
                    ({points}p)
                  </span>
                )}
              </div>
            ) : null}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setQuickEntryOpen(true); }}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 text-white text-sm flex items-center justify-center cursor-pointer transition-colors shrink-0"
              aria-label="Quick score entry"
            >
              ✏
            </button>
            <span
              className={`text-white/70 transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            >
              ▾
            </span>
          </div>
        </button>

        {/* Body */}
        {expanded && (
          <div className="border-t border-gray-100">
            <HoleEntryForm holeScore={holeScore} onChange={onChange} />
          </div>
        )}
      </div>

      {quickEntryOpen && (
        <ScoreQuickEntryModal
          playerName={player.name}
          holeScore={holeScore}
          onChange={onChange}
          onClose={() => setQuickEntryOpen(false)}
        />
      )}
    </>
  );
}
