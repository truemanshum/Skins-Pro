import { html } from 'lit';
import type { TemplateResult } from 'lit';

import type { DashboardConfig, HomeAssistant, RenderedDevice, TranslationKey } from '../types';
import type { Language } from '../i18n';
import { assetKeyForDomain, deviceStateLabel, formatRelativeTime, selectedSkin, t } from '../utils';
import { renderImage } from '../render/context';

const OP_LABELS: Record<string, TranslationKey> = {
  auto: 'hvacAuto', eco: 'presetEco', electric: 'presetNone',
  performance: 'presetBoost', 'high demand': 'presetBoost',
  'heat pump': 'presetNone', gas: 'presetNone', off: 'hvacOff',
  'away': 'presetAway',
};

function opLabel(mode: string, language: Language): string {
  const key = OP_LABELS[mode];
  return key ? t(language, key) : mode;
}

export function renderWaterHeaterCard(
  config: DashboardConfig | undefined,
  hass: HomeAssistant,
  device: RenderedDevice,
  language: Language,
  onHandleAction: (entityId: string, action: string) => void,
): TemplateResult {
  const skin = selectedSkin(config);
  const assetKey = assetKeyForDomain(skin, 'water_heater');
  const stateObj = hass.states?.[device.entityId];

  if (!stateObj) {
    return html`<button class="device device-off" @click=${() => onHandleAction(device.entityId, 'more-info')}>
      <div class="device-top">${renderImage(config, assetKey, device.name, 'item-img')}<div class="tag-stack"><div class="status">${deviceStateLabel(device.state, language)}</div></div></div>
      <div class="device-copy"><p class="device-name">${device.name}</p><p class="muted">${device.subtitle}</p></div>
    </button>`;
  }

  const a = stateObj.attributes || {};
  const isOff = stateObj.state === 'off';
  const isActive = !isOff && stateObj.state !== 'unavailable' && stateObj.state !== 'unknown';
  const currentTemp = a.current_temperature as number | undefined;
  const targetTemp = a.temperature as number | undefined;
  const operationMode = (a.operation_mode as string) || stateObj.state;
  const operationList = (a.operation_list as string[]) || [];
  const minT = (a.min_temp as number) ?? 43;
  const maxT = (a.max_temp as number) ?? 65;
  const step = (a.target_temp_step as number) ?? 1;

  const statusClass = isActive ? `device-on-${device.color}` : (stateObj.state === 'unavailable' ? 'device-unavailable' : 'device-off');
  const lastTime = stateObj.last_changed ? formatRelativeTime(new Date(stateObj.last_changed), language) : device.subtitle;

  const tempDisplay = (v?: number) => v !== undefined ? `${Math.round(v)}°` : '--';

  const doService = (service: string, data: Record<string, unknown>) => {
    void hass.callService('water_heater', service, { entity_id: device.entityId, ...data });
  };

  const adjustTemp = (delta: number) => {
    const cur = targetTemp ?? minT;
    const next = Math.min(maxT, Math.max(minT, cur + delta));
    if (next !== cur) doService('set_temperature', { temperature: next });
  };

  return html`
    <button class="device ${statusClass}" @click=${() => onHandleAction(device.entityId, 'more-info')}>
      <div class="device-top">
        ${renderImage(config, assetKey, device.name, 'item-img')}
        <div class="tag-stack">
          <div class="status" style="font-size:var(--sp-font-4xs);font-weight:700">${currentTemp !== undefined ? tempDisplay(currentTemp) : deviceStateLabel(stateObj.state, language)}</div>
        </div>
      </div>
      <div class="device-copy">
        <p class="device-name">${device.name}</p>
        <p class="muted">${lastTime}</p>
      </div>
      ${isOff ? html`
      <div class="control-row" style="justify-content:flex-end" @click=${(e: Event) => e.stopPropagation()}>
        <button class="chip" style="font-size:var(--sp-font-4xs);min-height:26px;padding:0 10px;display:flex;align-items:center;gap:4px" @click=${(e: Event) => { e.stopPropagation(); doService('turn_on', {}); }}>
          <ha-icon icon="mdi:power-standby" style="--mdc-icon-size:14px"></ha-icon>${t(language, 'turnOn')}
        </button>
      </div>` : html`
      <div class="control-row" style="gap:2px" @click=${(e: Event) => e.stopPropagation()}>
        <div style="display:flex;align-items:center;gap:1px;flex-shrink:0">
          <button class="media-volbtn" style="width:22px;height:22px;padding:0" @click=${(e: Event) => { e.stopPropagation(); adjustTemp(-step); }}><ha-icon icon="mdi:minus" style="--mdc-icon-size:12px"></ha-icon></button>
          <span style="font-weight:700;font-size:var(--sp-font-2xs);min-width:22px;text-align:center">${targetTemp !== undefined ? tempDisplay(targetTemp) : '--'}</span>
          <button class="media-volbtn" style="width:22px;height:22px;padding:0" @click=${(e: Event) => { e.stopPropagation(); adjustTemp(step); }}><ha-icon icon="mdi:plus" style="--mdc-icon-size:12px"></ha-icon></button>
        </div>
        ${operationList.length > 1 ? html`
        <select class="filter-select" style="font-size:var(--sp-font-4xs);min-height:20px;min-width:44px;padding:0 14px 0 3px;background-size:8px;flex-shrink:0" @change=${(e: Event) => { e.stopPropagation(); doService('set_operation_mode', { operation_mode: (e.target as HTMLSelectElement).value }); }} @click=${(e: Event) => e.stopPropagation()}>
          ${operationList.map(m => html`<option value=${m} ?selected=${m === operationMode}>${opLabel(m, language)}</option>`)}
        </select>` : ''}
        <ha-control-switch .checked=${true} style="--control-switch-thickness:24px;--control-switch-border-radius:var(--sp-radius-pill);--control-switch-padding:3px;width:44px;flex-shrink:0;margin-left:auto" @change=${(e: Event) => { e.stopPropagation(); doService('turn_off', {}); }} @click=${(e: Event) => e.stopPropagation()} .label=${device.name}></ha-control-switch>
      </div>`}
    </button>
  `;
}
