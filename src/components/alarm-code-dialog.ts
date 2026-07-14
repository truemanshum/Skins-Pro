import type { Language } from '../i18n';
import { t } from '../utils';

export function showAlarmCodeDialog(language: Language): Promise<string | null> {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.4);backdrop-filter:blur(2px)';

    const dialog = document.createElement('div');
    dialog.style.cssText = [
      'background:var(--ha-card-background,#fff)',
      'color:var(--primary-text-color,#212121)',
      'border-radius:16px',
      'padding:24px',
      'min-width:280px',
      'max-width:340px',
      'box-shadow:0 20px 60px rgba(0,0,0,.3)',
      'font-family:var(--paper-font-body1_-_font-family,inherit)',
    ].join(';');

    const heading = document.createElement('div');
    heading.textContent = t(language, 'alarmEnterCode');
    heading.style.cssText = 'font-size:18px;font-weight:600;margin-bottom:16px';
    dialog.appendChild(heading);

    const input = document.createElement('input');
    input.type = 'text';
    input.setAttribute('autocomplete', 'off');
    input.style.cssText = [
      'width:100%',
      'padding:12px 14px',
      'font-size:18px',
      'letter-spacing:4px',
      'text-align:center',
      'border:2px solid var(--divider-color,rgba(0,0,0,.12))',
      'border-radius:10px',
      'background:var(--input-background-color,transparent)',
      'color:var(--primary-text-color,#212121)',
      'box-sizing:border-box',
      'outline:none',
      'transition:border-color .15s',
    ].join(';');
    input.addEventListener('focus', () => {
      input.style.borderColor = 'var(--primary-color,#03a9f4)';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = 'var(--divider-color,rgba(0,0,0,.12))';
    });
    dialog.appendChild(input);

    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;margin-top:20px';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = t(language, 'editorCancel');
    cancelBtn.style.cssText = [
      'padding:10px 20px',
      'font-size:14px',
      'font-weight:600',
      'border:none',
      'border-radius:10px',
      'cursor:pointer',
      'background:rgba(128,128,128,.12)',
      'color:var(--primary-text-color,#212121)',
    ].join(';');

    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.style.cssText = [
      'padding:10px 20px',
      'font-size:14px',
      'font-weight:600',
      'border:none',
      'border-radius:10px',
      'cursor:pointer',
      'background:var(--primary-color,#03a9f4)',
      'color:var(--text-primary-color,#fff)',
    ].join(';');

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(okBtn);
    dialog.appendChild(btnRow);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const close = (value: string | null) => {
      overlay.remove();
      resolve(value);
    };

    cancelBtn.addEventListener('click', () => close(null));
    okBtn.addEventListener('click', () => close(input.value || null));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') close(input.value || null);
      if (e.key === 'Escape') close(null);
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(null);
    });

    setTimeout(() => input.focus(), 50);
  });
}
