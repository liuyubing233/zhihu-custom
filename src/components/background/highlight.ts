import { isDark } from "./dark";
import { EThemeDark, EThemeLight, THEME_CONFIG_DARK, THEME_CONFIG_LIGHT } from "./types";

/** 原创内容颜色高亮设置 */
export const doHighlightOriginal = async (backgroundHighlightOriginal = '', themeDark: EThemeDark, themeLight: EThemeLight) =>
  'background: ' +
  (backgroundHighlightOriginal
    ? `${backgroundHighlightOriginal}!important;`
    : (await isDark())
    ? `${THEME_CONFIG_DARK[themeDark].background2}!important;`
    : +themeLight === EThemeLight.默认
    ? 'rgb(251,248,241)!important;'
    : `${THEME_CONFIG_LIGHT[themeLight].background}!important;`);
