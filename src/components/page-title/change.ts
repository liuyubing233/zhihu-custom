import { dom, domById, domC, myStorage } from '../../tools';
import { myCachePageTitle } from './cache';
import { ICO_URL } from './create-html';

const REGEXP_MESSAGE = /^\([^()]+\)/;

/** 修改网页标题 */
export const changeTitle = async () => {
  const { globalTitle, globalTitleRemoveMessage } = await myStorage.getConfig();
  let prevTitle = globalTitle || myCachePageTitle.get();
  if (globalTitleRemoveMessage) {
    if (REGEXP_MESSAGE.test(prevTitle)) {
      prevTitle = prevTitle.replace(REGEXP_MESSAGE, '').trim();
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
