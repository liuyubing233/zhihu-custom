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

  /** 过滤的盐选回答ID */
  removeRecommendIds: string[] = [];
  /** 当前用户主页的回答内容 */
  userAnswers: any[] = [];
  /** 当前用户主页的文章内容 */
  userArticle: any[] = [];

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
    this.setUserAnswer = this.setUserAnswer.bind(this);
    this.getUserAnswer = this.getUserAnswer.bind(this);
    this.setUserArticle = this.setUserArticle.bind(this);
    this.getUserArticle = this.getUserArticle.bind(this);
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
    for (let i = 0, len = recommends.length; i < len; i++) {
      const item = recommends[i];
      if (!item.target) continue;
      // 盐选专栏回答
      if (config.removeFromYanxuan && item.target.paid_info) {
        this.removeRecommendIds = [...this.removeRecommendIds, String(item.target.id)];
      }
    }
  }
  getRemoveRecommends() {
    return this.removeRecommendIds;
  }

  setUserAnswer(data: any[]) {
    this.userAnswers = data;
  }
  getUserAnswer() {
    return this.userAnswers;
  }
  setUserArticle(data: any[]) {
    this.userArticle = data;
  }
  getUserArticle() {
    return this.userArticle;
  }
}

export const store = new Store();
