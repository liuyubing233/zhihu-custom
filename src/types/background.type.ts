import { IOptionItem } from './common.type';

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
  深色模式默认,
  深色护眼一,
  深色护眼二,
  深色护眼三,
  深色蓝,
  深色红,
  深色绿,
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
}

export type IHiddenArray = IHiddenItem[];

export interface IHiddenContentItem extends IOptionItem {
  css: string;
}
export interface IHiddenItem {
  key: string;
  name: string;
  desc: string;
  content: IHiddenContentItem[][];
}
