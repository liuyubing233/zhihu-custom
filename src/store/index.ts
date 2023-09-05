import { IFindEvent, IPfHistory, IStorageConfig, IUserinfo } from '../types';

export * from './configs';

/** 用户信息 更改prev: userInfo */
export let userinfo: IUserinfo | undefined = undefined;

export const findEvent: IFindEvent = {
  header: { fun: null, num: 0, isFind: false },
};

/** 脚本内配置缓存 */
export const storageConfig: IStorageConfig = {
  cachePfConfig: {},
  cacheTitle: '',
  fetchHeaders: {},
  heightForList: 0,
  headerDoms: {},
};

/** 缓存浏览历史记录 */
export let pfHistory: IPfHistory = {
  list: [],
  view: [],
};

/** 缓存的历史记录数量 */
export const SAVE_HISTORY_NUMBER = 500;
