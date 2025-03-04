import { IOptionItem } from "../../types/common.type";

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
