import { IHiddenArray, IHiddenItem } from './types';

/** 通用隐藏 */
const HIDDEN_ITEM_COMMON: IHiddenItem = {
  key: 'CTZ_HIDDEN_COMMON',
  name: '通用',
  desc: '',
  content: [
    [
      {
        label: '隐藏修改器弹出图标 ⚙︎',
        value: 'hiddenOpenButton',
        css: '#CTZ_OPEN_CLOSE{display:none!important;}',
      },
    ],
    [
      {
        label: '广告',
        value: 'hiddenAD',
        css: '.TopstoryItem--advertCard,.Pc-card,.Pc-word,.RichText-ADLinkCardContainer,.Pc-Business-Card-PcTopFeedBanner,.ZhiGoodsCard,.Pc-word-new{display: none!important;}',
      },
    ],
    [
      {
        label: 'LOGO',
        value: 'hiddenLogo',
        css: '.ZhihuLogoLink,.TopTabNavBar-logo-3d0k,[aria-label="知乎"],.TopNavBar-logoContainer-vDhU2,.zu-top-link-logo{display: none!important;}',
      },
      {
        label: '顶部悬浮模块',
        value: 'hiddenHeader',
        css: '.AppHeader,.ColumnPageHeader-Wrapper{display: none!important;}.PubIndex-CategoriesHeader{top: 0!important;}',
      },
      {
        label: '滚动顶部悬浮模块/问题名称',
        value: 'hiddenHeaderScroll',
        css: '.AppHeader.is-fixed{display:none!important;}.zhuanlan .css-f2kkrj{top:0;}',
      },
    ],
    [
      {
        label: '隐藏首页分享想法模块',
        value: 'hiddenHomeWriteArea',
        css: '.Topstory-mainColumn .WriteArea{display: none}',
      },
      {
        label: '顶部菜单栏 - 关注',
        value: 'hiddenHeaderFollow',
        css: '.AppHeader a[href="https://www.zhihu.com/follow"]{display:none}',
      },
      {
        label: '顶部菜单栏 - 推荐',
        value: 'hiddenHeaderRecommend',
        css: '.AppHeader a[href="https://www.zhihu.com/"]{display:none}',
      },
      {
        label: '顶部菜单栏 - 热榜',
        value: 'hiddenHeaderHot',
        css: '.AppHeader a[href="https://www.zhihu.com/hot"]{display:none}',
      },
      {
        label: '顶部菜单栏 - 专栏',
        value: 'hiddenHeaderColumnSquare',
        css: '.AppHeader a[href="https://www.zhihu.com/column-square"]{display:none}',
      },
      {
        label: '顶部菜单栏 - 付费咨询',
        value: 'hiddenHeaderConsult',
        css: '.AppHeader a[href="https://www.zhihu.com/consult"]{display:none}',
      },
      {
        label: '顶部菜单栏 - 知学堂',
        value: 'hiddenHeaderEducationLearning',
        css: '.AppHeader a[href="https://www.zhihu.com/education/learning"]{display:none}',
      },
      {
        label: '顶部菜单栏 - 直答',
        value: 'hiddenHeaderZhida',
        css: '.AppHeader a[href="https://www.zhihu.com/zhida"]{display:none}',
      },

      // {
      //   label: '顶部发现模块-首页',
      //   value: 'hiddenAppHeaderTabHome',
      //   css: '.AppHeader-Tab:nth-of-type(1){display: none}',
      // },
      // {
      //   label: '顶部发现模块-知乎直答',
      //   value: 'hiddenAppHeaderTabFind',
      //   css: '.AppHeader-Tab:nth-of-type(2){display: none}',
      // },
      // {
      //   label: '顶部发现模块-知学堂',
      //   value: 'hiddenAppHeaderTabZhi',
      //   css: '.AppHeader-Tab:nth-of-type(3){display: none}',
      // },
      // {
      //   label: '顶部发现模块-等你来答',
      //   value: 'hiddenAppHeaderTabWaitingForYou',
      //   css: '.AppHeader-Tab:nth-of-type(4){display: none}',
      // },
    ],
    // [
    //   {
    //     label: '回答隐藏用户信息下的附加信息，比如：你赞同过、XXX赞同了等...',
    //     value: 'hiddenWhoVoters',
    //     css: '.css-1vqda4a{display: none!important;}',
    //   },
    // ],
    [
      {
        label: '回答和文章中的知学堂推广商品模块',
        value: 'hiddenZhihuZhiShop',
        css: '.RichText-EduCardContainer{display:none;}',
      },
    ],
  ],
};

