/** 路径上存在 ctzType的操作 */
export const myCtzTypeOperation = {
  init: function () {
    const params = new URLSearchParams(search);
    let ctzType = params.get('ctzType');
    this[ctzType] && this[ctzType]();
  },
  1: () => {
    // 移除、关注问题并关闭网页
    dom('.QuestionButtonGroup button') && dom('.QuestionButtonGroup button').click();
    window.close();
  },
  2: () => {
    // 移除、关注话题并关闭网页
    dom('.TopicActions .FollowButton') && dom('.TopicActions .FollowButton').click();
    window.close();
  },
  3: () => {
    // 移除、关注收藏夹并关闭网页
    dom('.CollectionDetailPageHeader-actions .FollowButton') && dom('.CollectionDetailPageHeader-actions .FollowButton').click();
    window.close();
  },
};
