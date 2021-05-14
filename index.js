// ==UserScript==
// @name         知乎修改器✈持续更新✈努力实现功能最全的知乎配置插件
// @namespace    http://tampermonkey.net/
// @version      2.1.10
// @description  一键极简模式，去除不必要的元素，给你最简单的知乎（可自动配置，随时还原）|列表种类和关键词强过滤内容（目前只针对标题进行过滤），关键词过滤后自动调用“不感兴趣”的接口，防止在其他设备上出现同样内容|可设置自动收起所有长回答或自动展开所有回答|未登录状态下问答和专栏移除登录弹窗|设置过滤烦人的故事档案局和盐选科普回答，并可一键过滤所有知乎官方账号回答|首页切换模块，发现切换模块、个人中心、搜素栏可悬浮并自定义位置|支持版心修改，页面模块位置调整、隐藏，页面表头和图标修改|页面背景色修改可调整|夜间模式开关|隐藏知乎热搜模块，体验纯净搜索|列表的问题，文章和视频添加区分标签|去除广告，可设置购买链接只显示文字还是隐藏，外链直接打开|更多功能请在插件里体验...
// @author       super pufferfish
// @match         *://www.zhihu.com/*
// @match         *://zhuanlan.zhihu.com/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_log
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// ==/UserScript==

