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
  dark: function (darkKey: EThemeDark) {
    const { background, background2, color, color2 } = THEME_CONFIG_DARK[darkKey];
    const cssColor1 =
      `#CTZ_DIALOG_MAIN,.ctz-block-box>button,.ctz-footer,#CTZ_CLOSE_DIALOG,.ctz-commit,.ctz-export-answer,#CTZ_OPEN_BUTTON,.ctz-export-article` +
      `,.Modal-content,.Modal-content div,.Menu-item.is-active,.Select-list button:active,.Select-list button:hover,.Popover-content button` +
      `,.zu-main div,.modal-dialog,.zh-profile-card div,.QuestionAnswers-answerAdd div,.QuestionAnswers-answerAdd label,.Tabs-link,.toolbar-section button` +
      `,.css-yd95f6,.css-g9ynb2,.css-i9srcr,.css-i9srcr div,.Modal-modal-wf58 div,.css-arjme8 div,.css-arjme8 label,.css-arjme8 h1,.css-13brsx3,.css-1ta275q div` +
      `,.Creator-mainColumn .Card div,.Comments-container div,.SettingsMain div,.KfeCollection-PayModal-modal div,.KfeCollection-CouponCard-selectLabel,.KfeCollection-CouponCard-optionItem-text,.KfeCollection-PayModal-modal-icon` +
      `,.NavItemClassName,.LinkCard-title,.Creator div,.Creator span,.Modal-wrapper textarea,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1` +
      `,.css-r38x5n div,.css-1dwlho,.LiveDetailsPage-root-aLVPj div,.css-1b0ypf8 div,.css-1b0ypf8 a,.css-np3nxw div` +
      `,.PostEditor-wrapper>div:last-of-type div,.PostEditor-wrapper>div:last-of-type label,.ToolsQuestion a,.ToolsQuestion font,.utils-frostedGlassEffect-2unM div,.utils-frostedGlassEffect-2unM span` +
      `,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a,.aria-primary-color-style.aria-secondary-background p,.aria-primary-color-style.aria-secondary-background h2` +
      `,#feedLives div,#feedLives a,.Card-card-2K6v,.Card-card-2K6v div,.Card-card-2K6v h3,._Invite_container_30SP h2,._Invite_container_30SP h1` +
      `,.ExploreHomePage-square div,.ExploreHomePage-square a,.jsNavigable a,#TopstoryContent h2,[role="contentinfo"] div,.css-1e1wubc,.css-1e1wubc div` +
      `{color: ${color}!important}`;

    const cssC2 = `.css-o7lu8j{color: ${color2}!important}`;
    const cssCB2 = `css-1x3upj1,.ctz-content-left>a:hover,.PlaceHolder-inner,.PlaceHolder-mask path{color: ${background2}!important}`;
    const cssColorLink = `.css-1esjagr,.css-ruirke,.css-117anjg a.UserLink-link{color: deepskyblue;}.css-1tu59u4{fill: deepskyblue}`; // 超链接颜色，解决黑夜模式下看不清的问题
    const cssBorderB = `.MenuBar-root-rQeFm{border-color: ${background}!important;}`;
    const cssDialogBorder = `#${ID_DIALOG}{border: 1px solid ${background2}}.ctz-menu-top>a.target{border-bottom: 4px solid ${color};color: ${color};}`;
    const cssColorUseBg1 = `${this.cssNamesColorUserBackground1}{color: ${background}!important}`;

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

    return addPrefix(
      this.doSetCSS(background, background2) + cssColor1 + cssCB2 + cssC2 + cssBorderB + cssDialogBorder + pageLearning + cssColorUseBg1 + cssColorLink
    );
  },
  light: function (lightKey: EThemeLight) {
    const { background, background2 } = THEME_CONFIG_LIGHT[lightKey];
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
    const cssColorUseBg1 = `${this.cssNamesColorUserBackground1}{color: ${background}!important}`;
    return this.doSetCSS(background, background2) + borderColor + cssHeader + cssColorUseBg1;
  },
  /** 设置字体颜色 */
  text: function () {
    const { colorText1 } = store.getConfig();
    const styleColorText1 = `.ContentItem-title, body` + `{color: ${colorText1}!important;}`;
    return colorText1 ? styleColorText1 : '';
  },
  doSetCSS: function (background: string, background2: string): string {
    const cssBg = `${this.cssNamesBackground1}{background-color: ${background}!important;}`;
    const cssBg2 = `${this.cssNamesBackground2}{background-color:${background2}!important;background:${background2}!important;}`;
    const cssBgTransparent = `${this.cssNamesBackgroundTransparent}{background-color: transparent!important;background: transparent!important;}`;
    const input = `.SignContainer-content input:-webkit-autofill{-webkit-box-shadow: inset 0 0 0 30px ${background2}!important;}`;
    return cssBg + cssBg2 + cssBgTransparent + input;
  },
  /** 使用背景色1的元素名称 */
  cssNamesBackground1:
    `.ctz-content-right>div:nth-of-type(2n)` +
    `,body,.Input-wrapper,.toolbar-section button:hover` +
    `,.ContentItem-actions.ZVideoToolbar,.ZVideoToolbar button,.VideoAnswerPlayer-stateBar,.skeleton,.Community-ContentLayout` +
    `,.css-i9srcr,.css-i9srcr div,.css-127i0sx,.css-1wi7vwy,.css-1ta275q,.css-mk7s6o,.css-1o83xzo .section div,.PostItem` +
    `,.Report-list tr:nth-child(odd),.LinkCard.new,.Post-content,.Post-content .ContentItem-actions,.Messages-newItem` +
    `,.Modal-wrapper textarea,.New-RightCard-Outer-Dark,.WriteIndexLayout-main,.Messages-item:hover,.Menu-item.is-active` +
    `,.css-djayhh,.css-5i468k,.css-1iazx5e div,.LiveDetailsPage-root-aLVPj,.WikiLanding,.GlobalSideBar-navLink:hover,.Popover-arrow:after` +
    `,.Sticky button:hover,.Sticky button:hover div,.Sticky button:hover span,.Sticky a:hover,.Sticky a:hover button,.Sticky a:hover div,.Sticky a:hover span,.Sticky li:hover` +
    `,.Popover-content button:hover,::-webkit-scrollbar-thumb,.ZVideoComment .css-kt4t4n,.css-1j8bif6>.css-11v6bw0,.css-1e1wubc,.css-1svx44c,.css-5d3bqp`,
  /** 使用背景色2的元素名称 */
  cssNamesBackground2:
    `#${ID_DIALOG},#CTZ-BLOCK-LIST .ctz-black-item,#CTZ_OPEN_BUTTON` +
    `,.Card,.HotItem,.AppHeader,.Topstory-content>div,.PlaceHolder-inner,.PlaceHolder-bg,.ContentItem-actions,.QuestionHeader,.QuestionHeader-footer ` +
    `,.QZcfWkCJoarhIYxlM_sG,.Sticky,.SearchTabs,.Modal-inner,.Modal-content,.Modal-content div` +
    `,.Select-list button:active,.Select-list button:hover,.modal-dialog,.modal-dialog-buttons,.zh-profile-card div,.QuestionAnswers-answerAdd div` +
    `,.css-1j23ebo,.Modal-modal-wf58 div,.css-arjme8 div,.css-arjme8 h1,.css-2lvw8d,.css-1os3m0m,.css-r38x5n div,.css-1mbpn2d,.css-1yjqd5z` +
    `,.Creator-mainColumn .Card>div,.Creator-mainColumn section,.Topbar,.AutoInviteItem-wrapper--desktop,.ProfileHeader-wrapper,.NotificationList,.SettingsFAQ` +
    `,.SelectorField-options .Select-option.is-selected,.SelectorField-options .Select-option:focus,.KfeCollection-PayModal-modal,.KfeCollection-PayModal-modal div` +
    `,.Community,.Report-header th,.Report-list tr:nth-child(2n),.Report-Pagination,.CreatorIndex-BottomBox-Item` +
    `,.ColumnPageHeader,.WriteIndexLayout-main>div,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1,.PostEditor-wrapper>div:last-of-type div` +
    `,.Select-option:focus,.ToolsQuestion div,[role="tablist"],.Topic-bar,.List-item .ContentItem-actions.ZVideoToolbar,.List-item .ZVideoToolbar button` +
    `,#AnswerFormPortalContainer div,.CreatorTable-tableHead,.BalanceTransactionList-Item,.utils-frostedGlassEffect-2unM,#feedLives,#feedLives div,#feedLives a` +
    `,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a` +
    `,.css-1o83xzo,.css-1o83xzo .section,.css-1cr4989,.css-xoei2t,.css-slqtjm,.css-1615dnb div,.css-1oqbvad,.css-1oqbvad div,.css-lxxesj div:not(.css-zprod5)` +
    `,.Card-card-2K6v,.Card-card-2K6v div,.LiveDetailsPage-root-aLVPj div,.LiveFooter-root-rXuoG,.css-1b0ypf8 div,.css-np3nxw div` +
    `,.PubIndex-CategoriesHeader,.ColumnHomeColumnCard,.Home-tabs,.Home-tabs div,.Home-swiper-container,.Home-swiper-container div,.BottomBarContainer` +
    ',.ResponderPage-root div,.WikiLandingItemCard,.WikiLandingEntryCard,._Invite_container_30SP,._Invite_container_30SP div,._Coupon_intro_1kIo,._Coupon_list_2uTb div' +
    `,.ExploreHomePage-square div,.ExploreHomePage-ContentSection-moreButton a,.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreColumnCard,.Notification-white` +
    `,.QuestionAnswers-answerAdd .InputLike,.QuestionAnswers-answerAdd .InputLike div,.InputLike` +
    `,.Popover-content,.Notifications-footer,::-webkit-scrollbar,.Messages-footer,.Popover-arrow:after` +
    `,.SettingsMain>div div:not(.StickerItem-Border):not(.SettingsMain-sideColumn):not(.UserHeader-VipBtn):not(.UserHeader-VipTip):not(.css-60n72z div)` +
    `,.css-guh6n2,.css-yqosku,.css-kt4t4n,.css-1j8bif6>div,.css-nffy12:hover,.css-1eltcns,.css-9kvgnm,.css-jd7qm7,.css-19vq0tc,.css-rzwcnm,.css-1akh9z6` +
    `,.ListShortcut>div:not(.Question-mainColumn),.Chat,.ActionMenu,.Recommendations-Main,.KfeCollection-PcCollegeCard-root` +
    `,.signQr-container,.signQr-rightContainer>div,.Login-options,.Input-wrapper>input,.SignFlowInput-errorMask`,
  /** 背景色透明的元素名称 */
  cssNamesBackgroundTransparent:
    `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper,.css-1ggwojn,.css-3dzt4y,.css-u4sx7k` +
    `,.VideoPlaceholderContainer>section,.MoreAnswers .List-headerText,.ColumnHomeTop:before,.ColumnHomeBottom,.Popover button,.ChatUserListItem .Chat-ActionMenuPopover-Button`,
  cssNamesColorUserBackground1: `.css-z0izby`,
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
