import { myStorage } from '../commons/storage';
import { dom, domById, domC } from '../commons/tools';
import { ID_FILTER_WORDS } from '../configs';
import { store } from '../store';

/** 屏蔽词方法 */
export const myBlockWords = {
  /** 添加屏蔽词 */
  add: async function (target: HTMLInputElement) {
    const word = target.value;
    const { filterKeywords = [] } = store.getConfig();
    filterKeywords.push(word);
    await myStorage.configUpdateItem('filterKeywords', filterKeywords);
    const item = domC('span', { innerHTML: this.evenText(word) });
    item.dataset.title = word;
    const nodeFilterWords = domById(ID_FILTER_WORDS);
    nodeFilterWords && nodeFilterWords.appendChild(item);
    target.value = '';
  },
  /** 删除屏蔽词 */
  remove: (event: HTMLElement) => {
    const title = event.dataset.title;
    const { filterKeywords = [] } = store.getConfig();
    event.remove();
    myStorage.configUpdateItem(
      'filterKeywords',
      filterKeywords.filter((i) => i !== title)
    );
  },
  /** 初始化 */
  init: function () {
    const { filterKeywords = [] } = store.getConfig();
    const children = (filterKeywords || []).map((i) => this.evenTextBlock(i)).join('');
    const nodeFilterWords = domById(ID_FILTER_WORDS);
    if (nodeFilterWords) {
      nodeFilterWords.innerHTML = children || '';
      nodeFilterWords.onclick = (e) => {
        const target = e.target as HTMLElement;
        target.classList.contains('ctz-filter-word-remove') && this.remove(target.parentElement!);
      };
    }
    const nodeInput = dom('[name="inputFilterWord"]');
    nodeInput && (nodeInput.onchange = (e) => this.add.call(this, e.target as HTMLInputElement));
  },
  evenText: (w: string) => `<span>${w}</span><i class="ctz-icon ctz-filter-word-remove">&#xe602;</i>`,
  evenTextBlock: function (w: string) {
    return `<span data-title="${w}">${this.evenText(w)}</span>`;
  },
};
