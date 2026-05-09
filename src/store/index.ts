import { IBlockedUser } from '../components/black-list';
import { EVideoInAnswerArticle } from '../components/select';
import { myStorage } from '../tools';
import { IJsInitialData, IZhihuAnswerTarget, IZhihuRecommendItem, IZhihuUserInfo } from '../types/zhihu';

/** 回答需要移除的ID和移除信息 */
interface IRecommendRemoved {
  id: string;
  message: string;
}

class Store {
  static readonly MAX_REMOVE_CACHE = 2000;
  /** 用户信息 更改prev: userInfo */
  userInfo: IZhihuUserInfo | undefined = undefined;
  /** 上一个请求的 Headers */
  prevFetchHeaders: HeadersInit = {};
  /** 推荐类别过滤的内容 */
  removeRecommends: IRecommendRemoved[] = [];
  removeRecommendMap = new Map<string, string>();
  /** 评论区用户信息集合 */
  commendAuthors: IBlockedUser[] = [];
  /** 当前用户主页的回答内容 */
  userAnswers: any[] = [];
  userAnswersRequestUrl = '';
  /** 当前用户主页的文章内容 */
  userArticle: any[] = [];
  userArticleRequestUrl = '';
  /** 回答内容过滤的项 */
  removeAnswers: IRecommendRemoved[] = [];
  removeAnswerMap = new Map<string, string>();
  /** 页面初始化的数据，取自 document.getElementById('js-initialData') */
  jsInitialData: IJsInitialData | undefined = undefined;

  constructor() {
    // fix this is undefined
    this.setUserInfo = this.setUserInfo.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.setFetchHeaders = this.setFetchHeaders.bind(this);
    this.getFetchHeaders = this.getFetchHeaders.bind(this);
    this.findRemoveRecommends = this.findRemoveRecommends.bind(this);
    this.getRemoveRecommends = this.getRemoveRecommends.bind(this);
    this.setUserAnswer = this.setUserAnswer.bind(this);
    this.getUserAnswer = this.getUserAnswer.bind(this);
    this.getUserAnswerRequestUrl = this.getUserAnswerRequestUrl.bind(this);
    this.setUserArticle = this.setUserArticle.bind(this);
    this.getUserArticle = this.getUserArticle.bind(this);
    this.getUserArticleRequestUrl = this.getUserArticleRequestUrl.bind(this);
    this.setCommentAuthors = this.setCommentAuthors.bind(this);
    this.getCommentAuthors = this.getCommentAuthors.bind(this);
    this.findRemoveAnswers = this.findRemoveAnswers.bind(this);
    this.getRemoveAnswers = this.getRemoveAnswers.bind(this);
    this.setJsInitialData = this.setJsInitialData.bind(this);
    this.getJsInitialData = this.getJsInitialData.bind(this);
  }

  setUserInfo(inner: IZhihuUserInfo) {
    this.userInfo = inner;
  }
  getUserInfo() {
    return this.userInfo;
  }

  setFetchHeaders(headers: HeadersInit) {
    this.prevFetchHeaders = headers;
  }
  getFetchHeaders() {
    return this.prevFetchHeaders;
  }

  async findRemoveRecommends(recommends: IZhihuRecommendItem[]) {
    const { removeAnonymousQuestion, removeFromYanxuan, videoInAnswerArticle } = await myStorage.getConfig();
    for (const item of recommends) {
      const target = item.target;
      if (!target) continue;
      let message = '';
      // 盐选专栏回答
      if (removeFromYanxuan && target.paid_info) {
        message = '选自盐选专栏的回答';
      }
      // 匿名用于的提问
      if (removeAnonymousQuestion && target.question && target.question.author && !target.question.author.id) {
        message = '匿名用户的提问';
      }

      if (videoInAnswerArticle === EVideoInAnswerArticle.隐藏视频 && target.attachment && target.attachment.video) {
        message = '已删除一条视频回答';
      }

      if (message) {
        const id = String(item.target.id);
        this.removeRecommendMap.set(id, message);
      }
    }
    this.syncRemoveRecommends();
  }
  getRemoveRecommends() {
    return this.removeRecommends;
  }

  setUserAnswer(data: any[], requestUrl = '') {
    this.userAnswers = data;
    if (requestUrl) {
      this.userAnswersRequestUrl = requestUrl;
    }
  }
  getUserAnswer() {
    return this.userAnswers;
  }
  getUserAnswerRequestUrl() {
    return this.userAnswersRequestUrl;
  }
  setUserArticle(data: any[], requestUrl = '') {
    this.userArticle = data;
    if (requestUrl) {
      this.userArticleRequestUrl = requestUrl;
    }
  }
  getUserArticle() {
    return this.userArticle;
  }
  getUserArticleRequestUrl() {
    return this.userArticleRequestUrl;
  }
  async setCommentAuthors(authors: IBlockedUser[]) {
    this.commendAuthors = authors;
  }
  getCommentAuthors() {
    return this.commendAuthors;
  }

  async findRemoveAnswers(answers: IZhihuAnswerTarget[]) {
    const { removeFromYanxuan, videoInAnswerArticle } = await myStorage.getConfig();
    for (const item of answers) {
      let message = '';
      if (removeFromYanxuan && item.answerType === 'paid' && item.labelInfo) {
        message = '已删除一条选自盐选专栏的回答';
      }

      if (videoInAnswerArticle === EVideoInAnswerArticle.隐藏视频 && item.attachment && item.attachment.video) {
        message = '已删除一条视频回答';
      }

      if (message) {
        this.removeAnswerMap.set(String(item.id), message);
      }
    }
    this.syncRemoveAnswers();
  }
  getRemoveAnswers() {
    return this.removeAnswers;
  }

  setJsInitialData(data: IJsInitialData) {
    this.jsInitialData = data;
  }
  getJsInitialData() {
    return this.jsInitialData;
  }

  syncRemoveRecommends() {
    const overflow = this.removeRecommendMap.size - Store.MAX_REMOVE_CACHE;
    if (overflow > 0) {
      const keys = this.removeRecommendMap.keys();
      for (let i = 0; i < overflow; i++) {
        const key = keys.next().value;
        if (key === undefined) break;
        this.removeRecommendMap.delete(key);
      }
    }
    this.removeRecommends = Array.from(this.removeRecommendMap.entries()).map(([id, message]) => ({ id, message }));
  }

  syncRemoveAnswers() {
    const overflow = this.removeAnswerMap.size - Store.MAX_REMOVE_CACHE;
    if (overflow > 0) {
      const keys = this.removeAnswerMap.keys();
      for (let i = 0; i < overflow; i++) {
        const key = keys.next().value;
        if (key === undefined) break;
        this.removeAnswerMap.delete(key);
      }
    }
    this.removeAnswers = Array.from(this.removeAnswerMap.entries()).map(([id, message]) => ({ id, message }));
  }
}

export const store = new Store();
