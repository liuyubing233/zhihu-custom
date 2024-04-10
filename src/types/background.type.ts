import { IOptionItem } from "./common.type";

/** 主题风格 */
export enum ETheme {
  浅色,
  深色,
  自动,
}

/** 主题风格 - 浅色 */
export enum EThemeLight {
  默认,
  红,
  黄,
  绿,
  灰,
  紫,
  落日黄,
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
export type IThemeConfigLight = Record<EThemeLight, IThemeValueLight>;

export interface IThemeValueLight {
  /** 名称 */
  name: string;
  /** 字体颜色 */
  color?: string;
  /** 背景色 */
  background: string;
  /** 第二背景色 */
  background2: string;
}

/** 深色主题色配置 */
export type IThemeConfigDark = Record<EThemeDark, IThemeValueDark>;
export interface IThemeValueDark {
  /** 名称 */
  name: string;
  /** 字体颜色 */
  color: string;
  /** 第二字体色 */
  color2: string;
  /** 背景色 */
  background: string;
  /** 第二背景色 */
  background2: string;
}

export type IHiddenArray = IHiddenItem[];
export interface IHiddenItem {
  key: string;
  name: string;
  desc: string;
  content: IOptionItem[][];
}
