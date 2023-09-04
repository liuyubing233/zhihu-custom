/** 推荐列表最外层绑定事件 */
export const initTopStoryRecommendEvent = () => {
  if (!dom('.Topstory-recommend')) return;
  const classTarget = ['RichContent-cover', 'RichContent-inner', 'ContentItem-more', 'ContentItem-arrowIcon'];
  const canFindTargeted = (e) => {
    let finded = false;
    classTarget.forEach((item) => {
      (e.classList.contains(item) || e.parentElement.classList.contains(item)) && (finded = true);
    });
    return finded;
  };
  dom('.Topstory-recommend').onclick = function (event) {
    const { target } = event;
    const nodeContentItem = domP(target, 'class', 'ContentItem');
    // 点击外置「不感兴趣」按钮
    if (pfConfig.listOutPutNotInterested && target.classList.contains(CLASS_NOT_INTERESTED)) {
      const dataZopJson = nodeContentItem && nodeContentItem.getAttribute('data-zop');
      const { itemId = '', type = '' } = JSON.parse(dataZopJson || '{}');
      doFetchNotInterested({ id: itemId, type });
      domP(target, 'class', 'TopstoryItem').style.display = 'none';
    }
    // 列表内容展示更多
    if (canFindTargeted(target)) {
      setTimeout(() => {
        pfConfig.listItemCreatedAndModifiedTime && addTimes(nodeContentItem);
        pfConfig.showBlockUser && myBlack.addButton(nodeContentItem.parentElement);
      }, 0);
    }
  };
};
