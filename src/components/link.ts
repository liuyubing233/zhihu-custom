import { createButtonFontSize12, domA, message, myStorage } from '../tools';
import { copy } from './copy';

/** 知乎外链直接打开(修改外链内容，去除知乎重定向) */
export const initLinkChanger = () => {
  const esName = ['a.external', 'a.LinkCard'];
  const operaLink = 'ctz-link-changed';
  const hrefChanger = (item: HTMLAnchorElement) => {
    const hrefFormat = item.href.replace(/^(https|http):\/\/link\.zhihu\.com\/\?target\=/, '') || '';
    let href = '';
    // 解决 hrefFormat 格式已经是 decode 后的格式
    try {
      href = decodeURIComponent(hrefFormat);
    } catch {
      href = hrefFormat;
    }
    item.href = href;
    item.classList.add(operaLink);
  };

  for (let i = 0, len = esName.length; i < len; i++) {
    const name = esName[i];
    const links = domA(`${name}:not(.${operaLink})`);
    for (let index = 0, linkLen = links.length; index < linkLen; index++) {
      hrefChanger(links[index] as HTMLAnchorElement);
    }
  }
};

const CLASS_COPY_LINK = 'ctz-copy-answer-link';
/** 回答内容意见分享 */
export const addAnswerCopyLink = async (contentItem: HTMLElement) => {
  const { copyAnswerLink } = await myStorage.getConfig();
  if (!copyAnswerLink) return;
  const prevButton = contentItem.querySelector(`.${CLASS_COPY_LINK}`);
  prevButton && prevButton.remove();
  const nodeUser = contentItem.querySelector('.AnswerItem-authorInfo>.AuthorInfo');
  if (!nodeUser) return;
  const nDomButton = createButtonFontSize12('获取回答链接', CLASS_COPY_LINK);
  nDomButton.onclick = function () {
    const metaUrl = contentItem.querySelector('[itemprop="url"]');
    if (!metaUrl) return;
    const link = metaUrl.getAttribute('content') || '';
    if (link) {
      copy(link);
      message('链接复制成功');
      return;
    }
  };
  nodeUser.appendChild(nDomButton);
};
