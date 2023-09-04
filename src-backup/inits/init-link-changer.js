/** 知乎外链直接打开(修改外链内容，去除知乎重定向) */
export const initLinkChanger = () => {
  const esName = ['a.external', 'a.LinkCard'];
  const operaLink = 'is-link-changed';
  const hrefChanger = (item) => {
    const hrefFormat = item.href.replace(/^(https|http):\/\/link\.zhihu\.com\/\?target\=/, '') || '';
    let href = '';
    // 解决 hrefFormat 格式已经是 decode 后的格式
    try {
      href = decodeURIComponent(hrefFormat);
    } catch {
      href = hrefFormat;
    }
    item.href = href;
    item.classList.add(operaLink);
  };
  esName.forEach((name) => {
    domA(`${name}:not(.${operaLink})`).forEach(hrefChanger);
  });
};
