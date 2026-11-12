// custom:search-media-library — search your media library with live results.
//
// Calls `media_player.search_media` (the service returns its response) on the
// chosen player; tapping a result calls `media_player.play_media`.
//
// UI: official Home Assistant components (`ha-input-search`, `ha-spinner`,
// `ha-skeleton*`, `ha-alert`) and `--ha-*` design tokens, following
// https://contributors.home-assistant.io/design/. Needs HA 2026.4 or newer (`ha-input`).

import { css, html, LitElement, nothing, type PropertyValues } from 'lit';
import {
  mdiAccountMusic, mdiAlbum, mdiBookOpenVariant, mdiCheck, mdiMagnifyRemoveOutline, mdiMusicBox,
  mdiMusicNote, mdiPlay, mdiPlaylistMusic, mdiPodcast, mdiRadio,
} from '@mdi/js';
import { icon } from './shared/components';
import { isUnavailable, registerCustomCard, type HomeAssistant } from './shared/ha-types';
import { makeLocalizer } from './shared/localize';
import {
  groupResults, normalizeQuery, parseResults, presentKinds, SearchCache, searchTypesFor, supportsSearch,
  type Enqueue, type Kind, type SearchItem,
} from './logic';
import { TRANSLATIONS } from './translations';
import { CARD_NAME, CARD_TAG, CARD_VERSION, EDITOR_TAG, IS_DEV_BUILD } from './tags';
import './search-media-library-editor';

export interface MediaSearchConfig {
  type: string;
  entity: string;
  placeholder?: string;
  enqueue?: Enqueue;
  min_chars?: number;
  debounce?: number;
  max_height?: number;
  show_filters?: boolean;
  autofocus?: boolean;
}

const DEFAULTS = { enqueue: 'replace' as Enqueue, min_chars: 2, debounce: 350, max_height: 360, show_filters: true, autofocus: false };
type Resolved = MediaSearchConfig & typeof DEFAULTS;

type Status = 'idle' | 'loading' | 'done' | 'error';
type Localizer = ReturnType<typeof makeLocalizer>;

const KIND_ICONS: Record<Kind, string> = {
  radio: mdiRadio, artist: mdiAccountMusic, album: mdiAlbum, track: mdiMusicNote,
  playlist: mdiPlaylistMusic, podcast: mdiPodcast, audiobook: mdiBookOpenVariant, other: mdiMusicBox,
};

/** Durée du coche de confirmation sur la ligne lancée. */
const FLASH_MS = 1800;
/** Un spinner n'apparaît qu'après ce délai : un chargement rapide ne le fait jamais clignoter. */
const SPINNER_DELAY_MS = 500;

