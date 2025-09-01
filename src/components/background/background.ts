import { CLASS_MESSAGE, dom, fnAppendStyle, fnReturnStr, myStorage } from '../../tools';
import { isDark } from './dark';
import { EThemeDark, EThemeLight, THEME_CONFIG_DARK, THEME_CONFIG_LIGHT } from './types';

/** 匹配类名以i开始部分 */
const appendClassStart = (str: string) => appendPrefix(str, (i) => `[class|="${i}"]`);

/** 样式名逗号分隔批量添加前缀 */
const appendPrefix = (str: string, mapCB: (i: string) => string) => str.split(',').map(mapCB).join(',');

/** 修改页面背景的 css */
export const myBackground = {
  /** 初始化 */
  init: async function () {
    const { themeDark = EThemeDark.深色一, themeLight = EThemeLight.默认, colorText1 } = await myStorage.getConfig();
    const useDark = await isDark();
    fnAppendStyle(
      'CTZ_STYLE_BACKGROUND',
      (useDark ? this.dark(themeDark) : this.light(themeLight)) + fnReturnStr(`.ContentItem-title, body{color: ${colorText1}!important;}`, !!colorText1)
    );

    const domHTML = dom('html')!;
    if (useDark) {
      domHTML.setAttribute('theme-dark', `${themeDark}`);
      domHTML.removeAttribute('theme-light');
    } else {
      domHTML.setAttribute('theme-light', `${themeLight}`);
      domHTML.removeAttribute('theme-dark');
    }
  },
  /** 浅色模式 */
  light: function (lightKey: EThemeLight) {
    if (+lightKey === +EThemeLight.默认) return '';
    const { background, background2 } = THEME_CONFIG_LIGHT[lightKey];
    return cssBackground(background, background2) + `.MenuBar-root-rQeFm{border-color: ${background}!important;}`;
  },
  /** 黑暗模式 */
  dark: function (darkKey: EThemeDark) {
    const { background, background2 } = THEME_CONFIG_DARK[darkKey];
    return appendPrefix(
      cssBackground(background, background2) +
        `${DARK_NAME_COLOR_WHITE}{color: #f7f9f9!important}` +
        `${DARK_NAME_COLOR_BLACK}{color: ${background2}!important}` +
        `${DARK_NAME_COLOR_LIGHT_LINK}{color: deepskyblue!important;}` +
        `.css-1tu59u4,.ZDI,.ZDI--PencilCircleFill24,.Zi,.Zi--ArrowDown{fill: deepskyblue!important;}` +
        // 存在于深夜模式下的额外的背景色1
        `.ztext pre,.ztext code{background: ${background}!important;}` +
        // 暗黑模式下的自定义按钮颜色
        `.ctz-button{background: ${background2};border-color: #f7f9f9;color: #f7f9f9;}`,
      (i) => `html[data-theme=dark] ${i}` // 添加 html[data-theme=dark] 前缀
    );
  },
};

/** 写入默认样式的方法 */
const cssBackground = (background1: string, background2: string) =>
  `${NAME_BACKGROUND_1}{background-color: ${background1}!important;}` +
  `${NAME_BACKGROUND_2}{background-color:${background2}!important;background:${background2}!important;}` +
  `${NAME_BACKGROUND_TRANSPARENT}{background-color: transparent!important;background: transparent!important;}`;

