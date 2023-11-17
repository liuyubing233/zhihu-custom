// ==UserScript==
// @name         本地调试5555
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  写入tampermonkey，本地开发使用
// @author       liuyubing
// @match        *://*.zhihu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-start
// @connect      127.0.0.1
// ==/UserScript==
(function () {
  const CODE_NAME = 'CODE_FOR_CUSTOM_ZHIHU';

  const innerJS = () => {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        url: 'http://127.0.0.1:5555/index.js',
        onload: (e) => {
          if (e.status === 200) {
            resolve(e.responseText);
          }
        },
      });
    });
  };

  async function loop() {
    const js = await innerJS();
    if (code === js) return;
    window.localStorage.setItem(CODE_NAME, js);
    location.reload();
  }

  setTimeout(loop, 500);

  const code = window.localStorage.getItem(CODE_NAME);
  code && eval(code);
})();
