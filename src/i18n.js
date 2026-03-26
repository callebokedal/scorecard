import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        title: 'Golf Scorecard',
        clubs: 'Clubs',
        players: 'Players',
        scorecards: 'Scorecards',
        settings: 'Settings',
      },
    },
  },
  sv: {
    translation: {
      nav: {
        title: 'Golf Scorecard',
        clubs: 'Klubbar',
        players: 'Spelare',
        scorecards: 'Scorekort',
        settings: 'Inställningar',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;