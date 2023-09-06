/** 背景色设置 */
export type IBackgroundConfigs = Record<string, IBackgroundEntries>;
export interface IBackgroundEntries {
  /** 名称 */
  name: string;
  /** 透明度 */
  opacity: string;
  /** 颜色 */
  color: string;
}

export interface IBackgroundDarkEntries {
  /** 第二背景色 */
  b2: string;
  /** 第一文字颜色 */
  t1: string;
  /** 第二文字颜色 */
  t2: string;
}

/** 夜间模式配置 */
export type IBackgroundDarkConfigs = Record<string, IBackgroundDarkEntries>;
