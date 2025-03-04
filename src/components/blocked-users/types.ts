/** 黑名单 */
export interface IBlockedUser {
  id: string;
  name: string;
  urlToken: string;
  tags?: string[]; // 标签
}
