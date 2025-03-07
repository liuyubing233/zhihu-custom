import { dom } from '../../tools';

/** 网页标题图片集合 */
export const ICO_URL: Record<string, string> = {
  zhihu: 'https://static.zhihu.com/heifetz/favicon.ico',
  github: 'https://github.githubassets.com/pinned-octocat.svg',
  juejin: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png',
  csdn: 'https://g.csdnimg.cn/static/logo/favicon32.ico',
  bilibili: 'https://www.bilibili.com/favicon.ico',
  lanhu: 'https://sso-cdn.lanhuapp.com/ssoweb/favicon.ico',
  yuque: 'https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*vMxOQIh4KBMAAAAAAAAAAAAADvuFAQ/original',
  mailQQ: 'https://mail.qq.com/zh_CN/htmledition/images/favicon/qqmail_favicon_96h.png',
  mail163: 'https://mail.163.com/favicon.ico',
  weibo: 'https://weibo.com/favicon.ico',
  qzone: 'https://qzonestyle.gtimg.cn/aoi/img/logo/favicon.ico?max_age=31536000',
  baidu: 'https://www.baidu.com/favicon.ico',
};

/** 添加修改网页图标设置 */
export const createHTMLTitleICOChange = (nDomMain: HTMLElement) => {
  dom('#CTZ_TITLE_ICO', nDomMain)!.innerHTML = Object.entries(ICO_URL)
    .map(([key, value]) => `<label><input class="ctz-i" name="titleIco" type="radio" value="${key}" /><img src="${value}" alt="${key}"></label>`)
    .join('');
};
