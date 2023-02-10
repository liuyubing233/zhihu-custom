// ==UserScript==
// @name         server local js
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  server local js about zhihu style,init this js into tampermonkey,save js can reload page
// @author       liuyubing
// @match        *://*.zhihu.com/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @connect      127.0.0.1
// ==/UserScript==
(function () {
  // 使用 live server 启动
  // 清除 tampermonkey GM
  GM_deleteValue('code');

  const CODE_NAME = 'CODE_FOR_CUSTOM_ZHIHU';

  const innerCSS = () => {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        url: 'http://127.0.0.1:5500/development/css-own.css',
        onload: (e) => {
          if (e.status === 200) {
            resolve(e.responseText);
          }
        },
      });
    });
  };

  const innerHTML = () => {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        url: 'http://127.0.0.1:5500/development/html-modal.html',
        onload: (e) => {
          if (e.status === 200) {
            resolve(e.responseText);
          }
        },
      });
    });
  };

  const innerJS = () => {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        url: 'http://127.0.0.1:5500/index.js',
        onload: (e) => {
          if (e.status === 200) {
            resolve(e.responseText);
          }
        },
      });
    });
  };

  async function loop() {
    const css = await innerCSS();
    const html = await innerHTML();
    const js = await innerJS();
    // 将html 和css 插入到js
    const jsReplace = js.replace(/(?<=INNER_HTML[^`]*)`[^`]*`/, '`' + html + '`').replace(/(?<=INNER_CSS[^`]*)`[^`]*`/, '`' + css + '`');
    if (code === jsReplace) return;
    window.localStorage.setItem(CODE_NAME, jsReplace);
    location.reload();
  }

  setTimeout(loop, 500);

  const code = window.localStorage.getItem(CODE_NAME);
  code && eval(code);
})();