(function () {
  'use strict'
  const INNER_HTML =
    `<div style="display: none;"class="pf-mark"><div class="pf-modal-parent"><div class="pf-modal-bg"></div><div class="pf-modal"><div class="pf-modal-header"><span class="pf-modal-header-title">知乎编辑器<span class="pf-version"></span></span><i class="iconfont pf-b-close">&#xe61b;</i></div><div class="pf-modal-content"><ul class="pf-left"><li><a href="#pf-set-basis">基础设置</a></li><li><a href="#pf-set-home">首页设置</a></li><li><a href="#pf-set-remove-answer">过滤回答</a></li><li><a href="#pf-set-answer">回答设置</a></li><li><a href="#pf-set-hidden">隐藏模块</a></li><li><a href="#pf-set-color">颜色设置</a></li><li><a href="#pf-set-config">配置导出导入</a></li></ul><div class="pf-right"><div id="pf-set-basis"><h3>基础设置</h3><button class="pf-simple-button pf-button">启用极简模式</button><button class="pf-restore-config pf-button">恢复默认配置</button><div class="pf-radio-div"><span class="pf-label">版心大小</span><select name="versionHeart"class="pf-input w-200"><option value="800">800px</option><option value="1000">1000px</option><option value="1200">1200px</option><option value="1500">1500px</option><option value="100%">拉满</option></select></div><div class="pf-raido-divoom-answer-image"><span class="pf-label">回答和专栏图片缩放</span><div class="pf-content"><label><input class="pf-input"name="zoomAnswerImage"type="radio"value="100px"/>极小(100px)</label><label><input class="pf-input"name="zoomAnswerImage"type="radio"value="200px"/>小(200px)</label><label><input class="pf-input"name="zoomAnswerImage"type="radio"value="400px"/>中(400px)</label><br><label><input class="pf-input"name="zoomAnswerImage"type="radio"value="default"/>默认</label><label><input class="pf-input"name="zoomAnswerImage"type="radio"value="hidden"/>隐藏</label><label><input class="pf-input"name="zoomAnswerImage"type="radio"value="original"/>原图</label></div></div><div class="pf-hidden-labels"><label><span class="pf-label">动图弹窗显示</span><input class="pf-input"name="showGIFinDialog"type="checkbox"value="on"/></label></div><div class="pf-hidden-labels"><label><span class="pf-label">回答操作文字缩放</span><input class="pf-input"name="zoomAnswerText"type="checkbox"value="on"/></label></div><div class="pf-radio-div"><span class="pf-label">更改网页标题图片</span><br/><label class="pf-radio-img-select"><input class="pf-input"name="titleIco"type="radio"value="github"/><img src="https://github.githubassets.com/favicons/favicon.svg"alt="github"class="pf-radio-img"></label><label class="pf-radio-img-select"><input class="pf-input"name="titleIco"type="radio"value="csdn"/><img src="https://g.csdnimg.cn/static/logo/favicon32.ico"alt="csdn"class="pf-radio-img"></label><label class="pf-radio-img-select"><input class="pf-input"name="titleIco"type="radio"value="juejin"/><img src="https://b-gold-cdn.xitu.io/favicons/v2/favicon.ico"alt="juejin"class="pf-radio-img"></label><label class="pf-radio-img-select"><input class="pf-input"name="titleIco"type="radio"value="zhihu"/><img src="https://static.zhihu.com/heifetz/favicon.ico"alt="zhihu"class="pf-radio-img"></label></div><div class="pf-radio-div"><span class="pf-label">更改网页标题</span><input class="pf-input h-25 w-300"name="title"type="text"/></div><div class="pf-other-bg"><div class="pf-label fw-bold border-none">悬浮模块</div><div class="pf-commit border-none">拖动悬浮模块定位位置</div><div class="pf-commit border-none">鼠标放置显示解锁按钮解锁即可拖动<i class="iconfont">&#xe688;</i></div><div class="pf-checkbox-div border-none"><label><span class="pf-label">问题列表切换</span><input class="pf-input"name="suspensionHomeTab"type="checkbox"value="on"/></label><select name="suspensionHomeTabStyle"class="pf-input pf-suspensionHomeTab"style="display: none;"><option value="transparent">透明</option><option value="filling">填充</option></select><label>是否隐藏<input class="pf-input"name="hiddenHomeTab"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div border-none"><label><span class="pf-label">顶部发现模块</span><input class="pf-input"name="suspensionFind"type="checkbox"value="on"/></label><select name="suspensionFindStyle"class="pf-input pf-suspensionFind"style="display: none;"><option value="transparent">透明</option><option value="filling">填充</option></select></div><div class="pf-checkbox-div border-none"><label><span class="pf-label">个人中心</span><input class="pf-input"name="suspensionUser"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div border-none"><label><span class="pf-label">搜索栏</span><input class="pf-input"name="suspensionSearch"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">长回答和列表收起按钮</span><input class="pf-input"name="suspensionPickUp"type="checkbox"value="on"/></label><div class="pf-commit border-none">建议在隐藏底部悬浮操作条时使用</div></div></div><div class="pf-raido-divoom-answer-image"><label><span class="pf-label">页面右下停靠返回主页按钮</span><input class="pf-input"name="toHomeButton"type="checkbox"value="on"/></label><div class="p-t-8"><span class="pf-label">专栏返回主页</span><label><input class="pf-input"name="toHomeButtonZhuanlan"type="radio"value="zhihu"/>知乎首页</label><label><input class="pf-input"name="toHomeButtonZhuanlan"type="radio"value="zhuanlan"/>专栏首页</label></div></div></div><div id="pf-set-home"><h3>首页设置</h3><div class="pf-label fw-bold border-none">模块位置</div><div class="pf-radio-div border-none"><span class="pf-label">回答问题</span><label><input class="pf-input"name="positionAnswer"type="radio"value="left"/>左侧</label><label><input class="pf-input"name="positionAnswer"type="radio"value="right"/>右侧</label><label><input class="pf-input"name="positionAnswer"type="radio"value="hidden"/>隐藏</label><select name="positionAnswerIndex"class="pf-input"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-radio-div border-none"><span class="pf-label">创作中心</span><label><input class="pf-input"name="positionCreation"type="radio"value="left"/>左侧</label><label><input class="pf-input"name="positionCreation"type="radio"value="right"/>右侧</label><label><input class="pf-input"name="positionCreation"type="radio"value="hidden"/>隐藏</label><select name="positionCreationIndex"class="pf-input"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-radio-div border-none"><span class="pf-label">圆桌</span><label><input class="pf-input"name="positionTable"type="radio"value="left"/>左侧</label><label><input class="pf-input"name="positionTable"type="radio"value="right"/>右侧</label><label><input class="pf-input"name="positionTable"type="radio"value="hidden"/>隐藏</label><select name="positionTableIndex"class="pf-input"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-radio-div border-none"><span class="pf-label">收藏夹</span><label><input class="pf-input"name="positionFavorites"type="radio"value="left"/>左侧</label><label><input class="pf-input"name="positionFavorites"type="radio"value="right"/>右侧</label><label><input class="pf-input"name="positionFavorites"type="radio"value="hidden"/>隐藏</label><select name="positionFavoritesIndex"class="pf-input"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-radio-div"><span class="pf-label">指南</span><label><input class="pf-input"name="positionFooter"type="radio"value="left"/>左侧</label><label><input class="pf-input"name="positionFooter"type="radio"value="right"/>右侧</label><label><input class="pf-input"name="positionFooter"type="radio"value="hidden"/>隐藏</label><select name="positionFooterIndex"class="pf-input"><option value="1">优先级1</option><option value="2">优先级2</option><option value="3">优先级3</option><option value="4">优先级4</option><option value="5">优先级5</option></select></div><div class="pf-checkbox-div"><label><span class="pf-label">左侧栏固定</span><input class="pf-input"name="stickyLeft"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">右侧栏固定</span><input class="pf-input"name="stickyRight"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">列表更多按钮固定至题目右侧</span><input class="pf-input"name="fixedListItemMore"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">内容标题添加类别标签<span class="pf-label-tag pf-label-tag-Article">文章</span><span class="pf-label-tag pf-label-tag-Answer">问答</span><span class="pf-label-tag pf-label-tag-ZVideo">视频</span></span><input class="pf-input"name="questionTitleTag"type="checkbox"value="on"/></label></div></div><div id="pf-set-remove-answer"class="pf-other-bg"><h3>过滤回答<span class="pf-commit pf-title-commit">此部分更改后请重新刷新页面</span></h3><div class="pf-hidden-labels"><label><input class="pf-input"name="removeZhihuOfficial"type="checkbox"value="on"/>知乎官方账号</label><div class="pf-commit">此选项会过滤所有官方账号回答，请酌情选择</div></div><div class="pf-hidden-labels"><label><input class="pf-input"name="removeStoryAnswer"type="checkbox"value="on"/>故事档案局</label><label><input class="pf-input"name="removeYanxuanAnswer"type="checkbox"value="on"/>盐选科普</label><label><input class="pf-input"name="removeYanxuanRecommend"type="checkbox"value="on"/>盐选推荐</label><label><input class="pf-input"name="removeFromYanxuan"type="checkbox"value="on"/>选自盐选专栏的回答</label></div><div class="pf-hidden-labels"><span class="pf-label">过滤列表类别</span><div class="pf-commit">建议保留问答，否则页面会一直加载到只剩未选择的内容</div><label><input class="pf-input"name="removeItemAboutAnswer"type="checkbox"value="on"/>问答</label><label><input class="pf-input"name="removeItemAboutArticle"type="checkbox"value="on"/>文章</label><label><input class="pf-input"name="removeItemAboutVideo"type="checkbox"value="on"/>视频</label></div><div class="pf-hidden-labels"><label><div class="pf-label">屏蔽关键词，[推荐页]将屏蔽包含关键词的内容</div><input name="filterKeyword"type="text"class="h-25 w-300"placeholder="输入后回车或失去焦点即可"/></label><div class="pf-filter-keywords"></div></div></div><div id="pf-set-answer"><h3>回答设置</h3><div class="pf-checkbox-div"><label><span class="pf-label">自动展开所有回答</span><input class="pf-input"name="answerUnfold"type="checkbox"value="on"/></label></div><div class="pf-checkbox-div"><label><span class="pf-label">默认收起所有长回答</span><input class="pf-input"name="answerFoldStart"type="checkbox"value="on"/></label></div></div><div id="pf-set-hidden"><h3>隐藏模块<span class="pf-commit pf-title-commit">勾选则隐藏相应模块</span></h3><div class="pf-hidden-labels pf-other-bg"><span class="pf-label">购物链接显示设置</span><label><input class="pf-input"name="shoppingLink"type="radio"value="default"/>默认</label><label><input class="pf-input"name="shoppingLink"type="radio"value="justText"/>仅文字</label><label><input class="pf-input"name="shoppingLink"type="radio"value="hidden"/>隐藏</label></div><div class="pf-hidden-labels"><label><input class="pf-input"name="hiddenAD"type="checkbox"value="on"/>广告</label></div><div class="pf-hidden-labels"><label><input class="pf-input"name="hiddenLogo"type="checkbox"value="on"/>logo</label><label><input class="pf-input"name="hiddenHeader"type="checkbox"value="on"/>顶部悬浮模块</label><br/><label><input class="pf-input"name="hiddenHeaderScroll"type="checkbox"value="on"/>滚动顶部悬浮模块（问题名称）</label><br/><label><input class="pf-input"name="hiddenAnswerRightFooter"type="checkbox"value="on"/>详情右侧信息栏</label></div><div class="pf-hidden-labels"><label><input class="pf-input"name="hiddenHotListWrapper"type="checkbox"value="on"/>热榜榜单TAG</label><label><input class="pf-input"name="hiddenHotItemIndex"type="checkbox"value="on"/>热门排序编号</label><label><input class="pf-input"name="hiddenHotItemLabel"type="checkbox"value="on"/>热门"新"元素</label><label><input class="pf-input"name="hiddenHotItemMetrics"type="checkbox"value="on"/>热门热度值</label></div><div class="pf-hidden-labels"><label><input class="pf-input"name="hiddenAnswers"type="checkbox"value="on"/>列表回答内容</label><label><input class="pf-input"name="hiddenItemActions"type="checkbox"value="on"/>列表回答操作</label><br><label><input class="pf-input"name="hiddenAnswerText"type="checkbox"value="on"/>回答操作文字</label><label><input class="pf-input"name="hiddenListImg"type="checkbox"value="on"/>列表图片</label><label><input class="pf-input"name="hiddenReadMoreText"type="checkbox"value="on"/>问题列表阅读全文文字</label><br><label><input class="pf-input"name="hiddenAnswerRights"type="checkbox"value="on"/>收藏喜欢举报</label><label><input class="pf-input"name="hiddenAnswerRightsText"type="checkbox"value="on"/>收藏喜欢举报文字</label></div><div class="pf-hidden-labels"><label><input class="pf-input"name="hiddenDetailAvatar"type="checkbox"value="on"/>详情回答人头像</label><label><input class="pf-input"name="hiddenDetailName"type="checkbox"value="on"/>详情回答人姓名</label><label><input class="pf-input"name="hiddenDetailBadge"type="checkbox"value="on"/>详情回答人简介</label><br><label><input class="pf-input"name="hiddenDetailVoters"type="checkbox"value="on"/>详情回答人下赞同数</label><label><input class="pf-input"name="hiddenReward"type="checkbox"value="on"/>赞赏按钮</label></div><div class="pf-hidden-labels"><label><input class="pf-input"name="hiddenQuestionSide"type="checkbox"value="on"/>问题关注和被浏览数</label><label><input class="pf-input"name="hiddenQuestionShare"type="checkbox"value="on"/>问题分享</label><label><input class="pf-input"name="hiddenFixedActions"type="checkbox"value="on"/>回答悬浮操作条</label><label><input class="pf-input"name="hiddenQuestionTag"type="checkbox"value="on"/>问题话题</label><br><label><input class="pf-input"name="hiddenZhuanlanTag"type="checkbox"value="on"/>专栏关联话题</label><label><input class="pf-input"name="hiddenZhuanlanActions"type="checkbox"value="on"/>专栏操作条</label><label><input class="pf-input"name="hiddenZhuanlanTitleImage"type="checkbox"value="on"/>专栏标题图片</label></div><div class="pf-hidden-labels"><label><input class="pf-input"name="hiddenQuestionActions"type="checkbox"value="on"/>问题详情操作栏</label><label><input class="pf-input"name="hiddenQuestionFollowing"type="checkbox"value="on"/>关注问题按钮</label><label><input class="pf-input"name="hiddenQuestionAnswer"type="checkbox"value="on"/>回答按钮</label><label><input class="pf-input"name="hiddenQuestionInvite"type="checkbox"value="on"/>邀请回答按钮</label></div><div class="pf-hidden-labels"><label><input class="pf-input"name="hiddenSearchBoxTopSearch"type="checkbox"value="on"/>搜索栏知乎热搜</label><label><input class="pf-input"name="hiddenSearchPageTopSearch"type="checkbox"value="on"/>搜索页知乎热搜</label><label><input class="pf-input"name="hiddenSearchPageFooter"type="checkbox"value="on"/>搜索页知乎指南</label><br><label><input class="pf-input"name="hiddenSearchPageListAD"type="checkbox"value="on"/>搜索页商业推广</label></div></div><div id="pf-set-color"><h3>颜色设置</h3><div class="pf-radio-div pf-color-bg"><div class="pf-label">背景</div><div class="pf-content"name="colorsBackground"></div></div><div class="pf-use-theme-dark"><span class="pf-label">启用夜间模式</span><div class="pf-switch"><input class="pf-switch-checkbox pf-input"id="useThemeDark"name="isUseThemeDark"type="checkbox"><label class="pf-switch-label"for="useThemeDark"><span class="pf-switch-inner"data-on="ON"data-off="OFF"></span><span class="pf-switch-switch"></span></label></div></div></div><div id="pf-set-config"><h3>配置导出导入</h3><div class="pf-local-config"><button class="pf-export-config pf-button">导出当前配置</button><div class="pf-import-dom"><textarea class="pf-textarea"name="configImport"placeholder="配置可参考导出格式"></textarea><button class="pf-import-config pf-button">导入</button></div></div><div class="pf-customize-css"><div class="pf-label">自定义css</div><div class="pf-content"><textarea class="pf-textarea"name="customizeCss"></textarea><button class="pf-customize-css-button pf-button">确定</button></div></div></div></div></div><div class="pf-modal-footer"><a href="https://github.com/superPufferfish/custom-zhihu-style"target="_blank"><span class="fw-bold">点我~</span>Github您的star⭐是我更新的动力😀</a><a href="https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8"target="_blank">Greasyfork</a><div>更加方便地浏览知乎，按<span class="key-shadow">?</span>（<span class="key-shadow">Shift</span>+<span class="key-shadow">/</span>）查看所有快捷键</div></div></div></div></div><div style="display: none;"class="pf-preview"id="my-preview-image"><div class="pf-modal-bg"><img class="pf-preview-img"src=""></div></div><div style="display: none;"class="pf-preview"id="my-preview-video"><div class="pf-modal-bg"><video class="pf-preview-video"src=""autoplay loop></video></div></div><a href="https://www.zhihu.com"target="_self"class="pf-to-home"title="返回首页"><i class="iconfont">&#xe606;</i></a>`
  const INNER_CSS =
    `body{width:100%}*{box-sizing:border-box}@font-face{font-family:'own-iconfont';src:url('//at.alicdn.com/t/font_2324733_501silrna2e.woff2?t=1620462898565') format('woff2'),url('//at.alicdn.com/t/font_2324733_501silrna2e.woff?t=1620462898565') format('woff'),url('//at.alicdn.com/t/font_2324733_501silrna2e.ttf?t=1620462898565') format('truetype')}.iconfont{font-family:'own-iconfont' !important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-webkit-text-stroke-width:.2px;-moz-osx-font-smoothing:grayscale}.pf-op{position:fixed;width:50px;height:40px;line-height:40px;text-align:center;border-radius:0 12px 12px 0;top:100px;left:0;background:rgba(0,0,0,0.2);z-index:200;cursor:pointer;user-select:none;transform:translate(-30px);transition:transform .5s}.pf-op:hover{transform:translate(0)}.pf-to-home{position:fixed;user-select:none;bottom:50px;right:0;height:40px;width:40px;text-align:center;line-height:40px;border-radius:50%;background:#0066ff;color:#fff;transform:translate(30px);transition:transform .5s}.pf-to-home:hover{transform:translate(0)}.pf-to-home i{font-size:24px}.pf-preview,.pf-mark{box-sizing:border-box;position:fixed;height:100%;width:100%;top:0;left:0;overflow-y:auto;z-index:200;background-color:rgba(18,18,18,0.4)}.pf-preview textarea,.pf-mark textarea,.pf-preview input,.pf-mark input{box-sizing:border-box}.pf-modal-bg{min-height:100%;width:100%;display:flex;justify-content:center;align-items:center}.pf-modal-bg img{cursor:zoom-out}.pf-modal-parent{position:relative;height:100%;min-height:500px;width:100%}.pf-checkbox-div{padding:2px 0}.pf-commit{color:#999;font-size:12px;padding:2px 0}.pf-commit i{margin-left:6px}.pf-other-bg{background:#efefef;padding:12px !important;margin:0 -12px 12px}.pf-other-bg .pf-title-commit{color:red;margin-left:4px}.pf-modal{position:absolute;top:50%;left:50%;width:600px;height:500px;background:#fff;z-index:200;padding:12px 6px 0 12px;border-radius:6px;display:flex;flex-direction:column}.pf-modal ::-webkit-scrollbar{width:.25rem;height:.25rem;background:#eee}.pf-modal ::-webkit-scrollbar-track{border-radius:0}.pf-modal ::-webkit-scrollbar-thumb{border-radius:0;background:#bbb;transition:all .2s;border-radius:.25rem}.pf-modal ::-webkit-scrollbar-thumb:hover{background-color:rgba(95,95,95,0.7)}.pf-modal-show{animation:showModal .5s;animation-fill-mode:forwards}@keyframes showModal{0%{transform:translate(-50%, -35%);opacity:0}100%{transform:translate(-50%, -50%);opacity:1}}.pf-modal-header{padding-bottom:12px;height:36px}.pf-modal-header-title{font-size:20px}.pf-modal-header-title span{margin-left:4px;font-size:12px}.pf-b-close{font-size:16px;width:18px;height:18px;float:right;color:#999;cursor:pointer}.pf-b-close:hover{color:#111f2c}.pf-modal-footer{padding:12px 0}.pf-modal-footer a{margin-right:6px}.pf-modal-footer a:hover{color:#005ce6}.pf-modal-footer .css-1ncyplm{margin:0 2px}.pf-modal-content{display:flex;flex:1;width:100%;font-size:14px;overflow:hidden}.pf-left{width:120px;border-right:1px solid #ddd;list-style:none;margin:0;padding:0}.pf-left li{padding:4px 0}.pf-left li a{text-decoration:none;color:#111f2c}.pf-right{flex:1;overflow-y:auto;scroll-behavior:smooth;padding:0 12px 100px}.pf-right>div{padding-bottom:24px}.pf-right h3{margin:4px 0 8px 0;font-size:18px;font-weight:bold}.pf-zoom-answer-image{display:flex}.pf-zoom-answer-image .pf-content{flex:1}.pf-zoom-answer-image .pf-content label{display:block}.pf-simple-button{margin-bottom:12px}#pf-set-hidden .pf-title-commit{margin-left:6px}#pf-set-home>div,#pf-set-basis>div{border-bottom:1px solid #eee;padding:4px 0}#pf-set-home>div label,#pf-set-basis>div label{padding-right:4px}.pf-label{padding:4px 0}.pf-label::after{content:'：'}.pf-radio-img-select{display:inline-block;text-align:center}.pf-radio-img-select .pf-radio-img{width:32px;height:32px}.pf-radio-img-select input{margin:0;display:none}.pf-radio-img-select input:checked+.pf-radio-img{border:2px solid #4286f4}[name='colorsBackground'] .pf-color-choose-label{display:inline-block;width:100px;height:50px;position:relative;margin-right:6px;margin-bottom:6px}[name='colorsBackground'] .pf-color-choose-label input,[name='colorsBackground'] .pf-color-choose-label span{position:absolute;top:50%;transform:translateY(-50%);z-index:1}[name='colorsBackground'] .pf-color-choose-label input{left:12px}[name='colorsBackground'] .pf-color-choose-label input:checked+.pf-color-radio-item{border:2px solid #4286f4}[name='colorsBackground'] .pf-color-choose-label span{right:20px}[name='colorsBackground'] .pf-color-choose-label .pf-color-radio-item{width:100%;height:100%;border:2px solid transparent;border-radius:12px}#pf-set-color .pf-content{padding:4px}.pf-restore-config{margin-left:12px}.pf-import-dom,.pf-customize-css .pf-content{padding-top:8px;display:flex;align-items:center}.pf-import-dom .pf-textarea,.pf-customize-css .pf-content .pf-textarea{width:70%;height:50px}.pf-import-dom button,.pf-customize-css .pf-content button{height:50px;line-height:50px;width:25%;margin-left:5%;padding:0 !important}.pf-button{padding:4px 8px;border-radius:4px;background:#ddd;position:relative;border:1px solid #bbb}.pf-button:hover{background:#eee}.pf-button:active::after{content:'';position:absolute;width:100%;height:100%;top:0;left:0;background:rgba(0,0,0,0.2)}.pf-button:focus{outline:none}.pf-hidden-labels{padding-bottom:6px;border-bottom:1px solid #dddddd;margin-bottom:6px}.pf-home-tab-is-suspension{border-bottom:1px solid #eeeeee}.pf-home-tab-is-suspension>div{padding-bottom:8px}.pf-label-tag-Answer{background:#ec7259}.pf-label-tag-ZVideo{background:#12c2e9}.pf-label-tag-Article{background:#00965e}.pf-label-tag{margin-right:6px;font-weight:normal;display:inline-block;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff}.pf-filter-keywords-item{display:inline-block;background:#999;color:#fff;border-radius:4px;padding:2px 4px;margin:4px 4px 0 0}.pf-filter-keywords-item-text{margin-right:4px}.pf-filter-keywords-item-delete{cursor:pointer}.pf-filter-keywords-item-delete:hover{color:#444}.stopScroll{height:100% !important;overflow:hidden !important}.my-unlock,.my-lock,.my-lock-mask{display:none;color:#999;cursor:pointer}.my-unlock,.my-lock{margin:4px}.my-lock-mask{position:absolute;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:198}.key-shadow{border:1px solid #eee;border-radius:4px;box-shadow:rgba(0,0,0,0.06) 0 1px 1px 0;font-weight:600;min-width:26px;height:26px;padding:0px 6px;text-align:center}.position-suspensionSearch,.position-suspensionFind,.position-suspensionUser{position:fixed;z-index:100}.position-suspensionSearch:hover .my-unlock,.position-suspensionFind:hover .my-unlock,.position-suspensionUser:hover .my-unlock,.Topstory-container .TopstoryTabs:hover .my-unlock{display:block}.position-suspensionSearch.my-move-this .my-unlock,.position-suspensionFind.my-move-this .my-unlock,.position-suspensionUser.my-move-this .my-unlock,.Topstory-container .TopstoryTabs.my-move-this .my-unlock{display:none !important}.position-suspensionSearch.my-move-this .my-lock,.position-suspensionFind.my-move-this .my-lock,.position-suspensionUser.my-move-this .my-lock,.Topstory-container .TopstoryTabs.my-move-this .my-lock,.position-suspensionSearch.my-move-this .my-lock-mask,.position-suspensionFind.my-move-this .my-lock-mask,.position-suspensionUser.my-move-this .my-lock-mask,.Topstory-container .TopstoryTabs.my-move-this .my-lock-mask{display:block}.position-suspensionSearch.my-move-this .my-lock,.position-suspensionFind.my-move-this .my-lock,.position-suspensionUser.my-move-this .my-lock,.Topstory-container .TopstoryTabs.my-move-this .my-lock{z-index:199;color:#cccccc}.position-suspensionFind{display:flex;flex-direction:column;margin:0 !important}.position-suspensionFind .Tabs-item{padding:0 !important;margin-bottom:4px}.position-suspensionFind .Tabs-item .Tabs-link{padding:8px !important;border-radius:4px}.position-suspensionFind .Tabs-item .Tabs-link::after{content:'' !important;display:none !important}.position-suspensionUser{width:fit-content !important;margin:0 !important;display:flex;flex-direction:column}.position-suspensionUser .AppHeader-messages,.position-suspensionUser .AppHeader-notifications{margin-right:0 !important;margin-bottom:12px}.position-suspensionUser .AppHeader-login,.position-suspensionUser .AppHeader-login~button{display:none}.AppHeader-SearchBar{flex:1}.position-suspensionSearch{line-height:30px;border-radius:16px;width:20px;transition:width .5s}.position-suspensionSearch.focus{width:300px}.position-suspensionSearch.focus>form,.position-suspensionSearch.focus>button,.position-suspensionSearch.focus .my-search-pick-up{display:block}.position-suspensionSearch.focus .my-search-icon{display:none}.position-suspensionSearch.focus:hover{width:324px}.position-suspensionSearch .my-search-icon,.position-suspensionSearch .my-search-pick-up{cursor:pointer;color:#0066ff}.position-suspensionSearch .my-search-icon:hover,.position-suspensionSearch .my-search-pick-up:hover{color:#005ce6}.position-suspensionSearch .my-search-pick-up{font-size:24px;margin-left:4px}.position-suspensionSearch>form,.position-suspensionSearch>button,.position-suspensionSearch .my-search-pick-up{display:none}.position-suspensionSearch .my-search-icon{display:block}.GlobalSideBar-navList{margin-bottom:10px;overflow:hidden;border-radius:2px;box-shadow:0 1px 3px rgba(18,18,18,0.1);box-sizing:border-box}.Question-main .Question-mainColumn,.ListShortcut{flex:1;width:100%}.Question-sideColumn{margin-left:12px}.AnswerAuthor{margin-left:12px}.ModalWrap .ModalExp-content{height:0 !important;overflow:hidden}.ExploreSpecialCard,.ExploreRoundtableCard,.ExploreCollectionCard{width:48% !important}.GlobalWrite-navTop{display:flex !important;justify-content:space-between !important;flex-wrap:wrap !important}.GlobalWrite-navTop .GlobalWrite-topItem{margin-right:0 !important;margin-bottom:12px !important}.Profile-mainColumn{margin-right:12px}.QuestionHeader,.Post-content{min-width:0 !important}.Post-Main .RichContent-actions{left:50% !important}.Post-Main .RichContent-actions .ContentItem-actions{transform:translateX(-50%) !important}.css-1xy3kyp,.css-1kjxdzv,.css-qqgmyv{max-width:none !important}.SearchTopicReview{width:100px !important}.Topstory-mainColumn{flex:1 !important;min-width:694px !important}.ContentItem-actions{padding-top:0 !important;padding-bottom:0 !important}.ContentItem-actions>button,.ContentItem-actions>div{margin-left:8px}.RichContent-inner{margin-top:8px !important}.Post-SideActions-icon,.Post-SideActions button.like,.VoteButton{background:none !important;color:#8590a6 !important;padding:0 !important}.Post-SideActions button.like.active .Post-SideActions-icon,.Post-SideActions button.like.active .likeCount-inner,.VoteButton.is-active{color:#0066ff !important}.SearchMain{flex:1}.SearchSideBar{width:260px !important;flex:initial}.css-1acwmmj{display:none !important}.ProfileMain-tabs{flex-wrap:wrap}.zhuanlan{padding:0 24px}.zu-top-search-form{width:auto !important}.fw-bold{font-weight:bold}.w-200{width:200px}.w-300{width:300px}.h-25{height:25px}.p-t-8{padding-top:8px}.border-none{border:none !important}.pf-use-theme-dark{display:flex}.pf-switch{position:relative;width:64px;margin:0;scroll-behavior:smooth}.pf-switch-checkbox{display:none}.pf-switch-label{display:block;overflow:hidden;cursor:pointer;border-radius:20px}.pf-switch-inner{display:block;width:200%;margin-left:-100%;transition:margin .3s ease-in 0s}.pf-switch-inner::before,.pf-switch-inner::after{display:block;float:right;width:50%;height:25px;padding:0;line-height:25px;font-size:14px;color:white;font-family:Trebuchet,Arial,sans-serif;font-weight:bold;box-sizing:border-box}.pf-switch-inner::after{content:attr(data-on);padding-left:10px;background-color:#0066ff;color:#ffffff}.pf-switch-inner::before{content:attr(data-off);padding-right:10px;background-color:#eeeeee;color:#999999;text-align:right}.pf-switch-switch{position:absolute;display:block;width:20px;height:20px;margin:2px;background:#ffffff;top:0;bottom:0;right:40px;border:2px solid #999999;border-radius:20px;transition:all .3s ease-in 0s}.pf-switch-checkbox:checked+.pf-switch-label .pf-switch-inner{margin-left:0}.pf-switch-checkbox:checked+.pf-switch-label .pf-switch-switch{right:0px}`

  let pfConfig = {
    versionHeart: '1200', // 版心宽度
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
    zoomAnswerImage: '100px', // 图片缩放大小 hidden 100px 200px 400px default
    titleIco: '', // 网页标题logo图
    title: '', // 网页标题
    colorBackground: '#ffffff', // 背景色
    customizeCss: '',
    questionTitleTag: true, // 内容标题添加类别标签
    fixedListItemMore: false, // 列表更多按钮固定至题目右侧
    shoppingLink: 'default', // 购物链接显示设置
    filterKeywords: [],
    showGIFinDialog: true, // 动图弹窗显示
    zoomAnswerText: false, // 回答操作文字缩放
    isUseThemeDark: false, // 是否开启夜间模式
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
    suspensionPickUp: false, // 长回答和列表收起按钮
    previewOpenGIF: true, // 动图弹窗显示
    toHomeButton: true, // 页面右下停靠返回主页按钮
    toHomeButtonZhuanlan: 'zhihu', // toHomeButtonZhuanlan
    answerUnfold: false, // 自动展开所有回答
    answerFoldStart: false, // 默认收起所有长回答
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
    // 删除内容模块 end --------
  }

  // 脚本内配置
  const myLocalC = {
    cachePfConfig: {}, // 缓存初始配置
    backgrounds: ['#ffffff', 'bisque', '#FAF9DE', '#cce8cf', '#EAEAEF', '#E9EBFE'],
    // 背景色对应名称
    backgroundName: {
      '#ffffff': '默认',
      'bisque': '护眼红',
      '#FAF9DE': '杏仁黄',
      '#cce8cf': '青草绿',
      '#EAEAEF': '极光灰',
      '#E9EBFE': '葛巾紫',
    },
    backgroundOpacity: {
      '#FAF9DE': '#fdfdf2',
      'bisque': '#fff4e7',
      '#cce8cf': '#e5f1e7',
      '#EAEAEF': '#f3f3f5',
      '#E9EBFE': '#f2f3fb',
    },
    cacheTitle: '', // 缓存页面原标题
    bodySize: 0,
    bodySizePrev: 0,
    fetchHeaders: {}, // fetch的headers内容，获取下来以供使用
  }

  // 根据名称删除的官方回答
  const removeAnswerByAuthorName = [
    { id: 'removeStoryAnswer', name: '故事档案局' },
    { id: 'removeYanxuanAnswer', name: '盐选科普' },
    { id: 'removeYanxuanRecommend', name: '盐选推荐' },
  ]

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
        c = !cParse && !cLParse
          ? ''
          : !cParse
            ? configLocal
            : !cLParse
              ? config
              : cParse.t < cLParse.t
                ? configLocal
                : config

      }
      return c
    }
  }

  const myDialog = {
    open: () => {
      $('.pf-mark')[0].style.display = 'block'
      $('.pf-modal').addClass('pf-modal-show')
      initScrollModal()
      myScroll.stop()
    },
    hide: () => {
      $('.pf-mark')[0].style.display = 'none'
      $('.pf-modal').removeClass('pf-modal-show')
      myScroll.on()
    }
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
    hide: function (previewEvent) {
      if (this.even) {
        this.even.click()
        this.even = null
      }
      previewEvent.style.display = 'none'
      if (previewEvent.id === 'my-preview-video') {
        previewEvent.querySelector('.pf-preview-video').src = ''
      } else {
        previewEvent.querySelector('.pf-preview-img').src = ''
      }
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
          if (pfConfig[`${name}Fixed`]) {
            // 固定则跳出
            return
          }
          const event = window.event || ev
          const dx = event.clientX - e.offsetLeft
          const dy = event.clientY - e.offsetTop
          const rx = e.offsetWidth + e.offsetLeft - event.clientX
          // 按下拖动
          document.onmousemove = (ev) => {
            var event = window.event || ev
            let evenLeft = 0
            let evenRight = 0
            const isR = this.useR.find(i => i === name)
            if (isR) {
              // 用body替代window获取宽度来解决右侧滚动条宽度不一致问题
              const right = ($('body')[0].offsetWidth - event.clientX) - rx
              evenRight = right <= 0 ? 0 : right >= $('body')[0].offsetWidth - e.offsetWidth ? $('body')[0].offsetWidth - e.offsetWidth : right
              e.style.right = evenRight + 'px'
            } else {
              const left = event.clientX - dx
              evenLeft = left <= 0 ? 0 : left >= window.innerWidth - e.offsetWidth ? window.innerWidth - e.offsetWidth : left
              e.style.left = evenLeft + 'px'
            }
            const top = event.clientY - dy
            const evenTop = top <= 0 ? 0 : top >= window.innerHeight - e.offsetHeight ? window.innerHeight - e.offsetHeight : top
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
  }

  async function myChanger(ev, type) {
    const { name, value, checked } = ev
    const ob = {
      'versionHeart': initCSSVersion,
      'suspensionHomeTabStyle': initCSSVersion,
      'suspensionFindStyle': initCSSVersion,
      'questionTitleTag': initCSSVersion,
      'fixedListItemMore': initCSSVersion,
      'zoomAnswerImage': initCSSVersion,
      'shoppingLink': initCSSVersion,
      'toHomeButton': initCSSVersion,
      'zoomAnswerText': initCSSVersion,
      'stickyLeft': stickyBetween,
      'stickyRight': stickyBetween,
      'suspensionHomeTab': () => {
        initCSSVersion()
        changeSuspensionTab()
      },
      'isUseThemeDark': () => {
        initCSSVersion()
        doUseThemeDark(checked)
      },
      'suspensionFind': cacheHeader,
      'suspensionSearch': cacheHeader,
      'suspensionUser': cacheHeader,
      'removeZhihuOfficial': onChangeOfficialRemove,
      'titleIco': changeTitleIco,
      'colorBackground': initCSSBackground,
      'title': changeTitle,
      'customizeCss': changeCustomCSS,
      'toHomeButtonZhuanlan': onToHomeHref,
      'answerUnfold': () => answerFoldOrNot('answerUnfold', checked),
      'answerFoldStart': () => answerFoldOrNot('answerFoldStart', checked),
      'showGIFinDialog': previewGIF,
    }
    pfConfig[name] = type === 'checkbox' ? checked : value
    await myStorage.set('pfConfig', JSON.stringify(pfConfig))
    if (/^position/.test(name)) {
      initPositionPage()
    } else if (/^hidden/.test(name)) {
      initCSSVersion()
    } else if (/^removeItemAbout/.test(name)) {
      removeItemAboutChanger(ev)
    } else {
      ob[name] && ob[name]()
    }
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
    const names = [
      'removeItemAboutAnswer',
      'removeItemAboutArticle',
      'removeItemAboutVideo',
    ]
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
        const i = filterKeywords.findIndex(i => i === title)
        filterKeywords.splice(i, 1)
        pfConfig = {
          ...pfConfig,
          filterKeywords,
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

  function initData() {
    myLocalC.cacheTitle = document.title
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
      'text': (even) => {
        if (even.name === 'title' || even.name === 'customizeCss') {
          even.name === 'title' && (even.value = pfConfig.title || document.title)
          even.name === 'customizeCss' && (even.value = pfConfig['customizeCss'])
        } else {
          even.value = pfConfig[even.name]
        }
      }
    }

    document.querySelectorAll('.pf-input').forEach((item) => {
      echo[item.type] && echo[item.type](item)
    })

    $('.pf-modal-content')[0].onchange = (even) => {
      if ($(even.target).hasClass('pf-input')) {
        return myChanger(even.target, even.target.type)
      }
    }

    initPositionPage()
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
    }
  }

  // 改变列表切换TAB悬浮
  function changeSuspensionTab() {
    const name = 'suspensionHomeTab'
    cSuspensionStyle(name)
    const even = $('.Topstory-container .TopstoryTabs')
    pfConfig[name] ? appendLock(even, name) : removeLock(even, name)
  }

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
    // 直接使用eventName中的顺序，减少一次循环排序
    const eventNames = ['suspensionFind', 'suspensionSearch', 'suspensionUser']
    eventNames.forEach((name) => {
      const { even } = domCache.headerDoms[name]
      if (pfConfig[name]) {
        // 如果是suspensionSearch则添加展开和收起按钮
        if (name === 'suspensionSearch') {
          !$('.my-search-icon')[0] && even.prepend('<i class="iconfont my-search-icon">&#xe600;</i>')
          !$('.my-search-pick-up')[0] && even.append('<i class="iconfont my-search-pick-up">&#xe601;</i>')
          $('.my-search-icon')[0] && ($('.my-search-icon')[0].onclick = () => even.addClass('focus'))
          $('.my-search-pick-up')[0] && ($('.my-search-pick-up')[0].onclick = () => even.removeClass('focus'))
        }
        appendLock(even, name)
        even.addClass(`position-${name}`)
        $('body').append(even)
      } else {
        if (name === 'suspensionSearch') {
          $('.my-search-icon')[0] && $('.my-search-icon').remove()
          $('.my-search-pick-up')[0] && $('.my-search-pick-up').remove()
          even.hasClass('focus') && even.removeClass(`focus`)
        }
        removeLock(even, name)
        even.removeClass(`position-${name}`)
        even.removeAttr('style', '')
        $('.AppHeader-inner').append(even)
      }
      cSuspensionStyle(name)
    })
    initCSSVersion()
  }

  // 悬浮模块是否固定改为鼠标放置到模块上显示开锁图标 点击即可移动模块
  function appendLock(even, name) {
    if (even[0]) {
      !even.children('.my-unlock')[0] && even.append('<i class="iconfont my-unlock">&#xe688;</i>')
      !even.children('.my-lock')[0] && even.append('<i class="iconfont my-lock">&#xe700;</i>')
      !even.children('.my-lock-mask')[0] && even.append('<div class="my-lock-mask"></div>')
      even.children('.my-unlock')[0].onclick = async () => {
        pfConfig[name + 'Fixed'] = false
        await myStorage.set('pfConfig', JSON.stringify(pfConfig))
        even.addClass('my-move-this')
      }

      even.children('.my-lock')[0].onclick = async () => {
        pfConfig[name + 'Fixed'] = true
        await myStorage.set('pfConfig', JSON.stringify(pfConfig))
        even.removeClass('my-move-this')
      }

      // 如果进入页面的时候该项的FIXED为false则添加class
      if (pfConfig[name + 'Fixed'] === false) {
        even.addClass('my-move-this')
      }
    }
  }

  function removeLock(even, name) {
    if (even[0]) {
      even.children('.my-unlock')[0] && even.children('.my-unlock').remove()
      even.children('.my-lock')[0] && even.children('.my-lock').remove()
      even.children('.my-lock-mask')[0] && even.children('.my-lock-mask').remove()
    }
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
    $('.pf-left-container .Sticky').empty()
    $('.GlobalSideBar .Sticky').empty()
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
    leftDom.forEach(({ even }) => { $('.pf-left-container .Sticky').append(even) })
    rightDom.forEach(({ even }) => { $('.GlobalSideBar .Sticky').append(even) })
    // 两侧盒子不存在子元素则隐藏
    $('.pf-left-container')[0] && ($('.pf-left-container')[0].style.display = $('.pf-left-container .Sticky').children().length > 0 ? 'block' : 'none')
    $('.GlobalSideBar')[0] && ($('.GlobalSideBar')[0].style.display = $('.GlobalSideBar .Sticky').children().length > 0 ? 'block' : 'none')
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
    if (pfConfig.customizeCss) {
      const cssCustom = `<style type="text/css" id="pf-css-custom">${pfConfig.customizeCss}</style>`
      $('head').append(cssCustom)
    }
  }

  // 修改页面标题
  function changeTitle() {
    document.title = pfConfig.title || myLocalC.cacheTitle
  }

  // 修改页面标题ico
  function changeTitleIco() {
    const ico = {
      github: '<link rel="icon" class="js-site-favicon" id="pf-ico" type="image/svg+xml" href="https://github.githubassets.com/favicons/favicon.svg">',
      csdn: '<link href="https://g.csdnimg.cn/static/logo/favicon32.ico" id="pf-ico" rel="shortcut icon" type="image/x-icon">',
      juejin: '<link data-n-head="ssr" rel="shortcut icon" id="pf-ico" href="https://b-gold-cdn.xitu.io/favicons/v2/favicon.ico">',
      zhihu: '<link rel="shortcut icon" type="image/x-icon" id="pf-ico" href="https://static.zhihu.com/heifetz/favicon.ico">',
    }
    if (ico[pfConfig.titleIco]) {
      $('[type="image/x-icon"]')[0] && $('[type="image/x-icon"]').remove()
      $('#pf-ico')[0] && $('#pf-ico').remove()
      ico[pfConfig.titleIco] && $('head').append(ico[pfConfig.titleIco])
    }
  }

  // 修改版心方法
  function initCSSVersion() {
    const heartV =
      `.QuestionHeader .QuestionHeader-content,.QuestionHeader-footer .QuestionHeader-footer-inner`
      + `,.QuestionHeader-content,.Question-main,.AppHeader-inner,.TopstoryPageHeader,.Topstory-container`
      + `,.ExploreHomePage,.QuestionWaiting,.SearchTabs-inner,.Search-container,.ProfileHeader`
      + `,.Profile-main,.CollectionsDetailPage,.ColumnPageHeader-content,.SettingsMain,.App-main .Creator`
      + `,.Collections-container,.Balance-Layout,.zhuanlan .Post-NormalMain .Post-Header`
      + `,.zhuanlan .Post-RichTextContainer,.zhuanlan .Post-NormalMain>div`
      + `,.zhuanlan .Post-content .RichContent-actions`
      + `,.zhuanlan .Post-NormalSub>div,.zg-wrap`
      + `{width:${vHeart().v}!important;}`

    const heartVC =
      `.QuestionHeader-main,.Profile-mainColumn,.CollectionsDetailPage-mainColumn`
      + `,.Collections-mainColumn,.Balance-Main,.Post-RichTextContainer,.ContentItem-time`
      + `,.Post-content .RichContent-actions,.Post-NormalMain .Post-Header`
      + `,.Post-NormalMain>div,.Post-NormalSub>div,.Post-topicsAndReviewer`
      + `,.css-1xy3kyp,.css-1voxft1,.WriteIndexLayout-main`
      + `{width:${vHeart().vContent}!important;}`

    const imgSize =
      `img.lazy,.GifPlayer img,.ArticleItem-image,.ztext figure .content_image`
      + `,.ztext figure .origin_image,.TitleImage {${vImgSize()}}`
      + `.GifPlayer.isPlaying img {cursor:pointer!important;}`

    const susHomeTab =
      `.Topstory-container .TopstoryTabs`
      + `{${pfConfig.suspensionHomeTabPo}position:fixed;z-index:100;display:flex;flex-direction:column;height:initial!important;}`
      + `.Topstory-container .TopstoryTabs>a{font-size:0 !important;border-radius:50%}`
      + `.Topstory-container .TopstoryTabs>a::after`
      + `{font-size:16px !important;display:inline-block;padding:6px 8px;margin-bottom:4px;${vSusColor(pfConfig.suspensionHomeTabStyle).normal}}`
      + `.Topstory-container .TopstoryTabs>a.TopstoryTabs-link {margin:0!important}`
      + `.Topstory-container .TopstoryTabs>a.TopstoryTabs-link.is-active::after {${vSusColor(pfConfig.suspensionHomeTabStyle).active}}`
      + `.Topstory [aria-controls='Topstory-recommend']::after {content:'推';border-top-left-radius:4px;border-top-right-radius:4px}`
      + `.Topstory [aria-controls='Topstory-follow']::after {content:'关'}`
      + `.Topstory [aria-controls='Topstory-hot']::after {content:'热';border-bottom-left-radius:4px;border-bottom-right-radius:4px}`

    const questionTag =
      `.AnswerItem .ContentItem-title::before{content:'问答';background:#ec7259}`
      + `.ZVideoItem .ContentItem-title::before{content:'视频';background:#12c2e9}`
      + `.ArticleItem .ContentItem-title::before{content:'文章';background:#00965e}`
      + `.ContentItem .ContentItem-title::before{margin-right:6px;font-weight:normal;display:inline;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff}`
      + `.ContentItem-title div{display:inline}`
      + `.TopstoryQuestionAskItem .ContentItem-title::before{content:'提问';background:#533b77}`

    const cssVersion =
      '<style type="text/css" id="pf-css-version">'
      + heartV
      + heartVC
      + imgSize
      + hiddenCSS()
      + shoppingLinkCSS()
      + `.Post-SideActions{left: ${vHeart().leftSide}}`
      + (pfConfig.suspensionHomeTab ? susHomeTab : '')
      + (pfConfig.questionTitleTag ? questionTag : '')
      + `.position-suspensionFind{${pfConfig.suspensionFindPo}}`
      + `.position-suspensionUser{${pfConfig.suspensionUserPo}}`
      + `.position-suspensionSearch{${pfConfig.suspensionSearchPo}}`
      + `.position-suspensionFind .Tabs-link{${vSusColor(pfConfig.suspensionFindStyle).normal}}`
      + `.position-suspensionFind .Tabs-link.is-active{${vSusColor(pfConfig.suspensionFindStyle).active}}`
      + (pfConfig.fixedListItemMore
        ? `.Topstory-container .ContentItem-actions .ShareMenu ~ div.ContentItem-action`
        + `{visibility: visible!important;position: absolute;top: 20px;right: 10px;}`
        : '')
      + (pfConfig.toHomeButton ? '.pf-to-home{display:block;}' : '.pf-to-home{display:none;}')
      + (pfConfig.positionAnswer === 'hidden' && pfConfig.positionCreation === 'hidden'
        && pfConfig.positionTable === 'hidden' && pfConfig.positionFavorites === 'hidden'
        && pfConfig.positionFooter === 'hidden' ? '.GlobalSideBar{display:none;}' : '')
      + (pfConfig.zoomAnswerText
        ? '.ContentItem-action,.ContentItem-actions .Button--plain,.Post-SideActions-icon,.Post-SideActions button.like,.VoteButton {font-size: 12px !important;}'
        : '.VoteButton-TriangleUp,.Zi--TriangleDown {width: 14px;height: 14px;}')
      + (pfConfig.isUseThemeDark
        ? '.pf-modal{background: #121212!important;}.pf-left li a{color: #fff;}'
        + '.pf-other-bg{background:initial!important}.pf-button{background:#333}.pf-button:hover{background: #444;}'
        : '')
      + '</style>'
    $('#pf-css-version') && $('#pf-css-version').remove()
    $('head').append(cssVersion)
  }

  // 购物链接设置样式
  function shoppingLinkCSS() {
    const shopCSSObj = {
      default: '',
      justText:
        '.MCNLinkCard-imageContainer,.MCNLinkCard-button,.MCNLinkCard-source'
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
        + '{color: #06f!important;justify-content: start!important;}'
        + '.MCNLinkCard-titleContainer::before,.ecommerce-ad-commodity-main-content-des span::before{content: "购物链接："}'
        + '.MCNLinkCard-title{color: #06f!important;}',
      hidden:
        'a.MCNLinkCard,.RichText-ADLinkCardContainer,.ecommerce-ad-commodity-box,.ecommerce-ad-box'
        + '{display: none!important;}'
    }
    return shopCSSObj[pfConfig.shoppingLink || 'default']
  }

  // 隐藏模块的css
  function hiddenCSS() {
    return (pfConfig.hiddenAnswerRightFooter ? '.Question-sideColumn{display: none!important;}' : '')
      + (pfConfig.hiddenLogo
        ? `.ZhihuLogoLink,.TopTabNavBar-logo-3d0k,[aria-label="知乎"]`
        + ',.TopNavBar-logoContainer-vDhU2,.zu-top-link-logo'
        + `{display: none!important;}`
        : '')
      + (pfConfig.hiddenHeader ? `.AppHeader,.ColumnPageHeader-Wrapper{display: none!important;}` : '')
      + (pfConfig.hiddenHeaderScroll ? `.AppHeader.is-fixed{display:none!important;}` : '')
      + (pfConfig.hiddenItemActions
        ? `.Topstory-container .ContentItem-actions>span,.Topstory-container .ContentItem-actions>button`
        + `,.Topstory-container .ContentItem-actions>div,.Topstory-container .ContentItem-actions>a`
        + `,.TopstoryQuestionAskItem-writeAnswerButton,.TopstoryQuestionAskItem-hint`
        + `{visibility:hidden!important;height:0!important;padding:0!important;}`
        + `.TopstoryQuestionAskItem-hint{margin: 0!important;}`
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
      + (pfConfig.hiddenQuestionShare ? '.Popover.ShareMenu{display: none!important;}' : '')
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
      + (pfConfig.hiddenDetailVoters ? '.AnswerItem .css-h5al4j{display: none;}' : '')
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
  }

  // 悬浮模块颜色填充
  function vSusColor(value) {
    // 跟页面背景颜色同步
    const bg = myLocalC.backgroundOpacity[pfConfig.colorBackground] || '#ffffff'
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
  }

  // 图片size调整
  function vImgSize() {
    // original
    const styleObj = {
      'default': '',
      'hidden': 'display: none!important;',
      'original': ''
    }

    return styleObj[pfConfig.zoomAnswerImage] || 'width:' + pfConfig.zoomAnswerImage + '!important;cursor: zoom-in!important;'
  }

  // 判断版心是否为100vw 返回根据版心调整的宽度内容
  function vHeart() {
    let v = pfConfig.versionHeart === '100%' ? pfConfig.versionHeart : pfConfig.versionHeart + 'px'
    return {
      v,
      vContent: `calc(${v} - 296px)`,
      leftSide: `calc(40vw - (${v} / 2))`
    }
  }

  const callbackGIF = (mutationsList) => {
    const e = mutationsList[0].target
    if (/\bisPlaying\b/.test(e.className) && pfConfig.previewOpenGIF) {
      if (e.querySelector('video')) {
        myPreview.open(e.querySelector('video').src, e, true)
      } else {
        myPreview.open(e.querySelector('img').src, e)
      }
    }
  }
  const observerGIF = new MutationObserver(callbackGIF)

  // 加载预览图片方法，解决部分图片无法点击预览的问题
  function initPreviewImg() {
    const images = [
      document.querySelectorAll('.TitleImage'),
      document.querySelectorAll('.ArticleItem-image'),
      document.querySelectorAll('.ztext figure .content_image'),
    ]
    images.forEach((events) => {
      events.forEach((e) => {
        const src = e.src || (e.style.backgroundImage && e.style.backgroundImage.split('("')[1].split('")')[0])
        e.onclick = () => myPreview.open(src)
      })
    })

    if (pfConfig.zoomAnswerImage === 'original') {
      document.querySelectorAll('.origin_image').forEach((item) => {
        const src = $(item).attr('data-original') || $(item).src
        item.src = src
        item.style = 'max-width: initial;'
      })
    }
  }

  function previewGIF() {
    // 因为GIF图是点击后切换到真正GIF 所以在点击切换后在打开弹窗
    // 使用MutationObserver监听元素属性变化
    if (pfConfig.showGIFinDialog) {
      const config = { attributes: true, attributeFilter: ['class'] }
      document.querySelectorAll('.GifPlayer').forEach((event) => {
        observerGIF.observe(event, config)
      })
    } else {
      observerGIF.disconnect()
    }
  }

  const myBG = {
    init: function (bg) {
      return pfConfig.colorBackground !== '#ffffff' ? this.normal(bg) : ''
    },
    filter: (fi) => {
      const customBG =
        `.zu-top,.zu-top-nav-userinfo.selected`
        + `,html.no-touchevents .top-nav-profile:hover .zu-top-nav-userinfo,.top-nav-profile a`
        + `{background:#ffffff!important;border-color: #eeeeee!important;}`

      const customColor =
        `.zu-top .zu-top-nav-link,.top-nav-profile .zu-top-nav-userinfo`
        + `,.top-nav-dropdown li a`
        + `{color: #111f2c!important;}`

      return `html,html img,.pf-color-radio-item,iframe{${fi}}`
        + `html.no-touchevents .top-nav-dropdown a:hover{background:#eeeeee!important}`
        + customBG
        + customColor
    },
    normal: (bg) => {
      const normalBG =
        `body,.Post-content,.HotList,.HotListNavEditPad,.ColumnPageHeader,.ZVideoToolbar`
        + `,.position-suspensionSearch.focus,.Modal-modal-wf58`
        + `{background-color: ${bg}!important;}`

      const opacityBG =
        `.QuestionHeader,.Card,.HotItem,.GlobalSideBar-navList,.Recommendations-Main`
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
        + `,.pf-modal,.pf-modal select,.pf-modal input,.pf-modal textarea`
        + `{background-color:${myLocalC.backgroundOpacity[bg]}!important;background:${myLocalC.backgroundOpacity[bg]}!important;}`

      const transparentBG =
        `.zhuanlan .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper`
        + `{background-color: transparent!important;}`

      return normalBG + opacityBG + transparentBG
    },
  }

  // 修改页面背景的css
  function initCSSBackground() {
    const cssColor = `<style type="text/css" id="pf-css-background">${myBG.init(pfConfig.colorBackground)}</style>`
    $('#pf-css-background') && $('#pf-css-background').remove()
    $('head').append(cssColor)
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

  function stickyBetween() {
    window.scrollY > 0 ? fixedPosition() : inheritPosition()
  }

  function fixedPosition() {
    if (pfConfig.stickyLeft && $('.pf-left-container')[0]) {
      $('.pf-left-container .Sticky').css({
        position: 'fixed',
        width: $('.pf-left-container')[0].offsetWidth,
        left: $('.pf-left-container')[0].offsetLeft,
        top: $('.pf-left-container')[0].offsetTop,
      })
    } else {
      $('.pf-left-container .Sticky').removeAttr('style', '')
    }

    if (pfConfig.stickyRight && $('.GlobalSideBar')[0]) {
      $('.GlobalSideBar .Sticky').css({
        position: 'fixed',
        width: $('.GlobalSideBar')[0].offsetWidth,
        right: $('.GlobalSideBar')[0].offsetRight,
        top: $('.GlobalSideBar')[0].offsetTop,
      })
    } else {
      $('.GlobalSideBar .Sticky').removeAttr('style', '')
      $('.GlobalSideBar .Sticky')[0] && ($('.GlobalSideBar .Sticky')[0].style = 'position: inherit!important')
    }
  }

  function inheritPosition() {
    $('.pf-left-container .Sticky').removeAttr('style', '')
    $('.GlobalSideBar .Sticky').removeAttr('style', '')
    $('.GlobalSideBar .Sticky')[0] && ($('.GlobalSideBar .Sticky')[0].style = 'position: inherit!important')
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
      document.querySelectorAll(name).forEach(hrefChanger)
    })
  }

  const useSimple = async () => {
    let isUse = confirm('是否启用极简模式？\n该功能会覆盖当前配置，建议先将配置导出保存')
    if (isUse) {
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
        hiddenQuestionActions: true,
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
      }
      pfConfig = {
        ...pfConfig,
        ...c,
      }
      await myStorage.set('pfConfig', JSON.stringify(pfConfig))
      onDocumentStart()
      initData()
    }
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
    document.querySelectorAll('.pf-preview').forEach((even) => {
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
        + `<input class="pf-input" name="colorBackground" type="radio" value="${item}"/>`
        + `<div class="pf-color-radio-item" style="background: ${item};">`
        + `<span style="color: #111f2c">${myLocalC.backgroundName[item]}</span>`
        + `</div>`
        + `</label>`
      return $(d)
    }
    const domParent = $('<block></block>')
    myLocalC.backgrounds.forEach((item) => domParent.append(dom(item)))
    $(`[name="colorsBackground"]`).empty()
    $(`[name="colorsBackground"]`)[0] && $(`[name="colorsBackground"]`).append(domParent)
  }

  // 删除回答
  let eachIndex = 0
  function storyHidden() {
    const isTrue = (() => {
      let isHaveName = false
      removeAnswerByAuthorName.forEach((item) => {
        pfConfig[item.id] && (isHaveName = true)
      })
      return isHaveName || pfConfig.removeFromYanxuan || pfConfig.removeZhihuOfficial
        || pfConfig.answerUnfold || pfConfig.answerFoldStart
    })()

    if (isTrue) {
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
            removeAnswerByAuthorName.forEach((item) => {
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

            if (foldButton && foldButton[0] && !$(that).hasClass('is-fold') && that.offsetHeight > 955) {
              foldButton[0].click()
              $(that).addClass('is-fold')
              lessNum++
            } else if (unFoldButton && unFoldButton[0] && !$(that).hasClass('is-fold')) {
              $(that).addClass('is-fold')
              lessNum++
            }
          }

          if (i === events.length - 1) {
            eachIndex = i - lessNum - 1
          }
        }
      }
    }
  }

  // 关键词过滤列表内容
  let filterIndex = 0
  function filterItemByKeyword() {
    const events = $('.TopstoryItem .ContentItem')
    const removeItemTypeNameToClass = {
      'removeItemAboutAnswer': 'AnswerItem',
      'removeItemAboutArticle': 'ArticleItem',
      'removeItemAboutVideo': 'ZVideoItem',
      'removeItemAboutAsk': 'TopstoryQuestionAskItem',
    }
    const words = pfConfig.filterKeywords
    for (let i = filterIndex, len = events.length; i < len; i++) {
      let lessNum = 0
      let dataZop = {}
      try {
        dataZop = JSON.parse($(events[i]).attr('data-zop'))
      } catch { }
      const { itemId = '', title = '', type = '' } = dataZop
      let isFindTitle = false
      words.forEach((w) => {
        const rep = new RegExp(w)
        if (rep.test(title)) {
          isFindTitle = true
        }
      })

      let typeKey = ''
      Object.keys(removeItemTypeNameToClass).forEach((key) => {
        if ($(events[i]).hasClass(removeItemTypeNameToClass[key])) {
          typeKey = key
        }
      })

      if (isFindTitle) {
        // 过滤了之后调用“不感兴趣”接口
        const data = new FormData()
        data.append('item_brief', JSON.stringify({ "source": "TS", "type": type, "id": itemId }))
        fetch('/api/v3/feed/topstory/uninterestv2', {
          body: data,
          method: 'POST',
          headers: new Headers({
            ...myLocalC.fetchHeaders
          })
        })
        lessNum++
        GM_log(`[customize]关键词过滤，内容标题：${title}`)
        GM_log(`[customize]已调用过滤接口`)
        $(events[i]).parent().parent().remove()
      } else if (typeKey && pfConfig[typeKey]) {
        $(events[i]).parent().parent().remove()
        lessNum++
        GM_log('[customize]---列表种类过滤---')
      }

      if (i === len - 1) {
        eachIndex = i - lessNum - 1
      }
    }
  }

  // 搜索列表过滤
  let searchEachIndex = 0
  function searchPageHidden() {
    const isTrue = (() => {
      return pfConfig.hiddenSearchPageListAD
    })()

    if (isTrue) {
      const events = $('.SearchResult-Card')
      let lessNum = 0 // 每次减去的列表内容数量
      // 使用此循环方式是为了新的元素添加后从后面开始循环，减少遍历数量
      for (let i = searchEachIndex, len = events.length; i < len; i++) {
        const that = events[i]
        if (that) {
          if (pfConfig.hiddenSearchPageListAD) {
            // 知乎官方账号优先级最高
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
  }

  // 屏蔽页面设置
  const removeFilterButton = $('<button class="pf-button" style="margin-left: 12px;">移除当前页所有屏蔽话题</button>')
  removeFilterButton[0].onclick = () => {
    document.querySelectorAll('.Tag-remove').forEach(item => item.click())
  }
  function filterPageSetting() {
    document.querySelectorAll('.css-j2uawy').forEach((item) => {
      if (/已屏蔽话题/.test(item.innerText) && !$(item).find('.pf-button')[0]) {
        $(item).append(removeFilterButton)
      }
    })
  }

  // 在启动时注入的内容
  ; (async function () {
    timeStart = performance.now()
    myLocalC.cachePfConfig = pfConfig
    const config = await myStorage.get('pfConfig')
    const c = config ? JSON.parse(config) : {}
    pfConfig = { ...pfConfig, ...c }
    $('head').append(`<style type="text/css" id="pf-css-own">${INNER_CSS}</style>`)
    onDocumentStart()

    if (location.host === 'zhuanlan.zhihu.com') {
      $('html').addClass('zhuanlan')
    }

    // 拦截fetch方法 获取option中的值
    const originFetch = fetch
    unsafeWindow.fetch = (url, opt) => {
      if (!myLocalC.fetchHeaders['x-ab-param']) {
        if (opt && opt.headers) {
          myLocalC.fetchHeaders = opt.headers
        }
      }
      return originFetch(url, opt)
    }


  })()

  let themeTimeout = null
  let themeFindIndex = 0
  function findTheme(isFind) {
    if (themeTimeout) {
      clearTimeout(themeTimeout)
    }
    if (themeFindIndex < 20 && !isFind) {
      themeTimeout = setTimeout(() => {
        clearTimeout(themeTimeout)
        themeFindIndex++
        if (pfConfig.isUseThemeDark) {
          doUseThemeDark(pfConfig.isUseThemeDark)
          findTheme()
        }
      }, 50)
    }
  }

  function onDocumentStart() {
    initCSSVersion()
    initCSSBackground()
    changeCustomCSS()
    findTheme()
  }

  // 在页面加载完成时注入的内容
  window.onload = () => {
    initHTML()
    initData()
    resizeObserver.observe($('body')[0])

    // 如果存在登录弹窗则移除
    if ($('.signFlowModal')[0]) {
      $('.signFlowModal').find('.Modal-closeButton')[0].click()
    }
  }

  // history 变化
  window.addEventListener('popstate', function () {
    filterIndex = 0
    eachIndex = 0
  })

  // 调用resize方法 触发页面变动
  function doResizePage() {
    const myEvent = new Event('resize')
    window.dispatchEvent(myEvent)
  }

  // 使用ResizeObserver监听body高度
  const resizeObserver = new ResizeObserver(throttle(resizeFun, 500))
  function resizeFun() {

    // 页面高度发生改变
    if (myLocalC.bodySize === myLocalC.bodySizePrev) {
      const pathname = location.pathname
      // 重新复制img预览
      initPreviewImg()
      previewGIF()
      // 外链直接打开
      initLinkChanger()
      // 关键词过滤列表内容
      filterItemByKeyword()

      // 如果是问题回答详情页执行内容
      if (/\/question\//.test(pathname)) {
        storyHidden()
      }

      // 屏蔽页面执行内容
      if (/\/settings\/filter/.test(pathname)) {
        filterPageSetting()
      }

      if (/\/search/.test(pathname)) {
        searchPageHidden()
      }
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

  window.onscroll = throttle(() => {
    stickyBetween()
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
          evenButton.style =
            `visibility:visible!important;position: fixed!important;bottom: 60px;`
            + `left: ${even.offsetLeft + even.offsetWidth - right}px;`
            + `box-shadow: 0 1px 3px rgb(18 18 18 / 10%);`
            + `height: 40px!important;line-height:40px;padding: 0 12px!important;`
            + `background: ${myLocalC.backgroundOpacity[pfConfig.colorBackground]}`
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
    document.querySelectorAll('.pf-left a').forEach((i) => {
      const id = i.href.replace(/.*#/, '')
      hrefArr.push({
        id,
        offsetTop: $(`#${id}`)[0].offsetTop
      })
    })
    const scrollM = () => {
      const scHere = eHeight / 2 + e.scrollTop
      const id = hrefArr.find((item, index) => item.offsetTop <= scHere && ((hrefArr[index + 1] && hrefArr[index + 1].offsetTop > scHere) || !hrefArr[index + 1])).id
      document.querySelectorAll('.pf-left a').forEach((i) => {
        // 使用判断减少赋值次数 优化性能
        const itemId = i.href.replace(/.*#/, '')
        if (!i.style.color && itemId === id) {
          i.style.color = '#0066ff'
        } else if (i.style.color && itemId !== id) {
          i.style.color = ''
        }
      })
    }

    e.onscroll = throttle(() => scrollM(), 100)
    scrollM()
  }

})()