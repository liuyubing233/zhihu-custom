import { IBackgroundConfigs, IBackgroundDarkConfigs } from "../types/variable-background.type";

/** 背景色设置 */
export const BACKGROUND_CONFIG: IBackgroundConfigs = {
  '#ffffff': { name: '默认', opacity: '', color: '#333' },
  '#ffe4c4': { name: '护眼红', opacity: '#fff4e7', color: '#333' },
  '#FAF9DE': { name: '杏仁黄', opacity: '#fdfdf2', color: '#333' },
  '#cce8cf': { name: '青草绿', opacity: '#e5f1e7', color: '#333' },
  '#EAEAEF': { name: '极光灰', opacity: '#f3f3f5', color: '#333' },
  '#E9EBFE': { name: '葛巾紫', opacity: '#f2f3fb', color: '#333' },
  '#121212': { name: '夜间模式', opacity: '', color: '#ffffff' },
  '#1f1f1f': { name: '夜间护眼一', opacity: '', color: '#f7f9f9' },
  '#15202b': { name: '夜间护眼二', opacity: '', color: '#f7f9f9' },
  '#272822': { name: '夜间护眼三', opacity: '', color: '#f7f9f9' },
};

export const BACKGROUND_DARK_COLORS: IBackgroundDarkConfigs = {
  '#121212': { b2: '#333333', t1: '#fff', t2: '#999' },
  '#15202b': { b2: '#38444d', t1: '#f7f9f9', t2: '#161d23' },
  '#1f1f1f': { b2: '#303030', t1: '#f7f9f9', t2: '#161d23' },
  '#272822': { b2: '#383932', t1: '#f7f9f9', t2: '#161d23' },
};
