/** 加载设置弹窗绑定方法 */
export const initOperate = () => {
  const myOperation = {
    [CLASS_INPUT_CLICK]: fnChanger,
    [CLASS_INPUT_CHANGE]: fnChanger,
    'ctz-button': (even) => myButtonOperation[even.name] && myButtonOperation[even.name](),
  };
  const operation = (even) => {
    for (let key in myOperation) {
      even.target.classList.contains(key) && myOperation[key](even.target);
    }
  };
  dom('.ctz-content').onclick = operation;
  dom('.ctz-content').onchange = operation;
  dom('.ctz-menu-top').onclick = myMenu.click;
  domA('.ctz-preview').forEach((item) => {
    item.onclick = function () {
      myPreview.hide(this);
    };
  });

  domA('[name="button_history_clear"]').forEach((item) => {
    item.onclick = async (event) => {
      const dataId = event.target.getAttribute('data-id');
      const isClear = confirm(`是否清空${event.target.innerText}`);
      if (!isClear) return;
      pfHistory[dataId] = [];
      await myStorage.set('pfHistory', JSON.stringify(pfHistory));
      echoHistory();
    };
  });

  // 绑定元素事件
  domById('CTZ_OPEN_BUTTON').onclick = myDialog.open;
  domById('CTZ_CLOSE_DIALOG').onclick = myDialog.hide;
  initTopStoryRecommendEvent();
};
