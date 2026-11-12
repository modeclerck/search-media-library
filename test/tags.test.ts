import { describe, expect, it } from 'vitest';
import { CARD_NAME, CARD_TAG, EDITOR_TAG, IS_DEV_BUILD, OFFICIAL_TAG } from '../src/tags';

describe('noms de l’élément', () => {
  it('sans define de build : le nom officiel', () => {
    expect(CARD_TAG).toBe(OFFICIAL_TAG);
    expect(CARD_TAG).toBe('search-media-library');
    expect(EDITOR_TAG).toBe('search-media-library-editor');
    expect(IS_DEV_BUILD).toBe(false);
    expect(CARD_NAME).toBe('Search media library');
  });
});
