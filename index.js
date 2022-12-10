// ==UserScript==
// @name         知乎修改器✈持续更新✈努力实现功能最全的知乎配置插件
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  页面模块可配置化|列表种类和关键词强过滤内容，关键词过滤后自动调用“不感兴趣”的接口，防止在其他设备上出现同样内容|视频一键下载|回答内容按照点赞数和评论数排序|设置自动收起所有长回答或自动展开所有回答|移除登录弹窗|设置过滤故事档案局和盐选科普回答等知乎官方账号回答|首页切换模块，发现切换模块、个人中心、搜素栏可悬浮并自定义位置|夜间模式开关及背景色修改|收藏夹导出为PDF|隐藏知乎热搜，体验纯净搜索|列表添加标签种类|去除广告|设置购买链接显示方式|外链直接打开|屏蔽用户回答|更多功能请在插件里体验...
// @compatible   edge Violentmonkey
// @compatible   edge Tampermonkey
// @compatible   chrome Violentmonkey
// @compatible   chrome Tampermonkey
// @compatible   firefox Violentmonkey
// @compatible   firefox Tampermonkey
// @author       super pufferfish
// @match        *://*.zhihu.com/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_log
// @grant        GM_download
// @run-at       document-start
// ==/UserScript==
(function () {
  'use strict';
  const INNER_HTML = ``;
  const INNER_CSS = ``;

  const HTML_HOOTS = ['www.zhihu.com', 'zhuanlan.zhihu.com'];
  /** 设置弹窗 */
  const ID_DIALOG = 'CTZ_DIALOG_MAIN';
  /** 展示按钮 */
  const ID_OPEN_BUTTON = 'CTZ_OPEN_BUTTON';
  /** 插入的元素顶层 id */
  const ID_MAIN = 'CTZ_MAIN';
  /** 插入的默认样式 id */
  const ID_STYLE = 'CTZ_STYLE';
  /** 弹窗关闭按钮 id */
  const ID_CLOSE = 'CTZ_CLOSE_DIALOG';
  /** 插入的默认样式属性 */
  const ATTR_INNER_CSS = {
    id: ID_STYLE,
    type: 'text/css',
    innerHTML: INNER_CSS,
  };
  /** 插入的元素顶层属性 */
  const ATTR_INNER_HTML = {
    id: ID_MAIN,
    innerHTML: INNER_HTML,
  };
  /** 底部跳转链接 */
  const HERF_LIST = [
    {
      name: 'Github 您的star⭐是我更新的动力',
      href: 'https://github.com/superPufferfish/custom-zhihu',
    },
    {
      name: 'GreasyFork',
      href: 'https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8',
    },
  ];

  const dom = (n) => document.querySelector(n);
  const domById = (id) => document.getElementById(id);
  const domA = (n) => document.querySelectorAll(n);
  const domC = (name, attrObjs) => {
    const element = document.createElement(name);
    Object.keys(attrObjs).forEach((key) => {
      element[key] = attrObjs[key];
    });
    return element;
  };

  const myDialog = {
    open: async () => {
      domById(ID_DIALOG).style.display = 'flex';

      // $('.pf-mark')[0].style.display = 'block';
      // $('.pf-modal').addClass('pf-modal-show');
      // const newConfig = await myStorage.get('pfConfig');
      // const c = newConfig ? JSON.parse(newConfig) : {};
      // if (newConfig !== JSON.stringify(pfConfig)) {
      //   pfConfig = { ...pfConfig, ...c };
      //   echoData();
      // }
      // initScrollModal();
      // myScroll.stop();
    },
    hide: () => {
      domById(ID_DIALOG).style.display = 'none';

      // $('.pf-mark')[0].style.display = 'none';
      // $('.pf-modal').removeClass('pf-modal-show');
      // myScroll.on();
    },
  };

  /** 加载基础样式 */
  const initStyle = () => {
    const element = domC('style', ATTR_INNER_CSS);
    document.head.appendChild(element);
  };

  /** 加载基础元素及绑定方法 */
  const initHTML = () => {
    const element = domC('div', ATTR_INNER_HTML);
    document.body.appendChild(element);

    // 绑定元素事件
    domById(ID_OPEN_BUTTON).onclick = myDialog.open;
    domById(ID_CLOSE).onclick = myDialog.hide;

    const appendFooter = () => {
      HERF_LIST.forEach(({ name, href }) => {
        const tagA = domC('a', {
          href,
          target: '_blank',
          innerText: name,
        });
        dom('.ctz-footer').appendChild(tagA);
      });
    };

    try {
      dom('.ctz-version').innerText = `version: ${GM_info.script.version}`;
      appendFooter();
    } catch {}
  };

  (function init() {
    console.log('init data');
  })();

  /** 网页加载完成后操作 */
  window.onload = () => {
    if (!HTML_HOOTS.includes(location.hostname)) return;
    console.log('window.onload');
    initStyle();
    initHTML();
  };
})();
