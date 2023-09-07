import { dom } from '../commons/tools';

/** 路径上存在 ctzType的操作, 一键设置 */
export const myCtzTypeOperation = {
  init: function () {
    const params = new URLSearchParams(location.search);
    let ctzType = params.get('ctzType') as '1' | '2' | '3';
    this[ctzType] && this[ctzType]();
  },
  '1': /** 移除、关注问题并关闭网页 */ function () {
    this.clickAndClose('.QuestionButtonGroup button');
  },
  '2': /** 移除、关注话题并关闭网页 */ function () {
    this.clickAndClose('.TopicActions .FollowButton');
  },
  '3': /** 移除、关注收藏夹并关闭网页 */ function () {
    this.clickAndClose('.CollectionDetailPageHeader-actions .FollowButton');
  },
  clickAndClose: (eventname: string) => {
    const nodeItem = dom(eventname);
    nodeItem && nodeItem.click();
    window.close();
  },
};
