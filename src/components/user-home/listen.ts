import { EHomeContentOpen } from '../../init/init-html/configs';
import { doContentItem } from '../../init/init-top-event-listener';
import { CLASS_LISTENED } from '../../misc';
import { domA, myStorage } from '../../tools';

export const myListenUserHomeList = {
  timestamp: 0,
  init: async function () {
    const nTimestamp = +new Date();
    if (nTimestamp - this.timestamp < 500) {
      setTimeout(() => this.init(), 500);
      return;
    }

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

      doContentItem('USER_HOME', contentItem);
    }
  },
  reset: function () {
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
