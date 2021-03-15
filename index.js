// ==UserScript==
// @name         zhihu style
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
  // TODO: 页面圆角，颜色配置，背景颜色，阴影配置，部分字体大小，自定义样式textarea，部分页面间距调整，border配置，锚点颜色

  // const version = '0.0.1'
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
    colorBackground: '#ffffff', // background color
    colorsBackground: [],
    colorTheme: '#0066ff',
    colorsTheme: []
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

  let cacheColors = {} // cache color list
  let firstInitColors = true // is first init for color list

  let positionDoms = {} // cache dom for position
  let firstInitDoms = true // is first init for position
  let timeoutToFindCreator = null // timeout to find creator dom

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
    const config = localStorage.getItem('pfConfig')
    const nConfig = config ? JSON.parse(config) : {}
    pfConfig = getPfConfigAfterFormat(nConfig)

    for (let even of $('.pf-input')) {
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

    changeVersion()
    initPositionPage()
    changeTitleIco()
    changeColorBackground()
    initColorsList()
    // proxyServer()
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
        throttle(changeConfig(e.target), 300)
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
      'colorTheme': () => changeColorTheme()
      // 'stickyLeft': () => stickyBetween(),
      // 'stickyRight': () => stickyBetween(),
    }
    if (/^position/.test(name)) {
      initPositionPage()
    } else {
      changerObj[name] && changerObj[name]()
    }
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
      `.QuestionHeader .QuestionHeader-content,.QuestionHeader-footer .QuestionHeader-footer-inner,.QuestionHeader-content,.Question-main,.AppHeader-inner,.TopstoryPageHeader,.Topstory-container,.ExploreHomePage,.QuestionWaiting,.SearchTabs-inner,.Search-container,.ProfileHeader,.Profile-main,.CollectionsDetailPage,.ColumnPageHeader-content,.QuestionPage .RichContent .ContentItem-actions.is-fixed,.SettingsMain,.App-main .Creator,.Collections-container,.Balance-Layout{width:${pfConfig.versionHeart}px!important;}img.lazy{${pfConfig.zoomAnswerImage !== 'default' ? pfConfig.zoomAnswerImage === 'hidden' ? 'display: none!important;' : 'width:' + pfConfig.zoomAnswerImage + '!important' : ''}}.QuestionHeader-main,.SearchMain,.Profile-mainColumn,.CollectionsDetailPage-mainColumn,.Collections-mainColumn,.Balance-Main{width:${qMByVersionHeart[pfConfig.versionHeart]}!important;margin-right:0!important;}.Question-sideColumn{display: ${pfConfig.hiddenAnswerRightFooter ? 'none' : 'block'}}.ZhihuLogoLink{${pfConfig.hiddenLogo ? 'display: none!important;' : ''}}}`
      + '</style>'
    $('#pf-css-version') && $('#pf-css-version').remove()
    $('head').append(cssVersion)
  }

  // change page color add css
  function changeColorBackground () {
    const objBg = getCssBackground()
    const cssColor = `<style type="text/css" id="pf-css-background">${Object.keys(objBg).map(i => objBg[i]()).join('')}</style>`
    $('#pf-css-background') && $('#pf-css-background').remove()
    $('head').append(cssColor)
    // remove style on xen maker
    $('.VideoGallery-root-7Z1Ci')[0] && $('.VideoGallery-root-7Z1Ci').removeAttr('style', '')
    $('.GalleryCell-title-38fBA')[0] && $('.GalleryCell-title-38fBA').removeAttr('style', '')
    $('.GalleryCell-footer-h9wzn')[0] && $('.GalleryCell-footer-h9wzn').removeAttr('style', '')
    // add css at iframe
    document.querySelector('.Iframe') && document.querySelector('.Iframe').contentWindow.document.querySelector('head').append(cssColor)
    // change theme color after background, to solve theme color be covered
    changeColorTheme()
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
        return `.QuestionType--active, html[data-theme=dark] .QuestionType--active,.QuestionType--active .QuestionType-icon, html[data-theme=dark] .QuestionType--active .QuestionType-icon{color: ${colorTheme}!important}`
      }
    }
  }

  // get css background config
  function getCssBackground () {
    const { colorBackground } = pfConfig
    return {
      bg () {
        return `html,.HotListNav-wrapper,#root,.QuestionWaiting-typesTopper,.AppHeader,.Card,.ContentItem-actions,.GlobalSideBar-navList,.pf-mark .pf-modal-bg .pf-modal,.QuestionHeader,.QuestionHeader-footer,.CornerButton,.TopicVoteCheckbox>input+label,.Popover-content,.Popover-arrow:after,.ProfileHeader-wrapper,.HoverCard,.HoverCard-loading,.InputLike,.css-1sry9ao,.css-1akafz2,.Editable-toolbar,.AnswerForm-footer,.css-lpo24q,.css-16zrry9,.css-ovbogu,.css-1v840mj,.Input-wrapper,.css-ygii7h,.skeleton,.AnalyticsChart-tooltip,.CreatorRecruit-container,.CreatorRecruitTitle,.CreatorRecruitDesc-image,.CreatorRecruit-section,#app,.VideoGallery-root-7Z1Ci,.css-1bwzp6r,.css-w14w61,.css-w215gm,.ExploreSpecialCard,.ExploreHomePage-ContentSection-moreButton a,.ExploreCollectionCard,.ExploreColumnCard,.ExploreRoundtableCard,.QuestionWaiting-types,.ColumnPageHeader,.ColumnHomeColumnCard,.Post-content,.PostItem,.CommentsV2-footer,.CommentsV2-withPagination,.PagingButton,.Topbar,.CommentEditorV2-inputWrap--active,.Modal-inner,.zu-top,.SearchTabs,.KfeCollection-PcCollegeCard-root{background:${colorBackground}!important;}body{${reverseCss(colorBackground)}}`
      },
      bgTransparent () {
        return `.ColumnHomeTop:before,.ColumnHomeBottom {${colorBackground !== '#ffffff' ? 'background: transparent!important;' : ''}}`
      },
      reColor () {
        return `.ContentItem-title,.ContentItem-actions,.css-qqgmyv .AppHeader-TabsLink.is-active,.css-qqgmyv .AppHeader-TabsLink:hover,.GlobalWrite-topTitle,li a,.GlobalSideBar-navNumber, html[data-theme=dark] .GlobalSideBar-navNumber,input.Input,.QuestionHeader-title,.QuestionTopicReviewCardExtraInfo-cardTitle,.AnswerAuthor-user-name,.NumberBoard-itemValue,.ProfileHeader-detail,.CreatorEntrance-title,.SelfCollectionItem-title,.PlaceHolder-inner,.css-jt1vdv,.css-nymych,.css-p54g1l,.css-uq88u1,.css-8u7moq,.css-1204lgo,.css-nsw6sf,.css-1dpmqsl,.css-1myqwel,.CreatorRecruitTitle,.SkuTitle-skuTitleText-iVc91 span,.GalleryCell-title-38fBA,.ToolsCopyright-FieldName,.ColumnHomeTitle-text,.ColumnHomeColumnCard-description,.ColumnHomeColumnCard-meta,.ColumnHomeTop-subTitle,.BlockTitle,.PostItem-Title,.CommentTopbar-title,.WriteIndex-pageTitle,.WriteCover-previewWrapper--empty::after,.WriteCover-uploadIcon,.Search-container,.Search-container,.TopSearch-itemLink,.Search-container .SearchItem-meta{${reverseCss(colorBackground, true)}}.WriteCover-previewWrapper--empty::after{content: '添加题图'}`
      },
      reBgf6f6f6 () {
        return `.GlobalSideBar-navLink:hover,.GlobalSideBar-navNumber,.Input-wrapper.Input-wrapper--grey,.SimpleSearchBar-input,.VotableTopicCard,.Menu-item.is-active,.Select-option:focus,.PlaceHolder-inner,.css-1vwmxb4:hover,.css-1da4iq8,.css-oqge09,.css-1stnbni:hover,.css-cyj5pk,.skeleton__line,.css-1xegbra,.CreatorRecruitSourceItemSet,.App-root-74PLx,.css-xevy9w tbody tr:nth-of-type(odd),.ToolsCopyright-FormSet:disabled .ToolsCopyright-input,.ExploreSpecialCard-contentTag,.Recommendations-Main{${reverseCss('#f6f6f6', true, 'background')}}.ToolsCopyright-FormSet:disabled .ToolsCopyright-input,.QuestionType, html[data-theme=dark] .QuestionType{opacity: 0.3}.QuestionType, html[data-theme=dark] .QuestionType,.CommentEditorV2-inputWrap,.WriteCover-wrapper,body{${reverseCss('#f6f6f6', false, 'background')}}`
      },
      reBgEBEBEB () {
        return `.css-1b1irul{${reverseCss('#EBEBEB', true, 'background')}}`
      },
      reColor9b9b9b () {
        return `.RichContent.is-collapsed .RichContent-inner:hover,.ExploreRoundtableCard-questionCounts{${reverseCss('#9b9b9b', true)}}`
      },
      reColor444444 () {
        return `.CreatorEntrance-indexPageTitle,.ProfileSideCreator-readCountNumber,.AuthorInfo-name,.css-1sry9ao,.css-dh57eh,.CreatorRecruitDesc-text,.CreatorRecruitApplyCondition-additionalIntroTitle,.CreatorRecruitApplyCondition-subtitle,.CreatorRecruitApplyCondition-optionalSourceItemSource,.CreatorRecruitSourceItemSet-name,.CreatorRecruitApplyCondition-conditionItemText,.GalleryCell-footer-h9wzn,.css-1stnbni,.css-1esj255,.ToolsCopyright-Header,.ToolsCopyright-declareList,.ToolsCopyright-checkboxDesc,.ExploreColumnCard-intro,.ExploreCollectionCard-contentExcerpt,.ExploreCollectionCard-creatorName{${reverseCss('#444444', true)}}.QuestionType,.ColumnHomeRecommendation-refreshButton,.ColumnHomeBottom-requestButton,.ColumnHomeTop-writeButton,.MinorHotSpot-TitleLine{${reverseCss('#444444', false)}}`
      },
      reColor646464 () {
        return `.AuthorInfo-badgeText,.RichContent.is-collapsed .RichContent-inner:hover,.CreatorRecruitSourceItemSet-bindStatusText,.css-6nxlm6,.ColumnHomeRecommendation-refreshButton,.ColumnHomeBottom-requestButton{${reverseCss('#646464', true)}}`
      },
      reColor8590a6 () {
        return `.MoreAnswers .List-headerText,.CornerButton,.TopicVoteCheckbox>input+label,.css-1dhr6ij,.css-xevy9w thead th,.css-1cn472d,.ToolsCopyright-addCopy,.ExploreSpecialCard-contentTag,.ExploreHomePage-ContentSection-moreButton a,.QuestionType .QuestionType-icon, html[data-theme=dark] .QuestionType .QuestionType-icon,.PostItem-Footer,.CommentItemV2-time,.Editable-control,.CommentCollapseButton,.KfeCollection-PcCollegeCard-status{${reverseCss('#8590a6', true)}}`
      },
      reColor808080 () {
        return `.css-1vwmxb4,.css-cyj5pk,.css-1qe9rzp{${reverseCss('#808080', true)}}`
      },
      reBorderColorEbebeb () {
        return `.QuestionHeaderTopicMeta.Card,.Popover-content,.css-1xegbra,.css-1842imd,.ToolsCopyright-FormSet:disabled .ToolsCopyright-input,.BlockTitle,.CommentEditorV2-inputWrap--active,.CommentCollapseButton{${reverseCss('#ebebeb', true, 'border-color')}}`
      },
      reBorderColor141414 () {
        return `.QuestionHeaderTopicMeta.Card, .Popover-content,.Popover-arrow:after,.ColumnHomeTop-writeButton{${reverseCss('#141414', true, 'border-color')}}`
      },
      reBorder () {
        return `.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreHomePage-ContentSection-moreButton a,.ExploreColumnCard,.ColumnHomeColumnCard {border: 1px solid ${reverseCssCon(colorBackground)};}
        `
      },
    }
  }

  // init html and css, init config
  function initHtml () {
    const dom = function (p, a, c, k, e, r) { e = function (c) { return (c < 62 ? '' : e(parseInt(c / 62))) + ((c = c % 62) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if ('0'.replace(0, e) == 0) { while (c--) r[e(c)] = k[c]; k = [function (e) { return r[e] || e }]; e = function () { return '([06-9c-fh-zA-Z]|1\\w)' }; c = 1 }; while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]); return p }('<9 U="display: none;"7="0-mark"><9 7="0-z-V"><9 7="0-z"><9 7="0-z-title">U s啊</9><9 7="0-z-n"><W 7="0-o"><k><a A="#0-l-X">基础设置</a></k><k><a A="#0-l-B">颜色设置</a></k><k><a A="#0-l-s">配置导出导入</a></k><!--<k><a A="#0-l-Y-n">返回内容设置</a></k>--></W><9 7="0-p"><9 C="0-l-X"><q>基础设置</q><9 7="0-c-9"><h 7="0-6">版心大小</h><6><8 7="0-8"d="J"e="c"f="Z"/>Z</6><6><8 7="0-8"d="J"e="c"f="10"/>10</6><6><8 7="0-8"d="J"e="c"f="11"/>11</6></9><9 7="0-c-9"><h 7="0-6">回答问题栏位置</h><6><8 7="0-8"d="K"e="c"f="o"/>左侧</6><6><8 7="0-8"d="K"e="c"f="p"/>右侧</6><6><8 7="0-8"d="K"e="c"f="r"/>隐藏</6></9><9 7="0-c-9"><h 7="0-6">回答问题栏优先级</h><6><8 7="0-8"d="t"e="c"f="1"/>1</6><6><8 7="0-8"d="t"e="c"f="2"/>2</6><6><8 7="0-8"d="t"e="c"f="3"/>3</6><6><8 7="0-8"d="t"e="c"f="4"/>4</6><6><8 7="0-8"d="t"e="c"f="5"/>5</6></9><9 7="0-c-9"><h 7="0-6">创作中心位置</h><6><8 7="0-8"d="L"e="c"f="o"/>左侧</6><6><8 7="0-8"d="L"e="c"f="p"/>右侧</6><6><8 7="0-8"d="L"e="c"f="r"/>隐藏</6></9><9 7="0-c-9"><h 7="0-6">创作中心优先级</h><6><8 7="0-8"d="u"e="c"f="1"/>1</6><6><8 7="0-8"d="u"e="c"f="2"/>2</6><6><8 7="0-8"d="u"e="c"f="3"/>3</6><6><8 7="0-8"d="u"e="c"f="4"/>4</6><6><8 7="0-8"d="u"e="c"f="5"/>5</6></9><9 7="0-c-9"><h 7="0-6">圆桌模块位置</h><6><8 7="0-8"d="M"e="c"f="o"/>左侧</6><6><8 7="0-8"d="M"e="c"f="p"/>右侧</6><6><8 7="0-8"d="M"e="c"f="r"/>隐藏</6></9><9 7="0-c-9"><h 7="0-6">圆桌模块优先级</h><6><8 7="0-8"d="v"e="c"f="1"/>1</6><6><8 7="0-8"d="v"e="c"f="2"/>2</6><6><8 7="0-8"d="v"e="c"f="3"/>3</6><6><8 7="0-8"d="v"e="c"f="4"/>4</6><6><8 7="0-8"d="v"e="c"f="5"/>5</6></9><9 7="0-c-9"><h 7="0-6">收藏夹栏位置</h><6><8 7="0-8"d="N"e="c"f="o"/>左侧</6><6><8 7="0-8"d="N"e="c"f="p"/>右侧</6><6><8 7="0-8"d="N"e="c"f="r"/>隐藏</6></9><9 7="0-c-9"><h 7="0-6">收藏夹栏优先级</h><6><8 7="0-8"d="w"e="c"f="1"/>1</6><6><8 7="0-8"d="w"e="c"f="2"/>2</6><6><8 7="0-8"d="w"e="c"f="3"/>3</6><6><8 7="0-8"d="w"e="c"f="4"/>4</6><6><8 7="0-8"d="w"e="c"f="5"/>5</6></9><9 7="0-c-9"><h 7="0-6">指南12位置</h><6><8 7="0-8"d="O"e="c"f="o"/>左侧</6><6><8 7="0-8"d="O"e="c"f="p"/>右侧</6><6><8 7="0-8"d="O"e="c"f="r"/>隐藏</6></9><9 7="0-c-9"><h 7="0-6">指南12优先级</h><6><8 7="0-8"d="x"e="c"f="1"/>1</6><6><8 7="0-8"d="x"e="c"f="2"/>2</6><6><8 7="0-8"d="x"e="c"f="3"/>3</6><6><8 7="0-8"d="x"e="c"f="4"/>4</6><6><8 7="0-8"d="x"e="c"f="5"/>5</6></9><9 7="0-m-9"><6><h 7="0-6">左侧栏是否固定</h><8 7="0-8"d="stickyLeft"e="m"f="D"/></6></9><9 7="0-m-9"><6><h 7="0-6">右侧栏是否固定</h><8 7="0-8"d="stickyRight"e="m"f="D"/></6></9><9 7="0-m-9"><6><h 7="0-6">隐藏13</h><8 7="0-8"d="hiddenLogo"e="m"f="D"/></6></9><9 7="0-raido-9 0-zoom-answer-image"><h 7="0-6">回答和专栏图片缩放</h><9 7="0-n"><6><8 7="0-8"d="y"e="c"f="r"/>隐藏</6><6><8 7="0-8"d="y"e="c"f="14"/>极小(14)</6><6><8 7="0-8"d="y"e="c"f="15"/>小(15)</6><6><8 7="0-8"d="y"e="c"f="16"/>中(16)</6><6><8 7="0-8"d="y"e="c"f="default"/>默认</6></9></9><9 7="0-m-9"><6><h 7="0-6">回答页面右侧信息隐藏</h><8 7="0-8"d="hiddenAnswerRightFooter"e="m"f="D"/></6></9><9 7="0-c-9"><h 7="0-6">更改网页标题图片</h><br/><6 7="0-c-i-E"><8 7="0-8"d="F"e="c"f="P"/><i G="H://P.githubassets.17/18/Q.svg"I="P"7="0-c-i"></6><6 7="0-c-i-E"><8 7="0-8"d="F"e="c"f="19"/><i G="H://g.csdnimg.cn/1a/13/favicon32.R"I="19"7="0-c-i"></6><6 7="0-c-i-E"><8 7="0-8"d="F"e="c"f="1b"/><i G="H://b-gold-cdn.xitu.io/18/v2/Q.R"I="1b"7="0-c-i"></6><6 7="0-c-i-E"><8 7="0-8"d="F"e="c"f="S"/><i G="H://1a.S.17/heifetz/Q.R"I="S"7="0-c-i"></6></9></9><9 C="0-l-B"><q>颜色设置</q><9 7="0-c-9 0-B-V"><9 7="0-6">背景颜色（后两种可以看作夜间模式）</9><9 7="0-n"d="colorsBackground"></9></9><!--<9 7="0-c-9 0-B-theme"><9 7="0-6">主题颜色</9><9 7="0-n"d="colorsTheme"></9></9>--></9><!--<9 C="0-l-Y-n"></9>--><9 C="0-l-s"><q>配置导出导入</q><j 7="0-export-s 0-j">导出当前配置</j><9 7="0-1c-dom"><T 7="0-T"d="configImport"></T><j 7="0-1c-s 0-j">导入</j></9></9></9></9><j 7="0-b-close 0-j">关闭</j></9></9></9>', [], 75, 'pf||||||label|class|input|div|||radio|name|type|value||span|img|button|li|set|checkbox|content|left|right|h3|hidden|config|positionAnswerIndex|positionCreationIndex|positionTableIndex|positionFavoritesIndex|positionFooterIndex|zoomAnswerImage|modal|href|color|id|on|select|titleIco|src|https|alt|versionHeart|positionAnswer|positionCreation|positionTable|positionFavorites|positionFooter|github|favicon|ico|zhihu|textarea|style|bg|ul|basis|back|1000|1200|1500|Footer|logo|100px|200px|400px|com|favicons|csdn|static|juejin|import'.split('|'), 0, {})

    const htmlModal = $(dom)
    const cssOwn = '<style type="text/css" id="pf-css-own">' +
      `body{width:100%}.pf-mark{position:fixed;height:100%;width:100%;top:0;left:0;background:rgba(0,0,0,0.6);z-index:9999;overflow-y:auto}.pf-mark .pf-modal-bg{position:relative;height:100%;width:100%;min-height:400px}.pf-mark .pf-modal-bg .pf-modal{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:500px;height:400px;background:#fff;z-index:99999;padding:12px;border-radius:12px}.pf-mark .pf-modal-bg .pf-modal ::-webkit-scrollbar{width:.25rem;height:.25rem;background:#eee}.pf-mark .pf-modal-bg .pf-modal ::-webkit-scrollbar-track{border-radius:0}.pf-mark .pf-modal-bg .pf-modal ::-webkit-scrollbar-thumb{border-radius:0;background:#bbb;transition:all .2s;border-radius:.25rem}.pf-mark .pf-modal-bg .pf-modal ::-webkit-scrollbar-thumb:hover{background-color:rgba(95,95,95,0.7)}.pf-mark .pf-modal-bg .pf-modal .pf-modal-title{padding-bottom:12px;font-size:18px;font-weight:bold}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content{display:flex;height:340px;width:100%;font-size:14px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-left{width:100px;border-right:1px solid #ddd;list-style:none;margin:0px;padding:0}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-left li{padding:4px 0}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-left li a{text-decoration:none;color:#111f2c}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right{flex:1;overflow-y:auto;scroll-behavior:smooth;padding:0 12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right h3{margin-top:4px;margin-bottom:8px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis .pf-zoom-answer-image{display:flex}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis .pf-zoom-answer-image .pf-content{flex:1}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis .pf-zoom-answer-image .pf-content label{display:block}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis>div{border-bottom:1px solid #eee;padding:4px 0}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-basis>div label{padding-right:4px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-label::after{content:'：'}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-radio-img-select{display:inline-block;text-align:center}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-radio-img-select .pf-radio-img{width:32px;height:32px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-radio-img-select input{margin:0;display:none}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right .pf-radio-img-select input:checked+.pf-radio-img{border:2px solid #4286f4}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label{display:inline-block;width:100px;height:50px;position:relative;margin-right:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label input,.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label span{position:absolute;top:50%;transform:translateY(-50%);z-index:1}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label input{left:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label input:checked+.pf-color-radio-item{border:2px solid #4286f4}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label span{right:20px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right [name='colorsBackground'] .pf-color-choose-label .pf-color-radio-item{width:100%;height:100%;border:2px solid transparent;border-radius:12px}.pf-mark .pf-modal-bg .pf-modal .pf-modal-content .pf-right #pf-set-color .pf-content{padding:4px}.pf-mark .pf-modal-bg .pf-modal .pf-button{appearance:auto;text-rendering:auto !important;color:-internal-light-dark(black, white) !important;letter-spacing:normal !important;word-spacing:normal !important;text-transform:none !important;text-indent:0px !important;text-shadow:none !important;display:inline-block !important;text-align:center !important;align-items:flex-start !important;cursor:default !important;background-color:-internal-light-dark(#efefef, #3b3b3b) !important;box-sizing:border-box !important;margin:0em !important;font:400 13.3333px Arial !important;padding:1px 6px !important;border-width:2px !important;border-style:outset !important;border-color:-internal-light-dark(#767676, #858585) !important;border-image:initial !important;border-radius:2px !important}.GlobalSideBar-navList{margin-bottom:10px;background:#fff;overflow:hidden;border-radius:2px;box-shadow:0 1px 3px rgba(18,18,18,0.1);box-sizing:border-box}.Question-main .Question-mainColumn,.ListShortcut{flex:1;width:100%}.AnswerAuthor{margin-left:12px}.ModalWrap .ModalExp-content{height:0 !important;overflow:hidden}.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard{width:48% !important}`
      + '</style>'

    $('head').append(cssOwn)

    const openButton = '<i class="pf-open-modal">打</i>'
    $('.AppHeader-userInfo').prepend(openButton)
    $('.ColumnPageHeader-Button').prepend(openButton)
    $('body').append(htmlModal)

    $('.pf-open-modal')[0] && ($('.pf-open-modal')[0].onclick = buttonModalShow)
    $('.pf-b-close')[0].onclick = buttonModalHidden
    $('.pf-export-config')[0].onclick = buttonExportConfig
    $('.pf-import-config')[0].onclick = buttonImportConfig

    // add left box at home page
    const leftDom = $('<div class="pf-left-container" style="display: none; flex: 1; margin-right: 10px;"><div class="Sticky"></div></div>')
    $('.Topstory-container').prepend(leftDom)
    $('.QuestionWaiting').prepend(leftDom)
  }
  initHtml()
  initData()
})()