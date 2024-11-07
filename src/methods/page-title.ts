import { dom, domById, domC } from '../commons/tools';
import { ICO_URL } from '../configs';
import { store } from '../store';

const regexpMessage = /^\([^()]+\)/;

/** 修改网页标题 */
export const changeTitle = () => {
  const { getConfig, getStorageConfigItem, setStorageConfigItem } = store;
  const { globalTitle, globalTitleRemoveMessage } = getConfig();
  const cacheTitle = getStorageConfigItem('cacheTitle') as string;
  const prev = document.title;
  if (globalTitle) {
    document.title = globalTitle;
    return;
  }

  if (globalTitleRemoveMessage) {
    if (regexpMessage.test(prev)) {
      const nTitle = prev.replace(regexpMessage, '').trim();
      if (nTitle === cacheTitle) return;
      document.title = nTitle;
      setStorageConfigItem('cacheTitle', nTitle);
      return;
    }
  }
  if (prev === cacheTitle) return;
  document.title = cacheTitle;
};

/** 修改网页标题图片 */
export const changeICO = () => {
  const { getConfig } = store;
  const { titleIco = '' } = getConfig();
  const nId = 'CTZ_ICO';
  if (!ICO_URL[titleIco]) return;
  const nodeXIcon = dom('[type="image/x-icon"]');
  const nodeId = domById(nId);
  nodeXIcon && nodeXIcon.remove();
  nodeId && nodeId.remove();
  dom('head')!.appendChild(
    domC('link', {
      type: 'image/x-icon',
      href: ICO_URL[titleIco],
      id: nId,
      rel: 'icon',
    })
  );
};
