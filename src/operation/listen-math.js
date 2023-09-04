import { fnLog } from './tools';

/** 监听过滤内容 */
export const fnHiddenDom = (lessNum, ev, log) => {
  ev.style.display = 'none';
  fnLog(log);
  return ++lessNum;
};

/** 计算过滤起始位置 */
export const fnIndexMath = (index, i, len, lessNum) => {
  return i + 1 === len ? (i - lessNum >= 0 ? i - lessNum : 0) : index;
};

/** 仅显示数字内容 */
export const fnJustNum = (element) => {
  if (!element) return;
  const { justVoteNum, justCommitNum } = pfConfig;
  const nodeVoteup = element.querySelector('.VoteButton--up');
  if (justVoteNum && nodeVoteup) {
    nodeVoteup.style = 'font-size: 14px!important;';
    nodeVoteup.innerHTML = nodeVoteup.innerHTML.replace('赞同 ', '');
  }
  if (justCommitNum) {
    const buttons = element.querySelectorAll('.ContentItem-actions button');
    for (let i = 0; i < buttons.length; i++) {
      const buttonThis = buttons[i];
      if (buttonThis.innerHTML.includes('条评论')) {
        buttonThis.style = 'font-size: 14px!important;margin-top:-5px;';
        buttonThis.innerHTML = buttonThis.innerHTML.replace('条评论', '');
      }
    }
  }
};
