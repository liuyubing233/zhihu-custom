import { store } from '../../store';
import { dom, domById, domC, fnDomReplace, formatTime, message, myStorage } from '../../tools';
import { ID_BLOCK_LIST, initHTMLBlockedUsers } from './create-html';
import { removeBlockUser } from './do-fetch';
import { BLACK_LIST_CONFIG_NAMES, IBlockedUser, IConfigBlackList, mergeBlockedUsers } from './types';

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
  const { blockedUsers = [], localBlockedUsers = [], blockedUsersTags = [] } = configBlack;
  const prevConfig = await myStorage.getConfig();
  const { blockedUsers: prevBlockUsers = [], localBlockedUsers: prevLocalBlockedUsers = [], blockedUsersTags: prevBlockedUsersTags = [] } = prevConfig;
  // 标签合并去重
  const nTags = [...new Set([...prevBlockedUsersTags, ...blockedUsersTags])];
  const nBlackList: IBlockedUser[] = mergeBlockedUsers([...prevBlockUsers, ...blockedUsers]);
  const blockedUserIds = new Set(nBlackList.map((item) => item.id));
  const nLocalBlackList: IBlockedUser[] = mergeBlockedUsers([...prevLocalBlockedUsers, ...localBlockedUsers]).filter((item) => !blockedUserIds.has(item.id));
  await myStorage.updateConfig({
    ...prevConfig,
    ...configBlack,
    blockedUsers: nBlackList,
    localBlockedUsers: nLocalBlackList,
    blockedUsersTags: nTags,
  });
  message('导入完成，请等待知乎黑名单同步...');
  onSyncBlackList(0);
};

/** 清空黑名单列表 */
export const onSyncRemoveBlockedUsers = async () => {
  if (!confirm('您确定要取消所有知乎黑名单用户吗？')) return;
  if (!confirm('确定清空所有知乎黑名单用户？')) return;

  const { blockedUsers = [] } = await myStorage.getConfig();
  if (!blockedUsers.length) return;

  const buttonSync = dom('button[name="syncBlackRemove"]') as HTMLButtonElement;
  if (!buttonSync.querySelector('ctz-loading')) {
    fnDomReplace(buttonSync, { innerHTML: '<i class="ctz-loading">↻</i>', disabled: true });
  }

  const len = blockedUsers.length;
  let finishNumber = 0;

  for (let i = 0; i < len; i++) {
    const info = blockedUsers[i];
    if (info.id) {
      removeBlockUser(info, false).then(async () => {
        finishNumber++;
        if (finishNumber === len) {
          fnDomReplace(buttonSync, { innerHTML: '清空知乎黑名单', disabled: false });
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
    nodeList.innerHTML = '知乎黑名单加载中...';
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
      const { blockedUsers = [], localBlockedUsers = [] } = prevConfig;
      const prevBlockedUsers = [...blockedUsers, ...localBlockedUsers];

      data.forEach(({ id, name, url_token }) => {
        const findItem = prevBlockedUsers.find((i) => i.id === id);
        l.push({ id, name, urlToken: url_token, tags: (findItem && findItem.tags) || [] });
      });
      if (!paging.is_end) {
        onSyncBlackList(offset + limit, l);
        if (nodeList) {
          nodeList.innerHTML = `知乎黑名单加载中（${l.length} / ${paging.totals}）...`;
        }
      } else {
        const syncedIds = new Set(l.map((item) => item.id));
        await myStorage.updateConfig({
          ...prevConfig,
          blockedUsers: l,
          localBlockedUsers: localBlockedUsers.filter((item) => !syncedIds.has(item.id)),
        });
        initHTMLBlockedUsers(document.body);
        fnDomReplace(buttonSync, { innerHTML: '同步知乎黑名单', disabled: false });
        message('知乎黑名单同步完成');
      }
    });
}
