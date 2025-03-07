import { myStorage } from '../../commons/storage';
import { dom, message } from '../../commons/tools';
import { myCachePageTitle } from './cache';
import { changeTitle } from './change';

/** 点击确认修改网页标题按钮 */
export const buttonConfirmPageTitle = async () => {
  const nodeTitle = dom('[name="globalTitle"]') as HTMLInputElement;
  await myStorage.updateConfigItem('globalTitle', nodeTitle ? nodeTitle.value : '');
  changeTitle();
  message('网页标题修改成功');
};

/** 点击按钮还原网页标题 */
export const buttonResetPageTitle = async () => {
  const domGlobalTitle = dom('[name="globalTitle"]') as HTMLInputElement;
  domGlobalTitle && (domGlobalTitle.value = myCachePageTitle.get());
  await myStorage.updateConfigItem('globalTitle', '');
  changeTitle();
  message('网页标题已还原');
};
