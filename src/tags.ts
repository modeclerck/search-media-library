// Nom de l'élément personnalisé et version, fixés à la compilation par esbuild.
// La build de développement (`npm run build:dev`) donne « search-media-library-dev » :
// elle peut alors tourner dans le même Home Assistant que la version installée par HACS
// sans que l'une masque l'autre (un nom d'élément ne s'enregistre qu'une fois par page).

declare const __CARD_TAG__: string | undefined;
declare const __CARD_VERSION__: string | undefined;

export const OFFICIAL_TAG = 'search-media-library';
export const CARD_TAG: string = typeof __CARD_TAG__ === 'string' ? __CARD_TAG__ : OFFICIAL_TAG;
export const EDITOR_TAG = `${CARD_TAG}-editor`;
export const IS_DEV_BUILD = CARD_TAG !== OFFICIAL_TAG;
export const CARD_NAME = IS_DEV_BUILD ? 'Search media library (dev)' : 'Search media library';
export const CARD_VERSION: string = typeof __CARD_VERSION__ === 'string' ? __CARD_VERSION__ : '0.0.0';
