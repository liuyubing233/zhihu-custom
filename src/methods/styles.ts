import { dom, fnInitDomStyle } from '../commons/tools';
import { BACKGROUND_CONFIG, BACKGROUND_DARK_COLORS, ID_DIALOG } from '../configs';
import { store } from '../store';

/** 修改页面背景的 css */
export const myBackground = {
  init: function () {
    const { getConfig } = store;
    const nConf = getConfig();
    const innerHTML = this.change(nConf.colorBackground || '');
    fnInitDomStyle('CTZ_STYLE_BACKGROUND', innerHTML);
  },
  change: function (bg: string) {
    if (this.isUseDark()) return this.dark(bg);
    if (bg === '#ffffff') return this.default();
    return this.normal(bg) + this.normalAppHeader(bg);
  },
  isUseDark: () => {
    const { getConfig } = store;
    const nConf = getConfig();
    return Object.keys(BACKGROUND_DARK_COLORS).includes(nConf.colorBackground || '');
  },
  default: () => '.GlobalSideBar-navList{background: #fff}',
  dark: (bg: string) => {
    const { b2, t1, t2 } = BACKGROUND_DARK_COLORS[bg];
    const backgroundBG =
      `#${ID_DIALOG},.ctz-set-title>span,#CTZ-BLOCK-LIST .ctz-black-item` +
      `,.css-ul9l2m,.css-mq2czy,.css-1da4iq8,.css-oqge09,.css-lpo24q,.css-16zrry9,.css-u8y4hj,.css-1117lk0:hover,.css-1yq3jl6,.css-mzh2tk,.css-6mdg56,.css-mjg7l1,.css-q2yfd6,.css-1ulkprw,.Modal-modal-wf58,.css-1j5d3ll,.css-ovbogu,.css-1v840mj,.css-huwkhm,.css-akuk2k,.css-ygii7h,.css-1h84h63,.css-1bwzp6r,.css-w215gm,.css-iebf30,.css-1qjzmdv,.css-g3xs10,.css-jlyj5p,.css-805ti0,.css-12yl4eo,.css-1ggwojn,.css-xqep55,.css-1ne387d,.Card,.ContentItem-actions,.QuestionHeader,.ShelfTopNav-root-eb3BX,.Modal-inner,.zhi,.Notifications-footer` +
      `,.QuestionHeader-footer,.MoreAnswers .List-headerText,.EQvEDwRqICOvs_x_kUWW,.ProfileHeader-wrapper,.SettingsFAQ,.QuestionWaiting-types,.Popover-content,.Post-content,.KfeCollection-PcCollegeCard-root,.SearchTabs,.GlobalSideBar-navList,.WebPage-root-g7WXc,.KfeCollection-FeedBlockSetting,.AnswerForm-footer,.CreatorRecruitFooter--fix,body .Recruit-buttonFix-placeholder,.CreatorIndex-BottomBox-Item,.Recommendations-Main,.QZcfWkCJoarhIYxlM_sG,.Sticky,.css-1vtgv04` +
      `{background: ${bg}!important;}`;
    const backgroundB2 =
      `.ctz-content-right>div:nth-of-type(2n),.ctz-content-right>div:nth-of-type(2n) .ctz-set-title > span` +
      `,.css-1vwmxb4:hover,.css-1xegbra,.css-xevy9w tbody tr:nth-of-type(odd),.css-r9mkgf,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-1gnqr8i,.css-1stnbni:hover,.css-5abu0r,.css-n7efg0,.css-ssvpr2,.css-m9gn5f,.FeedbackForm-inputBox-15yJ,.css-106u01g,.css-c29erj,.css-1xk2o8d,.FeedbackForm-canvasContainer-mrde,._Invite_container_30SP,.utils-frostedGlassEffect-2unM,.css-16eulm,.index-root-3h4H5` +
      `,.Card-card-2K6v,.UserLivesPage-page-GSje,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448,.PubIndex-CategoriesHeader,.AppHeader,body,.UserPageItem--withButton,.QuestionWaiting-typesTopper,.PostItem,.LinkCard.new,.signQr-container,.css-16h0l39` +
      `{background:${b2}!important;}`;
    const backgroundTransparent =
      `._AccountSettings_accountLine_3HJS,.css-1gfpqrv,.css-13dk2dh,.css-u6lvao,.css-u6lvao:before,.css-u6lvao:after,.Community-ContentLayout` +
      `{background: transparent!important;}`;
    const colorT1 =
      `.ctz-footer,.css-k49mnn,.css-qj3urb,.css-1bdtll5,.css-x9rxz4,.css-1iubajs,.css-186oz3i` +
      `,.css-7v0haq,.css-1yj4z27,.css-1204lgo,.css-1ng3oge,.css-5abu0r,.css-p52k8h,.css-1dpmqsl,.css-1myqwel,.css-1ykn8va,.css-1117lk0,.css-m9gn5f,.css-oqge09,.css-8u7moq,.css-k0fmhp,css-bc6idi,.css-nsw6sf,.css-25wprl,.css-294ohd,.css-1nmddht,.css-11nn00q,.css-1c4skpi,.GlobalSidebar-appDownloadTip-33iw,.css-pgcb4h,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-jwse5c,.css-hd7egx,.css-1zcaix,.css-4a3k6y,.css-eonief,.css-dy7bva,.css-sthon2,.css-teb1rp,.css-uq88u1,.css-nymych,.css-1gomreu,.css-tnsaxh,.css-jt1vdv,.css-tfs9zi,.css-1m2h1o9,.css-16p5ii9,.css-kkim14,.css-1mx84bz,.css-74475r,.css-3dzvwq,.css-1ab1nhi,.css-1l1sy07,.css-1bbvash,.css-1stnbni:hover,.css-tad50r,.css-1rd0h6f,.css-1k10w8f,.css-195d1c3,.css-1bfi5pu,.css-kk7b9z` +
      `,.CopyrightSettings h2,.CopyrightSettings,.LiveItem-title-2qes,.GlobalSidebar-introItem-24PB h3,.Card-card-2K6v,.LiveItem-description-Tliw,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448,.zu-main-content,.zu-main-sidebar,.FeedbackForm-form-1uUg,.CopyrightSettings h1,.index-root-3h4H5,.TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7,.ZVideo-body .UserLink,.ZVideo-body .CommentRichText,.CommentContent,.TopNavBar-logoContainer-vDhU2 .TopNavBar-zhihuLogo-jzM1f,.RichContent-collapsedText,.ContentItem-arrowIcon,.TopNavBar-inner-baxks .TopNavBar-tab-hBAaU a,.UserHeader-Info,.NavItemClassName,#creator-statistic,#creator-task-dayTask,#creator-task-creatorTask,#creator-manual` +
      `{color: ${t1}!important}`;
    const colorT2 = `.css-o7lu8j{color: ${t2}!important}`;
    const colorB2 = `css-1x3upj1,.ctz-content-left>a:hover,.ctz-button{color: ${b2}!important}`;
    const borderColorBG = `.MenuBar-root-rQeFm{border-color: ${bg}!important;}`;
    const dialogBorder = `#${ID_DIALOG}{border: 1px solid ${b2}}.ctz-menu-top>a.target{border-bottom: 4px solid ${t1};color: ${t1};}`;

    // 添加 html[data-theme=dark] 前缀
    const addPrefix = (i: string) =>
      i
        .split(',')
        .map((i) => `html[data-theme=dark] ${i}`)
        .join(',');

    // 知学堂、会员
    const pageLearning =
      `.TopNavBar-fixMode-qXKMs,.index-tabWrap-4Smyx,.index-bannerItem-3o3D7,.LearningRouteCard-pathContent-j3jVv{background: ${bg}!important;}` +
      `.LearningRouteCard-pathItem-xin1f .LearningRouteCard-content-kw2RW .LearningRouteCard-title-do7ND{color: ${t1}!important;}`;

    return addPrefix(backgroundBG + backgroundB2 + backgroundTransparent + colorT1 + colorB2 + colorT2 + borderColorBG + dialogBorder + pageLearning);
  },
  normal: (bg: string) => {
    // 普通背景色
    const background =
      `.ctz-content-right>div:nth-of-type(2n),.ctz-content-right>div:nth-of-type(2n) .ctz-set-title > span` +
      `,body,.Post-content,.HotList,.HotListNavEditPad,.ColumnPageHeader,.ZVideoToolbar,.position-suspensionSearch.focus,.Modal-modal-wf58,.Community-ContentLayout,.App-root-8rX7N,.MenuBar-root-rQeFm,.TopNavBar-fixMode-4nQmh,.App-active-dPFhH,.CategorySection-categoryList-mrt3Z,.zhuanlan .Post-content .ContentItem-actions,.zhuanlan .ContentItem-actions,.LinkCard.new,.WebPage-root-g7WXc,.KfeCollection-FeedBlockSetting,.ShelfTopNav-root-eb3BX,.signQr-container,.css-16h0l39` +
      `{background-color: ${bg}!important;}`;
    const backgroundOpacity =
      `#${ID_DIALOG},.ctz-set-title>span,#${ID_DIALOG} select,#${ID_DIALOG} input,#${ID_DIALOG} textarea,#CTZ_SET_FILTER` +
      `,.QuestionHeader,.Card,.HotItem,.Recommendations-Main,.GlobalSideBar-navList,.SearchSubTabs,.CommentsV2-withPagination,.QuestionHeader-footer,.HoverCard,.ContentItem-actions,.MoreAnswers .List-headerText,.Topbar,.CommentsV2-footer,.Select-plainButton,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreSpecialCard,.ExploreColumnCard,.ExploreHomePage-ContentSection-moreButton a,.QuestionWaiting-types,.AutoInviteItem-wrapper--desktop,.Popover-content,.Notifications-footer,.SettingsFAQ,.Popover-arrow:after,.Messages-footer,.Modal-inner,.RichContent-actions,.KfeCollection-FeedBlockSetting,.CommentListV2-header-divider,.Input-wrapper:not(.Input-wrapper--grey),.TopstoryItem .ZVideoToolbar,.SearchTabs,.Topic-bar,.VotableTopicCard,textarea.FeedbackForm-inputBox-15yJ,.FeedbackForm-canvasContainer-mrde` +
      `,.css-mq2czy,.css-lpo24q,.css-16zrry9,.css-1v840mj,.css-ovbogu,.css-1h84h63,.css-u8y4hj,.css-1bwzp6r,.css-w215gm,.InputLike,.AnswerForm-footer,.Editable-toolbar,.Chat,.css-ul9l2m,.Balance-Main .Tabs,.Community,.Report-list tr:nth-child(2n),.Report-Pagination,.Report-list,.Report-header th,._Invite_container_30SP,.css-ssvpr2,.css-1p1lrh0,.zu-main,.utils-frostedGlassEffect-2unM,.Card-card-2K6v,.UserLivesPage-page-GSje,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448,.PubIndex-CategoriesHeader,.css-r9mkgf,.CornerButton,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-1vtgv04,.WikiLandingHeader,.WikiLanding,.WikiLandingItemCard,.WikiLandingEntryCard,.SideNavs-navContainer-6VkAT,.App-root-cPFwn,.TopNavs-root-rwAr7,.App-root-qzkuH,.App-actionTrigger-cCyD7,.ProductTrigger-root-amaSi,.App-infiniteContainer-nrxGj,.ActionTrigger-content-dPn6H,.App-card-pkbhv,.css-zvnmar,.Login-options,.SignFlowInput-errorMask,.ColumnHomeColumnCard,.KfeCollection-PcCollegeCard-root,.KfeCollection-PcCollegeCard-wrapper` +
      `,.css-1j5d3ll,.css-iebf30,.css-1qjzmdv,.AnswerForm-footer,.css-g3xs10,.css-jlyj5p,.CommentEditorV2-inputUpload,.css-805ti0,.css-10fqe38,.css-n9os37,.css-sdgtgb,.css-f955pw,.css-6tr06j,.css-pslzz3,.css-10rrwst,.css-1ne387d,.css-1bmbu2d,.css-mjg7l1,.css-1ulkprw,.css-1k8sxfm,.css-a9sbyu,.CreatorIndex-BottomBox-Item,.css-1r9j229,.css-wgpue5,.css-1hwwfws,.css-1clwviw,.css-ndqbqd,.css-19v79p5,.css-f7rzgf,.css-106u01g,.css-c29erj,.Modal-content,.Sticky,.css-2i2hyg,.css-1sz5gzk,.css-vvikez` +
      `{background-color:${BACKGROUND_CONFIG[bg].opacity}!important;background:${BACKGROUND_CONFIG[bg].opacity}!important;}`;
    const backgroundTransparent =
      `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper,.css-1ggwojn` + `{background-color: transparent!important;}`;
    const borderColor = `.MenuBar-root-rQeFm{border-color: ${bg}!important;}`;
    return background + backgroundOpacity + backgroundTransparent + borderColor;
  },
  normalAppHeader: (bg: string) => {
    // header 颜色变化
    const nodeAppHeader = dom('.AppHeader');
    const nodeTopStoryC = dom('.Topstory>div:not(.Topstory-container)');
    const elementHC = nodeAppHeader ? nodeAppHeader.classList || [] : [];
    const haveTopAD = nodeTopStoryC && nodeTopStoryC.childElementCount;
    const headerBelongAd = haveTopAD ? elementHC[elementHC.length - 1] : '';
    return (
      `${headerBelongAd ? `.AppHeader:not(.${headerBelongAd})` : '.AppHeader'}` +
      `{background-color:${BACKGROUND_CONFIG[bg].opacity}!important;background:${BACKGROUND_CONFIG[bg].opacity}!important;}`
    );
  },
};

/** 自定义样式方法 */
export const myCustomStyle = {
  init: function () {
    const nodeCustomStyle = dom('[name="textStyleCustom"]') as HTMLTextAreaElement;
    if (!nodeCustomStyle) return;
    const { getConfig } = store;
    const strCustomCss = getConfig().customizeCss || '';
    nodeCustomStyle.value = strCustomCss;
    this.change(strCustomCss);
  },
  change: (innerCus: string) => fnInitDomStyle('CTZ_STYLE_CUSTOM', innerCus),
};

/** 启用知乎默认的黑暗模式 */
export const onUseThemeDark = () => {
  dom('html')!.setAttribute('data-theme', myBackground.isUseDark() ? 'dark' : 'light');
};

/** 查找是否使用主题 */
export const findTheme = () => {
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
