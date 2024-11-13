import { myStorage } from '../commons/storage';
import { dom, domById, domC } from '../commons/tools';
import { ICO_URL } from '../configs';
import { store } from '../store';

const regexpMessage = /^\([^()]+\)/;

/** 修改网页标题 */
export const changeTitle = async () => {
  const { getStorageConfigItem } = store;
  const { globalTitle, globalTitleRemoveMessage } = await myStorage.getConfig();
  const cacheTitle = getStorageConfigItem('cacheTitle') as string;
  let prevTitle = globalTitle || cacheTitle;

  if (globalTitleRemoveMessage) {
    if (regexpMessage.test(prevTitle)) {
      prevTitle = prevTitle.replace(regexpMessage, '').trim();
    }
  }
  document.title = prevTitle;
};

/** 修改网页标题图片 */
export const changeICO = async () => {
  const { titleIco = '' } = await myStorage.getConfig();
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
