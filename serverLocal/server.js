// ==UserScript==
// @name         server local js
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  server local js about zhihu style,init this js into tampermonkey,save js can reload page
// @author       super puffer fish
// @match         *://www.zhihu.com/*
// @match         *://zhuanlan.zhihu.com/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @connect      127.0.0.1
// @match        *://localhost*/*
// ==/UserScript==

const loop = () => {
  // use live server open
  GM_xmlhttpRequest({
    url: 'http://127.0.0.1:5500/index.js',
    onload: e => {
      const res = e.responseText;
      if (e.status === 200 && code !== res) {
        GM_setValue('code', res);
        location.reload();
      }
    },
  });
};

setInterval(loop, 3000);

const code = GM_getValue('code');
if (code) {
  eval(code);
}