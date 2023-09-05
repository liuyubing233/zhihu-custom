import { store } from '../store';
import { IMyElement } from '../types/dom';
import { IMyListenAnswerItem } from '../types/listen';
import { IBlockUserItem } from '../types/variable-configs';
import { IZhihuCardContent } from '../types/zhihu';
import { CLASS_REMOVE_BLOCK, ID_BLOCK_LIST, ID_BUTTON_SYNC_BLOCK } from '../variable/dom-name';
import { myStorage } from './storage';
import { dom, domById, domC, fnDomReplace, fnReturnStr } from './tools';

/** 黑名单用户操作方法 */
export const myBlack: IMyBlack = {
  messageCancel: '取消屏蔽之后，对方将可以：关注你、给你发私信、向你提问、评论你的答案、邀请你回答问题。',
  /** 初始化黑名单列表 */
  init: function () {
    const me = this;
    const elementBlock = domById(ID_BLOCK_LIST);
    if (!elementBlock) return;
    const { getConfig } = store;
    const { removeBlockUserContentList = [] } = getConfig();
    elementBlock.innerHTML = removeBlockUserContentList.map((i) => this.createItem(i)).join('');
    elementBlock.onclick = (event) => {
      const target = event.target as IMyElement;
      if (!target || !target.classList.contains(CLASS_REMOVE_BLOCK)) return;
      const item = target.parentElement as IMyElement;
      const info = item.dataset.info ? JSON.parse(item.dataset.info) : {};
      confirm(me.messageCancel) && me.serviceRemove(info);
    };
  },
  /** 黑名单元素 */
  createItem: function (info) {
    return `<div class="ctz-black-item ctz-black-id-${info.id}" data-info='${JSON.stringify(info)}'>${this.createItemContent(info)}</div>`;
  },
  createItemContent: ({ id, name, avatar }) => {
    return `<img src="${avatar}"/><a href="/people/${id}" target="_blank">${name}</a><i class="ctz-icon ${CLASS_REMOVE_BLOCK}" style="margin-left:4px;cursor:pointer;">&#xe607;</i>`;
  },
  /** 添加「屏蔽用户」按钮，第二个参数为监听方法对象 */
  addButton: function (event, objMy) {
    const me = this;
    const classBox = 'ctz-block-box';
    const nodeBlockBox = event.querySelector(`.${classBox}`);
    nodeBlockBox && nodeBlockBox.remove();
    const nodeUser = event.querySelector('.AnswerItem-authorInfo>.AuthorInfo') as IMyElement;
    if (!nodeUser || !nodeUser.offsetHeight) return;
    const userUrl = (nodeUser.querySelector('meta[itemprop="url"]') as IMyElement).content;
    const userName = (nodeUser.querySelector('meta[itemprop="name"]') as IMyElement).content;
    const avatar = (nodeUser.querySelector('meta[itemprop="image"]') as IMyElement).content;
    const nodeAnswerItem = event.querySelector('.AnswerItem');
    const mo = nodeAnswerItem ? nodeAnswerItem.getAttribute('data-za-extra-module') || '{}' : '{}';
    const aContent: IZhihuCardContent = JSON.parse(mo).card.content;
    const userId = aContent.author_member_hash_id || '';
    if (!userUrl.replace(/https:\/\/www.zhihu.com\/people\//, '')) return;
    const { getConfig } = store;
    const { removeBlockUserContentList = [] } = getConfig();
    const isAlreadyBlack = removeBlockUserContentList.findIndex((i) => i.id === userId) >= 0;
    const message = `是否要屏蔽${userName}？\n屏蔽后，对方将不能关注你、向你发私信、评论你的实名回答、使用「@」提及你、邀请你回答问题，但仍然可以查看你的公开信息。\n如果开启了「不再显示已屏蔽用户发布的内容」那么也不会看到对方发布的回答`;
    const classBlack = 'ctz-black';
    const classBlackRemove = 'ctz-black-remove';
    const classBlackFilter = 'ctz-black-filter';
    const classJustFilter = 'ctz-just-filter';
    const innerHTML = isAlreadyBlack
      ? `<button class="${classBlackRemove}">解除屏蔽</button>` + fnReturnStr(`<button class="${classJustFilter}">隐藏该回答</button>`, !!objMy)
      : `<button class="${classBlack}">屏蔽用户</button>` + fnReturnStr(`<button class="${classBlackFilter}">屏蔽用户并隐藏该回答</button>`, !!objMy);
    const nodeBox = domC('div', { className: classBox, innerHTML });
    nodeBox.onclick = function (ev) {
      const target = ev.target as IMyElement;
      const matched = userUrl.match(/(?<=people\/)[\w\W]+/);
      const urlToken = matched ? matched[0] : '';
      // 屏蔽用户
      if (target.classList.contains(classBlack)) {
        if (!confirm(message)) return;
        me.serviceAdd(urlToken, userName, userId, avatar);
        fnDomReplace((this as IMyElement).querySelector(`.${classBlackFilter}`), { className: classJustFilter, innerText: '隐藏该回答' });
        fnDomReplace(target, { className: classBlackRemove, innerText: '解除屏蔽' });
        return;
      }
      // 解除屏蔽
      if (target.classList.contains(classBlackRemove)) {
        if (!confirm(me.messageCancel)) return;
        me.serviceRemove({ urlToken, id: userId, name: userName });
        fnDomReplace(target, { className: classBlack, innerText: '屏蔽用户' });
        fnDomReplace((this as IMyElement).querySelector(`.${classJustFilter}`), { className: classBlackFilter, innerText: '屏蔽用户并隐藏该回答' });
        return;
      }
      // 屏蔽并隐藏回答
      if (target.classList.contains(classBlackFilter) || target.classList.contains(classJustFilter)) {
        if (target.classList.contains(classBlackFilter)) {
          if (!confirm(message)) return;
          me.serviceAdd(urlToken, userName, userId, avatar);
        }
        event.style.display = 'none';
        if (objMy) {
          objMy.index = objMy.index - 1 > 0 ? objMy.index - 1 : 0;
        }
        return;
      }
    };
    nodeUser.appendChild(nodeBox);
  },
  /** 添加屏蔽用户 */
  addBlackItem: function (info) {
    const { getConfig, setConfig } = store;
    const pfConfig = getConfig();
    const nL = pfConfig.removeBlockUserContentList || [];
    nL.push(info);
    pfConfig.removeBlockUserContentList = nL;
    setConfig(pfConfig);
    myStorage.set('pfConfig', JSON.stringify(pfConfig));
    const nodeBlackItem = domC('div', { className: `ctz-black-item ctz-black-id-${info.id}`, innerHTML: this.createItemContent(info) });
    nodeBlackItem.dataset.info = JSON.stringify(info);
    domById(ID_BLOCK_LIST)!.appendChild(nodeBlackItem);
  },
  /** 调用「屏蔽用户」接口 */
  serviceAdd: function (urlToken, userName, userId, avatar) {
    const me = this;
    const headers = this.getHeaders();
    fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
      method: 'POST',
      headers: new Headers({
        ...headers,
        'x-xsrftoken': document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)![0] || '',
      }),
      credentials: 'include',
    }).then(() => {
      me.addBlackItem({ id: userId, name: userName, avatar, userType: 'people', urlToken });
    });
  },
  /** 解除拉黑用户接口 */
  serviceRemove: function (info) {
    const { urlToken, id } = info;
    const headers = this.getHeaders();
    fetch(`https://www.zhihu.com/api/v4/members/${urlToken}/actions/block`, {
      method: 'DELETE',
      headers: new Headers({
        ...headers,
        'x-xsrftoken': document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)![0] || '',
      }),
      credentials: 'include',
    }).then(() => {
      const { getConfig, setConfig } = store;
      const pfConfig = getConfig();
      const nL = pfConfig.removeBlockUserContentList || [];
      const itemIndex = nL.findIndex((i) => i.id === info.id);
      if (itemIndex >= 0) {
        nL.splice(itemIndex, 1);
        pfConfig.removeBlockUserContentList = nL;
        const removeItem = dom(`.ctz-black-id-${id}`);
        removeItem && removeItem.remove();
        setConfig(pfConfig);
        myStorage.set('pfConfig', JSON.stringify(pfConfig));
      }
    });
  },
  /** 同步黑名单列表 */
  sync: function (offset = 0, l = []) {
    const nodeList = domById(ID_BLOCK_LIST);
    !l.length && nodeList && (nodeList.innerHTML = '');
    fnDomReplace(domById(ID_BUTTON_SYNC_BLOCK), { innerHTML: '<i class="ctz-icon ctz-loading">&#xe605;</i>', disabled: true });
    const limit = 20;
    const headers = this.getHeaders();
    fetch(`https://www.zhihu.com/api/v3/settings/blocked_users?offset=${offset}&limit=${limit}`, {
      method: 'GET',
      headers: new Headers(headers),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then(({ data, paging }: { data: any[]; paging: any }) => {
        data.forEach(({ id, name, avatar_url, user_type, url_token }) => {
          l.push({ id, name, avatar: avatar_url, userType: user_type, urlToken: url_token });
        });
        if (!paging.is_end) {
          this.sync((offset + 1) * limit, l);
        } else {
          const { getConfig, setConfig } = store;
          const pfConfig = getConfig();
          pfConfig.removeBlockUserContentList = l;
          setConfig(pfConfig);
          myStorage.set('pfConfig', JSON.stringify(pfConfig));
          myBlack.init();
          fnDomReplace(domById(ID_BUTTON_SYNC_BLOCK), { innerHTML: '同步黑名单', disabled: false });
        }
      });
  },
  getHeaders: () => {
    const { getStorageConfigItem } = store;
    return getStorageConfigItem('fetchHeaders') as HeadersInit;
  },
};

type IObjMy = IMyListenAnswerItem;

interface IMyBlack {
  messageCancel: string;
  init: () => void;
  createItem: (info: IBlockUserItem) => void;
  createItemContent: (info: IBlockUserItem) => void;
  addButton: (event: IMyElement, objMy?: IObjMy) => void;
  addBlackItem: (info: IBlockUserItem) => void;
  serviceAdd: (urlToken: string, userName: string, userId: string, avatar: string) => void;
  serviceRemove: (info: IBlockUserItem) => void;
  sync: (offset: number, l: IBlockUserItem[]) => void;
  getHeaders: () => HeadersInit;
}
