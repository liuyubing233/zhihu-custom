// ==UserScript==
// @name         知乎样式修改器
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  知乎样式自定义修改器-支持夜间模式、模块隐藏、可配置及自定义样式、图片全部可预览、过滤广告等
// @author       pufferfish
// @match         *://www.zhihu.com/*
// @match         *://zhuanlan.zhihu.com/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// ==/UserScript==

(function () {
  'use strict'

  // 开发使用 勿动 ---- start
  const isDev = false
  const INNER_HTML = null
  const INNER_CSS = null
  // 开发使用 勿动 ---- end

  let pfConfig = {
    versionHeart: '1200', // 版心宽度
    positionAnswer: 'left',
    positionAnswerIndex: '1', // 优先级
    positionCreation: 'right',
    positionCreationIndex: '2',
    positionTable: 'right',
    positionTableIndex: '3',
    positionFavorites: 'left',
    positionFavoritesIndex: '4',
    positionFooter: 'right',
    positionFooterIndex: '5',
    stickyLeft: false, // 首页左侧栏是否固定
    stickyRight: false, // 首页右侧栏是否固定
    zoomAnswerImage: '100px', // 图片缩放大小 hidden 100px 200px 400px default
    titleIco: '', // 网页标题logo图
    title: '', // 网页标题
    colorBackground: '#ffffff', // 背景色
    colorsBackground: [],
    colorTheme: '#0066ff',
    colorsTheme: [],
    customizeCss: '',
    suspensionHomeTab: false, // 悬浮首页tab
    suspensionHomeTabPoLR: 'left',
    suspensionHomeTabPoTB: 'top',
    suspensionHomeTabPoLRValue: '20',
    suspensionHomeTabPoTBValue: '60',
    questionTitleTag: true, // 内容标题添加类别标签
    // 隐藏内容模块 start --------
    hiddenAnswerRightFooter: true, // 回答页面右侧内容
    hiddenLogo: false, // logo
    hiddenHeader: false, // header
    hiddenHeaderScroll: false, // 顶部滚动header
    hiddenItemActions: false, // 回答操作
    hiddenAnswerText: false, // 回答操作文字
    hiddenQuestionShare: false, // 问题分享
    hiddenQuestionTag: false, // 问题话题
    hiddenQuestionActions: false, // 问题操作栏
    hiddenReward: false, // 赞赏按钮
    hiddenZhuanlanTag: false, // 专栏回答关联话题
    hiddenListImg: false, // 问题列表图片
    hiddenReadMoreText: true, // 阅读全文文字
    hiddenAD: true, // 广告
    hiddenAnswerRights: false, // 收藏喜欢举报按钮
    hiddenAnswerRightsText: false, // 收藏喜欢举报按钮文字
    hiddenAnswers: false, // 问题列表回答内容
    hiddenHotListWrapper: false, // 热榜榜单TAG
    // 隐藏内容模块 end --------
  }

  let pfConfigCache = {} // 缓存初始配置

  // 使用位置颜色配置来解决有关版本更新颜色列表未更新的问题
  const colorsLocation = {
    colorsBackground: ['#ffffff', '#15202b', '#000000'],
    colorsTheme: ['#0066ff', '#ffad1f', '#e0245e', '#f45d22', '#17bf63', '#794bc4']
  }

  // 背景色对应名称
  const backgroundText = {
    '#ffffff': '默认',
    '#15202b': '黯淡',
    '#000000': '纯黑',
  }

  let thisPageTitle = '' // 缓存页面原标题
  let cacheColors = {} // 缓存颜色列表
  let firstInitColors = true // 是否第一次加载颜色模块
  let positionDoms = {} // 缓存首页原右侧元素
  let firstInitDoms = true // 是否第一次进入页面操作首页
  let timeoutToFindCreator = null // 定时器---用来查找首页创作中心（因为是页面加载完成后动态写入）
  const openButton = '<div class="pf-op"><i class="pf-open-modal iconfont">&#xe603;</i></div>'

  let bodySize = 0
  let bodySizePrev = 0

  /**
   * 存储使用油猴自己的GM存储，解决数据不共通的问题，添加localStorage与GM判断，获取最新存储
   */
  const myStorage = {
    set: async (name, value) => {
      let v = value
      if (name === 'pfConfig') {
        const valueParse = JSON.parse(value)
        valueParse.t = +new Date()
        v = JSON.stringify(valueParse)
      }
      localStorage.setItem(name, v)
      await GM_setValue(name, v)
    },
    get: async (name) => {
      const config = await GM_getValue(name)
      const configLocal = localStorage.getItem(name)
      let c = config
      if (name === 'pfConfig') {
        const cParse = config ? JSON.parse(config) : null
        const cLParse = configLocal ? JSON.parse(configLocal) : null
        c = !cParse && !cLParse
          ? ''
          : !cParse
            ? configLocal
            : !cLParse
              ? config
              : cParse.t < cLParse.t
                ? configLocal
                : config
      }
      return c
    }
  }

  /**
   * onclick方法汇总
   */
  const myClick = {
    // 开启设置弹窗
    openModal: () => {
      $('.pf-mark')[0].style.display = 'block'
      initScrollModal()
      stopScroll()
    },
    // 关闭设置弹窗
    hideModal: () => {
      $('.pf-mark')[0].style.display = 'none'
      recoverScroll()
    },
    // 导出配置
    exportConfig: async () => {
      const config = await myStorage.get('pfConfig')
      let link = document.createElement('a')
      link.href = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(config)
      link.download = '配置.txt'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    // 导入配置
    importConfig: async () => {
      const configImport = $('[name=configImport]')[0].value
      const config = JSON.parse(configImport)
      pfConfig = getPfConfigAfterFormat(config)
      await myStorage.set('pfConfig', JSON.stringify(pfConfig))
      initDataOnDocumentStart()
      initData()
    },
    // 恢复默认配置
    restoreConfig: async () => {
      let isUse = confirm('是否启恢复默认配置？\n该功能会覆盖当前配置，建议先将配置导出保存')
      if (isUse) {
        pfConfig = getPfConfigAfterFormat(pfConfigCache)
        await myStorage.set('pfConfig', JSON.stringify(pfConfig))
        initDataOnDocumentStart()
        initData()
      }
    },
    // 开启预览弹窗
    openPreview: (src) => {
      $('.pf-preview-img')[0].src = src
      $('.pf-preview')[0].style.display = 'block'
      stopScroll()
    },
    // 关闭预览弹窗
    hidePreview: () => {
      $('.pf-preview')[0].style.display = 'none'
      $('.pf-preview-img')[0].src = ''
      recoverScroll()
    },
    // 启用极简模式
    useSimple: async () => {
      let isUse = confirm('是否启用极简模式？\n该功能会覆盖当前配置，建议先将配置导出保存')
      if (isUse) {
        const config = { versionHeart: '800', positionAnswer: 'hidden', positionAnswerIndex: '1', positionCreation: 'hidden', positionCreationIndex: '2', positionTable: 'hidden', positionTableIndex: '3', positionFavorites: 'hidden', positionFavoritesIndex: '4', positionFooter: 'hidden', positionFooterIndex: '5', stickyLeft: false, stickyRight: false, zoomAnswerImage: '100px', titleIco: '', title: '', colorBackground: '#ffffff', colorsBackground: ['#ffffff', '#15202b', '#000000'], colorTheme: '#0066ff', colorsTheme: ['#0066ff', '#ffad1f', '#e0245e', '#f45d22', '#17bf63', '#794bc4'], customizeCss: '', usePresetStyle: true, hiddenAnswerRightFooter: true, hiddenLogo: true, hiddenHeader: true, hiddenHeaderScroll: true, hiddenItemActions: true, hiddenAnswerText: false, hiddenQuestionShare: true, hiddenQuestionTag: true, hiddenQuestionActions: true, hiddenReward: true, hiddenZhuanlanTag: true, hiddenListImg: true, hiddenReadMoreText: true, hiddenAD: true, hiddenAnswerRights: true, hiddenAnswerRightsText: false, hiddenAnswers: true, hiddenHotListWrapper: true, suspensionHomeTab: true, suspensionHomeTabPoLR: 'left', suspensionHomeTabPoTB: 'top', suspensionHomeTabPoLRValue: '20', suspensionHomeTabPoTBValue: '60', questionTitleTag: true }
        pfConfig = getPfConfigAfterFormat(config)
        await myStorage.set('pfConfig', JSON.stringify(pfConfig))
        initDataOnDocumentStart()
        initData()
      }
    }
  }

  function initData () {
    thisPageTitle = document.title
    for (let even of $('.pf-input')) {
      switch (even.type) {
        case 'radio':
          if (pfConfig[even.name] && even.value === pfConfig[even.name]) {
            even.checked = true
          }
          break
        case 'checkbox':
          even.checked = pfConfig[even.name] || false
          break
        case 'select-one':
          if (pfConfig[even.name]) {
            for (let i = 0; i < even.length; i++) {
              if (even[i].value === pfConfig[even.name]) {
                even[i].selected = true
              }
            }
          }
          break
        case 'text':
          if (even.name === 'title' || even.name === 'customizeCss') {
            even.name === 'title' && (even.value = pfConfig.title || document.title)
            even.name === 'customizeCss' && (even.value = pfConfig['customizeCss'])
          } else {
            even.value = pfConfig[even.name]
          }
          break
      }

      even.onchange = (e) => {
        switch (e.target.type) {
          case 'checkbox':
            throttle(changeConfigByCheckbox(e.target))
            break
          case 'radio':
          case 'text':
            throttle(changeConfig(e.target))
            break
          case 'select-one':
            throttle(changeConfigBySelect(e.target))
            break
        }
      }
    }

    initPositionPage()
    changeTitleIco()
    initColorsList()
    changeTitle()
    onSuspensionHomeTab()
  }

  // 在加载和导入前格式化页面配置
  function getPfConfigAfterFormat (config) {
    const c = { ...pfConfig, ...config }
    // 颜色列表从本js和本地存储中合并去重
    Object.keys(colorsLocation).forEach((key) => {
      c[key] = getArrayRemoveSame([].concat(colorsLocation[key], config[key] || []))
    })

    return c
  }

  // 数组去重 格式为string[]
  function getArrayRemoveSame (arr) {
    const nArr = []
    arr.forEach((i) => {
      !nArr.includes(i) && nArr.push(i)
    })
    return nArr
  }

  // 加载颜色列表
  function initColorsList () {
    // 第一进入时加载暂存内容
    if (firstInitColors) {
      firstInitColors = false
      Object.keys(pfConfig).forEach((key) => {
        /^colors/.test(key) && initColorsHtml(key, pfConfig[key])
      })
    } else {
      Object.keys(pfConfig).forEach((key) => {
        if (/^colors/.test(key)) {
          // 如果配置中的颜色在缓存中不相等，则重新加载颜色元素
          pfConfig[key] !== cacheColors[key] && initColorsHtml(key, pfConfig[key])
        }
      })
    }
  }

  function initColorsHtml (key, colors) {
    cacheColors[key] = pfConfig[key]
    $(`[name="${key}"]`).children().length > 0 && $(`[name="${key}"]`).empty()
    colors.forEach((item) => {
      const name = key.replace(/colors/, 'color')
      const dom = $(`<label class="pf-color-choose-label"><input class="pf-input" name="${name}" type="radio" value="${item}"/><div class="pf-color-radio-item" style="background: ${item};">${colorHtmlItem(name, item)}</div></label>`)
      dom.find('input')[0].checked = item === pfConfig[name]
      dom.find('input')[0].onchange = (e) => {
        // throttle(changeConfig(e.target), 300)
        changeConfig(e.target)
      }
      $(`[name="${key}"]`).length && $(`[name="${key}"]`).append(dom)
    })
  }

  function colorHtmlItem (name, item) {
    const doms = {
      'colorBackground': `<span style="color: ${colorReverse(item)}">${backgroundText[item]}</span>`
    }
    return doms[name] || ''
  }

  // 颜色取反 格式是16进制6位 例如用#ffffff而不是#fff
  function colorReverse (OldColorValue) {
    var OldColorValue = "0x" + OldColorValue.replace(/#/g, "")
    var str = "000000" + (0xFFFFFF - OldColorValue).toString(16)
    return '#' + str.substring(str.length - 6, str.length)
  }

  // 修改配置 select
  async function changeConfigBySelect (ev) {
    const { name, value } = ev
    pfConfig[name] = value
    const changerObj = {
      'versionHeart': changeVersion,
    }
    await myStorage.set('pfConfig', JSON.stringify(pfConfig))
    if (/^position/.test(name)) {
      initPositionPage()
    } else {
      changerObj[name] && changerObj[name]()
    }
  }

  // 修改配置 checkbox
  async function changeConfigByCheckbox (ev) {
    const { name, checked } = ev
    pfConfig[name] = checked
    await myStorage.set('pfConfig', JSON.stringify(pfConfig))
    const changerObj = {
      'stickyLeft': stickyBetween,
      'stickyRight': stickyBetween,
      'suspensionHomeTab': () => {
        onSuspensionHomeTab()
        changeVersion()
      },
      'questionTitleTag': changeVersion,
    }
    if (/^hidden/.test(name)) {
      changeVersion()
    } else {
      changerObj[name] && changerObj[name]()
    }
  }

  // 修改配置 radio text
  async function changeConfig (ev) {
    const { name, value } = ev
    pfConfig[name] = value
    await myStorage.set('pfConfig', JSON.stringify(pfConfig))
    const changerObj = {
      'zoomAnswerImage': changeVersion,
      'titleIco': changeTitleIco,
      'colorBackground': changeColorBackground,
      // 'colorTheme': () => changeColorTheme(),
      'title': changeTitle,
      'customizeCss': changeCustomCss,
      'suspensionHomeTabPoLR': () => {
        onSuspensionHomeTabPoInner()
        changeVersion()
      },
      'suspensionHomeTabPoTB': () => {
        onSuspensionHomeTabPoInner()
        changeVersion()
      },
      'suspensionHomeTabPoLRValue': changeVersion,
      'suspensionHomeTabPoTBValue': changeVersion,
    }
    if (/^position/.test(name)) {
      initPositionPage()
    } else {
      changerObj[name] && changerObj[name]()
    }
  }

  // 悬浮首页tab
  function onSuspensionHomeTab () {
    $('.pf-home-tab-is-suspension')[0].style = pfConfig.suspensionHomeTab ? 'display: block;' : 'display: none;'
  }

  // 悬浮位置变化修改偏移文案
  function onSuspensionHomeTabPoInner () {
    $('.pf-suspension-po-label-LR')[0].innerText = pfConfig.suspensionHomeTabPoLR === 'left' ? '左' : '右'
    $('.pf-suspension-po-label-TB')[0].innerText = pfConfig.suspensionHomeTabPoTB === 'top' ? '顶' : '底'
  }

  function changeCustomCss () {
    const cssCustom = `<style type="text/css" id="pf-css-custom">${pfConfig.customizeCss}</style>`
    $('#pf-css-custom') && $('#pf-css-custom').remove()
    $('head').append(cssCustom)
  }

  // 修改页面标题
  function changeTitle () {
    document.title = pfConfig.title || thisPageTitle
  }

  // 修改页面标题ico
  function changeTitleIco () {
    const ico = {
      github: '<link rel="icon" class="js-site-favicon" id="pf-ico" type="image/svg+xml" href="https://github.githubassets.com/favicons/favicon.svg">',
      csdn: '<link href="https://g.csdnimg.cn/static/logo/favicon32.ico" id="pf-ico" rel="shortcut icon" type="image/x-icon">',
      juejin: '<link data-n-head="ssr" rel="shortcut icon" id="pf-ico" href="https://b-gold-cdn.xitu.io/favicons/v2/favicon.ico">',
      zhihu: '<link rel="shortcut icon" type="image/x-icon" id="pf-ico" href="https://static.zhihu.com/heifetz/favicon.ico">',
    }
    $('#pf-ico').length && $('#pf-ico').remove()
    ico[pfConfig.titleIco] && $('head').append(ico[pfConfig.titleIco])
  }

  // 加载两侧数据
  function initPositionPage () {
    if (firstInitDoms) {
      timeoutToFindCreator = setTimeout(() => {
        clearTimeout(timeoutToFindCreator)
        // 循环定时直到存在创作中心
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
    // 清除两侧盒子内容
    $('.pf-left-container .Sticky').empty()
    $('.GlobalSideBar .Sticky').empty()
    const leftDom = []
    const rightDom = []
    // 添加dom
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
    // 两侧盒子不存在子元素则隐藏
    $('.pf-left-container')[0] && ($('.pf-left-container')[0].style.display = $('.pf-left-container .Sticky').children().length > 0 ? 'block' : 'none')
    $('.GlobalSideBar')[0] && ($('.GlobalSideBar')[0].style.display = $('.GlobalSideBar .Sticky').children().length > 0 ? 'block' : 'none')
  }

  // 修改版心方法
  function changeVersion () {
    const cssVersion = '<style type="text/css" id="pf-css-version">' +
      `.QuestionHeader .QuestionHeader-content,.QuestionHeader-footer .QuestionHeader-footer-inner,.QuestionHeader-content,.Question-main,.AppHeader-inner,.TopstoryPageHeader,.Topstory-container,.ExploreHomePage,.QuestionWaiting,.SearchTabs-inner,.Search-container,.ProfileHeader,.Profile-main,.CollectionsDetailPage,.ColumnPageHeader-content,.SettingsMain,.App-main .Creator,.Collections-container,.Balance-Layout{width:${vHeart().v}!important;}`
      + `.QuestionHeader-main,.SearchMain,.Profile-mainColumn,.CollectionsDetailPage-mainColumn,.Collections-mainColumn,.Balance-Main,.Post-RichTextContainer,.ContentItem-time,.Post-topicsAndReviewer,.Post-content .RichContent-actions,.Post-NormalMain .Post-Header, .Post-NormalMain>div, .Post-NormalSub>div,.css-1xy3kyp,.css-1voxft1,.WriteIndexLayout-main{width:${vHeart().vContent}!important;}`
      + `.Post-SideActions{left: ${vHeart().leftSide}}`
      + `img.lazy,.GifPlayer img,.ArticleItem-image,.ztext figure .content_image, .ztext figure .origin_image{${vImgSize()}}`
      + `${pfConfig.hiddenAnswerRightFooter ? '.Question-sideColumn{display: none!important;}' : ''}`
      + `${pfConfig.hiddenLogo ? '.ZhihuLogoLink,.TopTabNavBar-logo-3d0k,[aria-label="知乎"],.TopNavBar-logoContainer-vDhU2,.zu-top-link-logo{display: none!important;}' : ''}`
      + `${pfConfig.hiddenHeader ? '.AppHeader,.ColumnPageHeader-Wrapper{display: none!important;}' : ''}`
      + `${pfConfig.hiddenHeaderScroll ? '.AppHeader.is-fixed{display:none!important;}' : ''}`
      + `${pfConfig.hiddenItemActions ? '.ContentItem-actions{opacity:0!important;height:0!important;padding:0!important;}' : ''}`
      + `${pfConfig.hiddenAnswerText ? '.ContentItem-actions{padding: 0 20px!important;line-height: 38px!important;}.ContentItem-action,.ContentItem-action button,.ContentItem-actions button{font-size: 0!important;padding: 0!important;background: none!important;line-height:inherit!important;}.ContentItem-action span,.ContentItem-actions button span{font-size: 16px!important;}.ContentItem-action svg,.ContentItem-actions svg{width: 16px!important;height:16px!important;}.VoteButton{color: #8590a6!important; }.VoteButton.is-active{color: #0066ff!important;}.ContentItem-action{margin-left:8px!important;}' : ''}`
      + `${pfConfig.hiddenQuestionTag ? '.QuestionHeader-tags{display: none!important;}' : ''}`
      + `${pfConfig.hiddenQuestionShare ? '.Popover.ShareMenu{display: none!important;}' : ''}`
      + `${pfConfig.hiddenQuestionActions ? '.QuestionButtonGroup,.QuestionHeaderActions{display: none!important;}' : ''}`
      + `${pfConfig.hiddenReward ? '.Reward{display: none!important;}' : ''}`
      + `${pfConfig.hiddenZhuanlanTag ? '.Post-topicsAndReviewer{display: none!important;}' : ''}`
      + `${pfConfig.hiddenListImg ? '.RichContent-cover,.HotItem-img{display:none!important;}.HotItem-metrics--bottom{position: initial!important;}' : ''}`
      + `${pfConfig.hiddenReadMoreText ? '.ContentItem-more{font-size:0!important;}' : ''}`
      + `${pfConfig.hiddenAD ? '.TopstoryItem--advertCard{display: none!important;}' : ''}`
      + `${pfConfig.hiddenAnswerRights ? '.ContentItem-actions .ShareMenu ~ .ContentItem-action{display: none;}.ContentItem-rightButton{display:block!important;}' : ''}`
      + `${pfConfig.hiddenAnswerRightsText ? '.ContentItem-actions .ShareMenu ~ .ContentItem-action{font-size: 0!important;}.ContentItem-actions .ShareMenu ~ .ContentItem-action>span{font-size:12px!important;}' : ''}`
      + `${pfConfig.hiddenAnswers ? '.Topstory-container .RichContent.is-collapsed .RichContent-inner,.HotItem-excerpt--multiLine{display: none;}' : ''}`
      + `${pfConfig.hiddenHotListWrapper ? '.HotListNav-wrapper{display: none;}' : ''}`
      + `${pfConfig.suspensionHomeTab ? `.Topstory-container .TopstoryTabs{position:fixed;${vTabPosition()}z-index:100;display:flex;flex-direction:column}.Topstory-container .TopstoryTabs>a{font-size:0 !important;border-radius:50%}.Topstory-container .TopstoryTabs>a::after{font-size:14px!important;display:inline-block;padding:4px 6px;border-radius:50%;border:1px solid #999999;margin-bottom:8px;color:#999999}.Topstory-container .TopstoryTabs>a.TopstoryTabs-link.is-active::after{color:#0066ff !important;border-color:#0066ff !important}.Topstory [aria-controls='Topstory-recommend']::after{content:'推'}.Topstory [aria-controls='Topstory-follow']::after{content:'关'}.Topstory [aria-controls='Topstory-hot']::after{content:'热'}` : ''}`
      + `${pfConfig.questionTitleTag ? `.AnswerItem .ContentItem-title::before{content:'回答';background:#ec7259}.ZVideoItem .ContentItem-title::before{content:'视频';background:#12c2e9}.ArticleItem .ContentItem-title::before{content:'文章';background:#00965e}.ContentItem .ContentItem-title::before{margin-right:6px;font-weight:normal;display:inline;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff}.ContentItem-title div{display:inline}` : ''}`
      + '</style>'
    $('#pf-css-version') && $('#pf-css-version').remove()
    $('head').append(cssVersion)
  }

  // 悬浮首页TAB定位
  function vTabPosition () {
    const { suspensionHomeTabPoLR, suspensionHomeTabPoTB, suspensionHomeTabPoLRValue, suspensionHomeTabPoTBValue } = pfConfig
    return `${suspensionHomeTabPoLR}:${suspensionHomeTabPoLRValue}px;${suspensionHomeTabPoTB}:${suspensionHomeTabPoTBValue}px;`
  }

  // 图片size调整
  function vImgSize () {
    return pfConfig.zoomAnswerImage !== 'default'
      ? pfConfig.zoomAnswerImage === 'hidden'
        ? 'display: none!important;'
        : 'width:' + pfConfig.zoomAnswerImage + '!important;cursor: zoom-in!important;'
      : ''
  }

  // 判断版心是否为100vw 返回根据版心调整的宽度内容
  function vHeart () {
    let v = pfConfig.versionHeart === '100%' ? pfConfig.versionHeart : pfConfig.versionHeart + 'px'
    return {
      v,
      vContent: `calc(${v} - 296px)`,
      leftSide: `calc(50vw - (${v} / 2))`
    }
  }

  // 加载预览图片方法，解决部分图片无法点击预览的问题
  function initPreviewImg () {
    const imgEvents = [
      // $('img.lazy'),
      $('.GifPlayer img'),
      $('.ArticleItem-image'),
      $('.ztext figure .content_image'),
      // $('.ztext figure .origin_image')
    ]

    for (let events of imgEvents) {
      for (let e of events) {
        e.onclick = () => myClick.openPreview(e.src)
      }
    }
  }

  // 修改页面背景的css
  function changeColorBackground () {
    const filter = {
      '#ffffff': { invert: 0, 'hue-rotate': '0' },
      '#15202b': { invert: 0.7, 'hue-rotate': '180deg', contrast: 1.7 },
      '#000000': { invert: 1, 'hue-rotate': '180deg' },
    }
    const fi = filter[pfConfig.colorBackground]
    // 使用filter方法来实现夜间模式
    const cssColor = `<style type="text/css" id="pf-css-background">`
      + `html,html img,.pf-color-radio-item,iframe{${filterObj(fi)}}`
      + `.zu-top,.zu-top-nav-userinfo.selected, html.no-touchevents .top-nav-profile:hover .zu-top-nav-userinfo,.top-nav-profile a{${isNotF() ? 'background:#ffffff!important;border-color: #eeeeee!important;' : ''}}
      .zu-top .zu-top-nav-link,.top-nav-profile .zu-top-nav-userinfo,.top-nav-dropdown li a{${isNotF() ? 'color: #111f2c!important;' : ''}}html.no-touchevents .top-nav-dropdown a:hover {${isNotF() ? 'background:#eeeeee!important' : ''}}`
      + `</style>`
    $('#pf-css-background') && $('#pf-css-background').remove()
    $('head').append(cssColor)
  }

  // 背景颜色选择不是#ffffff
  function isNotF () {
    return pfConfig.colorBackground !== '#ffffff'
  }

  function filterObj (fi) {
    return `filter: ${Object.keys(fi).map((name) => `${name}(${fi[name]})`).join(' ')};`
  }

  // 页面主题方法
  // function changeColorTheme () {
  //   const objBg = getCssTheme()
  //   const cssColor = `<style type="text/css" id="pf-css-theme">${Object.keys(objBg).map(i => objBg[i]).join('')}</style>`
  //   $('#pf-css-theme') && $('#pf-css-theme').remove()
  //   $('head').append(cssColor)
  // }

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

  // 在打开弹窗时候停止页面滚动，只允许弹窗滚动
  function stopScroll () {
    let top = document.body.scrollTop || document.documentElement.scrollTop
    document.body.style.position = 'fixed'
    document.body.style.top = `${-1 * top}px`
  }
  // 关闭弹窗的时候恢复页面滚动
  function recoverScroll () {
    let top = -parseInt(document.body.style.top)
    document.body.style.position = 'static'
    document.body.style.top = 0
    window.scrollTo(0, top)
  }

  function stickyBetween () {
    window.scrollY > 0 ? fixedPosition() : inheritPosition()
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

  // hex -> rgba
  function hexToRgba (hex, opacity) {
    return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
      + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')'
  }

  // // reverse color at background
  // function reverseCss (color, isImportant = false, name = 'color') {
  //   return pfConfig.colorBackground !== '#ffffff' ? `${name}: ${colorReverse(color)}${isImportant ? '!important' : ''};` : ''
  // }

  // // reverse color's content at background
  // function reverseCssCon (color) {
  //   return pfConfig.colorBackground !== '#ffffff' ? colorReverse(color) : color
  // }

  // function getCssTheme () {
  //   const { colorTheme } = pfConfig
  //   return {
  //     bg: `.Tabs-link.is-active:after,.Button--primary.Button--blue,.BounceLoading .BounceLoading-child,.CollectionsHeader-tabsLink.is-active:after,.Favlists-privacyOptionRadio:checked, html[data-theme=dark] .Favlists-privacyOptionRadio:checked{background-color:${colorTheme}!important;}`,
  //     bg1: `.VoteButton, html[data-theme=dark] .VoteButton,.Tag{background-color: ${hexToRgba(colorTheme, '0.1')};}`,
  //     bg15: `.VoteButton:not(:disabled):hover, html[data-theme=dark] .VoteButton:not(:disabled):hover{background-color: ${hexToRgba(colorTheme, '0.15')};}`,
  //     bg80: `.QuestionType--active,html[data-theme=dark] .QuestionType--active,.Button--primary.Button--blue:hover{background-color: ${hexToRgba(colorTheme, '0.8')};}`,
  //     color: `.QuestionType--active,html[data-theme=dark] .QuestionType--active,.QuestionType--active .QuestionType-icon,html[data-theme=dark] .QuestionType--active .QuestionType-icon,.HotListNav-item.is-active,.HotListNav-sortableItem[data-hotlist-identifier=total].is-active, html[data-theme=dark] .HotListNav-sortableItem[data-hotlist-identifier=total].is-active,.TabNavBarItem-tab-MS9i.TabNavBarItem-isActive-1iXL,.pf-open-modal:hover,.TopstoryTabs-link.is-active, html[data-theme=dark] .TopstoryTabs-link.is-active,.VoteButton,.GlobalWrite-navNumber, html[data-theme=dark] .GlobalWrite-navNumber,.css-1y4nzu1,.GlobalSideBar-categoryItem .Button:hover,.Button--blue,.Tag, html[data-theme=dark] .Tag,.RichContent--unescapable.is-collapsed .ContentItem-rightButton,.CollectionsHeader-addFavlistButton, html[data-theme=dark] .CollectionsHeader-addFavlistButton,.css-1hzmtho{color: ${colorTheme}!important}`,
  //     color8: `.TopstoryTabs-link:hover,.ContentItem-more,.ContentItem-title a:hover,.GlobalWrite--old .GlobalWrite-topItem:hover .GlobalWrite-topTitle,.GlobalWrite-navTitle:hover,a.Footer-item:hover,.RichText a.UserLink-link,.NumberBoard-item.Button:hover .NumberBoard-itemName, .NumberBoard-item.Button:hover .NumberBoard-itemValue, .NumberBoard-itema:hover .NumberBoard-itemName, .NumberBoard-itema:hover .NumberBoard-itemValue,a.QuestionMainAction:hover,.Button--link:hover,.CollectionsHeader-tabsLink:hover,.SideBarCollectionItem-title{color: ${hexToRgba(colorTheme, '0.8')}!important;}`,
  //     border: `.Button--primary.Button--blue,.Button--blue,.Favlists-privacyOptionRadio:checked, html[data-theme=dark] .Favlists-privacyOptionRadio:checked{border-color: ${colorTheme}!important}`,
  //     border8: `.Button--primary.Button--blue:hover{border-color: ${hexToRgba(colorTheme, '0.8')}!important;}`,
  //     colorFFF: `.Button--primary.Button--blue{color:#ffffff!important;}`,
  //     fill: `.CollectionsHeader-addFavlistButton svg, html[data-theme=dark] .CollectionsHeader-addFavlistButton svg{fill: ${colorTheme}!important;}`
  //   }
  // }

  // 注入弹窗元素和默认css
  function initHtml () {
    const dom = isDev ? INNER_HTML :
      '<div style="display: none;"class="pf-mark"><div class="pf-modal-bg"><div class="pf-modal"><div class="pf-modal-title">样式编辑器</div><div class="pf-modal-content"><ul class="pf-left"><li><a href="#pf-set-basis">基础设置</a></li><li><a href="#pf-set-home">首页设置</a></li><li><a href="#pf-set-hidden">隐藏内容</a></li><!--<li><a href="#pf-set-question-detail">问题详情设置</a></li>--><li><a href="#pf-set-color">颜色设置</a></li><li><a href="#pf-set-config">配置导出导入</a></li><!--<li><a href="#pf-set-back-content">返回内容设置</a></li>--></ul><div class="pf-right"><div id="pf-set-basis"><h3>基础设置</h3><button class="pf-simple-button pf-button">启用极简模式</button><div class="pf-radio-div"><span class="pf-label">版心大小</span><select name="versionHeart"class="pf-input"style="width: 100px;"><option value="800">800px</option><option value="1000">1000px</option><option value="1200">1200px</option><option value="1500">1500px</option><option value="100%">拉满</option></select></div><div class="pf-raido-divoom-answer-image"><span class="pf-label">回答和专栏图片缩放</span><div class="pf-content"><label><input class="pf-input"name="zoomAnswerImage"type="radio"value="hidden"/>隐藏</label><label><input class="pf-input"name="zoomAnswerImage"type="radio"value="100px"/>极小(100px)</label><label><input class="pf-input"name="zoomAnswerImage"type="radio"value="200px"/>小(200px)</label><label><input class="pf-input"name="zoomAnswerImage"type="radio"value="400px"/>中(400px)</label><label><input class="pf-input"name="zoomAnswerImage"type="radio"value="default"/>默认</label></div></div><div class="pf-radio-div"><span class="pf-label">更改网页标题图片</span><br/><label class="pf-radio-img-select"><input class="pf-input"name="titleIco"type="radio"value="github"/><img src="https://github.githubassets.com/favicons/favicon.svg"alt="github"class="pf-radio-img"></label><label class="pf-radio-img-select"><input class="pf-input"name="titleIco"type="radio"value="csdn"/><img src="https://g.csdnimg.cn/static/logo/favicon32.ico"alt="csdn"class="pf-radio-img"></label><label class="pf-radio-img-select"><input class="pf-input"name="titleIco"type="radio"value="juejin"/><img src="https://b-gold-cdn.xitu.io/favicons/v2/favicon.ico"alt="juejin"class="pf-radio-img"></label><label class="pf-radio-img-select"><input class="pf-input"name="titleIco"type="radio"value="zhihu"/><img src="https://static.zhihu.com/heifetz/favicon.ico"alt="zhihu"class="pf-radio-img"></label></div><div class="pf-radio-div"><span class="pf-label">更改网页标题</span><input class="pf-input"name="title"type="text"style="height: 25px;"/></div></div><div id="pf-set-home"><h3>首页设置</h3><div class="pf-label fw-bold">模块位置</div><div class="pf-radio-div pf-z"><span class="pf-label">回答问题</span><label><input class="pf-input"name="positionAnswer"type="radio"value="left"/>左侧</label><label><input class="pf-input"name="positionAnswer"type="radio"value="right"/>右侧</label><label><input class="pf-input"name="positionAnswer"type="radio"value="hidden"/>隐藏</label><select name="positionAnswerIndex"class="pf-input"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-radio-div pf-z"><span class="pf-label">创作中心</span><label><input class="pf-input"name="positionCreation"type="radio"value="left"/>左侧</label><label><input class="pf-input"name="positionCreation"type="radio"value="right"/>右侧</label><label><input class="pf-input"name="positionCreation"type="radio"value="hidden"/>隐藏</label><select name="positionCreationIndex"class="pf-input"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-radio-div pf-z"><span class="pf-label">圆桌</span><label><input class="pf-input"name="positionTable"type="radio"value="left"/>左侧</label><label><input class="pf-input"name="positionTable"type="radio"value="right"/>右侧</label><label><input class="pf-input"name="positionTable"type="radio"value="hidden"/>隐藏</label><select name="positionTableIndex"class="pf-input"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-radio-div pf-z"><span class="pf-label">收藏夹</span><label><input class="pf-input"name="positionFavorites"type="radio"value="left"/>左侧</label><label><input class="pf-input"name="positionFavorites"type="radio"value="right"/>右侧</label><label><input class="pf-input"name="positionFavorites"type="radio"value="hidden"/>隐藏</label><select name="positionFavoritesIndex"class="pf-input"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-radio-div"><span class="pf-label">指南</span><label><input class="pf-input"name="positionFooter"type="radio"value="left"/>左侧</label><label><input class="pf-input"name="positionFooter"type="radio"value="right"/>右侧</label><label><input class="pf-input"name="positionFooter"type="radio"value="hidden"/>隐藏</label><select name="positionFooterIndex"class="pf-input"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-checkbox-div"><label><span class="pf-label">左侧栏固定</span><input class="pf-input"name="stickyLeft"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">右侧栏固定</span><input class="pf-input"name="stickyRight"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">内容标题添加类别标签<span class="pf-label-tag pf-label-tag-Article">文章</span><span class="pf-label-tag pf-label-tag-Answer">回答</span><span class="pf-label-tag pf-label-tag-ZVideo">视频</span></span><input class="pf-input"name="questionTitleTag"type="checkbox"value="on"/></label></div><div class="pf-label fw-bold">问题列表切换模块</div><div class="pf-checkbox-div pf-z"><label><span class="pf-label">悬浮TAB</span><input class="pf-input"name="suspensionHomeTab"type="checkbox"value="on"/></label></div><div class="pf-home-tab-is-suspension"style="display: none;"><div class="pf-radio-div pf-z"><span class="pf-label">悬浮位置</span><label><input class="pf-input"name="suspensionHomeTabPoLR"type="radio"value="left"/>左</label><label><input class="pf-input"name="suspensionHomeTabPoLR"type="radio"value="right"/>右</label><label><input class="pf-input"name="suspensionHomeTabPoTB"type="radio"value="top"/>顶</label><label><input class="pf-input"name="suspensionHomeTabPoTB"type="radio"value="bottom"/>底</label></div><div class="pf-radio-div pf-z"><span class="pf-label"><span class="pf-suspension-po-label-LR">左</span>侧偏移</span><input class="pf-input"name="suspensionHomeTabPoLRValue"type="text"style="height: 25px;"/></div><div class="pf-radio-div"><span class="pf-label"><span class="pf-suspension-po-label-TB">顶</span>部偏移</span><input class="pf-input"name="suspensionHomeTabPoTBValue"type="text"style="height: 25px;"/></div></div></div><div id="pf-set-hidden"><h3>隐藏内容</h3><div class="pf-hidden-labels"><label><input class="pf-input"name="hiddenLogo"type="checkbox"value="on"/>logo</label><label><input class="pf-input"name="hiddenHeader"type="checkbox"value="on"/>顶部header</label><label><input class="pf-input"name="hiddenHeaderScroll"type="checkbox"value="on"/>顶部滚动header</label><label><input class="pf-input"name="hiddenAnswerRightFooter"type="checkbox"value="on"/>详情右侧信息栏</label><label><input class="pf-input"name="hiddenHotListWrapper"type="checkbox"value="on"/>热榜榜单TAG</label></div><div class="pf-hidden-labels"><label><input class="pf-input"name="hiddenAnswers"type="checkbox"value="on"/>问题列表回答内容</label><label><input class="pf-input"name="hiddenItemActions"type="checkbox"value="on"/>回答操作</label><label><input class="pf-input"name="hiddenAnswerText"type="checkbox"value="on"/>回答操作文字</label><label><input class="pf-input"name="hiddenReadMoreText"type="checkbox"value="on"/>阅读全文文字</label><label><input class="pf-input"name="hiddenAnswerRights"type="checkbox"value="on"/>收藏喜欢举报</label><label><input class="pf-input"name="hiddenAnswerRightsText"type="checkbox"value="on"/>收藏喜欢举报文字</label><label><input class="pf-input"name="hiddenListImg"type="checkbox"value="on"/>问题列表图片</label><label><input class="pf-input"name="hiddenReward"type="checkbox"value="on"/>赞赏按钮</label></div><div class="pf-hidden-labels"><label><input class="pf-input"name="hiddenQuestionShare"type="checkbox"value="on"/>问题分享</label><label><input class="pf-input"name="hiddenQuestionTag"type="checkbox"value="on"/>问题话题</label><label><input class="pf-input"name="hiddenQuestionActions"type="checkbox"value="on"/>问题操作栏</label><label><input class="pf-input"name="hiddenZhuanlanTag"type="checkbox"value="on"/>专栏回答关联话题</label></div><div class="pf-hidden-labels"><label><input class="pf-input"name="hiddenAD"type="checkbox"value="on"/>广告</label></div></div><!--<div id="pf-set-question-detail"><h3>问题详情设置</h3><div class="pf-checkbox-div"><label><input class="pf-input"name="hiddenAnswerRightFooter"type="checkbox"value="on"/>详情右侧信息栏</label></div></div>--><div id="pf-set-color"><h3>颜色设置</h3><div class="pf-radio-div pf-color-bg"><div class="pf-label">背景</div><div class="pf-content"name="colorsBackground"></div></div><!--<div class="pf-radio-div pf-color-theme"><div class="pf-label">主题颜色</div><div class="pf-content"name="colorsTheme"></div></div>--></div><!--<div id="pf-set-back-content"></div>--><div id="pf-set-config"><h3>配置导出导入</h3><div class="pf-local-config"><button class="pf-export-config pf-button">导出当前配置</button><button class="pf-restore-config pf-button">恢复默认配置</button><div class="pf-import-dom"><textarea class="pf-textarea"name="configImport"placeholder="配置可参考导出格式"></textarea><button class="pf-import-config pf-button">导入</button></div></div><div class="pf-customize-css"><div class="pf-label">自定义css</div><div class="pf-content"><textarea class="pf-textarea pf-input"name="customizeCss"></textarea><button class="pf-customize-css-button pf-button">确定</button></div></div></div></div></div><button class="pf-b-close pf-button">关闭</button></div></div></div><div style="display: none;"class="pf-preview"><div class="pf-modal-bg"><img class="pf-preview-img"src=""></div></div>'
    const htmlModal = $(dom)
    // $('.AppHeader-userInfo').prepend(openButton)
    // $('.ColumnPageHeader-Button').prepend(openButton)
    $('body').append(openButton)
    $('body').append(htmlModal)
    $('.pf-open-modal')[0] && ($('.pf-open-modal')[0].onclick = myClick.openModal)
    $('.pf-b-close')[0].onclick = myClick.hideModal
    $('.pf-export-config')[0].onclick = myClick.exportConfig
    $('.pf-import-config')[0].onclick = myClick.importConfig
    $('.pf-restore-config')[0].onclick = myClick.restoreConfig
    $('.pf-customize-css-button')[0].onclick = () => changeConfig($('[name="customizeCss"]')[0])
    $('.pf-preview')[0].onclick = myClick.hidePreview
    $('.pf-simple-button')[0].onclick = myClick.useSimple
    // 在首页加入左侧模块 用于调整创作中心 收藏夹等模块元素
    const leftDom = $('<div class="pf-left-container" style="display: none; flex: 1; margin-right: 10px;"><div class="Sticky"></div></div>')
    $('.Topstory-container').prepend(leftDom)
    $('.QuestionWaiting').prepend(leftDom)
    // initPreviewImg()
    // initScrollModal()
  }

  function initCss () {
    const cssOwn = isDev ? `<style type="text/css" id="pf-css-own">${INNER_CSS}</style>` : '<style type="text/css" id="pf-css-own">' +
      `body{width:100%}*{box-sizing:border-box}@font-face{font-family:'own-iconfont';src:url('//at.alicdn.com/t/font_2324733_zogpuw5b208.eot');src:url('//at.alicdn.com/t/font_2324733_zogpuw5b208.eot?#iefix') format('embedded-opentype'),url('//at.alicdn.com/t/font_2324733_zogpuw5b208.woff2') format('woff2'),url('//at.alicdn.com/t/font_2324733_zogpuw5b208.woff') format('woff'),url('//at.alicdn.com/t/font_2324733_zogpuw5b208.ttf') format('truetype'),url('//at.alicdn.com/t/font_2324733_zogpuw5b208.svg#own-iconfont') format('svg')}.iconfont{font-family:'own-iconfont' !important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-webkit-text-stroke-width:.2px;-moz-osx-font-smoothing:grayscale}.pf-op{position:fixed;width:50px;height:40px;text-align:center;line-height:40px;border-top-right-radius:12px;border-bottom-right-radius:12px;top:100px;left:-30px;background:#ddd;z-index:9999;cursor:pointer}.pf-op:hover{animation:showOp 1s;animation-fill-mode:forwards}@keyframes showOp{0%{left:-30px}100%{left:0}}.pf-preview,.pf-mark{box-sizing:border-box;position:fixed;height:100%;width:100%;top:0;left:0;overflow-y:auto;z-index:9999;background-color:rgba(18,18,18,0.65)}.pf-preview .pf-modal-bg,.pf-mark .pf-modal-bg{position:relative;height:100%;width:100%}.pf-preview .pf-modal-bg .pf-preview-img,.pf-mark .pf-modal-bg .pf-preview-img,.pf-preview .pf-modal-bg .pf-modal,.pf-mark .pf-modal-bg .pf-modal{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.pf-preview img{cursor:zoom-out}.pf-mark textarea,.pf-mark input{box-sizing:border-box}.pf-mark .pf-modal-bg{min-height:430px}.pf-mark .pf-modal-bg .pf-modal{width:500px;height:430px;background:#fff;z-index:99999;padding:12px;border-radius:12px}.pf-mark .pf-modal-bg .pf-modal ::-webkit-scrollbar{width:.25rem;height:.25rem;background:#eee}.pf-mark .pf-modal-bg .pf-modal ::-webkit-scrollbar-track{border-radius:0}.pf-mark .pf-modal-bg .pf-modal ::-webkit-scrollbar-thumb{border-radius:0;background:#bbb;transition:all .2s;border-radius:.25rem}.pf-mark .pf-modal-bg .pf-modal ::-webkit-scrollbar-thumb:hover{background-color:rgba(95,95,95,0.7)}.pf-mark .pf-modal-bg .pf-modal .pf-modal-title{padding-bottom:12px;font-size:18px;font-weight:bold}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content{display:flex;height:340px;width:100%;font-size:14px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-left{width:100px;border-right:1px solid #ddd;list-style:none;margin:0px;padding:0}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-left li{padding:4px 0}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-left li a{text-decoration:none;color:#111f2c}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right{flex:1;overflow-y:auto;scroll-behavior:smooth;padding:0 12px 100px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right>div{padding-bottom:24px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right h3{margin-top:4px;margin-bottom:8px;font-size:18px;font-weight:bold}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis .pf-zoom-answer-image{display:flex}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis .pf-zoom-answer-image .pf-content{flex:1}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis .pf-zoom-answer-image .pf-content label{display:block}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis .pf-simple-button{margin-bottom:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-home>div,.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis>div{border-bottom:1px solid #eee;padding:4px 0}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-home>div.pf-z,.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis>div.pf-z{border:none}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-home>div label,.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis>div label{padding-right:4px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-label::after{content:'：'}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-radio-img-select{display:inline-block;text-align:center}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-radio-img-select .pf-radio-img{width:32px;height:32px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-radio-img-select input{margin:0;display:none}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-radio-img-select input:checked+.pf-radio-img{border:2px solid #4286f4}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label{display:inline-block;width:100px;height:50px;position:relative;margin-right:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label input,.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label span{position:absolute;top:50%;transform:translateY(-50%);z-index:1}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label input{left:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label input:checked+.pf-color-radio-item{border:2px solid #4286f4}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label span{right:20px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label .pf-color-radio-item{width:100%;height:100%;border:2px solid transparent;border-radius:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsTheme'] .pf-color-choose-label{display:inline-block;width:40px;height:40px;margin-right:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsTheme'] .pf-color-choose-label input{display:none}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsTheme'] .pf-color-choose-label input:checked+.pf-color-radio-item{border:4px solid #4286f4}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsTheme'] .pf-color-choose-label .pf-color-radio-item{width:100%;height:100%;border:4px solid transparent;border-radius:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-color .pf-content{padding:4px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-restore-config{margin-left:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-import-dom,.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-customize-css .pf-content{padding-top:8px;display:flex;align-items:center}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-import-dom .pf-textarea,.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-customize-css .pf-content .pf-textarea{width:70%;height:50px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-import-dom button,.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-customize-css .pf-content button{height:50px;line-height:50px;width:25%;margin-left:5%;padding:0 !important}.pf-mark .pf-modal-bg .pf-modal .pf-button{padding:4px 8px;border-radius:4px;background:#ddd;position:relative;border:1px solid #bbb}.pf-mark .pf-modal-bg .pf-modal .pf-button:hover{background:#eee}.pf-mark .pf-modal-bg .pf-modal .pf-button:active::after{content:'';position:absolute;width:100%;height:100%;top:0;left:0;background:rgba(0,0,0,0.2)}.pf-mark .pf-modal-bg .pf-modal .pf-button:focus{outline:none}.pf-mark .pf-modal-bg .pf-modal .pf-hidden-labels{padding-bottom:6px;border-bottom:1px solid #eeeeee;margin-bottom:6px}.pf-mark .pf-modal-bg .pf-modal .pf-home-tab-is-suspension{border-bottom:1px solid #eeeeee}.pf-mark .pf-modal-bg .pf-modal .pf-home-tab-is-suspension>div{padding-bottom:8px}.pf-mark .pf-modal-bg .pf-modal .pf-label-tag-Answer{background:#ec7259}.pf-mark .pf-modal-bg .pf-modal .pf-label-tag-ZVideo{background:#12c2e9}.pf-mark .pf-modal-bg .pf-modal .pf-label-tag-Article{background:#00965e}.pf-mark .pf-modal-bg .pf-modal .pf-label-tag{margin-right:6px;font-weight:normal;display:inline-block;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff}.fw-bold{font-weight:bold}.GlobalSideBar-navList{margin-bottom:10px;background:#fff;overflow:hidden;border-radius:2px;box-shadow:0 1px 3px rgba(18,18,18,0.1);box-sizing:border-box}.Question-main .Question-mainColumn,.ListShortcut{flex:1;width:100%}.AnswerAuthor{margin-left:12px}.ModalWrap .ModalExp-content{height:0 !important;overflow:hidden}.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard{width:48% !important}.GlobalWrite-navTop{display:flex !important;justify-content:space-between !important;flex-wrap:wrap !important}.GlobalWrite-navTop .GlobalWrite-topItem{margin-right:0 !important;margin-bottom:12px !important}.QuestionHeader-main,.SearchMain,.Profile-mainColumn,.CollectionsDetailPage-mainColumn,.Collections-mainColumn,.Balance-Main{margin-right:0 !important}.Post-Main .RichContent-actions{left:50% !important}.Post-Main .RichContent-actions .ContentItem-actions{transform:translateX(-50%) !important}.css-1xy3kyp,.css-1kjxdzv,.css-qqgmyv{max-width:none !important}.Topstory-mainColumn{flex:1 !important;min-width:694px !important}.ContentItem-action,.Button--plain{font-size:12px !important}.ContentItem-actions{padding-top:0 !important;padding-bottom:0 !important}.ContentItem-actions>button,.ContentItem-actions>div{margin-left:8px}.RichContent-inner{margin-top:8px !important}.Post-SideActions-icon,.Post-SideActions button.like,.VoteButton{background:none !important;color:#8590a6 !important;font-size:12px !important;padding:0 !important}.Post-SideActions button.like.active .Post-SideActions-icon,.Post-SideActions button.like.active .likeCount-inner,.VoteButton.is-active{color:#0066ff !important}`
      + '</style>'
    $('head').append(cssOwn)
  }

  // 在启动时注入的内容
  (async function () {
    pfConfigCache = pfConfig
    const config = await myStorage.get('pfConfig')
    const nConfig = config ? JSON.parse(config) : {}
    pfConfig = getPfConfigAfterFormat(nConfig)
    initCss()
    initDataOnDocumentStart()
  })()

  function initDataOnDocumentStart () {
    changeVersion()
    changeColorBackground()
    // changeColorTheme()
    changeCustomCss()
  }

  // 在页面加载完成时注入的内容
  window.onload = () => {
    initHtml()
    initData()
    resizeObserver.observe($('body')[0])
  }

  // 使用ResizeObserver监听body高度
  const resizeObserver = new ResizeObserver(throttle(resizeFun, 500))
  function resizeFun () {
    // 重新复制img预览
    bodySize === bodySizePrev ? initPreviewImg() : bodySizePrev = bodySize

    // body高度变更后比较推荐模块内容高度与网页高度
    // 如果模块高度小于网页高度则手动触发resize使其加载数据
    if ($('.Topstory-recommend')[0] && $('.Topstory-recommend')[0].offsetHeight < window.innerHeight) {
      const myEvent = new Event('resize')
      window.dispatchEvent(myEvent)
    }
  }

  window.onscroll = throttle(() => {
    stickyBetween()
    // SuspensionPackUp($('.List-item'))
    // SuspensionPackUp($('.TopstoryItem'))
  }, 100)

  // // 漂浮收起按钮的方法
  // function SuspensionPackUp(eventList, right = 150) {
  //   for (let i = 0; i < eventList.length; i++) {
  //     const even = eventList[i]
  //     const evenPrev = i > 0 ? eventList[i - 1] : null
  //     const evenBottom = even.offsetTop + even.offsetHeight
  //     const evenPrevBottom = evenPrev ? evenPrev.offsetTop + evenPrev.offsetHeight : 0
  //     const hST = $('html')[0].scrollTop
  //     // 收起按钮
  //     const evenButton = even.querySelector('.ContentItem-rightButton')
  //     if (evenButton) {
  //       if (evenBottom > hST + window.innerHeight && evenPrevBottom < hST) {
  //         evenButton.style = `position: fixed!important;bottom: 12px; left: ${even.offsetLeft + even.offsetWidth - right}px;box-shadow: 0 1px 3px rgb(18 18 18 / 10%);height: 40px;line-height:40px;padding: 0 12px!important;`
  //       } else {
  //         evenButton.style = ''
  //       }
  //     }
  //   }
  // }

  // 在弹窗滚动中加入a标签锚点配置
  function initScrollModal () {
    const hrefArr = []
    for (let i of $('.pf-left a')) {
      const id = i.href.replace(/.*#/, '')
      hrefArr.push({
        id,
        offsetTop: $(`#${id}`)[0].offsetTop
      })
    }
    scrollModal(hrefArr)
    $('.pf-right')[0].onscroll = throttle(() => scrollModal(hrefArr), 100)
  }

  function scrollModal (hrefArr) {
    const scHere = $('.pf-right')[0].offsetHeight / 2 + $('.pf-right')[0].scrollTop
    const id = hrefArr.find((item, index) => item.offsetTop <= scHere && ((hrefArr[index + 1] && hrefArr[index + 1].offsetTop > scHere) || !hrefArr[index + 1])).id
    for (let i of $('.pf-left a')) {
      i.style = i.href.replace(/.*#/, '') === id ? `color: ${pfConfig.colorTheme}` : ''
    }
  }

})()