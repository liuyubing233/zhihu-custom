import { dom, domById, fnAppendStyle, fnReturnStr, myStorage } from '../../tools';

/** 在页面尺寸修改后更新的样式 */
export const changeSizeBeforeResize = async () => {
  const { suspensionPickupRight, suspensionPickUp } = await myStorage.getConfig();

  const prevContentBox =
    domById('TopstoryContent') || dom('.Question-mainColumn') || domById('SearchMain') || dom('.Profile-mainColumn') || dom('.CollectionsDetailPage-mainColumn') || document.body;
  // 如果尺寸大于document.body 则使用 body 尺寸
  const nodeContentBox = prevContentBox.offsetWidth > document.body.offsetWidth ? document.body : prevContentBox;
  let suspensionRight = +(suspensionPickupRight || 0);
  if (nodeContentBox) {
    suspensionRight = window.innerWidth - nodeContentBox.getBoundingClientRect().width - nodeContentBox.getBoundingClientRect().left + +(suspensionPickupRight || 0);
  }
  fnAppendStyle(
    'CTZ_STYLE_CHANGE_AFTER_RESIZE',
    // 收起按钮悬浮
    fnReturnStr(`.ContentItem-actions.Sticky.is-fixed button[data-zop-retract-question="true"]{right: ${suspensionRight}px;}`, suspensionPickUp)
  );
};
