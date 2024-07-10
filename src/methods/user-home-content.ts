import { dom, domA, domC, insertAfter } from '../commons/tools';
import { CLASS_TIME_ITEM } from '../configs';
import { store } from '../store';
import { timeFormatter } from './time';

let timer: NodeJS.Timeout | undefined = undefined;

/** 用户主页回答内容修改、用户主页文章内容修改 */
export const userHomeAnswers = () => {
  const { userHomeContentTimeTop } = store.getConfig();
  if (!userHomeContentTimeTop) return;

  const doContent = (domList: NodeListOf<HTMLElement>) => {
    for (let i = 0, len = domList.length; i < len; i++) {
      const nodeItem = domList[i];
      const nodeTitle = nodeItem.querySelector('.ContentItem-title');
      if (!nodeTitle || nodeItem.querySelector(`.${CLASS_TIME_ITEM}`)) continue;

      const nodeDateCreate = nodeItem.querySelector('[itemprop="dateCreated"]');
      const nodeDatePublished = nodeItem.querySelector('[itemprop="datePublished"]');
      const nodeDateModified = nodeItem.querySelector('[itemprop="dateModified"]');
      let innerHTML = '';
      if (nodeDateCreate) {
        const dateCreate = nodeDateCreate.getAttribute('content') || '';
        const dateCreateFormatter = timeFormatter(dateCreate);
        innerHTML += `<div>创建时间：${dateCreateFormatter}</div>`;
      }

      if (nodeDatePublished) {
        const datePublished = nodeDatePublished.getAttribute('content') || '';
        const datePublishedFormatter = timeFormatter(datePublished);
        innerHTML += `<div>发布时间：${datePublishedFormatter}</div>`;
      }

      if (nodeDateModified) {
        const dateModified = nodeDateModified.getAttribute('content') || '';
        const dateModifiedFormatter = timeFormatter(dateModified);
        innerHTML += `<div>最后修改时间：${dateModifiedFormatter}</div>`;
      }

      insertAfter(
        domC('div', {
          className: CLASS_TIME_ITEM,
          innerHTML,
          style: 'line-height: 24px;padding-top: 2px;font-size: 14px;',
        }),
        nodeTitle
      );
    }
  };

  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    const domPlaceHolder = dom('.List-item.PlaceHolder');
    const domList = domA('.List-item:not(.PlaceHolder)');
    !domPlaceHolder ? doContent(domList) : userHomeAnswers();
  }, 500);
};

const CLASS_TOP_BLOCK = 'ctz-top-block-in-user-home';
let blockObserver: MutationObserver | undefined;

/** 用户主页置顶「屏蔽用户」按钮 */
export const topBlockUser = () => {
  const { userHomeTopBlockUser } = store.getConfig();
  const nodeUserHeaderOperate = dom('.ProfileHeader-contentFooter .MemberButtonGroup');
  const nodeFooterOperations = dom('.Profile-footerOperations');
  if (!nodeUserHeaderOperate || !userHomeTopBlockUser || !nodeFooterOperations) return;
  const isMe = nodeUserHeaderOperate.innerText.includes('编辑个人资料');
  if (isMe) return;
  /** 是否是已经屏蔽的用户 */
  const isBlocked = nodeUserHeaderOperate.innerText.includes('已屏蔽');
  const domFind = dom(`.${CLASS_TOP_BLOCK}`);
  domFind && domFind.remove();
  const nDomButton = domC('button', {
    className: `Button Button--primary Button--red ${CLASS_TOP_BLOCK}`,
    innerText: isBlocked ? '解除屏蔽' : '屏蔽用户',
  });
  const domUnblock = nodeUserHeaderOperate.firstChild as HTMLButtonElement;
  const domBlock = nodeFooterOperations.firstChild as HTMLButtonElement;
  nDomButton.onclick = function () {
    isBlocked ? domUnblock.click() : domBlock.click();
  };
  nodeUserHeaderOperate.insertBefore(nDomButton, domUnblock)
  blockObserver = new MutationObserver(() => {
    topBlockUser();
  });
  blockObserver.observe(nodeFooterOperations, {
    attributes: false,
    childList: true,
    characterData: false,
    characterDataOldValue: false,
    subtree: true,
  });
};
