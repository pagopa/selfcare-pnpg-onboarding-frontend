import i18n from 'i18next';
import '@testing-library/jest-dom';
import { initReactI18next } from 'react-i18next';
import { vi } from 'vitest';
import it from './locale/it';
import de from './locale/de';
import en from './locale/en';
import fr from './locale/fr';
import sl from './locale/sl';

void i18n.use(initReactI18next).init({
    resources: {
        it: { translation: it },
        en: { translation: en },
        de: { translation: de },
        fr: { translation: fr },
        sl: { translation: sl },
    },
    lng: 'it',
    fallbackLng: 'it',
    initImmediate: false,
    interpolation: { escapeValue: false },
});

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => { });
    vi.spyOn(console, 'warn').mockImplementation(() => { });
});
