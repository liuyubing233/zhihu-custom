// ==UserScript==
// @name         zhihu style
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  知乎样式自定义-
// @author       super puffer fish
// @match         *://www.zhihu.com/*
// @match         *://zhuanlan.zhihu.com/*
// @grant        none
// @run-at       document-start
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
    zoomAnswerImage: 'default', // zoom answer and special column image size
    hiddenAnswerRightFooter: false, // answer page is hidden right footer
    hiddenLogo: false, // hidden logo
    titleIco: '', // the logo at page title
    title: '', // the title at page title
    colorBackground: '#ffffff', // background color
    colorsBackground: [],
    colorTheme: '#0066ff',
    colorsTheme: [],
    customizeCss: '',
  }

  // Use location colors config to resolve question about version update colors list is not update
  const colorsLocation = {
    colorsBackground: ['#ffffff', '#15202b', '#000000'],
    colorsTheme: ['#0066ff']
    // colorsTheme: ['#fff', '#15202b', '#000']
  }

  // background text on choose tag
  const backgroundText = {
    '#ffffff': '默认',
    '#15202b': '黯淡',
    '#000000': '纯黑',
  }

  let thisPageTitle = '' // cache this page title
  let cacheColors = {} // cache color list
  let firstInitColors = true // is first init for color list
  let positionDoms = {} // cache dom for position
  let firstInitDoms = true // is first init for position
  let timeoutToFindCreator = null // timeout to find creator dom
  const openButton = '<i class="pf-open-modal iconfont">&#xe603;</i>'
  // hidden modal
  function buttonModalHidden () {
    $('.pf-mark')[0].style.display = 'none'
    recoverScroll()
  }

  // show modal
  function buttonModalShow () {
    $('.pf-mark')[0].style.display = 'block'
    initScrollModal()
    stopScroll()
  }

  // export file of config bg txt
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
    pfConfig = formatPfConfig(config)
    localStorage.setItem('pfConfig', JSON.stringify(pfConfig))
    initData()
  }

  // init data
  function initData () {
    thisPageTitle = document.title
    for (let even of $('.pf-input')) {
      // even.value = pfConfig[even.name]
      switch (even.type) {
        case 'radio':
          if (pfConfig[even.name] && even.value === pfConfig[even.name]) {
            even.checked = true
          }
          break
      }

      if (even.name === 'title') {
        even.value = pfConfig.title || document.title
      }

      if (even.name === 'customizeCss') {
        even.value = pfConfig['customizeCss']
      }

      even.onchange = (e) => {
        switch (e.target.type) {
          case 'checkbox':
            throttle(changeConfigByCheckbox(e.target), 300)
            break
          case 'radio':
          case 'text':
            throttle(changeConfig(e.target), 300)
            break
        }
      }
    }

    initPositionPage()
    changeTitleIco()
    initColorsList()
    changeTitle()
  }

  // format pfConfig when init or import
  function getPfConfigAfterFormat (config) {
    const c = {
      ...pfConfig,
      ...config,
    }
    // color list is concat from location and storage
    Object.keys(colorsLocation).forEach((key) => {
      c[key] = getArrayRemoveSame([].concat(colorsLocation[key], config[key] || []))
    })

    return c
  }

  // arr to remove same one
  // item is string
  function getArrayRemoveSame (arr) {
    const nArr = []
    arr.forEach((i) => {
      if (!nArr.includes(i)) {
        nArr.push(i)
      }
    })
    return nArr
  }

  // init color list to choose them
  // can change some color ep:background, theme
  function initColorsList () {
    // init cache object when first init
    if (firstInitColors) {
      firstInitColors = false
      Object.keys(pfConfig).forEach((key) => {
        /^colors/.test(key) && initColorsHtml(key, pfConfig[key])
      })
    } else {
      // is not first init
      Object.keys(pfConfig).forEach((key) => {
        if (/^colors/.test(key)) {
          // if new config content is not same to cache colors list, reload this colors html by name
          pfConfig[key] !== cacheColors[key] && initColorsHtml(key, pfConfig[key])
        }
      })
    }
  }

  // init html about choose color
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
      // name is dom`s name of class pf-content
      $(`[name="${key}"]`).length && $(`[name="${key}"]`).append(dom)
    })
  }

  // children dom in color html
  function colorHtmlItem (name, item) {
    const doms = {
      'colorBackground': `<span style="color: ${colorReverse(item)}">${backgroundText[item]}</span>`
    }
    return doms[name] || ''
  }

  // color reverse, use #ffffff, do not use #fff
  function colorReverse (OldColorValue) {
    var OldColorValue = "0x" + OldColorValue.replace(/#/g, "")
    var str = "000000" + (0xFFFFFF - OldColorValue).toString(16)
    return '#' + str.substring(str.length - 6, str.length)
  }

  // change config by checkbox
  function changeConfigByCheckbox (ev) {
    const { name, checked } = ev
    pfConfig[name] = checked
    localStorage.setItem('pfConfig', JSON.stringify(pfConfig))
    const changerObj = {
      'stickyLeft': () => stickyBetween(),
      'stickyRight': () => stickyBetween(),
      'hiddenAnswerRightFooter': () => changeVersion(),
      'hiddenLogo': () => changeVersion(),
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
      'zoomAnswerImage': () => changeVersion(),
      'titleIco': () => changeTitleIco(),
      'colorBackground': () => changeColorBackground(),
      'colorTheme': () => changeColorTheme(),
      'title': () => changeTitle(),
      'customizeCss': () => changeCustomCss()
    }
    if (/^position/.test(name)) {
      initPositionPage()
    } else {
      changerObj[name] && changerObj[name]()
    }
  }

  function changeCustomCss() {
    const cssCustom = `<style type="text/css" id="pf-css-custom">${pfConfig.customizeCss}</style>`
    $('#pf-css-custom') && $('#pf-css-custom').remove()
    $('head').append(cssCustom)
  }

  // change page title
  function changeTitle () {
    document.title = pfConfig.title || thisPageTitle
  }

  // change icon at page title
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
    $('.pf-left-container')[0] && ($('.pf-left-container')[0].style.display = $('.pf-left-container .Sticky').children().length > 0 ? 'block' : 'none')
    $('.GlobalSideBar')[0] && ($('.GlobalSideBar')[0].style.display = $('.GlobalSideBar .Sticky').children().length > 0 ? 'block' : 'none')
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
      `.QuestionHeader .QuestionHeader-content,.QuestionHeader-footer .QuestionHeader-footer-inner,.QuestionHeader-content,.Question-main,.AppHeader-inner,.TopstoryPageHeader,.Topstory-container,.ExploreHomePage,.QuestionWaiting,.SearchTabs-inner,.Search-container,.ProfileHeader,.Profile-main,.CollectionsDetailPage,.ColumnPageHeader-content,.QuestionPage .RichContent .ContentItem-actions.is-fixed,.SettingsMain,.App-main .Creator,.Collections-container,.Balance-Layout{width:${pfConfig.versionHeart}px!important;}img.lazy{${pfConfig.zoomAnswerImage !== 'default' ? pfConfig.zoomAnswerImage === 'hidden' ? 'display: none!important;' : 'width:' + pfConfig.zoomAnswerImage + '!important' : ''}}.QuestionHeader-main,.SearchMain,.Profile-mainColumn,.CollectionsDetailPage-mainColumn,.Collections-mainColumn,.Balance-Main{width:${qMByVersionHeart[pfConfig.versionHeart]}!important;margin-right:0!important;}.Question-sideColumn{display: ${pfConfig.hiddenAnswerRightFooter ? 'none' : 'block'}}.ZhihuLogoLink,.TopTabNavBar-logo-3d0k{${pfConfig.hiddenLogo ? 'display: none!important;' : ''}}}`
      + '</style>'
    $('#pf-css-version') && $('#pf-css-version').remove()
    $('head').append(cssVersion)
  }

  // change page color add css
  function changeColorBackground () {
    const filter = {
      '#ffffff': { invert: 0, 'hue-rotate': '0' },
      '#15202b': { invert: 0.7, 'hue-rotate': '180deg', contrast: 1.7 },
      '#000000': { invert: 1, 'hue-rotate': '180deg' },
    }
    const fi = filter[pfConfig.colorBackground]
    // use filter to reverse color
    const cssColor = `<style type="text/css" id="pf-css-background">html,html img,.pf-color-radio-item{${filterObj(fi)}}</style>`
    $('#pf-css-background') && $('#pf-css-background').remove()
    $('head').append(cssColor)
  }

  function filterObj (fi) {
    return `filter: ${Object.keys(fi).map((name) => `${name}(${fi[name]})`).join(' ')};`
  }

  // change page theme add css
  function changeColorTheme () {
    const objBg = getCssTheme()
    const cssColor = `<style type="text/css" id="pf-css-theme">${Object.keys(objBg).map(i => objBg[i]()).join('')}</style>`
    $('#pf-css-theme') && $('#pf-css-theme').remove()
    $('head').append(cssColor)
    // add css at iframe
    document.querySelector('.Iframe') && document.querySelector('.Iframe').contentWindow.document.querySelector('head').append(cssColor)
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


  //hex -> rgba
  function hexToRgba (hex, opacity) {
    return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
      + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')'
  }

  // reverse color at background
  function reverseCss (color, isImportant = false, name = 'color') {
    return pfConfig.colorBackground !== '#ffffff' ? `${name}: ${colorReverse(color)}${isImportant ? '!important' : ''};` : ''
  }

  // reverse color's content at background
  function reverseCssCon (color) {
    return pfConfig.colorBackground !== '#ffffff' ? colorReverse(color) : color
  }

  function getCssTheme () {
    const { colorTheme } = pfConfig
    return {
      bg () {
        return ``
      },
      bg08 () {
        return `.QuestionType--active, html[data-theme=dark] .QuestionType--active {background: ${hexToRgba(colorTheme, '0.08')}!important;}`
      },
      color () {
        return `.QuestionType--active, html[data-theme=dark] .QuestionType--active,.QuestionType--active .QuestionType-icon, html[data-theme=dark] .QuestionType--active .QuestionType-icon,.HotListNav-item.is-active,.HotListNav-sortableItem[data-hotlist-identifier=total].is-active, html[data-theme=dark] .HotListNav-sortableItem[data-hotlist-identifier=total].is-active,.TabNavBarItem-tab-MS9i.TabNavBarItem-isActive-1iXL,.pf-open-modal:hover{color: ${colorTheme}!important}`
      }
    }
  }

  // init html and css, init config
  function initHtml () {
    const dom = function(p,a,c,k,e,r){e=function(c){return(c<62?'':e(parseInt(c/62)))+((c=c%62)>35?String.fromCharCode(c+29):c.toString(36))};if('0'.replace(0,e)==0){while(c--)r[e(c)]=k[c];k=[function(e){return r[e]||e}];e=function(){return'([06-9c-fh-zA-Z]|1\\w)'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('<9 V="display: none;"7="0-mark"><9 7="0-A-W"><9 7="0-A"><9 7="0-A-X">样式编辑器</9><9 7="0-A-n"><Y 7="0-o"><k><a B="#0-l-Z">基础设置</a></k><k><a B="#0-l-C">颜色设置</a></k><k><a B="#0-l-t">配置导出导入</a></k><!--<k><a B="#0-l-10-n">返回内容设置</a></k>--></Y><9 7="0-p"><9 D="0-l-Z"><q>基础设置</q><9 7="0-c-9"><h 7="0-6">版心大小</h><6><8 7="0-8"d="K"e="c"f="11"/>11</6><6><8 7="0-8"d="K"e="c"f="12"/>12</6><6><8 7="0-8"d="K"e="c"f="13"/>13</6></9><9 7="0-c-9"><h 7="0-6">回答问题栏位置</h><6><8 7="0-8"d="L"e="c"f="o"/>左侧</6><6><8 7="0-8"d="L"e="c"f="p"/>右侧</6><6><8 7="0-8"d="L"e="c"f="r"/>隐藏</6></9><9 7="0-c-9"><h 7="0-6">回答问题栏优先级</h><6><8 7="0-8"d="u"e="c"f="1"/>1</6><6><8 7="0-8"d="u"e="c"f="2"/>2</6><6><8 7="0-8"d="u"e="c"f="3"/>3</6><6><8 7="0-8"d="u"e="c"f="4"/>4</6><6><8 7="0-8"d="u"e="c"f="5"/>5</6></9><9 7="0-c-9"><h 7="0-6">创作中心位置</h><6><8 7="0-8"d="M"e="c"f="o"/>左侧</6><6><8 7="0-8"d="M"e="c"f="p"/>右侧</6><6><8 7="0-8"d="M"e="c"f="r"/>隐藏</6></9><9 7="0-c-9"><h 7="0-6">创作中心优先级</h><6><8 7="0-8"d="v"e="c"f="1"/>1</6><6><8 7="0-8"d="v"e="c"f="2"/>2</6><6><8 7="0-8"d="v"e="c"f="3"/>3</6><6><8 7="0-8"d="v"e="c"f="4"/>4</6><6><8 7="0-8"d="v"e="c"f="5"/>5</6></9><9 7="0-c-9"><h 7="0-6">圆桌模块位置</h><6><8 7="0-8"d="N"e="c"f="o"/>左侧</6><6><8 7="0-8"d="N"e="c"f="p"/>右侧</6><6><8 7="0-8"d="N"e="c"f="r"/>隐藏</6></9><9 7="0-c-9"><h 7="0-6">圆桌模块优先级</h><6><8 7="0-8"d="w"e="c"f="1"/>1</6><6><8 7="0-8"d="w"e="c"f="2"/>2</6><6><8 7="0-8"d="w"e="c"f="3"/>3</6><6><8 7="0-8"d="w"e="c"f="4"/>4</6><6><8 7="0-8"d="w"e="c"f="5"/>5</6></9><9 7="0-c-9"><h 7="0-6">收藏夹栏位置</h><6><8 7="0-8"d="O"e="c"f="o"/>左侧</6><6><8 7="0-8"d="O"e="c"f="p"/>右侧</6><6><8 7="0-8"d="O"e="c"f="r"/>隐藏</6></9><9 7="0-c-9"><h 7="0-6">收藏夹栏优先级</h><6><8 7="0-8"d="x"e="c"f="1"/>1</6><6><8 7="0-8"d="x"e="c"f="2"/>2</6><6><8 7="0-8"d="x"e="c"f="3"/>3</6><6><8 7="0-8"d="x"e="c"f="4"/>4</6><6><8 7="0-8"d="x"e="c"f="5"/>5</6></9><9 7="0-c-9"><h 7="0-6">指南14位置</h><6><8 7="0-8"d="P"e="c"f="o"/>左侧</6><6><8 7="0-8"d="P"e="c"f="p"/>右侧</6><6><8 7="0-8"d="P"e="c"f="r"/>隐藏</6></9><9 7="0-c-9"><h 7="0-6">指南14优先级</h><6><8 7="0-8"d="y"e="c"f="1"/>1</6><6><8 7="0-8"d="y"e="c"f="2"/>2</6><6><8 7="0-8"d="y"e="c"f="3"/>3</6><6><8 7="0-8"d="y"e="c"f="4"/>4</6><6><8 7="0-8"d="y"e="c"f="5"/>5</6></9><9 7="0-m-9"><6><h 7="0-6">左侧栏是否固定</h><8 7="0-8"d="stickyLeft"e="m"f="E"/></6></9><9 7="0-m-9"><6><h 7="0-6">右侧栏是否固定</h><8 7="0-8"d="stickyRight"e="m"f="E"/></6></9><9 7="0-m-9"><6><h 7="0-6">隐藏15</h><8 7="0-8"d="hiddenLogo"e="m"f="E"/></6></9><9 7="0-raido-9 0-zoom-answer-image"><h 7="0-6">回答和专栏图片缩放</h><9 7="0-n"><6><8 7="0-8"d="z"e="c"f="r"/>隐藏</6><6><8 7="0-8"d="z"e="c"f="16"/>极小(16)</6><6><8 7="0-8"d="z"e="c"f="17"/>小(17)</6><6><8 7="0-8"d="z"e="c"f="18"/>中(18)</6><6><8 7="0-8"d="z"e="c"f="default"/>默认</6></9></9><9 7="0-m-9"><6><h 7="0-6">回答页面右侧信息隐藏</h><8 7="0-8"d="hiddenAnswerRightFooter"e="m"f="E"/></6></9><9 7="0-c-9"><h 7="0-6">更改网页标题图片</h><br/><6 7="0-c-j-F"><8 7="0-8"d="G"e="c"f="Q"/><j H="I://Q.githubassets.19/1a/R.svg"J="Q"7="0-c-j"></6><6 7="0-c-j-F"><8 7="0-8"d="G"e="c"f="1b"/><j H="I://g.csdnimg.cn/1c/15/favicon32.S"J="1b"7="0-c-j"></6><6 7="0-c-j-F"><8 7="0-8"d="G"e="c"f="1d"/><j H="I://b-gold-cdn.xitu.io/1a/v2/R.S"J="1d"7="0-c-j"></6><6 7="0-c-j-F"><8 7="0-8"d="G"e="c"f="T"/><j H="I://1c.T.19/heifetz/R.S"J="T"7="0-c-j"></6></9><9 7="0-c-9"><h 7="0-6">更改网页标题</h><8 7="0-8"d="X"e="text"V="height: 25px;"/></9></9><9 D="0-l-C"><q>颜色设置</q><9 7="0-c-9 0-C-W"><9 7="0-6">背景</9><9 7="0-n"d="colorsBackground"></9></9><!--<9 7="0-c-9 0-C-theme"><9 7="0-6">主题颜色</9><9 7="0-n"d="colorsTheme"></9></9>--></9><!--<9 D="0-l-10-n"></9>--><9 D="0-l-t"><q>配置导出导入</q><9 7="0-local-t"><i 7="0-export-t 0-i">导出当前配置</i><9 7="0-1e-dom"><s 7="0-s"d="configImport"placeholder="配置可参考导出格式"></s><i 7="0-1e-t 0-i">导入</i></9></9><9 7="0-1f-U"><9 7="0-6">自定义U</9><9 7="0-n"><s 7="0-s 0-8"d="customizeCss"></s><i 7="0-1f-U-i 0-i">确定</i></9></9></9></9></9><i 7="0-b-close 0-i">关闭</i></9></9></9>',[],78,'pf||||||label|class|input|div|||radio|name|type|value||span|button|img|li|set|checkbox|content|left|right|h3|hidden|textarea|config|positionAnswerIndex|positionCreationIndex|positionTableIndex|positionFavoritesIndex|positionFooterIndex|zoomAnswerImage|modal|href|color|id|on|select|titleIco|src|https|alt|versionHeart|positionAnswer|positionCreation|positionTable|positionFavorites|positionFooter|github|favicon|ico|zhihu|css|style|bg|title|ul|basis|back|1000|1200|1500|Footer|logo|100px|200px|400px|com|favicons|csdn|static|juejin|import|customize'.split('|'),0,{})

    const htmlModal = $(dom)
    $('.AppHeader-userInfo').prepend(openButton)
    $('.ColumnPageHeader-Button').prepend(openButton)
    $('body').append(htmlModal)
    $('.pf-open-modal')[0] && ($('.pf-open-modal')[0].onclick = buttonModalShow)
    $('.pf-b-close')[0].onclick = buttonModalHidden
    $('.pf-export-config')[0].onclick = buttonExportConfig
    $('.pf-import-config')[0].onclick = buttonImportConfig
    $('.pf-customize-css-button')[0].onclick = () => changeConfig($('[name="customizeCss"]')[0])
    // add left box at home page
    const leftDom = $('<div class="pf-left-container" style="display: none; flex: 1; margin-right: 10px;"><div class="Sticky"></div></div>')
    $('.Topstory-container').prepend(leftDom)
    $('.QuestionWaiting').prepend(leftDom)
    initScrollHeader()
    // initScrollModal()
  }

  function initCss () {
    const cssOwn = '<style type="text/css" id="pf-css-own">' +
      `body{width:100%}@font-face{font-family:'own-iconfont';src:url('//at.alicdn.com/t/font_2324733_zogpuw5b208.eot');src:url('//at.alicdn.com/t/font_2324733_zogpuw5b208.eot?#iefix') format('embedded-opentype'),url('//at.alicdn.com/t/font_2324733_zogpuw5b208.woff2') format('woff2'),url('//at.alicdn.com/t/font_2324733_zogpuw5b208.woff') format('woff'),url('//at.alicdn.com/t/font_2324733_zogpuw5b208.ttf') format('truetype'),url('//at.alicdn.com/t/font_2324733_zogpuw5b208.svg#own-iconfont') format('svg')}.iconfont{font-family:'own-iconfont' !important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-webkit-text-stroke-width:.2px;-moz-osx-font-smoothing:grayscale}.pf-mark{box-sizing:border-box;position:fixed;height:100%;width:100%;top:0;left:0;background:rgba(0,0,0,0.6);z-index:9999;overflow-y:auto}.pf-mark textarea,.pf-mark input{box-sizing:border-box}.pf-mark .pf-modal-bg{position:relative;height:100%;width:100%;min-height:400px}.pf-mark .pf-modal-bg .pf-modal{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:500px;height:400px;background:#fff;z-index:99999;padding:12px;border-radius:12px}.pf-mark .pf-modal-bg .pf-modal ::-webkit-scrollbar{width:.25rem;height:.25rem;background:#eee}.pf-mark .pf-modal-bg .pf-modal ::-webkit-scrollbar-track{border-radius:0}.pf-mark .pf-modal-bg .pf-modal ::-webkit-scrollbar-thumb{border-radius:0;background:#bbb;transition:all .2s;border-radius:.25rem}.pf-mark .pf-modal-bg .pf-modal ::-webkit-scrollbar-thumb:hover{background-color:rgba(95,95,95,0.7)}.pf-mark .pf-modal-bg .pf-modal .pf-modal-title{padding-bottom:12px;font-size:18px;font-weight:bold}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content{display:flex;height:340px;width:100%;font-size:14px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-left{width:100px;border-right:1px solid #ddd;list-style:none;margin:0px;padding:0}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-left li{padding:4px 0}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-left li a{text-decoration:none;color:#111f2c}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right{flex:1;overflow-y:auto;scroll-behavior:smooth;padding:0 12px 100px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right>div{padding-bottom:24px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right h3{margin-top:4px;margin-bottom:8px;font-size:18px;font-weight:bold}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis .pf-zoom-answer-image{display:flex}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis .pf-zoom-answer-image .pf-content{flex:1}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis .pf-zoom-answer-image .pf-content label{display:block}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis>div{border-bottom:1px solid #eee;padding:4px 0}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis>div label{padding-right:4px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-label::after{content:'：'}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-radio-img-select{display:inline-block;text-align:center}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-radio-img-select .pf-radio-img{width:32px;height:32px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-radio-img-select input{margin:0;display:none}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-radio-img-select input:checked+.pf-radio-img{border:2px solid #4286f4}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label{display:inline-block;width:100px;height:50px;position:relative;margin-right:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label input,.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label span{position:absolute;top:50%;transform:translateY(-50%);z-index:1}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label input{left:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label input:checked+.pf-color-radio-item{border:2px solid #4286f4}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label span{right:20px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label .pf-color-radio-item{width:100%;height:100%;border:2px solid transparent;border-radius:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-color .pf-content{padding:4px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-import-dom,.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-customize-css .pf-content{padding-top:8px;display:flex;align-items:center}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-import-dom .pf-textarea,.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-customize-css .pf-content .pf-textarea{width:70%;height:50px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-import-dom button,.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-config .pf-customize-css .pf-content button{height:50px;line-height:50px;width:25%;margin-left:5%;padding:0 !important}.pf-mark .pf-modal-bg .pf-modal .pf-button{padding:4px 8px;border-radius:4px;background:#ddd;position:relative;border:1px solid #bbb}.pf-mark .pf-modal-bg .pf-modal .pf-button:hover{background:#eee}.pf-mark .pf-modal-bg .pf-modal .pf-button:active::after{content:'';position:absolute;width:100%;height:100%;top:0;left:0;background:rgba(0,0,0,0.2)}.pf-mark .pf-modal-bg .pf-modal .pf-button:focus{outline:none}.pf-open-modal{margin-right:12px;cursor:pointer}.GlobalSideBar-navList{margin-bottom:10px;background:#fff;overflow:hidden;border-radius:2px;box-shadow:0 1px 3px rgba(18,18,18,0.1);box-sizing:border-box}.Question-main .Question-mainColumn,.ListShortcut{flex:1;width:100%}.AnswerAuthor{margin-left:12px}.ModalWrap .ModalExp-content{height:0 !important;overflow:hidden}.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard{width:48% !important}`
      + '</style>'
    $('head').append(cssOwn)
  }

  // init css or data when document start
  (function initStartDocument () {
    const config = localStorage.getItem('pfConfig')
    const nConfig = config ? JSON.parse(config) : {}
    pfConfig = getPfConfigAfterFormat(nConfig)
    initCss()
    changeVersion()
    changeColorBackground()
    changeColorTheme()
    changeCustomCss()
  })()

  // the html and data init when document onload
  window.onload = () => {
    initHtml()
    initData()
  }

  window.onscroll = () => {
    initScrollHeader()
  }

  // init dom at page
  function initScrollHeader () {
    if ($('.TopstoryPageHeader-aside')[0] && !$('.TopstoryPageHeader-aside .pf-open-modal')[0]) {
      $('.TopstoryPageHeader-aside').prepend(openButton)
      $('.TopstoryPageHeader-aside .pf-open-modal')[0] && ($('.TopstoryPageHeader-aside .pf-open-modal')[0].onclick = buttonModalShow)
    }

    if ($('.PageHeader.is-shown .QuestionHeader-side')[0] && !$('.PageHeader.is-shown .QuestionHeader-side .pf-open-modal')[0]) {
      $('.PageHeader.is-shown .QuestionHeader-side').prepend(openButton)
      $('.PageHeader.is-shown .QuestionHeader-side .pf-open-modal')[0] && ($('.PageHeader.is-shown .QuestionHeader-side .pf-open-modal')[0].onclick = buttonModalShow)
    }
  }

  // init scroll about js modal to find id at <a></a>
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