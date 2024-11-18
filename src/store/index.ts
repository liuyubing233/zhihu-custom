import { IContentStorageConfig, IFindEvent, IFindEventEntries, IKeyofFindEvent, IKeyofStorageConfig, IStorageConfig, IZhihuUserinfo } from '../types';

class Store {
  /** 用户信息 更改prev: userInfo */
  userinfo: IZhihuUserinfo | undefined = undefined;

  findEvent: IFindEvent = {
    header: { fun: null, num: 0, isFind: false },
  };

  /** 脚本内配置缓存 */
  storageConfig: IStorageConfig = {
    cacheTitle: '',
    fetchHeaders: {},
    headerDoms: {},
  };

  constructor() {
    // to fix this is undefined
    this.setUserinfo = this.setUserinfo.bind(this);
    this.getUserinfo = this.getUserinfo.bind(this);
    this.setFindEventItem = this.setFindEventItem.bind(this);
    this.getFindEventItem = this.getFindEventItem.bind(this);
    this.setStorageConfigItem = this.setStorageConfigItem.bind(this);
    this.getStorageConfigItem = this.getStorageConfigItem.bind(this);
  }

  setUserinfo(inner: IZhihuUserinfo) {
    this.userinfo = inner;
  }
  getUserinfo() {
    return this.userinfo;
  }
  setFindEventItem(key: IKeyofFindEvent, content: IFindEventEntries) {
    this.findEvent[key] = content;
  }
  getFindEventItem(key: IKeyofFindEvent) {
    return this.findEvent[key];
  }
  setStorageConfigItem(key: IKeyofStorageConfig, content: any) {
    (this.storageConfig[key] as IContentStorageConfig) = content;
  }
  getStorageConfigItem(key: IKeyofStorageConfig): IContentStorageConfig {
    return this.storageConfig[key];
  }
}

export const store = new Store();
