import { domA, domP, myStorage } from '../../tools';

const CLASS_JUST_NUMBER = 'ctz-just-number';
let timestamp = 0;

/** 操作栏仅显示数字和图标 */
export const fnJustNumberInAction = async () => {
  const { justNumberInAction } = await myStorage.getConfig();
  if (!justNumberInAction) return;

  const nTimestamp = +new Date();
  if (nTimestamp - timestamp < 300) {
    setTimeout(fnJustNumberInAction, 300);
    return;
  }

  timestamp = nTimestamp;

  const nodes = domA(`.ContentItem .ContentItem-actions:not(.${CLASS_JUST_NUMBER})`);
  nodes.forEach((item) => {
    item.classList.add(CLASS_JUST_NUMBER);
    /** 赞同按钮 */
    const buttonVoteUp = item.querySelector('.VoteButton--up');
    /** 不赞同按钮 */
    const buttonVoteDown = item.querySelector('.VoteButton--down');
    /** 评论按钮 */
    const buttonComment = item.querySelector('.Zi--Comment') ? domP(item.querySelector('.Zi--Comment'), 'class', 'Button')! : undefined;
    /** 分享按钮 */
    const buttonShare = item.querySelector('.Zi--Share') ? domP(item.querySelector('.Zi--Share'), 'class', 'Button')! : undefined;
    /** 收藏按钮 */
    const buttonCollection = item.querySelector('.Zi--Star') ? domP(item.querySelector('.Zi--Star'), 'class', 'Button')! : undefined;
    /** 喜欢按钮 */
    const buttonLike = item.querySelector('.Zi--Heart') ? domP(item.querySelector('.Zi--Heart'), 'class', 'Button')! : undefined;

    buttonVoteUp && (buttonVoteUp.innerHTML = (buttonVoteUp.innerHTML || '').replace(/(已)?赞同\s*/, ''));
    buttonComment && (buttonComment.innerHTML = (buttonComment.innerHTML || '').replace(/\s*(条|添加|收起)?评论/, ''));
    buttonShare && (buttonShare.innerHTML = (buttonShare.innerHTML || '').replace(/分享/, ''));
    buttonCollection && (buttonCollection.innerHTML = (buttonCollection.innerHTML || '').replace(/(取消)?收藏/, ''));
    buttonLike && (buttonLike.innerHTML = (buttonLike.innerHTML || '').replace(/喜欢/, ''));
  });
};
