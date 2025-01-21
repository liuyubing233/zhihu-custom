/** 背景色设置 */
import { ETheme, EThemeDark, EThemeLight, IThemeConfigLight } from '../types/background.type';

export const THEMES = [
  { label: '浅色', value: ETheme.浅色, background: '#fff', color: '#69696e' },
  { label: '深色', value: ETheme.深色, background: '#000', color: '#fff' },
  { label: '自动', value: ETheme.自动, background: 'linear-gradient(to right, #fff, #000)', color: '#000' },
];

export const THEME_CONFIG_LIGHT: IThemeConfigLight = {
  [EThemeLight.默认]: { name: '默认', background: '#ffffff', background2: '' },
  [EThemeLight.红]: { name: '红', background: '#ffe4c4', background2: '#fff4e7' },
  [EThemeLight.黄]: { name: '黄', background: '#faf9de', background2: '#fdfdf2' },
  [EThemeLight.绿]: { name: '绿', background: '#cce8cf', background2: '#e5f1e7' },
  [EThemeLight.灰]: { name: '灰', background: '#eaeaef', background2: '#f3f3f5' },
  [EThemeLight.紫]: { name: '紫', background: '#e9ebfe', background2: '#f2f3fb' },
  [EThemeLight.落日黄]: { name: '落日黄', background: '#FFD39B', background2: '#ffe4c4' },
};

export const THEME_CONFIG_DARK: IThemeConfigLight = {
  [EThemeDark.深色模式默认]: { name: '默认',  background: '#121212', background2: '#333333' },
  [EThemeDark.深色护眼一]: { name: '深色护眼一',  background: '#15202b', background2: '#38444d' },
  [EThemeDark.深色护眼二]: { name: '深色护眼二',  background: '#1f1f1f', background2: '#303030' },
  [EThemeDark.深色护眼三]: { name: '深色护眼三',  background: '#272822', background2: '#383932' },
  [EThemeDark.深色蓝]: { name: '深色蓝',  background: '#1c0c59', background2: '#191970' },
  [EThemeDark.深色红]: { name: '深色红',  background: '#570D0D', background2: '#8B0000' },
  [EThemeDark.深色绿]: { name: '深色绿',  background: '#093333', background2: '#0c403f' },
};

export const INPUT_NAME_THEME = 'theme';
export const INPUT_NAME_THEME_DARK = 'themeDark';
export const INPUT_NAME_ThEME_LIGHT = 'themeLight';
