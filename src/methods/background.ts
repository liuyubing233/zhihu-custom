import { dom, domById, fnInitDomStyle } from '../commons/tools';
import {
  CLASS_INPUT_CLICK,
  ID_DIALOG,
  INPUT_NAME_THEME,
  INPUT_NAME_THEME_DARK,
  INPUT_NAME_ThEME_LIGHT,
  THEMES,
  THEME_CONFIG_DARK,
  THEME_CONFIG_LIGHT,
} from '../configs';
import { store } from '../store';
import { ETheme, EThemeDark, EThemeLight } from '../types';

/** 修改页面背景的 css */
const myBackground = {
  init: function () {
    const { themeDark = EThemeDark.夜间护眼一, themeLight = EThemeLight.默认 } = store.getConfig();
    const innerHTML = this.change(themeDark, themeLight);
    fnInitDomStyle('CTZ_STYLE_BACKGROUND', innerHTML);
  },
  change: function (themeDark: EThemeDark, themeLight: EThemeLight) {
    const getBackground = () => {
      if (this.isUseDark()) return this.dark(themeDark);
      if (themeLight === EThemeLight.默认) return this.default();
      return this.light(themeLight);
    };
    return getBackground() + this.text();
  },
  isUseDark: () => {
    const { theme = ETheme.自动 } = store.getConfig();
    if (theme === ETheme.自动) {
      // 获取浏览器颜色
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      return prefersDarkScheme.matches;
    }
    return theme === ETheme.深色;
  },
  default: () => '.GlobalSideBar-navList{background: #fff}',
  dark: (darkKey: EThemeDark) => {
    const { background, background2, color, color2 } = THEME_CONFIG_DARK[darkKey];
    const cssBg =
      `#${ID_DIALOG},#CTZ-BLOCK-LIST .ctz-black-item` +
      `,.Card,.ListShortcut>div,.HotItem,.AppHeader,.Topstory-content>div,.PlaceHolder-inner,.PlaceHolder-bg,.ContentItem-actions,.QuestionHeader,.QuestionHeader-footer ` +
      `,.QZcfWkCJoarhIYxlM_sG,.Sticky,.SearchTabs,.Modal-inner,.Modal-content,.Modal-content div,.Menu-item.is-active,.Popover-content button:hover` +
      `,.Select-list button:active,.Select-list button:hover,.modal-dialog,.modal-dialog-buttons,.zh-profile-card div,.QuestionAnswers-answerAdd div` +
      `,.css-1j23ebo,.Modal-modal-wf58 div,.css-arjme8 div,.css-arjme8 h1,.css-2lvw8d,.css-1os3m0m,.css-r38x5n div,.css-1mbpn2d,.css-1yjqd5z` +
      `,.Creator-mainColumn .Card>div,.Creator-mainColumn section,.Topbar,.AutoInviteItem-wrapper--desktop,.ProfileHeader-wrapper,.NotificationList,.SettingsFAQ` +
      `,.SettingsMain div:not(.StickerItem-Border),.SelectorField-options .Select-option.is-selected,.SelectorField-options .Select-option:focus,.KfeCollection-PayModal-modal,.KfeCollection-PayModal-modal div` +
      `,.Community,.Report-header th,.Report-list tr:nth-child(2n),.Report-Pagination,.CreatorIndex-BottomBox-Item,.Sticky div` +
      `,.ColumnPageHeader,.WriteIndexLayout-main>div,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1,.PostEditor-wrapper>div:last-of-type div` +
      `,.Select-option:focus,.ToolsQuestion div,[role="tablist"],.Topic-bar,.List-item .ContentItem-actions.ZVideoToolbar,.List-item .ZVideoToolbar button` +
      `,#AnswerFormPortalContainer div,.CreatorTable-tableHead,.BalanceTransactionList-Item,.utils-frostedGlassEffect-2unM,#feedLives,#feedLives div,#feedLives a` +
      `,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a` +
      `,.css-1o83xzo,.css-1o83xzo .section,.css-1cr4989,.css-xoei2t,.css-slqtjm,.css-1615dnb div,.css-1oqbvad,.css-1oqbvad div,.css-lxxesj div:not(.css-zprod5)` +
      `,.Card-card-2K6v,.Card-card-2K6v div,.LiveDetailsPage-root-aLVPj div,.LiveFooter-root-rXuoG,.css-1b0ypf8 div,.css-np3nxw div` +
      `,.PubIndex-CategoriesHeader,.ColumnHomeColumnCard,.Home-tabs,.Home-tabs div,.Home-swiper-container,.Home-swiper-container div,.BottomBarContainer` +
      ',.ResponderPage-root div,.WikiLandingItemCard,.WikiLandingEntryCard,._Invite_container_30SP,._Invite_container_30SP div,._Coupon_intro_1kIo,._Coupon_list_2uTb div' +
      `,.ExploreHomePage-square div,.ExploreHomePage-ContentSection-moreButton a,.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreColumnCard,.Notification-white` +
      `,.css-guh6n2,.css-yqosku` +
      `{background: ${background}!important;}`;
    const cssBg2 =
      `.ctz-content-right>div:nth-of-type(2n)` +
      `,body,.Input-wrapper,.Popover-content,.QuestionAnswers-answerAdd .InputLike,.QuestionAnswers-answerAdd .InputLike div,.toolbar-section button:hover` +
      `,.ContentItem-actions.ZVideoToolbar,.ZVideoToolbar button,.VideoAnswerPlayer-stateBar,.Notifications-footer,.skeleton,.Community-ContentLayout` +
      `,.css-1j8bif6>div,.css-i9srcr,.css-i9srcr div,.css-127i0sx,.css-1wi7vwy,.css-1ta275q,.css-mk7s6o,.css-1o83xzo .section div` +
      `,.Report-list tr:nth-child(odd),.LinkCard.new,.Post-content,.Post-content .ContentItem-actions` +
      `,.Sticky a:hover,.Sticky a:hover>div,.Modal-wrapper textarea,.New-RightCard-Outer-Dark,.WriteIndexLayout-main,.InputLike,.Popover-content div` +
      `,.css-djayhh,.css-5i468k,.css-1iazx5e div,.LiveDetailsPage-root-aLVPj,.WikiLanding,.GlobalSideBar-navLink:hover` +
      `{background:${background2}!important;}`;
    const cssBgTransparent =
      `.css-3dzt4y,.VideoPlaceholderContainer>section,.MoreAnswers .List-headerText,.css-u4sx7k,.ColumnHomeTop:before,.ColumnHomeBottom` +
      `,.Popover button` +
      `{background: transparent!important;}`;
    const cssColor1 =
      `.ctz-block-box>button,.ctz-footer,#CTZ_CLOSE_DIALOG,.ctz-commit,.ctz-export-answer` +
      `,.Modal-content,.Modal-content div,.Menu-item.is-active,.Select-list button:active,.Select-list button:hover,.Popover-content button` +
      `,.zu-main div,.modal-dialog,.zh-profile-card div,.QuestionAnswers-answerAdd div,.QuestionAnswers-answerAdd label,.Tabs-link,.toolbar-section button` +
      `,.css-yd95f6,.css-g9ynb2,.css-i9srcr,.css-i9srcr div,.Modal-modal-wf58 div,.css-arjme8 div,.css-arjme8 label,.css-arjme8 h1,.css-13brsx3,.css-1ta275q div` +
      `,.Creator-mainColumn .Card div,.Comments-container div,.SettingsMain div,.KfeCollection-PayModal-modal div,.KfeCollection-CouponCard-selectLabel,.KfeCollection-CouponCard-optionItem-text,.KfeCollection-PayModal-modal-icon` +
      `,.NavItemClassName,.LinkCard-title,.Creator div,.Creator span,.Modal-wrapper textarea,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1` +
      `,.css-r38x5n div,.css-1dwlho,.LiveDetailsPage-root-aLVPj div,.css-1b0ypf8 div,.css-1b0ypf8 a,.css-np3nxw div` +
      `,.PostEditor-wrapper>div:last-of-type div,.PostEditor-wrapper>div:last-of-type label,.ToolsQuestion a,.ToolsQuestion font,.utils-frostedGlassEffect-2unM div,.utils-frostedGlassEffect-2unM span` +
      `,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a,.aria-primary-color-style.aria-secondary-background p,.aria-primary-color-style.aria-secondary-background h2` +
      `,#feedLives div,#feedLives a,.Card-card-2K6v,.Card-card-2K6v div,.Card-card-2K6v h3,._Invite_container_30SP h2,._Invite_container_30SP h1` +
      `,.ExploreHomePage-square div,.ExploreHomePage-square a,.jsNavigable a,#TopstoryContent h2,[role="contentinfo"] div` +
      `{color: ${color}!important}`;

    const cssC2 = `.css-o7lu8j{color: ${color2}!important}`;
    const cssCB2 = `css-1x3upj1,.ctz-content-left>a:hover,.PlaceHolder-inner,.PlaceHolder-mask path{color: ${background2}!important}`;
    const cssBorderB = `.MenuBar-root-rQeFm{border-color: ${background}!important;}`;
    const cssDialogBorder = `#${ID_DIALOG}{border: 1px solid ${background2}}.ctz-menu-top>a.target{border-bottom: 4px solid ${color};color: ${color};}`;

    // 添加 html[data-theme=dark] 前缀
    const addPrefix = (i: string) =>
      i
        .split(',')
        .map((i) => `html[data-theme=dark] ${i}`)
        .join(',');

    // 知学堂、会员
    const pageLearning =
      `.TopNavBar-fixMode-qXKMs,.index-tabWrap-4Smyx,.index-bannerItem-3o3D7,.LearningRouteCard-pathContent-j3jVv{background: ${background}!important;}` +
      `.LearningRouteCard-pathItem-xin1f .LearningRouteCard-content-kw2RW .LearningRouteCard-title-do7ND{color: ${color}!important;}`;

    return addPrefix(cssBg + cssBg2 + cssColor1 + cssBgTransparent + cssCB2 + cssC2 + cssBorderB + cssDialogBorder + pageLearning);
  },
  light: (lightKey: EThemeLight) => {
    const { background, background2 } = THEME_CONFIG_LIGHT[lightKey];
    const cssBg =
      `.ctz-content-right>div:nth-of-type(2n)` +
      `,body,.Post-content,.HotListNavEditPad,.ColumnPageHeader,.ZVideoToolbar,.position-suspensionSearch.focus` +
      `,.Modal-modal-wf58,.Community-ContentLayout,.App-root-8rX7N,.MenuBar-root-rQeFm,.TopNavBar-fixMode-4nQmh` +
      `,.App-active-dPFhH,.CategorySection-categoryList-mrt3Z,.zhuanlan .Post-content .ContentItem-actions` +
      `,.zhuanlan .ContentItem-actions,.LinkCard.new,.WebPage-root-g7WXc,.KfeCollection-FeedBlockSetting` +
      `,.ShelfTopNav-root-eb3BX,.signQr-container,.css-16h0l39,.css-1so3nbl,.css-13mrzb0,.css-17aitwe,.NavigationBar-mainArea,.Notification-white` +
      `{background-color: ${background}!important;}`;
    const cssBg2 =
      `#${ID_DIALOG},#${ID_DIALOG} select,#${ID_DIALOG} input,#${ID_DIALOG} textarea,#CTZ_SET_FILTER` +
      `,.QuestionHeader,.Card:not(.GrowthLevel-panelCard),.HotItem,.Recommendations-Main,.GlobalSideBar-navList,.SearchSubTabs,.CommentsV2-withPagination` +
      `,.QuestionHeader-footer,.HoverCard,.ContentItem-actions,.MoreAnswers .List-headerText,.Topbar,.CommentsV2-footer` +
      `,.Select-plainButton,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreSpecialCard,.ExploreColumnCard` +
      `,.ExploreHomePage-ContentSection-moreButton a,.QuestionWaiting-types,.AutoInviteItem-wrapper--desktop` +
      `,.Popover-content,.Notifications-footer,.SettingsFAQ,.Popover-arrow:after,.Messages-footer,.Modal-inner` +
      `,.RichContent-actions,.KfeCollection-FeedBlockSetting,.CommentListV2-header-divider,.Input-wrapper:not(.Input-wrapper--grey)` +
      `,.TopstoryItem .ZVideoToolbar,.SearchTabs,.Topic-bar,.VotableTopicCard,textarea.FeedbackForm-inputBox-15yJ,.FeedbackForm-canvasContainer-mrde` +
      `,.css-mq2czy,.css-lpo24q,.css-16zrry9,.css-1v840mj,.css-ovbogu,.css-1h84h63,.css-u8y4hj,.css-1bwzp6r,.css-w215gm` +
      `,.InputLike,.AnswerForm-footer,.Editable-toolbar,.Chat,.css-ul9l2m,.Balance-Main .Tabs,.Community,.Report-list tr:nth-child(2n)` +
      `,.Report-Pagination,.Report-list,.Report-header th,._Invite_container_30SP,.css-ssvpr2,.css-1p1lrh0,.zu-main` +
      `,.utils-frostedGlassEffect-2unM,.Card-card-2K6v,.UserLivesPage-page-GSje,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448` +
      `,.PubIndex-CategoriesHeader,.css-r9mkgf,.CornerButton,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-1vtgv04,.WikiLandingHeader` +
      `,.WikiLanding,.WikiLandingItemCard,.WikiLandingEntryCard,.SideNavs-navContainer-6VkAT,.App-root-cPFwn,.TopNavs-root-rwAr7,.App-root-qzkuH` +
      `,.App-actionTrigger-cCyD7,.ProductTrigger-root-amaSi,.App-infiniteContainer-nrxGj,.ActionTrigger-content-dPn6H,.App-card-pkbhv,.css-zvnmar` +
      `,.Login-options,.SignFlowInput-errorMask,.ColumnHomeColumnCard,.KfeCollection-PcCollegeCard-root,.KfeCollection-PcCollegeCard-wrapper` +
      `,.css-1j5d3ll,.css-iebf30,.css-1qjzmdv,.AnswerForm-footer,.css-g3xs10,.css-jlyj5p,.CommentEditorV2-inputUpload,.css-805ti0,.css-10fqe38` +
      `,.css-n9os37,.css-sdgtgb,.css-f955pw,.css-6tr06j,.css-pslzz3,.css-10rrwst,.css-1ne387d,.css-1bmbu2d,.css-mjg7l1,.css-1ulkprw,.css-1k8sxfm` +
      `,.css-a9sbyu,.CreatorIndex-BottomBox-Item,.css-1r9j229,.css-wgpue5,.css-1hwwfws,.css-1clwviw,.css-ndqbqd,.css-19v79p5,.css-f7rzgf,.css-106u01g` +
      `,.css-c29erj,.Modal-content,.Sticky,.css-2i2hyg,.css-1sz5gzk,.css-vvikez,.css-bnfl40,.css-kt4t4n,.css-127i0sx,.css-172osot,.css-3dzt4y,.HotList,.css-1rge9t3,.css-10wc74s,.css-hvo7ig` +
      `,.Question-mainColumnLogin,.css-l63y2t,.css-uhfrs2,.css-1os3m0m,.css-my2hkh,.css-lwqucw,.css-1o83xzo,.css-1nipbaf,.css-p4x5ie,.css-7hf26x,.css-xks12i,.css-fqja0q` +
      `,.css-slqtjm,.Sticky>ul,.css-1dja9sh,.css-np3nxw div,.AnswerAdd div,.css-lxxesj,.css-11oa45q,.css-dkeaqz,.css-1j9apkt,.css-1vnbimf,.css-1mbpn2d,.css-1yjqd5z` +
      `,.ToolsQuestion div,.Creator-mainColumn .Card>div:not(.GrowthLevel-panelCardContent),.css-djayhh,.css-1cr4989,.css-1rniuv1>ul,.css-1rniuv1>div,.css-1oqbvad,.css-1ta275q` +
      `,.Card>ul,.css-yckfye,.css-lztgnc` +
      `{background-color:${background2}!important;background:${background2}!important;}`;
    const cssBgTransparent = `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper,.css-1ggwojn{background-color: transparent!important;}`;
    const borderColor = `.MenuBar-root-rQeFm{border-color: ${background}!important;}`;
    // Header 变化
    const nodeAppHeader = dom('.AppHeader');
    const nodeTopStoryC = dom('.Topstory>div:not(.Topstory-container)');
    const elementHC = nodeAppHeader ? nodeAppHeader.classList || [] : [];
    const haveTopAD = nodeTopStoryC && nodeTopStoryC.childElementCount;
    const headerBelongAd = haveTopAD ? elementHC[elementHC.length - 1] : '';
    const cssHeader = `${
      headerBelongAd ? `.AppHeader:not(.${headerBelongAd})` : '.AppHeader'
    }{background-color:${background2}!important;background:${background2}!important;}`;
    return cssBg + cssBg2 + cssBgTransparent + borderColor + cssHeader;
  },
  /** 设置字体颜色 */
  text: function () {
    const { colorText1 } = store.getConfig();
    const styleColorText1 = `.ContentItem-title, body` + `{color: ${colorText1}!important;}`;
    return styleColorText1;
  },
};

