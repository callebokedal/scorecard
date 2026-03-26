import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

/**
 * Root layout: top nav + scrollable page content.
 */
export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopNav />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}