import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../dev/ha-stubs';
import '../src/search-media-library';
import type { SearchMediaLibrary } from '../src/search-media-library';
import type { HomeAssistant } from '../src/shared/ha-types';

const PLAYER = 'media_player.demo';
const row = (title: string, cls: string, id: string) => ({ title, media_class: cls, media_content_id: id, media_content_type: 'music', can_play: true, thumbnail: null });

async function setup(opts: { features?: number; state?: string; config?: Record<string, unknown>; platform?: string } = {}) {
  const callWS = vi.fn();
  const callService = vi.fn().mockResolvedValue(undefined);
  const hass = {
    language: 'fr', locale: { language: 'fr' },
    states: { [PLAYER]: { entity_id: PLAYER, state: opts.state ?? 'idle', attributes: { supported_features: opts.features ?? 8322623 } } },
    entities: opts.platform ? { [PLAYER]: { platform: opts.platform } } : {},
    callWS, callService,
  } as unknown as HomeAssistant;
  const el = document.createElement('search-media-library') as SearchMediaLibrary;
  el.setConfig({ type: 'custom:search-media-library', entity: PLAYER, ...opts.config });
  el.hass = hass;
  document.body.append(el);
  await el.updateComplete;
  return { el, callWS, callService };
}

const flush = async (el: SearchMediaLibrary) => { await Promise.resolve(); await el.updateComplete; };
const field = (el: SearchMediaLibrary) => el.shadowRoot!.querySelector('ha-input-search') as HTMLElement & { value: string; disabled: boolean };
const type = async (el: SearchMediaLibrary, value: string) => {
  const f = field(el);
  f.value = value;
  f.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  await el.updateComplete;
};
const response = (...rows: unknown[]) => ({ response: { [PLAYER]: { version: 1, result: rows } } });
const text = (el: SearchMediaLibrary) => (el.shadowRoot!.querySelector('ha-card')?.textContent ?? '').replace(/\s+/g, ' ');

beforeEach(() => vi.useFakeTimers());
afterEach(() => { vi.useRealTimers(); document.body.innerHTML = ''; });

