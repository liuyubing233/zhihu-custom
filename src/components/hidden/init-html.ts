import { domById } from '../../commons/tools';
import { createHTMLFormBoxSwitch } from '../../init/init-html/common-html';
import { HIDDEN_ARRAY } from './configs';

/** 初始化隐藏元素设置，添加修改器隐藏模块设置元素 */
export const createHTMLHiddenConfig = () => {
  // 隐藏元素部分
  domById('CTZ_HIDDEN')!.innerHTML = HIDDEN_ARRAY.map(
    (item) => (item.name ? `<div class="ctz-title">${item.name}<span>${item.desc}</span></div>` : '') + createHTMLFormBoxSwitch(item.content)
  ).join('');
};
