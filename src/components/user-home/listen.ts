import { doContentItem } from '../../init/init-top-event-listener';
import { CLASS_LISTENED } from '../../misc';
import { CTZ_HIDDEN_ITEM_CLASS, domA, domP, fnHidden, fnLog, myStorage } from '../../tools';
import { IZhihuCardContent, IZhihuDataZop } from '../../types/zhihu';
import { createBlockedUserTagHTML, getAllBlockedUsers, IBlockedUser } from '../black-list';
import { EHomeContentOpen } from '../select';

const CLASS_BLOCKED_CONTENT_REPLACEMENT = 'ctz-blocked-content-replacement';
const BLOCKED_CONTENT_REPLACEMENT_TEXT = `<span class="ctz-blocked-content-replacement-text">***</span>`;

const replaceBlockedUserHomeContent = (contentItem: HTMLElement, blockedUser: IBlockedUser, showBlockUserTagType?: boolean) => {
  const nodeRichContent = contentItem.querySelector('.RichContent') as HTMLElement | null;
  const nodeContent = ((nodeRichContent && nodeRichContent.querySelector('.RichContent-inner')) || nodeRichContent) as HTMLElement | null;
  if (!nodeContent || nodeContent.classList.contains(CLASS_BLOCKED_CONTENT_REPLACEMENT)) return;
  nodeContent.innerHTML = BLOCKED_CONTENT_REPLACEMENT_TEXT + createBlockedUserTagHTML(showBlockUserTagType, blockedUser);
  nodeContent.classList.add(CLASS_BLOCKED_CONTENT_REPLACEMENT);
  nodeRichContent && nodeRichContent.classList.remove('is-collapsed');
  contentItem.querySelectorAll('.ContentItem-expandButton,.RichContent-collapsedText').forEach((item) => ((item as HTMLElement).style.display = 'none'));
  fnLog(`已将用户主页中黑名单用户${blockedUser.name}的内容替换为 ***`);
};

const handleBlockedUserHomeContent = async (contentItem: HTMLElement) => {
  const config = await myStorage.getConfig();
  const { removeBlockUserContent, replaceBlockUserContentWithStar, showBlockUserTagType } = config;
  if (!removeBlockUserContent && !replaceBlockUserContentWithStar) return false;

  let dataZop: IZhihuDataZop = {};
  let cardContent: IZhihuCardContent = {};
  try {
    dataZop = JSON.parse(contentItem.getAttribute('data-zop') || '{}');
    cardContent = JSON.parse(contentItem.getAttribute('data-za-extra-module') || '{}').card.content;
  } catch {}

  const blockedUserMap = new Map(getAllBlockedUsers(config).map((item) => [item.id, item]));
  const blockedUser = blockedUserMap.get(String(cardContent.author_member_hash_id || ''));
  if (!blockedUser) return false;

  if (replaceBlockUserContentWithStar) {
    replaceBlockedUserHomeContent(contentItem, blockedUser, showBlockUserTagType);
    return false;
  }

  if (removeBlockUserContent) {
    const nodeItem = domP(contentItem, 'class', 'List-item') || contentItem;
    if (nodeItem.classList.contains(CTZ_HIDDEN_ITEM_CLASS)) return true;
    fnHidden(nodeItem, `已删除用户主页中黑名单用户${blockedUser.name}发布的内容：${dataZop.title || ''}`);
    return true;
  }

  return false;
};

export const myListenUserHomeList = {
  timestamp: 0,
  retryTimer: undefined as ReturnType<typeof setTimeout> | undefined,
  init: async function () {
    const nTimestamp = +new Date();
    if (nTimestamp - this.timestamp < 500) {
      if (!this.retryTimer) {
        this.retryTimer = setTimeout(() => {
          this.retryTimer = undefined;
          this.init();
        }, 500);
      }
      return;
    }
    this.timestamp = nTimestamp;

    const { homeContentOpen } = await myStorage.getConfig();
    const nodes = domA(`.Profile-main .ListShortcut .List-item .ContentItem:not(.${CLASS_LISTENED})`);
    for (let i = 0, len = nodes.length; i < len; i++) {
      const contentItem = nodes[i];
      contentItem.classList.add(CLASS_LISTENED);
      const isAnswer = contentItem.classList.contains('AnswerItem');
      const isVideo = contentItem.classList.contains('ZVideoItem');
      const isArticle = contentItem.classList.contains('ArticleItem');
      const isPin = contentItem.classList.contains('PinItem');
      if (!isAnswer && !isVideo && !isArticle && !isPin) continue;

      if (homeContentOpen === EHomeContentOpen.自动展开内容) {
        const openBTN = contentItem.querySelector('button.ContentItem-more') as HTMLButtonElement;
        openBTN && openBTN.click();
      }

      if (await handleBlockedUserHomeContent(contentItem)) continue;

      doContentItem('USER_HOME', contentItem);
    }
  },
  reset: function () {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = undefined;
    }
    domA(`.Profile-main .ListShortcut .List-item .ContentItem.${CLASS_LISTENED}`).forEach((item) => {
      item.classList.remove(CLASS_LISTENED);
    });
  },
  restart: function () {
    this.reset();
    this.init();
  },
};

// AnswerItem 回答
// ZVideoItem 视频
// ArticleItem 文章
// PinItem 想法
