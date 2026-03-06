import { CLASS_LISTENED } from '../misc';
import { myStorage } from '../tools';
import { EReplaceZhidaToSearch } from './select';

let timeout: NodeJS.Timeout | undefined;
const CLASS_ZHIDA_REPLACED = 'ctz-zhida-replaced';
const DATASET_MODE = 'ctzZhidaMode';
let hasInitZhidaClickListener = false;

const initZhidaClickListener = () => {
  if (hasInitZhidaClickListener) return;
  hasInitZhidaClickListener = true;

  window.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const domItem = target.closest(`a.RichContent-EntityWord.${CLASS_ZHIDA_REPLACED}`) as HTMLAnchorElement | null;
      if (!domItem) return;

      event.stopPropagation();
      event.stopImmediatePropagation();

      const mode = domItem.dataset[DATASET_MODE];
      if (mode === EReplaceZhidaToSearch.去除知乎直达跳转) {
        event.preventDefault();
        return;
      }

      const { href, target: linkTarget } = domItem;
      if (!href) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      const needOpenInNewTab = linkTarget === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey;
      if (needOpenInNewTab) {
        window.open(href, '_blank', 'noopener,noreferrer');
        return;
      }
      location.href = href;
    },
    true
  );
};

/** 替换知乎直达为搜索 */
export const fnReplaceZhidaToSearch = async (domFind: HTMLElement = document.body, index = 0) => {
  if (index === 5) return;
  const { replaceZhidaToSearch = EReplaceZhidaToSearch.不替换 } = await myStorage.getConfig();
  if (replaceZhidaToSearch === EReplaceZhidaToSearch.不替换) return;
  initZhidaClickListener();

  const domsZhida = domFind.querySelectorAll('.RichContent-EntityWord');
  if (!domsZhida.length) {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      fnReplaceZhidaToSearch(domFind, ++index);
    }, 500);
    return;
  }

  for (let i = 0, len = domsZhida.length; i < len; i++) {
    const domItem = domsZhida[i] as HTMLAnchorElement;
    if (domItem.classList.contains(CLASS_LISTENED)) continue;
    domItem.classList.add(CLASS_LISTENED);

    const domSvg = domItem.querySelector('svg');
    if (domSvg) {
      domSvg.style.display = 'none';
    }
    domItem.classList.add(CLASS_ZHIDA_REPLACED);
    domItem.dataset[DATASET_MODE] = replaceZhidaToSearch;
    // 去除知乎直达跳转
    if (replaceZhidaToSearch === EReplaceZhidaToSearch.去除知乎直达跳转) {
      domItem.removeAttribute('href');
      domItem.style.cssText = `color: inherit!important; cursor: text!important;background: transparent!important;`;
      continue;
    }

    const prevTextContent = domItem.textContent || '';
    domItem.innerHTML = prevTextContent + '<span style="transform: rotate(-45deg);display: inline-block;">⚲</span>';
    domItem.rel = 'noopener noreferrer';
    domItem.href = SEARCH_PATH[replaceZhidaToSearch] + encodeURIComponent(prevTextContent);
  }
};

const SEARCH_PATH: Record<string, string> = {
  [EReplaceZhidaToSearch.知乎]: 'https://www.zhihu.com/search?type=content&q=',
  [EReplaceZhidaToSearch.百度]: 'https://www.baidu.com/s?wd=',
  [EReplaceZhidaToSearch.谷歌]: 'https://www.google.com.hk/search?q=',
  [EReplaceZhidaToSearch.必应]: 'https://www.bing.com/search?q=',
};
