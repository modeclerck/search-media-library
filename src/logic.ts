// Logique pure de la carte de recherche : classement des résultats, titres
// « Artiste - Titre », regroupement par type, cache. Aucune dépendance au DOM.

export type Kind = 'radio' | 'artist' | 'album' | 'track' | 'playlist' | 'podcast' | 'audiobook' | 'other';

/** Ordre d'affichage des groupes. */
export const KIND_ORDER: Kind[] = ['radio', 'artist', 'album', 'track', 'playlist', 'podcast', 'audiobook', 'other'];

const KNOWN_CLASSES = new Set<Kind>(['artist', 'album', 'track', 'playlist', 'podcast', 'audiobook']);
const URI_KIND = /\/(radio|artist|album|track|playlist|podcast|audiobook)\//;

export interface SearchItem {
  /** Identifiant à envoyer à `media_player.play_media`. */
  contentId: string;
  contentType: string;
  kind: Kind;
  /** Titre à afficher (sans l'artiste quand il a pu être séparé). */
  title: string;
  /** Artiste, quand le titre est de la forme « Artiste - Titre ». */
  artist?: string;
  thumbnail?: string;
  canPlay: boolean;
}

/**
 * Le type d'un résultat. Music Assistant range les radios dans la classe
 * `music` : l'URI (`library://radio/4`) est plus fiable que la classe.
 */
export function kindOf(mediaClass: unknown, contentId: unknown): Kind {
  const cls = typeof mediaClass === 'string' ? mediaClass.toLowerCase() : '';
  if (KNOWN_CLASSES.has(cls as Kind)) return cls as Kind;
  if (cls === 'radio') return 'radio';
  const match = typeof contentId === 'string' ? URI_KIND.exec(contentId) : null;
  return (match?.[1] as Kind | undefined) ?? 'other';
}

/** « Queen - Under Pressure » → artiste « Queen », titre « Under Pressure ». */
export function splitArtist(title: string): { title: string; artist?: string } {
  const i = title.indexOf(' - ');
  if (i <= 0 || i + 3 >= title.length) return { title };
  return { artist: title.slice(0, i).trim(), title: title.slice(i + 3).trim() };
}

/**
 * Types à demander un par un à `media_player.search_media`, selon l'intégration du
 * lecteur. L'intégration Sonos de Home Assistant ne cherche qu'un type par appel et
 * prend « titres » quand on n'en précise aucun : on lance donc une recherche par type.
 * `undefined` = un seul appel sans type (Music Assistant renvoie déjà tous les types).
 */
export const SONOS_SEARCH_TYPES = ['track', 'album', 'artist', 'playlist'] as const;

export function searchTypesFor(platform: string | undefined): readonly string[] | undefined {
  return platform === 'sonos' ? SONOS_SEARCH_TYPES : undefined;
}

/** Sonos range l'artiste d'un album dans son identifiant : `A:ALBUM/<album>/<artiste>`. */
function artistFromAlbumId(contentId: string): string | undefined {
  const m = /^A:ALBUM\/[^/]*\/(.+)$/.exec(contentId);
  if (!m) return undefined;
  try {
    return decodeURIComponent(m[1]).trim() || undefined;
  } catch {
    return undefined;
  }
}

/** « Ma liste.m3u8 » → « Ma liste » : extension de fichier de playlist retirée. */
function cleanPlaylistTitle(title: string): string {
  return title.replace(/\.(m3u8?|pls|wpl|xspf)$/i, '').trim() || title;
}

/** Résultats bruts de `media_player.search_media` → éléments d'affichage. */
export function parseResults(raw: unknown): SearchItem[] {
  if (!Array.isArray(raw)) return [];
  const items: SearchItem[] = [];
  const seen = new Set<string>();
  for (const r of raw) {
    if (!r || typeof r !== 'object') continue;
    const o = r as Record<string, unknown>;
    const contentId = typeof o.media_content_id === 'string' ? o.media_content_id : '';
    const rawTitle = typeof o.title === 'string' ? o.title.trim() : '';
    if (!contentId || !rawTitle || seen.has(contentId)) continue;
    seen.add(contentId);
    const kind = kindOf(o.media_class, contentId);
    const split: { title: string; artist?: string } =
      kind === 'track' || kind === 'album' ? splitArtist(rawTitle)
        : kind === 'playlist' ? { title: cleanPlaylistTitle(rawTitle) }
          : { title: rawTitle };
    const artist = split.artist ?? (kind === 'album' ? artistFromAlbumId(contentId) : undefined);
    items.push({
      contentId,
      contentType: typeof o.media_content_type === 'string' && o.media_content_type ? o.media_content_type : 'music',
      kind,
      title: split.title,
      artist,
      thumbnail: typeof o.thumbnail === 'string' && o.thumbnail ? o.thumbnail : undefined,
      canPlay: o.can_play !== false,
    });
  }
  return items;
}

export interface Group { kind: Kind; items: SearchItem[] }

/** Regroupe par type dans l'ordre d'affichage ; `only` limite à un type. */
export function groupResults(items: SearchItem[], only?: Kind | null): Group[] {
  return KIND_ORDER
    .filter(kind => !only || kind === only)
    .map(kind => ({ kind, items: items.filter(i => i.kind === kind) }))
    .filter(g => g.items.length > 0);
}

/** Types présents dans les résultats, dans l'ordre d'affichage. */
export function presentKinds(items: SearchItem[]): Kind[] {
  return KIND_ORDER.filter(kind => items.some(i => i.kind === kind));
}

/** Terme de recherche normalisé : sans espaces en trop, minuscules (clé de cache). */
export function normalizeQuery(q: string): string {
  return q.trim().replace(/\s+/g, ' ');
}

/** Petit cache à taille fixe (le plus ancien sort en premier). */
export class SearchCache<T> {
  private readonly map = new Map<string, T>();
  constructor(private readonly max = 30) {}
  get(key: string): T | undefined {
    const k = key.toLowerCase();
    const v = this.map.get(k);
    if (v !== undefined) { this.map.delete(k); this.map.set(k, v); }
    return v;
  }
  set(key: string, value: T): void {
    const k = key.toLowerCase();
    this.map.delete(k);
    this.map.set(k, value);
    if (this.map.size > this.max) this.map.delete(this.map.keys().next().value as string);
  }
  clear(): void { this.map.clear(); }
}

/** MediaPlayerEntityFeature.SEARCH_MEDIA */
export const FEATURE_SEARCH_MEDIA = 4194304;

export function supportsSearch(attributes: Record<string, unknown> | undefined): boolean {
  const f = Number(attributes?.supported_features ?? 0);
  return Number.isFinite(f) && (f & FEATURE_SEARCH_MEDIA) !== 0;
}

export type Enqueue = 'play' | 'replace' | 'next' | 'add';
export const ENQUEUE_MODES: Enqueue[] = ['replace', 'play', 'next', 'add'];
