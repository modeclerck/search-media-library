import { describe, expect, it } from 'vitest';
import { groupResults, kindOf, normalizeQuery, parseResults, presentKinds, SearchCache, splitArtist, supportsSearch } from '../src/logic';

describe('kindOf', () => {
  it('classes connues', () => {
    expect(kindOf('track', 'library://track/1')).toBe('track');
    expect(kindOf('podcast', 'podcasts://podcast/x')).toBe('podcast');
  });
  it('radio de Music Assistant : classe « music », reconnue par l’URI', () => {
    expect(kindOf('music', 'library://radio/4')).toBe('radio');
  });
  it('inconnu → other, sans planter', () => {
    expect(kindOf(undefined, undefined)).toBe('other');
    expect(kindOf('music', 'https://example.org/stream.mp3')).toBe('other');
  });
});

describe('splitArtist', () => {
  it('sépare sur le premier « - »', () => {
    expect(splitArtist('Queen - Under Pressure')).toEqual({ artist: 'Queen', title: 'Under Pressure' });
    expect(splitArtist('Adele - Love - Live')).toEqual({ artist: 'Adele', title: 'Love - Live' });
  });
  it('laisse tel quel sans séparateur exploitable', () => {
    expect(splitArtist('Queen')).toEqual({ title: 'Queen' });
    expect(splitArtist('- Titre')).toEqual({ title: '- Titre' });
    expect(splitArtist('Titre - ')).toEqual({ title: 'Titre - ' });
  });
});

describe('parseResults', () => {
  const raw = [
    { title: 'Adele - Love', media_class: 'track', media_content_id: 'library://track/480', media_content_type: 'music', can_play: true, thumbnail: 'https://x/y.png' },
    { title: 'Demo Radio One', media_class: 'music', media_content_id: 'library://radio/4', media_content_type: 'music', can_play: true, thumbnail: null },
    { title: 'Doublon', media_class: 'track', media_content_id: 'library://track/480' },
    { title: '', media_class: 'track', media_content_id: 'library://track/9' },
    { media_class: 'track' },
    null,
    'bizarre',
  ];
  it('ignore les entrées invalides et les doublons', () => {
    const items = parseResults(raw);
    expect(items.map(i => i.contentId)).toEqual(['library://track/480', 'library://radio/4']);
  });
  it('sépare l’artiste des titres, pas des radios', () => {
    const [track, radio] = parseResults(raw);
    expect(track).toMatchObject({ kind: 'track', artist: 'Adele', title: 'Love', thumbnail: 'https://x/y.png' });
    expect(radio).toMatchObject({ kind: 'radio', title: 'Demo Radio One', thumbnail: undefined });
    expect(radio.artist).toBeUndefined();
  });
  it('entrée qui n’est pas une liste → vide', () => {
    expect(parseResults(undefined)).toEqual([]);
    expect(parseResults({})).toEqual([]);
  });
});

describe('groupResults', () => {
  const items = parseResults([
    { title: 'A - t1', media_class: 'track', media_content_id: 'library://track/1' },
    { title: 'Pod', media_class: 'podcast', media_content_id: 'podcasts://podcast/1' },
    { title: 'Radio', media_class: 'music', media_content_id: 'library://radio/1' },
  ]);
  it('ordre fixe : radios, titres, podcasts', () => {
    expect(groupResults(items).map(g => g.kind)).toEqual(['radio', 'track', 'podcast']);
    expect(presentKinds(items)).toEqual(['radio', 'track', 'podcast']);
  });
  it('filtre par type', () => {
    expect(groupResults(items, 'track').map(g => g.kind)).toEqual(['track']);
    expect(groupResults(items, 'album')).toEqual([]);
  });
});

describe('SearchCache', () => {
  it('insensible à la casse, taille bornée, le plus ancien sort', () => {
    const c = new SearchCache<number>(2);
    c.set('Queen', 1); c.set('love', 2);
    expect(c.get('queen')).toBe(1); // rafraîchit « queen »
    c.set('abba', 3); // « love » est le plus ancien
    expect(c.get('love')).toBeUndefined();
    expect(c.get('queen')).toBe(1);
    expect(c.get('ABBA')).toBe(3);
  });
});

describe('divers', () => {
  it('normalizeQuery', () => expect(normalizeQuery('  queen   under  ')).toBe('queen under'));
  it('supportsSearch lit le bit SEARCH_MEDIA', () => {
    expect(supportsSearch({ supported_features: 8322623 })).toBe(true);
    expect(supportsSearch({ supported_features: 1 })).toBe(false);
    expect(supportsSearch(undefined)).toBe(false);
  });
});
