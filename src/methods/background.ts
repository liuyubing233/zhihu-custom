import { myStorage } from '../commons/storage';
import { dom, domById, fnAppendStyle, fnReturnStr } from '../commons/tools';
import { CLASS_INPUT_CLICK, CLASS_MESSAGE, INPUT_NAME_THEME, INPUT_NAME_THEME_DARK, INPUT_NAME_ThEME_LIGHT, THEMES, THEME_CONFIG_DARK, THEME_CONFIG_LIGHT } from '../configs';
import { ETheme, EThemeDark, EThemeLight } from '../types';

/** 匹配类名以i开始部分 */
const appendClassStart = (str: string) => appendPrefix(str, (i) => `[class|="${i}"]`);

/** 样式名逗号分隔批量添加前缀 */
const appendPrefix = (str: string, mapCB: (i: string) => string) => str.split(',').map(mapCB).join(',');

/** 修改页面背景的 css */
export const myBackground = {
  init: async function () {
    const { themeDark = EThemeDark.深色护眼一, themeLight = EThemeLight.默认, colorText1 } = await myStorage.getConfig();
    const useDark = await isDark();
    const getBackground = async () => {
      if (useDark) return this.dark(themeDark);
      if (+themeLight === EThemeLight.默认) return this.default();
      return this.light(themeLight);
    };
    fnAppendStyle('CTZ_STYLE_BACKGROUND', (await getBackground()) + fnReturnStr(`.ContentItem-title, body{color: ${colorText1}!important;}`, !!colorText1));

    const domDrawer = domById('CTZ_DRAWER');
    const domOpen = domById('CTZ_OPEN_CLOSE');
    if (!domDrawer || !domOpen) return;
    if (useDark) {
      domDrawer.setAttribute('theme-dark', `${themeDark}`);
      domOpen.setAttribute('theme-dark', `${themeDark}`);
      domDrawer.removeAttribute('theme-light');
      domOpen.removeAttribute('theme-light');
    } else {
      domDrawer.setAttribute('theme-light', `${themeLight}`);
      domOpen.setAttribute('theme-light', `${themeLight}`);
      domDrawer.removeAttribute('theme-dark');
      domOpen.removeAttribute('theme-dark');
    }
  },
  doSetCSS: function (bg1: string, bg2: string): string {
    return (
      `${this.cssBG1}{background-color: ${bg1}!important;}` +
      `${this.cssBG2}{background-color:${bg2}!important;background:${bg2}!important;}` +
      `${this.cssBGTransparent}{background-color: transparent!important;background: transparent!important;}` +
      `${this.cssBG1Color}{color: ${bg1}!important}` +
      `.SignContainer-content input:-webkit-autofill{-webkit-box-shadow: inset 0 0 0 30px ${bg2}!important;}`
    );
  },
  default: () => '.GlobalSideBar-navList{background: #fff}',
  light: function (lightKey: EThemeLight) {
    const { background, background2 } = THEME_CONFIG_LIGHT[lightKey];
    // Header 变化
    const nodeAppHeader = dom('.AppHeader');
    const nodeTopStoryC = dom('.Topstory>div:not(.Topstory-container)');
    const elementHC = nodeAppHeader ? nodeAppHeader.classList || [] : [];
    const haveTopAD = nodeTopStoryC && nodeTopStoryC.childElementCount;
    const headerBelongAd = haveTopAD ? elementHC[elementHC.length - 1] : '';
    return (
      this.doSetCSS(background, background2) +
      `.MenuBar-root-rQeFm{border-color: ${background}!important;}` +
      `${headerBelongAd ? `.AppHeader:not(.${headerBelongAd})` : '.AppHeader'}{background-color:${background2}!important;background:${background2}!important;}` +
      `.ctz-menu-top>a.target::before,.ctz-menu-top>a.target::after{${this.menuBeforeAfter(background2)}}`
    );
  },
  dark: function (darkKey: EThemeDark) {
    const { background, background2 } = THEME_CONFIG_DARK[darkKey];
    return appendPrefix(
      this.doSetCSS(background, background2) +
        // 白色字体部分
        `.${CLASS_MESSAGE},.ctz-export-collection-box p` +
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
        `,.css-13e6wvn,.css-i0heim,.CommentContent` +
        `,${appendClassStart(
          'index-title,CourseConsultation-tip,index-text,index-number,CourseDescription-playCount,LecturerList-title,LearningRouteCard-title,index-tabItemLabel,VideoCourseCard-module,TextTruncation-module'
        )}` +
        `{color: #f7f9f9!important}` +
        // 黑色字体部分
        `css-1x3upj1,.PlaceHolder-inner,.PlaceHolder-mask path,.css-1kxql2v{color: ${background2}!important}` +
        // 浅蓝色超链接字体
        `.css-1esjagr,.css-ruirke,.css-117anjg a.UserLink-link,.RichContent--unescapable.is-collapsed .ContentItem-rightButton,.css-1qap1n7,.ContentItem-more` +
        `,.ContentItem-title a:hover,.Profile-lightItem:hover,.Profile-lightItem:hover .Profile-lightItemValue,.css-p54aph:hover,.PushNotifications-item a:hover,.PushNotifications-item a` +
        `,.NotificationList-Item-content .NotificationList-Item-link:hover,.SettingsQA a,a.QuestionMainAction:hover,.SimilarQuestions-item .Button,.CreatorSalt-IdentitySelect-Button` +
        `,.signQr-leftContainer button:hover,.signQr-leftContainer a:hover,.Profile-sideColumnItemLink:hover,.FollowshipCard-link,.css-zzimsj:hover,.css-vphnkw,.css-1aqu4xd,.css-6m0nd1` +
        `,.NumberBoard-item.Button:hover .NumberBoard-itemName, .NumberBoard-item.Button:hover .NumberBoard-itemValue, .NumberBoard-itema:hover .NumberBoard-itemName, .NumberBoard-itema:hover .NumberBoard-itemValue` +
        `,a.external,.RichContent-EntityWord,.SideBarCollectionItem-title,.Tag-content,.LabelContainer div,.LabelContainer a,.KfeCollection-OrdinaryLabel-newStyle-mobile .KfeCollection-OrdinaryLabel-content,.KfeCollection-OrdinaryLabel-newStyle-pc .KfeCollection-OrdinaryLabel-content` +
        `,.KfeCollection-CreateSaltCard-button,.KfeCollection-PcCollegeCard-searchMore` +
        `{color: deepskyblue!important;}` +
        `.css-1tu59u4,.ZDI,.ZDI--PencilCircleFill24,.Zi,.Zi--ArrowDown{fill: deepskyblue!important;}` +
        // 存在于深夜模式下的额外的背景色1
        `.ztext pre,.ztext code{background: ${background}!important;}` +
        // 暗黑模式下的自定义按钮颜色
        `.ctz-button{background: ${background2};border-color: #f7f9f9;color: #f7f9f9;}`,
      (i) => `html[data-theme=dark] ${i}` // 添加 html[data-theme=dark] 前缀
    );
  },
  /** 使用背景色1的元素名称 */
  cssBG1:
    `body,.Input-wrapper,.toolbar-section button:hover` +
    `,.VideoAnswerPlayer-stateBar,.skeleton,.Community-ContentLayout` +
    `,.css-i9srcr,.css-i9srcr div,.css-127i0sx,.css-1wi7vwy,.css-1ta275q,.css-mk7s6o,.css-1o83xzo .section div,.PostItem` +
    `,.Report-list tr:nth-child(odd),.LinkCard.new,.Post-content,.Post-content .ContentItem-actions,.Messages-newItem` +
    `,.Modal-wrapper textarea,.New-RightCard-Outer-Dark,.WriteIndexLayout-main,.Messages-item:hover,.Menu-item.is-active` +
    `,.css-djayhh,.css-5i468k,.css-1iazx5e div,.LiveDetailsPage-root-aLVPj,.WikiLanding,.GlobalSideBar-navLink:hover,.Popover-arrow:after` +
    `,.Sticky button:hover,.Sticky button:hover div,.Sticky button:hover span,.Sticky a:hover,.Sticky a:hover button,.Sticky a:hover div,.Sticky a:hover span,.Sticky li:hover` +
    `,.Popover-content button:hover,.css-1j8bif6>.css-11v6bw0,.css-1e1wubc,.css-1svx44c,.css-5d3bqp,.index-videoCardItem-bzeJ1` +
    `,.KfeCollection-IntroCard-newStyle-mobile,.KfeCollection-IntroCard-newStyle-pc,.FeeConsultCard,.Avatar,.TextMessage-sender,.ChatUserListItem--active` +
    `,.css-yoby3j,.css-wmwsyx,.css-wmwsyx button,.css-82b621,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-submenu-title:hover` +
    `,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-item:hover,.index-learnPath-dfrcu .index-learnContainer-9QR37 .index-learnShow-p3yvw .index-learnCard-vuCza,.index-courseCard-ebw4r` +
    `,${appendClassStart('Tabs-container,EpisodeList-sectionItem')}`,
  /** 使用背景色2的元素名称 */
  cssBG2:
    `.${CLASS_MESSAGE}` +
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
    `,.QuestionWaiting-typesTopper` +
    `,${appendClassStart(
      'App-root,PcContent-root,TopNavBar-root,CourseConsultation-corner,CourseConsultation-cornerButton,CornerButtonToTop-cornerButton,LearningRouteCard-pathContent,index-item,index-hoverCard,ShelfTopNav-root' +
        ',ProductCard-root,NewOrderedLayout-root,Tabs-tabHeader,ButtonBar-root,WebPage-root,LearningPathWayCard-pathItem,VideoCourseList-title,Article-header,PcContent-coverFix,index-module,TopNavBar-module,PcContent-module,CourseRecord-module' +
        ',Learned-module,Tab-module,PcContentBought-module,Media-module'
    )}`,
  /** 背景色透明的元素名称 */
  cssBGTransparent:
    `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper,.css-1ggwojn,.css-3dzt4y,.css-u4sx7k` +
    `,.VideoPlaceholderContainer>section,.MoreAnswers .List-headerText,.ColumnHomeTop:before,.ColumnHomeBottom,.Popover button,.ChatUserListItem .Chat-ActionMenuPopover-Button`,
  cssBG1Color: `.css-z0izby`,
  menuBeforeAfter: (color: string, size = '12px') =>
    `background: radial-gradient(circle at top left, transparent ${size}, ${color} 0) top left,` +
    `radial-gradient(circle at top right, transparent ${size}, ${color} 0) top right,` +
    `radial-gradient(circle at bottom right, transparent ${size}, ${color} 0) bottom right,` +
    `radial-gradient(circle at bottom left, transparent ${size}, ${color} 0) bottom left;` +
    `background-size: 50% 50%;` +
    `background-repeat: no-repeat;`,
};

