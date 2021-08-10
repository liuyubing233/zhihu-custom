// ==UserScript==
// @name         知乎修改器✈持续更新✈努力实现功能最全的知乎配置插件
// @namespace    http://tampermonkey.net/
// @version      2.5.38
// @description  页面模块可配置化|列表种类和关键词强过滤内容，关键词过滤后自动调用“不感兴趣”的接口，防止在其他设备上出现同样内容|视频一键下载|回答内容按照点赞数和评论数排序|设置自动收起所有长回答或自动展开所有回答|移除登录弹窗|设置过滤故事档案局和盐选科普回答等知乎官方账号回答|首页切换模块，发现切换模块、个人中心、搜素栏可悬浮并自定义位置|夜间模式开关及背景色修改|收藏夹导出为PDF|隐藏知乎热搜，体验纯净搜索|列表添加标签种类|去除广告|设置购买链接显示方式|外链直接打开|更多功能请在插件里体验...
// @author       super pufferfish
// @match        *://*.zhihu.com/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_log
// @grant        GM_download
// @run-at       document-start
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

const domA = (n) => document.querySelectorAll(n)

const HTML_HOOTS = ['www.zhihu.com', 'zhuanlan.zhihu.com']

// 根据名称删除的官方回答
const REMOVE_ANSWER_BY_NAME = [
  { id: 'removeStoryAnswer', name: '故事档案局' },
  { id: 'removeYanxuanAnswer', name: '盐选科普' },
  { id: 'removeYanxuanRecommend', name: '盐选推荐' },
]

const C_STICKY_LEFT = '.pf-left-container .Sticky'
const C_STICKY_LEFT_DAD = '.pf-left-container'
const C_STICKY_RIGHT = '.GlobalSideBar .Sticky'
const C_STICKY_RIGHT_DAD = '.GlobalSideBar'

const BACKGROUND_CONFIG = {
  '#ffffff': { name: '默认', opacity: '' },
  'bisque': { name: '护眼红', opacity: '#fff4e7' },
  '#FAF9DE': { name: '杏仁黄', opacity: '#fdfdf2' },
  '#cce8cf': { name: '青草绿', opacity: '#e5f1e7' },
  '#EAEAEF': { name: '极光灰', opacity: '#f3f3f5' },
  '#E9EBFE': { name: '葛巾紫', opacity: '#f2f3fb' },
}

const ICO = {
  github: '<link rel="icon" class="js-site-favicon" id="pf-ico" type="image/svg+xml" href="https://github.githubassets.com/favicons/favicon.svg">',
  csdn: '<link href="https://g.csdnimg.cn/static/logo/favicon32.ico" id="pf-ico" rel="shortcut icon" type="image/x-icon">',
  juejin: '<link data-n-head="ssr" rel="shortcut icon" id="pf-ico" href="https://b-gold-cdn.xitu.io/favicons/v2/favicon.ico">',
  zhihu: '<link rel="shortcut icon" type="image/x-icon" id="pf-ico" href="https://static.zhihu.com/heifetz/favicon.ico">',
}

const ANSWER_SORT_IDS = {
  'Select1-0': { key: 'default', name: '默认排序' },
  'Select1-1': { key: 'update', name: '按时间排序' },
  'Select1-2': { key: 'vote', name: '点赞数排序' },
  'Select1-3': { key: 'comment', name: '评论数排序' },
}

const SORT_KEYS = { vote: '点赞数排序', comment: '评论数排序' }

/** onchange时只调用cssVersion的name */
const DO_CSS_VERSION = [
  'versionHeart',
  'versionHeartSelf',
  'suspensionHomeTabStyle',
  'suspensionFindStyle',
  'questionTitleTag',
  'fixedListItemMore',
  'zoomAnswerImage',
  'shoppingLink',
  'answerVideoLink',
  'toHomeButton',
  'zoomAnswerText',
  'listOutPutNotInterested',
  'highlightListItem',
]

/** 最小版心 */
const LEAST_HEART = '1000';

