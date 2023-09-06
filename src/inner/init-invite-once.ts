import { dom, domA, domC } from '../commons/tools';

/** 添加一键邀请功能 */
export const initInviteOnce = () => {
  const domInvitation = dom('.QuestionInvitation');
  if (!domInvitation) return;
  const nButton = domC('button', {
    className: 'ctz-button',
    innerHTML: '一键邀请',
  });
  nButton.onclick = () => {
    const fnToMore = () => {
      const moreAction = dom('.QuestionMainAction');
      if (moreAction) {
        moreAction.click();
        setTimeout(() => {
          fnToMore();
        }, 50);
      } else {
        fnToInviteAll();
      }
    };

    const fnToInviteAll = () => {
      const nodeInvites = domA('.QuestionInvitation .ContentItem-extra button');
      nodeInvites.forEach((item) => {
        !item.disabled && !item.classList.contains('AutoInviteItem-button--closed') && item.click();
      });
    };

    fnToMore();
  };

  const nodeTopBar = domInvitation.querySelector('.Topbar');
  nodeTopBar && nodeTopBar.appendChild(nButton);
};
