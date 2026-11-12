// Visual editor for the card (Home Assistant's <ha-form>).

import { html, LitElement, nothing } from 'lit';
import type { HomeAssistant } from './shared/ha-types';
import { makeLocalizer } from './shared/localize';
import { ENQUEUE_MODES, FEATURE_SEARCH_MEDIA } from './logic';
import { TRANSLATIONS } from './translations';
import { EDITOR_TAG } from './tags';


const DEFAULTS: Record<string, unknown> = { enqueue: 'replace', min_chars: 2, max_height: 360, show_filters: true, autofocus: false };

type Localizer = ReturnType<typeof makeLocalizer>;

function schema(t: Localizer) {
  return [
    {
      name: 'entity', required: true,
      selector: { entity: { domain: 'media_player', supported_features: [FEATURE_SEARCH_MEDIA] } },
    },
    { name: 'placeholder', selector: { text: {} } },
    {
      name: 'enqueue',
      selector: { select: { mode: 'dropdown', options: ENQUEUE_MODES.map(m => ({ value: m, label: t(`editor.enqueue.${m}`) })) } },
    },
    { name: 'show_filters', selector: { boolean: {} } },
    { name: 'autofocus', selector: { boolean: {} } },
    { name: 'min_chars', selector: { number: { min: 1, max: 5, step: 1, mode: 'box' } } },
    { name: 'max_height', selector: { number: { min: 120, max: 900, step: 20, mode: 'box', unit_of_measurement: 'px' } } },
  ];
}

export class SearchMediaLibraryEditor extends LitElement {
  static override properties = { hass: { attribute: false }, _config: { state: true } };

  declare hass?: HomeAssistant;
  declare _config?: Record<string, unknown>;

  setConfig(config: Record<string, unknown>): void {
    this._config = config;
  }

  protected override render() {
    if (!this.hass || !this._config) return nothing;
    const t = makeLocalizer(TRANSLATIONS, this.hass);
    return html`<ha-form
      .hass=${this.hass}
      .data=${{ ...DEFAULTS, ...this._config }}
      .schema=${schema(t)}
      .computeLabel=${(s: { name: string }) => t(`editor.${s.name}`)}
      @value-changed=${this.valueChanged}
    ></ha-form>`;
  }

  private valueChanged(e: CustomEvent<{ value: Record<string, unknown> }>): void {
    e.stopPropagation();
    const value = { ...e.detail.value };
    // Dans le YAML, seulement ce qui diffère des valeurs par défaut.
    for (const [key, def] of Object.entries(DEFAULTS)) if (value[key] === def) delete value[key];
    for (const [key, v] of Object.entries(value)) if (v === '' || v === undefined) delete value[key];
    this._config = value;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true }));
  }
}

if (!customElements.get(EDITOR_TAG)) customElements.define(EDITOR_TAG, SearchMediaLibraryEditor);
