import { dom, domById, domC, myStorage } from '../../tools';

const CLASS_TOP_BLOCK = 'ctz-top-block-in-user-home';
let blockObserver: MutationObserver | undefined;

let index = 0;
/** 用户主页置顶「屏蔽用户」按钮 */
export const topBlockUser = async () => {
  const { userHomeTopBlockUser } = await myStorage.getConfig();
  const nodeUserHeaderOperate = dom('.ProfileHeader-contentFooter .MemberButtonGroup');
  const nodeFooterOperations = dom('.Profile-footerOperations');
  if (!nodeUserHeaderOperate || !userHomeTopBlockUser || !nodeFooterOperations) return;
  const isMe = nodeUserHeaderOperate.innerText.includes('编辑个人资料');
  if (isMe) return;

  const domProfileHeader = domById('ProfileHeader');
  if (!domProfileHeader || !domProfileHeader.dataset.zaExtraModule) {
    // 解决用户主页重置的情况
    console.log('Timeout topBlockUser11')
    setTimeout(topBlockUser, 500);
    return;
  }

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
    if (isBlocked) {
      // 解除屏蔽
      domUnblock.click();
    } else {
      domBlock.click();
    }
  };
  nodeUserHeaderOperate.insertBefore(nDomButton, domUnblock);
  blockObserver && blockObserver.disconnect();
  blockObserver = new MutationObserver(() => {
    console.log('MutationObserver blockObserver')
    topBlockUser();
  });
  blockObserver.observe(nodeFooterOperations, {
    attributes: false,
    childList: true,
    characterData: false,
    characterDataOldValue: false,
    subtree: true,
  });

  if (index === 0) {
    index++
    console.log('Timeout topBlockUser22')
    setTimeout(topBlockUser, 1000);
  }
};
