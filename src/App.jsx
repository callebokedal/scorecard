import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import ClubsPage from './pages/ClubsPage';
import PlayersPage from './pages/PlayersPage';
import ScorecardsPage from './pages/ScorecardsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/scorecards" replace />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/scorecards" element={<ScorecardsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}