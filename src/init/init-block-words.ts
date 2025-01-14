import { myStorage } from '../commons/storage';
import { dom, domC, message } from '../commons/tools';

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

const onRemove = async (e: MouseEvent, key: IKeyofDomName) => {
  const domItem = e.target as HTMLElement;
  if (!domItem.classList.contains('ctz-filter-word-remove')) return;
  const title = domItem.innerText;
  const config = await myStorage.getConfig();
  domItem.remove();
  myStorage.updateConfigItem(
    key,
    (config[key] || []).filter((i: string) => i !== title)
  );
};

const onAddWord = async (target: HTMLInputElement, key: IKeyofDomName) => {
  const word = target.value;
  const configChoose = (await myStorage.getConfig())[key];
  if (!Array.isArray(configChoose)) return;
  if (configChoose.includes(word)) {
    message('屏蔽词已存在');
    return;
  }
  configChoose.push(word);
  await myStorage.updateConfigItem(key, configChoose);
  const domItem = domC('span', { innerText: word });
  domItem.classList.add('ctz-filter-word-remove');
  const nodeFilterWords = dom(NAME_BY_KEY[key]);
  nodeFilterWords && nodeFilterWords.appendChild(domItem);
  target.value = '';
};

/** 加载屏蔽词 */
export const initBlockWords = async () => {
  const config = await myStorage.getConfig();
  const arr = [
    { domFind: dom(BLOCK_WORDS_LIST), name: 'filterKeywords', domInput: dom('[name="inputFilterWord"]') },
    { domFind: dom(BLOCK_WORDS_ANSWER), name: 'blockWordsAnswer', domInput: dom('[name="inputBlockWordsAnswer"]') },
  ];
  for (let i = 0, len = arr.length; i < len; i++) {
    const { domFind, name, domInput } = arr[i];
    if (domFind) {
      const children = (config[name] || []).map((i: string) => `<span class="ctz-filter-word-remove">${i}</span>`).join('');
      domFind.innerHTML = children || '';
      domFind.onclick = (e) => onRemove(e, name as IKeyofDomName);
    }
    domInput && (domInput.onchange = (e) => onAddWord(e.target as HTMLInputElement, name as IKeyofDomName));
  }
};
