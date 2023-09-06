import { domA, domC } from '../commons/tools';

/** 屏蔽页面设置 */
export const myPageFilterSetting: IMyPageFilterSetting = {
  timeout: undefined,
  init: function () {
    this.timeout && clearTimeout(this.timeout);
    if (/\/settings\/filter/.test(location.pathname)) {
      this.timeout = setTimeout(() => {
        this.addHTML();
        this.init();
      }, 500);
    }
  },
  addHTML: () => {
    const elementButton = domC('button', {
      className: 'ctz-button',
      style: 'margin-left: 12px;',
      innerHTML: '移除当前页所有屏蔽话题',
    });
    elementButton.onclick = () => {
      domA('.Tag button').forEach((item) => item.click());
    };
    domA('.css-j2uawy').forEach((item) => {
      if (/已屏蔽话题/.test(item.innerText) && !item.querySelector('.ctz-button')) {
        item.appendChild(elementButton);
      }
    });
  },
};

interface IMyPageFilterSetting {
  timeout?: NodeJS.Timeout;
  init: () => void;
  addHTML: () => void;
}
