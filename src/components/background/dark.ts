import { myStorage } from '../../commons/storage';
import { dom } from '../../commons/tools';
import { ETheme } from './types';

/** 启用知乎默认的黑暗模式 */
export const onUseThemeDark = async () => {
  dom('html')!.setAttribute('data-theme', (await isDark()) ? 'dark' : 'light');
};

/**
 * 判断当前网站是否启用深色模式还是浅色模式
 * 用来启用知乎默认的黑暗模式
 */
export const checkThemeDarkOrLight = () => {
  // 开始进入先修改一次
  onUseThemeDark();
  const elementHTML = dom('html');
  const muConfig = { attribute: true, attributeFilter: ['data-theme'] };
  if (!elementHTML) return;
  // 监听 html 元素属性变化
  const muCallback = async function () {
    const themeName = elementHTML.getAttribute('data-theme');
    const dark = await isDark();
    if ((themeName === 'dark' && !dark) || (themeName === 'light' && dark)) {
      onUseThemeDark();
    }
  };
  const muObserver = new MutationObserver(muCallback);
  muObserver.observe(elementHTML, muConfig);
};

/** 是否使用深色模式 */
export const isDark = async () => {
  const { theme = ETheme.自动 } = await myStorage.getConfig();
  if (+theme === ETheme.自动) {
    // 获取浏览器颜色
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return +theme === ETheme.深色;
};