describe('search-media-library', () => {
  it('refuse une entité qui n’est pas un media_player', () => {
    const el = document.createElement('search-media-library') as SearchMediaLibrary;
    expect(() => el.setConfig({ type: 'x', entity: 'light.example' })).toThrow();
  });

  it('attend le délai et n’envoie qu’une recherche pour une frappe rapide', async () => {
    const { el, callWS } = await setup();
    callWS.mockResolvedValue(response(row('Adele - Love', 'track', 'library://track/480')));
    await type(el, 'l'); await type(el, 'lo'); await type(el, 'lov');
    expect(callWS).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(349);
    expect(callWS).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2);
    expect(callWS).toHaveBeenCalledTimes(1);
    expect(callWS.mock.calls[0][0]).toMatchObject({
      type: 'call_service', domain: 'media_player', service: 'search_media',
      target: { entity_id: PLAYER }, service_data: { search_query: 'lov' }, return_response: true,
    });
  });

  it('pas de recherche sous le minimum de lettres, et message d’aide', async () => {
    const { el, callWS } = await setup();
    await type(el, 'l');
    await vi.advanceTimersByTimeAsync(1000);
    expect(callWS).not.toHaveBeenCalled();
    expect(field(el).getAttribute('hint')).toContain('au moins 2 lettres');
    expect(el.shadowRoot!.querySelector('.body')).toBeNull();
  });

  it('affiche titre, artiste et type, regroupés', async () => {
    const { el, callWS } = await setup();
    callWS.mockResolvedValue(response(
      row('Adele - Love', 'track', 'library://track/480'),
      row('Demo Radio One', 'music', 'library://radio/4'),
    ));
    await type(el, 'love');
    await vi.advanceTimersByTimeAsync(400); await flush(el);
    const titles = [...el.shadowRoot!.querySelectorAll('h3')].map(h => h.textContent);
    expect(titles).toEqual(['Radios', 'Titres']);
    const track = [...el.shadowRoot!.querySelectorAll('.row')].find(r => r.textContent!.includes('Love'))!;
    expect(track.querySelector('.title')!.textContent).toBe('Love');
    expect(track.querySelector('.sub')!.textContent).toBe('Adele · Titre');
  });

  it('ignore une réponse périmée quand l’utilisateur a continué à taper', async () => {
    const { el, callWS } = await setup();
    let resolveFirst!: (v: unknown) => void;
    callWS.mockImplementationOnce(() => new Promise(r => { resolveFirst = r; }));
    callWS.mockResolvedValueOnce(response(row('Queen - Love of My Life', 'track', 'library://track/7')));
    await type(el, 'love');
    await vi.advanceTimersByTimeAsync(400); // 1re recherche partie, sans réponse
    await type(el, 'love of');
    await vi.advanceTimersByTimeAsync(400); await flush(el); // 2e recherche, répond
    resolveFirst(response(row('Adele - Love', 'track', 'library://track/480'))); // la 1re arrive en retard
    await flush(el);
    expect(text(el)).toContain('Love of My Life');
    expect(text(el)).not.toContain('Adele');
  });

  it('réutilise le cache quand on efface une lettre', async () => {
    const { el, callWS } = await setup();
    callWS.mockResolvedValue(response(row('Queen', 'artist', 'library://artist/1')));
    await type(el, 'queen');
    await vi.advanceTimersByTimeAsync(400); await flush(el);
    await type(el, 'quee');
    await vi.advanceTimersByTimeAsync(400); await flush(el);
    await type(el, 'queen');
    await flush(el);
    expect(callWS).toHaveBeenCalledTimes(2); // « queen », « quee » ; le retour sur « queen » vient du cache
  });

  it('aucun résultat, puis erreur', async () => {
    const { el, callWS } = await setup();
    callWS.mockResolvedValueOnce(response());
    await type(el, 'zzz');
    await vi.advanceTimersByTimeAsync(400); await flush(el);
    expect(text(el)).toContain('Aucun résultat');
    expect(text(el)).toContain('orthographe');
    expect(el.shadowRoot!.querySelector('.empty h2')).not.toBeNull();
    callWS.mockRejectedValueOnce(new Error('boom'));
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    await type(el, 'zzzz');
    await vi.advanceTimersByTimeAsync(400); await flush(el);
    expect(el.shadowRoot!.querySelector('ha-alert[alert-type="error"]')!.textContent).toContain('La recherche a échoué');
  });

  it('un appui lance la lecture avec le bon appel de service', async () => {
    const { el, callWS, callService } = await setup({ config: { enqueue: 'add' } });
    callWS.mockResolvedValue(response(row('Queen - Under Pressure', 'track', 'library://track/42')));
    await type(el, 'under');
    await vi.advanceTimersByTimeAsync(400); await flush(el);
    el.shadowRoot!.querySelector<HTMLButtonElement>('.row')!.click();
    await flush(el);
    expect(callService).toHaveBeenCalledWith('media_player', 'play_media', {
      entity_id: PLAYER, media_content_id: 'library://track/42', media_content_type: 'music', enqueue: 'add',
    });
    expect(el.shadowRoot!.querySelector('.row')!.classList.contains('flash')).toBe(true);
    await vi.advanceTimersByTimeAsync(2000); await flush(el);
    expect(el.shadowRoot!.querySelector('.row')!.classList.contains('flash')).toBe(false);
  });

  it('échec de lecture : toast de HA (hass-notification), sans exception', async () => {
    const { el, callWS, callService } = await setup();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const toast = vi.fn();
    el.addEventListener('hass-notification', e => toast((e as CustomEvent).detail));
    callService.mockRejectedValueOnce(new Error('nope'));
    callWS.mockResolvedValue(response(row('Queen - X', 'track', 'library://track/1')));
    await type(el, 'queen');
    await vi.advanceTimersByTimeAsync(400); await flush(el);
    el.shadowRoot!.querySelector<HTMLButtonElement>('.row')!.click();
    await flush(el); await flush(el);
    expect(toast).toHaveBeenCalledWith({ message: 'Impossible de lancer la lecture.' });
  });

  it('filtres par type, seulement quand il y en a plusieurs', async () => {
    const { el, callWS } = await setup();
    callWS.mockResolvedValue(response(row('A - T', 'track', 'library://track/1'), row('Pod', 'podcast', 'podcasts://podcast/1')));
    await type(el, 'abc');
    await vi.advanceTimersByTimeAsync(400); await flush(el);
    const chips = [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.chip')];
    expect(chips.map(c => c.textContent!.trim())).toEqual(['Tout', 'Titres', 'Podcasts']);
    chips[2].click(); await el.updateComplete;
    expect([...el.shadowRoot!.querySelectorAll('h3')].map(h => h.textContent)).toEqual(['Podcasts']);
  });

  it('Échap efface le champ', async () => {
    const { el, callWS } = await setup();
    callWS.mockResolvedValue(response(row('Queen', 'artist', 'library://artist/1')));
    await type(el, 'queen');
    await vi.advanceTimersByTimeAsync(400); await flush(el);
    field(el).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect(field(el).value).toBe('');
    expect(el.shadowRoot!.querySelectorAll('.row').length).toBe(0);
  });

  it('lecteur sans recherche ou indisponible : champ désactivé et message', async () => {
    const a = await setup({ features: 1 });
    expect(a.el.shadowRoot!.querySelector('ha-alert')!.textContent).toContain('ne gère pas la recherche');
    expect(field(a.el).disabled).toBe(true);
    document.body.innerHTML = '';
    const b = await setup({ state: 'unavailable' });
    expect(text(b.el)).toContain('indisponible');
  });

  it('chargement : squelette tout de suite, spinner seulement après 500 ms', async () => {
    const { el, callWS } = await setup();
    callWS.mockImplementation(() => new Promise(() => {})); // ne répond jamais
    await type(el, 'love');
    expect(el.shadowRoot!.querySelector('.skeletons')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('[role="progressbar"]')!.getAttribute('aria-label')).toBe('Chargement');
    await vi.advanceTimersByTimeAsync(499); await el.updateComplete;
    expect(el.shadowRoot!.querySelector('ha-spinner')).toBeNull();
    await vi.advanceTimersByTimeAsync(2); await el.updateComplete;
    expect(el.shadowRoot!.querySelector('ha-spinner')).not.toBeNull();
  });

  it('une réponse rapide n’affiche jamais de spinner, et le spinner disparaît à la fin', async () => {
    const { el, callWS } = await setup();
    callWS.mockResolvedValue(response(row('Queen', 'artist', 'library://artist/1')));
    await type(el, 'queen');
    await vi.advanceTimersByTimeAsync(400); await flush(el); // réponse reçue à ~350 ms
    await vi.advanceTimersByTimeAsync(1000); await el.updateComplete; // le délai de 500 ms est passé
    expect(el.shadowRoot!.querySelector('ha-spinner')).toBeNull();
    // réponse lente : le spinner apparaît puis disparaît avec le résultat
    let resolve!: (v: unknown) => void;
    callWS.mockImplementationOnce(() => new Promise(r => { resolve = r; }));
    await type(el, 'queens');
    await vi.advanceTimersByTimeAsync(900); await el.updateComplete;
    expect(el.shadowRoot!.querySelector('ha-spinner')).not.toBeNull();
    resolve(response(row('Queens', 'artist', 'library://artist/2')));
    await flush(el); await el.updateComplete;
    expect(el.shadowRoot!.querySelector('ha-spinner')).toBeNull();
  });

  it('une erreur arrête aussi le spinner', async () => {
    const { el, callWS } = await setup();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    callWS.mockImplementation(() => new Promise((_, reject) => setTimeout(() => reject(new Error('x')), 800)));
    await type(el, 'love');
    await vi.advanceTimersByTimeAsync(900); await el.updateComplete;
    expect(el.shadowRoot!.querySelector('ha-spinner')).not.toBeNull();
    await vi.advanceTimersByTimeAsync(400); await flush(el); await el.updateComplete;
    expect(el.shadowRoot!.querySelector('ha-spinner')).toBeNull();
    expect(el.shadowRoot!.querySelector('ha-alert[alert-type="error"]')).not.toBeNull();
  });

  it('Music Assistant et autres : un seul appel, sans type', async () => {
    const { el, callWS } = await setup({ platform: 'music_assistant' });
    callWS.mockResolvedValue(response(row('Queen', 'artist', 'library://artist/1')));
    await type(el, 'queen');
    await vi.advanceTimersByTimeAsync(400); await flush(el);
    expect(callWS).toHaveBeenCalledTimes(1);
    expect(callWS.mock.calls[0][0].service_data).toEqual({ search_query: 'queen' });
  });

  it('Sonos : une recherche par type, en parallèle, résultats regroupés', async () => {
    const { el, callWS } = await setup({ platform: 'sonos' });
    callWS.mockImplementation(async (msg: { service_data: { media_content_type: string } }) => {
      const t = msg.service_data.media_content_type;
      if (t === 'track') return response(row('Love', 'track', 'x-file-cifs://nas/music/love.flac'));
      if (t === 'album') return response(row('Daylight', 'album', 'A:ALBUM/Daylight/Adele'));
      if (t === 'artist') return response(row('Adele', 'artist', 'A:ALBUMARTIST/Adele'));
      return response(row('Road trip.m3u8', 'playlist', 'S://nas/music/road-trip.m3u8'));
    });
    await type(el, 'love');
    await vi.advanceTimersByTimeAsync(400); await flush(el); await flush(el);
    expect(callWS.mock.calls.map(c => c[0].service_data.media_content_type).sort()).toEqual(['album', 'artist', 'playlist', 'track']);
    expect([...el.shadowRoot!.querySelectorAll('h3')].map(h => h.textContent)).toEqual(['Artistes', 'Albums', 'Titres', 'Playlists']);
    const subs = [...el.shadowRoot!.querySelectorAll('.row')].map(r => `${r.querySelector('.title')!.textContent} / ${r.querySelector('.sub')!.textContent}`);
    expect(subs).toContain('Daylight / Adele · Album');
    expect(subs).toContain('Road trip / Playlist');
  });

  it('Sonos : un type en échec n’empêche pas les autres', async () => {
    const { el, callWS } = await setup({ platform: 'sonos' });
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    callWS.mockImplementation(async (msg: { service_data: { media_content_type: string } }) => {
      if (msg.service_data.media_content_type === 'track') return response(row('Love', 'track', 'x-file-cifs://nas/love.flac'));
      throw new Error('type non géré');
    });
    await type(el, 'love');
    await vi.advanceTimersByTimeAsync(400); await flush(el); await flush(el);
    expect(el.shadowRoot!.querySelectorAll('.row').length).toBe(1);
    expect(el.shadowRoot!.querySelector('ha-alert')).toBeNull();
  });

  it('Sonos : si tous les types échouent, alerte d’erreur', async () => {
    const { el, callWS } = await setup({ platform: 'sonos' });
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    callWS.mockRejectedValue(new Error('hors ligne'));
    await type(el, 'love');
    await vi.advanceTimersByTimeAsync(400); await flush(el); await flush(el);
    expect(el.shadowRoot!.querySelector('ha-alert[alert-type="error"]')).not.toBeNull();
  });
});