/** 操作栏 */
const HIDDEN_ITEM_ACTION: IHiddenItem = {
  key: 'CTZ_HIDDEN_ACTION',
  name: '操作栏',
  desc: '',
  content: [
    [
      {
        label: '推荐、关注列表操作栏',
        value: 'hiddenItemActions',
        css: '#TopstoryContent .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;padding:0;}',
      },
      {
        label: '推荐、关注列表操作栏 - 底部悬浮',
        value: 'hiddenItemActionsIsFixed',
        css: '#TopstoryContent .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '搜索页列表操作栏',
        value: 'hiddenItemActionsSearch',
        css: '#SearchMain .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}',
      },
      {
        label: '搜索页列表操作栏 - 底部悬浮',
        value: 'hiddenItemActionsIsFixedSearch',
        css: '#SearchMain .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '问题页面详情操作栏',
        value: 'hiddenQuestionActions',
        css: '.QuestionButtonGroup,.QuestionHeaderActions{display: none!important;}',
      },
      {
        label: '问题页面回答内容操作栏',
        value: 'hiddenAnswerItemActions',
        css: '.Question-mainColumn .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}',
      },
      {
        label: '问题页面回答内容操作栏 - 底部悬浮',
        value: 'hiddenFixedActions',
        css: '.Question-mainColumn .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '文章页面底部悬浮操作栏',
        value: 'hiddenZhuanlanActions',
        css: '.zhuanlan .RichContent-actions.is-fixed>.ContentItem-actions{display: none;}',
      },
    ],
    [
      {
        label: '收藏夹列表操作栏',
        value: 'hiddenItemActionsCollection',
        css: '.CollectionsDetailPage-mainColumn .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}',
      },
      {
        label: '收藏夹列表操作栏 - 底部悬浮',
        value: 'hiddenItemActionsIsFixedCollection',
        css: '.CollectionsDetailPage-mainColumn .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '个人主页动态、回答、文章等操作栏',
        value: 'hiddenItemActionsUser',
        css: '.Profile-mainColumn .RichContent .ContentItem-actions:not(.is-fixed) {visibility:hidden;height:0;}',
      },
      {
        label: '个人主页动态、回答、文章等操作栏 - 底部悬浮',
        value: 'hiddenItemActionsIsFixedUser',
        css: '.Profile-mainColumn .RichContent .ContentItem-actions.is-fixed{bottom: -60px!important;}',
      },
    ],
    [
      {
        label: '评论「回复」按钮',
        value: 'hiddenCommitReply',
        css: '.Comments-container .css-140jo2 button:first-of-type{display:none;}',
      },
      {
        label: '评论「点赞」按钮',
        value: 'hiddenCommitVote',
        css: '.Comments-container .css-140jo2 button:last-of-type{display:none;}',
      },
      {
        label: '评论底部信息',
        value: 'hiddenCommitBottom',
        css: '.Comments-container .css-140jo2{display:none;}',
      },
    ],
  ],
};

