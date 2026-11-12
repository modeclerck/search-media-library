// Sous-ensemble des types de Home Assistant utilisés par les cartes
// (évite une dépendance à custom-card-helpers).

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed?: string;
  last_updated?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  locale?: { language?: string; number_format?: string; time_format?: string };
  config?: { unit_system?: { temperature?: string }; time_zone?: string };
  themes?: { darkMode?: boolean };
  localize?: (key: string, ...args: unknown[]) => string;
  callService?: (domain: string, service: string, data?: Record<string, unknown>) => Promise<unknown>;
  callWS?: <T = unknown>(message: Record<string, unknown>) => Promise<T>;
  hassUrl?: (path?: string) => string;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: unknown): void;
}

export const UNAVAILABLE_STATES = new Set(['unavailable', 'unknown']);

export function isUnavailable(entity: HassEntity | undefined): boolean {
  return !entity || UNAVAILABLE_STATES.has(entity.state);
}

/** Déclare la carte dans le sélecteur de cartes de HA (une seule fois). */
export function registerCustomCard(card: { type: string; name: string; description: string; preview?: boolean }): void {
  const w = window as unknown as { customCards?: Array<Record<string, unknown>> };
  w.customCards = w.customCards || [];
  if (!w.customCards.some(c => c.type === card.type)) {
    w.customCards.push({ preview: true, documentationURL: undefined, ...card });
  }
}