export class SearchMediaLibrary extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _query: { state: true },
    _status: { state: true },
    _items: { state: true },
    _filter: { state: true },
    _flash: { state: true },
    _spinner: { state: true },
  };

  declare hass?: HomeAssistant;
  declare _config?: Resolved;
  declare _query: string;
  declare _status: Status;
  declare _items: SearchItem[];
  declare _filter: Kind | null;
  declare _flash?: string;
  declare _spinner: boolean;

  private timer?: number;
  private flashTimer?: number;
  private spinnerTimer?: number;
  /** Numéro de la dernière recherche voulue : toute réponse plus ancienne est ignorée. */
  private seq = 0;
  private readonly cache = new SearchCache<SearchItem[]>();
  private cachePlayer?: string;

  constructor() {
    super();
    this._query = '';
    this._status = 'idle';
    this._items = [];
    this._filter = null;
    this._spinner = false;
  }

  // ── API Lovelace ─────────────────────────────────────────────────────────

  setConfig(config: MediaSearchConfig): void {
    if (!config || typeof config.entity !== 'string' || !config.entity.startsWith('media_player.')) {
      throw new Error(makeLocalizer(TRANSLATIONS, this.hass)('error.entity'));
    }
    const resolved = { ...DEFAULTS, ...config } as Resolved;
    const num = (v: unknown, def: number, min: number) => (Number.isFinite(Number(v)) && Number(v) >= min ? Number(v) : def);
    resolved.min_chars = Math.floor(num(resolved.min_chars, DEFAULTS.min_chars, 1));
    resolved.debounce = num(resolved.debounce, DEFAULTS.debounce, 0);
    resolved.max_height = num(resolved.max_height, DEFAULTS.max_height, 120);
    if (!['play', 'replace', 'next', 'add'].includes(resolved.enqueue)) resolved.enqueue = DEFAULTS.enqueue;
    if (this._config && this._config.entity !== resolved.entity) this.resetSearch();
    this._config = resolved;
  }

  getCardSize(): number {
    return 6;
  }

  getGridOptions() {
    return { columns: 12, rows: 'auto', min_columns: 6 };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TAG);
  }

  static getStubConfig(hass?: HomeAssistant): Partial<MediaSearchConfig> {
    const states = hass?.states ?? {};
    const first = Object.keys(states).find(id => id.startsWith('media_player.') && supportsSearch(states[id].attributes));
    return { entity: first ?? 'media_player.' };
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearTimeout(this.timer);
    window.clearTimeout(this.flashTimer);
    window.clearTimeout(this.spinnerTimer);
    this.seq++; // une réponse tardive ne touche plus une carte détachée
  }

  protected override firstUpdated(): void {
    if (this._config?.autofocus) void this.focusField();
  }

  protected override willUpdate(changed: PropertyValues): void {
    // Un autre lecteur a un autre catalogue : le cache ne vaut plus.
    if (changed.has('_config') && this._config && this.cachePlayer !== this._config.entity) {
      this.cache.clear();
      this.cachePlayer = this._config.entity;
    }
  }

  private get field(): (HTMLElement & { value: string; focus(): void }) | null {
    return this.renderRoot.querySelector('ha-input-search');
  }

  private async focusField(): Promise<void> {
    await customElements.whenDefined('ha-input-search');
    this.field?.focus();
  }

  // ── Recherche ────────────────────────────────────────────────────────────

  private get player() {
    return this._config ? this.hass?.states?.[this._config.entity] : undefined;
  }

  private onInput = (e: Event): void => {
    this._query = (e.target as HTMLInputElement).value ?? '';
    this.schedule();
  };

  private stopSpinner(): void {
    window.clearTimeout(this.spinnerTimer);
    this._spinner = false;
  }

  private schedule(): void {
    const config = this._config;
    if (!config) return;
    window.clearTimeout(this.timer);
    const seq = ++this.seq;
    const q = normalizeQuery(this._query);
    this._filter = null;
    if (q.length < config.min_chars) {
      this.stopSpinner();
      this._status = 'idle';
      this._items = [];
      return;
    }
    const cached = this.cache.get(q);
    if (cached) {
      this.stopSpinner();
      this._items = cached;
      this._status = 'done';
      return;
    }
    this._status = 'loading';
    if (!this._spinner) {
      window.clearTimeout(this.spinnerTimer);
      this.spinnerTimer = window.setTimeout(() => {
        if (this._status === 'loading') this._spinner = true;
      }, SPINNER_DELAY_MS);
    }
    this.timer = window.setTimeout(() => void this.search(q, seq), config.debounce);
  }

  private async search(q: string, seq: number): Promise<void> {
    const entity = this._config?.entity;
    if (!entity || !this.hass?.callWS) return;
    const hass = this.hass;
    const call = async (type?: string): Promise<unknown[]> => {
      const res = await hass.callWS!<{ response?: Record<string, { result?: unknown }> }>({
        type: 'call_service',
        domain: 'media_player',
        service: 'search_media',
        target: { entity_id: entity },
        service_data: { search_query: q, ...(type ? { media_content_type: type } : {}) },
        return_response: true,
      });
      const result = res?.response?.[entity]?.result;
      return Array.isArray(result) ? result : [];
    };
    try {
      const types = searchTypesFor(hass.entities?.[entity]?.platform);
      let raw: unknown[];
      if (types) {
        // Une recherche par type, en parallèle ; un type qui échoue n'empêche pas les autres.
        const settled = await Promise.allSettled(types.map(t => call(t)));
        const ok = settled.filter((s): s is PromiseFulfilledResult<unknown[]> => s.status === 'fulfilled');
        if (!ok.length) throw (settled[0] as PromiseRejectedResult).reason;
        raw = ok.flatMap(s => s.value);
      } else {
        raw = await call();
      }
      if (seq !== this.seq) return;
      const items = parseResults(raw);
      this.cache.set(q, items);
      this._items = items;
      this._status = 'done';
    } catch (err) {
      if (seq !== this.seq) return;
      console.warn('[search-media-library] recherche échouée', err);
      this._items = [];
      this._status = 'error';
    } finally {
      // Le chargement finit toujours : contenu, état vide ou erreur, jamais un spinner qui tourne dans le vide.
      if (seq === this.seq) this.stopSpinner();
    }
  }

  private resetSearch(): void {
    window.clearTimeout(this.timer);
    this.seq++;
    this.stopSpinner();
    this._query = '';
    this._items = [];
    this._status = 'idle';
    this._filter = null;
    if (this.field) this.field.value = '';
  }

  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this._query) {
      e.preventDefault();
      e.stopPropagation(); // ne ferme pas le pop-up quand on efface seulement le champ
      this.resetSearch();
    } else if (e.key === 'Enter') {
      // Entrée = chercher tout de suite, sans attendre le délai.
      const q = normalizeQuery(this._query);
      if (this._config && q.length >= this._config.min_chars && this._status === 'loading') {
        window.clearTimeout(this.timer);
        void this.search(q, this.seq);
      }
    }
  };

  // ── Lecture ──────────────────────────────────────────────────────────────

  private async play(item: SearchItem): Promise<void> {
    if (!this._config || !this.hass?.callService) return;
    try {
      await this.hass.callService('media_player', 'play_media', {
        entity_id: this._config.entity,
        media_content_id: item.contentId,
        media_content_type: item.contentType,
        enqueue: this._config.enqueue,
      });
      this._flash = item.contentId;
      window.clearTimeout(this.flashTimer);
      this.flashTimer = window.setTimeout(() => (this._flash = undefined), FLASH_MS);
    } catch (err) {
      console.warn('[search-media-library] lecture échouée', err);
      // Un échec d'action passe par un toast de HA (≥ 4 s, annoncé poliment).
      this.dispatchEvent(new CustomEvent('hass-notification', {
        bubbles: true,
        composed: true,
        detail: { message: makeLocalizer(TRANSLATIONS, this.hass)('play.failed') },
      }));
    }
  }

  // ── Rendu ────────────────────────────────────────────────────────────────

  protected override render() {
    const config = this._config;
    if (!config) return nothing;
    const t = makeLocalizer(TRANSLATIONS, this.hass);
    const player = this.player;
    const blocked = !player || isUnavailable(player) ? t('search.unavailable')
      : !supportsSearch(player.attributes) ? t('search.unsupported')
        : undefined;
    const kinds = presentKinds(this._items);
    const idle = this._status === 'idle' && !blocked;

    return html`
      <ha-card style="--ms-max-height: ${config.max_height}px">
        <div class="head">
          <ha-input-search
            appearance="outlined"
            .value=${this._query}
            placeholder=${config.placeholder ?? t('search.placeholder')}
            accessible-label=${t('search.label')}
            hint=${idle ? t('search.hint', { n: config.min_chars }) : ''}
            ?disabled=${!!blocked}
            enterkeyhint="search"
            @input=${this.onInput}
            @keydown=${this.onKeydown}
          >
            ${this._spinner ? html`<ha-spinner slot="end" size="tiny" aria-label=${t('search.loading')}></ha-spinner>` : nothing}
          </ha-input-search>
          ${config.show_filters && kinds.length > 1 ? this.renderFilters(kinds, t) : nothing}
        </div>
        ${blocked ? html`<div class="msg"><ha-alert alert-type="warning">${blocked}</ha-alert></div>` : this.renderBody(t)}
      </ha-card>
    `;
  }

  private renderFilters(kinds: Kind[], t: Localizer) {
    const chip = (kind: Kind | null, label: string) => html`
      <button class="chip ${this._filter === kind ? 'on' : ''}" aria-pressed=${this._filter === kind}
        @click=${() => (this._filter = kind)}>${label}</button>`;
    return html`<div class="chips" role="group">
      ${chip(null, t('filter.all'))}${kinds.map(k => chip(k, t(`kinds.${k}`)))}
    </div>`;
  }

  private renderBody(t: Localizer) {
    // Repos : l'aide est sous le champ (texte d'aide), rien dans la liste.
    if (this._status === 'idle') return nothing;
    // Chargement sans rien à montrer : squelette à la forme des lignes (pas de décalage à l'arrivée).
    if (this._status === 'loading' && !this._items.length) {
      return html`<div class="body"><div class="skeletons" role="progressbar" aria-label=${t('search.loading')}>
        ${[0, 1, 2, 3].map(() => html`<div class="sk">
          <ha-skeleton class="sk-thumb"></ha-skeleton>
          <div class="sk-text"><ha-skeleton-text></ha-skeleton-text><ha-skeleton-text class="short"></ha-skeleton-text></div>
        </div>`)}
      </div></div>`;
    }
    if (this._status === 'error') {
      return html`<div class="msg"><ha-alert alert-type="error">${t('search.error')}</ha-alert></div>`;
    }
    if (this._status === 'done' && !this._items.length) {
      // Aucun résultat : on dit quoi changer (voir le modèle « état vide »).
      return html`<div class="empty">
        <svg class="empty-icon" viewBox="0 0 24 24" aria-hidden="true"><path d=${mdiMagnifyRemoveOutline}></path></svg>
        <h2>${t('search.empty.title')}</h2>
        <p>${t('search.empty.description')}</p>
      </div>`;
    }

    const groups = groupResults(this._items, this._filter);
    const count = groups.reduce((n, g) => n + g.items.length, 0);
    return html`
      <div class="body" aria-live="polite">
        <p class="visually-hidden">${count === 1 ? t('search.count_one') : t('search.count', { count })}</p>
        <div class="results ${this._status === 'loading' ? 'stale' : ''}">
          ${groups.map(g => html`
            <section>
              <h3>${t(`kinds.${g.kind}`)}</h3>
              <ul>${g.items.map(item => html`<li>${this.renderRow(item, t)}</li>`)}</ul>
            </section>`)}
        </div>
      </div>`;
  }

  private renderRow(item: SearchItem, t: Localizer) {
    const flashing = this._flash === item.contentId;
    const kindLabel = t(`kind.${item.kind}`);
    return html`
      <button class="row ${flashing ? 'flash' : ''}" ?disabled=${!item.canPlay}
        aria-label=${t('action.play', { title: item.artist ? `${item.title} — ${item.artist}` : item.title })}
        @click=${() => void this.play(item)}>
        ${this.renderThumb(item)}
        <span class="text">
          <span class="title">${item.title}</span>
          <span class="sub">${item.artist ? `${item.artist} · ${kindLabel}` : kindLabel}</span>
        </span>
        <span class="act" aria-hidden="true">${icon(flashing ? mdiCheck : mdiPlay)}</span>
      </button>`;
  }

  private renderThumb(item: SearchItem) {
    const src = item.thumbnail && item.thumbnail.startsWith('/') ? (this.hass?.hassUrl?.(item.thumbnail) ?? item.thumbnail) : item.thumbnail;
    return html`<span class="thumb ${item.kind}">
      ${icon(KIND_ICONS[item.kind], 'ph')}
      ${src ? html`<img src=${src} alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"
        @error=${(e: Event) => ((e.target as HTMLImageElement).style.display = 'none')} />` : nothing}
    </span>`;
  }

  static override styles = css`
    :host { display: block; }
    ha-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      --ms-muted: var(--secondary-text-color, #5e5e5e);
      --ms-hover: var(--ha-color-fill-neutral-quiet-hover, rgba(127, 127, 127, 0.14));
      --ms-focus: var(--ha-color-focus, var(--primary-color, #009ac7));
      --ms-speed: var(--ha-animation-duration-fast, 0.15s);
    }
    .head { padding: var(--ha-space-3, 12px) var(--ha-space-3, 12px) var(--ha-space-1, 4px); display: grid; gap: var(--ha-space-2, 8px); }
    ha-input-search { display: block; --ha-input-padding-bottom: 0; }

    /* Puces de filtre : pastille de 32 px (taille « s » des boutons de HA) */
    .chips { display: flex; gap: var(--ha-space-2, 8px); overflow-x: auto; scrollbar-width: none; padding-bottom: var(--ha-space-1, 4px); }
    .chips::-webkit-scrollbar { display: none; }
    .chip {
      all: unset;
      flex: none;
      box-sizing: border-box;
      height: 32px;
      padding: 0 var(--ha-space-3, 12px);
      display: inline-flex;
      align-items: center;
      border-radius: var(--ha-border-radius-pill, 9999px);
      border: var(--ha-border-width-sm, 1px) solid var(--ha-color-border-neutral-quiet, var(--divider-color));
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-medium, 500);
      line-height: var(--ha-line-height-condensed, 1.2);
      color: var(--primary-text-color);
      cursor: pointer;
      transition: background-color var(--ms-speed);
    }
    .chip:hover { background: var(--ms-hover); }
    .chip.on { background: var(--primary-color, #009ac7); border-color: var(--primary-color, #009ac7); color: var(--text-primary-color, #fff); }
    .chip:focus-visible { outline: var(--ha-border-width-md, 2px) solid var(--ms-focus); outline-offset: 2px; }

    .body {
      max-height: var(--ms-max-height, 360px);
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 0 var(--ha-space-1, 4px) var(--ha-space-2, 8px);
      /* La zone défilante s'arrête au-dessus du bord de la carte : la dernière ligne n'est jamais coupée net. */
      margin-bottom: var(--ha-space-3, 12px);
      scrollbar-width: thin;
      scrollbar-color: rgba(127, 127, 127, 0.45) transparent;
    }
    .msg { padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px) var(--ha-space-3, 12px); }
    .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

    /* État vide : mêmes mesures que ha-empty-state (icône 64 px, titre h2, description) */
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ha-space-4, 16px);
      padding: var(--ha-space-6, 24px) var(--ha-space-4, 16px);
      text-align: center;
    }
    .empty-icon { width: 64px; height: 64px; fill: var(--ms-muted); }
    .empty h2 {
      margin: 0;
      font-size: var(--ha-font-size-xl, 20px);
      font-weight: var(--ha-font-weight-medium, 500);
      line-height: var(--ha-line-height-condensed, 1.2);
    }
    .empty p { margin: 0; color: var(--ms-muted); font-size: var(--ha-font-size-m, 14px); }

    .results { transition: opacity var(--ms-speed); }
    .results.stale { opacity: 0.5; }
    section + section { margin-top: var(--ha-space-1, 4px); }
    h3 {
      margin: 0;
      padding: var(--ha-space-3, 12px) var(--ha-space-5, 20px) var(--ha-space-1, 4px);
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-bold, 700);
      line-height: var(--ha-line-height-condensed, 1.2);
      color: var(--ms-muted);
    }
    ul { list-style: none; margin: 0; padding: 0; }

    /* Ligne de liste : 72 px (deux lignes + image de 56 px), marges latérales de 20 px */
    .row {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: var(--ha-space-5, 20px);
      width: 100%;
      min-height: 72px;
      padding: var(--ha-space-2, 8px) var(--ha-space-5, 20px);
      border-radius: var(--ha-border-radius-lg, 12px);
      cursor: pointer;
      color: var(--primary-text-color);
      -webkit-tap-highlight-color: transparent;
      transition: background-color var(--ms-speed);
    }
    .row:hover { background: var(--ms-hover); }
    .row:focus-visible { outline: var(--ha-border-width-md, 2px) solid var(--ms-focus); outline-offset: -2px; }
    .row[disabled] { color: var(--disabled-text-color, #bdbdbd); cursor: default; }

    .thumb {
      position: relative;
      flex: none;
      width: 56px;
      height: 56px;
      border-radius: var(--ha-border-radius-md, 8px);
      overflow: hidden;
      display: grid;
      place-items: center;
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.14));
      color: var(--ms-muted);
    }
    .thumb.artist { border-radius: var(--ha-border-radius-circle, 50%); }
    .thumb .ph { width: 24px; height: 24px; fill: currentColor; }
    .thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; background: var(--card-background-color, #fff); }

    .text { flex: 1; min-width: 0; display: grid; gap: var(--ha-space-1, 4px); }
    .title {
      font-size: var(--ha-font-size-l, 16px);
      font-weight: var(--ha-font-weight-medium, 500);
      line-height: var(--ha-line-height-condensed, 1.2);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      overflow-wrap: anywhere;
    }
    .sub {
      font-size: var(--ha-font-size-m, 14px);
      line-height: var(--ha-line-height-condensed, 1.2);
      color: var(--ms-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* Pictogramme décoratif : la ligne entière est la cible (72 px de haut) */
    .act { flex: none; width: 40px; height: 40px; display: grid; place-items: center; border-radius: var(--ha-border-radius-circle, 50%); color: var(--primary-color, #009ac7); }
    .act svg { width: 24px; height: 24px; fill: currentColor; }
    .row.flash .act { background: var(--primary-color, #009ac7); color: var(--text-primary-color, #fff); }
    @media (hover: hover) {
      .row:not(.flash) .act { opacity: 0; transition: opacity var(--ms-speed); }
      .row:hover .act, .row:focus-visible .act { opacity: 1; }
    }

    /* Squelette : même gabarit que les lignes, fondu d'entrée de ~300 ms */
    .skeletons { padding: var(--ha-space-1, 4px) 0; animation: fade-in var(--ha-animation-duration-slow, 0.35s) ease-out; }
    .sk { display: flex; align-items: center; gap: var(--ha-space-5, 20px); min-height: 72px; padding: var(--ha-space-2, 8px) var(--ha-space-5, 20px); }
    .sk-thumb { width: 56px; height: 56px; flex: none; --ha-skeleton-border-radius: var(--ha-border-radius-md, 8px); }
    .sk-text { flex: 1; min-width: 0; display: grid; gap: var(--ha-space-2, 8px); font-size: var(--ha-font-size-m, 14px); }
    .sk-text ha-skeleton-text { --ha-skeleton-text-width: 70%; }
    .sk-text ha-skeleton-text.short { --ha-skeleton-text-width: 40%; }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) {
      .skeletons { animation: none; }
      .results, .row, .chip, .row .act { transition: none; }
    }
  `;
}

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, SearchMediaLibrary);
  const lang = (navigator.language || 'en').slice(0, 2);
  registerCustomCard({
    type: CARD_TAG,
    name: CARD_NAME,
    description: TRANSLATIONS[lang]?.['card.description'] ?? TRANSLATIONS.en['card.description'],
  });
  console.info(
    `%c ${CARD_TAG.toUpperCase()} %c ${CARD_VERSION} `,
    `background:${IS_DEV_BUILD ? '#b45309' : '#0369a1'};color:#fff;border-radius:3px 0 0 3px`,
    'background:#334155;color:#fff;border-radius:0 3px 3px 0',
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'search-media-library': SearchMediaLibrary;
  }
}
