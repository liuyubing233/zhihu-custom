import { domC, myStorage } from "../../tools";

/** 内容顶部显示赞同数 nodeItem className: ContentItem-meta */
export const updateTopVote = async (contentItem: HTMLElement) => {
  const nodeItemMeta = contentItem.querySelector('.ContentItem-meta');
  const nodeVote = contentItem.querySelector('[itemprop="upvoteCount"]') as HTMLMetaElement;
  const { topVote } = await myStorage.getConfig()
  if (!nodeVote || !topVote || !nodeItemMeta) return;
  const vote = nodeVote.content;
  if (+vote === 0) return;
  const className = 'ctz-top-vote';
  const domVotePrev = nodeItemMeta.querySelector(`.${className}`);
  const innerHTML = `${vote} 人赞同`;
  if (domVotePrev) {
    domVotePrev.innerHTML = innerHTML;
  } else {
    const domVote = domC('div', {
      className,
      innerHTML,
      style: 'font-size: 13px;padding-top: 2px;color: rgb(132, 145, 165);',
    });
    nodeItemMeta.appendChild(domVote);
    const metaObserver = new MutationObserver(() => {
      updateTopVote(contentItem);
    });
    metaObserver.observe(nodeVote, {
      attributes: true,
      childList: false,
      characterData: false,
      characterDataOldValue: false,
      subtree: false,
    });
  }
};
