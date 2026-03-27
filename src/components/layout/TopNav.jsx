import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Top navigation bar with title and hamburger menu.
 * @param {object} props
 * @param {string} [props.title] - Override the default app title
 * @param {string} [props.subtitle] - Smaller text shown below the title
 * @param {React.ReactNode} [props.leftAction] - Element rendered on the left (e.g. back arrow)
 */
export function TopNav({ title, subtitle, leftAction }) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: t('nav.clubs'), path: '/clubs' },
    { label: t('nav.players'), path: '/players' },
    { label: t('nav.scorecards'), path: '/scorecards' },
    { label: t('nav.settings'), path: '/settings' },
    { label: t('nav.help'), path: '/help' },
  ];

  const handleNav = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="relative">
      <div className="flex items-center justify-between h-14 px-4 bg-green-700 text-white shadow-md">
        {/* Left: back action or spacer */}
        <div className="w-10 flex items-center">
          {leftAction ?? null}
        </div>

        {/* Center: title */}
        <div className="flex flex-col items-center">
          <span className="font-semibold text-lg tracking-wide leading-tight">
            {title ?? t('nav.title')}
          </span>
          {subtitle && (
            <span className="text-xs text-green-200 leading-tight">{subtitle}</span>
          )}
        </div>

        {/* Right: hamburger */}
        <button
          className="w-10 h-10 flex flex-col justify-center items-center gap-1.5"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Open menu"
        >
          <span className="block w-6 h-0.5 bg-white rounded" />
          <span className="block w-6 h-0.5 bg-white rounded" />
          <span className="block w-6 h-0.5 bg-white rounded" />
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute right-0 top-full z-20 w-52 bg-white shadow-lg rounded-bl-lg border border-gray-100">
            {navItems.map((item) => (
              <button
                key={item.path}
                className="w-full text-left px-5 py-3 text-gray-800 hover:bg-green-50 hover:text-green-700 font-medium transition-colors"
                onClick={() => handleNav(item.path)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}