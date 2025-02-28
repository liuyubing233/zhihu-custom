
/** 主题风格 */
export enum ETheme {
  浅色,
  深色,
  自动,
}

/** 主题风格 - 浅色 */
export enum EThemeLight {
  默认 = 0,
  红 = 1,
  黄 = 2,
  绿 = 3,
  灰 = 4,
  紫 = 5,
  橙 = 6,
  浅橙 = 7,
}

/** 主题风格 - 深色 */
export enum EThemeDark {
  默认 = 0,
  深色一 = 1,
  深色二 = 2,
  深色三 = 3,
  高对比度蓝 = 4,
  高对比度红 = 5,
  高对比度绿 = 6,
}

/** 浅色主题色配置 */
export type IThemeConfigLight = Record<EThemeLight, IThemeValue>;

/** 深色主题色配置 */
export type IThemeConfigDark = Record<EThemeDark, IThemeValue>;

export interface IThemeValue {
  /** 名称 */
  name: string;
  /** 背景色 */
  background: string;
  /** 第二背景色 */
  background2: string;
  /** 主题色 */
  primary: string;
}