/** 使用背景色1的元素名称 */
const NAME_BACKGROUND_1 =
  `body,.Input-wrapper,.toolbar-section button:hover,.PostItem` +
  `,.VideoAnswerPlayer-stateBar,.skeleton,.Community-ContentLayout` +
  // `,.css-i9srcr,.css-i9srcr div,.css-127i0sx,.css-1wi7vwy,.css-1ta275q,.css-mk7s6o,.css-1o83xzo .section div,.zhuanlan .css-34mzkj,.zhuanlan .css-2sopzd,.zhuanlan .css-44kk6u` +
  `,.Report-list tr:nth-child(odd),.LinkCard.new,.Post-content,.Messages-newItem` +
  `,.New-RightCard-Outer-Dark,.WriteIndexLayout-main,.Messages-item:hover,.Menu-item.is-active,.LiveDetailsPage-root-aLVPj,.WikiLanding,.GlobalSideBar-navLink:hover,.Popover-arrow:after` +
  // `,.css-djayhh,.css-5i468k,.css-1iazx5e div` +
  `,.Sticky button:hover,.Sticky button:hover div,.Sticky button:hover span,.Sticky a:hover,.Sticky a:hover button,.Sticky a:hover div,.Sticky a:hover span,.Sticky li:hover` +
  `,.Popover-content button:hover,.index-videoCardItem-bzeJ1` +
  `,.KfeCollection-IntroCard-newStyle-mobile,.KfeCollection-IntroCard-newStyle-pc,.FeeConsultCard,.Avatar,.TextMessage-sender,.ChatUserListItem--active` +
  // `,.css-yoby3j,.css-wmwsyx,.css-wmwsyx button,.css-82b621,.css-1j8bif6>.css-11v6bw0,.css-1e1wubc,.css-1svx44c,.css-5d3bqp` +
  `,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-submenu-title:hover` +
  `,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-item:hover,.index-learnPath-dfrcu .index-learnContainer-9QR37 .index-learnShow-p3yvw .index-learnCard-vuCza,.index-courseCard-ebw4r` +
  `,[class^="index-goodCourseCard-"]` +
  // `,.css-13ev0i:hover,.css-oqi8p3 .lazy[data-lazy-status]` +
  `,${appendClassStart('Tabs-container,EpisodeList-sectionItem')}`;

