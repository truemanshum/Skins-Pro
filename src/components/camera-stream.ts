import { html } from 'lit';
import type { TemplateResult } from 'lit';

import type { HassEntity, HomeAssistant } from '../types';

export function cameraSnapshotUrl(entity: HassEntity | undefined): string {
  if (!entity) return '';
  const entityPicture = String(entity.attributes?.entity_picture || '');
  const accessToken = String(entity.attributes?.access_token || '');
  const baseUrl = entityPicture
    || (accessToken
      ? `/api/camera_proxy/${entity.entity_id}?token=${encodeURIComponent(accessToken)}`
      : '');
  if (!baseUrl) return '';
  const sep = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${sep}ts=${Date.now()}`;
}

export function cameraUsesLiveStream(entity: HassEntity | undefined): boolean {
  const streamType = String(entity?.attributes?.frontend_stream_type || '');
  const supportedFeatures = Number(entity?.attributes?.supported_features || 0);
  return Boolean(
    (streamType && streamType !== 'none' && streamType !== 'unknown')
      || (supportedFeatures & 2) === 2
  );
}

export function renderCameraPreview(
  hass: HomeAssistant,
  entity: HassEntity,
  alt: string,
  className = 'camera-preview',
): TemplateResult {
  if (!cameraUsesLiveStream(entity)) {
    const snapshotUrl = cameraSnapshotUrl(entity);
    return html`
      <div class=${className}>
        <img
          alt=${alt}
          src=${snapshotUrl}
          style="width:100%;height:100%;object-fit:cover;display:block;"
        >
      </div>
    `;
  }

  return html`
    <div
      class="${className} camera-live"
      style="position:relative;overflow:hidden;display:block;aspect-ratio:3 / 2;min-height:100px;"
    >
      <ha-camera-stream
        class="camera-stream"
        .hass=${hass}
        .stateObj=${entity}
        style="position:absolute;inset:0;width:100%;height:100%;display:block;overflow:hidden;"
      ></ha-camera-stream>
    </div>
  `;
}
