/** 背景色设置 */
import { ETheme, EThemeDark, EThemeLight, IThemeConfigDark, IThemeConfigLight } from '../types/background.type';

export const THEMES = [
  { label: '浅色', value: ETheme.浅色, background: '#fff', color: '#69696e' },
  { label: '深色', value: ETheme.深色, background: '#000', color: '#fff' },
  { label: '自动', value: ETheme.自动, background: 'linear-gradient(to right, #fff, #000)', color: '#000' },
];

export const THEME_CONFIG_LIGHT: IThemeConfigLight = {
  [EThemeLight.默认]: { name: '默认', background: '#ffffff', background2: '', primary: 'rgb(0, 122, 255)' },
  [EThemeLight.黄]: { name: '黄', background: '#faf9de', background2: '#fdfdf2', primary: 'rgb(160, 90, 0)' },
  [EThemeLight.绿]: { name: '绿', background: '#cce8cf', background2: '#e5f1e7', primary: 'rgb(0, 125, 27)' },
  [EThemeLight.灰]: { name: '灰', background: '#eaeaef', background2: '#f3f3f5', primary: 'rgb(142, 142, 147)' },
  [EThemeLight.紫]: { name: '紫', background: '#e9ebfe', background2: '#f2f3fb', primary: 'rgb(175, 82, 222)' },
  [EThemeLight.橙]: { name: '橙', background: '#FFD39B', background2: '#ffe4c4', primary: 'rgb(201, 52, 0)' },
  [EThemeLight.浅橙]: { name: '浅橙', background: '#ffe4c4', background2: '#fff4e7', primary: 'rgb(255, 159, 10)' },
  [EThemeLight.红]: { name: '红', background: '#ffd6d4', background2: '#f8ebeb', primary: 'rgb(255, 59, 48)' },
};

export const THEME_CONFIG_DARK: IThemeConfigDark = {
  [EThemeDark.默认]: { name: '默认', background: '#121212', background2: '#333333', primary: '#121212' },
  [EThemeDark.深色一]: { name: '深色一', background: '#15202b', background2: '#38444d', primary: '#15202b' },
  [EThemeDark.深色二]: { name: '深色二', background: '#1f1f1f', background2: '#303030', primary: '#1f1f1f' },
  [EThemeDark.深色三]: { name: '深色三', background: '#272822', background2: '#383932', primary: '#272822' },
  [EThemeDark.高对比度蓝]: { name: '高对比度蓝', background: '#1c0c59', background2: '#191970', primary: '#1c0c59' },
  [EThemeDark.高对比度红]: { name: '高对比度红', background: '#570D0D', background2: '#8B0000', primary: '#570D0D' },
  [EThemeDark.高对比度绿]: { name: '高对比度绿', background: '#093333', background2: '#0c403f', primary: '#093333' },
};

export const INPUT_NAME_THEME = 'theme';
export const INPUT_NAME_THEME_DARK = 'themeDark';
export const INPUT_NAME_ThEME_LIGHT = 'themeLight';
