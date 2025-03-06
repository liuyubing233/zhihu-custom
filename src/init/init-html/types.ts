export interface ICommonContent {
  /** 名称 */
  label: string;
  /** config 值 */
  value: string;
  /** 是否需要开启接口拦截才能生效 */
  needFetch?: boolean;
  /** 提示 */
  tooltip?: string;
}
