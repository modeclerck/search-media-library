import { describe, expect, it } from 'vitest';
import { TRANSLATIONS } from '../src/translations';
import { makeLocalizer } from '../src/shared/localize';

describe('traductions', () => {
  it('fr et en ont exactement les mêmes clés', () => {
    expect(Object.keys(TRANSLATIONS.fr).sort()).toEqual(Object.keys(TRANSLATIONS.en).sort());
  });
  it('langue régionale et repli anglais', () => {
    expect(makeLocalizer(TRANSLATIONS, { states: {}, language: 'fr-BE' })('kind.track')).toBe('Titre');
    expect(makeLocalizer(TRANSLATIONS, { states: {}, language: 'de' })('kind.track')).toBe('Track');
  });
  it('variables', () => {
    expect(makeLocalizer(TRANSLATIONS, { states: {}, language: 'fr' })('search.hint', { n: 3 })).toBe('Tapez au moins 3 lettres pour lancer la recherche.');
  });
  it('clé inconnue : renvoie la clé, sans planter', () => {
    expect(makeLocalizer(TRANSLATIONS, { states: {}, language: 'fr' })('cle.inexistante')).toBe('cle.inexistante');
  });
});
