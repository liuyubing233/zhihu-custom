export type IBackgroundKey = '#ffffff' | '#ffe4c4' | '#FAF9DE' | '#cce8cf' | '#EAEAEF' | '#E9EBFE' | '#121212' | '#1f1f1f' | '#15202b' | '#272822';
/** 背景色设置 */
export type IBackgroundConfigs = Record<IBackgroundKey, IBackgroundEntries>;
export interface IBackgroundEntries {
  /** 名称 */
  name: string;
  /** 透明度 */
  opacity: string;
  /** 颜色 */
  color: string;
}

export type IBackgroundDarkKey = '#121212' | '#1f1f1f' | '#15202b' | '#272822';
export interface IBackgroundDarkEntries {
  /** 第二背景色 */
  b2: string;
  /** 第一文字颜色 */
  t1: string;
  /** 第二文字颜色 */
  t2: string;
}

/** 夜间模式配置 */
export type IBackgroundDarkConfigs = Record<IBackgroundDarkKey, IBackgroundDarkEntries>;
