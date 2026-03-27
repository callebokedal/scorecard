import { useTranslation } from 'react-i18next';

const REPO_URL = 'https://github.com/callebokedal/scorecard';

export default function HelpPage() {
  const { t } = useTranslation();

  return (
    <div className="p-4 max-w-lg mx-auto flex flex-col gap-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">{t('nav.help')}</h1>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          {t('help.sourceCode')}
        </a>
      </div>

      <HelpSection title={t('help.gettingStarted.title')}>
        <p>{t('help.gettingStarted.body')}</p>
        <ol className="mt-2 flex flex-col gap-1 list-decimal list-inside text-sm text-gray-600">
          <li>{t('help.gettingStarted.step1')}</li>
          <li>{t('help.gettingStarted.step2')}</li>
          <li>{t('help.gettingStarted.step3')}</li>
        </ol>
      </HelpSection>

      <HelpSection title={t('help.scoring.title')}>
        <p>{t('help.scoring.body')}</p>
      </HelpSection>

      <HelpSection title={t('help.teeShot.title')}>
        <p>{t('help.teeShot.body')}</p>
      </HelpSection>

      <HelpSection title={t('help.leaderboard.title')}>
        <p>{t('help.leaderboard.body')}</p>
      </HelpSection>

      <HelpSection title={t('help.stats.title')}>
        <p>{t('help.stats.body')}</p>
      </HelpSection>

      <HelpSection title={t('help.importExport.title')}>
        <p>{t('help.importExport.body')}</p>
      </HelpSection>
    </div>
  );
}

function HelpSection({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</h2>
      </div>
      <div className="px-4 py-3 text-sm text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
