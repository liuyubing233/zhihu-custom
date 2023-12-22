import { domC } from '../commons/tools';
import { store } from '../store';

/** 内容顶部显示赞同数 nodeItem className: ContentItem-meta */
export const updateTopVote = (nodeItem?: HTMLElement) => {
  if (!nodeItem) return;
  const nodeContentItemMeta = nodeItem.querySelector('.ContentItem-meta');
  const nodeMetaVote = nodeItem.querySelector('[itemprop="upvoteCount"]') as HTMLMetaElement;
  const { topVote } = store.getConfig();
  if (!nodeMetaVote || !topVote || !nodeContentItemMeta) return;
  const vote = nodeMetaVote.content;
  if (+vote === 0) return;
  const className = 'ctz-top-vote';
  const domVotePrev = nodeContentItemMeta.querySelector(`.${className}`);
  const innerHTML = `${vote} 人赞同了该回答`;
  if (domVotePrev) {
    domVotePrev.innerHTML = innerHTML;
  } else {
    const domVote = domC('div', {
      className,
      innerHTML,
      style: 'font-size: 14px;padding-top: 2px;color: rgb(132, 145, 165);margin: 8px 0;',
    });
    nodeContentItemMeta.appendChild(domVote);
    const metaObserver = new MutationObserver(() => {
      updateTopVote(nodeItem);
    });
    metaObserver.observe(nodeMetaVote, {
      attributes: true,
      childList: false,
      characterData: false,
      characterDataOldValue: false,
      subtree: false,
    });
  }
};
