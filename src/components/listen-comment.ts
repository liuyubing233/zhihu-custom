import { CTZ_HIDDEN_ITEM_CLASS } from '../commons/math-for-my-listens';
import { myStorage } from '../commons/storage';
import { dom, domA, domC, domP, fnLog } from '../commons/tools';
import { CLASS_ZHIHU_COMMENT_DIALOG } from '../configs';
import { store } from '../store';
import { changeBlockedUsersBox, CLASS_BLOCK_USER_BOX, CLASS_BTN_ADD_BLOCKED, CLASS_BTN_REMOVE_BLOCKED } from './blocked-users/add-block-button';
import { addBlockUser, removeBlockUser } from './blocked-users/blocked-users';
import { IBlockedUser } from './blocked-users/types';
import { formatPreviewSize } from './image';

/** 格式化评论区接口内的用户信息并储存 */
export const formatCommentAuthors = (data: any[]) => {
  const { setCommentAuthors, getCommentAuthors } = store;
  const commentAuthors: IBlockedUser[] = [...getCommentAuthors()];
  const fnAuthor = (data: any[]) => {
    if (!data) return;
    data.forEach((item) => {
      const author = item.author;
      const replyToAuthor = item.reply_to_author;
      if (author && !commentAuthors.some((i) => i.id === author.id)) {
        commentAuthors.push({
          id: author.id,
          name: author.name,
          urlToken: author.url_token,
        });
      }

      if (replyToAuthor && !commentAuthors.some((i) => i.id === replyToAuthor.id)) {
        commentAuthors.push({
          id: replyToAuthor.id,
          name: replyToAuthor.name,
          urlToken: replyToAuthor.url_token,
        });
      }

      if (item.child_comments) {
        fnAuthor(item.child_comments);
      }
    });
  };
  fnAuthor(data);
  setCommentAuthors(commentAuthors);

  // 处理完接口数据后扫描评论区
  doListenComment();
};

/** 点击评论弹窗背景事件 */
const commentMarkListen = (event: MouseEvent) => {
  closeCommentDialog();
};

/** 监听评论区 */
export const doListenComment = async () => {
  const { cancelCommentAutoFocus, clickMarkCloseCommentDialog } = await myStorage.getConfig();
  if (cancelCommentAutoFocus) {
    domA('.notranslate').forEach((item) => {
      // 取消评论输入框的自动聚焦
      item.blur();

      // 自动聚焦元素到详情内容，便于快速关闭评论
      // .QuestionAnswer-content 从列表点进来时的回答内容
      // .List-item 回答列表内容，搜索列表内容
      // .TopstoryItem 关注、推荐列表内容
      const parentBox = domP(item, 'class', 'QuestionAnswer-content') || domP(item, 'class', 'List-item') || domP(item, 'class', 'TopstoryItem');
      parentBox && parentBox.focus();
    });
  }

  const { setCommentAuthors } = store;
  /** 页面中的评论容器 */
  const nodeCommentInPages = domA(`.css-18ld3w0`);
  /** 弹窗中的评论容器 */
  const nodeCommentDialogs = domA(`.css-16zdamy`);
  if (!nodeCommentInPages.length && !nodeCommentDialogs.length) {
    // 不存在评论内容则清除评论用户信息
    setCommentAuthors([]);
    return;
  }

  nodeCommentInPages.forEach((item) => formatComments(item));
  nodeCommentInPages.forEach((item) => formatComments(item, '.css-13445jb'));
  nodeCommentDialogs.forEach((item) => formatComments(item));
  nodeCommentDialogs.forEach((item) => formatComments(item, '.css-13445jb'));

  if (clickMarkCloseCommentDialog) {
    /** 评论弹窗背景 */
    const nodeCommentMark = dom('.css-5ym188');
    if (nodeCommentMark) {
      nodeCommentMark.removeEventListener('click', commentMarkListen);
      nodeCommentMark.addEventListener('click', commentMarkListen);
    }
  }
};

const ATTR_ID = 'data-id';

const buttonListener = () => setTimeout(doListenComment, 500);

