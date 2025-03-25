import { store } from '../../store';
import { dom, domA, domById, domC, fnDomReplace, formatTime, message, myStorage } from '../../tools';
import { ID_BLOCK_LIST, initHTMLBlockedUsers } from './create-html';
import { removeBlockUser } from './do-fetch';
import { BLACK_LIST_CONFIG_NAMES, IBlockedUser, IConfigBlackList } from './types';

/** 导出黑名单部分配置 */
export const onExportBlack = async () => {
  const config = await myStorage.getConfig();
  const configBlackList: IConfigBlackList = {};
  BLACK_LIST_CONFIG_NAMES.forEach((name) => {
    if (typeof config[name] !== 'undefined') {
      configBlackList[name] = config[name] as any;
    }
  });
  const dateNumber = +new Date();
  const link = domC('a', {
    href: 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(JSON.stringify(configBlackList)),
    download: `黑名单配置-${formatTime(dateNumber, 'YYYYMMDD-HHmmss')}-${dateNumber}.txt`,
  });
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/** 黑名单部分配置导入 */
export const onImportBlack = async (oFREvent: ProgressEvent<FileReader>) => {
  let configBlackJson = oFREvent.target ? oFREvent.target.result : '';
  if (typeof configBlackJson !== 'string') return;
  const configBlack = JSON.parse(configBlackJson) as IConfigBlackList;
  const { blockedUsers = [], blockedUsersTags = [] } = configBlack;
  const prevConfig = await myStorage.getConfig();
  const { blockedUsers: prevBlockUsers = [], blockedUsersTags: prevBlockedUsersTags = [] } = prevConfig;
  // 标签合并去重
  const nTags = [...new Set([...prevBlockedUsersTags, ...blockedUsersTags])];
  // 原黑名单列表去重后剩余的用户
  const prevListLess = prevBlockUsers.filter((item) => !blockedUsers.findIndex((i) => i.id === item.id));
  blockedUsers.forEach((item) => {
    const prevUser = prevBlockUsers.find((i) => i.id === item.id);
    if (prevUser) {
      item.tags = [...new Set([...(item.tags || []), ...(prevUser.tags || [])])];
    }
  });
  // 黑名单用户合并去重
  let nBlackList: IBlockedUser[] = [...blockedUsers, ...prevListLess];
  await myStorage.updateConfig({
    ...prevConfig,
    ...configBlack,
    blockedUsers: nBlackList,
    blockedUsersTags: nTags,
  });
  message('导入完成，请等待黑名单同步...');
  onSyncBlackList(0);
};

/** 清空黑名单列表 */
export const onSyncRemoveBlockedUsers = () => {
  if (!confirm('您确定要取消屏蔽所有黑名单用户吗？')) return;
  if (!confirm('确定清空所有屏蔽用户？')) return;

  const buttonSync = dom('button[name="syncBlackRemove"]') as HTMLButtonElement;
  if (!buttonSync.querySelector('ctz-loading')) {
    fnDomReplace(buttonSync, { innerHTML: '<i class="ctz-loading">↻</i>', disabled: true });
  }

  const removeButtons = domA('.ctz-remove-block');
  const len = removeButtons.length;
  let finishNumber = 0;

  if (!removeButtons.length) return;
  for (let i = 0; i < len; i++) {
    const item = removeButtons[i] as HTMLElement;
    const itemParent = item.parentElement!;
    const info = itemParent.dataset.info ? JSON.parse(itemParent.dataset.info) : {};
    if (info.id) {
      removeBlockUser(info, false).then(async () => {
        finishNumber++;
        itemParent.remove();
        if (finishNumber === len) {
          fnDomReplace(buttonSync, { innerHTML: '清空黑名单列表', disabled: false });
          await myStorage.updateConfigItem('blockedUsers', []);
          initHTMLBlockedUsers(document.body);
        }
      });
    }
  }
};

/** 同步黑名单 */
export function onSyncBlackList(offset = 0, l: IBlockedUser[] = []) {
  const nodeList = domById(ID_BLOCK_LIST);
  if (!l.length && nodeList) {
    nodeList.innerHTML = '黑名单列表加载中...';
  }

  const buttonSync = dom('button[name="syncBlack"]') as HTMLButtonElement;
  if (!buttonSync.querySelector('ctz-loading')) {
    fnDomReplace(buttonSync, { innerHTML: '<i class="ctz-loading">↻</i>', disabled: true });
  }

  const limit = 20;
  const headers = store.getFetchHeaders();
  fetch(`https://www.zhihu.com/api/v3/settings/blocked_users?offset=${offset}&limit=${limit}`, {
    method: 'GET',
    headers: new Headers(headers),
    credentials: 'include',
  })
    .then((response) => response.json())
    .then(async ({ data, paging }: { data: any[]; paging: any }) => {
      const prevConfig = await myStorage.getConfig();
      const { blockedUsers = [] } = prevConfig;

      data.forEach(({ id, name, url_token }) => {
        const findItem = blockedUsers.find((i) => i.id === id);
        l.push({ id, name, urlToken: url_token, tags: (findItem && findItem.tags) || [] });
      });
      if (!paging.is_end) {
        onSyncBlackList(offset + limit, l);
        if (nodeList) {
          nodeList.innerHTML = `黑名单列表加载中（${l.length} / ${paging.totals}）...`;
        }
      } else {
        await myStorage.updateConfigItem('blockedUsers', l);
        initHTMLBlockedUsers(document.body);
        fnDomReplace(buttonSync, { innerHTML: '同步黑名单', disabled: false });
        message('黑名单列表同步完成');
      }
    });
}
