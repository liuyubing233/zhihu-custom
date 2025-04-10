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
  /** 用户信息 更改prev: userInfo */
  userInfo: IZhihuUserInfo | undefined = undefined;
  /** 上一个请求的 Headers */
  prevFetchHeaders: HeadersInit = {};
  /** 推荐类别过滤的内容 */
  removeRecommends: IRecommendRemoved[] = [];
  /** 评论区用户信息集合 */
  commendAuthors: IBlockedUser[] = [];
  /** 当前用户主页的回答内容 */
  userAnswers: any[] = [];
  /** 当前用户主页的文章内容 */
  userArticle: any[] = [];
  /** 回答内容过滤的项 */
  removeAnswers: IRecommendRemoved[] = [];
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
    this.setUserArticle = this.setUserArticle.bind(this);
    this.getUserArticle = this.getUserArticle.bind(this);
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

      if (videoInAnswerArticle === EVideoInAnswerArticle.隐藏视频 && target.attachment && target.attachment.video) {
        message = '已删除一条视频回答';
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
    const { removeFromYanxuan, videoInAnswerArticle } = await myStorage.getConfig();
    answers.forEach((item) => {
      let message = '';
      if (removeFromYanxuan && item.answerType === 'paid' && item.labelInfo) {
        message = '已删除一条选自盐选专栏的回答';
      }

      if (videoInAnswerArticle === EVideoInAnswerArticle.隐藏视频 && item.attachment && item.attachment.video) {
        message = '已删除一条视频回答';
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

  setJsInitialData(data: IJsInitialData) {
    this.jsInitialData = data;
  }
  getJsInitialData() {
    return this.jsInitialData;
  }
}

export const store = new Store();
