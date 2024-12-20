import { myStorage } from '../commons/storage';
import { fnInitDomStyle } from '../commons/tools';

/** 隐藏元素的 css */
export const myHidden = {
  init: async function () {
    const changeValue = await this.change();
    fnInitDomStyle('CTZ_STYLE_HIDDEN', changeValue || '');
  },
  change: async function () {
    const pfConfig = await myStorage.getConfig();
    const cssHidden = Object.keys(this.cssForKey)
      .map((key) => (pfConfig[key] ? this.cssForKey[key] : ''))
      .join('');
    let cssHiddenMore = '';
    this.cssForKeysArray.forEach(({ keys, value }: ICssForKeys) => {
      let trueNumber = 0;
      keys.forEach((key) => pfConfig[key] && trueNumber++);
      trueNumber === keys.length && (cssHiddenMore += value);
    });
    return cssHidden + cssHiddenMore;
  },
  cssForKey: {
    hiddenLogo: `.ZhihuLogoLink,.TopTabNavBar-logo-3d0k,[aria-label="知乎"],.TopNavBar-logoContainer-vDhU2,.zu-top-link-logo{display: none!important;}`,
    hiddenHeader: `.AppHeader,.ColumnPageHeader-Wrapper{display: none!important;}.PubIndex-CategoriesHeader{top: 0!important;}`,
    hiddenHeaderScroll: `.AppHeader.is-fixed{display:none!important;}`,
    hiddenYanXuanWriter: `.KfeCollection-CreateSaltCard{display:none!important;}`,
    hiddenItemActions:
      `.Topstory-container .ContentItem-actions>span,.Topstory-container .ContentItem-actions>button` +
      `,.Topstory-container .ContentItem-actions>div,.Topstory-container .ContentItem-actions>a` +
      `,.TopstoryQuestionAskItem-writeAnswerButton,.TopstoryQuestionAskItem-hint` +
      `{visibility:hidden!important;height:0!important;padding:0!important;}` +
      `.TopstoryQuestionAskItem-hint{margin: 0!important;}` +
      `.Topstory .ContentItem-actions{padding: 0!important;}` +
      `.zhuanlan .ContentItem .ContentItem-actions:not(.Sticky){visibility:hidden!important;height:0!important;}`,
    hiddenAnswerText:
      `.ContentItem-actions{padding: 0 20px!important;line-height: 38px!important;}` +
      `.ContentItem-action,.ContentItem-action button,.ContentItem-actions button` +
      `{font-size: 0!important;padding: 0!important;background: none!important;line-height:inherit!important;}` +
      `.ContentItem-action span,.ContentItem-actions button span{font-size: 16px!important;}` +
      `.ContentItem-action svg,.ContentItem-actions svg{width: 16px!important;height:16px!important;}` +
      `.VoteButton{color: #8590a6!important; }` +
      `.VoteButton.is-active{color: #056de8!important;}` +
      `.ContentItem-action{margin-left:8px!important;}` +
      `.Search-questionFollowButton{display: none}`,
    hiddenQuestionTag: '.QuestionHeader-tags{display: none!important;}',
    hiddenQuestionShare: '.zhihu .Popover.ShareMenu{display: none!important;}',
    hiddenQuestionActions: '.QuestionButtonGroup,.QuestionHeaderActions{display: none!important;}',
    hiddenReward: '.Reward{display: none!important;}',
    hiddenZhuanlanTag: '.Post-topicsAndReviewer{display: none!important;}',
    hiddenListImg: `.RichContent-cover,.HotItem-img,.TopstoryItem .Image-Wrapper-Preview{display:none!important;}` + `.HotItem-metrics--bottom{position: initial!important;}`,
    hiddenReadMoreText: '.ContentItem-more{font-size:0!important;}',
    hiddenAD: '.TopstoryItem--advertCard,.Pc-card,.Pc-word,.RichText-ADLinkCardContainer,.Pc-Business-Card-PcTopFeedBanner{display: none!important;}',
    hiddenAnswers:
      `.Topstory-container .RichContent.is-collapsed .RichContent-inner,.HotItem-excerpt--multiLine` +
      `,.TopstoryQuestionAskItem .RichContent .RichContent-inner,.HotItem-content .HotItem-excerpt` +
      `,.Topstory-recommend .ZVideoItem-video, .Topstory-recommend .VideoAnswerPlayer` +
      `{display: none;}`,
    hiddenListVideoContent: `.Topstory-recommend .ZVideoItem-video,.Topstory-recommend .VideoAnswerPlayer,.Topstory-recommend .ZVideoItem .RichContent{display: none;}`,
    hiddenZhuanlanActions:
      '.RichContent-actions.is-fixed>.ContentItem-actions{display: none;}.zhuanlan .ContentItem .RichContent-actions.is-fixed,.zhuanlan .List-item .RichContent-actions.is-fixed{visibility: hidden!important;}',
    hiddenZhuanlanTitleImage: '.css-1ntkiwo,.TitleImage,.css-78p1r9,.ArticleItem .RichContent>div:first-of-type:not(.RichContent-cover)>div:last-of-type{display: none!important;}',
    hiddenFixedActions: `.zhihu .ContentItem .RichContent-actions.is-fixed,.zhihu .List-item .RichContent-actions.is-fixed{visibility: hidden!important;}`,
    hiddenHotItemMetrics: '.HotItem-content .HotItem-metrics{display: none;}',
    hiddenHotItemIndex: '.HotItem-index{display: none;}.HotItem{padding: 16px!important;}',
    hiddenHotItemLabel: '.HotItem-label{display: none;}',
    hiddenDetailAvatar: '.AnswerItem .AuthorInfo .AuthorInfo-avatarWrapper{display: none;}.AnswerItem .AuthorInfo .AuthorInfo-content{margin-left:0!important;}',
    hiddenDetailBadge: '.AnswerItem .AuthorInfo .AuthorInfo-detail{display: none;}',
    hiddenDetailVoters: '.AnswerItem .css-dvccr2{display: none;}',
    hiddenWhoVoters: '.css-1vqda4a{display: none!important;}',
    hiddenDetailName: '.AnswerItem .AuthorInfo .AuthorInfo-head{display: none;}',
    hiddenDetailFollow: '.AnswerItem .AuthorInfo .FollowButton{display: none;}',
    hiddenHomeTab: '.Topstory-container .TopstoryTabs{display: none!important;}',
    hiddenQuestionSide: '.QuestionHeader-side{display: none;}.QuestionHeader-main{flex: 1!important;}',
    hiddenQuestionFollowing: '.QuestionHeader .FollowButton{display: none;}',
    hiddenQuestionAnswer: '.QuestionHeader .FollowButton ~ a{display: none;}',
    hiddenQuestionInvite: '.QuestionHeader .QuestionHeaderActions>button:first-child{display: none;}',
    hiddenSearchPageTopSearch: '.Search-container .TopSearch{display: none;}',
    hiddenSearchPageFooter: '.Search-container .Footer,.Search-container footer{display: none;}',
    hiddenSearchBoxTopSearch: '.SearchBar-noValueMenu .AutoComplete-group:first-child{display:none;}',
    hiddenZhuanlanShare: '.zhuanlan .Post-SideActions .Popover.ShareMenu{display: none!important;}',
    hiddenZhuanlanVoters: '.zhuanlan .Post-SideActions .like{display: none!important;}',
    hiddenFollowAction: '.TopstoryItem-isFollow .FeedSource-firstline{display: none;}',
    hiddenFollowChooseUser: '.TopstoryItem-isFollow .AuthorInfo{display: none;}',
    hiddenAnswerRightFooter: '.Question-sideColumn{display: none!important;}.Question-main .Question-mainColumn,.ListShortcut{width: inherit;}',
    hiddenAnswerRightFooterAnswerAuthor: '.Question-sideColumn .AnswerAuthor{display: none;}',
    hiddenAnswerRightFooterFavorites: '.Question-sideColumn .AnswerAuthor + .Card{display: none;}',
    hiddenAnswerRightFooterRelatedQuestions: '.Question-sideColumn [data-za-detail-view-path-module="RelatedQuestions"]{display: none;}',
    hiddenAnswerRightFooterContentList: '.Question-sideColumn [data-za-detail-view-path-module="ContentList"]{display: none;}',
    hiddenAnswerRightFooterFooter: '.Question-sideColumn .Footer{display: none;}',
    hidden618HongBao: '.MCNLinkCard[data-mcn-source="淘宝"],.MCNLinkCard[data-mcn-source="京东"],.MCNLinkCard[data-mcn-source="知乎"]{display:none;}',
    hiddenZhuanlanFollowButton: '.zhuanlan .FollowButton{display: none;}',
    hiddenZhuanlanAvatarWrapper: '.zhuanlan .AuthorInfo-avatarWrapper{display: none;}',
    hiddenZhuanlanAuthorInfoHead: '.zhuanlan .AuthorInfo-head{display: none;}',
    hiddenZhuanlanAuthorInfoDetail: '.zhuanlan .AuthorInfo-detail{display: none;}',
    hiddenListAnswerInPerson: '.Topstory-mainColumn .LabelContainer{display: none;}',
    hiddenQuestionSpecial: '.QuestionHeader .LabelContainer-wrapper{display: none;}',
    hiddenHomeCreatorEntrance: '.Topstory .css-19idom{display: none;}',
    hiddenHomeRecommendFollow: '.Topstory .css-173vipd{display: none;}',
    hiddenHomeCategory: '.Topstory .GlobalSideBar-category{display: none;}',
    hiddenHomeCategoryMore: '.Topstory .Card[aria-label="更多分类入口"]{display:none;}',
    hiddenHomeFooter: '.Topstory .Footer,.Topstory footer{display: none;}',
    hiddenAnswerItemActions:
      `.Question-main .ContentItem-actions>span,.Question-main .ContentItem-actions>button` +
      `,.Question-main .ContentItem-actions>div,.Question-main .ContentItem-actions>a` +
      `{visibility:hidden!important;height:0!important;padding:0!important;}`,
    hiddenAnswerItemTime: '.Question-main .ContentItem-time{display: none;margin: 0;}',
    hiddenAnswerItemTimeButHaveIP: '.Question-main .ContentItem-time>a{display: none;}.Question-main .ContentItem-time:empty{display: none;margin: 0;}',
    hiddenAppHeaderTabHome: '.AppHeader-Tab:nth-of-type(1){display: none}',
    hiddenAppHeaderTabZhi: '.AppHeader-Tab:nth-of-type(2){display: none}',
    hiddenAppHeaderTabWaitingForYou: '.AppHeader-Tab:nth-of-type(3){display: none}',
    hiddenAppHeaderTabFind: '.AppHeader-Tab:nth-of-type(4){display: none}',
    hiddenHomeListTabFollow: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-follow"]{display: none}',
    hiddenHomeListTabRecommend: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-recommend"]{display: none}',
    hiddenHomeListTabHot: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-hot"]{display: none}',
    hiddenHomeListTabVideo: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-zvideo"]{display: none}',
    hiddenHomeListTab: '.Topstory-container .TopstoryTabs{display: none}',
    hiddenQuestionGoodQuestion: '.QuestionPage .QuestionHeader .GoodQuestionAction{display: none}',
    hiddenQuestionComment: '.QuestionPage .QuestionHeader .QuestionHeader-Comment{display: none}',
    hiddenQuestionMore: '.QuestionPage .QuestionHeader [aria-label="更多"]{display: none;}',
    hiddenOpenButton: '#CTZ_OPEN_BUTTON{display: none;}',
    hiddenCommitReply: '.Comments-container .css-140jo2 button:first-of-type{display:none;}',
    hiddenCommitVote: '.Comments-container .css-140jo2 button:last-of-type{display:none;}',
    hiddenCommitBottom: '.Comments-container .css-140jo2{display:none;}',
    hiddenUserHomeOtherCard: '.Profile-sideColumn .Card:not(.Publications):not(.FollowshipCard){display:none;}',
    hiddenUserHomePublications: '.Profile-sideColumn .Card.Publications{display:none;}',
    hiddenUserHomeCreateEntrance: '.Profile-sideColumn .CreatorEntrance{display:none;}',
    hiddenUserHomeFollow: '.Profile-sideColumn .FollowshipCard{display:none;}',
    hiddenUserHomeLightList: '.Profile-sideColumn .Profile-lightList{display:none;}',
    hiddenUserHomeFooterOperate: '.Profile-sideColumn .Profile-footerOperations{display:none;}',
    hiddenUserHomeFooter: '.Profile-sideColumn footer{display:none;}',
    hiddenCollectionsCreate: '.Collections-container .Card.CreatorEntrance{display:none;}',
    hiddenCollectionsRecommendFollow: '.Collections-container [data-za-detail-view-path-module="RightSideBar"]>div:last-of-type>.Card{display:none;}',
    hiddenCollectionsCategory: '.Collections-container .Card.GlobalSideBar-category{display:none;}',
    hiddenCollectionsComplementary: '.Collections-container .Card[aria-label="更多分类入口"]{display:none;}',
    hiddenCollectionsFooter: '.Collections-container footer{display:none;}',
    hiddenZhihuZhiShop: '.RichText-EduCardContainer{display:none;}',
    hiddenTopicRightNumberBoard: '[data-za-detail-view-path-module="TopicItem"] .Card .NumberBoard{display:none;}',
    hiddenTopicRightParentChild: '[data-za-detail-view-path-module="TopicItem"] .Card .Card-section{display:none;}',
    hiddenTopicRightFooter: '[data-za-detail-view-path-module="TopicItem"] footer{display:none;}',
  },
  cssForKeysArray: [
    {
      keys: [
        'hiddenUserHomeOtherCard',
        'hiddenUserHomePublications',
        'hiddenUserHomeCreateEntrance',
        'hiddenUserHomeFollow',
        'hiddenUserHomeLightList',
        'hiddenUserHomeFooterOperate',
        'hiddenUserHomeFooter',
      ],
      value: '.Profile-sideColumn{display: none}',
    },
    {
      keys: ['hiddenSearchPageTopSearch', 'hiddenSearchPageFooter'],
      value: '.SearchSideBar{display: none}',
    },
    {
      keys: ['hiddenHomeCreatorEntrance', 'hiddenHomeRecommendFollow', 'hiddenHomeCategory', 'hiddenHomeCategoryMore', 'hiddenHomeFooter'],
      value: '.Topstory-mainColumn{margin: 0 auto;}',
    },
    {
      keys: ['hiddenHomeListTabFollow', 'hiddenHomeListTabRecommend', 'hiddenHomeListTabHot', 'hiddenHomeListTabVideo'],
      value: '.Topstory-container .TopstoryTabs{display: none}',
    },
    {
      keys: ['hiddenTopicRightNumberBoard', 'hiddenTopicRightParentChild', 'hiddenTopicRightFooter'],
      value: '[data-za-detail-view-path-module="TopicItem"]>div:nth-child(2){display: none;}',
    },
  ],
};

interface ICssForKeys {
  keys: string[];
  value: string;
}