/** 列表页面 */
const HIDDEN_ITEM_LIST: IHiddenItem = {
  key: 'CTZ_HIDDEN_LIST',
  name: '列表页面',
  desc: '只在列表中隐藏相应内容',
  content: [
    [
      {
        label: '创作中心',
        value: 'hiddenHomeCreatorEntrance',
        css: '.Topstory .css-19idom{display: none;}',
      },
      {
        label: '圈子',
        value: 'hiddenHomeQuanzi',
        css: '.Card.css-18gpi2u{display:none;}',
      },
      {
        label: '盐选作者平台',
        value: 'hiddenYanXuanWriter',
        css: '.KfeCollection-CreateSaltCard{display:none!important;}',
      },
      {
        label: '推荐关注',
        value: 'hiddenHomeRecommendFollow',
        css: '.Topstory .css-173vipd{display: none;}',
      },
      {
        label: '分类圆桌',
        value: 'hiddenHomeCategory',
        css: '.Topstory .GlobalSideBar-category{display: none;}',
      },
      {
        label: '更多分类（我的收藏、关注的问题等...）',
        value: 'hiddenHomeCategoryMore',
        css: '.Topstory .Card[aria-label="更多分类入口"]{display:none;}',
      },
      {
        label: '知乎指南',
        value: 'hiddenHomeFooter',
        css: '.Topstory .Footer,.Topstory footer{display: none;}',
      },
    ],
    [
      {
        label: '列表切换模块',
        value: 'hiddenHomeListTab',
        css: '.Topstory-container .TopstoryTabs{display: none}',
      },
      {
        label: '列表切换 - 关注',
        value: 'hiddenHomeListTabFollow',
        css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-follow"]{display: none}',
      },
      {
        label: '列表切换 - 推荐',
        value: 'hiddenHomeListTabRecommend',
        css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-recommend"]{display: none}',
      },
      {
        label: '列表切换 - 热榜',
        value: 'hiddenHomeListTabHot',
        css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-hot"]{display: none}',
      },
      {
        label: '列表切换 - 视频',
        value: 'hiddenHomeListTabVideo',
        css: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-zvideo"]{display: none}',
      },
    ],
    [
      {
        label: '列表内容',
        value: 'hiddenAnswers',
        css:
          '.Topstory-container .RichContent.is-collapsed .RichContent-inner,.HotItem-excerpt--multiLine' +
          ',.TopstoryQuestionAskItem .RichContent .RichContent-inner,.HotItem-content .HotItem-excerpt' +
          ',.Topstory-recommend .ZVideoItem-video, .Topstory-recommend .VideoAnswerPlayer' +
          '{display: none;}',
      },
      {
        label: '列表视频',
        value: 'hiddenListVideoContent',
        css: '.Topstory-recommend .ZVideoItem-video,.Topstory-recommend .VideoAnswerPlayer,.Topstory-recommend .ZVideoItem .RichContent{display: none;}',
      },
      {
        label: '列表图片',
        value: 'hiddenListImg',
        css: '.RichContent-cover,.HotItem-img,.TopstoryItem .Image-Wrapper-Preview{display:none!important;}.HotItem-metrics--bottom{position: initial!important;}',
      },
      {
        label: '列表阅读全文文字',
        value: 'hiddenReadMoreText',
        css: '.ContentItem-more{font-size:0!important;}',
      },
      {
        label: '列表"亲自答"标签',
        value: 'hiddenListAnswerInPerson',
        css: '.Topstory-mainColumn .LabelContainer{display: none;}',
      },
    ],
    // [
    //   {
    //     label: '关注列表关注人操作',
    //     value: 'hiddenFollowAction',
    //     css: '.TopstoryItem-isFollow .FeedSource-firstline{display: none;}',
    //   },
    //   {
    //     label: '关注列表用户信息',
    //     value: 'hiddenFollowChooseUser',
    //     css: '.TopstoryItem-isFollow .AuthorInfo{display: none;}',
    //   },
    // ],
    [
      {
        label: '热榜排序编号',
        value: 'hiddenHotItemIndex',
        css: '.HotItem-index{display: none;}.HotItem{padding: 16px!important;}',
      },
      {
        label: '热榜"新"元素',
        value: 'hiddenHotItemLabel',
        css: '.HotItem-label{display: none;}',
      },
      {
        label: '热榜热度值',
        value: 'hiddenHotItemMetrics',
        css: '.HotItem-content .HotItem-metrics{display: none;}',
      },
      {
        label: '热榜顶部滚动新闻',
        value: 'hiddenHotTopNews',
        css: '#TopstoryContent .css-172osot{display:none;}',
      },
    ],
    [
      {
        label: '搜索栏知乎热搜',
        value: 'hiddenSearchBoxTopSearch',
        css: '.SearchBar-noValueMenu .AutoComplete-group:first-child{display:none;}',
      },
      {
        label: '搜索页知乎热搜',
        value: 'hiddenSearchPageTopSearch',
        css: '.Search-container .TopSearch{display: none;}',
      },
      {
        label: '搜索页知乎指南',
        value: 'hiddenSearchPageFooter',
        css: '.Search-container .Footer,.Search-container footer{display: none;}',
      },
      {
        label: '搜索结果知乎直达',
        value: 'hiddenSearchResultZhida',
        css: '.Search-container .css-q1rdu9{display: none;}',
      },
    ],
  ],
};

