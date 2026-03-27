import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../store/settings.store';
import { useClubsStore } from '../store/clubs.store';
import { usePlayersStore } from '../store/players.store';
import { useScorecardsStore } from '../store/scorecards.store';
import { exportJSON, exportYAML, importFile, mergeById } from '../services/importExport.service';
import { saveClubs, loadClubs } from '../services/clubs.service';
import { savePlayers, loadPlayers } from '../services/players.service';
import { saveScorecards, loadScorecards } from '../services/scorecards.service';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { theme, setTheme, language, setLanguage } = useSettingsStore();

  return (
    <div className="p-4 max-w-lg mx-auto flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-800">{t('settings.title')}</h1>

      {/* Language */}
      <Section title={t('settings.language')}>
        <SegmentedControl
          options={[
            { value: 'en', label: 'English' },
            { value: 'sv', label: 'Svenska' },
          ]}
          value={language}
          onChange={setLanguage}
        />
      </Section>

        {/*

      {/* Theme */}
      {false && (
      <Section title={t('settings.theme')}>
        <SegmentedControl
          options={[
            { value: 'light', label: t('settings.themeLight') },
            { value: 'dark', label: t('settings.themeDark') },
          ]}
          value={theme}
          onChange={setTheme}
        />
        {theme === 'dark' && (
          <p className="text-xs text-gray-400 mt-2">
            Full dark mode styling is work in progress.
          </p>
        )}
      </Section>
      )}

      {/* Data – Clubs */}
      {false && (<Section title="Clubs">
        <DataRow
          label={t('settings.exportClubs')}
          onExportJSON={() => exportJSON(loadClubs(), 'scorecard-clubs')}
          onExportYAML={() => exportYAML(loadClubs(), 'scorecard-clubs')}
          onImport={async (file) => {
            const data = await importFile(file);
            const merged = mergeById(loadClubs(), data);
            saveClubs(merged);
            useClubsStore.setState({ clubs: merged });
          }}
          entity={t('nav.clubs').toLowerCase()}
        />
      </Section>
      )}

      {/* Data – Players */}
      {false && (<Section title="Players">
        <DataRow
          label={t('settings.exportPlayers')}
          onExportJSON={() => exportJSON(loadPlayers(), 'scorecard-players')}
          onExportYAML={() => exportYAML(loadPlayers(), 'scorecard-players')}
          onImport={async (file) => {
            const data = await importFile(file);
            const merged = mergeById(loadPlayers(), data);
            savePlayers(merged);
            usePlayersStore.setState({ players: merged });
          }}
          entity={t('nav.players').toLowerCase()}
        />
      </Section>
      )}

      {/* Data – Scorecards */}
      <Section title="Scorecards">
        <DataRow
          label={t('settings.exportScorecards')}
          onExportJSON={() => exportJSON(loadScorecards(), 'scorecard-rounds')}
          onExportYAML={() => exportYAML(loadScorecards(), 'scorecard-rounds')}
          onImport={async (file) => {
            const data = await importFile(file);
            const merged = mergeById(loadScorecards(), data);
            saveScorecards(merged);
            useScorecardsStore.setState({ scorecards: merged });
          }}
          entity={t('nav.scorecards').toLowerCase()}
        />
      </Section>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</h2>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

/**
 * @param {object} props
 * @param {{ value: string, label: string }[]} props.options
 * @param {string} props.value
 * @param {(v: string) => void} props.onChange
 */
function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex rounded-lg overflow-hidden border border-gray-200">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            value === opt.value
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Export (JSON + YAML) and import row for one entity type.
 * @param {object} props
 * @param {string} props.label
 * @param {() => void} props.onExportJSON
 * @param {() => void} props.onExportYAML
 * @param {(file: File) => Promise<void>} props.onImport
 * @param {string} props.entity - Entity name for confirm dialog
 */
function DataRow({ label, onExportJSON, onExportYAML, onImport, entity }) {
  const { t } = useTranslation();
  const fileRef = useRef(null);
  const [status, setStatus] = useState(null); // 'ok' | 'error' | null

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const confirmed = window.confirm(t('settings.confirmImportMerge', { entity }));
    if (!confirmed) return;

    try {
      await onImport(file);
      setStatus('ok');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700 flex-1">{label}</span>
        <button
          onClick={onExportJSON}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          JSON
        </button>
        <button
          onClick={onExportYAML}
          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          YAML
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-green-500 hover:text-green-600"
        >
          Import JSON / YAML…
        </button>
        {status === 'ok' && (
          <span className="text-xs text-green-600 font-medium">{t('settings.importSuccess')} ✓</span>
        )}
        {status === 'error' && (
          <span className="text-xs text-red-500 font-medium">{t('settings.importError')} ✕</span>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".json,.yaml,.yml"
          className="hidden"
          onChange={handleImport}
        />
      </div>
    </div>
  );
}
