import { EReplaceZhidaToSearch } from '../init/init-html/configs';
import { CLASS_LISTENED } from '../misc';
import { myStorage } from '../tools';

/** 替换知乎直达为搜索 */
export const fnReplaceZhidaToSearch = async (domFind: HTMLElement = document.body) => {
  const { replaceZhidaToSearch = EReplaceZhidaToSearch.不替换 } = await myStorage.getConfig();
  if (replaceZhidaToSearch === EReplaceZhidaToSearch.不替换) return;

  const domsZhida = domFind.querySelectorAll('.RichContent-EntityWord');

  for (let i = 0, len = domsZhida.length; i < len; i++) {
    const domItem = domsZhida[i] as HTMLAnchorElement;
    if (domItem.classList.contains(CLASS_LISTENED)) continue;
    domItem.classList.add(CLASS_LISTENED);

    const domSvg = domItem.querySelector('svg');
    if (domSvg) {
      domSvg.style.display = 'none';
    }
    // 去除知乎直达跳转
    if (replaceZhidaToSearch === EReplaceZhidaToSearch.去除知乎直达跳转) {
      domItem.onclick = function (e) {
        e.preventDefault();
      };
      domItem.style.cssText = `color: inherit!important; cursor: text!important;background: transparent!important;`;
      continue;
    }

    const prevTextContent = domItem.textContent || '';
    domItem.innerHTML = prevTextContent + '<span style="transform: rotate(-45deg);display: inline-block;">⚲</span>';
    domItem.href = SEARCH_PATH[replaceZhidaToSearch] + encodeURIComponent(prevTextContent);
  }
};

const SEARCH_PATH: Record<string, string> = {
  [EReplaceZhidaToSearch.知乎]: 'https://www.zhihu.com/search?type=content&q=',
  [EReplaceZhidaToSearch.百度]: 'https://www.baidu.com/s?wd=',
  [EReplaceZhidaToSearch.谷歌]: 'https://www.google.com.hk/search?q=',
  [EReplaceZhidaToSearch.必应]: 'https://www.bing.com/search?q=',
};