/** 回答 */
const HIDDEN_ITEM_ANSWER: IHiddenItem = {
  key: 'CTZ_HIDDEN_ANSWER',
  name: '问答页面',
  desc: '只在问答页面/回答内容中隐藏相应内容',
  content: [
    [
      {
        label: '问题话题',
        value: 'hiddenQuestionTag',
        css: '.QuestionHeader-tags,.QuestionHeader .css-wmwsyx{display: none!important;}',
      },
      {
        label: '问题分享按钮',
        value: 'hiddenQuestionShare',
        css: '.zhihu .QuestionHeaderActions .Popover.ShareMenu{display: none!important;}',
      },
      {
        label: '"好问题"按钮',
        value: 'hiddenQuestionGoodQuestion',
        css: '.QuestionPage .QuestionHeader .GoodQuestionAction{display: none}',
      },
      {
        label: '问题添加评论按钮',
        value: 'hiddenQuestionComment',
        css: '.QuestionPage .QuestionHeader .QuestionHeader-Comment{display: none}',
      },
      {
        label: '问题"..."按钮',
        value: 'hiddenQuestionMore',
        css: '.QuestionPage .QuestionHeader [aria-label="更多"]{display: none;}',
      },
      {
        label: '问题专题收录标签',
        value: 'hiddenQuestionSpecial',
        css: '.QuestionHeader .LabelContainer-wrapper{display: none;}',
      },
      {
        label: '问题关注按钮',
        value: 'hiddenQuestionFollowing',
        css: '.QuestionHeader .FollowButton{display: none;}',
      },
      {
        label: '问题写回答按钮',
        value: 'hiddenQuestionAnswer',
        css: '.QuestionHeader .FollowButton ~ a{display: none;}',
      },
      {
        label: '问题邀请回答按钮',
        value: 'hiddenQuestionInvite',
        css: '.QuestionHeader .QuestionHeaderActions>button:first-child{display: none;}',
      },
      {
        label: '问题标题卡片广告和榜单',
        value: 'hiddenQuestionAD',
        css: '.css-e69dqy,.Card.css-15hh8yc{display: none;}',
      },
      {
        label: '问题关注和被浏览数模块',
        value: 'hiddenQuestionSide',
        css: '.QuestionHeader-side{display: none;}.QuestionHeader-main{flex: 1!important;}',
      },
    ],
    [
      {
        label: '查看全部回答按钮',
        value: 'hiddenQuestionViewAll',
        css: '.Question-mainColumn .ViewAll{display:none;}',
      },
    ],
    [
      {
        label: '回答人头像',
        value: 'hiddenDetailAvatar',
        css: '.AnswerItem .AuthorInfo .AuthorInfo-avatarWrapper{display: none;}.AnswerItem .AuthorInfo .AuthorInfo-content{margin-left:0!important;}',
      },
      {
        label: '回答人姓名',
        value: 'hiddenDetailName',
        css: '.AnswerItem .AuthorInfo .AuthorInfo-head{display: none;}',
      },
      {
        label: '回答人简介',
        value: 'hiddenDetailBadge',
        css: '.AnswerItem .AuthorInfo .AuthorInfo-detail{display: none;}',
      },
      {
        label: '回答人关注按钮',
        value: 'hiddenDetailFollow',
        css: '.AnswerItem .AuthorInfo .FollowButton{display: none;}',
      },
      {
        label: '回答人下赞同数',
        value: 'hiddenDetailVoters',
        css: '.AnswerItem .css-dvccr2{display: none;}',
      },
      {
        label: '回答人下方标签',
        value: 'hiddenAnswerDownTags',
        css: '.css-9x8rdd{display: none;margin: 0;}',
      },
      {
        label: '回答「谢邀」标签',
        value: 'hiddenThanksInvite',
        css: '.css-1l65l8l{display: none;margin: 0;}',
      },
    ],
    [
      {
        label: '回答底部发布编辑时间和IP',
        value: 'hiddenAnswerItemTime',
        css: '.Question-main .ContentItem-time{display: none;margin: 0;}',
      },
      {
        label: '回答底部发布编辑时间（保留IP）',
        value: 'hiddenAnswerItemTimeButHaveIP',
        css: '.Question-main .ContentItem-time>a,.RichContent .ContentItem-time>a{display: none;}.Question-main .ContentItem-time:empty{display: none;margin: 0;}',
      },
      {
        label: '回答底部「继续追问」模块',
        value: 'hiddenAnswerKeepAsking',
        css: '.css-jghqwm{display: none!important;}',
      },
      {
        label: '回答内容「所属专栏」模块',
        value: 'hiddenAnswerBelongZhuanlan',
        css: '.css-3ibr72,.css-n4rzfz{display: none!important;}',
      },
      {
        label: '回答内容赞赏按钮',
        value: 'hiddenReward',
        css: '.Reward{display: none!important;}',
      },
      {
        label: '回答内容618红包链接',
        value: 'hidden618HongBao',
        css: '.MCNLinkCard[data-mcn-source="淘宝"],.MCNLinkCard[data-mcn-source="京东"],.MCNLinkCard[data-mcn-source="知乎"]{display:none;}',
      },
    ],
    [
      {
        label: '问答页面右侧信息栏',
        value: 'hiddenAnswerRightFooter',
        css: '.Question-sideColumn{display: none!important;}.Question-main .Question-mainColumn,.ListShortcut{width: inherit;}',
      },
      {
        label: '问答页面信息栏关于作者',
        value: 'hiddenAnswerRightFooterAnswerAuthor',
        css: '.Question-sideColumn .AnswerAuthor{display: none;}',
      },
      {
        label: '问答页面信息栏被收藏次数',
        value: 'hiddenAnswerRightFooterFavorites',
        css: '.Question-sideColumn .AnswerAuthor + .Card{display: none;}',
      },
      {
        label: '问答页面信息栏相关问题',
        value: 'hiddenAnswerRightFooterRelatedQuestions',
        css: '.Question-sideColumn [data-za-detail-view-path-module="RelatedQuestions"]{display: none;}',
      },
      {
        label: '问答页面信息栏相关推荐',
        value: 'hiddenAnswerRightFooterContentList',
        css: '.Question-sideColumn [data-za-detail-view-path-module="ContentList"]{display: none;}',
      },
      {
        label: '问答页面信息栏知乎指南',
        value: 'hiddenAnswerRightFooterFooter',
        css: '.Question-sideColumn .Footer{display: none;}',
      },
    ],
  ],
};

