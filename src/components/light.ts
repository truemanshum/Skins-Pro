import { html } from 'lit';
import type { TemplateResult } from 'lit';

import type { DashboardConfig, HomeAssistant, RenderedDevice } from '../types';
import type { Language } from '../i18n';
import { assetKeyForDomain, deviceStateLabel, formatRelativeTime, selectedSkin } from '../utils';
import { renderImage } from '../render/context';

const BRIGHTNESS_MODES = new Set(['brightness', 'color_temp', 'hs', 'rgb', 'rgbw', 'rgbww', 'xy']);
const COLOR_TEMP_MODES = new Set(['color_temp']);
const DEFAULT_MIN_MIREDS = 153;
const DEFAULT_MAX_MIREDS = 500;

export function renderLightCard(
  config: DashboardConfig | undefined,
  hass: HomeAssistant,
  device: RenderedDevice,
  language: Language,
  onHandleAction: (entityId: string, action: string) => void,
): TemplateResult {
  const skin = selectedSkin(config);
  const assetKey = assetKeyForDomain(skin, 'light');
  const stateObj = hass.states?.[device.entityId];

  if (!stateObj) {
    return html`<button class="device device-off" @click=${() => onHandleAction(device.entityId, 'more-info')}>
      <div class="device-top">${renderImage(config, assetKey, device.name, 'item-img')}<div class="tag-stack"><div class="status">${deviceStateLabel(device.state, language)}</div></div></div>
      <div class="device-copy"><p class="device-name">${device.name}</p><p class="muted">${device.subtitle}</p></div>
    </button>`;
  }

  const a = stateObj.attributes || {};
  const isOn = stateObj.state === 'on';
  const brightness = a.brightness as number | undefined;
  const briPct = brightness !== undefined ? Math.round(brightness / 2.55) : undefined;
  const colorModes = (a.supported_color_modes as string[]) || [];
  const hasBrightness = colorModes.some(m => BRIGHTNESS_MODES.has(m));
  const hasColorTemp = colorModes.some(m => COLOR_TEMP_MODES.has(m));
  const colorTemp = a.color_temp as number | undefined;
  const minM = (a.min_mireds as number) ?? DEFAULT_MIN_MIREDS;
  const maxM = (a.max_mireds as number) ?? DEFAULT_MAX_MIREDS;

  const statusClass = isOn ? `device-on-${device.color}` : (stateObj.state === 'unavailable' ? 'device-unavailable' : 'device-off');
  const stateLabel = deviceStateLabel(stateObj.state, language);
  const lastTime = stateObj.last_changed
    ? formatRelativeTime(new Date(stateObj.last_changed), language)
    : device.subtitle;

  const doService = (service: string, data: Record<string, unknown>) => {
    void hass.callService('light', service, { entity_id: device.entityId, ...data });
  };

  return html`
    <button class="device ${statusClass}" @click=${() => onHandleAction(device.entityId, 'more-info')}>
      <div class="device-top">
        ${renderImage(config, assetKey, device.name, 'item-img')}
        <div class="tag-stack">
          <div class="status">${stateLabel}</div>
        </div>
      </div>
      <div class="device-copy">
        <p class="device-name">${device.name}</p>
        <p class="muted">${lastTime}</p>
      </div>
      <div class="control-row" @click=${(e: Event) => e.stopPropagation()}>
        ${hasBrightness && isOn && briPct !== undefined ? html`
        <ha-control-slider .value=${briPct} min="0" max="100" style="--control-slider-thickness:28px;--control-slider-border-radius:var(--sp-radius-pill);flex:1;min-width:0" @value-changed=${(e: CustomEvent) => { e.stopPropagation(); doService('turn_on', { brightness: Math.round((e.detail.value ?? 0) * 2.55) }); }} @click=${(e: Event) => e.stopPropagation()}></ha-control-slider>
        ` : ''}
        ${hasColorTemp && isOn && colorTemp !== undefined ? html`
        <ha-control-slider .value=${colorTemp} min=${minM} max=${maxM} style="--control-slider-thickness:28px;--control-slider-border-radius:var(--sp-radius-pill);flex:1;min-width:0;--control-slider-color:var(--sp-accent)" @value-changed=${(e: CustomEvent) => { e.stopPropagation(); doService('turn_on', { color_temp: Math.round((e.detail.value ?? minM) as number) }); }} @click=${(e: Event) => e.stopPropagation()}></ha-control-slider>
        ` : ''}
        <ha-control-switch .checked=${isOn} style="--control-switch-thickness:24px;--control-switch-border-radius:var(--sp-radius-pill);--control-switch-padding:3px;width:44px;flex-shrink:0" @change=${(e: Event) => { e.stopPropagation(); doService('toggle', {}); }} @click=${(e: Event) => e.stopPropagation()} .label=${device.name}></ha-control-switch>
      </div>
    </button>
  `;
}