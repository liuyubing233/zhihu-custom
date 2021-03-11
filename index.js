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
  }

  let positionDoms = {} // cache dom for position
  let firstInitDoms = true // is first init for position
  let timeoutToFindCreator = null // timeout to find creator dom

  // init html and css, init config
  function initHtml () {
    const dom = function (p, a, c, k, e, r) { e = function (c) { return (c < 62 ? '' : e(parseInt(c / 62))) + ((c = c % 62) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if ('0'.replace(0, e) == 0) { while (c--) r[e(c)] = k[c]; k = [function (e) { return r[e] || e }]; e = function () { return '[06-9ac-zA-D]' }; c = 1 }; while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]); return p }('<a style="display: none;"8="7-mark"><a 8="7-p-bg"><a 8="7-p"><a 8="7-p-content"><w 8="7-f"><n>基础设置</n><n>返回内容设置</n></w><a 8="7-g"><a id="7-x-basis"><a 8="7-x-heart 7-9-a">版心大小<0><6 8="7-6"c="q"d="9"e="y"/>y</0><0><6 8="7-6"c="q"d="9"e="z"/>z</0><0><6 8="7-6"c="q"d="9"e="A"/>A</0></a><a 8="7-9-a">回答问题栏位置<0><6 8="7-6"c="r"d="9"e="f"/>左侧</0><0><6 8="7-6"c="r"d="9"e="g"/>右侧</0><0><6 8="7-6"c="r"d="9"e="h"/>隐藏</0></a><a 8="7-9-a">回答问题栏优先级<0><6 8="7-6"c="i"d="9"e="1"/>1</0><0><6 8="7-6"c="i"d="9"e="2"/>2</0><0><6 8="7-6"c="i"d="9"e="3"/>3</0><0><6 8="7-6"c="i"d="9"e="4"/>4</0><0><6 8="7-6"c="i"d="9"e="5"/>5</0></a><a 8="7-9-a">创作中心位置<0><6 8="7-6"c="s"d="9"e="f"/>左侧</0><0><6 8="7-6"c="s"d="9"e="g"/>右侧</0><0><6 8="7-6"c="s"d="9"e="h"/>隐藏</0></a><a 8="7-9-a">创作中心优先级<0><6 8="7-6"c="j"d="9"e="1"/>1</0><0><6 8="7-6"c="j"d="9"e="2"/>2</0><0><6 8="7-6"c="j"d="9"e="3"/>3</0><0><6 8="7-6"c="j"d="9"e="4"/>4</0><0><6 8="7-6"c="j"d="9"e="5"/>5</0></a><a 8="7-9-a">圆桌模块位置<0><6 8="7-6"c="t"d="9"e="f"/>左侧</0><0><6 8="7-6"c="t"d="9"e="g"/>右侧</0><0><6 8="7-6"c="t"d="9"e="h"/>隐藏</0></a><a 8="7-9-a">圆桌模块优先级<0><6 8="7-6"c="k"d="9"e="1"/>1</0><0><6 8="7-6"c="k"d="9"e="2"/>2</0><0><6 8="7-6"c="k"d="9"e="3"/>3</0><0><6 8="7-6"c="k"d="9"e="4"/>4</0><0><6 8="7-6"c="k"d="9"e="5"/>5</0></a><a 8="7-9-a">收藏夹栏位置<0><6 8="7-6"c="u"d="9"e="f"/>左侧</0><0><6 8="7-6"c="u"d="9"e="g"/>右侧</0><0><6 8="7-6"c="u"d="9"e="h"/>隐藏</0></a><a 8="7-9-a">收藏夹栏优先级<0><6 8="7-6"c="l"d="9"e="1"/>1</0><0><6 8="7-6"c="l"d="9"e="2"/>2</0><0><6 8="7-6"c="l"d="9"e="3"/>3</0><0><6 8="7-6"c="l"d="9"e="4"/>4</0><0><6 8="7-6"c="l"d="9"e="5"/>5</0></a><a 8="7-9-a">指南B位置<0><6 8="7-6"c="v"d="9"e="f"/>左侧</0><0><6 8="7-6"c="v"d="9"e="g"/>右侧</0><0><6 8="7-6"c="v"d="9"e="h"/>隐藏</0></a><a 8="7-9-a">指南B优先级<0><6 8="7-6"c="m"d="9"e="1"/>1</0><0><6 8="7-6"c="m"d="9"e="2"/>2</0><0><6 8="7-6"c="m"d="9"e="3"/>3</0><0><6 8="7-6"c="m"d="9"e="4"/>4</0><0><6 8="7-6"c="m"d="9"e="5"/>5</0></a><a 8="7-o-a"><0>左侧栏是否固定<6 8="7-6"c="stickyLeft"d="o"e="C"/></0></a><a 8="7-o-a"><0>右侧栏是否固定<6 8="7-6"c="stickyRight"d="o"e="C"/></0></a></a></a></a><D 8="7-b-close">关闭</D></a></a></a>', [], 40, 'label||||||input|pf|class|radio|div||name|type|value|left|right|hidden|positionAnswerIndex|positionCreationIndex|positionTableIndex|positionFavoritesIndex|positionFooterIndex|li|checkbox|modal|versionHeart|positionAnswer|positionCreation|positionTable|positionFavorites|positionFooter|ul|set|1000|1200|1500|Footer|on|button'.split('|'), 0, {})

    const htmlModal = $(dom)
    const cssOwn = '<style type="text/css" id="pf-css-own">' +
      `body{width:100%;}.pf-mark{position:fixed;height:100%;width:100%;top:0;left:0;background:rgba(0,0,0,0.6);z-index:9999;overflow-y:auto;}.pf-modal-bg{position:relative;height:100%;width:100%;min-height:400px;}.pf-modal{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:400px;background:#fff;z-index:99999;padding:12px;}.pf-modal-content{display:flex;height:300px;width:100%;}.pf-left{width:100px;border-right:1px solid #eee;list-style:none;margin:0px;padding:0;}.pf-right{flex:1;}.GlobalSideBar-navList{margin-bottom:10px;background:#fff;overflow:hidden;border-radius:2px;box-shadow:0 1px 3px rgb(18 18 18 / 10%);box-sizing:border-box;}`
      + '</style>'

    $('head').append(cssOwn)
    $('.AppHeader-userInfo').prepend('<i class="pf-open-modal">打</i>')
    $('body').append(htmlModal)

    $('.pf-open-modal')[0].onclick = modalShow
    $('.pf-b-close')[0].onclick = modalHidden

    // add left box at home page
    $('.Topstory-container').prepend('<div class="pf-left-container" style="display: none; flex: 1; margin-right: 10px;"><div class="Sticky"></div></div>')
  }
  initHtml()

  // hidden modal
  function modalHidden () {
    $('.pf-mark')[0].style.display = 'none'
    recoverScroll()
  }

  // show modal
  function modalShow () {
    $('.pf-mark')[0].style.display = 'block'
    stopScroll()
  }

  // init data
  function initData () {
    const config = localStorage.getItem('pfConfig')
    const nConfig = config ? JSON.parse(config) : {}
    pfConfig = {
      ...pfConfig,
      ...nConfig,
    }
    changeVersion(pfConfig.versionHeart)

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
      // 'stickyLeft': () => stickyBetween(),
      // 'stickyRight': () => stickyBetween(),
    }
    if (/^position/.test(name)) {
      initPositionPage()
    } else {
      changerObj[name] && changerObj[name]()
    }
  }

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
    // 添加元素
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
    const cssVersion = '<style type="text/css" id="pf-css-version">' +
      `.QuestionHeader .QuestionHeader-content,.QuestionHeader-footer .QuestionHeader-footer-inner,.QuestionHeader-content,.Question-main,.AppHeader-inner,.TopstoryPageHeader,.Topstory-container,.ExploreHomePage,.QuestionWaiting,.SearchTabs-inner,.Search-container,.ProfileHeader,.Profile-main,.CollectionsDetailPage,.Question-main .Question-mainColumn,.ColumnPageHeader-content,.QuestionPage .RichContent .ContentItem-actions.is-fixed,.SettingsMain,.App-main .Creator,.Collections-container,.Balance-Layout{width:${pfConfig.versionHeart}px!important;}`
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
    if (pfConfig.stickyLeft) {
      $('.pf-left-container .Sticky').css({
        width: $('.pf-left-container')[0].offsetWidth,
        position: 'fixed',
        left: $('.pf-left-container')[0].offsetLeft,
        top: $('.pf-left-container')[0].offsetTop,
      })
    } else {
      $('.pf-left-container .Sticky').removeAttr('style', '')
    }
    if (pfConfig.stickyRight) {
      $('.GlobalSideBar .Sticky').css({
        width: $('.GlobalSideBar')[0].offsetWidth,
        position: 'fixed',
        right: $('.GlobalSideBar')[0].offsetRight,
        top: $('.GlobalSideBar')[0].offsetTop,
      })
    } else {
      $('.GlobalSideBar .Sticky').removeAttr('style', '')
    }
  }

  function inheritPosition () {
    $('.pf-left-container .Sticky').removeAttr('style', '')
    $('.GlobalSideBar .Sticky').removeAttr('style', '')
  }

})()