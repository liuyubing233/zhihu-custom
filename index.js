// ==UserScript==
// @name         知乎样式自定义
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  知乎样式自定义-
// @author       super puffer fish
// @match         *://www.zhihu.com/*
// @match         *://zhuanlan.zhihu.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// ==/UserScript==

(function () {
  'use strict'

  let pfConfig = {
    versionHeart: 800, // 版心
  }

  // 页面注入html和css
  function initHtml () {
    const htmlModal = $(`<div style="display: none;" class="pf-mark"><div class="pf-modal-bg"><div class="pf-modal"><div class="pf-modal-content"><ul class="pf-left"><li>基础设置</li><li>返回内容设置</li></ul><div class="pf-right"><input type="number" class="pf-input" name="versionHeart" id="c-versionHeart" /></div></div><button class="pf-b-close">关 闭</button></div></div></div>`)

    const cssOwn = '<style type="text/css">' +
      `body{width:100%;}.pf-mark{position:fixed;height:100%;width:100%;top:0;left:0;background:rgba(0,0,0,0.6);z-index:9999;overflow-y:auto;}.pf-modal-bg{position:relative;height:100%;width:100%;min-height:400px;}.pf-modal{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:400px;height:400px;background:#fff;z-index:99999;padding:12px;}.pf-modal-content{display:flex;height:300px;width:100%;}.pf-left{width:200px;border-right:1px solid #eee;}.pf-right{flex:1;}`
      + '</style>'

    $('head').append(cssOwn)
    $('.AppHeader-userInfo').prepend('<i class="pf-open-modal">打</i>')
    $('body').append(htmlModal)

    $('.pf-open-modal')[0].onclick = () => {
      $('.pf-mark')[0].style.display = 'block'
      stopScroll()
    }

    $('.pf-b-close')[0].onclick = () => {
      $('.pf-mark')[0].style.display = 'none'
      recoverScroll()
    }

  }
  initHtml()

  // 获取数据
  function initData () {
    const config = localStorage.getItem('pfConfig')
    const nConfig = config ? JSON.parse(config) : {}
    pfConfig = {
      ...pfConfig,
      ...nConfig,
    }

    for (let even of $('.pf-input')) {
      console.log(even)
      console.log(even.id, even.name)
      even.value = pfConfig[even.name]
    }


    $('.pf-right')[0].onchange = (event) => {
      console.log(event.target.value, event.target.name, '???')
    }
  }
  initData()

  // 修改配置
  function changeConfig (name, value) {
    pfConfig[name] = value
    localStorage.setItem('pfConfig', JSON.stringify(pfConfig))
  }

  // 节流
  function throttle (fn, timeout = 300) {
    let canRun = true
    return function () {
      if (!canRun) return
      canRun = false
      setTimeout(() => {
        fn.apply(this, arguments)
        canRun = true
      }, timeout)
    }
  }

  // 展示弹窗时，阻止背景滚动
  function stopScroll () {
    let top = document.body.scrollTop || document.documentElement.scrollTop
    document.body.style.position = 'fixed'
    document.body.style.top = `${-1 * top}px`
  }
  // 隐藏弹窗时，恢复背景的滚动
  function recoverScroll () {
    let top = -parseInt(document.body.style.top)
    document.body.style.position = 'static'
    document.body.style.top = 0
    window.scrollTo(0, top)
  }

})()