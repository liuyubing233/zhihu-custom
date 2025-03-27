import { dom } from '../tools';

/** 路径上存在 ctzType的操作, 一键设置 */
export const myCtzTypeOperation = {
  init: function () {
    const params = new URLSearchParams(location.search);
    let ctzType = params.get('ctzType') as '1' | '2' | '3';
    this[ctzType] && this[ctzType]();
  },
  /** 移除、关注问题并关闭网页 */
  '1': function () {
    const domQuestion = dom('.QuestionPage');
    if (domQuestion && domQuestion.getAttribute('data-za-extra-module')) {
      this.clickAndClose('.QuestionButtonGroup button');
    } else {
      setTimeout(() => {
        console.log('Timeout myCtzTypeOperation1')
        this['1']();
      }, 500);
    }
  },
  /** 移除、关注话题并关闭网页 */
  '2': function () {
    this.clickAndClose('.TopicActions .FollowButton');
  },
  /** 移除、关注收藏夹并关闭网页 */
  '3': function () {
    const domQuestion = dom('.CollectionsDetailPage');
    if (domQuestion && domQuestion.getAttribute('data-za-extra-module')) {
      this.clickAndClose('.CollectionDetailPageHeader-actions .FollowButton');
    } else {
      setTimeout(() => {
        console.log('Timeout myCtzTypeOperation3')
        this['3']();
      }, 500);
    }
  },
  clickAndClose: function (eventname: string) {
    const nodeItem = dom(eventname);
    if (nodeItem) {
      nodeItem.click();
      setTimeout(() => {
        console.log('Timeout clickAndClose')
        window.close();
      }, 300);
    }
  },
};
