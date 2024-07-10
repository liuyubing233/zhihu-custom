import { store } from '../store';
import { fnLog } from './tools';

/** 监听过滤内容 */
export const fnHiddenDom = (lessNum: number, ev: HTMLElement, log: string) => {
  ev.style.display = 'none';
  fnLog(log);
  return ++lessNum;
};

/** 计算过滤起始位置 */
export const fnIndexMath = (index: number, i: number, len: number, lessNum: number) => {
  return i + 1 === len ? (i - lessNum >= 0 ? i - lessNum : 0) : index;
};

/** 仅显示数字内容 */
export const fnJustNum = (element: HTMLElement) => {
  if (!element) return;
  const { justVoteNum, justCommitNum } = store.getConfig();
  const nodeVoteUp = element.querySelector('.VoteButton--up') as HTMLButtonElement;
  if (justVoteNum && nodeVoteUp) {
    nodeVoteUp.style.cssText = 'font-size: 14px!important;';
    nodeVoteUp.innerHTML = nodeVoteUp.innerHTML.replace('赞同 ', '');
  }
  if (justCommitNum) {
    const buttons = element.querySelectorAll('.ContentItem-actions button');
    for (let i = 0; i < buttons.length; i++) {
      const buttonThis = buttons[i] as HTMLButtonElement;
      if (buttonThis.innerHTML.includes('条评论')) {
        buttonThis.style.cssText = 'font-size: 14px!important;margin-top:-5px;';
        buttonThis.innerHTML = buttonThis.innerHTML.replace('条评论', '');
      }
    }
  }
};
