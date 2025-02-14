import { myStorage } from '../commons/storage';
import { domById } from '../commons/tools';

/** 判断是否第一次使用修改器 */
export const initFirstUse = async () => {
  const { isUsed2 } = await myStorage.getConfig();
  if (isUsed2) return;
  domById('CTZ_FIRST_VERSION_5')!.style.display = 'block';
  domById('BUTTON_FIRST_USE')!.onclick = async function () {
    domById('CTZ_FIRST_VERSION_5')!.style.display = 'none';
    myStorage.updateConfigItem('isUsed2', true);
  };
};
