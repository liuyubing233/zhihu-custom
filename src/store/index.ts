import { myStorage } from '../commons/storage';
import { IContentStorageConfig, IFindEvent, IFindEventEntries, IKeyofFindEvent, IKeyofStorageConfig, IStorageConfig, IZhihuUserinfo } from '../types';
import { IZhihuRecommendItem } from '../types/zhihu-recommend.type';

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

  removeRecommendIds: string[] = [];

  constructor() {
    // fix this is undefined
    this.setUserinfo = this.setUserinfo.bind(this);
    this.getUserinfo = this.getUserinfo.bind(this);
    this.setFindEventItem = this.setFindEventItem.bind(this);
    this.getFindEventItem = this.getFindEventItem.bind(this);
    this.setStorageConfigItem = this.setStorageConfigItem.bind(this);
    this.getStorageConfigItem = this.getStorageConfigItem.bind(this);
    this.findRemoveRecommends = this.findRemoveRecommends.bind(this);
    this.getRemoveRecommends = this.getRemoveRecommends.bind(this);
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

  async findRemoveRecommends(recommends: IZhihuRecommendItem[]) {
    const config = await myStorage.getConfig();
    // console.log('recommends', recommends, config.removeFromYanxuan)
    for (let i = 0, len = recommends.length; i < len; i++) {
      const item = recommends[i];
      if (!item.target) continue;
      // console.log(item.target.paid_info)
      // 盐选专栏回答
      if (config.removeFromYanxuan && item.target.paid_info) {
        // console.log('......removeRecommendIds', true);

        this.removeRecommendIds = [...this.removeRecommendIds, String(item.target.id)];
      }
    }

    // console.log('this.removeRecommendIds', this.removeRecommendIds);
  }
  getRemoveRecommends() {
    return this.removeRecommendIds;
  }
}

export const store = new Store();
