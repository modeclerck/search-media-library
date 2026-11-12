// Approximations des composants de Home Assistant, pour la page de démo et les
// tests (hors de HA, ces éléments n'existent pas). Les mesures reprennent le
// code de HA (`src/components/input/ha-input*.ts`, `ha-spinner.ts`,
// `skeleton/*`, `ha-alert.ts`, `ha-card.ts`). Ce ne sont PAS les vrais
// composants : le rendu final se vérifie toujours dans HA.

import { css, html, LitElement, nothing } from 'lit';
import { mdiMagnify, mdiClose } from '@mdi/js';

const def = (tag: string, ctor: CustomElementConstructor) => { if (!customElements.get(tag)) customElements.define(tag, ctor); };

class StubCard extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      box-sizing: border-box;
      background: var(--ha-card-background, var(--card-background-color, white));
      border-radius: var(--ha-card-border-radius, var(--ha-border-radius-lg, 12px));
      border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
      color: var(--primary-text-color);
    }
  `;
  protected override render() { return html`<slot></slot>`; }
}

class StubInputSearch extends LitElement {
  static override properties = {
    value: {}, placeholder: {}, disabled: { type: Boolean }, hint: {}, accessibleLabel: { attribute: 'accessible-label' }, appearance: { reflect: true },
  };
  declare value: string;
  declare placeholder: string;
  declare disabled: boolean;
  declare hint: string;
  declare accessibleLabel: string;
  declare appearance: string;
  constructor() { super(); this.value = ''; this.placeholder = ''; this.disabled = false; this.hint = ''; this.accessibleLabel = ''; this.appearance = 'material'; }

  override focus(): void { this.renderRoot.querySelector('input')?.focus(); }

  private onInput = (e: Event) => { this.value = (e.target as HTMLInputElement).value; };
  private clear = () => {
    this.value = '';
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.focus();
  };

  protected override render() {
    return html`
      <div class="base">
        <svg viewBox="0 0 24 24" class="lead" aria-hidden="true"><path d=${mdiMagnify}></path></svg>
        <input type="search" .value=${this.value} placeholder=${this.placeholder} aria-label=${this.accessibleLabel}
          ?disabled=${this.disabled} autocomplete="off" @input=${this.onInput} />
        <slot name="end"></slot>
        ${this.value ? html`<button class="clear" aria-label="Clear" @click=${this.clear}><svg viewBox="0 0 24 24"><path d=${mdiClose}></path></svg></button>` : nothing}
      </div>
      ${this.hint ? html`<div class="hint">${this.hint}</div>` : nothing}`;
  }

  static override styles = css`
    :host { display: block; }
    .base {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      height: var(--ha-input-search-height, 40px);
      padding: 0 var(--ha-space-2, 8px);
      border: 1px solid var(--ha-color-border-neutral-quiet, #e6e6e6);
      border-radius: var(--ha-input-search-border-radius, var(--ha-border-radius-md, 8px));
      background: var(--card-background-color, #fff);
    }
    .base:hover { border-color: var(--ha-color-border-neutral-normal, #999); }
    :host(:focus-within) .base { border-color: var(--primary-color, #009ac7); }
    .lead { width: 18px; height: 18px; fill: var(--ha-color-text-secondary, #666); flex: none; }
    input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--primary-text-color); font: inherit; font-size: var(--ha-font-size-m, 14px); }
    input::-webkit-search-cancel-button { display: none; }
    .clear { all: unset; width: 24px; height: 24px; display: grid; place-items: center; cursor: pointer; color: var(--ha-color-text-secondary, #666); }
    .clear svg { width: 18px; height: 18px; fill: currentColor; }
    .hint { padding: var(--ha-space-1, 4px) var(--ha-space-3, 12px) 0; font-size: var(--ha-font-size-s, 12px); color: var(--ha-color-text-secondary, #666); }
  `;
}

class StubSpinner extends LitElement {
  static override styles = css`
    :host { display: inline-block; width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--divider-color, #ddd); border-top-color: var(--primary-color, #009ac7); animation: spin 1s linear infinite; box-sizing: border-box; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { :host { animation-duration: 3.5s; } }
  `;
  protected override render() { return nothing; }
}

class StubAlert extends LitElement {
  static override properties = { alertType: { attribute: 'alert-type', reflect: true } };
  declare alertType: string;
  constructor() { super(); this.alertType = 'info'; }
  static override styles = css`
    :host { display: block; box-sizing: border-box; padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px); border-radius: var(--ha-border-radius-md, 8px); font-size: var(--ha-font-size-m, 14px); background: var(--ha-color-fill-neutral-quiet-resting, #f3f3f3); border-inline-start: 4px solid var(--info-color, #039be5); }
    :host([alert-type='error']) { border-color: var(--error-color, #db4437); background: var(--ha-color-fill-danger-normal-resting, #fbe9e7); }
    :host([alert-type='warning']) { border-color: var(--warning-color, #ffa600); background: var(--ha-color-fill-warning-normal-resting, #fff3e0); }
  `;
  protected override render() { return html`<div role="alert"><slot></slot></div>`; }
}

class StubSkeleton extends LitElement {
  static override styles = css`
    :host { display: block; background: var(--ha-skeleton-color, var(--ha-color-fill-neutral-normal-resting, #e6e6e6)); border-radius: var(--ha-skeleton-border-radius, var(--ha-border-radius-sm, 4px)); animation: pulse 2s ease-in-out infinite; }
    @keyframes pulse { 50% { opacity: 0.5; } }
    @media (prefers-reduced-motion: reduce) { :host { animation: none; } }
  `;
  protected override render() { return nothing; }
}
class StubSkeletonText extends LitElement {
  static override styles = css`
    :host { display: block; width: var(--ha-skeleton-text-width, 140px); max-width: 100%; height: 1em; background: var(--ha-skeleton-color, var(--ha-color-fill-neutral-normal-resting, #e6e6e6)); border-radius: var(--ha-skeleton-border-radius, var(--ha-border-radius-sm, 4px)); animation: pulse 2s ease-in-out infinite; }
    @keyframes pulse { 50% { opacity: 0.5; } }
    @media (prefers-reduced-motion: reduce) { :host { animation: none; } }
  `;
  protected override render() { return nothing; }
}

def('ha-card', StubCard);
def('ha-input-search', StubInputSearch);
def('ha-spinner', StubSpinner);
def('ha-alert', StubAlert);
def('ha-skeleton', StubSkeleton);
def('ha-skeleton-text', StubSkeletonText);
