// Traductions : français et anglais au minimum. Les libellés de HA sont
// réutilisés quand ils existent (voir `haLabel`).

import type { HomeAssistant } from './ha-types';

export type Dictionary = Record<string, string>;
export type Translations = { en: Dictionary; fr: Dictionary; [lang: string]: Dictionary };

export function languageOf(hass?: HomeAssistant): string {
  return (hass?.locale?.language || hass?.language || globalThis.navigator?.language || 'en').toLowerCase();
}

export function makeLocalizer(translations: Translations, hass?: HomeAssistant) {
  const lang = languageOf(hass);
  const dict = translations[lang] || translations[lang.split('-')[0]] || translations.en;
  return (key: string, vars: Record<string, string | number> = {}): string => {
    const template = dict[key] ?? translations.en[key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? ''));
  };
}

/** Libellé traduit par HA lui-même, sinon le repli fourni. */
export function haLabel(hass: HomeAssistant | undefined, key: string, fallback: string): string {
  const value = hass?.localize?.(key);
  return value && value !== key ? value : fallback;
}
