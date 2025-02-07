import { echoData } from '../methods/echo-data';
import { changeICO, changeTitle } from '../methods/page-title';
import { cacheHeader, changeSuspensionTab, suspensionPickupAttribute } from '../methods/suspension';
import { store } from '../store';

/** 加载数据 */
export const initData = () => {
  store.setStorageConfigItem('cacheTitle', document.title);
  echoData();
  changeICO();
  changeTitle();
  changeSuspensionTab();
  suspensionPickupAttribute()
  setTimeout(() => {
    cacheHeader();
  }, 300);
};