/** 文章专栏 */
const HIDDEN_ITEM_ARTICLE: IHiddenItem = {
  key: 'CTZ_HIDDEN_ARTICLE',
  name: '文章专栏',
  desc: '只在文章页面/文章内容中隐藏相应内容',
  content: [
    [
      {
        label: '文章关联话题',
        value: 'hiddenZhuanlanTag',
        css: '.Post-topicsAndReviewer{display: none!important;}',
      },
      {
        label: '文章标题图片',
        value: 'hiddenZhuanlanTitleImage',
        css: '.zhuanlan .Post-Row-Content-left-article .css-1ac3ifk{display: none!important;}',
        // css: '.css-1ntkiwo,.TitleImage,.css-78p1r9,.ArticleItem .RichContent>div:first-of-type:not(.RichContent-cover)>div:last-of-type{display: none!important;}',
      },
      // {
      //   label: '文章悬浮分享按钮',
      //   value: 'hiddenZhuanlanShare',
      //   css: '.zhuanlan .Post-SideActions .Popover.ShareMenu{display: none!important;}',
      // },
      // {
      //   label: '文章悬浮赞同按钮',
      //   value: 'hiddenZhuanlanVoters',
      //   css: '.zhuanlan .Post-SideActions .like{display: none!important;}',
      // },
      // {
      //   label: '文章底部知乎热榜',
      //   value: 'hiddenZhuanlanButtonHot',
      //   css: '.zhuanlan .Post-Sub .css-1ildg7g{display: none;}',
      // },
      {
        label: '文章所属专栏',
        value: 'hiddenZhuanlanContributions',
        css: '.zhuanlan .PostIndex-Contributions,.zhuanlan .css-3ibr72{display: none;}',
      },
      {
        label: '推荐阅读',
        value: 'hiddenZhuanlan',
        css: '.zhuanlan .Post-NormalSub{display:none;}',
      },
    ],
    [
      {
        label: '文章作者头像',
        value: 'hiddenZhuanlanAvatarWrapper',
        css: '.zhuanlan .AuthorInfo-avatarWrapper{display: none;}.zhuanlan .AuthorInfo-content{margin-left:0;}',
      },
      {
        label: '文章作者姓名',
        value: 'hiddenZhuanlanAuthorInfoHead',
        css: '.zhuanlan .AuthorInfo-head{display: none;}',
      },
      {
        label: '文章作者简介',
        value: 'hiddenZhuanlanAuthorInfoDetail',
        css: '.zhuanlan .AuthorInfo-detail{display: none;}',
      },
      {
        label: '文章作者关注按钮',
        value: 'hiddenZhuanlanFollowButton',
        css: '.zhuanlan .FollowButton{display: none;}',
      },
      {
        label: '关于作者',
        value: 'hiddenZhuanlanAuthorCard',
        css: '.zhuanlan .Card.AuthorCard{display:none}',
      },
    ],
  ],
};

