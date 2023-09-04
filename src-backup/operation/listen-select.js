/** 回答排序 */
export const myListenSelect = {
  isSortFirst: true,
  observer: null,
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
    if (this.keySort === 'vote' || this.keySort === 'comment') {
      dom(classSelectButton).innerHTML = dom(classSelectButton).innerHTML.replace(/[\u4e00-\u9fa5]+(?=<svg)/, this.sortKeys[this.keySort]);
    }
    const clickSort = (id) => {
      myListenAnswerItem.reset();
      const { key, name } = this.answerSortIds[id];
      this.keySort = key;
      dom(classSelectButton).innerHTML = dom(classSelectButton).innerHTML.replace(/[\u4e00-\u9fa5]+(?=<svg)/, name);
      if (key === 'vote' || key === 'comment') {
        location.href = href.replace(/(?<=question\/\d+)[?\/][\w\W]*/, '') + '?sort=' + key;
      } else if (key === 'default') {
        /\?sort=/.test(href) && (location.href = href.replace(/(?<=question\/\d+)[?\/][\w\W]*/, ''));
      }
    };

    if (dom(classSelectButton)) {
      try {
        this.observer.disconnect();
      } catch {}
      const buConfig = { attribute: true, attributeFilter: ['aria-expanded'] };
      this.observer = new MutationObserver(() => {
        const elementSelect = dom('.Answers-select');
        if (dom(classSelectButton).getAttribute('aria-expanded') === 'true' && elementSelect) {
          elementSelect.appendChild(domC('button', { className: 'Select-option', tabindex: '-1', role: 'option', id: 'Select1-2', innerHTML: '点赞数排序' }));
          elementSelect.appendChild(domC('button', { className: 'Select-option', tabindex: '-1', role: 'option', id: 'Select1-3', innerHTML: '评论数排序' }));
          domA('.Select-option').forEach((ev) => {
            ev.onclick = () => clickSort(ev.id);
          });
        }
      });
      this.observer.observe(dom(classSelectButton), buConfig);
    }
  },
  addSort: function () {
    // 排序列表
    // 因为知乎并没有开放点赞数和评论排序参数，所以只能每次加载后按照当前的数据进行页面排序
    // 为了防止页面错乱，只对前20条进行排序
    const keySort = this.keySort;
    if ((keySort === 'vote' || keySort === 'comment') && this.isSortFirst) {
      const element = dom('.List>div:nth-child(2)>div');
      const arrElement = Array.from(element.querySelectorAll('.List-item:not(.PlaceHolder)')).sort((a, b) => {
        const aContent = a.querySelector('.AnswerItem').getAttribute('data-za-extra-module')
          ? JSON.parse(a.querySelector('.AnswerItem').getAttribute('data-za-extra-module')).card.content
          : {};
        const bContent = b.querySelector('.AnswerItem').getAttribute('data-za-extra-module')
          ? JSON.parse(b.querySelector('.AnswerItem').getAttribute('data-za-extra-module')).card.content
          : {};
        switch (keySort) {
          case 'vote':
            return aContent.upvote_num - bContent.upvote_num;
          case 'comment':
            return aContent.comment_num - bContent.comment_num;
          default:
            return true;
        }
      });
      element.querySelector('.List-item:not(.PlaceHolder)') && element.querySelector('.List-item:not(.PlaceHolder)').remove();
      const eleFirst = element.querySelector(':first-child');
      arrElement.forEach((item, index) => {
        element.insertBefore(item, index === 0 ? eleFirst : arrElement[index - 1]);
      });
      this.isSortFirst = false;
    }
  },
};
