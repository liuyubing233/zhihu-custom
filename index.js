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
    versionHeart: '1000', // 版心
    positionAnswer: 'right', // 回答问题栏位置
    positionAnswerIndex: '1', // 优先级
    positionCreation: 'right', // 创作中心位置
    positionCreationIndex: '2',
    positionTable: 'right', // 圆桌模块位置
    positionTableIndex: '3',
    positionFavorites: 'right', // 收藏夹栏位置
    positionFavoritesIndex: '4',
    positionFooter: 'right', // 指南Footer位置
    positionFooterIndex: '5',
  }

  // 缓存页面元素
  const positionDoms = {
    positionAnswer: { class: 'GlobalWrite', even: $('.GlobalWrite') }, // 回答问题栏
    positionCreation: { class: 'CreatorEntrance', even: $('.GlobalSideBar-creator') }, // 创作中心
    positionTable: { class: 'GlobalSideBar-category', even: $('.GlobalSideBar-category') }, // 圆桌模块
    positionFavorites: { class: 'GlobalSideBar-navList', even: $('.GlobalSideBar-navList') }, // 收藏夹栏
    positionFooter: { class: 'Footer', even: $('.Footer') }, // 指南Footer
  }
  console.log($('.GlobalSideBar-creator'))

  const GlobalWrite = $('.GlobalWrite') // 缓存页面元素 --- 回答问题栏
  const CreatorEntrance = $('.CreatorEntrance') // 缓存页面元素 --- 创作中心
  const GlobalSideBarCategory = $('.GlobalSideBar-category') // 缓存页面元素 --- 圆桌模块
  const GlobalSideBarNavList = $('.GlobalSideBar-navList').parent() // 缓存页面元素 --- 收藏夹栏
  const Footer = $('.Footer') // 缓存页面元素 --- 指南Footer

  // 页面注入html和css 初始化页面配置
  function initHtml () {
    const dom = function (p, a, c, k, e, r) { e = function (c) { return (c < 62 ? '' : e(parseInt(c / 62))) + ((c = c % 62) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if ('0'.replace(0, e) == 0) { while (c--) r[e(c)] = k[c]; k = [function (e) { return r[e] || e }]; e = function () { return '[06-9ac-zA-D]' }; c = 1 }; while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]); return p }('<a style="display: none;"8="7-mark"><a 8="7-r-bg"><a 8="7-r"><a 8="7-r-content"><y 8="7-h"><q>基础设置</q><q>返回内容设置</q></y><a 8="7-i"><a id="7-f-basis"><a 8="7-f-heart 7-9-a">版心大小<0><6 8="7-6"c="s"d="9"e="z"/>z</0><0><6 8="7-6"c="s"d="9"e="A"/>A</0><0><6 8="7-6"c="s"d="9"e="B"/>B</0></a><a 8="7-f-g-j 7-9-a">回答问题栏位置<0><6 8="7-6"c="t"d="9"e="h"/>左侧</0><0><6 8="7-6"c="t"d="9"e="i"/>右侧</0><0><6 8="7-6"c="t"d="9"e="k"/>隐藏</0></a><a 8="7-f-g-j 7-9-a">回答问题栏优先级<0><6 8="7-6"c="l"d="9"e="1"/>1</0><0><6 8="7-6"c="l"d="9"e="2"/>2</0><0><6 8="7-6"c="l"d="9"e="3"/>3</0><0><6 8="7-6"c="l"d="9"e="4"/>4</0><0><6 8="7-6"c="l"d="9"e="5"/>5</0></a><a 8="7-f-g-creation 7-9-a">创作中心位置<0><6 8="7-6"c="u"d="9"e="h"/>左侧</0><0><6 8="7-6"c="u"d="9"e="i"/>右侧</0><0><6 8="7-6"c="u"d="9"e="k"/>隐藏</0></a><a 8="7-f-g-j 7-9-a">创作中心优先级<0><6 8="7-6"c="m"d="9"e="1"/>1</0><0><6 8="7-6"c="m"d="9"e="2"/>2</0><0><6 8="7-6"c="m"d="9"e="3"/>3</0><0><6 8="7-6"c="m"d="9"e="4"/>4</0><0><6 8="7-6"c="m"d="9"e="5"/>5</0></a><a 8="7-f-g-table 7-9-a">圆桌模块位置<0><6 8="7-6"c="v"d="9"e="h"/>左侧</0><0><6 8="7-6"c="v"d="9"e="i"/>右侧</0><0><6 8="7-6"c="v"d="9"e="k"/>隐藏</0></a><a 8="7-f-g-j 7-9-a">圆桌模块优先级<0><6 8="7-6"c="n"d="9"e="1"/>1</0><0><6 8="7-6"c="n"d="9"e="2"/>2</0><0><6 8="7-6"c="n"d="9"e="3"/>3</0><0><6 8="7-6"c="n"d="9"e="4"/>4</0><0><6 8="7-6"c="n"d="9"e="5"/>5</0></a><a 8="7-f-g-favorites 7-9-a">收藏夹栏位置<0><6 8="7-6"c="w"d="9"e="h"/>左侧</0><0><6 8="7-6"c="w"d="9"e="i"/>右侧</0><0><6 8="7-6"c="w"d="9"e="k"/>隐藏</0></a><a 8="7-f-g-j 7-9-a">收藏夹栏优先级<0><6 8="7-6"c="o"d="9"e="1"/>1</0><0><6 8="7-6"c="o"d="9"e="2"/>2</0><0><6 8="7-6"c="o"d="9"e="3"/>3</0><0><6 8="7-6"c="o"d="9"e="4"/>4</0><0><6 8="7-6"c="o"d="9"e="5"/>5</0></a><a 8="7-f-g-footer 7-9-a">指南C位置<0><6 8="7-6"c="x"d="9"e="h"/>左侧</0><0><6 8="7-6"c="x"d="9"e="i"/>右侧</0><0><6 8="7-6"c="x"d="9"e="k"/>隐藏</0></a><a 8="7-f-g-j 7-9-a">指南C优先级<0><6 8="7-6"c="p"d="9"e="1"/>1</0><0><6 8="7-6"c="p"d="9"e="2"/>2</0><0><6 8="7-6"c="p"d="9"e="3"/>3</0><0><6 8="7-6"c="p"d="9"e="4"/>4</0><0><6 8="7-6"c="p"d="9"e="5"/>5</0></a></a></a></a><D 8="7-b-close">关闭</D></a></a></a>', [], 40, 'label||||||input|pf|class|radio|div||name|type|value|set|position|left|right|answer|hidden|positionAnswerIndex|positionCreationIndex|positionTableIndex|positionFavoritesIndex|positionFooterIndex|li|modal|versionHeart|positionAnswer|positionCreation|positionTable|positionFavorites|positionFooter|ul|1000|1200|1500|Footer|button'.split('|'), 0, {})

    const htmlModal = $(dom)
    const cssOwn = '<style type="text/css" id="pf-css-own">' +
      `body{width:100%;}.pf-mark{position:fixed;height:100%;width:100%;top:0;left:0;background:rgba(0,0,0,0.6);z-index:9999;overflow-y:auto;}.pf-modal-bg{position:relative;height:100%;width:100%;min-height:400px;}.pf-modal{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:400px;background:#fff;z-index:99999;padding:12px;}.pf-modal-content{display:flex;height:300px;width:100%;}.pf-left{width:100px;border-right:1px solid #eee;list-style:none;margin:0px;padding:0;}.pf-right{flex:1;}.GlobalSideBar-navList{margin-bottom:10px;background:#fff;overflow:hidden;border-radius:2px;box-shadow:0 1px 3px rgb(18 18 18 / 10%);box-sizing:border-box;}`
      + '</style>'

    $('head').append(cssOwn)
    $('.AppHeader-userInfo').prepend('<i class="pf-open-modal">打</i>')
    $('body').append(htmlModal)

    $('.pf-open-modal')[0].onclick = modalShow
    $('.pf-b-close')[0].onclick = modalHidden

    // 主页左侧添加隐藏栏
    $('.Topstory-container').prepend('<div class="pf-left-container" style="display: none; flex: 1; margin-right: 10px;"></div>')
  }
  initHtml()

  // 隐藏弹窗
  function modalHidden () {
    $('.pf-mark')[0].style.display = 'none'
    recoverScroll()
  }

  // 显示弹窗
  function modalShow () {
    $('.pf-mark')[0].style.display = 'block'
    stopScroll()
  }

  // 初始化数据
  function initData () {
    const config = localStorage.getItem('pfConfig')
    const nConfig = config ? JSON.parse(config) : {}
    pfConfig = {
      ...pfConfig,
      ...nConfig,
    }
    changeVersion(pfConfig.versionHeart)
    // changePositionCon('GlobalWrite', pfConfig.positionAnswer, pfConfig.positionAnswerIndex)
    // changePositionCon('CreatorEntrance', pfConfig.positionCreation, pfConfig.positionCreationIndex)
    // changePositionCon('GlobalSideBar-category', pfConfig.positionTable, pfConfig.positionTableIndex)
    // changePositionCon('GlobalSideBar-navList', pfConfig.positionFavorites, pfConfig.positionFavoritesIndex)
    // changePositionCon('Footer', pfConfig.positionFooter, pfConfig.positionFooterIndex)

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
        const { name, value } = e.target
        // console.log(e.target.value, e.target.name, e, '??11?')
        throttle(changeConfig(name, value), 300)
      }
    }

    // $('.pf-right').click = (event) => {
    //   console.log(event.target.value, event.target.name, '???', event)
    // const changerObj = {
    //   'versionHeart': changeVersion
    // }
    // changerObj[event.target.name] && changerObj[event.target.name].call(this, event.target.value)
    // }

    // initPositionPage()
  }
  initData()

  // 初始化左右栏
  function initPositionPage () {
    // 清空左右栏
    $('.pf-left-container').empty()
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
    leftDom.forEach(({ even }) => {
      $('.pf-left-container').append(even)
    })
    console.log(rightDom)
    rightDom.forEach(({ even }) => {
      console.log(even, $('.GlobalSideBar .Sticky'))
      $('.GlobalSideBar .Sticky').append(even)
    })

    // 判断左右测盒子是否有子元素
    $('.pf-left-container')[0].style.display = $('.pf-left-container').children().length > 0 ? 'block' : 'none'
    $('.GlobalSideBar')[0].style.display = $('.GlobalSideBar .Sticky').children().length > 0 ? 'block' : 'none'
  }

  // 修改配置
  function changeConfig (name, value) {
    pfConfig[name] = value
    localStorage.setItem('pfConfig', JSON.stringify(pfConfig))
    const changerObj = {
      'versionHeart': () => changeVersion(),
      // 'positionAnswer': () => changePositionCon('GlobalWrite', pfConfig.positionAnswer, pfConfig.positionAnswerIndex),
      // 'positionCreation': () => changePositionCon('CreatorEntrance', pfConfig.positionCreation, pfConfig.positionCreationIndex),
      // 'positionTable': () => changePositionCon('GlobalSideBar-category', pfConfig.positionTable, pfConfig.positionTableIndex),
      // 'positionFavorites': () => changePositionCon('GlobalSideBar-navList', pfConfig.positionFavorites, pfConfig.positionFavoritesIndex),
      // 'positionFooter': () => changePositionCon('Footer', pfConfig.positionFooter, pfConfig.positionFooterIndex),
    }
    if (/^position/.test(name)) {
      // if (/Index$/.test(name)) {

      // } else {
      //   changePositionCon(name, pfConfig[name], pfConfig[`${name}Index`])
      // }
      initPositionPage()
    } else {
      changerObj[name] && changerObj[name]()
    }
  }

  // 版面修改
  function changeVersion () {
    const cssVersion = '<style type="text/css" id="pf-css-version">' +
      `.QuestionHeader .QuestionHeader-content,.QuestionHeader-footer .QuestionHeader-footer-inner,.QuestionHeader-content,.Question-main,.AppHeader-inner,.TopstoryPageHeader,.Topstory-container,.ExploreHomePage,.QuestionWaiting,.SearchTabs-inner,.Search-container,.ProfileHeader,.Profile-main,.CollectionsDetailPage,.Question-main .Question-mainColumn,.ColumnPageHeader-content,.QuestionPage .RichContent .ContentItem-actions.is-fixed,.SettingsMain,.App-main .Creator,.Collections-container,.Balance-Layout{width:${pfConfig.versionHeart}px!important;}`
      + '</style>'

    $('#pf-css-version') && $('#pf-css-version').remove()
    $('body').append(cssVersion)
  }

  // function changePosition (name) {
  //   // let nName = ''

  // }

  // 修改左右侧栏内容的位置
  // function changePositionCon (name, status) {
  //   console.log('change', name, status)
  //   // const nameObj = {
  //   //   'GlobalWrite': GlobalWrite,
  //   //   'CreatorEntrance': CreatorEntrance,
  //   //   'GlobalSideBar-category': GlobalSideBarCategory,
  //   //   'GlobalSideBar-navList': GlobalSideBarNavList,
  //   //   'Footer': Footer,
  //   // }

  //   $(`.${positionDoms[name].class}`).remove()
  //   const statusObj = {
  //     left: () => $('.pf-left-container').prepend(positionDoms[name].even),
  //     right: () => $('.GlobalSideBar .Sticky').prepend(positionDoms[name].even)
  //   }
  //   statusObj[status] && statusObj[status]()

  //   // 判断左右测盒子是否有子元素
  //   $('.pf-left-container')[0].style.display = $('.pf-left-container').children().length > 0 ? 'block' : 'none'
  //   let globalSideBarChildren = 0
  //   Object.keys(positionDoms).forEach((key) => {
  //     $('.GlobalSideBar').find(`.${positionDoms[key].class}`).length && (globalSideBarChildren++)
  //   })
  //   $('.GlobalSideBar')[0].style.display = globalSideBarChildren > 0 ? 'block' : 'none'

  //   // 判断元素顺序
  // }

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