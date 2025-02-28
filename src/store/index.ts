import { myStorage } from '../commons/storage';
import { IContentStorageConfig, IFindEvent, IFindEventEntries, IKeyofFindEvent, IKeyofStorageConfig, IRecommendRemoved, IStorageConfig } from '../types';
import { IBlockedUser } from '../types/blocked-users.type';
import { IZhihuAnswerTarget } from '../types/zhihu/zhihu-answer.type';
import { IZhihuRecommendItem } from '../types/zhihu/zhihu-recommend.type';
import { IZhihuUserinfo } from '../types/zhihu/zhihu.type';

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
  /** 回答内容过滤的项 */
  removeAnswers: IRecommendRemoved[] = [];

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
    this.findRemoveAnswers = this.findRemoveAnswers.bind(this);
    this.getRemoveAnswers = this.getRemoveAnswers.bind(this);
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
    const { removeAnonymousQuestion, removeFromYanxuan } = await myStorage.getConfig();
    recommends.forEach((item) => {
      const target = item.target;
      if (!target) return;
      let message = '';
      // 盐选专栏回答
      if (removeFromYanxuan && target.paid_info) {
        message = '选自盐选专栏的回答';
      }
      // 匿名用于的提问
      if (removeAnonymousQuestion && target.question && target.question.author && !target.question.author.id) {
        message = '匿名用户的提问';
      }

      if (message) {
        this.removeRecommends.push({
          id: String(item.target.id),
          message,
        });
      }
    });
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

  async findRemoveAnswers(answers: IZhihuAnswerTarget[]) {
    const { removeFromYanxuan } = await myStorage.getConfig();
    // console.log(answers)
    answers.forEach((item) => {
      let message = '';
      if (removeFromYanxuan && item.answerType === 'paid' && item.labelInfo) {
        message = '已删除一条选自盐选专栏的回答';
      }

      if (message) {
        this.removeAnswers.push({
          id: item.id,
          message,
        });
      }
    });
  }
  getRemoveAnswers() {
    return this.removeAnswers;
  }
}

export const store = new Store();
