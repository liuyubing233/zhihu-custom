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
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// ==/UserScript==

(function () {
  'use strict'

  let pfConfig = {
    versionHeart: '1000', // version heart
    positionAnswer: 'right',
    positionAnswerIndex: '1', // priority
    positionCreation: 'right',
    positionCreationIndex: '2',
    positionTable: 'right',
    positionTableIndex: '3',
    positionFavorites: 'right',
    positionFavoritesIndex: '4',
    positionFooter: 'right',
    positionFooterIndex: '5',
    stickyLeft: false, // left dom is sticky
    stickyRight: false, // right dom is sticky
    zoomAnswerImage: 'default', // zoom answer and special column image size
    hiddenAnswerRightFooter: false, // answer page is hidden right footer
  }

  let positionDoms = {} // cache dom for position
  let firstInitDoms = true // is first init for position
  let timeoutToFindCreator = null // timeout to find creator dom

  // init html and css, init config
  function initHtml () {
    const dom = function (p, a, c, k, e, r) { e = function (c) { return (c < 62 ? '' : e(parseInt(c / 62))) + ((c = c % 62) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if ('0'.replace(0, e) == 0) { while (c--) r[e(c)] = k[c]; k = [function (e) { return r[e] || e }]; e = function () { return '[06-9c-zA-R]' }; c = 1 }; while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]); return p }('<9 style="display: none;"8="7-mark"><9 8="7-v-bg"><9 8="7-v"><9 8="7-v-w"><H 8="7-i"><j><a x="#7-h-I">基础设置</a></j><j><a x="#7-h-t">配置导出导入</a></j><!--<j><a x="#7-h-J-w">返回内容设置</a></j>--></H><9 8="7-k"><9 y="7-h-I"><u>基础设置</u><9 8="7-h-heart 7-c-9">版心大小<0><6 8="7-6"d="z"e="c"f="K"/>K</0><0><6 8="7-6"d="z"e="c"f="L"/>L</0><0><6 8="7-6"d="z"e="c"f="M"/>M</0></9><9 8="7-c-9">回答问题栏位置<0><6 8="7-6"d="A"e="c"f="i"/>左侧</0><0><6 8="7-6"d="A"e="c"f="k"/>右侧</0><0><6 8="7-6"d="A"e="c"f="l"/>隐藏</0></9><9 8="7-c-9">回答问题栏优先级<0><6 8="7-6"d="n"e="c"f="1"/>1</0><0><6 8="7-6"d="n"e="c"f="2"/>2</0><0><6 8="7-6"d="n"e="c"f="3"/>3</0><0><6 8="7-6"d="n"e="c"f="4"/>4</0><0><6 8="7-6"d="n"e="c"f="5"/>5</0></9><9 8="7-c-9">创作中心位置<0><6 8="7-6"d="B"e="c"f="i"/>左侧</0><0><6 8="7-6"d="B"e="c"f="k"/>右侧</0><0><6 8="7-6"d="B"e="c"f="l"/>隐藏</0></9><9 8="7-c-9">创作中心优先级<0><6 8="7-6"d="o"e="c"f="1"/>1</0><0><6 8="7-6"d="o"e="c"f="2"/>2</0><0><6 8="7-6"d="o"e="c"f="3"/>3</0><0><6 8="7-6"d="o"e="c"f="4"/>4</0><0><6 8="7-6"d="o"e="c"f="5"/>5</0></9><9 8="7-c-9">圆桌模块位置<0><6 8="7-6"d="C"e="c"f="i"/>左侧</0><0><6 8="7-6"d="C"e="c"f="k"/>右侧</0><0><6 8="7-6"d="C"e="c"f="l"/>隐藏</0></9><9 8="7-c-9">圆桌模块优先级<0><6 8="7-6"d="p"e="c"f="1"/>1</0><0><6 8="7-6"d="p"e="c"f="2"/>2</0><0><6 8="7-6"d="p"e="c"f="3"/>3</0><0><6 8="7-6"d="p"e="c"f="4"/>4</0><0><6 8="7-6"d="p"e="c"f="5"/>5</0></9><9 8="7-c-9">收藏夹栏位置<0><6 8="7-6"d="D"e="c"f="i"/>左侧</0><0><6 8="7-6"d="D"e="c"f="k"/>右侧</0><0><6 8="7-6"d="D"e="c"f="l"/>隐藏</0></9><9 8="7-c-9">收藏夹栏优先级<0><6 8="7-6"d="q"e="c"f="1"/>1</0><0><6 8="7-6"d="q"e="c"f="2"/>2</0><0><6 8="7-6"d="q"e="c"f="3"/>3</0><0><6 8="7-6"d="q"e="c"f="4"/>4</0><0><6 8="7-6"d="q"e="c"f="5"/>5</0></9><9 8="7-c-9">指南N位置<0><6 8="7-6"d="E"e="c"f="i"/>左侧</0><0><6 8="7-6"d="E"e="c"f="k"/>右侧</0><0><6 8="7-6"d="E"e="c"f="l"/>隐藏</0></9><9 8="7-c-9">指南N优先级<0><6 8="7-6"d="r"e="c"f="1"/>1</0><0><6 8="7-6"d="r"e="c"f="2"/>2</0><0><6 8="7-6"d="r"e="c"f="3"/>3</0><0><6 8="7-6"d="r"e="c"f="4"/>4</0><0><6 8="7-6"d="r"e="c"f="5"/>5</0></9><9 8="7-m-9"><0>左侧栏是否固定<6 8="7-6"d="stickyLeft"e="m"f="F"/></0></9><9 8="7-m-9"><0>右侧栏是否固定<6 8="7-6"d="stickyRight"e="m"f="F"/></0></9><9 8="7-raido-9">回答和专栏图片缩放<0><6 8="7-6"d="s"e="c"f="l"/>隐藏</0><0><6 8="7-6"d="s"e="c"f="O"/>极小(O)</0><0><6 8="7-6"d="s"e="c"f="P"/>小(P)</0><0><6 8="7-6"d="s"e="c"f="Q"/>中(Q)</0><0><6 8="7-6"d="s"e="c"f="default"/>默认</0></9><9 8="7-m-9"><0>回答页面右侧信息隐藏<6 8="7-6"d="hiddenAnswerRightFooter"e="m"f="F"/></0></9></9><!--<9 y="7-h-J-w"></9>--><9 y="7-h-t"><u>配置导出导入</u><g 8="7-export-t 7-g">导出当前配置</g><9 8="7-R-dom"><G 8="7-G"d="configImport"></G><g 8="7-R-t 7-g">导入</g></9></9></9></9><g 8="7-b-close 7-g">关闭</g></9></9></9>', [], 54, 'label||||||input|pf|class|div|||radio|name|type|value|button|set|left|li|right|hidden|checkbox|positionAnswerIndex|positionCreationIndex|positionTableIndex|positionFavoritesIndex|positionFooterIndex|zoomAnswerImage|config|h4|modal|content|href|id|versionHeart|positionAnswer|positionCreation|positionTable|positionFavorites|positionFooter|on|textarea|ul|basis|back|1000|1200|1500|Footer|100px|200px|400px|import'.split('|'), 0, {})

    const htmlModal = $(dom)
    const cssOwn = '<style type="text/css" id="pf-css-own">' +
      `body{width:100%;}.pf-mark{position:fixed;height:100%;width:100%;top:0;left:0;background:rgba(0,0,0,0.6);z-index:9999;overflow-y:auto;}.pf-modal-bg{position:relative;height:100%;width:100%;min-height:400px;}.pf-modal{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:400px;background:#fff;z-index:99999;padding:12px;}.pf-modal-content{display:flex;height:360px;width:100%;}.pf-left{width:100px;border-right:1px solid #eee;list-style:none;margin:0px;padding:0;}.pf-right{flex:1;overflow-y:auto;}.GlobalSideBar-navList{margin-bottom:10px;background:#fff;overflow:hidden;border-radius:2px;box-shadow:0 1px 3px rgb(18 18 18 / 10%);box-sizing:border-box;}.pf-button{appearance:auto;-webkit-writing-mode:horizontal-tb !important;text-rendering:auto !important;color:-internal-light-dark(black,white) !important;letter-spacing:normal !important;word-spacing:normal !important;text-transform:none !important;text-indent:0px !important;text-shadow:none !important;display:inline-block !important;text-align:center !important;align-items:flex-start !important;cursor:default !important;background-color:-internal-light-dark(rgb(239,239,239),rgb(59,59,59)) !important;box-sizing:border-box !important;margin:0em !important;font:400 13.3333px Arial !important;padding:1px 6px !important;border-width:2px !important;border-style:outset !important;border-color:-internal-light-dark(rgb(118,118,118),rgb(133,133,133)) !important;border-image:initial !important;border-radius:2px !important;}.Question-main .Question-mainColumn,.ListShortcut{flex:1;width: 100%;}`
      + '</style>'

    $('head').append(cssOwn)

    const openButton = '<i class="pf-open-modal">打</i>'
    $('.AppHeader-userInfo').prepend(openButton)
    $('.ColumnPageHeader-Button').prepend(openButton)
    $('body').append(htmlModal)

    $('.pf-open-modal')[0].onclick = buttonModalShow
    $('.pf-b-close')[0].onclick = buttonModalHidden
    $('.pf-export-config')[0].onclick = buttonExportConfig
    $('.pf-import-config')[0].onclick = buttonImportConfig

    // add left box at home page
    $('.Topstory-container').prepend('<div class="pf-left-container" style="display: none; flex: 1; margin-right: 10px;"><div class="Sticky"></div></div>')
  }
  initHtml()

  // hidden modal
  function buttonModalHidden () {
    $('.pf-mark')[0].style.display = 'none'
    recoverScroll()
  }

  // show modal
  function buttonModalShow () {
    $('.pf-mark')[0].style.display = 'block'
    stopScroll()
  }

  // export config
  function buttonExportConfig () {
    const url = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(localStorage.getItem('pfConfig'))
    let link = document.createElement('a')
    link.href = url
    link.download = '配置.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // import config
  function buttonImportConfig () {
    const configImport = $('[name=configImport]')[0].value
    const config = JSON.parse(configImport)
    pfConfig = {
      ...pfConfig,
      ...config,
    }
    localStorage.setItem('pfConfig', JSON.stringify(pfConfig))
    initData()
  }

  // init data
  function initData () {
    const config = localStorage.getItem('pfConfig')
    const nConfig = config ? JSON.parse(config) : {}
    pfConfig = {
      ...pfConfig,
      ...nConfig,
    }
    changeVersion()

    for (let even of $('.pf-input')) {
      // console.log(even.id, even.name)
      // even.value = pfConfig[even.name]
      switch (even.type) {
        case 'radio':
          if (pfConfig[even.name] && even.value === pfConfig[even.name]) {
            even.checked = true
          }
          break
      }
      even.onchange = (e) => {
        switch (e.target.type) {
          case 'checkbox':
            throttle(changeConfigByCheckbox(e.target), 300)
            break
          case 'radio':
            throttle(changeConfig(e.target), 300)
            break
        }
      }
    }

    initPositionPage()
    // proxyServer()
  }
  initData()

  // change config by checkbox
  function changeConfigByCheckbox (ev) {
    const { name, checked } = ev
    pfConfig[name] = checked
    localStorage.setItem('pfConfig', JSON.stringify(pfConfig))
    const changerObj = {
      'stickyLeft': () => stickyBetween(),
      'stickyRight': () => stickyBetween(),
      'hiddenAnswerRightFooter': () => changeVersion(),
    }
    changerObj[name] && changerObj[name]()
  }

  // change config default (by radio, text)
  function changeConfig (ev) {
    const { name, value } = ev
    pfConfig[name] = value
    localStorage.setItem('pfConfig', JSON.stringify(pfConfig))
    const changerObj = {
      'versionHeart': () => changeVersion(),
      'zoomAnswerImage': () => changeVersion()
      // 'stickyLeft': () => stickyBetween(),
      // 'stickyRight': () => stickyBetween(),
    }
    if (/^position/.test(name)) {
      initPositionPage()
    } else {
      changerObj[name] && changerObj[name]()
    }
  }

  // // zoom image
  // function zoomImage (name) {
  //   if (name === 'zoomAnswerImage') {
  //     changeVersion()
  //   }
  // }

  // init between box
  function initPositionPage () {
    if (firstInitDoms) {
      timeoutToFindCreator = setTimeout(() => {
        clearTimeout(timeoutToFindCreator)
        // have creator box
        if ($('.GlobalSideBar-creator').length) {
          firstInitDoms = false
          positionDoms = {
            positionAnswer: { class: 'GlobalWrite', even: $('.GlobalWrite') },
            positionCreation: { class: 'CreatorEntrance', even: $('.GlobalSideBar-creator') },
            positionTable: { class: 'GlobalSideBar-category', even: $('.GlobalSideBar-category') },
            positionFavorites: { class: 'GlobalSideBar-navList', even: $('.GlobalSideBar-navList') },
            positionFooter: { class: 'Footer', even: $('.Footer') },
          }
        }
        initPositionPage()
      }, 100)
      return
    }
    // clean between box
    $('.pf-left-container .Sticky').empty()
    $('.GlobalSideBar .Sticky').empty()
    const leftDom = []
    const rightDom = []
    // append dom
    Object.keys(positionDoms).forEach((key) => {
      const e = { even: positionDoms[key].even, index: Number(pfConfig[`${key}Index`]) }
      if (pfConfig[key] === 'left') {
        leftDom.push(e)
      } else if (pfConfig[key] === 'right') {
        rightDom.push(e)
      }
    })
    leftDom.sort((a, b) => a.index - b.index)
    rightDom.sort((a, b) => a.index - b.index)
    leftDom.forEach(({ even }) => { $('.pf-left-container .Sticky').append(even) })
    rightDom.forEach(({ even }) => { $('.GlobalSideBar .Sticky').append(even) })
    // detect between box is have children
    $('.pf-left-container')[0].style.display = $('.pf-left-container .Sticky').children().length > 0 ? 'block' : 'none'
    $('.GlobalSideBar')[0].style.display = $('.GlobalSideBar .Sticky').children().length > 0 ? 'block' : 'none'
  }

  // change version
  function changeVersion () {
    // the width about question main
    const qMByVersionHeart = {
      '1000': '694px',
      '1200': '894px',
      '1500': '1194px',
    }

    const cssVersion = '<style type="text/css" id="pf-css-version">' +
      `.QuestionHeader .QuestionHeader-content,.QuestionHeader-footer .QuestionHeader-footer-inner,.QuestionHeader-content,.Question-main,.AppHeader-inner,.TopstoryPageHeader,.Topstory-container,.ExploreHomePage,.QuestionWaiting,.SearchTabs-inner,.Search-container,.ProfileHeader,.Profile-main,.CollectionsDetailPage,.ColumnPageHeader-content,.QuestionPage .RichContent .ContentItem-actions.is-fixed,.SettingsMain,.App-main .Creator,.Collections-container,.Balance-Layout{width:${pfConfig.versionHeart}px!important;}img.lazy{${pfConfig.zoomAnswerImage !== 'default' ? pfConfig.zoomAnswerImage === 'hidden' ? 'display: none!important;' : 'width:' + pfConfig.zoomAnswerImage + '!important' : ''}}.QuestionHeader-main,.QuestionWaiting-mainColumn,.SearchMain,.Profile-mainColumn,.CollectionsDetailPage-mainColumn,.Collections-mainColumn,.Balance-Main{width:${qMByVersionHeart[pfConfig.versionHeart]}!important;margin-right:0!important;}.Question-sideColumn{display: ${pfConfig.hiddenAnswerRightFooter ? 'none' : 'block'}}`
      + '</style>'

    $('#pf-css-version') && $('#pf-css-version').remove()
    $('body').append(cssVersion)
  }

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

  // prevent background scroll when show modal
  function stopScroll () {
    let top = document.body.scrollTop || document.documentElement.scrollTop
    document.body.style.position = 'fixed'
    document.body.style.top = `${-1 * top}px`
  }
  // restore background scroll when hidden modal
  function recoverScroll () {
    let top = -parseInt(document.body.style.top)
    document.body.style.position = 'static'
    document.body.style.top = 0
    window.scrollTo(0, top)
  }

  window.onscroll = scrollStyle
  function scrollStyle (e) {
    stickyBetween()
  }

  function stickyBetween () {
    window.scrollY > 0 ? throttle(fixedPosition()) : throttle(inheritPosition())
  }

  function fixedPosition () {
    if (pfConfig.stickyLeft && $('.pf-left-container')[0]) {
      $('.pf-left-container .Sticky').css({
        width: $('.pf-left-container')[0].offsetWidth,
        position: 'fixed',
        left: $('.pf-left-container')[0].offsetLeft,
        top: $('.pf-left-container')[0].offsetTop,
      })
    } else {
      $('.pf-left-container .Sticky').removeAttr('style', '')
    }
    if (pfConfig.stickyRight && $('.GlobalSideBar')[0]) {
      $('.GlobalSideBar .Sticky').css({
        width: $('.GlobalSideBar')[0].offsetWidth,
        position: 'fixed',
        right: $('.GlobalSideBar')[0].offsetRight,
        top: $('.GlobalSideBar')[0].offsetTop,
      })
    } else {
      $('.GlobalSideBar .Sticky').removeAttr('style', '')
      $('.GlobalSideBar .Sticky')[0] && ($('.GlobalSideBar .Sticky')[0].style = 'position: inherit!important')
    }
  }

  function inheritPosition () {
    $('.pf-left-container .Sticky').removeAttr('style', '')
    $('.GlobalSideBar .Sticky').removeAttr('style', '')
    $('.GlobalSideBar .Sticky')[0] && ($('.GlobalSideBar .Sticky')[0].style = 'position: inherit!important')
  }

  // // proxy server and filter content
  // function proxyServer () {
  //   ah.proxy({
  //     //请求发起前进入
  //     onRequest: (config, handler) => {
  //       console.log(config.url)
  //       handler.next(config)
  //     },
  //     //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
  //     onError: (err, handler) => {
  //       console.log(err.type)
  //       handler.next(err)
  //     },
  //     //请求成功后进入
  //     onResponse: (response, handler) => {
  //       console.log(response.response)
  //       handler.next(response)
  //     }
  //   })
  // }

})()