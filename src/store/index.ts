import { CONFIG_FILTER_DEFAULT, CONFIG_HIDDEN_DEFAULT, CONFIG_SUSPENSION } from '../configs/default';
import {
  ETheme,
  EThemeDark,
  EThemeLight,
  IContentStorageConfig,
  IFindEvent,
  IFindEventEntries,
  IHomeFetch,
  IHomeFetchContent,
  IKeyofFindEvent,
  IKeyofHistory,
  IKeyofHomeFetch,
  IKeyofStorageConfig,
  IPfHistory,
  IStorageConfig,
  IZhihuUserinfo,
} from '../types';
import { IPfConfig } from '../types/configs.type';
import { IZhihuListTargetItem } from '../types/zhihu-list.type';

class Store {
  /** 修改器配置 */
  pfConfig: IPfConfig = {
    ...CONFIG_HIDDEN_DEFAULT,
    ...CONFIG_FILTER_DEFAULT,
    ...CONFIG_SUSPENSION,
    fetchInterceptStatus: true,
    customizeCss: '',
    answerOpen: '',
    filterKeywords: [],
    blockWordsAnswer: [],
    showBlockUser: true,
    versionHome: '1000',
    versionAnswer: '1000',
    versionArticle: '1000',
    versionHomeIsPercent: false,
    versionHomePercent: '70',
    versionAnswerIsPercent: false,
    versionAnswerPercent: '70',
    versionArticleIsPercent: false,
    versionArticlePercent: '70',
    zoomImageType: '0',
    zoomImageSize: '600',
    showGIFinDialog: true,
    globalTitle: '',
    titleIco: '',
    questionTitleTag: true,
    listOutPutNotInterested: false,
    fixedListItemMore: false,
    highlightOriginal: true,
    highlightListItem: false,
    listItemCreatedAndModifiedTime: true,
    answerItemCreatedAndModifiedTime: true,
    questionCreatedAndModifiedTime: true,
    articleCreateTimeToTop: true,
    linkShopping: '0',
    fontSizeForList: 15,
    fontSizeForAnswer: 15,
    fontSizeForArticle: 16,
    fontSizeForListTitle: 18,
    fontSizeForAnswerTitle: 22,
    fontSizeForArticleTitle: 24,
    zoomListVideoType: '0',
    zoomListVideoSize: '500',
    hotKey: true,
    theme: ETheme.自动,
    themeLight: EThemeLight.默认,
    themeDark: EThemeDark.夜间护眼一,
    colorText1: '',
    commitModalSizeSameVersion: true,
    listOutputToQuestion: false,
    userHomeContentTimeTop: true,
    userHomeTopBlockUser: true,
    copyAnswerLink: true,
  };

  /** 缓存浏览历史记录 */
  pfHistory: IPfHistory = {
    view: [],
    list: [],
  };

  /** 用户信息 更改prev: userInfo */
  userinfo: IZhihuUserinfo | undefined = undefined;

  findEvent: IFindEvent = {
    header: { fun: null, num: 0, isFind: false },
  };

  /** 脚本内配置缓存 */
  storageConfig: IStorageConfig = {
    cachePfConfig: {},
    cacheTitle: '',
    fetchHeaders: {},
    heightForList: 0,
    headerDoms: {},
  };

  /** 用户页面列表接口缓存 */
  homeFetch: IHomeFetch = {};
  /** 知乎列表接口或JSON内容缓存 */
  zhihuListTargets: IZhihuListTargetItem[] = [];

  constructor() {
    // to fix this is undefined
    this.setConfig = this.setConfig.bind(this);
    this.getConfig = this.getConfig.bind(this);
    this.setHistory = this.setHistory.bind(this);
    this.setHistoryItem = this.setHistoryItem.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.getHistoryItem = this.getHistoryItem.bind(this);
    this.setUserinfo = this.setUserinfo.bind(this);
    this.getUserinfo = this.getUserinfo.bind(this);
    this.setFindEvent = this.setFindEvent.bind(this);
    this.setFindEventItem = this.setFindEventItem.bind(this);
    this.getFindEvent = this.getFindEvent.bind(this);
    this.getFindEventItem = this.getFindEventItem.bind(this);
    this.setStorageConfig = this.setStorageConfig.bind(this);
    this.setStorageConfigItem = this.setStorageConfigItem.bind(this);
    this.getStorageConfig = this.getStorageConfig.bind(this);
    this.getStorageConfigItem = this.getStorageConfigItem.bind(this);
    this.getHomeFetch = this.getHomeFetch.bind(this);
    this.setHomeFetch = this.setHomeFetch.bind(this);
    this.setZhihuListTargets = this.setZhihuListTargets.bind(this);
    this.getZhihuListTargets = this.getZhihuListTargets.bind(this);
    this.clearZhihuListTargets = this.clearZhihuListTargets.bind(this);
  }

  setConfig(inner: IPfConfig) {
    this.pfConfig = inner;
  }
  getConfig() {
    return this.pfConfig;
  }

  setHistory(inner: IPfHistory) {
    this.pfHistory = inner;
  }
  setHistoryItem(key: IKeyofHistory, content: string[]) {
    this.pfHistory[key] = content;
  }
  getHistory() {
    return this.pfHistory;
  }
  getHistoryItem(key: IKeyofHistory) {
    return this.pfHistory[key];
  }

  setUserinfo(inner: IZhihuUserinfo) {
    this.userinfo = inner;
  }
  getUserinfo() {
    return this.userinfo;
  }

  setFindEvent(inner: IFindEvent) {
    this.findEvent = inner;
  }
  setFindEventItem(key: IKeyofFindEvent, content: IFindEventEntries) {
    this.findEvent[key] = content;
  }
  getFindEvent() {
    return this.findEvent;
  }
  getFindEventItem(key: IKeyofFindEvent) {
    return this.findEvent[key];
  }

  setStorageConfig(inner: IStorageConfig) {
    this.storageConfig = inner;
  }
  setStorageConfigItem(key: IKeyofStorageConfig, content: any) {
    (this.storageConfig[key] as IContentStorageConfig) = content;
  }
  getStorageConfig() {
    return this.storageConfig;
  }
  getStorageConfigItem(key: IKeyofStorageConfig): IContentStorageConfig {
    return this.storageConfig[key];
  }

  getHomeFetch(key: IKeyofHomeFetch): IHomeFetchContent | undefined {
    return this.homeFetch[key];
  }
  setHomeFetch(key: IKeyofHomeFetch, content: IHomeFetchContent) {
    this.homeFetch[key] = content;
  }

  setZhihuListTargets(data: IZhihuListTargetItem[]) {
    this.zhihuListTargets = this.zhihuListTargets.concat(data);
  }
  clearZhihuListTargets() {
    this.zhihuListTargets = [];
  }
  getZhihuListTargets() {
    return this.zhihuListTargets;
  }
}

export const store = new Store();
