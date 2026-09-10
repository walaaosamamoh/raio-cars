import { createI18n } from 'vue-i18n';

import en from './locales/en.json'
import ar from './locales/ar.json'

const savedLang = localStorage.getItem('language') || 'en';

const i18n = createI18n({
  locale: savedLang,
  fallbackLocale: 'en',
  messages:{en,ar},
  legacy: false,
  globalInjection: true,
  missingWarn: true,
  fallbackWarn: true,
});

export default i18n;
