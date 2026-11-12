// Éléments d'interface partagés entre les cartes.

import { html, svg, type TemplateResult } from 'lit';

/** Icône MDI (chemin SVG) dessinée en ligne, colorée par `currentColor`. Décorative : masquée aux lecteurs d'écran. */
export function icon(path: string, cls = 'icon'): TemplateResult {
  return html`<svg class=${cls} viewBox="0 0 24 24" aria-hidden="true">${svg`<path d=${path}></path>`}</svg>`;
}
