import { dom, domP } from '../../tools';

/** 列表内容收起后修改定位，解决部分情况下位置跳转到很下方的问题 */
export const myRecommendClosePosition = {
  prevY: 0,
  yDocument: 0,
  savePosition: function (currentItem: HTMLElement) {
    // 如果存在 .is-collapsed，则为展开操作，不进行保存
    if (!currentItem.querySelector('.is-collapsed')) return;
    // 不是推荐列表则跳出
    if (!dom('.Topstory-recommend')) return;
    const topstoryItem = currentItem.classList.contains('TopstoryItem') ? currentItem : domP(currentItem, 'class', 'TopstoryItem');
    if (!topstoryItem || !topstoryItem.nextElementSibling) return;
    console.log('savePosition', currentItem)
    const nextDom = topstoryItem.nextElementSibling as HTMLElement;
    if (nextDom.getBoundingClientRect().y > 0 && nextDom.getBoundingClientRect().y - window.innerHeight < 0) {
      // 保证收起时的下一项在页面内
      this.prevY = nextDom.offsetTop;
      this.yDocument = document.documentElement.scrollTop;
    } else {
      this.prevY = 0;
      this.yDocument = 0;
    }
  },
  doPosition: function (currentItem: HTMLElement) {
    if (this.prevY === 0 || this.yDocument === 0) return;
    // 如果不存在 .is-collapsed，则为展开后内容，不进行保存
    if (currentItem.querySelector('.is-collapsed')) return;
    // 不是推荐列表则跳出
    if (!dom('.Topstory-recommend')) return;
    console.log('doPosition', currentItem)
    const topstoryItem = currentItem.classList.contains('TopstoryItem') ? currentItem : domP(currentItem, 'class', 'TopstoryItem');
    if (!topstoryItem || !topstoryItem.nextElementSibling) return;
    const nextDom = topstoryItem.nextElementSibling as HTMLElement;
    window.scrollTo({ top: this.yDocument - (this.prevY - nextDom.offsetTop) });
  },
};
