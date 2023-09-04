import { dom, domById, domA } from './tools';
import { myStorage } from './storage';

/** 在打开弹窗时候停止页面滚动，只允许弹窗滚动 */
export const myScroll = {
  stop: () => dom('body').classList.add('ctz-stop-scroll'),
  on: () => dom('body').classList.remove('ctz-stop-scroll'),
};

/** 自定义预览方法 */
export const myPreview = {
  // 开启预览弹窗
  open: function (src, even, isVideo) {
    const nameDom = isVideo ? this.evenPathVideo : this.evenPathImg;
    const idDom = isVideo ? this.idVideo : this.idImg;
    dom(nameDom).src = src;
    domById(idDom).style.display = 'block';
    // 存在 even 则保存，关闭时候清除
    // 解决浏览 GIF 时的弹窗问题
    even && (this.even = even);
    myScroll.stop();
  },
  // 关闭预览弹窗
  hide: function (pEvent) {
    if (this.even) {
      this.even.click();
      this.even = null;
    }
    pEvent.style.display = 'none';
    dom(this.evenPathImg).src = '';
    dom(this.evenPathVideo).src = '';
    myScroll.on();
  },
  even: null,
  evenPathImg: '#CTZ_PREVIEW_IMAGE img',
  evenPathVideo: '#CTZ_PREVIEW_VIDEO video',
  idImg: 'CTZ_PREVIEW_IMAGE',
  idVideo: 'CTZ_PREVIEW_VIDEO',
};

/** 编辑器弹窗打开关闭方法 */
export const myDialog = {
  open: async () => {
    domById(ID_DIALOG).style.display = 'flex';
    myScroll.stop();
    const isChangeConfig = await myStorage.initConfig();
    isChangeConfig && echoData();
    const isChangeHistory = await myStorage.initHistory();
    isChangeHistory && echoHistory();
  },
  hide: () => {
    domById(ID_DIALOG).style.display = 'none';
    myScroll.on();
  },
};

/** 设置菜单方法 */
export const myMenu = {
  init: function () {
    // 匹配顶部菜单项或者匹配菜单子项
    const chooseId = [...dom('.ctz-menu-top').children].map((i) => i.hash).find((i) => i === hash || hash.replace(i) !== hash);
    if (chooseId) {
      this.click({ target: dom(`a[href="${chooseId}"]`) });
      return;
    }
    this.click({ target: dom('a[href="#CTZ_BASIS"]') });
  },
  click: function ({ target }) {
    if (!(target.hash && target.tagName === 'A')) return;
    const isThis = target.hash.replace(/#/, '');
    if (!isThis) return;
    domA('.ctz-menu-top>a').forEach((itemA) => itemA.classList.remove('target'));
    target.classList.add('target');
    domA('.ctz-content>div').forEach((item) => (item.style.display = isThis === item.id ? 'flex' : 'none'));
  },
};
