import { copy, domA, domC, message } from '../commons/tools';
import { store } from '../store';
import { IMyElement } from '../types';

/** 知乎外链直接打开(修改外链内容，去除知乎重定向) */
export const initLinkChanger = () => {
  const esName = ['a.external', 'a.LinkCard'];
  const operaLink = 'is-link-changed';
  const hrefChanger = (item: IMyElement) => {
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
      hrefChanger(links[index]);
    }
  }
};

const CLASS_COPY_LINK = 'ctz-copy-answer-link';
/** 回答内容意见分享 */
export const addAnswerCopyLink = (nodeItem: HTMLElement) => {
  const { copyAnswerLink } = store.getConfig();
  if (!copyAnswerLink) return;
  const prevButton = nodeItem.querySelector(`.${CLASS_COPY_LINK}`);
  prevButton && prevButton.remove();
  const nodeUser = nodeItem.querySelector('.AnswerItem-authorInfo>.AuthorInfo');
  if (!nodeUser) return;
  const nDomButton = domC('button', {
    innerHTML: '一键获取回答链接',
    className: `ctz-button ctz-button-small ${CLASS_COPY_LINK}`,
    style: 'margin: 0 8px;',
  });
  nDomButton.onclick = function () {
    const metaUrl = nodeItem.querySelector('.ContentItem>[itemprop="url"]');
    if (!metaUrl) return;
    const link = metaUrl.getAttribute('content') || '';
    if (link) {
      copy(link);
      message('链接复制成功！')
      return;
    }
  };
  nodeUser.appendChild(nDomButton);
};
