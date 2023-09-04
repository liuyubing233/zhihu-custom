/** 添加一键邀请功能 */
export const initInviteOnce = () => {
  const domInvation = dom('.QuestionInvitation');
  if (domInvation) {
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
          fnToInvateAll();
        }
      };

      const fnToInvateAll = () => {
        const invatations = domA('.QuestionInvitation .ContentItem-extra button');
        invatations.forEach((item) => {
          !item.disabled && !item.classList.contains('AutoInviteItem-button--closed') && item.click();
        });
      };

      fnToMore();
    };

    domInvation.querySelector('.Topbar').appendChild(nButton);
  }
};
