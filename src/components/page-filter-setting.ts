import { domA, domC } from '../commons/tools';

/** 屏蔽页面设置 */
export const myPageFilterSetting = {
  timeout: undefined,
  init: function () {
    clearTimeout(this.timeout);
    if (/\/settings\/filter/.test(location.pathname)) {
      this.timeout = setTimeout(() => {
        this.addHTML();
        this.init();
      }, 500);
    }
  },
  addHTML: () => {
    const nButton = domC('button', {
      className: 'ctz-button',
      style: 'margin-left: 12px;',
      innerHTML: '移除当前页所有屏蔽话题',
    });
    nButton.onclick = () => {
      domA('.Tag button').forEach((item) => item.click());
    };
    domA('.css-j2uawy').forEach((item) => {
      if (/已屏蔽话题/.test(item.innerText) && !item.querySelector('.ctz-button')) {
        item.appendChild(nButton);
      }
    });
  },
};
