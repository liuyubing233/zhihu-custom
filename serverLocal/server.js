// ==UserScript==
// @name         server local js
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  server local js about zhihu style,init this js into tampermonkey,save js can reload page
// @author       super puffer fish
// @match         *://www.zhihu.com/*
// @match         *://zhuanlan.zhihu.com/*
// @match        *://localhost*/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @connect      127.0.0.1
// ==/UserScript==
// 使用live server 启动
const innerCSS = () => {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      url: 'http://127.0.0.1:5500/before-compression/css-own.css',
      onload: (e) => {
        if (e.status === 200) {
          resolve(e.responseText)
        }
      }
    })
  })

}

const innerHTML = () => {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      url: 'http://127.0.0.1:5500/before-compression/html-modal.html',
      onload: (e) => {
        if (e.status === 200) {
          resolve(e.responseText)
        }
      }
    })
  })
}

const innerJS = () => {
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      url: 'http://127.0.0.1:5500/index.js',
      onload: (e) => {
        if (e.status === 200) {
          resolve(e.responseText)
        }
      }
    })
  })
}

async function loop () {
  const css = await innerCSS()
  const html = await innerHTML()
  const js = await innerJS()
  // 将html 和css 插入到js
  const jsReplace = js.replace(/(?<=INNER_HTML[^`]*)`[^`]*`/, '`' + html + '`').replace(/(?<=INNER_CSS[^`]*)`[^`]*`/, '`' + css + '`')
  if (code !== jsReplace) {
    GM_setValue('code', jsReplace)
    location.reload()
  }
}

setInterval(loop, 3000)

const code = GM_getValue('code')

if (code) {
  eval(code)
}