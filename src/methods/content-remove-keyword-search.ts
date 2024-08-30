
/** 去除热词点击搜索 */
export const fnContentRemoveKeywordSearch = (domFind: HTMLElement) => {
  const domKeywords = domFind.querySelectorAll('.RichContent-EntityWord');
  for (let i = 0, len = domKeywords.length; i < len; i++) {
    const domItem = domKeywords[i] as HTMLAnchorElement;
    if (domItem.href === 'javascript:;') {
      continue;
    }
    domItem.href = 'javascript:;'
    domItem.style.cssText += `color: inherit!important; cursor: default!important;`
    const domSvg = domItem.querySelector('svg');
    if (domSvg) {
      domSvg.style.display = 'none';
    }
  }
};
