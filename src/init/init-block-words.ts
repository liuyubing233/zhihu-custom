import { myStorage } from '../commons/storage';
import { dom, domById, domC } from '../commons/tools';
import { ID_FILTER_WORDS } from '../configs';
import { store } from '../store';

const createHTMLAboutBlockText = (w: string) => `<span data-title="${w}">${createHTMLAboutBlockTextContent(w)}</span>`;
const createHTMLAboutBlockTextContent = (w: string) => `<span>${w}</span><i class="ctz-icon ctz-filter-word-remove">&#xe602;</i>`;

const onRemove = (event: HTMLElement) => {
  const title = event.dataset.title;
  const { filterKeywords = [] } = store.getConfig();
  event.remove();
  myStorage.configUpdateItem(
    'filterKeywords',
    filterKeywords.filter((i) => i !== title)
  );
};

const onAddWord = async (target: HTMLInputElement) => {
  const word = target.value;
  const { filterKeywords = [] } = store.getConfig();
  filterKeywords.push(word);
  await myStorage.configUpdateItem('filterKeywords', filterKeywords);
  const item = domC('span', { innerHTML: createHTMLAboutBlockTextContent(word) });
  item.dataset.title = word;
  const nodeFilterWords = domById(ID_FILTER_WORDS);
  nodeFilterWords && nodeFilterWords.appendChild(item);
  target.value = '';
};

/** 加载屏蔽词方法 */
export const initBlockWords = () => {
  const { filterKeywords = [] } = store.getConfig();
  const children = (filterKeywords || []).map((i) => createHTMLAboutBlockText(i)).join('');
  const nodeFilterWords = domById(ID_FILTER_WORDS);
  if (nodeFilterWords) {
    nodeFilterWords.innerHTML = children || '';
    nodeFilterWords.onclick = (e) => {
      const target = e.target as HTMLElement;
      target.classList.contains('ctz-filter-word-remove') && onRemove(target.parentElement!);
    };
  }
  const nodeInput = dom('[name="inputFilterWord"]');
  nodeInput && (nodeInput.onchange = (e) => onAddWord(e.target as HTMLInputElement));
};