/** 使用背景色2的元素名称 */
const NAME_BACKGROUND_2 =
  `.${CLASS_MESSAGE}` +
  `,.zhuanlan .Post-Row-Content .Post-Row-Content-left,.zhuanlan .Post-content .ContentItem-actions,.zhuanlan .Column-EmptyCard` +
  `,.Card,.HotItem,.AppHeader,.Topstory-content>div,.PlaceHolder-inner,.PlaceHolder-bg,.ContentItem-actions,.QuestionHeader,.QuestionHeader-footer ` +
  `,.QZcfWkCJoarhIYxlM_sG,.Sticky,.SearchTabs,.Modal-inner,.Modal-content,.Modal-content div,.Modal-wrapper textarea` +
  `,.Select-list button:active,.Select-list button:hover,.modal-dialog,.modal-dialog-buttons,.zh-profile-card div,.QuestionAnswers-answerAdd div,.Modal-modal-wf58 div` +
  // `,.css-1j23ebo,.css-arjme8 div,.css-arjme8 h1,.css-2lvw8d,.css-1os3m0m,.css-r38x5n div,.css-1mbpn2d,.css-1yjqd5z,.zhuanlan .css-1pariuy` +
  `,.Creator-mainColumn .Card>div,.Creator-mainColumn section,.Topbar,.AutoInviteItem-wrapper--desktop,.ProfileHeader-wrapper,.NotificationList,.SettingsFAQ` +
  `,.SelectorField-options .Select-option.is-selected,.SelectorField-options .Select-option:focus,.KfeCollection-PayModal-modal,.KfeCollection-PayModal-modal div` +
  `,.Community,.Report-header th,.Report-list tr:nth-child(2n),.Report-Pagination,.CreatorIndex-BottomBox-Item,.CreatorSalt-letter-wrapper` +
  `,.ColumnPageHeader,.WriteIndexLayout-main>div,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1,.PostEditor-wrapper>div:last-of-type div,.Creator-salt-new-author-content` +
  `,.Select-option:focus,.ToolsQuestion div,[role="tablist"],.Topic-bar,.List-item .ZVideoToolbar button,.Creator-salt-author-welfare .Creator-salt-author-welfare-card,.Creator-salt-author-welfare-banner` +
  `,#AnswerFormPortalContainer div,.CreatorTable-tableHead,.BalanceTransactionList-Item,.utils-frostedGlassEffect-2unM,#feedLives,#feedLives div,#feedLives a` +
  `,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a` +
  // `,.css-1o83xzo,.css-1o83xzo .section,.css-1cr4989,.css-xoei2t,.css-slqtjm,.css-1615dnb div,.css-1oqbvad,.css-1oqbvad div,.css-lxxesj div:not(.css-zprod5)` +
  `,.Card-card-2K6v,.Card-card-2K6v div,.LiveDetailsPage-root-aLVPj div,.LiveFooter-root-rXuoG` +
  `,.PubIndex-CategoriesHeader,.ColumnHomeColumnCard,.Home-tabs,.Home-tabs div,.Home-swiper-container,.Home-swiper-container div,.BottomBarContainer` +
  ',.ResponderPage-root div,.WikiLandingItemCard,.WikiLandingEntryCard,._Invite_container_30SP,._Invite_container_30SP div,._Coupon_intro_1kIo,._Coupon_list_2uTb div' +
  `,.ExploreHomePage-square div,.ExploreHomePage-ContentSection-moreButton a,.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreColumnCard,.Notification-white` +
  `,.QuestionAnswers-answerAdd .InputLike,.QuestionAnswers-answerAdd .InputLike div,.InputLike,.CreatorSalt-community-story-wrapper .CreatorSalt-community-story-table` +
  `,.Popover-content,.Notifications-footer,.Messages-footer,.Popover-arrow:after,.ant-table-tbody>tr.ant-table-placeholder:hover>td` +
  `,.SettingsMain>div div:not(.StickerItem-Border):not(.SettingsMain-sideColumn):not(.UserHeader-VipBtn):not(.UserHeader-VipTip):not(.css-60n72z div),.CreatorSalt-community-story-wrapper` +
  // `,.css-guh6n2,.css-yqosku,.css-kt4t4n,.css-1j8bif6>div,.css-nffy12:hover,.css-1eltcns,.css-9kvgnm,.css-jd7qm7,.css-19vq0tc,.css-rzwcnm,.css-1akh9z6` +
  `,.ListShortcut>div:not(.Question-mainColumn),.Chat,.ActionMenu,.Recommendations-Main,.KfeCollection-PcCollegeCard-root,.CreatorSalt-sideBar-wrapper,.ant-menu` +
  `,.signQr-container,.signQr-rightContainer>div,.Login-options,.Input-wrapper>input,.SignFlowInput-errorMask,.Write-school-search-bar .CreatorSalt-management-search,.CreatorSalt-Content-Management-Index` +
  `,.Topstory-container .TopstoryTabs>a::after,.ZVideo,.KfeCollection-CreateSaltCard,.CreatorSalt-personalInfo,.CreatorSalt-sideBar-item,.css-d1sc5t,.css-1gvsmgz,.css-u56wtg,.css-1hrberl` +
  `,.CreatorSalt-community-story-wrapper .CreatorSalt-community-story-header,.ant-table-tbody>tr>td,.CreatorSalt-management-wrapper .CreatorSalt-management-search,.ant-table-thead .ant-table-cell` +
  `,.QuestionWaiting-typesTopper,.SearchSubTabs,.ContentItem-actions.Sticky.is-fixed button[data-zop-retract-question='true'],.Post-Row-Content-left,.hot-column-container,.recommend-column,.hot-column,.more-container` +
  // `,.css-4jezjh,.css-1xj1964,.css-ggid2,.css-10kzyet,.css-ep38sv,.css-b0g50k,.css-w0en9j,.css-14pitda,.css-15dztar,.css-1gkysn8,.css-97fdvh>div,.css-4lspwd,.css-1e6hvbc,.css-k32okj,.css-1b0ypf8 div,.css-np3nxw div,.css-1i12cbe` +
  `,[class^="css-"]:not(.css-1ndlr1n,.css-1gomreu,.css-5ym188,.css-19q29v6,.css-1qyytj7,.css-2pfapc,.css-uq1pv2,.css-1khcilw,.css-i9srcr,.css-pu97ow,.css-74nox5)` +
  `,[class6="index-goodCourseCardContainer"]` +
  `,${appendClassStart(
    'App-root,PcContent-root,TopNavBar-root,CourseConsultation-corner,CourseConsultation-cornerButton,CornerButtonToTop-cornerButton,LearningRouteCard-pathContent,index-item,index-hoverCard,ShelfTopNav-root' +
      ',ProductCard-root,NewOrderedLayout-root,Tabs-tabHeader,ButtonBar-root,WebPage-root,LearningPathWayCard-pathItem,VideoCourseList-title,Article-header,PcContent-coverFix,index-module,TopNavBar-module,PcContent-module,CourseRecord-module' +
      ',Learned-module,Tab-module,PcContentBought-module,Media-module'
  )}`;