/** 自定义样式方法 */
export const myCustomStyle = {
  init: async function () {
    const { customizeCss = '' } = await myStorage.getConfig();
    (dom('[name="textStyleCustom"]') as HTMLTextAreaElement).value = customizeCss;
    this.change(customizeCss);
  },
  change: (innerCus: string) => fnAppendStyle('CTZ_STYLE_CUSTOM', innerCus),
};

/** 启用知乎默认的黑暗模式 */
export const onUseThemeDark = async () => {
  dom('html')!.setAttribute('data-theme', (await isDark()) ? 'dark' : 'light');
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
    const dark = await isDark();
    if ((themeName === 'dark' && !dark) || (themeName === 'light' && dark)) {
      onUseThemeDark();
    }
  };
  const muObserver = new MutationObserver(muCallback);
  muObserver.observe(elementHTML, muConfig);
};

/** 是否使用深色模式 */
export const isDark = async () => {
  const { theme = ETheme.自动 } = await myStorage.getConfig();
  if (+theme === ETheme.自动) {
    // 获取浏览器颜色
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return +theme === ETheme.深色;
};

/** 添加背景色选择元素 */
export const addBackgroundSetting = () => {
  const radioBackground = (name: string, value: string | number, background: string, color: string, label: string) =>
    `<label><input class="${CLASS_INPUT_CLICK}" name="${name}" type="radio" value="${value}"/><div style="background: ${background};color: ${color}">${label}</div></label>`;

  const themeToRadio = (o: Record<string, any>, className: string, color: string) =>
    Object.keys(o)
      .map((key) => radioBackground(className, key, o[key].background, color, o[key].name))
      .join('');

  dom('.ctz-set-background')!.innerHTML =
    `<div class="ctz-title">主题颜色</div>` +
    `<div id="CTZ_BACKGROUND">${THEMES.map((i) => radioBackground(INPUT_NAME_THEME, i.value, i.background, i.color, i.label)).join('')}</div>` +
    `<div class="ctz-title">浅色颜色选择</div>` +
    `<div id="CTZ_BACKGROUND_LIGHT">${themeToRadio(THEME_CONFIG_LIGHT, INPUT_NAME_ThEME_LIGHT, '#000')}</div>` +
    `<div class="ctz-title">深色颜色选择</div>` +
    `<div id="CTZ_BACKGROUND_DARK">${themeToRadio(THEME_CONFIG_DARK, INPUT_NAME_THEME_DARK, '#f7f9f9')}</div>`;
};
