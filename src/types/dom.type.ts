import { IOptionItem } from './common.type';

export interface IRangeItem extends IOptionItem {
  min: number;
  max: number;
  desc: string;
  percentChooseLabel: string;
  percentChooseValue: string;
  percentMin: number;
  percentMax: number;
  percentLabel: string;
  percentValue: string;
}
