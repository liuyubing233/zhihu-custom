import { CLASS_LISTENED } from '../../misc';
import { dom, domA } from '../../tools';
import { processingData } from './processing-data';
import { recommendHighPerformance } from './recommend-high-performance';

interface IMyListenList {
  initTimestamp: number;
  loaded: boolean;
  /** 列表内容监听加载 */
  init: () => Promise<void>;
  /** 重置列表监听 */
  reset: () => void;
  /** 重新加载监听 */
  restart: () => void;
  /** 加载了数据 */
  dataLoad: () => void;
}

/** 监听列表内容 - 过滤  */
export const myListenList: IMyListenList = {
  initTimestamp: 0,
  loaded: true,
  init: async function () {
    if (!this.loaded) return;
    const nodeLoading = dom('.Topstory-recommend .List-item.List-item');
    const currentTime = +new Date();
    // 存在此元素时为加载数据状态，半秒钟后再次加载
    // 时间戳添加，解决重置问题
    if (nodeLoading || currentTime - this.initTimestamp < 500) {
      setTimeout(() => this.init(), 500);
      return;
    }
    this.initTimestamp = currentTime;
    this.loaded = false;
    await processingData(domA(`.TopstoryItem:not(.${CLASS_LISTENED})`));
    setTimeout(async () => {
      await processingData(domA(`.TopstoryItem:not(.${CLASS_LISTENED})`)); // 每次执行后检测未检测到的项，解决内容重载的问题
    }, 500);
    await recommendHighPerformance();
  },
  reset: function () {
    this.dataLoad();
    domA(`.TopstoryItem.${CLASS_LISTENED}`).forEach((item) => {
      item.classList.remove(CLASS_LISTENED);
    });
  },
  restart: function () {
    this.reset();
    this.init();
  },
  dataLoad: function () {
    this.loaded = true;
  },
};
