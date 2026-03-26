import { useParams, useNavigate } from 'react-router-dom';
import { useScorecardsStore } from '../store/scorecards.store';
import { TopNav } from '../components/layout/TopNav';
import { formatDate } from '../utils/scorecard.utils';

export default function ScorecardDetailPage() {
  const { scorecardId } = useParams();
  const navigate = useNavigate();
  const scorecards = useScorecardsStore((s) => s.scorecards);
  const sc = scorecards.find((s) => s.id === scorecardId);

  const backArrow = (
    <button
      onClick={() => navigate('/scorecards')}
      className="text-white text-xl leading-none px-1"
      aria-label="Back"
    >
      ←
    </button>
  );

  if (!sc) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopNav title="Not found" leftAction={backArrow} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNav
        title={`${sc.name} · ${formatDate(sc.date)}`}
        leftAction={backArrow}
      />
      <main className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Scorecard entry coming in next step…
      </main>
    </div>
  );
}
