// Demo page: fake catalogue, simulated latency (~450 ms, like a real Music
// Assistant search), playback calls are logged instead of executed.

import './ha-stubs';
import type { HomeAssistant } from '../src/shared/ha-types';

interface Row { title: string; media_class: string; id: string; thumb?: string }

const CATALOGUE: Row[] = [
  { title: 'Demo Radio One', media_class: 'music', id: 'library://radio/4' },
  { title: 'Demo Jazz FM', media_class: 'music', id: 'library://radio/2' },
  { title: 'Adele - Love in the Dark', media_class: 'track', id: 'library://track/480' },
  { title: 'Queen - I’m in Love With My Car', media_class: 'track', id: 'library://track/1201' },
  { title: 'Queen - I’m in Love With My Car (guitar & vocal mix 2011)', media_class: 'track', id: 'library://track/1214' },
  { title: 'U2 - California (There Is No End to Love)', media_class: 'track', id: 'library://track/1328' },
  { title: 'John Williams, Anne-Sophie Mutter, The Recording Arts Orchestra of Los Angeles - Across The Stars (Love Theme) (From "Star Wars: Attack Of The Clones")', media_class: 'track', id: 'library://track/387' },
  { title: 'Queen', media_class: 'artist', id: 'library://artist/12' },
  { title: 'Queen - Greatest Hits', media_class: 'album', id: 'library://album/31' },
  { title: 'Queen - A Night at the Opera', media_class: 'album', id: 'library://album/32' },
  { title: 'Mix infini (favoris)', media_class: 'playlist', id: 'library://playlist/46' },
  { title: 'This is Love', media_class: 'podcast', id: 'podcasts://podcast/dc95b580' },
  { title: 'Modern Love', media_class: 'podcast', id: 'podcasts://podcast/3f14cc20' },
  { title: 'The Classic Tales Podcast', media_class: 'podcast', id: 'podcasts://podcast/3e6eea00' },
];

const params = new URLSearchParams(location.search);
const mode = params.get('mode') ?? 'ok'; // ok | slow | error | unsupported | unavailable

const log: string[] = [];
const logEl = document.getElementById('log')!;
const note = (line: string) => { log.unshift(`${new Date().toLocaleTimeString()}  ${line}`); logEl.textContent = log.slice(0, 12).join('\n'); };

const hass: HomeAssistant = {
  language: params.get('lang') ?? 'fr',
  locale: { language: params.get('lang') ?? 'fr' },
  states: {
    'media_player.demo': {
      entity_id: 'media_player.demo',
      state: mode === 'unavailable' ? 'unavailable' : 'idle',
      attributes: { friendly_name: 'Demo player', supported_features: mode === 'unsupported' ? 1 : 8322623 },
    },
  },
  callWS: (async (msg: Record<string, unknown>) => {
    const data = msg.service_data as { search_query: string };
    note(`search_media « ${data.search_query} »`);
    await new Promise(r => setTimeout(r, mode === 'slow' ? 1800 : 450));
    if (mode === 'error') throw new Error('simulated');
    const q = data.search_query.toLowerCase();
    const result = CATALOGUE.filter(r => r.title.toLowerCase().includes(q)).map(r => ({
      title: r.title, media_class: r.media_class, media_content_id: r.id, media_content_type: 'music',
      can_play: true, can_expand: false, thumbnail: r.thumb ?? null,
    }));
    return { response: { 'media_player.demo': { version: 1, result } } };
  }) as HomeAssistant['callWS'],
  callService: async (domain, service, data) => {
    note(`${domain}.${service} ${JSON.stringify(data)}`);
    if (mode === 'play-error') throw new Error('simulated');
  },
};

for (const holder of document.querySelectorAll<HTMLElement>('[data-card]')) {
  const config = JSON.parse(holder.dataset.card!) as Record<string, unknown>;
  const el = document.createElement('search-media-library') as HTMLElement & { setConfig(c: unknown): void; hass: HomeAssistant };
  el.setConfig({ type: 'custom:search-media-library', entity: 'media_player.demo', ...config });
  el.hass = hass;
  holder.append(el);
}
