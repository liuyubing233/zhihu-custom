import { myStorage } from '../commons/storage';
import {
  IBlockedUser,
  IContentStorageConfig,
  IFindEvent,
  IFindEventEntries,
  IKeyofFindEvent,
  IKeyofStorageConfig,
  IRecommendRemoved,
  IStorageConfig,
  IZhihuUserinfo
} from '../types';
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
  removeRecommends: IRecommendRemoved[] = [];
  /** 评论区用户信息集合 */
  commendAuthors: IBlockedUser[] = [];
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
    this.setCommentAuthors = this.setCommentAuthors.bind(this);
    this.getCommentAuthors = this.getCommentAuthors.bind(this);
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
      const target = item.target;
      if (!target) continue;
      let message = '';
      // 盐选专栏回答
      if (config.removeFromYanxuan && target.paid_info) {
        message = '选自盐选专栏的回答';
      }
      // 匿名用于的提问
      if (config.removeAnonymousQuestion && target.question && target.question.author && !target.question.author.id) {
        message = '匿名用户的提问';
      }

      if (message) {
        this.removeRecommends.push({
          id: String(item.target.id),
          message,
        });
      }
    }
  }
  getRemoveRecommends() {
    return this.removeRecommends;
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
  async setCommentAuthors(authors: IBlockedUser[]) {
    this.commendAuthors = authors;
  }
  getCommentAuthors() {
    return this.commendAuthors;
  }
}

export const store = new Store();
