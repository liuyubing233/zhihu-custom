import { dom, domA, domC } from '../commons/tools';

/** 初始化一键邀请功能 */
export const initOneClickInvitation = () => {
  setTimeout(() => {
    const domInvitation = dom('.QuestionInvitation');
    if (!domInvitation || dom('.ctz-invite-once')) return;
    const nButton = domC('button', {
      className: 'ctz-button ctz-invite-once',
      innerHTML: '一键邀请',
      style: 'margin-left: 12px;',
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
        const nodeInvites = domA('.QuestionInvitation .ContentItem-extra button') as NodeListOf<HTMLButtonElement>;
        nodeInvites.forEach((item) => {
          !item.disabled && !item.classList.contains('AutoInviteItem-button--closed') && item.click();
        });
      };

      fnToMore();
    };

    const nodeTopBar = domInvitation.querySelector('.Topbar');
    nodeTopBar && nodeTopBar.appendChild(nButton);
  }, 500);
};