/** 透明背景色的元素名称 */
const NAME_BACKGROUND_TRANSPARENT =
  `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper,.css-1ggwojn,.css-3dzt4y,.css-u4sx7k` +
  `,.VideoPlaceholderContainer>section,.MoreAnswers .List-headerText,.ColumnHomeTop:before,.ColumnHomeBottom,.Popover button:not(.SearchBar-askDropdownButton),.ChatUserListItem .Chat-ActionMenuPopover-Button` +
  `,#root .App-main footer.css-2pfapc div,#root .App-main footer.css-2pfapc a,#root .css-ov3mmw *,#root .css-g9qnka *,#root .css-74nox5 *,#root .css-s5fc8s>.card *`;

/** 黑夜模式下的白色字体元素名称 */
const DARK_NAME_COLOR_WHITE =
  `.${CLASS_MESSAGE},.ctz-export-collection-box p` +
  `,.Modal-content,.Modal-content div,.Menu-item.is-active,.Select-list button:active,.Select-list button:hover,.Popover-content button,.Modal-title` +
  `,.zu-main div,.modal-dialog,.zh-profile-card div,.QuestionAnswers-answerAdd div,.QuestionAnswers-answerAdd label,.Tabs-link,.toolbar-section button,.Modal-modal-wf58 div` +
  // `,.css-yd95f6,.css-g9ynb2,.css-i9srcr,.css-i9srcr div,.css-arjme8 div,.css-arjme8 label,.css-arjme8 h1,.css-13brsx3,.css-1ta275q div` +
  `,.Creator-mainColumn .Card div,.Comments-container div,.SettingsMain div,.KfeCollection-PayModal-modal div,.KfeCollection-CouponCard-selectLabel,.KfeCollection-CouponCard-optionItem-text,.KfeCollection-PayModal-modal-icon` +
  `,.NavItemClassName,.LinkCard-title,.Creator div,.Creator span,.Modal-wrapper textarea,.EditorHelpDoc,.EditorHelpDoc div,.EditorHelpDoc h1,.FeedbackModal-title,.LiveDetailsPage-root-aLVPj div` +
  // `,.css-r38x5n div,.css-1dwlho,.css-1b0ypf8 div,.css-1b0ypf8 a,.css-np3nxw div,.css-10ub9de,.css-1wbvd3d,.css-1f4cz9u,.css-y42e6l,.css-jiu0xt,.css-1myqwel` +
  `,.PostEditor-wrapper>div:last-of-type div,.PostEditor-wrapper>div:last-of-type label,.ToolsQuestion a,.ToolsQuestion font,.utils-frostedGlassEffect-2unM div,.utils-frostedGlassEffect-2unM span` +
  `,.aria-primary-color-style.aria-secondary-background,.aria-primary-color-style.aria-secondary-background div,.aria-primary-color-style.aria-secondary-background h1,.aria-primary-color-style.aria-secondary-background a,.aria-primary-color-style.aria-secondary-background p,.aria-primary-color-style.aria-secondary-background h2` +
  `,#feedLives div,#feedLives a,.Card-card-2K6v,.Card-card-2K6v div,.Card-card-2K6v h3,._Invite_container_30SP h2,._Invite_container_30SP h1,.ChatListGroup-SectionTitle .Zi,.Qrcode-container>div,.Qrcode-guide-message>div,.signQr-leftContainer button,.signQr-leftContainer a` +
  `,.ExploreHomePage-square div,.ExploreHomePage-square a,.jsNavigable a,#TopstoryContent h2,[role="contentinfo"] div` +
  `,.CreatorSalt-personalInfo-name,.ant-collapse>.ant-collapse-item>.ant-collapse-header` +
  // `,.css-10u695f,.css-wqf2py,.css-wmwsyx,.css-wmwsyx div,.css-c3gbo3,.css-1ygg4xu blockquote,.css-r8ate4,.css-1e1wubc,.css-1e1wubc div,.css-12kq1qx,.css-172osot div,.css-172osot a:last-child,.css-f2jj4r` +
  `,.Creator-salt-new-author-menu .Creator-salt-new-author-route .ant-menu-submenu-title:hover,.Creator-salt-author-welfare .Creator-salt-author-welfare-card h1` +
  // `,.css-u56wtg,.css-1hrberl,.css-13e6wvn,.css-i0heim,.css-1lkz3hi,.css-18i781m,.css-13ev0i,.css-44m30e:hover,.css-1f1pohe,.css-44m30e,.css-16zsfw9,.css-1wv2vrq,.css-110m3t7,.css-nklvh9,.css-ukbjm6,.css-1oml8kn,.css-1w0yveu` +
  `,.CommentContent,.css-1j6g1cv > span, .css-1j6g1cv > div` +
  `,[class^="css-"],[class^="index-descInfo"],[class^="TopNavBar-tab-"] a` +
  `,${appendClassStart(
    'index-title,CourseConsultation-tip,index-text,index-number,CourseDescription-playCount,LecturerList-title,LearningRouteCard-title,index-tabItemLabel,VideoCourseCard-module,TextTruncation-module'
  )}`;

