import { myListenAnswerItem } from './listen-answer';
import { dom, domA, domC } from './tools';

/** 回答排序 */
export const myListenSelect: IMyListenSelect = {
  isSortFirst: true,
  observer: undefined,
  keySort: 'default',
  /** 添加回答排序 */
  answerSortIds: {
    'Select1-0': { key: 'default', name: '默认排序' },
    'Select1-1': { key: 'update', name: '按时间排序' },
    'Select1-2': { key: 'vote', name: '点赞数排序' },
    'Select1-3': { key: 'comment', name: '评论数排序' },
  },
  sortKeys: { vote: '点赞数排序', comment: '评论数排序' },
  /** 加载监听问题详情里的.Select-button按钮 */
  init: function () {
    const classSelectButton = '.Select-button';
    const { href } = location;
    if (this.keySort === 'vote' || this.keySort === 'comment') {
      const elementBtn = dom(classSelectButton);
      elementBtn && (elementBtn.innerHTML = elementBtn.innerHTML.replace(/[\u4e00-\u9fa5]+(?=<svg)/, this.sortKeys[this.keySort]));
    }
    const clickSort = (id: IAnswerKey) => {
      myListenAnswerItem.reset();
      const { key, name } = this.answerSortIds[id];
      this.keySort = key;
      const elementBtn = dom(classSelectButton);
      elementBtn && (elementBtn.innerHTML = elementBtn.innerHTML.replace(/[\u4e00-\u9fa5]+(?=<svg)/, name));
      if (key === 'vote' || key === 'comment') {
        location.href = href.replace(/(?<=question\/\d+)[?\/][\w\W]*/, '') + '?sort=' + key;
      } else if (key === 'default') {
        /\?sort=/.test(href) && (location.href = href.replace(/(?<=question\/\d+)[?\/][\w\W]*/, ''));
      }
    };

    const btn = dom(classSelectButton);
    if (btn) {
      try {
        this.observer?.disconnect();
      } catch {}
      const buConfig = { attribute: true, attributeFilter: ['aria-expanded'] };
      this.observer = new MutationObserver(() => {
        const elementSelect = dom('.Answers-select');
        if (btn.getAttribute('aria-expanded') === 'true' && elementSelect) {
          elementSelect.appendChild(domC('button', { className: 'Select-option', tabindex: '-1', role: 'option', id: 'Select1-2', innerHTML: '点赞数排序' }));
          elementSelect.appendChild(domC('button', { className: 'Select-option', tabindex: '-1', role: 'option', id: 'Select1-3', innerHTML: '评论数排序' }));
          domA('.Select-option').forEach((ev) => {
            ev.onclick = () => clickSort(ev.id as IAnswerKey);
          });
        }
      });
      this.observer.observe(btn, buConfig);
    }
  },
  addSort: function () {
    // 排序列表
    // 因为知乎并没有开放点赞数和评论排序参数，所以只能每次加载后按照当前的数据进行页面排序
    // 为了防止页面错乱，只对前20条进行排序
    const keySort = this.keySort;
    if ((keySort === 'vote' || keySort === 'comment') && this.isSortFirst) {
      const element = dom('.List>div:nth-child(2)>div');
      if (!element) return;

      const arrElement = Array.from(element.querySelectorAll('.List-item:not(.PlaceHolder)')).sort((a, b) => {
        const answerItemA = a.querySelector('.AnswerItem');
        const extraA = answerItemA ? answerItemA.getAttribute('data-za-extra-module') || '{}' : '{}';
        const contentA = JSON.parse(extraA).card.content;

        const answerItemB = b.querySelector('.AnswerItem');
        const extraB = answerItemB ? answerItemB.getAttribute('data-za-extra-module') || '{}' : '{}';
        const contentB = JSON.parse(extraB).card.content;

        switch (keySort) {
          case 'vote':
            return contentA.upvote_num - contentB.upvote_num;
          case 'comment':
            return contentA.comment_num - contentB.comment_num;
          default:
            return 1;
        }
      });

      const listItem = element.querySelector('.List-item:not(.PlaceHolder)');
      listItem && listItem.remove();
      const eleFirst = element.querySelector(':first-child');
      arrElement.forEach((item, index) => {
        element.insertBefore(item, index === 0 ? eleFirst : arrElement[index - 1]);
      });
      this.isSortFirst = false;
    }
  },
};

type IAnswerKey = 'Select1-0' | 'Select1-1' | 'Select1-2' | 'Select1-3';
type IAnswerSortIds = Record<IAnswerKey, IAnswerSortIdsEntries>;

interface IAnswerSortIdsEntries {
  key: string;
  name: string;
}

interface ISortKeys {
  vote: string;
  comment: string;
}

interface IMyListenSelect {
  isSortFirst: boolean;
  observer?: MutationObserver;
  keySort: string;
  answerSortIds: IAnswerSortIds;
  sortKeys: ISortKeys;
  init: () => void;
  addSort: () => void;
}
