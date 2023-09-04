import { fnInitDomStyle, domById, fnReturnStr } from './tools';

/** 修改版心的 css */
export const myVersion = {
  init: function () {
    fnInitDomStyle(
      'CTZ_STYLE_VERSION',
      this.versionWidth() +
        this.vImgSize() +
        this.vQuestionTitleTag() +
        this.vSusHomeTab() +
        this.vSusHeader() +
        this.vFixedListMore() +
        this.vHighlightListItem() +
        this.vShoppingLink() +
        this.vAnswerVideo() +
        this.vFontSizeContent() +
        this.vListVideoSize()
    );
  },
  initAfterLoad: function () {
    // 自定义图片尺寸大小 range 显隐
    domById('CTZ_IMAGE_SIZE_CUSTOM').style.display = pfConfig.zoomImageType === '2' ? 'block' : 'none';
    // 自定义列表视频回答内容 range 显隐
    domById('CTZ_LIST_VIDEO_SIZE_CUSTOM').style.display = pfConfig.zoomListVideoType === '2' ? 'block' : 'none';
  },
  change: function () {
    this.initAfterLoad();
    this.init();
  },
  /** 版心大小修改 */
  versionWidth: () => {
    // 首页列表版心
    const versionHome =
      `.Topstory-mainColumn,.Search-container{width: ${pfConfig.versionHome || '1000'}px!important;}` +
      `.SearchMain{flex: 1}` +
      `.Topstory-container,.css-knqde{width: fit-content!important;}`;
    // 回答详情版心
    const versionAnswer =
      `.Question-main .Question-mainColumn,.QuestionHeader-main{flex: 1;}` +
      `.Question-main .Question-sideColumn{margin-left: 12px;}` +
      `.QuestionHeader .QuestionHeader-content{margin: 0 auto;padding: 0;max-width: initial!important;}` +
      `.Question-main,.QuestionHeader-footer-inner,.QuestionHeader .QuestionHeader-content{width: ${pfConfig.versionAnswer || '1000'}px!important;}` +
      `.Question-main .List-item{border-bottom: 1px dashed #ddd;}`;
    // 文章版心
    const versionArticle =
      `.zhuanlan .AuthorInfo{max-width: initial;}` +
      `.Post-NormalMain .Post-Header,.Post-NormalMain>div,.Post-NormalSub>div` +
      `{width: ${pfConfig.versionArticle || '690'}px!important;}` +
      `.zhuanlan .Post-SideActions{right: calc(50vw - ${+(pfConfig.versionArticle || '690') / 2 + 150}px)}`;
    return versionHome + versionAnswer + versionArticle;
  },
  /** 图片尺寸修改 */
  vImgSize: () => {
    const nContent = fnReturnStr(
      `width: ${pfConfig.zoomImageSize}px!important;cursor: zoom-in!important;max-width: 100%!important;`,
      pfConfig.zoomImageType === '2'
    );
    return (
      `.GifPlayer.isPlaying img {cursor:pointer!important;}` +
      `img.lazy,img.origin_image,.GifPlayer img,.ArticleItem-image,.ztext figure .content_image,.ztext figure .origin_image,.TitleImage{${nContent}}`
    );
  },
  /** 列表视频回答内容尺寸修改 */
  vListVideoSize: () => {
    return `.ZVideoItem>div:first-of-type{${fnReturnStr(`width: ${pfConfig.zoomListVideoSize}px!important;`, pfConfig.zoomListVideoType === '2')}}`;
  },
  /** 列表更多按钮移动至题目右侧 */
  vFixedListMore: () => {
    return fnReturnStr(
      `.Topstory-container .ContentItem-actions .ShareMenu ~ div.ContentItem-action{visibility: visible!important;position: absolute;top: 20px;right: 10px;}`,
      pfConfig.fixedListItemMore
    );
  },
  /** 内容标题添加类别显示 */
  vQuestionTitleTag: () => {
    return fnReturnStr(
      `.AnswerItem .ContentItem-title::before{content:'问答';background:#ec7259}` +
        `.ZVideoItem .ContentItem-title::before{content:'视频';background:#12c2e9}` +
        `.ZvideoItem .ContentItem-title::before{content:'视频';background:#12c2e9}` +
        `.ArticleItem .ContentItem-title::before{content:'文章';background:#00965e}` +
        `.ContentItem .ContentItem-title::before{margin-right:6px;font-weight:normal;display:inline;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff}` +
        `.TopstoryQuestionAskItem .ContentItem-title::before{content:'提问';background:#533b77}`,
      pfConfig.questionTitleTag
    );
  },
  /** 首页问题列表切换模块悬浮 */
  vSusHomeTab: () => {
    return fnReturnStr(
      `.Topstory-container .TopstoryTabs` +
        `{${pfConfig.suspensionHomeTabPo}position:fixed;z-index:100;display:flex;flex-direction:column;height:initial!important;}` +
        `.Topstory-container .TopstoryTabs>a{font-size:0 !important;border-radius:50%}` +
        `.Topstory-container .TopstoryTabs>a::after` +
        `{font-size:16px !important;display:inline-block;padding:6px 8px;margin-bottom:4px;border:1px solid #999999;color:#999999;background: ${
          pfConfig.colorBackground || 'transparent'
        };}` +
        `.Topstory-container .TopstoryTabs>a.TopstoryTabs-link {margin:0!important}` +
        `.Topstory-container .TopstoryTabs>a.TopstoryTabs-link.is-active::after{color:#0066ff!important;border-color:#0066ff!important;}` +
        `.Topstory [aria-controls='Topstory-recommend']::after{content:'推';}` +
        `.Topstory [aria-controls='Topstory-follow']::after{content:'关';border-top-left-radius:4px;border-top-right-radius:4px;}` +
        `.Topstory [aria-controls='Topstory-hot']::after{content:'热';}` +
        `.Topstory [aria-controls="Topstory-zvideo"]::after{content:'视';border-bottom-left-radius:4px;border-bottom-right-radius:4px}` +
        `.Topstory-tabs{border-color: transparent!important;}`,
      pfConfig.suspensionHomeTab
    );
  },
  /** 顶部三大块悬浮 */
  vSusHeader: () => {
    return (
      `.position-suspensionFind{${pfConfig.suspensionFindPo}}` +
      `.position-suspensionUser{${pfConfig.suspensionUserPo}}` +
      `.position-suspensionSearch{${pfConfig.suspensionSearchPo}}` +
      `.position-suspensionFind .Tabs-link{border:1px solid #999999;color:#999999;background: ${pfConfig.colorBackground || 'transparent'};}` +
      `.position-suspensionFind .Tabs-link.is-active{color:#0066ff!important;border-color:#0066ff!important;}` +
      '.position-suspensionUser .css-1m60na {display: none;}.position-suspensionUser .css-1n0eufo{margin-right: 0;}'
    );
  },
  /** 列表内容点击高亮边框 */
  vHighlightListItem: () => {
    return fnReturnStr(
      `.List-item:focus,.TopstoryItem:focus,.HotItem:focus{box-shadow:0 0 0 2px #fff,0 0 0 5px rgba(0, 102, 255, 0.3)!important;outline:none!important;transition:box-shadow 0.3s!important;}`,
      pfConfig.highlightListItem
    );
  },
  vShoppingLink: () => {
    // 购物链接CSS
    const cssObj = {
      0: '',
      1:
        '.MCNLinkCard-imageContainer,.MCNLinkCard-button,.MCNLinkCard-source' +
        ',.ecommerce-ad-commodity-img,.ecommerce-ad-commodity-box-icon,.RichText-MCNLinkCardContainer .BottomInfo' +
        ',.CPSCommonCard-imageBox,.RedPacketCard-imageBox,.CPSCommonCard-tool,.CPSCommonCard-subtitle' +
        ',.RedPacketCard-subtitle,.RedPacketCard-tool' +
        '{display: none!important;}' +
        '.MCNLinkCard,.MCNLinkCard-card,.ecommerce-ad-commodity' +
        ',.RichText-MCNLinkCardContainer .GoodsRecommendCard,.CPSCommonCard,.RedPacketCard-info,.RedPacketCard' +
        '{min-height: 0!important;background: transparent!important;width:100%!important;max-width:100%!important;}' +
        '.MCNLinkCard-cardContainer,.ecommerce-ad-commodity,.ecommerce-ad-commodity-main,.RedPacketCard,.CPSCommonCard' +
        '{padding: 0!important;}' +
        '.MCNLinkCard,.MCNLinkCard-info{margin: 0!important;}' +
        '.MCNLinkCard-info,.ecommerce-ad-commodity-main{flex-direction: row!important;}' +
        '.MCNLinkCard-price{padding-left: 12px;}' +
        '.ecommerce-ad-commodity-box .ecommerce-ad-commodity{height: auto!important;}' +
        '.ecommerce-ad-commodity-box-main-second{width: auto!important;}' +
        '.MCNLinkCard-titleContainer,.ecommerce-ad-commodity-main-content-des span,.CPSCommonCard-title,.RedPacketCard-title' +
        '{color: #fd8d55!important;justify-content: start!important;}' +
        '.MCNLinkCard-titleContainer::before,.ecommerce-ad-commodity-main-content-des span::before' +
        ',.CPSCommonCard-title::before,.RedPacketCard-title::before' +
        '{content: "购物链接："}' +
        '.MCNLinkCard-title{color: #fd8d55!important;}',
      2:
        'a.MCNLinkCard,.RichText-ADLinkCardContainer,.ecommerce-ad-commodity-box,.ecommerce-ad-box' +
        ',.RichText-MCNLinkCardContainer' +
        '{display: none!important;}',
    };
    return cssObj[pfConfig.linkShopping || '0'];
  },
  vAnswerVideo: () => {
    // 回答内视频缩放CSS
    const cssObj = {
      0: '',
      1:
        `.VideoAnswerPlayer-video{display: none;}` +
        `.VideoAnswerPlayer .VideoAnswerPlayer-stateBar::before{content: '视频链接';color: #f77a2d;margin-right: 12px}` +
        `.VideoAnswerPlayer:hover{opacity: 0.8}` +
        `.ZVideoLinkCard-playerContainer, .VideoContributionAnswer-video,.css-ujtn9j` +
        `,.ZVideoLinkCard-info{display: none;}` +
        `.RichText-video .VideoCard{opacity: 0;height: 1px;overflow:hidden;}` +
        `.ZVideoLinkCard::before,.VideoContributionAnswer-container::before,.RichText-video::before` +
        `{content:'「视频 - 点击播放」';color: #f77a2d;cursor:pointer;}` +
        `.ZVideoLinkCard,.VideoContributionAnswer-container{cursor:pointer;padding: 4px 0}` +
        `.ZVideoLinkCard:hover,.VideoContributionAnswer-container:hover{background: #eee}`,
      2: '.VideoAnswerPlayer,.RichText-video{display: none;}',
    };
    return cssObj[pfConfig.linkAnswerVideo || '0'];
  },
  vFontSizeContent: () => {
    // 调整文字大小
    const { fontSizeForList, fontSizeForAnswer, fontSizeForArticle } = pfConfig;
    const list =
      `.Topstory-body .RichContent-inner,.Topstory-body .HotItem-title,.Topstory-body .ctz-list-item-time,.Topstory-body .CommentContent` +
      `,.SearchResult-Card .RichContent-inner,.SearchResult-Card .CommentContent` +
      `{font-size: ${fontSizeForList}px!important;}`;
    const answer = `.Question-main .RichContent-inner,.Question-main .ctz-list-item-time,.Question-main .CommentContent{font-size: ${fontSizeForAnswer}px}`;
    const article = `.zhuanlan .Post-RichTextContainer,.zhuanlan .ctz-article-create-time,.zhuanlan .CommentContent{font-size: ${fontSizeForArticle}px}`;
    return list + answer + article;
  },
};