/** 自定义样式方法 */
export const myCustomStyle = {
  init: function () {
    const nodeCustomStyle = dom('[name="textStyleCustom"]') as HTMLTextAreaElement;
    if (!nodeCustomStyle) return;
    const { customizeCss = '' } = store.getConfig();
    nodeCustomStyle.value = customizeCss;
    this.change(customizeCss);
  },
  change: (innerCus: string) => fnInitDomStyle('CTZ_STYLE_CUSTOM', innerCus),
};

/** 启用知乎默认的黑暗模式 */
export const onUseThemeDark = () => {
  dom('html')!.setAttribute('data-theme', myBackground.isUseDark() ? 'dark' : 'light');
};

/** 查找是否使用主题 */
export const loadFindTheme = () => {
  // 开始进入先修改一次
  onUseThemeDark();
  const elementHTML = dom('html');
  const muConfig = { attribute: true, attributeFilter: ['data-theme'] };
  if (!elementHTML) return;
  // 监听 html 元素属性变化
  const muCallback = function () {
    const themeName = elementHTML.getAttribute('data-theme');
    const isDark = myBackground.isUseDark();
    if ((themeName === 'dark' && !isDark) || (themeName === 'light' && isDark)) {
      onUseThemeDark();
    }
  };
  const muObserver = new MutationObserver(muCallback);
  muObserver.observe(elementHTML, muConfig);
};

