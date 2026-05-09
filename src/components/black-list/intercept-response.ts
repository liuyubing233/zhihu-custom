import { store } from '../../store';
import { dom, message } from '../../tools';
import { IJsInitialDataUsersAnSENI } from '../../types/zhihu';
import { BLOCKED_USER_LIST_TYPE, IBlockedUser, isZhihuBlockListFullResponse } from './types';
import { removeItemAfterBlock, updateItemAfterBlock } from './update';

/** 拦截屏蔽用户接口 */
export const interceptResponseForBlocked = async (res: Response, opt?: RequestInit) => {
  if (/\/api\/v4\/members\/[^/]+\/actions\/block/.test(res.url)) {
    if (dom('.ProfileHeader-contentFooter .MemberButtonGroup')) {
      // 个人主页中
      const jsInitData = store.getJsInitialData();
      let userInfo: IBlockedUser | undefined = undefined;
      try {
        const currentUserInfo = jsInitData!.initialState!.entities.users;
        Object.entries(currentUserInfo).forEach(([key, value]) => {
          if ((value as IJsInitialDataUsersAnSENI).name && location.pathname.includes(key)) {
            const { id, name, urlToken } = value as IJsInitialDataUsersAnSENI;
            userInfo = { id, name, urlToken };
          }
        });
      } catch {}
      if (opt && userInfo) {
        if (opt.method === 'POST') {
          if (res.ok) {
            updateItemAfterBlock(userInfo, BLOCKED_USER_LIST_TYPE.zhihu);
          } else if (await isZhihuBlockListFullResponse(res)) {
            updateItemAfterBlock(userInfo, BLOCKED_USER_LIST_TYPE.local);
            message('知乎黑名单已满，已添加至本地黑名单');
          }
        }
        opt.method === 'DELETE' && res.ok && removeItemAfterBlock(userInfo, BLOCKED_USER_LIST_TYPE.zhihu);
      }
    }
  }
};
