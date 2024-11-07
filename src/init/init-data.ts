import { echoData } from '../methods/echo-data';
import { changeICO } from '../methods/page-title';
import { cacheHeader, changeSuspensionTab } from '../methods/suspension';

/** 加载数据 */
export const initData = () => {
  echoData();
  changeICO();
  // changeTitle();
  changeSuspensionTab();
  setTimeout(() => {
    cacheHeader();
  }, 300);
};
