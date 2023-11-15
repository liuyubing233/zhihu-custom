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
const createHTMLAboutBlockTextContent = (w: string) => `<span>${w}</span><i class="ctz-icon ctz-filter-word-remove">&#xe602;</i>`;

const onRemove = (e: MouseEvent, key: IKeyofDomName) => {
  const target = e.target as HTMLElement;
  if (!target.classList.contains('ctz-filter-word-remove')) return;
  const domItem = target.parentElement!;
  const title = domItem.dataset.title;
  const config = store.getConfig();
  domItem.remove();
  myStorage.configUpdateItem(
    key,
    (config[key] || []).filter((i: string) => i !== title)
  );
};

const onAddWord = async (target: HTMLInputElement, key: IKeyofDomName) => {
  const word = target.value;
  const configThis = store.getConfig()[key];
  if (!Array.isArray(configThis)) return;
  configThis.push(word);
  await myStorage.configUpdateItem(key, configThis);
  const domItem = domC('span', { innerHTML: createHTMLAboutBlockTextContent(word) });
  domItem.dataset.title = word;
  const name = NAME_BY_KEY[key];
  const nodeFilterWords = dom(name);
  nodeFilterWords && nodeFilterWords.appendChild(domItem);
  target.value = '';
};

/** 加载屏蔽词 */
export const initBlockWords = () => {
  const { filterKeywords = [], blockWordsAnswer } = store.getConfig();
  const children = (filterKeywords || []).map((i) => createHTMLAboutBlockText(i)).join('');
  const childrenAnswer = (blockWordsAnswer || []).map((i) => createHTMLAboutBlockText(i)).join('');
  const domBlockWordsList = dom(BLOCK_WORDS_LIST);
  const domBlockWordsAnswer = dom(BLOCK_WORDS_ANSWER);
  if (domBlockWordsList) {
    domBlockWordsList.innerHTML = children || '';
    domBlockWordsList.onclick = (e) => onRemove(e, 'filterKeywords');
  }
  if (domBlockWordsAnswer) {
    domBlockWordsAnswer.innerHTML = childrenAnswer || '';
    domBlockWordsAnswer.onclick = (e) => onRemove(e, 'blockWordsAnswer');
  }
  const domInputList = dom('[name="inputFilterWord"]');
  const domInputAnswer = dom('[name="inputBlockWordsAnswer"]');
  domInputList && (domInputList.onchange = (e) => onAddWord(e.target as HTMLInputElement, 'filterKeywords'));
  domInputAnswer && (domInputAnswer.onchange = (e) => onAddWord(e.target as HTMLInputElement, 'blockWordsAnswer'));
};