/** 黑夜模式下的黑色字体元素名称 */
const DARK_NAME_COLOR_BLACK = `css-1x3upj1,.PlaceHolder-inner,.PlaceHolder-mask path`;

/** 黑夜模式下浅蓝色超链接字体 */
const DARK_NAME_COLOR_LIGHT_LINK =
  `.css-1esjagr,.css-ruirke,.css-117anjg a.UserLink-link,.RichContent--unescapable.is-collapsed .ContentItem-rightButton,.css-1qap1n7,.ContentItem-more` +
  `,.ContentItem-title a:hover,.Profile-lightItem:hover,.Profile-lightItem:hover .Profile-lightItemValue,.css-p54aph:hover,.PushNotifications-item a:hover,.PushNotifications-item a` +
  `,.NotificationList-Item-content .NotificationList-Item-link:hover,.SettingsQA a,a.QuestionMainAction:hover,.SimilarQuestions-item .Button,.CreatorSalt-IdentitySelect-Button` +
  `,.signQr-leftContainer button:hover,.signQr-leftContainer a:hover,.Profile-sideColumnItemLink:hover,.FollowshipCard-link,.css-zzimsj:hover,.css-vphnkw,.css-1aqu4xd,.css-6m0nd1` +
  `,.NumberBoard-item.Button:hover .NumberBoard-itemName, .NumberBoard-item.Button:hover .NumberBoard-itemValue, .NumberBoard-itema:hover .NumberBoard-itemName, .NumberBoard-itema:hover .NumberBoard-itemValue` +
  `,a.external,.RichContent-EntityWord,.SideBarCollectionItem-title,.Tag-content,.LabelContainer div,.LabelContainer a,.KfeCollection-OrdinaryLabel-newStyle-mobile .KfeCollection-OrdinaryLabel-content,.KfeCollection-OrdinaryLabel-newStyle-pc .KfeCollection-OrdinaryLabel-content` +
  `,.KfeCollection-CreateSaltCard-button,.KfeCollection-PcCollegeCard-searchMore,.css-15m2p8i > a:hover`;
