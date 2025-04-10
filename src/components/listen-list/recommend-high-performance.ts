import { CLASS_LISTENED } from "../../misc";
import { dom, domA, fnLog, myStorage } from "../../tools";

/** 高性能模式处理推荐列表 */
export const recommendHighPerformance = async () => {
  const { highPerformanceRecommend } = await myStorage.getConfig();
  if (!highPerformanceRecommend) return;
  setTimeout(() => {
    const nodes = domA(`.${CLASS_LISTENED}`);
    if (nodes.length > 50) {
      // 查找最后一个元素显示位置，并在删除最前方元素后将页面位置调整回删除前，解决闪烁问题
      const nodeLast = nodes[nodes.length - 1];
      /** 删除前最后一个元素的位置 */
      const yLastPrev = nodeLast.offsetTop;
      /** 当前页面滚动位置 */
      const yDocument = document.documentElement.scrollTop;
      /** 获取定位元素的唯一标识，通过唯一标识在删除元素后重新获取，解决只获取最后一个元素时已经有新元素添加进来导致的位置错误的情况 */
      const code = nodeLast.dataset.code;

      const nIndex = nodes.length - 50;
      nodes.forEach((item, index) => {
        index < nIndex && item.remove();
      });

      const nNodeLast = dom(`[data-code="${code}"]`);
      if (nNodeLast) {
        /** 删除元素后最后一个元素的位置 */
        const nYLast = nNodeLast.offsetTop;
        // 原页面滚动位置减去最后一个元素位置的差值，得出新的位置，解决闪烁问题
        window.scrollTo({ top: yDocument - (yLastPrev - nYLast) });
      }

      fnLog(`已开启高性能模式，删除${nIndex}条推荐内容`);
    }
  }, 100);
};
