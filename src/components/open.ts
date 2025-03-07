import { ID_EXTRA_DIALOG } from '../configs';
import { dom, domA, domById, myScroll } from '../tools';
import { echoData } from './echo-data';
import { echoHistory } from './history';
import { CLASS_OPENED } from './menu';

/** 修改器弹窗打开关闭 */
export const openChange = () => {
  const nodeButton = domById('CTZ_OPEN_CLOSE')!;
  if (nodeButton.dataset.close === '1') {
    // 开启
    echoData();
    echoHistory();
    domById('CTZ_DIALOG')!.style.display = 'flex';
    nodeButton.dataset.close = '0';
    myScroll.stop();
  } else {
    // 关闭
    domA('.ctz-dropdown-icon').forEach((item) => item.classList.remove(CLASS_OPENED));
    const nodeDialog = domById('CTZ_DIALOG')!;
    nodeDialog.style.display = 'none';
    nodeDialog.style.height = '';
    dom(`button[name="dialogBig"]`)!.innerText = '+';
    nodeButton.dataset.close = '1';
    myScroll.on();
  }
};

/** 打开额外的弹窗 */
export const openExtra = (type: string) => {
  const extra = domById(ID_EXTRA_DIALOG)!;
  const extraCover = domById('CTZ_EXTRA_OUTPUT_COVER')!;
  const elementsTypes = extra.children;
  for (let i = 0, len = elementsTypes.length; i < len; i++) {
    const item = elementsTypes[i] as HTMLElement;
    item.style.display = item.dataset.type === type ? 'block' : 'none';
  }
  extra.style.display = 'block';
  extraCover.style.display = 'block';
  extra.dataset.status = 'open';
};

/** 关闭额外的弹窗 */
export const closeExtra = () => {
  const extra = domById(ID_EXTRA_DIALOG)!;
  extra.dataset.status = 'close';
  extra.style.display = 'none';
  domById('CTZ_EXTRA_OUTPUT_COVER')!.style.display = 'none';
};
