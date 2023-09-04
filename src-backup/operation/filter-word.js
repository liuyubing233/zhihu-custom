import { myStorage } from './storage';
import { pfConfig } from '../variable/configs';
import { domC, domById, dom } from './tools';

/** 屏蔽词方法 */
export const myFilterWord = {
  add: async function (target) {
    // 添加屏蔽词
    const word = target.value;
    const { filterKeywords } = pfConfig;
    filterKeywords.push(word);
    pfConfig = { ...pfConfig, filterKeywords };
    await myStorage.set('pfConfig', JSON.stringify(pfConfig));
    const item = domC('span', { innerHTML: this.evenText(word) });
    item.dataset.title = word;
    domById(ID_FILTER_WORDS).appendChild(item);
    target.value = '';
  },
  remove: (event) => {
    // 删除屏蔽词
    const title = event.dataset.title;
    const { filterKeywords } = pfConfig;
    pfConfig = {
      ...pfConfig,
      filterKeywords: filterKeywords.filter((i) => i !== title),
    };
    event.remove();
    myStorage.set('pfConfig', JSON.stringify(pfConfig));
  },
  init: function () {
    // 初始化
    const children = (pfConfig.filterKeywords || []).map((i) => this.evenTextBlock(i)).join('');
    domById(ID_FILTER_WORDS).innerHTML = children || '';
    domById(ID_FILTER_WORDS).onclick = (e) => {
      e.target.classList.contains('ctz-filter-word-remove') && this.remove(e.target.parentElement);
    };
    dom('[name="inputFilterWord"]').onchange = (e) => this.add.call(this, e.target);
  },
  evenText: (w) => `<span>${w}</span><i class="ctz-icon ctz-filter-word-remove">&#xe602;</i>`,
  evenTextBlock: function (w) {
    return `<span data-title="${w}">${this.evenText(w)}</span>`;
  },
};
