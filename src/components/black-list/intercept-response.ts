import { store } from '../../store';
import { dom } from '../../tools';
import { IJsInitialDataUsersAnSENI } from '../../types/zhihu';
import { IBlockedUser } from './types';
import { removeItemAfterBlock, updateItemAfterBlock } from './update';

/** 拦截屏蔽用户接口 */
export const interceptResponseForBlocked = async (res: Response, opt?: RequestInit) => {
  if (/\/api\/v4\/members\/[^/]+\/actions\/block/.test(res.url) && res.ok) {
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
        opt.method === 'POST' && updateItemAfterBlock(userInfo);
        opt.method === 'DELETE' && removeItemAfterBlock(userInfo);
      }
    }
  }
};
