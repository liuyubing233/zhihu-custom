import { myStorage } from '../commons/storage';
import { dom, fnInitDomStyle } from '../commons/tools';
import {
  CLASS_INPUT_CLICK,
  CLASS_MESSAGE,
  ID_DIALOG,
  INPUT_NAME_THEME,
  INPUT_NAME_THEME_DARK,
  INPUT_NAME_ThEME_LIGHT,
  THEMES,
  THEME_CONFIG_DARK,
  THEME_CONFIG_LIGHT,
} from '../configs';
import { ETheme, EThemeDark, EThemeLight } from '../types';

/** 修改页面背景的 css */
const myBackground = {
  init: async function () {
    const { themeDark = EThemeDark.深色护眼一, themeLight = EThemeLight.默认 } = await myStorage.getConfig();
    const innerHTML = await this.change(themeDark, themeLight);
    fnInitDomStyle('CTZ_STYLE_BACKGROUND', innerHTML);
  },
  change: async function (themeDark: EThemeDark, themeLight: EThemeLight) {
    const getBackground = async () => {
      if (await this.isUseDark()) return this.dark(themeDark);
      if (+themeLight === EThemeLight.默认) return this.default();
      return this.light(themeLight);
    };
    return (await getBackground()) + (await this.text());
  },
  isUseDark: async () => {
    const { theme = ETheme.自动 } = await myStorage.getConfig();
    if (+theme === ETheme.自动) {
      // 获取浏览器颜色
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return +theme === ETheme.深色;
  },
  /** 设置字体颜色 */
  text: async function () {
    const { colorText1 } = await myStorage.getConfig();
    const styleColorText1 = `.ContentItem-title, body` + `{color: ${colorText1}!important;}`;
    return colorText1 ? styleColorText1 : '';
  },
  doSetCSS: function (background: string, background2: string): string {
    const cssBg = `${this.useBG1}{background-color: ${background}!important;}`;
    const cssBg2 = `${this.useBG2}{background-color:${background2}!important;background:${background2}!important;}`;
    const cssBgTransparent = `${this.useBGTran}{background-color: transparent!important;background: transparent!important;}`;
    const input = `.SignContainer-content input:-webkit-autofill{-webkit-box-shadow: inset 0 0 0 30px ${background2}!important;}`;
    return cssBg + cssBg2 + cssBgTransparent + input;
  },
  default: () => '.GlobalSideBar-navList{background: #fff}',
  light: function (lightKey: EThemeLight) {
    const { background, background2 } = THEME_CONFIG_LIGHT[lightKey];
    const borderColor = `.MenuBar-root-rQeFm{border-color: ${background}!important;}`;
    // Header 变化
    const nodeAppHeader = dom('.AppHeader');
    const nodeTopStoryC = dom('.Topstory>div:not(.Topstory-container)');
    const elementHC = nodeAppHeader ? nodeAppHeader.classList || [] : [];
    const haveTopAD = nodeTopStoryC && nodeTopStoryC.childElementCount;
    const headerBelongAd = haveTopAD ? elementHC[elementHC.length - 1] : '';
    const cssHeader = `${headerBelongAd ? `.AppHeader:not(.${headerBelongAd})` : '.AppHeader'}{background-color:${background2}!important;background:${background2}!important;}`;
    const cssColorUseBg1 = `${this.colorUseBG1}{color: ${background}!important}`;
    const menuTopBeforeAfter = `.ctz-menu-top>a.target::before,.ctz-menu-top>a.target::after{${this.menuBeforeAfter(background2)}}`;
    return this.doSetCSS(background, background2) + borderColor + cssHeader + cssColorUseBg1 + menuTopBeforeAfter;
  },
  dark: function (darkKey: EThemeDark) {
    const { background, background2, color, color2 } = THEME_CONFIG_DARK[darkKey];
    const c1 =
      `#${ID_DIALOG},.${CLASS_MESSAGE},#CTZ_MAIN input,#CTZ_MAIN textarea,.ctz-footer,#CTZ_CLOSE_DIALOG,.ctz-commit,#CTZ_OPEN_BUTTON,.ctz-export-collection-box p` +
      `,.Modal-content,.Modal-content div,.Menu-item.is-active,.Select-list button:active,.Select-list button:hover,.Popover-content button,.Modal-title` +
      `,.zu-main div,.modal-dialog,.zh-profile-card div,.QuestionAnswers-answerAdd div,.QuestionAnswers-answerAdd label,.Tabs-link,.toolbar-section button` +
      `,.css-yd95f6,.css-g9ynb2,.css-i9srcr,.css-i9srcr div,.Modal-modal-wf58 div,.css-arjme8 div,.css-arjme8 label,.css-arjme8 h1,.css-13brsx3,.css-1ta275q div` +
      `,.Creator-mainColumn .Card div,.Comments-container div,.SettingsMain div,.KfeCollection-PayModal-modal div,.KfeCollection-CouponCard-selectLabel,.KfeCollection-CouponCard-optionItem-text,.KfeCollection-PayModal-modal-icon` +
      `,.NavItemClassName,.LinkCard-title,.Creator div,.Creator span,.Modal-wrapper textarea,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1,.FeedbackModal-title` +
      `,.css-r38x5n div,.css-1dwlho,.LiveDetailsPage-root-aLVPj div,.css-1b0ypf8 div,.css-1b0ypf8 a,.css-np3nxw div,.css-10ub9de,.css-1wbvd3d,.css-1f4cz9u,.css-y42e6l,.css-jiu0xt,.css-1myqwel` +
      `,.PostEditor-wrapper>div:last-of-type div,.PostEditor-wrapper>div:last-of-type label,.ToolsQuestion a,.ToolsQuestion font,.utils-frostedGlassEffect-2unM div,.utils-frostedGlassEffect-2unM span` +
      `,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a,.aria-primary-color-style.aria-secondary-background p,.aria-primary-color-style.aria-secondary-background h2` +
      `,#feedLives div,#feedLives a,.Card-card-2K6v,.Card-card-2K6v div,.Card-card-2K6v h3,._Invite_container_30SP h2,._Invite_container_30SP h1,.ChatListGroup-SectionTitle .Zi,.Qrcode-container>div,.Qrcode-guide-message>div,.signQr-leftContainer button,.signQr-leftContainer a` +
      `,.ExploreHomePage-square div,.ExploreHomePage-square a,.jsNavigable a,#TopstoryContent h2,[role="contentinfo"] div,.css-1e1wubc,.css-1e1wubc div,.css-12kq1qx,.css-172osot div,.css-172osot a:last-child,.css-f2jj4r` +
      `,.css-10u695f,.css-wqf2py,.css-wmwsyx,.css-wmwsyx div,.CreatorSalt-personalInfo-name,.css-c3gbo3,.css-1ygg4xu blockquote,.css-r8ate4,.ant-collapse>.ant-collapse-item>.ant-collapse-header` +
      `,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-submenu-title:hover,.Creator-salt-author-welfare .Creator-salt-author-welfare-card h1,.css-u56wtg,.css-1hrberl` +
      `,.css-13e6wvn,.css-i0heim` +
      `{color: ${color}!important}`;
    const c2 = `.css-o7lu8j{color: ${color2}!important}`;
    const cB2 = `css-1x3upj1,.PlaceHolder-inner,.PlaceHolder-mask path,.css-1kxql2v{color: ${background2}!important}`;
    const cLink =
      `.css-1esjagr,.css-ruirke,.css-117anjg a.UserLink-link,.RichContent--unescapable.is-collapsed .ContentItem-rightButton,.css-1qap1n7,.ContentItem-more` +
      `,.ContentItem-title a:hover,.Profile-lightItem:hover,.Profile-lightItem:hover .Profile-lightItemValue,.css-p54aph:hover,.PushNotifications-item a:hover,.PushNotifications-item a` +
      `,.NotificationList-Item-content .NotificationList-Item-link:hover,.SettingsQA a,a.QuestionMainAction:hover,.SimilarQuestions-item .Button,.CreatorSalt-IdentitySelect-Button` +
      `,.signQr-leftContainer button:hover,.signQr-leftContainer a:hover,.Profile-sideColumnItemLink:hover,.FollowshipCard-link,.css-zzimsj:hover,.css-vphnkw,.css-1aqu4xd,.css-6m0nd1` +
      `,.NumberBoard-item.Button:hover .NumberBoard-itemName, .NumberBoard-item.Button:hover .NumberBoard-itemValue, .NumberBoard-itema:hover .NumberBoard-itemName, .NumberBoard-itema:hover .NumberBoard-itemValue` +
      `,a.external,.RichContent-EntityWord,.SideBarCollectionItem-title,.Tag-content,.LabelContainer div,.LabelContainer a,.KfeCollection-OrdinaryLabel-newStyle-mobile .KfeCollection-OrdinaryLabel-content,.KfeCollection-OrdinaryLabel-newStyle-pc .KfeCollection-OrdinaryLabel-content` +
      `,.KfeCollection-CreateSaltCard-button,.KfeCollection-PcCollegeCard-searchMore` +
      `{color: deepskyblue!important;}` +
      `.css-1tu59u4,.ZDI,.ZDI--PencilCircleFill24,.Zi,.Zi--ArrowDown{fill: deepskyblue!important;}`; // 超链接颜色，解决黑夜模式下看不清的问题
    const cBB = `.MenuBar-root-rQeFm{border-color: ${background}!important;}`;
    const cDB = `#${ID_DIALOG}{border: 1px solid ${background2}}`;
    const cssColorUseBg1 = `${this.colorUseBG1}{color: ${background}!important}`;
    const extraB1 = `.ztext pre,.ztext code{background: ${background}!important;}`;
    // 暗黑模式下的自定义按钮颜色
    const ownBtn = `.ctz-button{background: ${background2};border-color: ${color};color: ${color};}`;
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
    const menuTopBeforeAfter = `html[data-theme=dark] .ctz-menu-top>a.target::before,html[data-theme=dark] .ctz-menu-top>a.target::after{${this.menuBeforeAfter(background2)}}`;
    return addPrefix(this.doSetCSS(background, background2) + c1 + cB2 + c2 + cBB + cDB + pageLearning + cssColorUseBg1 + cLink + extraB1 + ownBtn) + menuTopBeforeAfter;
  },
  /** 使用背景色1的元素名称 */
  useBG1:
    `#${ID_DIALOG},.ctz-content-right>div:nth-of-type(2n),.ctz-content-left>a:hover,.ctz-black-item,.ctz-block-words-content>span` +
    `,body,.Input-wrapper,.toolbar-section button:hover` +
    `,.VideoAnswerPlayer-stateBar,.skeleton,.Community-ContentLayout` +
    `,.css-i9srcr,.css-i9srcr div,.css-127i0sx,.css-1wi7vwy,.css-1ta275q,.css-mk7s6o,.css-1o83xzo .section div,.PostItem` +
    `,.Report-list tr:nth-child(odd),.LinkCard.new,.Post-content,.Post-content .ContentItem-actions,.Messages-newItem` +
    `,.Modal-wrapper textarea,.New-RightCard-Outer-Dark,.WriteIndexLayout-main,.Messages-item:hover,.Menu-item.is-active` +
    `,.css-djayhh,.css-5i468k,.css-1iazx5e div,.LiveDetailsPage-root-aLVPj,.WikiLanding,.GlobalSideBar-navLink:hover,.Popover-arrow:after` +
    `,.Sticky button:hover,.Sticky button:hover div,.Sticky button:hover span,.Sticky a:hover,.Sticky a:hover button,.Sticky a:hover div,.Sticky a:hover span,.Sticky li:hover` +
    `,.Popover-content button:hover,.css-1j8bif6>.css-11v6bw0,.css-1e1wubc,.css-1svx44c,.css-5d3bqp` +
    `,.KfeCollection-IntroCard-newStyle-mobile,.KfeCollection-IntroCard-newStyle-pc,.FeeConsultCard,.Avatar,.TextMessage-sender,.ChatUserListItem--active` +
    `,.css-yoby3j,.css-wmwsyx,.css-wmwsyx button,.css-82b621,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-submenu-title:hover` +
    `,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-item:hover,.index-learnPath-dfrcu .index-learnContainer-9QR37 .index-learnShow-p3yvw .index-learnCard-vuCza,.index-courseCard-ebw4r` +
    ``,
  /** 使用背景色2的元素名称 */
  useBG2:
    `#CTZ_MAIN input,#CTZ_MAIN textarea,.${CLASS_MESSAGE},.ctz-content,.ctz-menu-top>a.target,.ctz-menu-top>a:hover span,#CTZ_OPEN_BUTTON,#CTZ_CLOSE_DIALOG:hover` +
    `,.Card,.HotItem,.AppHeader,.Topstory-content>div,.PlaceHolder-inner,.PlaceHolder-bg,.ContentItem-actions,.QuestionHeader,.QuestionHeader-footer ` +
    `,.QZcfWkCJoarhIYxlM_sG,.Sticky,.SearchTabs,.Modal-inner,.Modal-content,.Modal-content div` +
    `,.Select-list button:active,.Select-list button:hover,.modal-dialog,.modal-dialog-buttons,.zh-profile-card div,.QuestionAnswers-answerAdd div` +
    `,.css-1j23ebo,.Modal-modal-wf58 div,.css-arjme8 div,.css-arjme8 h1,.css-2lvw8d,.css-1os3m0m,.css-r38x5n div,.css-1mbpn2d,.css-1yjqd5z` +
    `,.Creator-mainColumn .Card>div,.Creator-mainColumn section,.Topbar,.AutoInviteItem-wrapper--desktop,.ProfileHeader-wrapper,.NotificationList,.SettingsFAQ` +
    `,.SelectorField-options .Select-option.is-selected,.SelectorField-options .Select-option:focus,.KfeCollection-PayModal-modal,.KfeCollection-PayModal-modal div` +
    `,.Community,.Report-header th,.Report-list tr:nth-child(2n),.Report-Pagination,.CreatorIndex-BottomBox-Item,.CreatorSalt-letter-wrapper` +
    `,.ColumnPageHeader,.WriteIndexLayout-main>div,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1,.PostEditor-wrapper>div:last-of-type div,.Creator-salt-new-author-content` +
    `,.Select-option:focus,.ToolsQuestion div,[role="tablist"],.Topic-bar,.List-item .ZVideoToolbar button,.Creator-salt-author-welfare .Creator-salt-author-welfare-card,.Creator-salt-author-welfare-banner` +
    `,#AnswerFormPortalContainer div,.CreatorTable-tableHead,.BalanceTransactionList-Item,.utils-frostedGlassEffect-2unM,#feedLives,#feedLives div,#feedLives a` +
    `,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a` +
    `,.css-1o83xzo,.css-1o83xzo .section,.css-1cr4989,.css-xoei2t,.css-slqtjm,.css-1615dnb div,.css-1oqbvad,.css-1oqbvad div,.css-lxxesj div:not(.css-zprod5)` +
    `,.Card-card-2K6v,.Card-card-2K6v div,.LiveDetailsPage-root-aLVPj div,.LiveFooter-root-rXuoG,.css-1b0ypf8 div,.css-np3nxw div,.css-1i12cbe` +
    `,.PubIndex-CategoriesHeader,.ColumnHomeColumnCard,.Home-tabs,.Home-tabs div,.Home-swiper-container,.Home-swiper-container div,.BottomBarContainer` +
    ',.ResponderPage-root div,.WikiLandingItemCard,.WikiLandingEntryCard,._Invite_container_30SP,._Invite_container_30SP div,._Coupon_intro_1kIo,._Coupon_list_2uTb div' +
    `,.ExploreHomePage-square div,.ExploreHomePage-ContentSection-moreButton a,.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreColumnCard,.Notification-white` +
    `,.QuestionAnswers-answerAdd .InputLike,.QuestionAnswers-answerAdd .InputLike div,.InputLike,.CreatorSalt-community-story-wrapper .CreatorSalt-community-story-table` +
    `,.Popover-content,.Notifications-footer,.Messages-footer,.Popover-arrow:after,.css-97fdvh>div,.css-4lspwd,.css-1e6hvbc,.css-k32okj,.ant-table-tbody>tr.ant-table-placeholder:hover>td` +
    `,.SettingsMain>div div:not(.StickerItem-Border):not(.SettingsMain-sideColumn):not(.UserHeader-VipBtn):not(.UserHeader-VipTip):not(.css-60n72z div),.CreatorSalt-community-story-wrapper` +
    `,.css-guh6n2,.css-yqosku,.css-kt4t4n,.css-1j8bif6>div,.css-nffy12:hover,.css-1eltcns,.css-9kvgnm,.css-jd7qm7,.css-19vq0tc,.css-rzwcnm,.css-1akh9z6` +
    `,.ListShortcut>div:not(.Question-mainColumn),.Chat,.ActionMenu,.Recommendations-Main,.KfeCollection-PcCollegeCard-root,.CreatorSalt-sideBar-wrapper,.ant-menu` +
    `,.signQr-container,.signQr-rightContainer>div,.Login-options,.Input-wrapper>input,.SignFlowInput-errorMask,.Write-school-search-bar .CreatorSalt-management-search,.CreatorSalt-Content-Management-Index` +
    `,.Topstory-container .TopstoryTabs>a::after,.ZVideo,.KfeCollection-CreateSaltCard,.CreatorSalt-personalInfo,.CreatorSalt-sideBar-item,.css-d1sc5t,.css-1gvsmgz,.css-u56wtg,.css-1hrberl` +
    `,.CreatorSalt-community-story-wrapper .CreatorSalt-community-story-header,.ant-table-tbody>tr>td,.CreatorSalt-management-wrapper .CreatorSalt-management-search,.ant-table-thead .ant-table-cell` +
    `,.TopNavBar-root-oL4f5,.App-root-9n77J,.CourseConsultation-corner-mddzk,.CourseConsultation-corner-mddzk .CourseConsultation-cornerButton-7ycYw,.CornerButtonToTop-cornerButton-thbFX,.LearningRouteCard-pathContent-j3jVv` +
    `,.index-item-u9evS`,
  /** 背景色透明的元素名称 */
  useBGTran:
    `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper,.css-1ggwojn,.css-3dzt4y,.css-u4sx7k` +
    `,.VideoPlaceholderContainer>section,.MoreAnswers .List-headerText,.ColumnHomeTop:before,.ColumnHomeBottom,.Popover button,.ChatUserListItem .Chat-ActionMenuPopover-Button`,
  colorUseBG1: `.css-z0izby`,
  menuBeforeAfter: (color: string, size = '12px') => `background: radial-gradient(circle at top left, transparent ${size}, ${color} 0) top left,
radial-gradient(circle at top right, transparent ${size}, ${color} 0) top right,
radial-gradient(circle at bottom right, transparent ${size}, ${color} 0) bottom right,
radial-gradient(circle at bottom left, transparent ${size}, ${color} 0) bottom left;
background-size: 50% 50%;
background-repeat: no-repeat;`,
};

/** 自定义样式方法 */
export const myCustomStyle = {
  init: async function () {
    const nodeCustomStyle = dom('[name="textStyleCustom"]') as HTMLTextAreaElement;
    if (!nodeCustomStyle) return;
    const { customizeCss = '' } = await myStorage.getConfig();
    nodeCustomStyle.value = customizeCss;
    this.change(customizeCss);
  },
  change: (innerCus: string) => fnInitDomStyle('CTZ_STYLE_CUSTOM', innerCus),
};

/** 启用知乎默认的黑暗模式 */
export const onUseThemeDark = async () => {
  const isDark = await myBackground.isUseDark();
  dom('html')!.setAttribute('data-theme', isDark ? 'dark' : 'light');
};

/** 查找是否使用主题 */
export const loadFindTheme = () => {
  // 开始进入先修改一次
  onUseThemeDark();
  const elementHTML = dom('html');
  const muConfig = { attribute: true, attributeFilter: ['data-theme'] };
  if (!elementHTML) return;
  // 监听 html 元素属性变化
  const muCallback = async function () {
    const themeName = elementHTML.getAttribute('data-theme');
    const isDark = await myBackground.isUseDark();
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

/** 是否使用深色模式 */
export const isDark = () => myBackground.isUseDark();

const radioBackground = (name: string, value: string | number, background: string, color: string, label: string) =>
  `<label><input class="${CLASS_INPUT_CLICK}" name="${name}" type="radio" value="${value}"/><div style="background: ${background};color: ${color}">${label}</div></label>`;

const themeToRadio = (o: Record<string, any>, className: string) =>
  Object.keys(o)
    .map((key) => radioBackground(className, key, o[key].background, o[key].color || '#000', o[key].name))
    .join('');

/** 添加背景色选择元素 */
export const addBackgroundSetting = () => {
  dom('.ctz-set-background')!.innerHTML =
    `<div id="CTZ_BACKGROUND">${THEMES.map((i) => radioBackground(INPUT_NAME_THEME, i.value, i.background, i.color, i.label)).join('')}</div>` +
    `<div class="ctz-commit">浅色颜色选择:</div>` +
    `<div id="CTZ_BACKGROUND_LIGHT">${themeToRadio(THEME_CONFIG_LIGHT, INPUT_NAME_ThEME_LIGHT)}</div>` +
    `<div class="ctz-commit">深色颜色选择:</div>` +
    `<div id="CTZ_BACKGROUND_DARK">${themeToRadio(THEME_CONFIG_DARK, INPUT_NAME_THEME_DARK)}</div>`;
};