/** 处理评论 */
const formatComments = async (nodeComments?: HTMLElement, commentBoxClass = '.css-jp43l4') => {
  if (!nodeComments) return;
  // 评论加载中
  if (nodeComments.querySelector('.css-1t6pvna') || nodeComments.querySelector('.BounceLoading')) {
    setTimeout(() => {
      formatComments(nodeComments, commentBoxClass);
    }, 500);
    return;
  }
  const commentAuthors = store.getCommentAuthors();
  const { removeBlockUserComment, blockedUsers, showBlockUserComment, showBlockUserCommentTag } = await myStorage.getConfig();
  const comments = nodeComments.children;
  for (let i = 0, len = comments.length; i < len; i++) {
    const item = comments[i] as HTMLElement;

    // 按钮的处理
    if (item.nodeName === 'BUTTON') {
      item.removeEventListener('click', buttonListener);
      item.addEventListener('click', buttonListener);
      continue;
    }

    if (!item.getAttribute(ATTR_ID) || item.classList.contains(CTZ_HIDDEN_ITEM_CLASS)) continue;

    const itemUserBox = item.querySelector(`${commentBoxClass} .css-14nvvry .css-swj9d4`) as HTMLElement;
    if (!itemUserBox) continue;
    /** 获取当前评论的用户信息，可能有两条的情况（回复评论） */
    const itemCommentUsers = itemUserBox.querySelectorAll('.css-1tww9qq');
    /** 当前 item 是否隐藏 */
    let isHidden = false;

    itemCommentUsers.forEach(async (userOne) => {
      if (isHidden) return;
      const userLink = userOne.querySelector('.css-1gomreu a') as HTMLAnchorElement;
      if (!userLink) return;
      const userId = userLink.href.replace(/[\w\W]+\/people\//, '');
      /** 匹配在黑名单的位置 */
      const findUser = (blockedUsers || []).find((i) => i.id === userId);
      /** 是否在黑名单中 */
      const isBlocked = !!findUser;

      // 屏蔽黑名单用户发布的评论
      if (removeBlockUserComment && isBlocked) {
        isHidden = true;
        fnLog('已隐藏一个黑名单用户的评论，' + `${findUser.name}`);
        return;
      }
      // 已经添加过盒子的内容不再处理
      if (userOne.querySelector(`.${CLASS_BLOCK_USER_BOX}`)) return;

      /** 查找到的用户信息 */
      const commentUserInfo = commentAuthors.find((i) => i.id === userId);
      if (!commentUserInfo) return;

      const nBox = domC('div', {
        className: CLASS_BLOCK_USER_BOX,
        innerHTML: changeBlockedUsersBox(isBlocked, showBlockUserComment, showBlockUserCommentTag),
      });
      nBox.onclick = async function (event) {
        const me = this as HTMLElement;
        const target = event.target as HTMLButtonElement;
        // 解除屏蔽
        if (target.classList.contains(CLASS_BTN_REMOVE_BLOCKED)) {
          await removeBlockUser(commentUserInfo);
          me.innerHTML = changeBlockedUsersBox(false, showBlockUserComment, showBlockUserCommentTag);
          return;
        }
        // 添加屏蔽
        if (target.classList.contains(CLASS_BTN_ADD_BLOCKED)) {
          await addBlockUser(commentUserInfo);
          me.innerHTML = changeBlockedUsersBox(true, showBlockUserComment, showBlockUserCommentTag);
          return;
        }
      };
      userOne.append(nBox);
    });

    if (isHidden) {
      item.style.display = 'none';
      item.classList.add(CTZ_HIDDEN_ITEM_CLASS);
      continue;
    }

    item.querySelectorAll('.comment_img img').forEach((itemImage) => {
      (itemImage as HTMLImageElement).onclick = () => {
        setTimeout(commentImagePreview, 100);
      };
    });

    formatComments(item, '.css-1kwt8l8');
  }
};

let commentPreviewObserver: MutationObserver | undefined = undefined;
/** 评论图片预览尺寸调整 */
const commentImagePreview = async () => {
  const { commentImageFullPage } = await myStorage.getConfig();
  if (commentImageFullPage) {
    const commentPreviewImage = dom('.ImageView-img') as HTMLImageElement;
    if (!commentPreviewImage) return;
    // 预览图地址会多一个 _r
    const imageSrc = commentPreviewImage.src.replace('_r', '');
    const commentImage = dom(`.comment_img img[data-original="${imageSrc}"]`) as HTMLImageElement;
    if (!commentImage) return;
    const { width, height, scaleX, scaleY } = formatPreviewSize(commentImage);
    const { innerWidth, innerHeight } = window;

    commentPreviewImage.style.cssText =
      `width: ${width}px;` +
      `height: ${height}px;` +
      `transform: translateX(${innerWidth / 2 - (width * scaleX) / 2}px) translateY(${
        innerHeight / 2 - (height * scaleY) / 2
      }px) scaleX(${scaleX}) scaleY(${scaleY}) translateZ(0px);will-change:unset;` +
      `transform-origin: 0 0;` +
      `transition: none;`;

    const nodeImageBox = domP(commentPreviewImage, 'class', 'ImageView')!;
    commentPreviewObserver && commentPreviewObserver.disconnect();
    commentPreviewObserver = new MutationObserver((records) => {
      if (!nodeImageBox.classList.contains('is-active')) {
        commentPreviewImage.style.transition = '';
      }
    });
    commentPreviewObserver.observe(nodeImageBox, { characterData: true, attributes: true });
  }
};

/** 关闭知乎评论弹窗 */
export const closeCommentDialog = () => {
  const button = dom(`.${CLASS_ZHIHU_COMMENT_DIALOG} button[aria-label="关闭"]`);
  button && button.click();
};