/** 用户主页 */
const HIDDEN_ITEM_USER_HOME: IHiddenItem = {
  key: 'CTZ_HIDDEN_USER_HOME',
  name: '用户主页',
  desc: '只在用户主页隐藏相应内容',
  content: [
    [
      {
        label: '用户主页付费咨询、认证和成就',
        value: 'hiddenUserHomeOtherCard',
        css: '.Profile-sideColumn .Card:not(.Publications):not(.FollowshipCard){display:none;}',
      },
      {
        label: '用户主页出版作品',
        value: 'hiddenUserHomePublications',
        css: '.Profile-sideColumn .Card.Publications{display:none;}',
      },
      {
        label: '用户主页创作中心',
        value: 'hiddenUserHomeCreateEntrance',
        css: '.Profile-sideColumn .CreatorEntrance{display:none;}',
      },
      {
        label: '用户主页关注和关注者卡片',
        value: 'hiddenUserHomeFollow',
        css: '.Profile-sideColumn .FollowshipCard{display:none;}',
      },
      {
        label: '用户主页关注的内容和赞助',
        value: 'hiddenUserHomeLightList',
        css: '.Profile-sideColumn .Profile-lightList{display:none;}',
      },
      {
        label: '用户主页右侧屏蔽·举报用户、个人主页被浏览次数',
        value: 'hiddenUserHomeFooterOperate',
        css: '.Profile-sideColumn .Profile-footerOperations{display:none;}',
      },
      {
        label: '用户主页知乎指南',
        value: 'hiddenUserHomeFooter',
        css: '.Profile-sideColumn footer{display:none;}',
      },
    ],
  ],
};

/** 收藏夹 */
const HIDDEN_ITEM_COLLECTIONS: IHiddenItem = {
  key: 'CTZ_HIDDEN_USER_COLLECTIONS',
  name: '收藏夹',
  desc: '只在我的收藏夹隐藏相应内容',
  content: [
    [
      {
        label: '收藏夹创作中心',
        value: 'hiddenCollectionsCreate',
        css: '.Collections-container .Card.CreatorEntrance{display:none;}',
      },
      {
        label: '收藏夹推荐关注',
        value: 'hiddenCollectionsRecommendFollow',
        css: '.Collections-container [data-za-detail-view-path-module="RightSideBar"]>div:last-of-type>.Card{display:none;}',
      },
      {
        label: '收藏夹圆桌入口',
        value: 'hiddenCollectionsCategory',
        css: '.Collections-container .Card.GlobalSideBar-category{display:none;}',
      },
      {
        label: '收藏夹更多分类',
        value: 'hiddenCollectionsComplementary',
        css: '.Collections-container .Card[aria-label="更多分类入口"]{display:none;}',
      },
      {
        label: '收藏夹知乎指南',
        value: 'hiddenCollectionsFooter',
        css: '.Collections-container footer{display:none;}',
      },
    ],
  ],
};

/** 话题 */
const HIDDEN_ITEM_TOPIC: IHiddenItem = {
  key: 'CTZ_HIDDEN_TOPIC',
  name: '话题',
  desc: '只在话题隐藏相应内容',
  content: [
    [
      {
        label: '话题主页右侧浏览/讨论量模块',
        value: 'hiddenTopicRightNumberBoard',
        css: '[data-za-detail-view-path-module="TopicItem"] .Card .NumberBoard{display:none;}',
      },
      {
        label: '话题主页右侧父子话题模块',
        value: 'hiddenTopicRightParentChild',
        css: '[data-za-detail-view-path-module="TopicItem"] .Card .Card-section{display:none;}',
      },
      {
        label: '话题主页右侧知乎指南',
        value: 'hiddenTopicRightFooter',
        css: '[data-za-detail-view-path-module="TopicItem"] footer{display:none;}',
      },
    ],
  ],
};

// 勾选隐藏对应内容
export const HIDDEN_ARRAY: IHiddenArray = [
  HIDDEN_ITEM_COMMON,
  HIDDEN_ITEM_ACTION,
  HIDDEN_ITEM_LIST,
  HIDDEN_ITEM_ANSWER,
  HIDDEN_ITEM_ARTICLE,
  HIDDEN_ITEM_USER_HOME,
  HIDDEN_ITEM_COLLECTIONS,
  HIDDEN_ITEM_TOPIC,
];

/** 多个配置影响到的隐藏内容 */
export const HIDDEN_ARRAY_MORE = [
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
  {
    keys: ['hiddenZhuanlanAuthorCard', 'hiddenAD'],
    value: '.zhuanlan .Post-Row-Content-right{display:none;}',
  },
];
