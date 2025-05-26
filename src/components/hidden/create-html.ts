import { createHTMLFormBoxSwitch } from '../../init/init-html/common-html';
import { dom } from '../../tools';
import { HIDDEN_ARRAY } from './configs';

/** 初始化隐藏元素设置，添加修改器隐藏模块设置元素 */
export const createHTMLHiddenConfig = (domMain: HTMLElement) => {
  // 隐藏元素部分
  dom('#CTZ_HIDDEN', domMain)!.innerHTML = HIDDEN_ARRAY.map(
    (item, index) => (item.name ? `<div class="ctz-title">${item.name}<span>${item.desc}</span></div>` : '') + createHTMLFormBoxSwitch(item.content)
  ).join('');
};
