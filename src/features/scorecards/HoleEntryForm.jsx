import { useTranslation } from 'react-i18next';
import { CounterField } from './CounterField';
import { TeeShotNavigator } from './TeeShotNavigator';
import { ChipCounter } from './ChipCounter';

/**
 * Full hole entry form for a single player.
 * @param {object} props
 * @param {import('../../types/models').HoleScore} props.holeScore
 * @param {(updates: Partial<import('../../types/models').HoleScore>) => void} props.onChange
 * @param {() => void} [props.onStrokeClick] - Opens quick score entry modal when strokes value is tapped
 */
export function HoleEntryForm({ holeScore, onChange, onStrokeClick }) {
  const { t } = useTranslation();
  const h = holeScore;

  return (
    <div>
      <div className="px-4">
        <CounterField
          label={t('scorecard.score')}
          value={h.strokes}
          min={0}
          max={20}
          onChange={(v) => onChange({ strokes: v, skipped: false })}
          onSkip={() => onChange({ strokes: null, skipped: true })}
          onValueClick={onStrokeClick}
        />
      </div>

      <div className="bg-gray-50 px-4 border-t border-gray-100">
        <CounterField
          label={t('scorecard.putts')}
          value={h.putts}
          min={0}
          max={10}
          nullable
          onChange={(v) => onChange({ putts: v })}
        />
      </div>

      <div className="mt-0 pt-2 border-t border-gray-100 bg-gray-50 px-4">
        <TeeShotNavigator
          value={h.teeShot}
          onChange={(v) => onChange({ teeShot: v })}
          club={h.teeClub}
          onClubChange={(v) => onChange({ teeClub: v })}
        />
      </div>

      <div className="mt-0 pt-3 border-t border-gray-100 bg-gray-50 px-4 pb-3">
        <span className="text-sm font-medium text-gray-700 block mb-2">{t('scorecard.bunkers')}</span>
        <div className="flex flex-wrap gap-2">
          <ChipCounter
            label={t('scorecard.nearGreen')}
            value={h.bunkersNearGreen}
            onChange={(v) => onChange({ bunkersNearGreen: v })}
          />
          <ChipCounter
            label={t('scorecard.fairway')}
            value={h.bunkersFairway}
            onChange={(v) => onChange({ bunkersFairway: v })}
          />
          <ChipCounter
            label={t('scorecard.other')}
            value={h.bunkersOther}
            onChange={(v) => onChange({ bunkersOther: v })}
          />
        </div>
      </div>

      <div className="mt-0 pt-3 border-t border-gray-100 bg-gray-50 px-4 pb-3">
        <span className="text-sm font-medium text-gray-700 block mb-2">{t('scorecard.penalties')}</span>
        <div className="flex flex-wrap gap-2">
          <ChipCounter
            label={t('scorecard.water')}
            value={h.penaltiesWater}
            onChange={(v) => onChange({ penaltiesWater: v })}
          />
          <ChipCounter
            label={t('scorecard.oob')}
            value={h.penaltiesOOB}
            onChange={(v) => onChange({ penaltiesOOB: v })}
          />
          <ChipCounter
            label={t('scorecard.other')}
            value={h.penaltiesOther}
            onChange={(v) => onChange({ penaltiesOther: v })}
          />
        </div>
      </div>
    </div>
  );
}
