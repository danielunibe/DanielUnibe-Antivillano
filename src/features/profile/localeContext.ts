import { createContext } from 'react';
import type { Locale, LocalizedText } from './types';
import type { LocaleDictionaryKey } from './locale';

export interface LocaleContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: LocaleDictionaryKey) => string;
    text: (value: LocalizedText) => string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);
