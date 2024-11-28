import { IHiddenArray } from '../types';

/** 屏蔽带有标签的回答 */
export const HIDDEN_ANSWER_TAG: Record<string, string> = {
  removeFromYanxuan: '盐选专栏',
  removeUnrealAnswer: '虚构创作',
  removeFromEBook: '电子书',
};

/** 屏蔽账号回答 */
export const HIDDEN_ANSWER_ACCOUNT: Record<string, string> = {
  removeStoryAnswer: '故事档案局',
  removeYanxuanAnswer: '盐选科普',
  removeYanxuanRecommend: '盐选推荐',
  removeYanxuanCPRecommend: '盐选测评室',
};

// 勾选隐藏对应内容
export const HIDDEN_ARRAY: IHiddenArray = [
  {
    key: 'CTZ_HIDDEN_COMMON',
    name: '通用隐藏',
    desc: '',
    content: [
      [{ value: 'hiddenAD', label: '广告' }],
      // [{ value: 'hiddenTopAD', label: '顶部推广（只能物理隐藏，会存在颜色错误）' }],
      [
        { value: 'hiddenLogo', label: 'logo' },
        { value: 'hiddenHeader', label: '顶部悬浮模块' },
        { value: 'hiddenHeaderScroll', label: '滚动顶部悬浮模块/问题名称' },
      ],
      [
        { value: 'hiddenAppHeaderTabHome', label: '发现模块-首页' },
        { value: 'hiddenAppHeaderTabZhi', label: '发现模块-知学堂' },
        // { value: 'hiddenAppHeaderTabVIP', label: '发现模块-会员' },
        { value: 'hiddenAppHeaderTabWaitingForYou', label: '发现模块-等你来答' },
        { value: 'hiddenAppHeaderTabFind', label: '发现模块-知乎直达' },
      ],
      [
        { value: 'hiddenAnswerText', label: '回答操作文字' },
        { value: 'hiddenWhoVoters', label: '回答隐藏用户信息下的附加信息，比如：你赞同过、XXX赞同了等...' },
      ],
      [
        { value: 'hiddenCommitReply', label: '评论「回复」按钮' },
        { value: 'hiddenCommitVote', label: '评论「点赞」按钮' },
        { value: 'hiddenCommitBottom', label: '评论底部信息' },
      ],
      [{ value: 'hiddenZhihuZhiShop', label: '知乎知学堂教育推广商品模块' }],
    ],
  },
  {
    key: 'CTZ_HIDDEN_LIST',
    name: '列表',
    desc: '只在列表中隐藏相应内容',
    content: [
      [
        { value: 'hiddenHomeCreatorEntrance', label: '创作中心' },
        { value: 'hiddenHomeRecommendFollow', label: '推荐关注' },
        { value: 'hiddenHomeCategory', label: '分类圆桌' },
        { value: 'hiddenHomeCategoryMore', label: '更多分类' },
        { value: 'hiddenHomeFooter', label: '知乎指南' },
        { value: 'hiddenYanXuanWriter', label: '盐选作者平台' },
      ],
      [
        { value: 'hiddenHomeListTab', label: '首页列表切换模块' },
        { value: 'hiddenHomeListTabFollow', label: '首页列表切换 - 关注' },
        { value: 'hiddenHomeListTabRecommend', label: '首页列表切换 - 推荐' },
        { value: 'hiddenHomeListTabHot', label: '首页列表切换 - 热榜' },
        { value: 'hiddenHomeListTabVideo', label: '首页列表切换 - 视频' },
      ],
      [
        { value: 'hiddenHotItemIndex', label: '热门排序编号' },
        { value: 'hiddenHotItemLabel', label: '热门"新"元素' },
        { value: 'hiddenHotItemMetrics', label: '热门热度值' },
      ],
      [
        { value: 'hiddenAnswers', label: '列表回答内容' },
        { value: 'hiddenListVideoContent', label: '列表视频回答的内容' },
        { value: 'hiddenItemActions', label: '列表回答操作' },
        { value: 'hiddenListImg', label: '列表图片' },
        { value: 'hiddenReadMoreText', label: '问题列表阅读全文文字' },
        { value: 'hiddenListAnswerInPerson', label: '列表「亲自答」标签' },
      ],
      [
        { value: 'hiddenFollowAction', label: '关注列表关注人操作栏' },
        { value: 'hiddenFollowChooseUser', label: '关注列表用户信息' },
      ],
      [
        { value: 'hiddenSearchBoxTopSearch', label: '搜索栏知乎热搜' },
        { value: 'hiddenSearchPageTopSearch', label: '搜索页知乎热搜' },
        { value: 'hiddenSearchPageFooter', label: '搜索页知乎指南' },
      ],
    ],
  },
  {
    key: 'CTZ_HIDDEN_ANSWER',
    name: '问答',
    desc: '只在回答页面中隐藏相应内容',
    content: [
      [
        { value: 'hiddenQuestionTag', label: '问题话题' },
        { value: 'hiddenQuestionShare', label: '问题分享' },
        { value: 'hiddenQuestionGoodQuestion', label: '「好问题」按钮' },
        { value: 'hiddenQuestionComment', label: '添加评论' },
        { value: 'hiddenQuestionMore', label: '问题更多「...」按钮' },
        { value: 'hiddenQuestionActions', label: '问题操作栏' },
        { value: 'hiddenQuestionSpecial', label: '问题专题收录标签' },
        { value: 'hiddenQuestionFollowing', label: '问题关注按钮' },
        { value: 'hiddenQuestionAnswer', label: '问题写回答按钮' },
        { value: 'hiddenQuestionInvite', label: '问题邀请回答按钮' },
      ],
      [
        { value: 'hiddenDetailAvatar', label: '回答人头像' },
        { value: 'hiddenDetailName', label: '回答人姓名' },
        { value: 'hiddenDetailBadge', label: '回答人简介' },
        { value: 'hiddenDetailFollow', label: '回答人关注按钮' },
        { value: 'hiddenDetailVoters', label: '回答人下赞同数' },
        { value: 'hiddenQuestionSide', label: '问题关注和被浏览数' },
        { value: 'hiddenFixedActions', label: '回答悬浮操作栏' },
        { value: 'hiddenAnswerItemActions', label: '回答内容操作栏' },
        { value: 'hiddenReward', label: '赞赏按钮' },
        { value: 'hidden618HongBao', label: '618红包链接' },
      ],
      [
        { value: 'hiddenAnswerItemTime', label: '回答底部发布编辑时间和IP' },
        { value: 'hiddenAnswerItemTimeButHaveIP', label: '回答底部发布编辑时间（保留IP）' },
      ],
      [
        { value: 'hiddenAnswerRightFooter', label: '详情右侧信息栏' },
        { value: 'hiddenAnswerRightFooterAnswerAuthor', label: '信息栏关于作者' },
        { value: 'hiddenAnswerRightFooterFavorites', label: '信息栏被收藏次数' },
        { value: 'hiddenAnswerRightFooterRelatedQuestions', label: '信息栏相关问题' },
        { value: 'hiddenAnswerRightFooterContentList', label: '信息栏相关推荐' },
        { value: 'hiddenAnswerRightFooterFooter', label: '信息栏知乎指南' },
      ],
    ],
  },
  {
    key: 'CTZ_HIDDEN_ARTICLE',
    name: '文章',
    desc: '只在文章页面中隐藏相应内容',
    content: [
      [
        { value: 'hiddenZhuanlanTag', label: '文章关联话题' },
        { value: 'hiddenZhuanlanActions', label: '文章操作条' },
        { value: 'hiddenZhuanlanTitleImage', label: '文章标题图片' },
        { value: 'hiddenZhuanlanShare', label: '文章悬浮分享按钮' },
        { value: 'hiddenZhuanlanVoters', label: '文章悬浮赞同按钮' },
        { value: 'hiddenZhuanlanAvatarWrapper', label: '文章作者头像' },
        { value: 'hiddenZhuanlanAuthorInfoHead', label: '文章作者姓名' },
        { value: 'hiddenZhuanlanAuthorInfoDetail', label: '文章作者简介' },
        { value: 'hiddenZhuanlanFollowButton', label: '文章作者关注按钮' },
      ],
    ],
  },
  {
    key: 'CTZ_HIDDEN_USER_HOME',
    name: '用户主页',
    desc: '只在用户主页隐藏相应内容',
    content: [
      [
        { value: 'hiddenUserHomeOtherCard', label: '用户主页付费咨询、认证和成就' },
        { value: 'hiddenUserHomePublications', label: '用户主页出版作品' },
        { value: 'hiddenUserHomeCreateEntrance', label: '用户主页创作中心' },
        { value: 'hiddenUserHomeFollow', label: '用户主页关注和关注者卡片' },
        { value: 'hiddenUserHomeLightList', label: '用户主页关注的内容和赞助' },
        { value: 'hiddenUserHomeFooterOperate', label: '用户主页右侧屏蔽·举报用户、个人主页被浏览次数' },
        { value: 'hiddenUserHomeFooter', label: '用户主页知乎指南' },
      ],
    ],
  },
  {
    key: 'CTZ_HIDDEN_USER_COLLECTIONS',
    name: '收藏夹主页',
    desc: '只在我的收藏夹主页隐藏相应内容',
    content: [
      [
        { value: 'hiddenCollectionsCreate', label: '收藏夹创作中心' },
        { value: 'hiddenCollectionsRecommendFollow', label: '收藏夹推荐关注' },
        { value: 'hiddenCollectionsCategory', label: '收藏夹圆桌入口' },
        { value: 'hiddenCollectionsComplementary', label: '收藏夹更多分类' },
        { value: 'hiddenCollectionsFooter', label: '收藏夹知乎指南' },
      ],
    ],
  },
  {
    key: 'CTZ_HIDDEN_TOPIC',
    name: '话题',
    desc: '只在话题隐藏相应内容',
    content: [
      [
        { value: 'hiddenTopicRightNumberBoard', label: '话题主页右侧浏览/讨论量模块' },
        { value: 'hiddenTopicRightParentChild', label: '话题主页右侧父子话题模块' },
        { value: 'hiddenTopicRightFooter', label: '话题主页右侧知乎指南' },
      ],
    ],
  },
];