/** 加载背景色 */
export const loadBackground = () => {
  myBackground.init();
};

/** 是否使用夜间模式 */
export const isDark = () => {
  return myBackground.isUseDark();
};

/** 添加背景色选择元素 */
export const addBackgroundElements = () => {
  const nodeCTZBackground = domById('CTZ_BACKGROUND');
  const nodeLight = domById('CTZ_BACKGROUND_LIGHT');
  const nodeDark = domById('CTZ_BACKGROUND_DARK');
  if (!nodeCTZBackground || !nodeLight || !nodeDark) return;
  // 主题选择
  const themeInner = THEMES.map(
    ({ label, value, background, color }) =>
      `<label>` +
      `<input class="${CLASS_INPUT_CLICK}" name="${INPUT_NAME_THEME}" type="radio" value="${value}"/>` +
      `<div style="background: ${background};color: ${color}">${label}</div>` +
      `</label>`
  ).join('');

  const themeLight = Object.keys(THEME_CONFIG_LIGHT)
    .map((key) => {
      const { background, color, name } = THEME_CONFIG_LIGHT[key as unknown as EThemeLight];
      return (
        `<label>` +
        `<input class="${CLASS_INPUT_CLICK}" name="${INPUT_NAME_ThEME_LIGHT}" type="radio" value="${key}"/>` +
        `<div style="background: ${background};color: ${color}">${name}</div>` +
        `</label>`
      );
    })
    .join('');

  const themeDark = Object.keys(THEME_CONFIG_DARK)
    .map((key) => {
      const { background, color, name } = THEME_CONFIG_DARK[key as unknown as EThemeDark];
      return (
        `<label>` +
        `<input class="${CLASS_INPUT_CLICK}" name="${INPUT_NAME_THEME_DARK}" type="radio" value="${key}"/>` +
        `<div style="background: ${background};color: ${color}">${name}</div>` +
        `</label>`
      );
    })
    .join('');

  nodeCTZBackground.innerHTML = themeInner;
  nodeLight.innerHTML = themeLight;
  nodeDark.innerHTML = themeDark;
};
