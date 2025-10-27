import { myStorage } from '../../tools';
import { onMove } from './move';

const SUSPENSION_SWITCH_TYPE_LIST = ['suspensionSwitchFollow', 'suspensionSwitchDefault', 'suspensionSwitchHot', 'suspensionSwitchColumnSquare', 'suspensionSwitchRingFeeds'];
const SHOW_SWITCH_PATHNAMES = ['/follow', '/', '/hot', '/column-square', '/ring-feeds'];

export const onChangeSuspensionSwitch = async () => {
  if (SHOW_SWITCH_PATHNAMES.includes(window.location.pathname)) {
    const config = await myStorage.getConfig();
    const { suspensionSwitch, suspensionSwitchPo } = config;
    const domSwitch = document.getElementById('CTZ_SUSPENSION_SWITCH')!;
    const domFormChildren = document.getElementById('CTZ_FORM_CHILDREN_SUSPENSION_SWITCH')!;
    domSwitch.style.cssText += `display: ${suspensionSwitch ? 'block' : 'none'}; ${suspensionSwitchPo}`;
    domFormChildren.style.display = suspensionSwitch ? 'block' : 'none';
    SUSPENSION_SWITCH_TYPE_LIST.forEach((type) => {
      (domSwitch.querySelector(`[data-type="${type}"]`) as HTMLAnchorElement).style.display = config[type] ? 'block' : 'none';
    });
  }
};

export const initSuspensionSwitch = () => {
  onChangeSuspensionSwitch();

  const domSwitch = document.getElementById('CTZ_SUSPENSION_SWITCH')!;
  const domLockIcon = domSwitch.querySelector('.lock-icon') as HTMLElement;
  domLockIcon.onclick = (e) => {
    const target = e.target as HTMLElement;
    if (target.dataset.lock) {
      target.dataset.lock = target.dataset.lock === 'true' ? 'false' : 'true';
      target.textContent = target.dataset.lock === 'true' ? '🔒' : '🔓';
      (domSwitch.querySelector('.move-mock') as HTMLElement).style.display = target.dataset.lock === 'true' ? 'none' : 'block';
    }
  };

  onMove('suspensionSwitch', domSwitch)
};