(function () {
  'use strict'
  const INNER_HTML =
    `<div style="display: none;"class="pf-mark"><div class="pf-modal-parent"><div class="pf-modal-bg"></div><div class="pf-modal"><div class="pf-modal-header"><span class="pf-modal-header-title">知乎编辑器<span class="pf-version"></span></span><i class="iconfont pf-b-close">&#xe61b;</i></div><div class="pf-modal-content"><ul class="pf-left"><li><a href="#pf-set-basis">基础设置</a></li><li><a href="#pf-set-home">首页设置</a></li><li><a href="#pf-set-remove-answer">过滤内容</a></li><li><a href="#pf-set-answer">回答设置</a></li><li><a href="#pf-set-hidden">隐藏模块</a></li><li><a href="#pf-set-color">颜色设置</a></li><li><a href="#pf-set-config">配置导出导入</a></li></ul><div class="pf-right"><div id="pf-set-basis"><h3>基础设置</h3><button class="pf-simple-button pf-button">启用极简模式</button><button class="pf-restore-config pf-button">恢复默认配置</button><div class="pf-radio-div d-flex"><span class="pf-label">设置版心方式</span><div class="pf-content lh-28 flex-1"><label><input class="pf-i"name="chooseHeart"type="radio"value="system"/>使用预设</label><label><input class="pf-i"name="chooseHeart"type="radio"value="self"/>自定义</label></div></div><div class="pf-radio-div pf-heart-system"><span class="pf-label">版心大小</span><select name="versionHeart"class="pf-i w-200"><option value="1000">1000px</option><option value="1200">1200px</option><option value="1500">1500px</option><option value="100%">拉满</option></select></div><div class="pf-radio-div pf-heart-self"style="display: none;"><span class="pf-label">版心大小</span><div class="flex-1"><input name="versionHeartSelf"type="number"class="pf-i h-25 w-200"><div class="pf-commit">输入值小于1000时按照1000来处理，避免不必要的错误</div></div></div><div class="pf-raido-divoom-answer-image"><span class="pf-label">回答和文章图片缩放</span><div class="pf-content"><label><input class="pf-i"name="zoomAnswerImage"type="radio"value="100px"/>极小(100px)</label><label><input class="pf-i"name="zoomAnswerImage"type="radio"value="200px"/>小(200px)</label><label><input class="pf-i"name="zoomAnswerImage"type="radio"value="400px"/>中(400px)</label><br><label><input class="pf-i"name="zoomAnswerImage"type="radio"value="default"/>默认</label><label><input class="pf-i"name="zoomAnswerImage"type="radio"value="hidden"/>隐藏</label><label><input class="pf-i"name="zoomAnswerImage"type="radio"value="original"/>原图</label></div></div><div class="pf-hidden-labels"><label><span class="pf-label">动图弹窗显示</span><input class="pf-i"name="showGIFinDialog"type="checkbox"value="on"/></label></div><div class="pf-hidden-labels"><label><span class="pf-label">回答操作文字缩放</span><input class="pf-i"name="zoomAnswerText"type="checkbox"value="on"/></label></div><div class="pf-radio-div"><span class="pf-label">更改网页标题图片</span><br/><label class="pf-radio-img-select"><input class="pf-i"name="titleIco"type="radio"value="github"/><img src="https://github.githubassets.com/favicons/favicon.svg"alt="github"class="pf-radio-img"></label><label class="pf-radio-img-select"><input class="pf-i"name="titleIco"type="radio"value="csdn"/><img src="https://g.csdnimg.cn/static/logo/favicon32.ico"alt="csdn"class="pf-radio-img"></label><label class="pf-radio-img-select"><input class="pf-i"name="titleIco"type="radio"value="juejin"/><img src="https://b-gold-cdn.xitu.io/favicons/v2/favicon.ico"alt="juejin"class="pf-radio-img"></label><label class="pf-radio-img-select"><input class="pf-i"name="titleIco"type="radio"value="zhihu"/><img src="https://static.zhihu.com/heifetz/favicon.ico"alt="zhihu"class="pf-radio-img"></label></div><div class="pf-radio-div"><span class="pf-label">更改网页标题</span><input class="pf-i h-25 w-300"name="title"type="text"/></div><div class="pf-radio-div"><span class="pf-label">首页重定向</span><label><input class="pf-i"name="indexPathnameRedirect"type="radio"value="n"/>默认</label><label><input class="pf-i"name="indexPathnameRedirect"type="radio"value="follow"/>关注</label><label><input class="pf-i"name="indexPathnameRedirect"type="radio"value="hot"/>热榜</label></div><div class="pf-raido-divoom-answer-image"><label><span class="pf-label">页面右下停靠返回主页按钮</span><input class="pf-i"name="toHomeButton"type="checkbox"value="on"/></label><div class="p-t-8"><span class="pf-label">专栏返回主页</span><label><input class="pf-i"name="toHomeButtonZhuanlan"type="radio"value="zhihu"/>知乎首页</label><label><input class="pf-i"name="toHomeButtonZhuanlan"type="radio"value="zhuanlan"/>专栏首页</label></div></div><div class="pf-hidden-labels"><label><span class="pf-label">问题显示创建和最后修改时间</span><input class="pf-i"name="questionCreatedAndModifiedTime"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">首页列表显示创建与最后修改时间</span><input class="pf-i"name="listItemCreatedAndModifiedTime"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">回答列表显示创建与最后修改时间（更改后请刷新页面）</span><input class="pf-i"name="answerItemCreatedAndModifiedTime"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">关注列表高亮原创内容</span><input class="pf-i"name="highlightOriginal"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">列表内容点击高亮边框</span><input class="pf-i"name="highlightListItem"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">文章发布时间置顶</span><input class="pf-i"name="articleCreateTimeToTop"type="checkbox"value="on"/></label></div><div class="pf-other-bg"><div class="pf-label fw-bold border-none">悬浮模块</div><div class="pf-commit border-none">拖动悬浮模块定位位置</div><div class="pf-commit border-none">鼠标放置显示解锁按钮解锁即可拖动<i class="iconfont">&#xe688;</i></div><div class="pf-checkbox-div border-none"><label><span class="pf-label">问题列表切换</span><input class="pf-i"name="suspensionHomeTab"type="checkbox"value="on"/></label><select name="suspensionHomeTabStyle"class="pf-i pf-suspensionHomeTab"style="display: none;"><option value="transparent">透明</option><option value="filling">填充</option></select><label>是否隐藏<input class="pf-i"name="hiddenHomeTab"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div border-none"><label><span class="pf-label">顶部发现模块</span><input class="pf-i"name="suspensionFind"type="checkbox"value="on"/></label><select name="suspensionFindStyle"class="pf-i pf-suspensionFind"style="display: none;"><option value="transparent">透明</option><option value="filling">填充</option></select></div><div class="pf-checkbox-div border-none"><label><span class="pf-label">个人中心</span><input class="pf-i"name="suspensionUser"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div border-none"><label><span class="pf-label">搜索栏</span><input class="pf-i"name="suspensionSearch"type="checkbox"value="on"/></label></div></div></div><div id="pf-set-home"><h3>首页设置</h3><div class="pf-label fw-bold border-none">模块位置</div><div class="pf-radio-div border-none"><span class="pf-label">回答问题</span><label><input class="pf-i"name="positionAnswer"type="radio"value="left"/>左侧</label><label><input class="pf-i"name="positionAnswer"type="radio"value="right"/>右侧</label><label><input class="pf-i"name="positionAnswer"type="radio"value="hidden"/>隐藏</label><select name="positionAnswerIndex"class="pf-i"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-radio-div border-none"><span class="pf-label">创作中心</span><label><input class="pf-i"name="positionCreation"type="radio"value="left"/>左侧</label><label><input class="pf-i"name="positionCreation"type="radio"value="right"/>右侧</label><label><input class="pf-i"name="positionCreation"type="radio"value="hidden"/>隐藏</label><select name="positionCreationIndex"class="pf-i"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-radio-div border-none"><span class="pf-label">圆桌</span><label><input class="pf-i"name="positionTable"type="radio"value="left"/>左侧</label><label><input class="pf-i"name="positionTable"type="radio"value="right"/>右侧</label><label><input class="pf-i"name="positionTable"type="radio"value="hidden"/>隐藏</label><select name="positionTableIndex"class="pf-i"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-radio-div border-none"><span class="pf-label">收藏夹</span><label><input class="pf-i"name="positionFavorites"type="radio"value="left"/>左侧</label><label><input class="pf-i"name="positionFavorites"type="radio"value="right"/>右侧</label><label><input class="pf-i"name="positionFavorites"type="radio"value="hidden"/>隐藏</label><select name="positionFavoritesIndex"class="pf-i"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-radio-div"><span class="pf-label">指南</span><label><input class="pf-i"name="positionFooter"type="radio"value="left"/>左侧</label><label><input class="pf-i"name="positionFooter"type="radio"value="right"/>右侧</label><label><input class="pf-i"name="positionFooter"type="radio"value="hidden"/>隐藏</label><select name="positionFooterIndex"class="pf-i"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-checkbox-div"><label><span class="pf-label">左侧栏固定</span><input class="pf-i"name="stickyLeft"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">右侧栏固定</span><input class="pf-i"name="stickyRight"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">列表更多按钮固定至题目右侧</span><input class="pf-i"name="fixedListItemMore"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">内容标题添加类别标签<span class="pf-label-tag pf-label-tag-Article">文章</span><span class="pf-label-tag pf-label-tag-Answer">问答</span><span class="pf-label-tag pf-label-tag-ZVideo">视频</span></span><input class="pf-i"name="questionTitleTag"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">推荐列表外置[不感兴趣]按钮</span><input class="pf-i"name="listOutPutNotInterested"type="checkbox"value="on"/></label></div></div><div id="pf-set-remove-answer"class="pf-other-bg"><h3>过滤内容<span class="pf-commit pf-title-commit">此部分更改后请重新刷新页面</span></h3><div class="pf-hidden-labels"><label><input class="pf-i"name="removeZhihuOfficial"type="checkbox"value="on"/>知乎官方账号回答</label><div class="pf-commit">此选项会过滤所有官方账号回答，请酌情选择</div></div><div class="pf-hidden-labels"><label><input class="pf-i"name="removeStoryAnswer"type="checkbox"value="on"/>故事档案局</label><label><input class="pf-i"name="removeYanxuanAnswer"type="checkbox"value="on"/>盐选科普</label><label><input class="pf-i"name="removeYanxuanRecommend"type="checkbox"value="on"/>盐选推荐</label><label><input class="pf-i"name="removeFromYanxuan"type="checkbox"value="on"/>选自盐选专栏的回答</label></div><div class="pf-hidden-labels"><span class="pf-label">过滤列表类别</span><div class="pf-commit">建议保留问答，否则页面会一直加载到只剩未选择的内容</div><label><input class="pf-i"name="removeItemAboutAnswer"type="checkbox"value="on"/>问答</label><label><input class="pf-i"name="removeItemAboutArticle"type="checkbox"value="on"/>文章</label><label><input class="pf-i"name="removeItemAboutVideo"type="checkbox"value="on"/>视频</label></div><div class="pf-hidden-labels"><label><div class="pf-label">列表屏蔽关键词，[推荐页]将屏蔽包含关键词的内容</div><div class="pf-checkbox-div"><label><span class="pf-label">屏蔽内容后显示通知提醒框</span><input class="pf-i"name="notificationAboutFilter"type="checkbox"value="on"/></label></div><input name="filterKeyword"type="text"class="h-25 w-300"placeholder="输入后回车或失去焦点即可"/></label><div class="pf-filter-keywords"></div></div><div class="pf-hidden-labels"><div class="pf-label">关注列表过滤</div><label><input class="pf-i"name="removeFollowVoteAnswer"type="checkbox"value="on"/>关注人赞同回答</label><label><input class="pf-i"name="removeFollowVoteArticle"type="checkbox"value="on"/>关注人赞同文章</label><label><input class="pf-i"name="removeFollowFQuestion"type="checkbox"value="on"/>关注人关注问题</label></div></div><div id="pf-set-answer"><h3>回答设置</h3><div class="pf-checkbox-div"><label><span class="pf-label">自动展开所有回答</span><input class="pf-i"name="answerUnfold"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">默认收起所有长回答</span><input class="pf-i"name="answerFoldStart"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">回答[收起]按钮悬浮</span><input class="pf-i"name="suspensionPickUp"type="checkbox"value="on"/></label></div></div><div id="pf-set-hidden"><h3>隐藏模块<span class="pf-commit pf-title-commit">勾选则隐藏相应模块</span></h3><div class="pf-hidden-labels pf-other-bg"><span class="pf-label">购物链接显示设置</span><label><input class="pf-i"name="shoppingLink"type="radio"value="default"/>默认</label><label><input class="pf-i"name="shoppingLink"type="radio"value="justText"/>仅文字</label><label><input class="pf-i"name="shoppingLink"type="radio"value="hidden"/>隐藏</label></div><div class="pf-hidden-labels pf-other-bg"><span class="pf-label">回答视频显示设置</span><label><input class="pf-i"name="answerVideoLink"type="radio"value="default"/>默认</label><label><input class="pf-i"name="answerVideoLink"type="radio"value="justText"/>仅链接</label><label><input class="pf-i"name="answerVideoLink"type="radio"value="hidden"/>隐藏</label></div><div class="pf-hidden-labels"><label><input class="pf-i"name="hiddenAD"type="checkbox"value="on"/>广告</label></div><div class="pf-hidden-labels"><label><input class="pf-i"name="hiddenLogo"type="checkbox"value="on"/>logo</label><label><input class="pf-i"name="hiddenHeader"type="checkbox"value="on"/>顶部悬浮模块</label><label><input class="pf-i"name="hiddenHeaderScroll"type="checkbox"value="on"/>滚动顶部悬浮模块（问题名称）</label></div><div class="pf-hidden-labels"><label><input class="pf-i"name="hiddenHotListWrapper"type="checkbox"value="on"/>热榜榜单TAG</label><label><input class="pf-i"name="hiddenHotItemIndex"type="checkbox"value="on"/>热门排序编号</label><label><input class="pf-i"name="hiddenHotItemLabel"type="checkbox"value="on"/>热门"新"元素</label><label><input class="pf-i"name="hiddenHotItemMetrics"type="checkbox"value="on"/>热门热度值</label></div><div class="pf-hidden-labels"><label><input class="pf-i"name="hiddenAnswers"type="checkbox"value="on"/>列表回答内容</label><label><input class="pf-i"name="hiddenItemActions"type="checkbox"value="on"/>列表回答操作</label><br><label><input class="pf-i"name="hiddenAnswerText"type="checkbox"value="on"/>回答操作文字</label><label><input class="pf-i"name="hiddenListImg"type="checkbox"value="on"/>列表图片</label><label><input class="pf-i"name="hiddenReadMoreText"type="checkbox"value="on"/>问题列表阅读全文文字</label><br><label><input class="pf-i"name="hiddenCollegeEntranceExamination"type="checkbox"value="on"/>列表顶部活动推荐</label><label><input class="pf-i"name="hiddenListAnswerInPerson"type="checkbox"value="on"/>列表[亲自答]标签</label></div><div class="pf-hidden-labels"><label><input class="pf-i"name="hiddenFollowAction"type="checkbox"value="on"/>关注列表关注人操作栏</label><label><input class="pf-i"name="hiddenFollowChooseUser"type="checkbox"value="on"/>关注列表用户信息</label></div><div class="pf-hidden-labels"><label><input class="pf-i"name="hiddenAnswerRights"type="checkbox"value="on"/>收藏喜欢举报</label><label><input class="pf-i"name="hiddenAnswerRightsText"type="checkbox"value="on"/>收藏喜欢举报文字</label></div><div class="pf-hidden-labels"><label><input class="pf-i"name="hiddenDetailAvatar"type="checkbox"value="on"/>详情回答人头像</label><label><input class="pf-i"name="hiddenDetailName"type="checkbox"value="on"/>详情回答人姓名</label><label><input class="pf-i"name="hiddenDetailBadge"type="checkbox"value="on"/>详情回答人简介</label><br><label><input class="pf-i"name="hiddenDetailVoters"type="checkbox"value="on"/>详情回答人下赞同数</label><label><input class="pf-i"name="hiddenReward"type="checkbox"value="on"/>赞赏按钮</label><br><label><input class="pf-i"name="hiddenQuestionSide"type="checkbox"value="on"/>问题关注和被浏览数</label><label><input class="pf-i"name="hiddenFixedActions"type="checkbox"value="on"/>回答悬浮操作条</label><label><input class="pf-i"name="hiddenQuestionTag"type="checkbox"value="on"/>问题话题</label><label><input class="pf-i"name="hiddenQuestionShare"type="checkbox"value="on"/>问题分享</label><br><label><input class="pf-i"name="hiddenQuestionActions"type="checkbox"value="on"/>问题详情操作栏</label><label><input class="pf-i"name="hiddenQuestionFollowing"type="checkbox"value="on"/>关注问题按钮</label><label><input class="pf-i"name="hiddenQuestionAnswer"type="checkbox"value="on"/>回答按钮</label><label><input class="pf-i"name="hiddenQuestionInvite"type="checkbox"value="on"/>邀请回答按钮</label><br><label><input class="pf-i"name="hiddenQuestionSpecial"type="checkbox"value="on"/>详情顶部专题收录标签</label><label><input class="pf-i"name="hiddenQuestionTopic"type="checkbox"value="on"/>详情顶部主题</label><br><label><input class="pf-i"name="hidden618HongBao"type="checkbox"value="on"/>618红包链接</label></div><div class="pf-hidden-labels"><label><input class="pf-i"name="hiddenAnswerRightFooter"type="checkbox"value="on"/>详情右侧信息栏</label><label><input class="pf-i"name="hiddenAnswerRightFooterAnswerAuthor"type="checkbox"value="on"/>信息栏关于作者</label><label><input class="pf-i"name="hiddenAnswerRightFooterFavorites"type="checkbox"value="on"/>信息栏被收藏次数</label><br><label><input class="pf-i"name="hiddenAnswerRightFooterRelatedQuestions"type="checkbox"value="on"/>信息栏相关问题</label><label><input class="pf-i"name="hiddenAnswerRightFooterContentList"type="checkbox"value="on"/>信息栏相关推荐</label><label><input class="pf-i"name="hiddenAnswerRightFooterFooter"type="checkbox"value="on"/>信息栏知乎指南</label></div><div class="pf-hidden-labels"><label><input class="pf-i"name="hiddenSearchBoxTopSearch"type="checkbox"value="on"/>搜索栏知乎热搜</label><label><input class="pf-i"name="hiddenSearchPageTopSearch"type="checkbox"value="on"/>搜索页知乎热搜</label><label><input class="pf-i"name="hiddenSearchPageFooter"type="checkbox"value="on"/>搜索页知乎指南</label><br><label><input class="pf-i"name="hiddenSearchPageListAD"type="checkbox"value="on"/>搜索页商业推广</label></div><div class="pf-hidden-labels"><label><input class="pf-i"name="hiddenZhuanlanTag"type="checkbox"value="on"/>文章关联话题</label><label><input class="pf-i"name="hiddenZhuanlanActions"type="checkbox"value="on"/>文章操作条</label><label><input class="pf-i"name="hiddenZhuanlanTitleImage"type="checkbox"value="on"/>文章标题图片</label><br><label><input class="pf-i"name="hiddenZhuanlanShare"type="checkbox"value="on"/>文章悬浮分享按钮</label><label><input class="pf-i"name="hiddenZhuanlanVoters"type="checkbox"value="on"/>文章悬浮赞同按钮</label><br><label><input class="pf-i"name="hiddenZhuanlanAvatarWrapper"type="checkbox"value="on"/>文章作者头像</label><label><input class="pf-i"name="hiddenZhuanlanAuthorInfoHead"type="checkbox"value="on"/>文章作者姓名</label><label><input class="pf-i"name="hiddenZhuanlanAuthorInfoDetail"type="checkbox"value="on"/>文章作者简介</label><br><label><input class="pf-i"name="hiddenZhuanlanFollowButton"type="checkbox"value="on"/>文章作者关注按钮</label></div></div><div id="pf-set-color"><h3>颜色设置</h3><div class="pf-radio-div pf-color-bg"><div class="pf-label">背景</div><div class="pf-content"name="colorsBackground"></div></div><div class="pf-use-theme-dark"><span class="pf-label">启用夜间模式</span><div class="pf-switch"><input class="pf-switch-checkbox pf-i"id="useThemeDark"name="isUseThemeDark"type="checkbox"><label class="pf-switch-label"for="useThemeDark"><span class="pf-switch-inner"data-on="ON"data-off="OFF"></span><span class="pf-switch-switch"></span></label></div></div></div><div id="pf-set-config"><h3>配置导出导入</h3><div class="pf-local-config"><button class="pf-export-config pf-button">导出当前配置</button><div class="pf-import-dom"><textarea class="pf-textarea"name="configImport"placeholder="配置可参考导出格式"></textarea><button class="pf-import-config pf-button">导入</button></div></div><div class="pf-customize-css"><div class="pf-label">自定义css</div><div class="pf-content"><textarea class="pf-textarea"name="customizeCss"></textarea><button class="pf-customize-css-button pf-button">确定</button></div></div></div><div class="pf-zhihu-self"><div class="pf-zhihu-key"><div>更加方便地浏览知乎，按<span class="key-shadow">?</span>（<span class="key-shadow">Shift</span>+<span class="key-shadow">/</span>）查看所有快捷键</div><a href="/settings/preference"target="_blank">前往开启快捷键功能</a></div></div></div></div><div class="pf-modal-footer"><a href="https://github.com/superPufferfish/custom-zhihu"target="_blank"><span class="fw-bold">点我~</span>Github您的star⭐是我更新的动力😀</a><a href="https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8"target="_blank">GreasyFork</a></div></div></div></div><div style="display: none;"class="pf-preview"id="my-preview-image"><div class="pf-modal-bg"><img class="pf-preview-img"src=""></div></div><div style="display: none;"class="pf-preview"id="my-preview-video"><div class="pf-modal-bg"><video class="pf-preview-video"src=""autoplay loop></video></div></div><a href="https://www.zhihu.com"target="_self"class="pf-to-home"title="返回首页"><i class="iconfont">&#xe606;</i></a><iframe class="pf-pdf-box-content"style="display: none;"></iframe>`
  const INNER_CSS =
    `body{width:100%}*{box-sizing:border-box}@font-face{font-family:'own-iconfont';src:url('//at.alicdn.com/t/font_2324733_3kvi5yxxis5.woff2?t=1622733272249') format('woff2'),url('//at.alicdn.com/t/font_2324733_3kvi5yxxis5.woff?t=1622733272249') format('woff'),url('//at.alicdn.com/t/font_2324733_3kvi5yxxis5.ttf?t=1622733272249') format('truetype')}.iconfont{font-family:'own-iconfont' !important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-webkit-text-stroke-width:.2px;-moz-osx-font-smoothing:grayscale}.pf-op{position:fixed;width:50px;height:40px;line-height:40px;text-align:center;border-radius:0 12px 12px 0;top:100px;left:0;background:rgba(0,0,0,0.2);z-index:200;cursor:pointer;user-select:none;transform:translate(-30px);transition:transform .5s}.pf-op:hover{transform:translate(0)}.pf-to-home{position:fixed;user-select:none;bottom:50px;right:0;height:40px;width:40px;text-align:center;line-height:40px;border-radius:50%;background:#0066ff;color:#fff;transform:translate(30px);transition:transform .5s}.pf-to-home:hover{transform:translate(0)}.pf-to-home i{font-size:24px}.pf-preview,.pf-dialog-pdf,.pf-mark{box-sizing:border-box;position:fixed;height:100%;width:100%;top:0;left:0;overflow-y:auto;z-index:200;background-color:rgba(18,18,18,0.4)}.pf-preview textarea,.pf-dialog-pdf textarea,.pf-mark textarea,.pf-preview input,.pf-dialog-pdf input,.pf-mark input,.pf-preview select,.pf-dialog-pdf select,.pf-mark select{box-sizing:border-box;border:2px solid #ccc;border-radius:4px;padding:4px}.pf-modal-bg{min-height:100%;width:100%;display:flex;justify-content:center;align-items:center}.pf-modal-bg img{cursor:zoom-out;user-select:none}.pf-modal-parent{position:relative;height:100%;min-height:500px;width:100%}.pf-checkbox-div{padding:2px 0}.pf-commit{color:#999;font-size:12px;padding:2px 0}.pf-commit i{margin-left:6px}.pf-other-bg{background:#efefef;padding:12px !important;margin:0 -12px 12px}.pf-other-bg .pf-title-commit{color:red;margin-left:4px}.pf-modal{position:absolute;top:50%;left:50%;width:600px;height:500px;background:#fff;z-index:200;padding:12px 6px 0 12px;border-radius:6px;display:flex;flex-direction:column}.pf-modal ::-webkit-scrollbar{width:.25rem;height:.25rem;background:#eee}.pf-modal ::-webkit-scrollbar-track{border-radius:0}.pf-modal ::-webkit-scrollbar-thumb{border-radius:0;background:#bbb;transition:all .2s;border-radius:.25rem}.pf-modal ::-webkit-scrollbar-thumb:hover{background-color:rgba(95,95,95,0.7)}.pf-modal-show{animation:showModal .5s;animation-fill-mode:forwards}@keyframes showModal{0%{transform:translate(-50%, -35%);opacity:0}100%{transform:translate(-50%, -50%);opacity:1}}.pf-modal-header{padding-bottom:12px;height:36px}.pf-modal-header-title{font-size:20px}.pf-modal-header-title span{margin-left:4px;font-size:12px}.pf-b-close{font-size:16px;width:18px;height:18px;float:right;color:#999;cursor:pointer}.pf-b-close:hover{color:#111f2c}.pf-modal-footer{padding:8px 0}.pf-modal-footer a{margin-right:6px}.pf-modal-footer a:hover{color:#005ce6}.pf-modal-content{display:flex;flex:1;width:100%;font-size:14px;overflow:hidden}.pf-left{width:120px;border-right:1px solid #ddd;list-style:none;margin:0;padding:0}.pf-left li{padding:4px 0;border-right:5px solid transparent}.pf-left li a{text-decoration:none;color:#111f2c}.pf-right{flex:1;overflow-y:auto;scroll-behavior:smooth;padding:0 12px 100px}.pf-right>div{padding-bottom:24px}.pf-right h3{margin:4px 0 8px 0;font-size:18px;font-weight:bold}.pf-zoom-answer-image{display:flex}.pf-zoom-answer-image .pf-content{flex:1}.pf-zoom-answer-image .pf-content label{display:block}.pf-simple-button{margin-bottom:12px}#pf-set-hidden .pf-title-commit{margin-left:6px}#pf-set-home>div,#pf-set-basis>div{border-bottom:1px solid #eee;padding:4px 0}#pf-set-home>div label,#pf-set-basis>div label{padding-right:4px}.pf-label{padding:4px 0}.pf-label::after{content:'：'}.pf-radio-img-select{display:inline-block;text-align:center}.pf-radio-img-select .pf-radio-img{width:32px;height:32px}.pf-radio-img-select input{margin:0;display:none}.pf-radio-img-select input:checked+.pf-radio-img{border:2px solid #4286f4}[name='colorsBackground'] .pf-color-choose-label{display:inline-block;width:100px;height:50px;position:relative;margin-right:6px;margin-bottom:6px}[name='colorsBackground'] .pf-color-choose-label input,[name='colorsBackground'] .pf-color-choose-label span{position:absolute;top:50%;transform:translateY(-50%);z-index:1}[name='colorsBackground'] .pf-color-choose-label input{left:12px}[name='colorsBackground'] .pf-color-choose-label input:checked+.pf-color-radio-item{border:2px solid #4286f4}[name='colorsBackground'] .pf-color-choose-label span{right:20px}[name='colorsBackground'] .pf-color-choose-label .pf-color-radio-item{width:100%;height:100%;border:2px solid transparent;border-radius:12px}#pf-set-color .pf-content{padding:4px}.pf-restore-config{margin-left:12px}.pf-import-dom,.pf-customize-css .pf-content{padding-top:8px;display:flex;align-items:center}.pf-import-dom .pf-textarea,.pf-customize-css .pf-content .pf-textarea{width:70%;height:50px}.pf-import-dom button,.pf-customize-css .pf-content button{height:50px;line-height:50px;width:25%;margin-left:5%;padding:0 !important}.pf-button{padding:4px 8px;border-radius:4px;background:#ddd;position:relative;border:1px solid #bbb}.pf-button:hover{background:#eee}.pf-button:active::after{content:'';position:absolute;width:100%;height:100%;top:0;left:0;background:rgba(0,0,0,0.2)}.pf-button:focus{outline:none}.pf-pdf-dialog-title{margin:0 0 1.4em;font-size:20px;font-weight:bold}.pf-pdf-box-content{width:100%;background:#ffffff}.pf-pdf-view{width:100%;background:#ffffff;word-break:break-all;white-space:pre-wrap;font-size:14px;overflow-x:hidden}.pf-pdf-view a{color:#0066ff}.pf-pdf-view img{max-width:100%}.pf-pdf-view p{margin:1.4em 0}.pf-pdf-dialog-item{padding:12px;border-bottom:1px solid #eee;margin:12px;background:#ffffff}.pf-hidden-labels{padding-bottom:6px;border-bottom:1px solid #dddddd;margin-bottom:6px}.pf-home-tab-is-suspension{border-bottom:1px solid #eeeeee}.pf-home-tab-is-suspension>div{padding-bottom:8px}.pf-export-collection-box{float:right;text-align:right}.pf-export-collection-box button{font-size:16px}.pf-export-collection-box p{font-size:14px;color:#666;margin:4px 0}.pf-label-tag-Answer{background:#ec7259}.pf-label-tag-ZVideo{background:#12c2e9}.pf-label-tag-Article{background:#00965e}.pf-label-tag{margin:0 3px;font-weight:normal;display:inline-block;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff}.pf-filter-keywords-item{display:inline-block;background:#999;color:#fff;border-radius:4px;padding:2px 4px;margin:4px 4px 0 0}.pf-filter-keywords-item-text{margin-right:4px}.pf-filter-keywords-item-delete{cursor:pointer}.pf-filter-keywords-item-delete:hover{color:#444}.stopScroll{height:100% !important;overflow:hidden !important}.my-unlock,.my-lock,.my-lock-mask{display:none;color:#999;cursor:pointer}.my-unlock,.my-lock{margin:4px}.my-lock-mask{position:absolute;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:198}.key-shadow{border:1px solid #eee;border-radius:4px;box-shadow:rgba(0,0,0,0.06) 0 1px 1px 0;font-weight:600;min-width:26px;height:26px;padding:0px 6px;text-align:center}.pf-zhihu-key a{color:#06f}.pf-zhihu-key a:hover{color:#3f51b5}.position-suspensionSearch,.position-suspensionFind,.position-suspensionUser{position:fixed;z-index:100}.position-suspensionSearch:hover .my-unlock,.position-suspensionFind:hover .my-unlock,.position-suspensionUser:hover .my-unlock,.Topstory-container .TopstoryTabs:hover .my-unlock{display:block}.position-suspensionSearch.my-move-this .my-unlock,.position-suspensionFind.my-move-this .my-unlock,.position-suspensionUser.my-move-this .my-unlock,.Topstory-container .TopstoryTabs.my-move-this .my-unlock{display:none !important}.position-suspensionSearch.my-move-this .my-lock,.position-suspensionFind.my-move-this .my-lock,.position-suspensionUser.my-move-this .my-lock,.Topstory-container .TopstoryTabs.my-move-this .my-lock,.position-suspensionSearch.my-move-this .my-lock-mask,.position-suspensionFind.my-move-this .my-lock-mask,.position-suspensionUser.my-move-this .my-lock-mask,.Topstory-container .TopstoryTabs.my-move-this .my-lock-mask{display:block}.position-suspensionSearch.my-move-this .my-lock,.position-suspensionFind.my-move-this .my-lock,.position-suspensionUser.my-move-this .my-lock,.Topstory-container .TopstoryTabs.my-move-this .my-lock{z-index:199;color:#cccccc}.position-suspensionFind{display:flex;flex-direction:column;margin:0 !important}.position-suspensionFind .Tabs-item{padding:0 !important;margin-bottom:4px}.position-suspensionFind .Tabs-item .Tabs-link{padding:8px !important;border-radius:4px}.position-suspensionFind .Tabs-item .Tabs-link::after{content:'' !important;display:none !important}.position-suspensionUser{width:fit-content !important;margin:0 !important;display:flex;flex-direction:column}.position-suspensionUser .AppHeader-messages,.position-suspensionUser .AppHeader-notifications{margin-right:0 !important;margin-bottom:12px}.position-suspensionUser .AppHeader-login,.position-suspensionUser .AppHeader-login~button{display:none}.AppHeader-SearchBar{flex:1}.position-suspensionSearch{line-height:30px;border-radius:16px;width:20px;transition:width .5s}.position-suspensionSearch.focus{width:300px}.position-suspensionSearch.focus>form,.position-suspensionSearch.focus>button,.position-suspensionSearch.focus .my-search-pick-up{display:block}.position-suspensionSearch.focus .my-search-icon{display:none}.position-suspensionSearch.focus:hover{width:324px}.position-suspensionSearch .my-search-icon,.position-suspensionSearch .my-search-pick-up{cursor:pointer;color:#0066ff}.position-suspensionSearch .my-search-icon:hover,.position-suspensionSearch .my-search-pick-up:hover{color:#005ce6}.position-suspensionSearch .my-search-pick-up{font-size:24px;margin-left:4px}.position-suspensionSearch>form,.position-suspensionSearch>button,.position-suspensionSearch .my-search-pick-up{display:none}.position-suspensionSearch .my-search-icon{display:block}.GlobalSideBar-navList{margin-bottom:10px;overflow:hidden;border-radius:2px;box-shadow:0 1px 3px rgba(18,18,18,0.1);box-sizing:border-box}.Question-main .Question-mainColumn,.ListShortcut{flex:1}.zhihu .Question-main{padding:0}.Question-sideColumn{margin-left:12px;width:296px !important}.Question-mainColumnLoginRightButton{margin:20px 22px 18px !important}.ModalWrap .ModalExp-content{height:0 !important;overflow:hidden}.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard{width:48% !important}.GlobalWrite-navTop{display:flex !important;justify-content:space-between !important;flex-wrap:wrap !important}.GlobalWrite-navTop .GlobalWrite-topItem{margin-right:0 !important;margin-bottom:12px !important}.Profile-mainColumn{margin-right:12px}.QuestionHeader,.Post-content{min-width:0 !important}.Post-Main .RichContent-actions{left:50% !important}.Post-Main .RichContent-actions.is-fixed .ContentItem-actions{transform:translateX(-50%) !important}.css-1xy3kyp,.css-1kjxdzv,.css-qqgmyv{max-width:none !important}.SearchTopicReview{width:100px !important}.Topstory-mainColumn{flex:1 !important;min-width:694px !important}.ContentItem-actions{padding-bottom:0 !important}.ContentItem-actions>button,.ContentItem-actions>div{margin-left:8px}.RichContent-inner{margin-top:8px !important}.Post-SideActions-icon,.Post-SideActions button.like,.VoteButton{background:none !important;color:#8590a6 !important;padding:0 !important}.Post-SideActions button.like.active .Post-SideActions-icon,.Post-SideActions button.like.active .likeCount-inner,.VoteButton.is-active{color:#0066ff !important}.SearchMain{flex:1}.SearchSideBar{width:260px !important;flex:initial}.css-1acwmmj{display:none !important}.ProfileMain-tabs{flex-wrap:wrap}.zu-top-search-form{width:auto !important}.zhuanlan .Recommendations-List{position:relative}.zhuanlan .Recommendations-List .PagingButton{position:absolute;z-index:10;border:1px solid #999}.zhuanlan .Recommendations-List .PagingButton-Previous{left:12px}.zhuanlan .Recommendations-List .PagingButton-Next{right:12px}.zhuanlan .css-10l2ro8{width:100%!important}.Select-option:hover{background:#f6f6f6}.pf-left-container,.GlobalSideBar{max-width:250px}.zu-main{padding:24px 12px !important}.fw-bold{font-weight:bold}.w-200{width:200px}.w-300{width:300px}.h-25{height:25px}.lh-28{line-height:28px}.p-t-8{padding-top:8px}.border-none{border:none !important}.d-flex{display:flex}.flex-1{flex:1}.pf-use-theme-dark{display:flex}.pf-switch{position:relative;width:64px;margin:0;scroll-behavior:smooth}.pf-switch-checkbox{display:none}.pf-switch-label{display:block;overflow:hidden;cursor:pointer;border-radius:20px}.pf-switch-inner{display:block;width:200%;margin-left:-100%;transition:margin .3s ease-in 0s}.pf-switch-inner::before,.pf-switch-inner::after{display:block;float:right;width:50%;height:25px;padding:0;line-height:25px;font-size:14px;color:white;font-family:Trebuchet,Arial,sans-serif;font-weight:bold;box-sizing:border-box}.pf-switch-inner::after{content:attr(data-on);padding-left:10px;background-color:#0066ff;color:#ffffff}.pf-switch-inner::before{content:attr(data-off);padding-right:10px;background-color:#eeeeee;color:#999999;text-align:right}.pf-switch-switch{position:absolute;display:block;width:20px;height:20px;margin:2px;background:#ffffff;top:0;bottom:0;right:40px;border:2px solid #999999;border-radius:20px;transition:all .3s ease-in 0s}.pf-switch-checkbox:checked+.pf-switch-label .pf-switch-inner{margin-left:0}.pf-switch-checkbox:checked+.pf-switch-label .pf-switch-switch{right:0px}.pf-notification{position:fixed;top:24px;right:0;z-index:100}.pf-notification-item{position:relative;padding:16px 24px;overflow:hidden;line-height:1.5;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,0.15);background:#fff;font-size:14px;margin:0 24px 24px 0;width:300px;animation:openNotification .2s;animation-fill-mode:forwards}.pf-notification-title{white-space:pre-wrap}.pf-close-notification{position:absolute;top:8px;right:8px;font-size:12px;color:#999;cursor:pointer}@keyframes openNotification{0%{transform:translate(300px);opacity:0}100%{transform:translate(0);opacity:1}}.pf-question-time{color:#999 !important;font-size:14px !important;font-weight:normal !important;line-height:24px}.pf-video-download,.pf-loading{position:absolute;top:20px;left:20px;font-size:24px;color:rgba(255,255,255,0.9);cursor:pointer}.pf-loading{animation:loading 2s;animation-iteration-count:infinite;cursor:default !important}@keyframes loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`

  let pfConfig = {
    chooseHeart: 'system', // 设置版心的方式
    versionHeart: '1200', // 版心宽度
    versionHeartSelf: '1200', // 自定义版心宽度
    positionAnswer: 'left',
    positionAnswerIndex: '1', // 优先级
    positionCreation: 'right',
    positionCreationIndex: '2',
    positionTable: 'right',
    positionTableIndex: '3',
    positionFavorites: 'left',
    positionFavoritesIndex: '4',
    positionFooter: 'right',
    positionFooterIndex: '5',
    stickyLeft: false, // 首页左侧栏是否固定
    stickyRight: false, // 首页右侧栏是否固定
    zoomAnswerImage: 'default', // 图片缩放大小 hidden 100px 200px 400px default
    titleIco: '', // 网页标题logo图
    title: '', // 网页标题
    colorBackground: '#ffffff', // 背景色
    customizeCss: '',
    questionTitleTag: true, // 内容标题添加类别标签
    fixedListItemMore: false, // 列表更多按钮固定至题目右侧
    shoppingLink: 'default', // 购物链接显示设置
    answerVideoLink: 'default', // 回答视频显示设置
    filterKeywords: [],
    showGIFinDialog: true, // 动图弹窗显示
    zoomAnswerText: false, // 回答操作文字缩放
    isUseThemeDark: false, // 是否开启夜间模式
    notificationAboutFilter: false, // 屏蔽内容后显示通知提醒框
    questionCreatedAndModifiedTime: true, // 问题显示创建和最后修改时间
    answerUnfold: false, // 自动展开所有回答
    answerFoldStart: true, // 默认收起所有长回答
    highlightOriginal: true, // 关注列表高亮原创内容
    listOutPutNotInterested: false, // 推荐列表外置[不感兴趣]按钮
    highlightListItem: false, // 列表内容点击高亮边框
    articleCreateTimeToTop: true, // 文章发布时间置顶
    listItemCreatedAndModifiedTime: true, // 列表内容显示发布与最后修改时间
    answerItemCreatedAndModifiedTime: true, // 回答列表显示创建与最后修改时间
    indexPathnameRedirect: 'n', // 首页重定向 follow 关注, hot 热榜
    // 悬浮模块 start ----------------
    suspensionHomeTab: false, // 问题列表切换
    suspensionHomeTabPo: 'left: 20px; top: 100px;', // 定位
    suspensionHomeTabFixed: true,
    suspensionHomeTabStyle: 'transparent', // 样式
    suspensionFind: false, // 顶部发现模块
    suspensionFindPo: 'left: 10px; top: 380px;',
    suspensionFindFixed: true,
    suspensionFindStyle: 'transparent',
    suspensionSearch: false, // 搜索栏
    suspensionSearchPo: 'left: 200px; top: 100px;',
    suspensionSearchFixed: true,
    suspensionUser: false, // 个人中心
    suspensionUserPo: 'right: 60px; top: 100px;',
    suspensionUserFixed: true,
    suspensionPickUp: true, // 长回答和列表收起按钮
    previewOpenGIF: true, // 动图弹窗显示
    toHomeButton: true, // 页面右下停靠返回主页按钮
    toHomeButtonZhuanlan: 'zhihu', // toHomeButtonZhuanlan
    // 悬浮模块 end ------------------
    // 隐藏内容模块 start --------
    hiddenAnswerRightFooter: true, // 回答页面右侧内容
    hiddenFixedActions: false, // 回答下方悬浮操作条
    hiddenLogo: false, // logo
    hiddenHeader: false, // header
    hiddenHeaderScroll: false, // 顶部滚动header
    hiddenItemActions: false, // 列表回答操作
    hiddenAnswerText: false, // 回答操作文字
    hiddenQuestionShare: false, // 问题分享
    hiddenQuestionTag: false, // 问题话题
    hiddenQuestionActions: false, // 问题操作栏
    hiddenReward: false, // 赞赏按钮
    hiddenZhuanlanTag: false, // 专栏关联话题
    hiddenListImg: false, // 问题列表图片
    hiddenReadMoreText: true, // 阅读全文文字
    hiddenAD: true, // 广告
    hiddenAnswerRights: false, // 收藏喜欢举报按钮
    hiddenAnswerRightsText: false, // 收藏喜欢举报按钮文字
    hiddenAnswers: false, // 问题列表回答内容
    hiddenHotListWrapper: false, // 热榜榜单TAG
    hiddenZhuanlanActions: false, // 专栏下方操作条
    hiddenZhuanlanTitleImage: false, // 专栏标题图片
    hiddenHotItemMetrics: false, // 热门热度值
    hiddenHotItemIndex: false, // 热门排序
    hiddenHotItemLabel: false, // 热门"新"元素
    hiddenDetailAvatar: false, // 详情回答人头像
    hiddenDetailBadge: false, // 详情回答人简介
    hiddenDetailVoters: false, // 详情回答人下赞同数
    hiddenDetailName: false, // 详情回答人姓名
    hiddenHomeTab: false, // 首页问题列表切换模块
    hiddenQuestionSide: false, // 问题关注和被浏览数
    hiddenQuestionFollowing: false, // 关注问题按钮
    hiddenQuestionAnswer: false, // 写回答按钮
    hiddenQuestionInvite: false, // 邀请回答按钮
    hiddenSearchBoxTopSearch: false, // 搜索栏知乎热搜
    hiddenSearchPageTopSearch: false, // 搜索页知乎热搜
    hiddenSearchPageFooter: false, // 搜索页知乎指南
    hiddenSearchPageListAD: false, // 搜索页商业推广
    hiddenZhuanlanShare: false, // 专栏悬浮分享按钮
    hiddenZhuanlanVoters: false, // 专栏悬浮赞同按钮
    hiddenCollegeEntranceExamination: true, // 列表顶部活动推荐
    hiddenListAnswerInPerson: false, // 列表[亲自答]标签
    hiddenFollowAction: false, // 关注列表关注人操作栏
    hiddenFollowChooseUser: false, // 关注列表用户信息
    hiddenAnswerRightFooterAnswerAuthor: false, // 信息栏关于作者
    hiddenAnswerRightFooterFavorites: false, // 信息栏被收藏次数
    hiddenAnswerRightFooterRelatedQuestions: false, // 信息栏相关问题
    hiddenAnswerRightFooterContentList: false, // 信息栏相关推荐
    hiddenAnswerRightFooterFooter: false, // 信息栏知乎指南
    hidden618HongBao: true, // 618红包链接（临时补充）
    hiddenZhuanlanFollowButton: false, // 文章作者关注按钮
    hiddenZhuanlanAvatarWrapper: false, // 文章作者头像
    hiddenZhuanlanAuthorInfoHead: false, // 文章作者姓名
    hiddenZhuanlanAuthorInfoDetail: false, // 文章作者简介
    hiddenQuestionTopic: false, // 详情顶部主题
    hiddenQuestionSpecial: false, // 详情顶部专题收录标签
    // 隐藏内容模块 end --------
    // 删除内容模块 start --------
    removeStoryAnswer: true, // 故事档案局回答
    removeYanxuanAnswer: true, // 盐选科普回答
    removeYanxuanRecommend: true, // 盐选推荐
    removeFromYanxuan: true, // 选自盐选专栏的回答
    removeZhihuOfficial: false, // 知乎官方账号回答
    removeItemAboutArticle: false, // 文章
    removeItemAboutAnswer: false, // 问答
    removeItemAboutVideo: false, // 视频
    removeItemAboutAsk: true, // 提问
    removeFollowVoteAnswer: false, // 关注人赞同回答
    removeFollowVoteArticle: false, // 关注人赞同文章
    removeFollowFQuestion: false, // 关注人关注问题
    // 删除内容模块 end --------
  }

  // 脚本内配置缓存
  const myLocalC = {
    cachePfConfig: {}, // 缓存初始配置
    cacheTitle: '', // 缓存页面原标题
    bodySize: 0,
    bodySizePrev: 0,
    fetchHeaders: {}, // fetch的headers内容，获取下来以供使用
    xZst81: '',
  }

  let answerSortBy = 'default' // 列表内容排序方式
  let isLoading = true
  let timeStart = 0

  // 缓存的doms
  const domCache = {
    positionDoms: {}, // 首页原右侧元素
    headerDoms: {}, // header内元素
  }

  const findEvent = {
    creator: { fun: null, num: 0, isFind: false },
    header: { fun: null, num: 0, isFind: false },
  }

  const canOperationTimer = {}
  const canOperation = (name = 'default', t = 300) => {
    const cacheTime = canOperationTimer[name] || 0
    const now = +new Date()
    if (cacheTime === 0 || cacheTime + t < now) {
      canOperationTimer[name] = now
      return true
    } else {
      return false
    }
  }

  /**
   * 存储使用油猴自己的GM存储，解决数据不共通的问题，添加localStorage与GM判断，获取最新存储
   */
  const myStorage = {
    set: async (name, value) => {
      let v = value
      if (name === 'pfConfig') {
        // 如果是pfConfig则添加时间戳
        const valueParse = JSON.parse(value)
        valueParse.t = +new Date()
        v = JSON.stringify(valueParse)
      }
      localStorage.setItem(name, v)
      await GM_setValue(name, v)
    },
    get: async (name) => {
      const config = await GM_getValue(name)
      const configLocal = localStorage.getItem(name)
      let c = config
      if (name === 'pfConfig') {
        // 如果是pfConfig则通过时间戳t来获取最新配置
        const cParse = config ? JSON.parse(config) : null
        const cLParse = configLocal ? JSON.parse(configLocal) : null
        if (!cParse && !cLParse) return ''
        if (!cParse) return configLocal
        if (!cLParse) return config
        if (cParse.t < cLParse.t) return configLocal
        return config
      }
      return c
    }
  }

  const myDialog = {
    open: async () => {
      $('.pf-mark')[0].style.display = 'block'
      $('.pf-modal').addClass('pf-modal-show')
      const newConfig = await myStorage.get('pfConfig')
      const c = newConfig ? JSON.parse(newConfig) : {}
      if (newConfig !== JSON.stringify(pfConfig)) {
        pfConfig = { ...pfConfig, ...c }
        echoData()
      }
      initScrollModal()
      myScroll.stop()
    },
    hide: () => {
      $('.pf-mark')[0].style.display = 'none'
      $('.pf-modal').removeClass('pf-modal-show')
      myScroll.on()
    },
  }

  const myConfig = {
    // 导出配置
    export: async () => {
      const config = await myStorage.get('pfConfig')
      let link = document.createElement('a')
      link.href = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(config)
      link.download = '配置.txt'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    // 导入配置
    import: async () => {
      const configImport = $('[name=configImport]')[0].value
      pfConfig = JSON.parse(configImport)
      await myStorage.set('pfConfig', JSON.stringify(pfConfig))
      onDocumentStart()
      initData()
      doUseThemeDark(pfConfig.isUseThemeDark)
    },
    // 恢复默认配置
    restore: async () => {
      let isUse = confirm('是否启恢复默认配置？\n该功能会覆盖当前配置，建议先将配置导出保存')
      if (isUse) {
        const { filterKeywords = [] } = pfConfig
        pfConfig = {
          ...myLocalC.cachePfConfig,
          filterKeywords,
        }
        await myStorage.set('pfConfig', JSON.stringify(pfConfig))
        onDocumentStart()
        initData()
        doUseThemeDark(pfConfig.isUseThemeDark)
      }
    },
  }

  const myPreview = {
    // 开启预览弹窗
    open: function (src, even, isVideo) {
      if (isVideo) {
        $('.pf-preview-video')[0].src = src
        $('#my-preview-video')[0].style.display = 'block'
      } else {
        $('.pf-preview-img')[0].src = src
        $('#my-preview-image')[0].style.display = 'block'
      }
      // 存在even则保存，关闭时候清除
      // 解决浏览GIF时的弹窗问题
      even && (this.even = even)
      myScroll.stop()
    },
    // 关闭预览弹窗
    hide: function (pEvent) {
      if (this.even) {
        this.even.click()
        this.even = null
      }
      pEvent.style.display = 'none'
      pEvent.id === 'my-preview-video'
        ? pEvent.querySelector('.pf-preview-video').src = ''
        : pEvent.querySelector('.pf-preview-img').src = ''
      myScroll.on()
    },
    even: null,
  }

  // 在打开弹窗时候停止页面滚动，只允许弹窗滚动
  const myScroll = {
    stop: () => $('body').addClass('stopScroll'),
    on: () => $('body').removeClass('stopScroll')
  }

  /**
   * 绑定页面元素的点击拖动方法
   * 最外层函数不使用箭头函数为了能获取到自己的this
   */
  const myMove = {
    init: function (eventName, configName, name) {
      const e = $(eventName)[0]
      // 保存当前元素点击事件
      if (e) {
        this.clicks[configName] = e.click
        e.onmousedown = (ev) => {
          // 固定则跳出
          if (pfConfig[`${name}Fixed`]) return
          const event = window.event || ev

          const bodyW = $('body')[0].offsetWidth
          const windowW = window.innerWidth
          const windowH = window.innerHeight
          const eW = e.offsetWidth
          const eH = e.offsetHeight
          const eL = e.offsetLeft
          const eT = e.offsetTop
          const evX = event.clientX
          const evY = event.clientY

          const dx = evX - eL
          const dy = evY - eT
          const rx = eW + eL - evX
          // 按下拖动
          document.onmousemove = (ev) => {
            const eventN = window.event || ev
            const evNX = eventN.clientX
            let evenLeft = 0
            let evenRight = 0
            const isR = this.useR.find(i => i === name)
            if (isR) {
              // 用body替代window获取宽度来解决右侧滚动条宽度不一致问题
              const right = (bodyW - evNX) - rx
              evenRight = right <= 0 ? 0 : right >= bodyW - eW ? bodyW - eW : right
              e.style.right = evenRight + 'px'
            } else {
              const left = evNX - dx
              evenLeft = left <= 0 ? 0 : left >= windowW - eW ? windowW - eW : left
              e.style.left = evenLeft + 'px'
            }
            const top = eventN.clientY - dy
            const evenTop = top <= 0 ? 0 : top >= windowH - eH ? windowH - eH : top
            // 元素不能超过页面宽高
            e.style.top = evenTop + 'px'
            this.isMove = true
            this.timer[configName] && clearTimeout(this.timer[configName])
            this.timer[configName] = setTimeout(async () => {
              clearTimeout(this.timer[configName])
              pfConfig[configName] = `${isR ? `right: ${evenRight}px;` : `left: ${evenLeft}px;`}top: ${evenTop}px;`
              await myStorage.set('pfConfig', JSON.stringify(pfConfig))
            }, 500)
          }

          // 抬起停止拖动
          document.onmouseup = () => {
            document.onmousemove = null
            document.onmouseup = null
            e.onclick = (e) => {
              // 如果模块被移动则移除默认点击事件
              // 否则返回原有点击事件
              if (this.isMove) {
                this.isMove = false
                return e.preventDefault && e.preventDefault()
              } else {
                return this.clicks[configName]
              }
            }
          }
          if (e.preventDefault) {
            e.preventDefault()
          } else {
            return false
          }
        }
      }
    },
    destroy: function (eventName) {
      const e = $(eventName)[0]
      e && (e.onmousedown = null)
    },
    isMove: false,
    clicks: {},
    timer: {},
    useL: ['suspensionHomeTab', 'suspensionFind', 'suspensionSearch'], // 使用left定位的name
    useR: ['suspensionUser'], // 使用right定位的name
  }

  /**
   * 自定义工具方法
   * 均有return值
   */
  const Util = {
    // 数组去重
    arraySameDe: (arr) => {
      return [...new Set(arr)]
    },
    // 颜色取反 格式是16进制6位 例如用#ffffff而不是#fff
    colorReverse: (OldColorValue) => {
      const colorValue = "0x" + OldColorValue.replace(/#/g, "")
      let str = "000000" + (0xFFFFFF - colorValue).toString(16)
      return '#' + str.substring(str.length - 6, str.length)
    },
    // hex -> rgba
    hexToRgba: (hex, opacity) => {
      return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
        + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')'
    },
    formatDate: (time, formatter = 'YYYY-MM-DD HH:mm:ss') => {
      if (!time) return ''
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const min = date.getMinutes()
      const sec = date.getSeconds()

      // 不足十位添0
      const preArr = Array.apply(null, Array(10)).map(function (elem, index) {
        return '0' + index
      })

      let newTime = formatter.replace(/YYYY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
        .replace(/HH/g, preArr[hour] || hour)
        .replace(/mm/g, preArr[min] || min)
        .replace(/ss/g, preArr[sec] || sec)

      return newTime
    }
  }

  // 视频的操作方法|下载
  const videoFns = {
    finderI: 0,
    timeout: null,
    init: function () {
      this.timeout && clearTimeout(this.timeout)
      if (this.finderI < 30) {
        this.timeout = setTimeout(() => {
          clearTimeout(this.timeout)
          if ($('#player video').length) {
            this.finderI = 0
            domA('#player>div').forEach((even) => {
              const downloadButton = $('<i class="iconfont pf-video-download">&#xe608;</i>')
              const evenLoading = $('<i class="iconfont pf-loading">&#xe605;</i>')
              downloadButton[0].onclick = () => {
                const url = downloadButton.parent().parent().find('video')[0].src
                if (url) {
                  downloadButton[0].style.display = 'none'
                  $(even).append(evenLoading)
                  const name = url.match(/(?<=\/)[\d\w-\.]+(?=\?)/)[0]
                  // 使用tamperMonkey的download方法
                  GM_download({
                    url,
                    name,
                    saveAs: true,
                    onload: () => {
                      // blob转换完成，开始下载的回调
                      downloadButton[0].style.display = 'block'
                      evenLoading.remove()
                    },
                  })
                }
              }
              $(even).find('.pf-video-download') && $(even).find('.pf-video-download').remove()
              $(even).append(downloadButton)
            })

          } else {
            this.init()
            this.finderI++
          }
        }, 500)
      }
    },
  }

  const myLock = {
    append: (e, name) => {
      // 悬浮模块是否固定改为鼠标放置到模块上显示开锁图标 点击即可移动模块
      if (!e[0]) return
      !e.children('.my-unlock')[0] && e.append('<i class="iconfont my-unlock">&#xe688;</i>')
      !e.children('.my-lock')[0] && e.append('<i class="iconfont my-lock">&#xe700;</i>')
      !e.children('.my-lock-mask')[0] && e.append('<div class="my-lock-mask"></div>')
      e.children('.my-unlock')[0].onclick = async () => {
        pfConfig[name + 'Fixed'] = false
        await myStorage.set('pfConfig', JSON.stringify(pfConfig))
        e.addClass('my-move-this')
      }

      e.children('.my-lock')[0].onclick = async () => {
        pfConfig[name + 'Fixed'] = true
        await myStorage.set('pfConfig', JSON.stringify(pfConfig))
        e.removeClass('my-move-this')
      }

      // 如果进入页面的时候该项的FIXED为false则添加class
      if (pfConfig[name + 'Fixed'] === false) {
        e.addClass('my-move-this')
      }
    },
    remove: (e) => {
      if (!e[0]) return
      e.children('.my-unlock')[0] && e.children('.my-unlock').remove()
      e.children('.my-lock')[0] && e.children('.my-lock').remove()
      e.children('.my-lock-mask')[0] && e.children('.my-lock-mask').remove()
    }
  }

  // 首页两侧盒子固定
  const stickyB = {
    scroll: function () {
      window.scrollY > 0 ? stickyB.fixed() : stickyB.inherit()
    },
    fixed: function () {
      // 左侧盒子
      if (pfConfig.stickyLeft && $(C_STICKY_LEFT_DAD)[0]) {
        const { offsetWidth, offsetLeft, offsetTop } = $(C_STICKY_LEFT_DAD)[0]
        $(C_STICKY_LEFT).css({ position: 'fixed', width: offsetWidth, left: offsetLeft, top: offsetTop })
      } else {
        $(C_STICKY_LEFT).removeAttr('style', '')
      }
      // 右侧盒子
      if (pfConfig.stickyRight && $(C_STICKY_RIGHT_DAD)[0]) {
        const { offsetWidth, offsetRight, offsetTop } = $(C_STICKY_RIGHT_DAD)[0]
        $(C_STICKY_RIGHT).css({ position: 'fixed', width: offsetWidth, right: offsetRight, top: offsetTop })
      } else {
        $(C_STICKY_RIGHT).removeAttr('style', '')
        $(C_STICKY_RIGHT)[0] && ($(C_STICKY_RIGHT)[0].style = 'position: inherit!important')
      }
    },
    inherit: function () {
      $(C_STICKY_LEFT).removeAttr('style', '')
      $(C_STICKY_RIGHT).removeAttr('style', '')
      $(C_STICKY_RIGHT)[0] && ($(C_STICKY_RIGHT)[0].style = 'position: inherit!important')
    },
  }

  async function myChanger(ev, type) {
    const { name, value, checked } = ev
    const ob = {
      chooseHeart: () => {
        onChooseHeart()
        versionCSS.init()
      },
      'stickyLeft': stickyB.scroll,
      'stickyRight': stickyB.scroll,
      'suspensionHomeTab': () => {
        versionCSS.init()
        changeSuspensionTab()
      },
      'isUseThemeDark': () => {
        versionCSS.init()
        backgroundCSS.init()
        doUseThemeDark(checked)
        followingListChanger(true)
      },
      'colorBackground': () => {
        backgroundCSS.init()
        followingListChanger(true)
      },
      'suspensionFind': cacheHeader,
      'suspensionSearch': cacheHeader,
      'suspensionUser': cacheHeader,
      'removeZhihuOfficial': onChangeOfficialRemove,
      'titleIco': changeTitleIco,
      'title': changeTitle,
      'customizeCss': changeCustomCSS,
      'toHomeButtonZhuanlan': onToHomeHref,
      'indexPathnameRedirect': onToHomeHref,
      'answerUnfold': () => answerFoldOrNot('answerUnfold', checked),
      'answerFoldStart': () => answerFoldOrNot('answerFoldStart', checked),
      'showGIFinDialog': previewGIF,
      'questionCreatedAndModifiedTime': addQuestionCreatedAndModifiedTime,
      'highlightOriginal': () => followingListChanger(true),
      'articleCreateTimeToTop': addArticleCreateTimeToTop,
    }

    pfConfig[name] = type === 'checkbox' ? checked : value
    await myStorage.set('pfConfig', JSON.stringify(pfConfig))
    if (/^position/.test(name)) {
      initPositionPage()
    } else if (/^hidden/.test(name) || DO_CSS_VERSION.includes(name)) {
      versionCSS.init()
    } else if (/^removeItemAbout/.test(name)) {
      removeItemAboutChanger(ev)
    } else {
      ob[name] && ob[name]()
    }
  }

  function onChooseHeart() {
    const isSystem = pfConfig.chooseHeart === 'system'
    $('.pf-heart-system')[0].style.display = isSystem ? 'block' : 'none'
    $('.pf-heart-self')[0].style.display = !isSystem ? 'flex' : 'none'
  }

  function doUseThemeDark(isDark) {
    $('html').attr('data-theme', isDark ? 'dark' : 'light')
  }

  // 自动收起和展开回答的选项冲突解决
  function answerFoldOrNot(name, isChecked) {
    if (isChecked) {
      const nameReverse = {
        'answerUnfold': 'answerFoldStart',
        'answerFoldStart': 'answerUnfold'
      }
      const r = nameReverse[name]
      $(`[name="${r}"]`)[0].checked = false
      pfConfig[r] = false
      myStorage.set('pfConfig', JSON.stringify(pfConfig))
    }
  }

  function removeItemAboutChanger(ev) {
    const names = ['removeItemAboutAnswer', 'removeItemAboutArticle', 'removeItemAboutVideo']
    let checkedNum = 3
    names.forEach((item) => {
      $(`[name="${item}"]`)[0].checked && checkedNum--
    })
    if (!checkedNum) {
      ev.checked = false
      pfConfig[ev.name] = false
      myStorage.set('pfConfig', JSON.stringify(pfConfig))
      alert('至少保留问答、视频、文章中的一项')
    }
  }

  /**
   * keyword关键词筛选方法
   */
  const myFilterKeyword = {
    add: async function (target) {
      const w = target.value
      const { filterKeywords } = pfConfig
      filterKeywords.push(w)
      pfConfig = {
        ...pfConfig,
        filterKeywords,
      }
      await myStorage.set('pfConfig', JSON.stringify(pfConfig))
      $('.pf-filter-keywords').append($(this.evenText(w)))
      target.value = ''
    },
    del: (event) => {
      if (canOperation('filterKeyword')) {
        const title = event.attr('data-title')
        const { filterKeywords } = pfConfig
        pfConfig = {
          ...pfConfig,
          filterKeywords: filterKeywords.filter(i => i !== title),
        }
        event.remove()
        myStorage.set('pfConfig', JSON.stringify(pfConfig))
      }
    },
    init: function () {
      const { filterKeywords = [] } = pfConfig
      let children = ''
      filterKeywords.forEach((word) => {
        children += this.evenText(word)
      })
      $('.pf-filter-keywords')[0] && $('.pf-filter-keywords').empty()
      $('.pf-filter-keywords').append($(children))
      $('.pf-filter-keywords')[0].onclick = (e) => {
        if ($(e.target).hasClass('pf-filter-keywords-item-delete')) {
          this.del($(e.target).parent())
        }
      }
      $('[name="filterKeyword"]')[0].onchange = (e) => {
        if (canOperation('filterKeywordAdd')) {
          this.add(e.target)
        }
      }
    },
    evenText: (w) => {
      return `<span class="pf-filter-keywords-item" data-title="${w}">`
        + `<span class="pf-filter-keywords-item-text">${w}</span>`
        + `<i class="iconfont pf-filter-keywords-item-delete">&#xe607;</i>`
        + `</span>`
    }
  }

  // 仅回填数据，供每次打开使用
  function echoData() {
    const textSameName = {
      'title': (e) => e.value = pfConfig.title || document.title,
      'customizeCss': (e) => e.value = pfConfig['customizeCss']
    }
    const echoText = (even) => {
      textSameName[even.name]
        ? textSameName[even.name](even)
        : even.value = pfConfig[even.name]
    }
    const echo = {
      'radio': (even) => pfConfig[even.name] && even.value === pfConfig[even.name] && (even.checked = true),
      'checkbox': (even) => even.checked = pfConfig[even.name] || false,
      'select-one': (even) => {
        if (pfConfig[even.name]) {
          for (let i = 0; i < even.length; i++) {
            if (even[i].value === pfConfig[even.name]) {
              even[i].selected = true
            }
          }
        }
      },
      'text': echoText,
      'number': echoText,
    }

    domA('.pf-i').forEach((item) => {
      echo[item.type] && echo[item.type](item)
    })
  }

  function initData() {
    myLocalC.cacheTitle = document.title
    echoData()
    $('.pf-modal-content')[0].onchange = (even) => {
      if ($(even.target).hasClass('pf-i')) {
        return myChanger(even.target, even.target.type)
      }
    }

    initPositionPage()
    onChooseHeart()
    cacheHeader()
    changeTitleIco()
    changeTitle()
    changeSuspensionTab()
    onToHomeHref()

    if (isLoading) {
      isLoading = false
      GM_log('[customize]修改器加载完毕，加载时间：' + (performance.now() - timeStart).toFixed(2) + 'ms')
    }
  }

  function onToHomeHref() {
    if (location.host === 'zhuanlan.zhihu.com' && pfConfig.toHomeButtonZhuanlan === 'zhuanlan') {
      $('.pf-to-home')[0].href = 'https://zhuanlan.zhihu.com'
    } else if (pfConfig.indexPathnameRedirect && pfConfig.indexPathnameRedirect !== 'n') {
      $('.pf-to-home')[0].href = `https://www.zhihu.com/${pfConfig.indexPathnameRedirect}`
    }
  }

  // 改变列表切换TAB悬浮
  function changeSuspensionTab() {
    const name = 'suspensionHomeTab'
    cSuspensionStyle(name)
    const even = $('.Topstory-container .TopstoryTabs')
    pfConfig[name] ? myLock.append(even, name) : myLock.remove(even, name)
  }

  const HEADER_EVENT_NAMES = ['suspensionFind', 'suspensionSearch', 'suspensionUser']
  function cacheHeader() {
    if (!findEvent.header.isFind) {
      findEvent.header.fun && clearTimeout(findEvent.header.fun)
      findEvent.header.fun = setTimeout(() => {
        clearTimeout(findEvent.header.fun)
        if (findEvent.header.num < 100) {
          if ($('.AppHeader-inner')[0]) {
            findEvent.header.isFind = true
            domCache.headerDoms = {
              suspensionFind: { class: '.AppHeader-inner .AppHeader-Tabs', even: $('.AppHeader-inner .AppHeader-Tabs'), index: 1 },
              suspensionSearch: { class: '.AppHeader-inner .AppHeader-SearchBar', even: $('.AppHeader-inner .AppHeader-SearchBar'), index: 2 },
              suspensionUser: { class: '.AppHeader-inner .AppHeader-userInfo', even: $('.AppHeader-inner .AppHeader-userInfo'), index: 3 },
            }
          }
          findEvent.header.num++
          cacheHeader()
        }
      }, 100)
      return
    }
    const C_ICON = '.my-search-icon'
    const C_PICK = '.my-search-pick-up'
    const N_FOCUS = 'focus'
    HEADER_EVENT_NAMES.forEach((name) => {
      const { even } = domCache.headerDoms[name]
      if (pfConfig[name]) {
        // 如果是suspensionSearch则添加展开和收起按钮
        if (name === 'suspensionSearch') {
          !$(C_ICON)[0] && even.prepend('<i class="iconfont my-search-icon">&#xe600;</i>')
          !$(C_PICK)[0] && even.append('<i class="iconfont my-search-pick-up">&#xe601;</i>')
          $(C_ICON)[0] && ($(C_ICON)[0].onclick = () => even.addClass(N_FOCUS))
          $(C_PICK)[0] && ($(C_PICK)[0].onclick = () => even.removeClass(N_FOCUS))
        }
        myLock.append(even, name)
        even.addClass(`position-${name}`)
        $('body').append(even)
      } else {
        if (name === 'suspensionSearch') {
          $(C_ICON)[0] && $(C_ICON).remove()
          $(C_PICK)[0] && $(C_PICK).remove()
          even.hasClass(N_FOCUS) && even.removeClass(N_FOCUS)
        }
        myLock.remove(even, name)
        even.removeClass(`position-${name}`)
        even.removeAttr('style', '')
        $('.AppHeader-inner').append(even)
      }
      cSuspensionStyle(name)
    })
    versionCSS.init()
  }

  // 加载两侧数据
  function initPositionPage() {
    if (!findEvent.creator.isFind) {
      findEvent.creator.fun && clearTimeout(findEvent.creator.fun)
      findEvent.creator.fun = setTimeout(() => {
        clearTimeout(findEvent.creator.fun)
        if (findEvent.creator.num < 100) {
          // 如果查找次数小于100次就继续查找
          // 循环定时直到存在创作中心
          if ($('.GlobalSideBar-creator')[0]) {
            findEvent.creator.isFind = true
            domCache.positionDoms = {
              positionAnswer: { class: 'GlobalWrite', even: $('.GlobalWrite') },
              positionCreation: { class: 'CreatorEntrance', even: $('.GlobalSideBar-creator') },
              positionTable: { class: 'GlobalSideBar-category', even: $('.GlobalSideBar-category') },
              positionFavorites: { class: 'GlobalSideBar-navList', even: $('.GlobalSideBar-navList') },
              positionFooter: { class: 'Footer', even: $('.Footer') },
            }
          }
          findEvent.creator.num++
          initPositionPage()
        }
      }, 100)
      return
    }
    // 清除两侧盒子内容
    $(C_STICKY_LEFT).empty()
    $(C_STICKY_RIGHT).empty()
    const leftDom = []
    const rightDom = []
    // 添加dom
    Object.keys(domCache.positionDoms).forEach((key) => {
      const e = { even: domCache.positionDoms[key].even, index: Number(pfConfig[`${key}Index`]) }
      if (pfConfig[key] === 'left') {
        leftDom.push(e)
      } else if (pfConfig[key] === 'right') {
        rightDom.push(e)
      }
    })
    leftDom.sort((a, b) => a.index - b.index)
    rightDom.sort((a, b) => a.index - b.index)
    leftDom.forEach(({ even }) => $(C_STICKY_LEFT).append(even))
    rightDom.forEach(({ even }) => $(C_STICKY_RIGHT).append(even))
    // 两侧盒子不存在子元素则隐藏
    $(C_STICKY_LEFT_DAD)[0] && ($(C_STICKY_LEFT_DAD)[0].style.display = $(C_STICKY_LEFT).children().length > 0 ? 'block' : 'none')
    $(C_STICKY_RIGHT_DAD)[0] && ($(C_STICKY_RIGHT_DAD)[0].style.display = $(C_STICKY_RIGHT).children().length > 0 ? 'block' : 'none')
    doResizePage()
  }

  // 点击删除知乎官方账号回答
  function onChangeOfficialRemove(checked) {
    if (checked) {
      const names = ['removeStoryAnswer', 'removeYanxuanAnswer', 'removeYanxuanRecommend']
      names.forEach((n) => {
        $(`[name="${n}"]`)[0].checked = checked
      })
    }
  }

  // 悬浮模块切换样式
  function cSuspensionStyle(name) {
    const cssObj = {
      'suspensionHomeTab': '.Topstory-container .TopstoryTabs',
      'suspensionFind': '.AppHeader-Tabs',
      'suspensionSearch': '.AppHeader-SearchBar', // 搜索框使用自己添加的元素
      'suspensionUser': '.AppHeader-userInfo',
    }

    if ($(`.pf-${name}`)[0]) {
      $(`.pf-${name}`)[0].style = pfConfig[name] ? 'display: inline-block;' : 'display: none;'
    }

    // 如果取消悬浮，则注销掉挂载的move方法
    if (cssObj[name]) {
      pfConfig[name] ? myMove.init(cssObj[name], `${name}Po`, name) : myMove.destroy(cssObj[name])
    }
  }

  function changeCustomCSS() {
    $('#pf-css-custom') && $('#pf-css-custom').remove()
    if (!pfConfig.customizeCss) return
    const cssCustom = `<style type="text/css" id="pf-css-custom">${pfConfig.customizeCss}</style>`
    $('head').append(cssCustom)
  }

  // 修改页面标题
  function changeTitle() {
    document.title = pfConfig.title || myLocalC.cacheTitle
  }

  // 修改页面标题ico
  function changeTitleIco() {
    if (!ICO[pfConfig.titleIco]) return
    $('[type="image/x-icon"]')[0] && $('[type="image/x-icon"]').remove()
    $('#pf-ico')[0] && $('#pf-ico').remove()
    ICO[pfConfig.titleIco] && $('head').append(ICO[pfConfig.titleIco])
  }

  function zoomVideos() {
    if (pfConfig.answerVideoLink !== 'justText') return
    const itemClick = (item) => {
      item.onclick = () => {
        const src = $(item).find('iframe').attr('src')
        window.open(src)
      }
    }
    domA('.VideoContributionAnswer-container').forEach(itemClick)
    domA('.RichText-video').forEach(itemClick)
  }

  // 版心CSS方法
  const versionCSS = {
    init: function () {
      const cssVersion = '<style type="text/css" id="pf-css-version">'
        + this.vHeart()
        + this.vImgSize()
        + this.vHidden()
        + this.vShoppingLink()
        + this.vAnswerVideo()
        + this.vSusHomeTab()
        + (pfConfig.questionTitleTag ? this.sQuestionTag : '')
        + `.position-suspensionFind{${pfConfig.suspensionFindPo}}`
        + `.position-suspensionUser{${pfConfig.suspensionUserPo}}`
        + `.position-suspensionSearch{${pfConfig.suspensionSearchPo}}`
        + `.position-suspensionFind .Tabs-link{${this.vSusColor(pfConfig.suspensionFindStyle).normal}}`
        + `.position-suspensionFind .Tabs-link.is-active{${this.vSusColor(pfConfig.suspensionFindStyle).active}}`
        + (pfConfig.fixedListItemMore
          ? `.Topstory-container .ContentItem-actions .ShareMenu ~ div.ContentItem-action`
          + `{visibility: visible!important;position: absolute;top: 20px;right: 10px;}`
          : '')
        + (pfConfig.toHomeButton ? '.pf-to-home{display:block;}' : '.pf-to-home{display:none;}')
        + (pfConfig.positionAnswer === 'hidden' && pfConfig.positionCreation === 'hidden'
          && pfConfig.positionTable === 'hidden' && pfConfig.positionFavorites === 'hidden'
          && pfConfig.positionFooter === 'hidden' ? '.GlobalSideBar{display:none;}' : '')
        + (pfConfig.zoomAnswerText
          ? '.ContentItem-action,.ContentItem-actions .Button--plain,.Post-SideActions-icon,.Post-SideActions button.like,.VoteButton{font-size:12px!important;}'
          : '.VoteButton-TriangleUp,.Zi--TriangleDown {width: 14px;height: 14px;}')
        + (pfConfig.listOutPutNotInterested
          ? `.Topstory-recommend .ContentItem-title::after{content: '不感兴趣';color: #999;font-size: 12px;cursor: pointer;display: inline-block;margin-left:6px;border: 1px solid #999;border-radius: 4px;padding: 0 4px;pointer-events:auto;}`
          + `.ContentItem-title{pointer-events:none;}.ContentItem-title>div,.ContentItem-title>a{pointer-events:auto;}`
          : '')
        + (pfConfig.highlightListItem
          ? `.List-item:focus,.TopstoryItem:focus,.HotItem:focus`
          + `{box-shadow:0 0 0 2px #fff,0 0 0 5px rgba(0, 102, 255, 0.3)!important;outline:none!important;transition:box-shadow 0.3s!important;}`
          : '')
        + '</style>'
      $('#pf-css-version') && $('#pf-css-version').remove()
      $('head').append(cssVersion)

      pathnameHasFn({
        'question': () => {
          zoomVideos()
          listenQuestionSideColumn()
        },
      })
    },
    sQuestionTag: `.AnswerItem .ContentItem-title::before{content:'问答';background:#ec7259}`
      + `.ZVideoItem .ContentItem-title::before{content:'视频';background:#12c2e9}`
      + `.ArticleItem .ContentItem-title::before{content:'文章';background:#00965e}`
      + `.ContentItem .ContentItem-title::before{margin-right:6px;font-weight:normal;display:inline;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff}`
      + `.ContentItem-title div{display:inline}`
      + `.TopstoryQuestionAskItem .ContentItem-title::before{content:'提问';background:#533b77}`,
    vSusHomeTab: function () {
      return pfConfig.suspensionHomeTab
        ? `.Topstory-container .TopstoryTabs`
        + `{${pfConfig.suspensionHomeTabPo}position:fixed;z-index:100;display:flex;flex-direction:column;height:initial!important;}`
        + `.Topstory-container .TopstoryTabs>a{font-size:0 !important;border-radius:50%}`
        + `.Topstory-container .TopstoryTabs>a::after`
        + `{font-size:16px !important;display:inline-block;padding:6px 8px;margin-bottom:4px;${this.vSusColor(pfConfig.suspensionHomeTabStyle).normal}}`
        + `.Topstory-container .TopstoryTabs>a.TopstoryTabs-link {margin:0!important}`
        + `.Topstory-container .TopstoryTabs>a.TopstoryTabs-link.is-active::after {${this.vSusColor(pfConfig.suspensionHomeTabStyle).active}}`
        + `.Topstory [aria-controls='Topstory-recommend']::after{content:'推';}`
        + `.Topstory [aria-controls='Topstory-follow']::after{content:'关';border-top-left-radius:4px;border-top-right-radius:4px;}`
        + `.Topstory [aria-controls='Topstory-hot']::after{content:'热';}`
        + `.Topstory [aria-controls="Topstory-zvideo"]::after{content:'视';border-bottom-left-radius:4px;border-bottom-right-radius:4px}`
        : ''
    },
    vHeart: function () {
      const ver = pfConfig.chooseHeart === 'system'
        ? pfConfig.versionHeart
        : +pfConfig.versionHeartSelf < +LEAST_HEART
          ? LEAST_HEART
          : pfConfig.versionHeartSelf

      const v = ver === '100%' ? ver : ver + 'px'
      const heart = `.QuestionHeader .QuestionHeader-content,.QuestionHeader-footer .QuestionHeader-footer-inner`
        + `,.QuestionHeader-content,.Question-main,.AppHeader-inner,.TopstoryPageHeader,.Topstory-container`
        + `,.ExploreHomePage,.QuestionWaiting,.SearchTabs-inner,.Search-container,.ProfileHeader`
        + `,.Profile-main,.CollectionsDetailPage,.ColumnPageHeader-content,.SettingsMain,.App-main .Creator`
        + `,.Collections-container,.Balance-Layout,.zhuanlan .Post-NormalMain .Post-Header`
        + `,.zhuanlan .Post-RichTextContainer,.zhuanlan .Post-NormalMain>div`
        + `,.zhuanlan .Post-content .RichContent-actions,.zhuanlan .css-1voxft1,.zhuanlan .css-8txec3`
        + `,.zhuanlan .Post-NormalSub>div,.zg-wrap,.QuestionHeader-main.QuestionHeader-footer-main`
        + `,.zhuanlan .css-1xy3kyp`
        + `{width:${v}!important;}`

      const heartC = `.QuestionHeader-main,.Profile-mainColumn,.CollectionsDetailPage-mainColumn`
        + `,.Collections-mainColumn,.Balance-Main,.Post-RichTextContainer`
        + `,.Post-content .RichContent-actions,.css-8txec3,.Post-NormalMain .Post-Header`
        + `,.Post-NormalMain>div,.Post-NormalSub>div,.Post-topicsAndReviewer`
        + `,.css-1xy3kyp,.css-1voxft1,.WriteIndexLayout-main,.css-ny4o71`
        + `{width:calc(${v} - 296px)!important;}`

      return heart + heartC
        + `.Post-SideActions{left: calc(40vw - (${v} / 2))}`
        + (v === '100%' ? '.zhuanlan{padding: 0 24px;}' : '')
    },
    vImgSize: function () {
      const styleObj = {
        'default': '',
        'original': '',
        'hidden': 'display: none!important;',
      }
      const imgC = styleObj[pfConfig.zoomAnswerImage] || 'width:' + pfConfig.zoomAnswerImage + '!important;cursor: zoom-in!important;'
      return `.GifPlayer.isPlaying img {cursor:pointer!important;}`
        + `img.lazy,.GifPlayer img,.ArticleItem-image,.ztext figure .content_image,.ztext figure .origin_image,.TitleImage {${imgC}}`
    },
    vSusColor: function (value) {
      // 悬浮模块颜色填充 跟页面背景颜色同步
      const bg = BACKGROUND_CONFIG[pfConfig.colorBackground].opacity || '#ffffff'
      const normal = {
        'transparent': 'border:1px solid #999999;color:#999999;',
        'filling': `border:1px solid #999999;color:#999999;background:${bg};`,
      }
      const active = {
        'transparent': 'color:#0066ff!important;border-color:#0066ff!important;',
        'filling': 'color:#ffffff!important;border-color:#0066ff!important;background:#0066ff!important;',
      }
      return {
        normal: normal[value],
        active: active[value],
      }
    },
    vShoppingLink: function () {
      // 购物链接CSS
      const cssObj = {
        default: '',
        justText: '.MCNLinkCard-imageContainer,.MCNLinkCard-button,.MCNLinkCard-source'
          + ',.ecommerce-ad-commodity-img,.ecommerce-ad-commodity-box-icon'
          + '{display: none!important;}'
          + '.MCNLinkCard,.MCNLinkCard-card,.ecommerce-ad-commodity'
          + '{min-height: 0!important;background: transparent!important;width:100%!important;max-width:100%!important;}'
          + '.MCNLinkCard-cardContainer,.ecommerce-ad-commodity,.ecommerce-ad-commodity-main{padding: 0!important;}'
          + '.MCNLinkCard,.MCNLinkCard-info{margin: 0!important;}'
          + '.MCNLinkCard-info,.ecommerce-ad-commodity-main{flex-direction: row!important;}'
          + '.MCNLinkCard-price{padding-left: 12px;}'
          + '.ecommerce-ad-commodity-box .ecommerce-ad-commodity{height: auto!important;}'
          + '.ecommerce-ad-commodity-box-main-second{width: auto!important;}'
          + '.MCNLinkCard-titleContainer,.ecommerce-ad-commodity-main-content-des span'
          + '{color: #fd8d55!important;justify-content: start!important;}'
          + '.MCNLinkCard-titleContainer::before,.ecommerce-ad-commodity-main-content-des span::before{content: "购物链接："}'
          + '.MCNLinkCard-title{color: #fd8d55!important;}',
        hidden: 'a.MCNLinkCard,.RichText-ADLinkCardContainer,.ecommerce-ad-commodity-box,.ecommerce-ad-box{display: none!important;}'
      }
      return cssObj[pfConfig.shoppingLink || 'default']
    },
    vAnswerVideo: function () {
      // 回答内视频缩放CSS
      const cssObj = {
        default: '',
        justText: `.ZVideoLinkCard-playerContainer, .VideoContributionAnswer-video,.css-ujtn9j`
          + `,.ZVideoLinkCard-info,.RichText-video .VideoCard{display: none;}`
          + `.ZVideoLinkCard::before,.VideoContributionAnswer-container::before,.RichText-video::before`
          + `{content: '视频链接';color: #f77a2d;}`
          + `.ZVideoLinkCard,.VideoContributionAnswer-container{cursor:pointer;padding: 4px 0}`
          + `.ZVideoLinkCard:hover,.VideoContributionAnswer-container:hover{background: #eee}`,
        hidden: '.RichText-ZVideoLinkCardContainer,.VideoContributionAnswer-container,.RichText-video{display: none;}'
      }
      return cssObj[pfConfig.answerVideoLink || 'default']
    },
    vHidden: function () {
      // 隐藏的模块
      return (pfConfig.hiddenLogo
        ? `.ZhihuLogoLink,.TopTabNavBar-logo-3d0k,[aria-label="知乎"]`
        + ',.TopNavBar-logoContainer-vDhU2,.zu-top-link-logo'
        + `{display: none!important;}`
        : '')
        + (pfConfig.hiddenHeader
          ? `.AppHeader,.ColumnPageHeader-Wrapper{display: none!important;}.PubIndex-CategoriesHeader{top: 0!important;}`
          : '')
        + (pfConfig.hiddenHeaderScroll ? `.AppHeader.is-fixed{display:none!important;}` : '')
        + (pfConfig.hiddenItemActions
          ? `.Topstory-container .ContentItem-actions>span,.Topstory-container .ContentItem-actions>button`
          + `,.Topstory-container .ContentItem-actions>div,.Topstory-container .ContentItem-actions>a`
          + `,.TopstoryQuestionAskItem-writeAnswerButton,.TopstoryQuestionAskItem-hint`
          + `{visibility:hidden!important;height:0!important;padding:0!important;}`
          + `.TopstoryQuestionAskItem-hint{margin: 0!important;}`
          + `.ContentItem-actions{padding-top: 0 !important;}`
          : '')
        + (pfConfig.hiddenAnswerText
          ? `.ContentItem-actions{padding: 0 20px!important;line-height: 38px!important;}`
          + `.ContentItem-action,.ContentItem-action button,.ContentItem-actions button`
          + `{font-size: 0!important;padding: 0!important;background: none!important;line-height:inherit!important;}`
          + `.ContentItem-action span,.ContentItem-actions button span{font-size: 16px!important;}`
          + `.ContentItem-action svg,.ContentItem-actions svg{width: 16px!important;height:16px!important;}`
          + `.VoteButton{color: #8590a6!important; }`
          + `.VoteButton.is-active{color: #0066ff!important;}`
          + `.ContentItem-action{margin-left:8px!important;}`
          : '')
        + (pfConfig.hiddenQuestionTag ? '.QuestionHeader-tags{display: none!important;}' : '')
        + (pfConfig.hiddenQuestionShare ? '.zhihu .Popover.ShareMenu{display: none!important;}' : '')
        + (pfConfig.hiddenQuestionActions ? '.QuestionButtonGroup,.QuestionHeaderActions{display: none!important;}' : '')
        + (pfConfig.hiddenReward ? '.Reward{display: none!important;}' : '')
        + (pfConfig.hiddenZhuanlanTag ? '.Post-topicsAndReviewer{display: none!important;}' : '')
        + (pfConfig.hiddenListImg
          ? `.RichContent-cover,.HotItem-img{display:none!important;}`
          + `.HotItem-metrics--bottom{position: initial!important;}`
          : '')
        + (pfConfig.hiddenReadMoreText ? '.ContentItem-more{font-size:0!important;}' : '')
        + (pfConfig.hiddenAD ? '.TopstoryItem--advertCard,.Pc-card,.Pc-word{display: none!important;}' : '')
        + (pfConfig.hiddenAnswerRights
          ? `.ContentItem-actions .ShareMenu ~ button.ContentItem-action{display: none;}`
          + `.ContentItem-rightButton{display:block!important;}`
          : '')
        + (pfConfig.hiddenAnswerRightsText
          ? `.ContentItem-actions .ShareMenu ~ .ContentItem-action{font-size: 0!important;}`
          + `.ContentItem-actions .ShareMenu ~ .ContentItem-action>span{font-size:12px!important;}`
          : '')
        + (pfConfig.hiddenAnswers
          ? `.Topstory-container .RichContent.is-collapsed .RichContent-inner,.HotItem-excerpt--multiLine`
          + `,.TopstoryQuestionAskItem .RichContent .RichContent-inner,.HotItem-content .HotItem-excerpt`
          + `{display: none;}`
          : '')
        + (pfConfig.hiddenHotListWrapper ? '.HotListNav-wrapper{display: none;}' : '')
        + (pfConfig.hiddenZhuanlanActions ? '.RichContent-actions.is-fixed>.ContentItem-actions{display: none;}' : '')
        + (pfConfig.hiddenZhuanlanTitleImage ? '.TitleImage{display: none;!important}' : '')
        + (pfConfig.hiddenFixedActions
          ? `.ContentItem .RichContent-actions.is-fixed, .List-item .RichContent-actions.is-fixed`
          + `{visibility: hidden!important;}`
          : '')
        + (pfConfig.hiddenHotItemMetrics
          ? '.HotItem-content .HotItem-metrics{display: none;}'
          : '.HotItem-content {padding-bottom: 24px;}')
        + (pfConfig.hiddenHotItemIndex ? '.HotItem-index{display: none;}.HotItem{padding: 16px!important;}' : '')
        + (pfConfig.hiddenHotItemLabel ? '.HotItem-label{display: none;}' : '')
        + (pfConfig.hiddenDetailAvatar
          ? '.AnswerItem .AuthorInfo .AuthorInfo-avatarWrapper{display: none;}'
          + '.AnswerItem .AuthorInfo .AuthorInfo-content{margin-left:0!important;}'
          : '')
        + (pfConfig.hiddenDetailBadge ? '.AnswerItem .AuthorInfo .AuthorInfo-detail{display: none;}' : '')
        + (pfConfig.hiddenDetailVoters ? '.AnswerItem .Voters button{display: none;}' : '')
        + (pfConfig.hiddenDetailName ? '.AnswerItem .AuthorInfo .AuthorInfo-head{display: none;}' : '')
        + (pfConfig.hiddenHomeTab ? '.Topstory-container .TopstoryTabs{display: none!important;}' : '')
        + (pfConfig.hiddenQuestionSide ? '.QuestionHeader-side{display: none;}.QuestionHeader-main{flex: 1!important;}' : '')
        + (pfConfig.hiddenQuestionFollowing ? '.QuestionHeader .FollowButton{display: none;}' : '')
        + (pfConfig.hiddenQuestionAnswer ? '.QuestionHeader .FollowButton ~ button{display: none;}' : '')
        + (pfConfig.hiddenQuestionInvite ? '.QuestionHeader .QuestionHeaderActions>button:first-child{display: none;}' : '')
        + (pfConfig.hiddenSearchPageTopSearch ? '.SearchSideBar .TopSearch{display: none;}' : '')
        + (pfConfig.hiddenSearchPageFooter ? '.SearchSideBar .Footer{display: none;}' : '')
        + (pfConfig.hiddenSearchPageTopSearch && pfConfig.hiddenSearchPageFooter ? '.SearchSideBar{display: none}' : '')
        + (pfConfig.hiddenSearchBoxTopSearch ? '.SearchBar-noValueMenu .AutoComplete-group:first-child{display:none;}' : '')
        + (pfConfig.hiddenZhuanlanShare ? '.zhuanlan .Post-SideActions .Popover.ShareMenu{display: none!important;}' : '')
        + (pfConfig.hiddenZhuanlanVoters ? '.zhuanlan .Post-SideActions .like{display: none!important;}' : '')
        + (pfConfig.hiddenCollegeEntranceExamination ? '.Topstory-mainColumn .css-8z7gkt{display: none!important;}' : '')
        + (pfConfig.hiddenFollowAction ? '.TopstoryItem-isFollow .FeedSource-firstline{display: none;}' : '')
        + (pfConfig.hiddenFollowChooseUser ? '.TopstoryItem-isFollow .AuthorInfo{display: none;}' : '')
        + (pfConfig.hiddenAnswerRightFooter
          ? '.Question-sideColumn{display: none!important;}.Question-main .Question-mainColumn,.ListShortcut{width: inherit;}'
          : '')
        + (pfConfig.hiddenAnswerRightFooterAnswerAuthor ? '.Question-sideColumn .Sticky .AnswerAuthor{display: none;}' : '')
        + (pfConfig.hiddenAnswerRightFooterFavorites ? '.Question-sideColumn .Sticky .AnswerAuthor + .Card{display: none;}' : '')
        + (pfConfig.hiddenAnswerRightFooterRelatedQuestions ? '.Question-sideColumn .Sticky [data-za-detail-view-path-module="RelatedQuestions"]{display: none;}' : '')
        + (pfConfig.hiddenAnswerRightFooterContentList ? '.Question-sideColumn .Sticky [data-za-detail-view-path-module="ContentList"]{display: none;}' : '')
        + (pfConfig.hiddenAnswerRightFooterFooter ? '.Question-sideColumn .Sticky .Footer{display: none;}' : '')
        + (pfConfig.hidden618HongBao ?
          '.MCNLinkCard[data-mcn-source="淘宝"],.MCNLinkCard[data-mcn-source="京东"],.MCNLinkCard[data-mcn-source="知乎"]{display:none;}'
          : '')
        + (pfConfig.hiddenZhuanlanFollowButton ? '.zhuanlan .FollowButton{display: none;}' : '')
        + (pfConfig.hiddenZhuanlanAvatarWrapper ? '.zhuanlan .AuthorInfo-avatarWrapper{display: none;}' : '')
        + (pfConfig.hiddenZhuanlanAuthorInfoHead ? '.zhuanlan .AuthorInfo-head{display: none;}' : '')
        + (pfConfig.hiddenZhuanlanAuthorInfoDetail ? '.zhuanlan .AuthorInfo-detail{display: none;}' : '')
        + (pfConfig.hiddenListAnswerInPerson ? '.Topstory-mainColumn .LabelContainer{display: none;}' : '')
        + (pfConfig.hiddenQuestionSpecial ? '.QuestionHeader .LabelContainer-wrapper{display: none;}' : '')
        + (pfConfig.hiddenQuestionTopic ? '[data-za-detail-view-path-module="TopicItem"]{display: none;}' : '')
    },
  }

  const callbackGIF = (mutationsList) => {
    const e = mutationsList[0].target
    if (!(/\bisPlaying\b/.test(e.className) && pfConfig.previewOpenGIF)) return
    e.querySelector('video')
      ? myPreview.open(e.querySelector('video').src, e, true)
      : myPreview.open(e.querySelector('img').src, e)
  }
  const observerGIF = new MutationObserver(callbackGIF)
  // 加载预览图片方法，解决部分图片无法点击预览的问题
  function initPreviewImg() {
    const images = [
      domA('.TitleImage'),
      domA('.ArticleItem-image'),
      domA('.ztext figure .content_image'),
    ]
    images.forEach((events) => {
      events.forEach((e) => {
        const src = e.src || (e.style.backgroundImage && e.style.backgroundImage.split('("')[1].split('")')[0])
        e.onclick = () => myPreview.open(src)
      })
    })

    if (pfConfig.zoomAnswerImage === 'original') {
      domA('.origin_image').forEach((item) => {
        const src = $(item).attr('data-original') || $(item).src
        item.src = src
        item.style = 'max-width: 100%;'
      })
    }
  }

  function previewGIF() {
    // 因为GIF图是点击后切换到真正GIF 所以在点击切换后在打开弹窗
    // 使用MutationObserver监听元素属性变化
    if (pfConfig.showGIFinDialog) {
      const config = { attributes: true, attributeFilter: ['class'] }
      domA('.GifPlayer').forEach((event) => {
        observerGIF.observe(event, config)
      })
    } else {
      observerGIF.disconnect()
    }
  }

  // 修改页面背景的css
  const backgroundCSS = {
    init: function () {
      $('#pf-css-background') && $('#pf-css-background').remove()
      $('head').append(`<style type="text/css" id="pf-css-background">${this.chooseBG(pfConfig.colorBackground)}</style>`)
    },
    chooseBG: function (bg) {
      return pfConfig.isUseThemeDark
        ? this.dark()
        : bg !== '#ffffff' ? this.normal(bg) : ''
    },
    dark: () => {
      // 夜间模式
      const b12 = `.css-ul9l2m,.css-mq2czy,.css-1da4iq8,.css-oqge09,.css-lpo24q,.css-16zrry9,.css-u8y4hj`
        + `,.css-1yq3jl6,.css-mzh2tk,.css-6mdg56,.CreatorRecruitFooter--fix,body .Recruit-buttonFix-placeholder`
        + `,.css-ovbogu,.css-1v840mj,.css-huwkhm,.css-akuk2k,.css-ygii7h,.css-1h84h63,.css-1bwzp6r,.css-w215gm`
        + `,.css-1117lk0:hover,.zhi,.Modal-modal-wf58,.css-1j5d3ll`
        + `{background: #121212!important;}`
      const b3 = `.pf-button,.css-1vwmxb4:hover,.css-1xegbra,.css-xevy9w tbody tr:nth-of-type(odd)`
        + `,.css-1stnbni:hover,.css-5abu0r,.css-n7efg0,.css-ssvpr2,.css-m9gn5f,.FeedbackForm-inputBox-15yJ`
        + `,.FeedbackForm-canvasContainer-mrde,._Invite_container_30SP,.utils-frostedGlassEffect-2unM`
        + `,.Card-card-2K6v,.UserLivesPage-page-GSje,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448`
        + `,.PubIndex-CategoriesHeader,.AppHeader,.css-r9mkgf,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-1gnqr8i`
        + `{background:#333333!important;}`
      const bTran = `.Community-ContentLayout,._AccountSettings_accountLine_3HJS,.css-1gfpqrv,.css-13dk2dh`
        + `,.css-u6lvao,.css-u6lvao:before,.css-u6lvao:after`
        + `{background: transparent!important;}`
      const cF = `.pf-left li a,.css-1204lgo,.css-1ng3oge,.css-5abu0r,.css-p52k8h,.css-1dpmqsl,.css-1myqwel`
        + `,html[data-theme=dark] .TopNavBar-inner-baxks .TopNavBar-tab-hBAaU a,.pf-op,.pf-modal,.css-1ykn8va`
        + `,html[data-theme=dark] .TopNavBar-logoContainer-vDhU2 .TopNavBar-zhihuLogo-jzM1f,.css-11nn00q`
        + `,html[data-theme=dark] .TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7,.css-1117lk0,.css-m9gn5f`
        + `,.css-oqge09,.css-8u7moq,.css-k0fmhp,css-bc6idi,.css-nsw6sf,.css-25wprl,.css-294ohd,.css-1nmddht`
        + `,.css-1c4skpi,.zu-main-content,.zu-main-sidebar,.FeedbackForm-form-1uUg,.CopyrightSettings h1`
        + `,.CopyrightSettings h2,.CopyrightSettings,.LiveItem-title-2qes,.GlobalSidebar-introItem-24PB h3`
        + `,.Card-card-2K6v,.LiveItem-description-Tliw,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448`
        + `,.GlobalSidebar-appDownloadTip-33iw,.css-pgcb4h,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-jwse5c,.css-hd7egx`
        + `,.css-1zcaix,.css-4a3k6y,.css-eonief,.css-dy7bva,.css-sthon2,.css-teb1rp,.css-uq88u1,.css-nymych`
        + `,.css-jt1vdv,.css-tfs9zi,.ZVideo-body .UserLink,.ZVideo-body .CommentRichText`
        + `{color: #fff!important}`
      const bc12 = `.MenuBar-root-rQeFm{border-color: #121212!important;}`
      const c3 = `.pf-b-close:hover,css-1x3upj1{color: #333!important}`
      return '.pf-modal{background: #121212!important;border: 1px solid #eee}.pf-other-bg{background:initial!important}'
        + '.pf-button:hover{background: #444!important;}'
        + b12 + cF + c3 + b3 + bTran + bc12
    },
    normal: (bg) => {
      // 普通背景色
      const normalBG = `body,.Post-content,.HotList,.HotListNavEditPad,.ColumnPageHeader,.ZVideoToolbar,.pf-other-bg`
        + `,.position-suspensionSearch.focus,.Modal-modal-wf58,.Community-ContentLayout,.App-root-8rX7N`
        + `,.MenuBar-root-rQeFm,.TopNavBar-fixMode-4nQmh,.App-active-dPFhH,.CategorySection-categoryList-mrt3Z`
        + `,.zhuanlan .Post-content .ContentItem-actions`
        + `{background-color: ${bg}!important;}`
      const opacityBG = `.QuestionHeader,.Card,.HotItem,.GlobalSideBar-navList,.Recommendations-Main`
        + `,.CommentsV2-withPagination,.QuestionHeader-footer,.HoverCard,.ContentItem-actions`
        + `,.MoreAnswers .List-headerText,.Topbar,.CommentsV2-footer,.Select-plainButton`
        + `,.AppHeader,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreSpecialCard`
        + `,.ExploreColumnCard,.ExploreHomePage-ContentSection-moreButton a,.QuestionWaiting-types`
        + `,.AutoInviteItem-wrapper--desktop,.Popover-content,.Notifications-footer,.SettingsFAQ`
        + `,.Popover-arrow:after,.Messages-footer,.Modal-inner,.RichContent-actions,.KfeCollection-FeedBlockSetting`
        + `,.CommentListV2-header-divider,.Input-wrapper,.TopstoryItem .ZVideoToolbar,.SearchTabs,.Topic-bar`
        + `,.VotableTopicCard,textarea.FeedbackForm-inputBox-15yJ,.FeedbackForm-canvasContainer-mrde`
        + `,.css-mq2czy,.css-lpo24q,.css-16zrry9,.css-1v840mj,.css-ovbogu,.css-1h84h63,.css-u8y4hj`
        + `,.css-1bwzp6r,.css-w215gm,.InputLike,.AnswerForm-footer,.Editable-toolbar,.Chat,.css-ul9l2m`
        + `,.pf-modal,.pf-modal select,.pf-modal input,.pf-modal textarea,.pf-notification-item`
        + `,.Balance-Main .Tabs,.Community,.Report-list tr:nth-child(2n),.Report-Pagination,.Report-list,.Report-header th`
        + `,._Invite_container_30SP,.css-ssvpr2,.css-1p1lrh0,.zu-main,.utils-frostedGlassEffect-2unM`
        + `,.Card-card-2K6v,.UserLivesPage-page-GSje,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448`
        + `,.PubIndex-CategoriesHeader,.css-r9mkgf,.CornerButton,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z`
        + `,.WikiLandingHeader,.WikiLanding,.WikiLandingItemCard,.WikiLandingEntryCard,.SideNavs-navContainer-6VkAT`
        + `,.App-root-cPFwn,.TopNavs-root-rwAr7,.App-root-qzkuH,.App-actionTrigger-cCyD7,.ProductTrigger-root-amaSi`
        + `,.App-infiniteContainer-nrxGj,.ActionTrigger-content-dPn6H,.App-card-pkbhv,.css-zvnmar,.Login-options`
        + `,.SignFlowInput-errorMask,.ColumnHomeColumnCard,.KfeCollection-PcCollegeCard-root,.KfeCollection-PcCollegeCard-wrapper`
        + `{background-color:${BACKGROUND_CONFIG[bg].opacity}!important;background:${BACKGROUND_CONFIG[bg].opacity}!important;}`
      const transparentBG = `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper`
        + `{background-color: transparent!important;}`
      const bcNormal = `.MenuBar-root-rQeFm{border-color: ${bg}!important;}`
      return normalBG + opacityBG + transparentBG + bcNormal
    },
  }

  // 第一次触发也要在timeout之后
  function throttle(fn, timeout = 300) {
    let canRun = true
    return function () {
      if (!canRun) return
      canRun = false
      setTimeout(() => {
        fn.apply(this, arguments)
        canRun = true
      }, timeout)
    }
  }

  // 知乎外链直接打开(修改外链内容，去除知乎重定向)
  function initLinkChanger() {
    const esName = ['a.external', 'a.LinkCard']
    const hrefChanger = (item) => {
      const hrefFormat = item.href.replace(/^(https|http):\/\/link\.zhihu\.com\/\?target\=/, '') || ''
      let href = ''
      // 解决hrefFormat格式已经是decode后的格式
      try {
        href = decodeURIComponent(hrefFormat)
      } catch {
        href = hrefFormat
      }
      item.href = href
    }
    esName.forEach((name) => {
      domA(name).forEach(hrefChanger)
    })
    GM_log('[customize]外链重定向完毕')
  }

  const useSimple = async () => {
    let isUse = confirm('是否启用极简模式？\n该功能会覆盖当前配置，建议先将配置导出保存')
    if (!isUse) return
    const c = {
      positionAnswer: 'hidden',
      positionAnswerIndex: '1',
      positionCreation: 'hidden',
      positionCreationIndex: '2',
      positionTable: 'hidden',
      positionTableIndex: '3',
      positionFavorites: 'hidden',
      positionFavoritesIndex: '4',
      positionFooter: 'hidden',
      positionFooterIndex: '5',
      stickyLeft: false,
      stickyRight: false,
      zoomAnswerImage: '100px',
      customizeCss: '',
      usePresetStyle: true,
      hiddenAnswerRightFooter: true,
      hiddenLogo: true,
      hiddenHeader: true,
      hiddenHeaderScroll: true,
      hiddenItemActions: true,
      hiddenAnswerText: false,
      hiddenQuestionShare: true,
      hiddenQuestionTag: true,
      hiddenQuestionActions: false,
      hiddenReward: true,
      hiddenZhuanlanTag: true,
      hiddenListImg: true,
      hiddenReadMoreText: true,
      hiddenAD: true,
      hiddenAnswerRights: true,
      hiddenAnswerRightsText: false,
      hiddenAnswers: true,
      hiddenHotListWrapper: true,
      suspensionHomeTab: true,
      suspensionHomeTabFixed: true,
      suspensionHomeTabPo: 'left: 20px; top: 100px;',
      suspensionHomeTabStyle: 'transparent',
      questionTitleTag: true,
      suspensionFind: false,
      suspensionFindFixed: true,
      suspensionFindPo: 'left: 10px; top: 380px;',
      suspensionFindStyle: 'transparent',
      suspensionUser: false,
      suspensionUserFixed: true,
      suspensionUserPo: 'right: 60px; top: 100px;',
      fixedListItemMore: true,
      hiddenZhuanlanActions: true,
      hiddenZhuanlanTitleImage: true,
      suspensionSearch: true,
      suspensionSearchFixed: true,
      suspensionSearchPo: 'left: 20px; top: 300px;',
      hiddenFixedActions: true,
      suspensionPickUp: true,
      hiddenHotItemMetrics: true,
      hiddenHotItemIndex: false,
      hiddenHotItemLabel: true,
      previewOpenGIF: true,
      hiddenDetailAvatar: false, // 详情回答人头像
      hiddenDetailBadge: false, // 详情回答人简介
      hiddenDetailVoters: false, // 详情回答人下赞同数
      hiddenDetailName: false,
      hiddenHomeTab: false,
      shoppingLink: 'default',
      answerVideoLink: 'justText',
      hiddenQuestionSide: true,
      toHomeButton: true, // 页面右下停靠返回主页按钮
      toHomeButtonZhuanlan: 'zhihu', // toHomeButtonZhuanlan
      removeItemAboutArticle: false, // 文章
      removeItemAboutAnswer: false, // 问答
      removeItemAboutVideo: false, // 视频
      removeItemAboutAsk: true, // 提问
      hiddenQuestionFollowing: true, // 关注问题按钮
      hiddenQuestionAnswer: true, // 写回答按钮
      hiddenQuestionInvite: true, // 邀请回答按钮
      showGIFinDialog: true,
      hiddenZhuanlanShare: true, // 专栏文章分享按钮
      hiddenZhuanlanVoters: true, // 专栏悬浮赞同按钮
      hiddenCollegeEntranceExamination: true,
      hiddenFollowAction: true, // 关注列表关注人操作栏
      hiddenFollowChooseUser: true, // 关注列表用户信息
      hiddenAnswerRightFooterAnswerAuthor: true, // 信息栏关于作者
      hiddenAnswerRightFooterFavorites: true, // 信息栏被收藏次数
      hiddenAnswerRightFooterRelatedQuestions: true, // 信息栏相关问题
      hiddenAnswerRightFooterContentList: true, // 信息栏相关推荐
      hiddenAnswerRightFooterFooter: true, // 信息栏知乎指南
      hidden618HongBao: true,
      listItemCreatedAndModifiedTime: false, // 列表内容显示发布与最后修改时间
      answerItemCreatedAndModifiedTime: false, // 回答列表显示创建与最后修改时间
      hiddenListAnswerInPerson: true,
      hiddenQuestionTopic: true, // 详情顶部主题
      hiddenQuestionSpecial: true, // 详情顶部专题收录标签
    }
    pfConfig = {
      ...pfConfig,
      ...c,
    }
    await myStorage.set('pfConfig', JSON.stringify(pfConfig))
    onDocumentStart()
    initData()
  }

  // 注入弹窗元素和默认css
  function initHTML() {
    const htmlModal = $(INNER_HTML)
    const openButton = '<div class="pf-op"><i class="pf-open-modal iconfont">&#xe603;</i></div>'
    $('body').append(openButton)
    $('body').append(htmlModal)
    // 在首页加入左侧模块 用于调整创作中心 收藏夹等模块元素
    const leftDom = $('<div class="pf-left-container" style="display: none; flex: 1; margin-right: 10px;"><div class="Sticky"></div></div>')
    $('.Topstory-container').prepend(leftDom)
    $('.QuestionWaiting').prepend(leftDom)

    // 添加EVENT
    $('.pf-op')[0].onclick = myDialog.open
    $('.pf-b-close')[0].onclick = myDialog.hide
    $('.pf-modal-parent .pf-modal-bg')[0].onclick = myDialog.hide
    $('.pf-export-config')[0].onclick = myConfig.export
    $('.pf-import-config')[0].onclick = myConfig.import
    $('.pf-restore-config')[0].onclick = myConfig.restore
    $('.pf-customize-css-button')[0].onclick = () => myChanger($('[name="customizeCss"]')[0])
    domA('.pf-preview').forEach((even) => {
      even.onclick = function () {
        myPreview.hide(this)
      }
    })

    $('.pf-simple-button')[0].onclick = useSimple
    appendHTMLBackground()
    myFilterKeyword.init()

    try {
      $('.pf-version')[0].innerText = `version: ${GM_info.script.version}`
    } catch { }
  }

  // 添加背景色HTML
  function appendHTMLBackground() {
    const dom = (item) => {
      const d = `<label class="pf-color-choose-label">`
        + `<input class="pf-i" name="colorBackground" type="radio" value="${item}"/>`
        + `<div class="pf-color-radio-item" style="background: ${item};">`
        + `<span style="color: #111f2c">${BACKGROUND_CONFIG[item].name}</span>`
        + `</div>`
        + `</label>`
      return $(d)
    }
    const domParent = $('<block></block>')
    Object.keys(BACKGROUND_CONFIG).forEach((item) => domParent.append(dom(item)))
    $(`[name="colorsBackground"]`).empty()
    $(`[name="colorsBackground"]`)[0] && $(`[name="colorsBackground"]`).append(domParent)
  }

  // 删除回答
  let eachIndex = 0
  function storyHidden() {
    sortAnswer()
    $('.QuestionAnswer-content')[0] && pfConfig.answerItemCreatedAndModifiedTime && addTimes($('.QuestionAnswer-content'))
    const isTrue = (() => {
      let isHaveName = false
      REMOVE_ANSWER_BY_NAME.forEach((item) => {
        pfConfig[item.id] && (isHaveName = true)
      })
      return isHaveName || pfConfig.removeFromYanxuan || pfConfig.removeZhihuOfficial
        || pfConfig.answerUnfold || pfConfig.answerFoldStart || pfConfig.answerItemCreatedAndModifiedTime
    })()

    if (!isTrue) return
    const events = $('.List-item')
    let lessNum = 0 // 每次减去的列表内容数量
    // 使用此循环方式是为了新的元素添加后从后面开始循环，减少遍历数量
    for (let i = eachIndex, len = events.length; i < len; i++) {
      const that = events[i]
      if (that) {
        if (pfConfig.removeZhihuOfficial) {
          // 知乎官方账号优先级最高
          const label = $(that).find('.AuthorInfo-name .css-n99yhz').attr('aria-label')
          if (/知乎[\s]*官方帐号/.test(label)) {
            $(that).remove()
            lessNum++
            GM_log(`[customize]已删除一条知乎官方帐号的回答`)
          }
        } else {
          const dataZop = $(that).children('.AnswerItem').attr('data-zop')
          REMOVE_ANSWER_BY_NAME.forEach((item) => {
            const reg = new RegExp(`['"]authorName['":]*` + item.name)
            if (pfConfig[item.id] && reg.test(dataZop)) {
              $(that).remove()
              lessNum++
              GM_log(`[customize]已删除一条${item.name}的回答`)
            }
          })
        }

        // 删除选自盐选专栏的回答
        if (pfConfig.removeFromYanxuan) {
          const formYanxuan = $(that).find('.KfeCollection-OrdinaryLabel-content')[0] || $(that).find('.KfeCollection-IntroCard p:first-of-type')[0]
          if (formYanxuan) {
            const formYanxuanText = formYanxuan ? formYanxuan.innerText : ''
            if (/盐选专栏/.test(formYanxuanText)) {
              $(that).remove()
              lessNum++
              GM_log(`[customize]已删除一条来自盐选专栏的回答`)
            }
          }
        }

        // 自动展开所有回答
        if (pfConfig.answerUnfold) {
          const unFoldButton = $(that).find('.ContentItem-expandButton')
          if (unFoldButton && unFoldButton[0] && !$(that).hasClass('is-unfold')) {
            unFoldButton[0].click()
            $(that).addClass('is-unfold')
            lessNum++
          }
        }

        // 默认收起所有长回答
        if (pfConfig.answerFoldStart) {
          const foldButton = $(that).find('.RichContent-collapsedText')
          const unFoldButton = $(that).find('.ContentItem-expandButton')

          if (foldButton && foldButton[0] && !$(that).hasClass('is-fold') && that.offsetHeight > 939) {
            foldButton[0].click()
            $(that).addClass('is-fold')
            lessNum++
          } else if (unFoldButton && unFoldButton[0] && !$(that).hasClass('is-fold')) {
            $(that).addClass('is-fold')
            lessNum++
          }
        }

        if (pfConfig.answerItemCreatedAndModifiedTime) {
          addTimes($(that))
        }

        if (i === events.length - 1) {
          eachIndex = i - lessNum - 1
        }
      }
    }
  }

  // 调用[不感兴趣]接口
  function doFetchUninterestv2({ id, type }) {
    const data = new FormData()
    data.append('item_brief', JSON.stringify({ "source": "TS", "type": type, "id": id }))
    fetch('/api/v3/feed/topstory/uninterestv2', {
      body: data,
      method: 'POST',
      headers: new Headers({
        ...myLocalC.fetchHeaders,
        'x-xsrftoken': document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)[0],
        'x-zst-81': myLocalC.xZst81
      })
    }).then((res) => res.json())
      .then(() => {
        GM_log(`[customize]已调用过滤接口`)
      })
  }

  // 推荐列表最外层绑定事件
  function topStoryRecommendEvent() {
    const listTargetClass = ['RichContent-cover', 'RichContent-inner', 'ContentItem-more', 'ContentItem-arrowIcon']
    const canFindTargeted = (e) => {
      let finded = false
      listTargetClass.forEach((item) => {
        $(e).hasClass(item) && (finded = true)
      })
      return finded
    }
    $('.Topstory-recommend')[0] && ($('.Topstory-recommend')[0].onclick = function (event) {
      // 点击外置[不感兴趣]按钮
      if (pfConfig.listOutPutNotInterested && event.target.className === 'ContentItem-title') {
        // 使用pointer-events: none 和伪元素、子元素使用pointer-events:auto来获取点击
        let dataZop = {}
        try {
          dataZop = JSON.parse($(event.target).parents('.ContentItem').attr('data-zop'))
        } catch { }
        const { itemId = '', type = '' } = dataZop
        doFetchUninterestv2({ id: itemId, type })
        $(event.target).parents('.TopstoryItem').remove()
      }

      // 列表内容展示更多
      if (pfConfig.listItemCreatedAndModifiedTime && canFindTargeted(event.target)) {
        const conEvent = $(event.target).parents('.ContentItem')
        addTimes(conEvent, true)
      }
    })
  }

  function addTimes(event, useTimeout = false) {
    event.find('.pf-list-item-time')[0] && event.find('.pf-list-item-time').remove()
    const crTime = event.find('[itemprop="dateCreated"]')[0] ? event.find('[itemprop="dateCreated"]')[0].content : ''
    const puTime = event.find('[itemprop="datePublished"]')[0] ? event.find('[itemprop="datePublished"]')[0].content : ''
    const muTime = event.find('[itemprop="dateModified"]')[0] ? event.find('[itemprop="dateModified"]')[0].content : ''
    const created = Util.formatDate(crTime || puTime)
    const modified = Util.formatDate(muTime)
    if (!created) return
    const eventTime = `<div class="pf-list-item-time" style="line-height: 24px;padding-top: 6px;">`
      + `<div>创建时间：${created}</div><div>最后修改时间：${modified}</div>`
      + `</div>`
    if (useTimeout) {
      setTimeout(() => {
        // nextTick 渲染出页面之后再查找
        event.find('.ContentItem-meta').append(eventTime)
      }, 0)
    } else {
      event.find('.ContentItem-meta').append(eventTime)
    }
  }

  // 关键词过滤列表内容
  let filterIndex = 0
  function filterItemByKeyword() {
    let filterKeywordText = ''
    const events = $('.TopstoryItem .ContentItem')
    const removeItemTypeNameToClass = {
      'removeItemAboutAnswer': 'AnswerItem',
      'removeItemAboutArticle': 'ArticleItem',
      'removeItemAboutVideo': 'ZVideoItem',
      'removeItemAboutAsk': 'TopstoryQuestionAskItem',
    }
    const words = pfConfig.filterKeywords
    let lessNum = 0
    for (let i = filterIndex, len = events.length; i < len; i++) {
      let dataZop = {}
      try {
        dataZop = JSON.parse($(events[i]).attr('data-zop'))
      } catch { }
      const { itemId = '', title = '', type = '' } = dataZop
      const routeURL = $(events[i]).find('[itemprop="url"]') && $(events[i]).find('[itemprop="url"]').attr('content')
      let isFindTitle = false
      words.forEach((w) => {
        const rep = new RegExp(w.toLowerCase())
        if (rep.test(title.toLowerCase())) {
          isFindTitle = true
          filterKeywordText += `【${w}】`
        }
      })
      let typeKey = ''
      Object.keys(removeItemTypeNameToClass).forEach((key) => {
        $(events[i]).hasClass(removeItemTypeNameToClass[key]) && (typeKey = key)
      })
      if (isFindTitle) {
        // 过滤了之后调用“不感兴趣”接口
        GM_log(`[customize]关键词过滤，内容标题：${title}\n关键词：${filterKeywordText}\n${routeURL}`)
        doFetchUninterestv2({ id: itemId, type })
        lessNum++
        $(events[i]).parents('.TopstoryItem').remove()
        if (pfConfig.notificationAboutFilter) {
          addNotification({
            title: `过滤内容：<a href="${routeURL}" target="_blank" style="color: #06f;">${title}</a>\n关键词：${filterKeywordText}`,
            content: `已调用过滤接口`
          })
        }
        filterKeywordText = ''
      } else if (typeKey && pfConfig[typeKey]) {
        $(events[i]).parents('.TopstoryItem').remove()
        lessNum++
        GM_log('[customize]---列表种类过滤---')
      }

      if (i === len - 1) {
        filterIndex = i - lessNum - 1
      }
    }
  }

  // 添加通知提醒框
  function addNotification(obj) {
    const { title, content, duration = 3000 } = obj
    const removeNotification = (ev) => {
      ev[0] && ev.remove()
    }
    const noEv = `<div class="pf-notification-item">`
      + `<i class="iconfont pf-close-notification">&#xe61b;</i>`
      + `<div class="pf-notification-title">${title}</div>`
      + (content ? `<div class="pf-notification-content">${content}</div>` : '')
      + `</div>`
    const notification = $(noEv)
    const notificationParent = $('<div class="pf-notification"></div>')
    if (!$('.pf-notification') || !$('.pf-notification')[0]) {
      $('body').append(notificationParent)
    }
    $('.pf-notification').append(notification)
    domA('.pf-close-notification').forEach((item) => {
      item.onclick = () => removeNotification($(item).parent())
    })
    setTimeout(() => {
      removeNotification(notification)
    }, duration)
  }

  // 搜索列表过滤
  let searchEachIndex = 0
  function searchPageHidden() {
    const isTrue = (() => {
      return pfConfig.hiddenSearchPageListAD
    })()
    if (!isTrue) return
    const events = $('.SearchResult-Card')
    let lessNum = 0
    for (let i = searchEachIndex, len = events.length; i < len; i++) {
      const that = events[i]
      if (that) {
        if (pfConfig.hiddenSearchPageListAD) {
          const PcCollegeCard = $(that).find('.KfeCollection-PcCollegeCard-root')
          if (PcCollegeCard && PcCollegeCard[0]) {
            $(that).remove()
            lessNum++
            GM_log(`[customize]已过滤一条商业推广`)
          }
        }

        if (i === events.length - 1) {
          searchEachIndex = i - lessNum - 1
        }
      }
    }
  }

  // 监听问题详情里的.Select-button按钮
  let isFirstToSort = true
  let buObserver = null
  function listenSelectButton() {
    if (answerSortBy === 'vote' || answerSortBy === 'comment') {
      $('.Select-button')[0].innerHTML = $('.Select-button')[0].innerHTML.replace(/[\u4e00-\u9fa5]+(?=<svg)/, SORT_KEYS[answerSortBy])
    }

    const clickSort = (id) => {
      eachIndex = 0
      answerSortBy = ANSWER_SORT_IDS[id].key
      $('.Select-button')[0].innerHTML = $('.Select-button')[0].innerHTML.replace(/[\u4e00-\u9fa5]+(?=<svg)/, ANSWER_SORT_IDS[id].name)
      if (ANSWER_SORT_IDS[id].key === 'vote' || ANSWER_SORT_IDS[id].key === 'comment') {
        location.href = location.href.replace(/(?<=question\/\d+)[?\/][\w\W]*/, '') + '?sort=' + ANSWER_SORT_IDS[id].key
      } else if (ANSWER_SORT_IDS[id].key === 'default') {
        /\?sort=/.test(location.href) && (location.href = location.href.replace(/(?<=question\/\d+)[?\/][\w\W]*/, ''))
      }
    }

    if ($('.Select-button')[0]) {
      try {
        buObserver.disconnect()
      } catch { }
      const buConfig = { attribute: true, attributeFilter: ['aria-expanded'] }
      buObserver = new MutationObserver(() => {
        if ($('.Select-button').attr('aria-expanded') === 'true') {
          const evenSortByVote = $('<button class="Select-option" tabindex="-1" role="option" id="Select1-2">点赞数排序</button>')
          const evenSortByComment = $('<button class="Select-option" tabindex="-1" role="option" id="Select1-3">评论数排序</button>')
          $('.Answers-select').append(evenSortByVote).append(evenSortByComment)
          domA('.Select-option').forEach((ev) => {
            ev.onclick = () => clickSort(ev.id)
          })
        }
      })
      buObserver.observe($('.Select-button')[0], buConfig)
    }
  }

  /**
   * 排序列表
   * 因为知乎并没有开放点赞数和评论排序参数，所以只能每次加载后按照当前的数据进行页面排序
   * 为了防止页面错乱 只对前20条进行排序
   */
  function sortAnswer() {
    if ((answerSortBy === 'vote' || answerSortBy === 'comment') && isFirstToSort) {
      const event = $('.List>div:nth-child(2)>div')
      const listSorted = event.find('.List-item:not(.PlaceHolder)').sort((a, b) => {
        const aContent = $(a).find('.AnswerItem').attr('data-za-extra-module')
          ? JSON.parse($(a).find('.AnswerItem').attr('data-za-extra-module')).card.content
          : {}
        const bContent = $(b).find('.AnswerItem').attr('data-za-extra-module')
          ? JSON.parse($(b).find('.AnswerItem').attr('data-za-extra-module')).card.content
          : {}
        switch (answerSortBy) {
          case 'vote':
            return bContent.upvote_num - aContent.upvote_num
          case 'comment':
            return bContent.comment_num - aContent.comment_num
          default:
            return true
        }
      })
      event.find('.List-item:not(.PlaceHolder)').remove()
      event.prepend(listSorted)
      isFirstToSort = false
    }
  }

  // 关注人列表修改
  let followingIndex = 0
  const REMOVE_FOLLOWS = [
    { name: 'removeFollowVoteAnswer', rep: '赞同了回答' },
    { name: 'removeFollowVoteArticle', rep: '赞同了文章' },
    { name: 'removeFollowFQuestion', rep: '关注了问题' },
  ]
  function followingListChanger(isReFind) {
    isReFind && (followingIndex = 0)
    const events = $('.TopstoryItem-isFollow')
    const removeIsTrue = pfConfig.removeFollowVoteAnswer || pfConfig.removeFollowVoteArticle || pfConfig.removeFollowFQuestion
    if (events.length) {
      let lessNum = 0
      for (let i = followingIndex, len = events.length; i < len; i++) {
        const event = events[i]
        // 用户操作
        if (event && $(event).find('.FeedSource-firstline')[0]) {
          const userName = $(event).find('.FeedSource-firstline .UserLink-link')[0].innerText
          let dataZop = {}
          try {
            dataZop = JSON.parse($(event).find('.ContentItem').attr('data-zop'))
          } catch { }

          // 高亮原创
          if (pfConfig.highlightOriginal && dataZop.authorName === userName) {
            const highlight = `background: ${pfConfig.isUseThemeDark
              ? '#333333!important;'
              : pfConfig.colorBackground === '#ffffff' ? '#fff3d4!important;' : `${pfConfig.colorBackground}!important;`}`
            event.style = `${highlight}border: 1px solid #aaa;`
            $(event).find('.ContentItem-actions')[0].style = highlight
          }

          if (removeIsTrue) {
            REMOVE_FOLLOWS.forEach(({ name, rep }) => {
              const thisRep = new RegExp(rep)
              if (pfConfig[name] && thisRep.test($(event).find('.FeedSource-firstline')[0].innerText)) {
                $(event).remove()
                lessNum++
              }
            })
          }
        }

        if (i === events.length - 1) {
          followingIndex = i - lessNum - 1
        }
      }
    }
  }

  const COLLECTION_EVENT = `<div class="pf-export-collection-box">`
    + `<button class="pf-button pf-export-collection">生成PDF</button>`
    + `<p>仅对当前页码收藏夹内容进行导出</p>`
    + `<p>图片内容过多时请耐心等待</p>`
    + `<p>如果点击没有生成PDF请刷新页面</p>`
    + `</div>`
  const typeSpan = (type) => {
    switch (type) {
      case 'zvideo':
        return `<span class="pf-label-tag" style="color: #12c2e9;">视频</span>`
      case 'answer':
        return `<span class="pf-label-tag" style="color: #ec7259;">问答</span>`
      case 'article':
        return `<span class="pf-label-tag" style="color: #00965e;">文章</span>`
      default:
        return ``
    }
  }

  // 收藏夹生成PDF 导出
  function collectionExport() {
    const eventBox = $(COLLECTION_EVENT)
    $('.pf-export-collection-box')[0] && $('.pf-export-collection-box').remove()
    eventBox.find('.pf-export-collection')[0].onclick = function () {
      this.innerText = '加载中...'
      this.disabled = true
      const id = location.pathname.match(/(?<=\/collection\/)\d+/)[0]
      const offset = 20 * ($('.Pagination .PaginationButton--current')[0] ? Number($('.Pagination .PaginationButton--current')[0].innerText) - 1 : 0)
      fetch(`/api/v4/collections/${id}/items?offset=${offset}&limit=20`, {
        method: 'GET',
        headers: new Headers({
          ...myLocalC.fetchHeaders
        })
      }).then((response) => {
        return response.json()
      }).then((res) => {
        const collectionsHTMLMap = (res.data || []).map((item) => {
          const { type, url, question, content, title } = item.content
          switch (type) {
            case 'zvideo':
              return `<div class="pf-pdf-dialog-item">`
                + `<div class="pf-pdf-dialog-title">${typeSpan(type)}${title}</div>`
                + `<div>视频链接：<a href="${url}" target="_blank">${url}</a></div>`
                + `</div>`
            case 'answer':
            case 'article':
            default:
              return `<div class="pf-pdf-dialog-item">`
                + `<div class="pf-pdf-dialog-title">${typeSpan(type)}${title || question.title}</div>`
                + `<div>内容链接：<a href="${url}" target="_blank">${url}</a></div>`
                + `<div>${content}</div>`
                + `</div>`
          }
        })

        const iframe = $('.pf-pdf-box-content')[0]
        const collectionsHTML = collectionsHTMLMap.join('')
        const doc = iframe.contentWindow.document
        doc.body.innerHTML = ''
        if (!doc.head.querySelector('style')) {
          doc.write(`<style type="text/css" id="pf-css-own">${INNER_CSS}</style>`)
        }
        doc.write(`<div class="pf-pdf-view">${collectionsHTML}</div>`)

        // 检测图片是否都加载完全 解决打印不全的情况
        const imgLoadPromises = []
        doc.querySelectorAll('img').forEach((item) => {
          imgLoadPromises.push(new Promise((resolve, reject) => {
            item.onload = function () {
              resolve(true)
            }
          }))
        })

        Promise.all(imgLoadPromises).then(() => {
          // 图片加载完成后调用打印方法
          this.innerText = '生成PDF'
          this.disabled = false
          iframe.contentWindow.print()
        })
      })
    }
    $('.CollectionDetailPageHeader-title').append(eventBox)
  }

  // 监听问答右栏 修改宽度
  function listenQuestionSideColumn() {
    if ($('.Question-sideColumn')[0]) {
      $('.Question-sideColumn')[0].style.display = 'block'
      if ($('.Question-sideColumn')[0].offsetHeight < 50) {
        $('.Question-sideColumn')[0].style.display = 'none'
      }
    }
  }

  // 在启动时注入的内容
  async function startInit() {
    if (!$) return
    $('head').append(`<style type="text/css" id="pf-css-own">${INNER_CSS}</style>`)
    if (HTML_HOOTS.includes(location.hostname)) {
      timeStart = performance.now()
      myLocalC.cachePfConfig = pfConfig
      const config = await myStorage.get('pfConfig')
      const c = config ? JSON.parse(config) : {}
      pfConfig = { ...pfConfig, ...c }
      // 首页重定向
      if ((pfConfig.indexPathnameRedirect && pfConfig.indexPathnameRedirect !== 'n')
        && location.host === 'www.zhihu.com' && location.pathname === '/') {
        location.href = `https://www.zhihu.com/${pfConfig.indexPathnameRedirect}`
      }

      onDocumentStart()

      if (location.host === 'zhuanlan.zhihu.com') {
        $('html').addClass('zhuanlan')
      } else if (location.host === 'www.zhihu.com') {
        $('html').addClass('zhihu')
      }

      // 拦截fetch方法 获取option中的值
      const originFetch = fetch
      unsafeWindow.fetch = (url, opt) => {
        if (/\/answers\?/.test(url) && (answerSortBy === 'vote' || answerSortBy === 'comment') && isFirstToSort) {
          // 如果是自定义排序则知乎回答页码增加到20条
          url = url.replace(/(?<=limit=)\d+(?=&)/, '20')
        }
        if (!myLocalC.fetchHeaders['x-ab-param'] && opt && opt.headers) {
          myLocalC.fetchHeaders = opt.headers
        }

        if (opt && opt.headers && opt.headers['x-zst-81']) {
          // 存储x-zst-81供不感兴趣接口使用
          myLocalC.xZst81 = opt.headers['x-zst-81']
        }
        return originFetch(url, opt)
      }

      if (/\/question/.test(location.pathname) && location.search.match(/(?<=sort=)\w+/)) {
        answerSortBy = location.search.match(/(?<=sort=)\w+/)[0]
      }
    }
  }
  startInit()

  function findTheme() {
    // 开始进入先修改一次
    doUseThemeDark(pfConfig.isUseThemeDark)
    const eventHTML = $('html')
    const muConfig = { attribute: true, attributeFilter: ['data-theme'] }
    const muCallback = function () {
      if (
        (eventHTML.attr('data-theme') === 'dark' && !pfConfig.isUseThemeDark)
        || (eventHTML.attr('data-theme') === 'light' && pfConfig.isUseThemeDark)
      ) {
        doUseThemeDark(pfConfig.isUseThemeDark)
      }
    }
    const muObserver = new MutationObserver(muCallback)
    muObserver.observe(eventHTML[0], muConfig)
  }

  function addQuestionCreatedAndModifiedTime() {
    $('.pf-question-time')[0] && $('.pf-question-time').remove()
    if (!(pfConfig.questionCreatedAndModifiedTime && $('[itemprop="dateCreated"]')[0])) return
    const created = Util.formatDate($('[itemprop="dateCreated"]')[0].content)
    const modified = Util.formatDate($('[itemprop="dateModified"]')[0].content)
    const eventTime = `<div class="pf-question-time"><div>创建时间：${created}</div><div>最后修改时间：${modified}</div></div>`
    $('.QuestionPage .QuestionHeader-title').append(eventTime)
  }

  // 文章发布时间置顶
  function addArticleCreateTimeToTop() {
    $('.pf-article-create-time')[0] && $('.pf-article-create-time').remove()
    if (!(pfConfig.articleCreateTimeToTop && $('.ContentItem-time')[0])) return
    const createTime = $('.ContentItem-time')[0].innerText || ''
    $('.Post-Header').append(`<span class="pf-article-create-time" style="color: #8590a6;line-height: 30px;">${createTime}</span>`)
  }

  function onDocumentStart() {
    if (HTML_HOOTS.includes(location.hostname)) {
      versionCSS.init()
      backgroundCSS.init()
      changeCustomCSS()
      findTheme()
    }
  }

  // 在页面加载完成时注入的内容
  window.onload = () => {
    !$('#pf-css-own')[0] && startInit()

    if (HTML_HOOTS.includes(location.hostname)) {
      initHTML()
      initData()
      initLinkChanger()
      resizeObserver.observe($('body')[0])

      // 如果存在登录弹窗则移除
      if ($('.signFlowModal')[0]) {
        $('.signFlowModal').find('.Modal-closeButton')[0].click()
      }
      findFilterPageSetting()
    }

    pathnameHasFn({
      'question': () => {
        listenSelectButton()
        listenQuestionSideColumn()
        addQuestionCreatedAndModifiedTime()
      },
      'video': () => videoFns.init(),
      'collection': collectionExport,
    })

    if (location.host === 'zhuanlan.zhihu.com') {
      addArticleCreateTimeToTop()
    }
  }

  /**
  * 判断pathname匹配的香并运行对应方法
  * @param {[name: String]: Function} obj
  **/
  function pathnameHasFn(obj) {
    Object.keys(obj).forEach((name) => {
      const rep = new RegExp(`/${name}`)
      if (rep.test(location.pathname)) {
        obj[name]()
      }
    })
  }

  // 调用resize方法 触发页面变动
  function doResizePage() {
    const myEvent = new Event('resize')
    window.dispatchEvent(myEvent)
  }

  const _historyWrap = function (type) {
    const orig = history[type]
    const e = new Event(type)
    return function () {
      const rv = orig.apply(this, arguments)
      e.arguments = arguments
      window.dispatchEvent(e)
      return rv
    }
  }
  history.pushState = _historyWrap('pushState')
  history.replaceState = _historyWrap('replaceState')

  // history 变化
  window.addEventListener('popstate', function () {
    filterIndex = 0
    eachIndex = 0
    followingIndex = 0
  })

  window.addEventListener('pushState', function (e) {
    findFilterPageSetting()
    filterIndex = 0
    eachIndex = 0
    followingIndex = 0
  })

  let filterTimeout = null
  function findFilterPageSetting() {
    if (/\/settings\/filter/.test(location.pathname)) {
      filterTimeout && clearTimeout(filterTimeout)
      filterTimeout = setTimeout(() => {
        clearTimeout(filterTimeout)
        filterPageSetting()
        findFilterPageSetting()
      }, 500)
    } else {
      filterTimeout && clearTimeout(filterTimeout)
    }
  }

  // 屏蔽页面设置
  function filterPageSetting() {
    const removeFilterButton = $('<button class="pf-button" style="margin-left: 12px;">移除当前页所有屏蔽话题</button>')
    removeFilterButton[0].onclick = () => {
      domA('.Tag-remove').forEach(item => item.click())
    }
    domA('.css-j2uawy').forEach((item) => {
      if (/已屏蔽话题/.test(item.innerText) && !$(item).find('.pf-button')[0]) {
        $(item).append(removeFilterButton)
      }
    })
  }

  // 使用ResizeObserver监听body高度
  const resizeObserver = new ResizeObserver(throttle(resizeFun, 500))
  function resizeFun() {
    if (HTML_HOOTS.includes(location.hostname)) {
      // 页面高度发生改变
      if (myLocalC.bodySize === myLocalC.bodySizePrev) {
        // 重新赋值img预览
        initPreviewImg()
        previewGIF()
        // 外链直接打开
        initLinkChanger()
        // 关键词过滤列表内容
        filterItemByKeyword()
        // 关注人列表修改
        followingListChanger()
        topStoryRecommendEvent()
        pathnameHasFn({
          'question': () => {
            zoomVideos()
            storyHidden()
            listenSelectButton()
            listenQuestionSideColumn()
          },
          'search': searchPageHidden,
          'collection': collectionExport
        })
      } else {
        myLocalC.bodySizePrev = myLocalC.bodySize
      }

      // body高度变更后比较推荐模块内容高度与网页高度
      // 如果模块高度小于网页高度则手动触发resize使其加载数据
      const recommendHeightLess = $('.Topstory-recommend')[0] && $('.Topstory-recommend')[0].offsetHeight < window.innerHeight
      const contentHeightLess = $('.Topstory-content')[0] && $('.Topstory-content')[0].offsetHeight < window.innerHeight
      if (recommendHeightLess || contentHeightLess) {
        doResizePage()
      }

      // 判断body变化后的页面title是否变化
      // 原逻辑是在body变化后会请求查看是否有新的消息后再更改title
      pfConfig.title !== document.title && changeTitle()

      if (pfConfig.hiddenSearchBoxTopSearch && $('.SearchBar-input input')[0]) {
        $('.SearchBar-input input')[0].placeholder = ''
      }
    }

    pathnameHasFn({
      'video': () => videoFns.init(),
    })
  }

  window.onscroll = throttle(() => {
    stickyB.scroll()
    if (pfConfig.suspensionPickUp) {
      SuspensionPackUp($('.List-item'))
      SuspensionPackUp($('.TopstoryItem'))
      SuspensionPackUp($('.AnswerCard'))
    }
  }, 100)

  // 漂浮收起按钮的方法
  function SuspensionPackUp(eventList, right = 60) {
    for (let i = 0; i < eventList.length; i++) {
      const even = eventList[i]
      const evenPrev = i > 0 ? eventList[i - 1] : null
      const evenBottom = even.offsetTop + even.offsetHeight
      const evenPrevBottom = evenPrev ? evenPrev.offsetTop + evenPrev.offsetHeight : 0
      const hST = $('html')[0].scrollTop
      // 收起按钮
      const evenButton = even.querySelector('.ContentItem-actions .ContentItem-rightButton')
      if (evenButton) {
        if (evenBottom > hST + window.innerHeight && evenPrevBottom < hST) {
          evenButton.style = `visibility:visible!important;position: fixed!important;bottom: 60px;`
            + `left: ${even.offsetLeft + even.offsetWidth - right}px;`
            + `box-shadow: 0 1px 3px rgb(18 18 18 / 10%);`
            + `height: 40px!important;line-height:40px;padding: 0 12px!important;`
            + `background: ${pfConfig.isUseThemeDark
              ? 'transparent'
              : BACKGROUND_CONFIG[pfConfig.colorBackground].opacity
                ? BACKGROUND_CONFIG[pfConfig.colorBackground].opacity
                : pfConfig.colorBackground}`
        } else {
          evenButton.style = ''
        }
      }
    }
  }

  // 在弹窗滚动中加入a标签锚点配置
  function initScrollModal() {
    const hrefArr = []
    const e = $('.pf-right')[0]
    const eHeight = e.offsetHeight
    domA('.pf-left a').forEach((i) => {
      const id = i.href.replace(/.*#/, '')
      hrefArr.push({
        id,
        offsetTop: $(`#${id}`)[0].offsetTop
      })
    })
    const scrollM = () => {
      const scHere = eHeight / 2 + e.scrollTop
      const id = hrefArr.find((item, index) => item.offsetTop <= scHere && ((hrefArr[index + 1] && hrefArr[index + 1].offsetTop > scHere) || !hrefArr[index + 1])).id
      domA('.pf-left a').forEach((i) => {
        // 使用判断减少赋值次数 优化性能
        const itemId = i.href.replace(/.*#/, '')
        if (!i.style.color && itemId === id) {
          i.style.color = '#0066ff'
          $(i).parent()[0].style = `border-color: #0066ff`
        } else if (i.style.color && itemId !== id) {
          i.style.color = ''
          $(i).parent()[0].style = ``
        }
      })
    }
    e.onscroll = throttle(() => scrollM(), 100)
    scrollM()
  }

})()
