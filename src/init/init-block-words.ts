import { myStorage } from '../commons/storage';
import { dom, domC } from '../commons/tools';
import { store } from '../store';

interface IFindDomName {
  /** 列表标题屏蔽词 */
  filterKeywords: string;
  /** 回答内容屏蔽词 */
  blockWordsAnswer: string;
}
type IKeyofDomName = keyof IFindDomName;

/** 屏蔽词 ID */
const BLOCK_WORDS_LIST = `#CTZ_BLOCK_WORD_LIST .ctz-block-words-content`;
const BLOCK_WORDS_ANSWER = `#CTZ_BLOCK_WORD_CONTENT .ctz-block-words-content`;

const NAME_BY_KEY: IFindDomName = {
  filterKeywords: BLOCK_WORDS_LIST,
  blockWordsAnswer: BLOCK_WORDS_ANSWER,
};

const createHTMLAboutBlockText = (w: string) => `<span data-title="${w}">${createHTMLAboutBlockTextContent(w)}</span>`;
const createHTMLAboutBlockTextContent = (w: string) => `<span>${w}</span><i class="ctz-filter-word-remove">✗</i>`;

const onRemove = (e: MouseEvent, key: IKeyofDomName) => {
  const target = e.target as HTMLElement;
  if (!target.classList.contains('ctz-filter-word-remove')) return;
  const domItem = target.parentElement!;
  const title = domItem.dataset.title;
  const config = store.getConfig();
  domItem.remove();
  myStorage.setConfigItem(
    key,
    (config[key] || []).filter((i: string) => i !== title)
  );
};

const onAddWord = async (target: HTMLInputElement, key: IKeyofDomName) => {
  const word = target.value;
  const configThis = store.getConfig()[key];
  if (!Array.isArray(configThis)) return;
  configThis.push(word);
  await myStorage.setConfigItem(key, configThis);
  const domItem = domC('span', { innerHTML: createHTMLAboutBlockTextContent(word) });
  domItem.dataset.title = word;
  const nodeFilterWords = dom(NAME_BY_KEY[key]);
  nodeFilterWords && nodeFilterWords.appendChild(domItem);
  target.value = '';
};

/** 加载屏蔽词 */
export const initBlockWords = () => {
  const config = store.getConfig();
  const arr = [
    { domFind: dom(BLOCK_WORDS_LIST), name: 'filterKeywords', domInput: dom('[name="inputFilterWord"]') },
    { domFind: dom(BLOCK_WORDS_ANSWER), name: 'blockWordsAnswer', domInput: dom('[name="inputBlockWordsAnswer"]') },
  ];
  for (let i = 0, len = arr.length; i < len; i++) {
    const { domFind, name, domInput } = arr[i];
    if (domFind) {
      const children = (config[name] || []).map((i: string) => createHTMLAboutBlockText(i)).join('');
      domFind.innerHTML = children || '';
      domFind.onclick = (e) => onRemove(e, name as IKeyofDomName);
    }
    domInput && (domInput.onchange = (e) => onAddWord(e.target as HTMLInputElement, name as IKeyofDomName));
  }
};
