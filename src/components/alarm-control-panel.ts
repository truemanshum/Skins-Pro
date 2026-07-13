import { html } from 'lit';
import type { TemplateResult } from 'lit';

import type { DashboardConfig, HomeAssistant, RenderedDevice, TranslationKey } from '../types';
import type { Language } from '../i18n';
import { assetKeyForDomain, formatRelativeTime, selectedSkin, t } from '../utils';
import { renderImage } from '../render/context';

const ALARM_STATE_LABELS: Record<string, TranslationKey> = {
  disarmed: 'alarmDisarmed',
  armed_home: 'alarmArmedHome',
  armed_away: 'alarmArmedAway',
  armed_night: 'alarmArmedNight',
  armed_vacation: 'alarmArmedVacation',
  armed_custom_bypass: 'alarmArmedCustom',
  arming: 'alarmArming',
  pending: 'alarmPending',
  triggered: 'alarmTriggered',
  disarming: 'alarmDisarming',
};

function alarmStateLabel(state: string, language: Language): string {
  const key = ALARM_STATE_LABELS[state];
  return key ? t(language, key) : state;
}

export function renderAlarmControlPanelCard(
  config: DashboardConfig | undefined,
  hass: HomeAssistant,
  device: RenderedDevice,
  language: Language,
  onHandleAction: (entityId: string, action: string) => void,
): TemplateResult {
  const skin = selectedSkin(config);
  const assetKey = assetKeyForDomain(skin, alarmAssetDomain(skin));
  const stateObj = hass.states?.[device.entityId];

  if (!stateObj) {
    return html`<button class="device device-off" @click=${() => onHandleAction(device.entityId, 'more-info')}>
      <div class="device-top">${renderImage(config, assetKey, device.name, 'item-img')}<div class="tag-stack"><div class="status">${alarmStateLabel(device.state, language)}</div></div></div>
      <div class="device-copy"><p class="device-name">${device.name}</p><p class="muted">${device.subtitle}</p></div>
    </button>`;
  }

  const state = stateObj.state;
  const isArmed = state === 'armed_home' || state === 'armed_away' || state === 'armed_night' || state === 'armed_vacation' || state === 'armed_custom_bypass';
  const isTriggered = state === 'triggered';
  const isPending = state === 'pending' || state === 'arming' || state === 'disarming';

  const statusClass: string = isTriggered ? `device-on-red` : (isArmed ? `device-on-${device.color}` : (isPending ? `device-on-${device.color}` : (state === 'unavailable' ? 'device-unavailable' : 'device-off')));
  const lastTime = stateObj.last_changed ? formatRelativeTime(new Date(stateObj.last_changed), language) : device.subtitle;

  return html`
    <button class="device ${statusClass}" @click=${() => onHandleAction(device.entityId, 'more-info')}>
      <div class="device-top">
        ${renderImage(config, assetKey, device.name, 'item-img')}
        <div class="tag-stack">
          <div class="status">${alarmStateLabel(state, language)}</div>
        </div>
      </div>
      <div class="device-copy">
        <p class="device-name">${device.name}</p>
        <p class="muted">${lastTime}</p>
      </div>
      <div class="control-row" style="justify-content:flex-end" @click=${(e: Event) => e.stopPropagation()}>
        <ha-icon icon=${isTriggered ? 'mdi:bell-ring' : (isArmed ? 'mdi:shield-lock' : 'mdi:shield-off')} style="--mdc-icon-size:18px;color:var(--sp-text-primary)"></ha-icon>
      </div>
    </button>
  `;
}

function alarmAssetDomain(skin: string): string {
  void skin;
  return 'alarm_control_panel';
}
