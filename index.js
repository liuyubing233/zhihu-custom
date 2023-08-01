// ==UserScript==
// @name         知乎修改器🤜持续更新🤛努力实现功能最全的知乎配置插件
// @namespace    http://tampermonkey.net/
// @version      3.15.8
// @description  页面模块自定义隐藏，列表及回答内容过滤，保存浏览历史记录，推荐页内容缓存，列表种类和关键词强过滤并自动调用「不感兴趣」接口，屏蔽用户回答，回答视频下载，回答内容按照点赞数和评论数排序，设置自动收起所有长回答或自动展开所有回答，移除登录提示弹窗，设置过滤故事档案局和盐选科普回答等知乎官方账号回答，手动调节文字大小，切换主题及夜间模式调整，隐藏知乎热搜，列表添加标签种类，去除广告，设置购买链接显示方式，收藏夹内容导出为PDF，一键移除所有屏蔽选项，外链直接打开，更多功能请在插件里体验...
// @compatible   edge Violentmonkey
// @compatible   edge Tampermonkey
// @compatible   chrome Violentmonkey
// @compatible   chrome Tampermonkey
// @compatible   firefox Violentmonkey
// @compatible   firefox Tampermonkey
// @author       liuyubing
// @match        *://*.zhihu.com/*
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';
  const INNER_HTML = `<div id="CTZ_DIALOG_MAIN" style="display: none"><div class="ctz-header"><span>修改器</span><span class="ctz-version"></span><i id="CTZ_CLOSE_DIALOG" class="ctz-icon">&#xe602;</i></div><div class="ctz-menu-top"><a href="#CTZ_SET_BASIS">基础设置</a><a href="#CTZ_SET_LIST">首页列表</a><a href="#CTZ_SET_ANSWER">回答详情</a><a href="#CTZ_SET_ARTICLE">文章专栏</a><a href="#CTZ_SET_HISTORY">历史记录</a></div><div class="ctz-content"><div id="CTZ_SET_BASIS" style="display: none"><div class="ctz-content-left"><a href="#CTZ_SET_BASIS_DEFAULT">基本设置</a><a href="#CTZ_SET_BASIS_FLOAT">悬浮模块</a><a href="#CTZ_SET_BASIS_BLOCK">黑名单设置</a><a href="#CTZ_SET_BASIS_HIDDEN">通用模块隐藏</a><a href="#CTZ_SET_BASIS_COLOR">颜色设置</a><a href="#CTZ_SET_BASIS_CONFIG">配置操作</a><a href="#CTZ_SET_BASIS_MORE">默认功能</a></div><div class="ctz-content-right"><div id="CTZ_SET_BASIS_DEFAULT"><div class="ctz-set-title"><span>基本设置</span></div><div class="ctz-set-content"><div><label><span class="ctz-label">不显示修改器唤醒图标<span class="ctz-icon" style="margin: 0 6px">&#xe603;</span></span><input class="ctz-i" name="hiddenOpenButton" type="checkbox" value="on" /></label></div><div><label><span class="ctz-label">                  快捷键唤起编辑器<span class="key-shadow">></span>                  (<span class="key-shadow">Shift</span>+<span class="key-shadow">.</span>)</span><input class="ctz-i" name="hotKey" type="checkbox" value="on" /></label></div><div><div class="ctz-label">全局修改网页标题</div><div class="ctz-flex-wrap"><input type="text" name="globalTitle" style="width: 250px" /><button class="ctz-button" name="buttonConfirmTitle" style="margin: 0 4px">确认</button><button class="ctz-button" name="buttonResetTitle">还原</button></div></div><div><div class="ctz-label">全局修改网页标题图片（图标可能会因为网络问题丢失）</div><div class="ctz-flex-wrap" id="CTZ_TITLE_ICO"></div></div><div><div class="ctz-flex-wrap"><div class="ctz-label">回答和文章图片尺寸</div><label><input class="ctz-i" name="zoomImageType" type="radio" value="0" />默认</label><label><input class="ctz-i" name="zoomImageType" type="radio" value="1" />原图</label><label><input class="ctz-i" name="zoomImageType" type="radio" value="2" />自定义</label></div><div id="CTZ_IMAGE_SIZE_CUSTOM" style="display: none"><div class="ctz-flex-wrap"><div class="ctz-label">自定义图片尺寸</div><input class="ctz-i" type="range" min="0" max="1000" name="zoomImageSize" style="width: 300px" /><span id="zoomImageSize" style="margin-left: 8px">0</span></div><div class="ctz-commit">滚动条范围: 0 ~ 1000</div></div></div><div class="ctz-flex-wrap"><span class="ctz-label">使用弹窗打开动图</span><input class="ctz-i" name="showGIFinDialog" type="checkbox" value="on" /></div></div></div><div id="CTZ_SET_BASIS_FLOAT"><div class="ctz-set-title"><span>悬浮模块</span></div><div class="ctz-set-content"><div class="ctz-flex-wrap"><label><span class="ctz-label">回答内容「收起」按钮悬浮</span><input class="ctz-i" name="suspensionPickUp" type="checkbox" value="on" /></label></div><div><div class="ctz-label">信息模块悬浮</div><div class="ctz-commit">拖动悬浮模块定位位置</div><div class="ctz-commit">鼠标放置显示解锁按钮解锁即可拖动<i class="ctz-icon" style="margin-left: 4px">&#xe688;</i></div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="suspensionHomeTab" type="checkbox" value="on" />                  首页列表切换</label><label><input class="ctz-i" name="suspensionFind" type="checkbox" value="on" />                  顶部发现模块</label><label><input class="ctz-i" name="suspensionUser" type="checkbox" value="on" />                  个人中心模块</label><label><input class="ctz-i" name="suspensionSearch" type="checkbox" value="on" />                  搜索栏模块</label></div></div></div></div><div id="CTZ_SET_BASIS_BLOCK"><div class="ctz-set-title"><span>黑名单设置</span></div><div class="ctz-set-content"><button id="CTZ-BUTTON-SYNC-BLOCK" name="syncBlack" class="ctz-button">同步黑名单</button><div class="ctz-flex-wrap"><label><span class="ctz-label">回答列表用户名后显示「屏蔽用户」按钮</span><input class="ctz-i" name="showBlockUser" type="checkbox" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">屏蔽黑名单用户发布的内容</span><input class="ctz-i" name="removeBlockUserContent" type="checkbox" value="on" /></label></div><div><div class="ctz-label">黑名单列表</div><div id="CTZ-BLOCK-LIST"></div></div></div></div><div id="CTZ_SET_BASIS_HIDDEN"><div class="ctz-set-title"><span>通用模块隐藏<span class="ctz-desc">勾选隐藏相应模块内容</span></span></div><div class="ctz-set-content ctz-flex-wrap"></div></div><div id="CTZ_SET_BASIS_COLOR"><div class="ctz-set-title"><span>颜色设置</span></div><div class="ctz-set-content"><div class="ctz-set-background"><div id="CTZ_BACKGROUND"></div></div></div></div><div id="CTZ_SET_BASIS_CONFIG"><div class="ctz-set-title"><span>配置操作</span></div><div class="ctz-set-content"><div class="ctz-flex-wrap"><button class="ctz-button" name="useSimple">启用极简模式</button></div><div class="ctz-config-import-export"><div class="ctz-label">配置导出导入</div><div class="ctz-config-buttons"><button class="ctz-button" name="configExport">导出配置</button><button class="ctz-button" name="configReset">恢复默认配置</button></div><div class="ctz-content"><textarea name="textConfigImport" placeholder="配置可参考导出格式"></textarea><button class="ctz-button" name="configImport">导 入</button></div></div><div class="ctz-customize-css"><div class="ctz-label">自定义样式</div><div class="ctz-content"><textarea name="textStyleCustom" placeholder="格式为CSS"></textarea><button class="ctz-button" name="styleCustom">确 定</button></div></div></div></div><div id="CTZ_SET_BASIS_MORE"><div class="ctz-set-title"><span>默认功能<span class="ctz-desc">此部分功能为编辑器默认功能，不需要额外开启</span></span></div><div class="ctz-set-content"><div id="CTZ_DEFAULT_SELF"></div><div class="ctz-zhihu-self"><div class="ctz-zhihu-key"><div>                  更加方便的浏览，按<span class="key-shadow">?</span>                  （<span class="key-shadow">Shift</span>+<span class="key-shadow">/</span>） 查看所有快捷键</div><a href="/settings/preference" target="_blank">前往开启快捷键功能</a></div></div></div></div></div></div><div id="CTZ_SET_LIST" style="display: none"><div class="ctz-content-left"><a href="#CTZ_SET_LIST_DEFAULT">基础设置</a><a href="#CTZ_SET_LIST_FILTER">屏蔽内容</a><a href="#CTZ_SET_LIST_HIDDEN">隐藏模块</a></div><div class="ctz-content-right"><div id="CTZ_SET_LIST_DEFAULT"><div class="ctz-set-title"><span>基础设置</span></div><div class="ctz-set-content"><div><div class="ctz-flex-wrap"><div class="ctz-label">列表版心宽度</div><input class="ctz-i" type="range" min="600" max="1500" name="versionHome" style="width: 300px" /><span id="versionHome" style="margin-left: 8px">0</span></div><div class="ctz-commit">滚动条范围: 600 ~ 1500</div></div><div class="ctz-flex-wrap"><label><span class="ctz-label">                  内容标题添加类别显示<span class="ctz-label-tag ctz-label-tag-Answer">问答</span><span class="ctz-label-tag ctz-label-tag-Article">文章</span><span class="ctz-label-tag ctz-label-tag-ZVideo">视频</span></span><input class="ctz-i" name="questionTitleTag" type="checkbox" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">推荐列表显示「不感兴趣」按钮</span><input class="ctz-i" name="listOutPutNotInterested" type="checkbox" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">列表更多「···」按钮移动到题目右侧</span><input class="ctz-i" name="fixedListItemMore" type="checkbox" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">关注列表高亮原创内容</span><input type="checkbox" name="highlightOriginal" class="ctz-i" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">列表内容点击高亮边框</span><input type="checkbox" name="highlightListItem" class="ctz-i" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">列表内容显示发布时间和最后修改时间</span><input type="checkbox" name="listItemCreatedAndModifiedTime" class="ctz-i" value="on" /></label></div><div class="ctz-flex-wrap"><span class="ctz-label">列表内容标准文字大小</span><input type="number" name="fontSizeForList" class="ctz-i-change" /></div><div><div class="ctz-flex-wrap"><div class="ctz-label">列表视频回答内容尺寸</div><label><input class="ctz-i" name="zoomListVideoType" type="radio" value="0" />默认</label><label><input class="ctz-i" name="zoomListVideoType" type="radio" value="2" />自定义</label></div><div id="CTZ_LIST_VIDEO_SIZE_CUSTOM"><div class="ctz-flex-wrap"><input class="ctz-i" type="range" min="0" max="1000" name="zoomListVideoSize" style="width: 300px" /><span id="zoomListVideoSize" style="margin-left: 8px">0</span></div><div class="ctz-commit">滚动条范围: 0 ~ 1000</div></div></div></div></div><div id="CTZ_SET_LIST_FILTER" class="ctz-filter-block"><div class="ctz-set-title"><span>屏蔽内容<span class="ctz-desc" style="color: red">此部分更改后请重新刷新页面</span></span></div><div class="ctz-set-content"><div class="ctz-filter-follow"><div class="ctz-label">关注列表关注人操作屏蔽</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeFollowVoteAnswer" type="checkbox" value="on" />赞同回答</label><label><input class="ctz-i" name="removeFollowVoteArticle" type="checkbox" value="on" />赞同文章</label><label><input class="ctz-i" name="removeFollowFQuestion" type="checkbox" value="on" />关注问题</label></div></div><div class="ctz-filter-me"><label style="display: flex; align-items: center"><span class="ctz-label">关注列表屏蔽自己的操作</span><input class="ctz-i" name="removeMyOperateAtFollow" type="checkbox" value="on" /></label></div><div class="ctz-filter-type"><div class="ctz-label">列表类别屏蔽</div><div class="ctz-commit" style="line-height: 22px">勾选后「关注、推荐、搜索」将屏蔽所勾选的类别内容</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeItemQuestionAsk" type="checkbox" value="on" />邀请回答</label><label><input class="ctz-i" name="removeItemAboutAD" type="checkbox" value="on" />商业推广</label><label><input class="ctz-i" name="removeItemAboutArticle" type="checkbox" value="on" />文章</label><label><input class="ctz-i" name="removeItemAboutVideo" type="checkbox" value="on" />视频</label></div></div><div class="ctz-filter-list-vote"><label style="display: flex; align-items: center"><span class="ctz-label">列表低赞内容屏蔽</span><input class="ctz-i" name="removeLessVote" type="checkbox" value="on" /></label><div style="font-size: 12px; color: #999; line-height: 22px">                勾选后「关注、推荐、搜索」列表屏蔽点赞量少于<input name="lessVoteNumber" class="ctz-i-change" type="number" style="width: 50px" />                的内容</div></div><div class="ctz-filter-word"><div class="ctz-label">列表屏蔽词，[关注、推荐]将屏蔽包含题目屏蔽词的内容</div><input name="inputFilterWord" type="text" placeholder="输入后回车或失去焦点（不区分大小写）" /><div id="CTZ_FILTER_WORDS"></div></div></div></div><div id="CTZ_SET_LIST_HIDDEN"><div class="ctz-set-title"><span>隐藏模块<span class="ctz-desc">勾选隐藏相应模块内容</span></span></div><div class="ctz-set-content ctz-flex-wrap"></div></div></div></div><div id="CTZ_SET_ANSWER" style="display: none"><div class="ctz-content-left"><a href="#CTZ_SET_ANSWER_DEFAULT">基础设置</a><a href="#CTZ_SET_ANSWER_FILTER">屏蔽内容</a><a href="#CTZ_SET_ANSWER_HIDDEN">隐藏模块</a><a href="#CTZ_SET_ANSWER_OPEN">回答展开收起</a></div><div class="ctz-content-right"><div id="CTZ_SET_ANSWER_DEFAULT"><div class="ctz-set-title"><span>基础设置</span></div><div class="ctz-set-content"><div><div class="ctz-flex-wrap"><div class="ctz-label">回答版心宽度</div><input class="ctz-i" type="range" min="600" max="1500" name="versionAnswer" style="width: 300px" /><span id="versionAnswer" style="margin-left: 8px">0</span></div><div class="ctz-commit">滚动条范围: 600 ~ 1500</div></div><div class="ctz-flex-wrap"><label><span class="ctz-label">问题详情显示创建时间和最后修改时间</span><input type="checkbox" name="questionCreatedAndModifiedTime" class="ctz-i" value="on" /></label></div><div class="ctz-flex-wrap"><label><span class="ctz-label">回答内容显示创建时间与最后修改时间</span><input type="checkbox" name="answerItemCreatedAndModifiedTime" class="ctz-i" value="on" /></label></div><div class="ctz-flex-wrap"><span class="ctz-label">购物链接显示设置</span><label><input class="ctz-i" name="linkShopping" type="radio" value="0" />默认</label><label><input class="ctz-i" name="linkShopping" type="radio" value="1" />仅文字</label><label><input class="ctz-i" name="linkShopping" type="radio" value="2" />隐藏</label></div><div class="ctz-flex-wrap"><span class="ctz-label">回答视频显示设置</span><label><input class="ctz-i" name="linkAnswerVideo" type="radio" value="0" />默认</label><label><input class="ctz-i" name="linkAnswerVideo" type="radio" value="1" />仅链接</label><label><input class="ctz-i" name="linkAnswerVideo" type="radio" value="2" />隐藏</label></div><div class="ctz-flex-wrap"><span class="ctz-label">回答内容标准文字大小</span><input type="number" name="fontSizeForAnswer" class="ctz-i-change" /></div></div></div><div id="CTZ_SET_ANSWER_FILTER" class="ctz-filter-block"><div class="ctz-set-title"><span>屏蔽内容<span class="ctz-desc" style="color: red">此部分更改后请重新刷新页面</span></span></div><div class="ctz-set-content"><div class="ctz-filter-defail-who"><div class="ctz-label">屏蔽以下官方账号的回答</div><div style="margin-bottom: 8px; border-bottom: 1px solid #ebebeb; padding-bottom: 4px"><label><input class="ctz-i" name="removeZhihuOfficial" type="checkbox" value="on" />所有知乎官方账号</label></div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeStoryAnswer" type="checkbox" value="on" />故事档案局</label><label><input class="ctz-i" name="removeYanxuanAnswer" type="checkbox" value="on" />盐选科普</label><label><input class="ctz-i" name="removeYanxuanRecommend" type="checkbox" value="on" />盐选推荐</label><label><input class="ctz-i" name="removeYanxuanCPRecommend" type="checkbox" value="on" />盐选测评室</label></div></div><div class="ctz-flex-wrap"><label><span class="ctz-label">屏蔽「匿名用户」回答</span><input class="ctz-i" name="removeAnonymousAnswer" type="checkbox" value="on" /></label></div><div class="ctz-filter-defail-tag"><div class="ctz-label">屏蔽带有以下标签的回答</div><div class="ctz-flex-wrap"><label><input class="ctz-i" name="removeFromYanxuan" type="checkbox" value="on" />选自盐选专栏</label><label><input class="ctz-i" name="removeUnrealAnswer" type="checkbox" value="on" />带有虚构创作</label></div></div><div class="ctz-filter-detail-vote"><label style="display: flex; align-items: center"><span class="ctz-label">详情低赞回答屏蔽</span><input class="ctz-i" name="removeLessVoteDetail" type="checkbox" value="on" /></label><div style="font-size: 12px; color: #999; line-height: 22px">                勾选后问题详情页将屏蔽点赞量少于<input name="lessVoteNumberDetail" class="ctz-i-change" type="number" style="width: 50px" />                的回答</div></div></div></div><div id="CTZ_SET_ANSWER_HIDDEN"><div class="ctz-set-title"><span>隐藏模块<span class="ctz-desc">勾选隐藏相应模块内容</span></span></div><div class="ctz-set-content ctz-flex-wrap"></div></div><div id="CTZ_SET_ANSWER_OPEN"><div class="ctz-set-title"><span>回答展开收起</span></div><div class="ctz-set-content ctz-flex-wrap"><label><input class="ctz-i" type="radio" name="answerOpen" value="" />知乎默认</label><label><input class="ctz-i" type="radio" name="answerOpen" value="on" />自动展开所有回答</label><label><input class="ctz-i" type="radio" name="answerOpen" value="off" />默认收起所有长回答</label></div></div></div></div><div id="CTZ_SET_ARTICLE" style="display: none"><div class="ctz-content-left"><a href="#CTZ_SET_ARTICLE_DEFAULT">基础设置</a><a href="#CTZ_SET_ARTICLE_HIDDEN">隐藏模块</a></div><div class="ctz-content-right"><div id="CTZ_SET_ARTICLE_DEFAULT"><div class="ctz-set-title"><span>基础设置</span></div><div class="ctz-set-content"><div><div class="ctz-flex-wrap"><div class="ctz-label">文章版心宽度</div><input class="ctz-i" type="range" min="600" max="1500" name="versionArticle" style="width: 300px" /><span id="versionArticle" style="margin-left: 8px">0</span></div><div class="ctz-commit">滚动条范围: 600 ~ 1500</div></div><div class="ctz-flex-wrap"><label><span class="ctz-label">文章发布时间置顶</span><input type="checkbox" name="articleCreateTimeToTop" class="ctz-i" value="on" /></label></div><div class="ctz-flex-wrap"><span class="ctz-label">文章内容标准文字大小</span><input type="number" name="fontSizeForArticle" class="ctz-i-change" /></div></div></div><div id="CTZ_SET_ARTICLE_HIDDEN"><div class="ctz-set-title"><span>隐藏模块<span class="ctz-desc">勾选隐藏相应模块内容</span></span></div><div class="ctz-set-content ctz-flex-wrap"></div></div></div></div><div id="CTZ_SET_HISTORY" style="display: none"><div class="ctz-content-left"><a href="#CTZ_SET_HISTORY_LIST">推荐列表缓存</a><a href="#CTZ_SET_HISTORY_VIEW">浏览历史记录</a></div><div class="ctz-content-right"><div id="CTZ_SET_HISTORY_LIST"><div class="ctz-set-title"><span>推荐列表缓存<span class="ctz-desc">最多缓存500条，包含已过滤项</span></span></div><button class="ctz-button" name="button_history_clear" data-id="list">清空推荐列表缓存</button><div class="ctz-set-content"></div></div><div id="CTZ_SET_HISTORY_VIEW"><div class="ctz-set-title"><span>浏览历史记录<span class="ctz-desc">最多缓存500条</span></span></div><button class="ctz-button" name="button_history_clear" data-id="view">清空浏览历史记录</button><div class="ctz-set-content"></div></div></div></div></div><div class="ctz-footer"></div></div><div id="CTZ_OPEN_BUTTON" class="ctz-icon">&#xe603;</div><div style="display: none" class="ctz-preview" id="CTZ_PREVIEW_IMAGE"><div><img src="" /></div></div><div style="display: none" class="ctz-preview" id="CTZ_PREVIEW_VIDEO"><div><video src="" autoplay loop></video></div></div><iframe class="ctz-pdf-box-content" style="display: none"></iframe>`;
  const INNER_CSS = `@font-face{font-family:'tp-icon';src:url('//at.alicdn.com/t/c/font_2324733_3w6h6fk5917.woff2?t=1670580424651') format('woff2'),url('//at.alicdn.com/t/c/font_2324733_3w6h6fk5917.woff?t=1670580424651') format('woff'),url('//at.alicdn.com/t/c/font_2324733_3w6h6fk5917.ttf?t=1670580424651') format('truetype')}.hover-style{cursor:pointer}.hover-style:hover{color:#056de8 !important}.ctz-icon{font-family:'tp-icon' !important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-webkit-text-stroke-width:.2px;-moz-osx-font-smoothing:grayscale}#CTZ_OPEN_BUTTON{position:fixed;left:0;top:100px;font-size:18px;height:48px;line-height:48px;text-align:center;width:48px;border-radius:0 8px 8px 0;background:rgba(255,255,255,0.6);cursor:pointer;user-select:none;transform:translate(-30px);transition:transform .5s;z-index:200}#CTZ_OPEN_BUTTON:hover{transform:translate(0)}#CTZ_DIALOG_MAIN{position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);width:500px;height:500px;border-radius:4px;background:#fff;z-index:201;flex-direction:column;font-size:14px;box-shadow:5px 5px 10px #ababab,-5px -5px 10px #ffffff;border:1px solid #ccc}#CTZ_DIALOG_MAIN input[type='text'],#CTZ_DIALOG_MAIN input[type='number']{border-radius:4px}#CTZ_DIALOG_MAIN label{cursor:pointer}#CTZ_DIALOG_MAIN label:hover{color:#056de8 !important}#CTZ_DIALOG_MAIN a{text-decoration:none;color:inherit}.ctz-header{height:28px;line-height:28px;padding:0 8px;text-align:center}.ctz-version{padding-left:8px;font-size:12px}#CTZ_CLOSE_DIALOG{float:right;cursor:pointer}#CTZ_CLOSE_DIALOG:hover{color:#056de8 !important}.ctz-menu-top{height:28px;border-bottom:1px solid #bbb;display:flex}.ctz-menu-top a{flex:1;line-height:28px;text-align:center}.ctz-menu-top a:hover{border-bottom:4px solid #bbb}.ctz-menu-top a.target{border-bottom:4px solid #121212}.ctz-content{flex:1;display:flex;overflow:hidden}.ctz-content>div{width:100%}.ctz-content ::-webkit-scrollbar{width:8px;height:24px;background:#eee}.ctz-content ::-webkit-scrollbar-track{border-radius:0}.ctz-content ::-webkit-scrollbar-thumb{border-radius:0;background:#bbb;transition:all .2s;border-radius:8px}.ctz-content ::-webkit-scrollbar-thumb:hover{background-color:rgba(95,95,95,0.7)}.ctz-content-left{width:100px;border-right:1px solid #bbb}.ctz-content-left a{padding:0 8px;height:32px;line-height:32px;display:flex;font-size:14px}.ctz-content-left a:hover{background:#ededed}.ctz-content-right{flex:1;overflow-y:auto;scroll-behavior:smooth;padding:0 8px}.ctz-content-right>div:nth-of-type(2n){background:#efefef;padding:0 8px;margin:0 -8px}.ctz-content-right>div:nth-of-type(2n) .ctz-set-title>span{background:#efefef}.ctz-set-content>div{padding-bottom:8px;margin-bottom:8px;border-bottom:1px dashed #ddd}.ctz-set-content>div:last-of-type{border-bottom:0}.ctz-footer{height:28px;line-height:28px;padding:0 16px;border-top:1px solid #bbb;font-size:14px;color:rgba(0,0,0,0.65)}.ctz-footer a{margin-right:16px;cursor:pointer}.ctz-footer a:hover{color:#056de8 !important}.ctz-dark{display:flex;height:28px;align-items:center}.ctz-desc,.ctz-commit{color:#666;font-size:12px}.ctz-desc{padding-left:4px}.ctz-label{font-size:14px;line-height:24px;font-weight:bold}.ctz-label::after{content:'：'}.ctz-set-title{font-weight:bold;height:32px;line-height:32px;font-size:16px;overflow:hidden;position:relative}.ctz-set-title::before{content:'----------------------------------------------------------------------';font-weight:normal}.ctz-set-title>span{position:absolute;padding:4px 8px;left:50%;top:50%;transform:translate(-50%, -50%);background:#ffffff;word-break:keep-all;white-space:pre}#CTZ_BACKGROUND{display:grid;grid-template-columns:30% 30% 30%;gap:8px}#CTZ_BACKGROUND label{position:relative}#CTZ_BACKGROUND label input{position:absolute;left:10px;top:18px}#CTZ_BACKGROUND label input:checked+div{border-color:#056de8 !important}#CTZ_BACKGROUND label div{font-size:14px;border-radius:8px;line-height:50px;padding-left:30px}#CTZ_SET_BASIS_CONFIG .ctz-config-buttons{width:80%;margin-bottom:8px;display:grid;grid-template-columns:50% 50%;gap:8px}#CTZ_SET_BASIS_CONFIG .ctz-content{width:80%}#CTZ_SET_BASIS_CONFIG .ctz-content textarea{flex:1;margin-right:8px;border-radius:4px}[name='inputFilterWord']{height:24px;width:300px;border-radius:4px}#CTZ_FILTER_WORDS{display:flex;flex-wrap:wrap;cursor:default}#CTZ_FILTER_WORDS>span{padding:2px 4px;border-radius:2px;font-size:12px;background-color:#999;margin:4px 4px 0 0;color:#fff;display:flex;align-items:center}#CTZ_FILTER_WORDS>span>i{font-size:14px;margin-left:2px;cursor:pointer}#CTZ_FILTER_WORDS>span>i:hover{color:#056de8 !important}.ctz-flex-wrap{display:flex;flex-wrap:wrap}.ctz-flex-wrap label{margin-right:4px;display:flex;align-items:center}.ctz-flex-wrap label input[type='radio']{margin:0 4px 0 0}.ctz-button{padding:4px 8px;font-size:14px;border-radius:2px;background:#ddd;border:1px solid #bbb;text-align:center}.ctz-button:hover{background:#eee}.ctz-not-interested{color:#999;font-size:12px;border:1px solid #999;border-radius:4px;padding:0 4px;margin-left:6px}.ctz-not-interested:hover{border-color:#056de8 !important;color:#056de8 !important}.ctz-video-download,.ctz-loading{position:absolute;top:20px;left:20px;font-size:24px;color:rgba(255,255,255,0.9);cursor:pointer}.ctz-loading{animation:loadingAnimation 2s infinite}@keyframes loadingAnimation{from{transform:rotate(0)}to{transform:rotate(360deg)}}#CTZ-BLOCK-LIST{display:flex;flex-wrap:wrap;margin:0 -8px;padding:8px}.ctz-black-item{height:30px;line-height:30px;box-sizing:content-box;padding:4px;margin:0 8px 8px 0;display:flex;align-items:center;background:#fff;border-radius:4px;border:1px solid #bbb}.ctz-black-item img{width:30px;height:30px;margin-right:4px}.ctz-black-item .ctz-remove-block:hover,.ctz-black-item a:hover{color:#056de8}.ctz-block-box>button,.ctz-button-block{padding:2px 8px;color:#666;border:1px solid #666;border-radius:4px;font-size:12px;margin-left:12px}.ctz-block-box>button:hover,.ctz-button-block:hover{border-color:#0461cf;color:#0461cf}.ctz-button-red{color:#e55353 !important;border:1px solid #e55353 !important}.ctz-button-red:hover{color:#ec7259 !important;border:1px solid #ec7259 !important}.ctz-preview{box-sizing:border-box;position:fixed;height:100%;width:100%;top:0;left:0;overflow-y:auto;z-index:200;background-color:rgba(18,18,18,0.4)}.ctz-preview div{display:flex;justify-content:center;align-items:center;min-height:100%;width:100%}.ctz-preview div img{cursor:zoom-out;user-select:none}#CTZ_TITLE_ICO label{margin:0 4px 4px 0}#CTZ_TITLE_ICO label input{display:none}#CTZ_TITLE_ICO label input:checked+img{border:4px solid #0461cf}#CTZ_TITLE_ICO label img{width:40px;height:40px;border:4px solid transparent}.ctz-label-tag{font-weight:normal;padding:2px 4px;border-radius:4px;font-size:12px;color:#ffffff}.ctz-label-tag-Answer{background:#ec7259}.ctz-label-tag-ZVideo{background:#12c2e9}.ctz-label-tag-Article{background:#00965e}.ctz-question-time{color:#999 !important;font-size:14px !important;font-weight:normal !important;line-height:24px}.ctz-stop-scroll{height:100% !important;overflow:hidden !important}#CTZ_DEFAULT_SELF>div{line-height:24px;margin-bottom:4px}#CTZ_DEFAULT_SELF>div a{color:#056de8}#CTZ_DEFAULT_SELF>div a:hover{color:#bbb}.ctz-export-collection-box{float:right;text-align:right}.ctz-export-collection-box button{font-size:16px}.ctz-export-collection-box p{font-size:14px;color:#666;margin:4px 0}.ctz-pdf-dialog-item{padding:12px;border-bottom:1px solid #eee;margin:12px;background:#ffffff}.ctz-pdf-dialog-title{margin:0 0 1.4em;font-size:20px;font-weight:bold}.ctz-pdf-box-content{width:100%;background:#ffffff}.ctz-pdf-view{width:100%;background:#ffffff;word-break:break-all;white-space:pre-wrap;font-size:14px;overflow-x:hidden}.ctz-pdf-view a{color:#0066ff}.ctz-pdf-view img{max-width:100%}.ctz-pdf-view p{margin:1.4em 0}.ctz-unlock,.ctz-lock,.ctz-lock-mask{display:none;color:#999;cursor:pointer}.ctz-unlock,.ctz-lock{margin:4px}.ctz-lock-mask{position:absolute;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:198}.position-suspensionSearch,.position-suspensionFind,.position-suspensionUser{position:fixed;z-index:100}.position-suspensionSearch:hover .ctz-unlock,.position-suspensionFind:hover .ctz-unlock,.position-suspensionUser:hover .ctz-unlock,.Topstory-container .TopstoryTabs:hover .ctz-unlock{display:block}.position-suspensionSearch.ctz-move-this .ctz-unlock,.position-suspensionFind.ctz-move-this .ctz-unlock,.position-suspensionUser.ctz-move-this .ctz-unlock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-unlock{display:none !important}.position-suspensionSearch.ctz-move-this .ctz-lock,.position-suspensionFind.ctz-move-this .ctz-lock,.position-suspensionUser.ctz-move-this .ctz-lock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock,.position-suspensionSearch.ctz-move-this .ctz-lock-mask,.position-suspensionFind.ctz-move-this .ctz-lock-mask,.position-suspensionUser.ctz-move-this .ctz-lock-mask,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock-mask{display:block}.position-suspensionSearch.ctz-move-this .ctz-lock,.position-suspensionFind.ctz-move-this .ctz-lock,.position-suspensionUser.ctz-move-this .ctz-lock,.Topstory-container .TopstoryTabs.ctz-move-this .ctz-lock{z-index:199;color:#cccccc}.position-suspensionFind{display:flex;flex-direction:column;margin:0 !important}.position-suspensionFind .Tabs-item{padding:0 !important;margin-bottom:4px}.position-suspensionFind .Tabs-item .Tabs-link{padding:8px !important;border-radius:4px}.position-suspensionFind .Tabs-item .Tabs-link::after{content:'' !important;display:none !important}.position-suspensionUser{width:fit-content !important;margin:0 !important;display:flex;flex-direction:column}.position-suspensionUser .AppHeader-messages,.position-suspensionUser .AppHeader-notifications{margin-right:0 !important;margin-bottom:12px}.position-suspensionUser .AppHeader-login,.position-suspensionUser .AppHeader-login~button{display:none}.SearchBar{flex:1}.position-suspensionSearch{line-height:30px;border-radius:16px;width:20px;transition:width .5s}.position-suspensionSearch .SearchBar-input-focus .ctz-search-pick-up{display:none}.position-suspensionSearch.focus{width:300px}.position-suspensionSearch.focus>form,.position-suspensionSearch.focus>button,.position-suspensionSearch.focus .ctz-search-pick-up{display:block}.position-suspensionSearch.focus .ctz-search-icon{display:none}.position-suspensionSearch.focus:hover{width:324px}.position-suspensionSearch .ctz-search-icon,.position-suspensionSearch .ctz-search-pick-up{cursor:pointer;color:#0066ff}.position-suspensionSearch .ctz-search-icon:hover,.position-suspensionSearch .ctz-search-pick-up:hover{color:#005ce6}.position-suspensionSearch .ctz-search-pick-up{font-size:24px;margin-left:4px}.position-suspensionSearch>form,.position-suspensionSearch>button,.position-suspensionSearch .ctz-search-pick-up{display:none}.position-suspensionSearch .ctz-search-icon{display:block}.key-shadow{border:1px solid #eee;border-radius:4px;box-shadow:rgba(0,0,0,0.06) 0 1px 1px 0;font-weight:600;min-width:26px;height:26px;padding:0px 6px;text-align:center}.ctz-zhihu-key a{color:#056de8}.ctz-zhihu-key a:hover{color:#bbb}.ContentItem-title div{display:inline}#CTZ_SET_HISTORY_LIST .ctz-set-content,#CTZ_SET_HISTORY_VIEW .ctz-set-content{word-break:break-all}#CTZ_SET_HISTORY_LIST .ctz-set-content a,#CTZ_SET_HISTORY_VIEW .ctz-set-content a{cursor:pointer}#CTZ_SET_HISTORY_LIST .ctz-set-content a:hover,#CTZ_SET_HISTORY_VIEW .ctz-set-content a:hover{color:#056de8 !important}#CTZ-BUTTON-SYNC-BLOCK{height:30px;width:88px;position:relative}#CTZ-BUTTON-SYNC-BLOCK i{top:2px;left:28px}`;
  const T0 = performance.now();

  const { pathname, hostname, host, origin, search, hash, href } = location;
  const PATHNAME_FOR_PHONE_QUESTION = '/tardis/sogou/qus/';
  const PATHNAME_FOR_PHONE_ART = '/tardis/zm/art/';
  // 重定向页面
  if (pathname.includes(PATHNAME_FOR_PHONE_QUESTION)) {
    const questionId = pathname.replace(PATHNAME_FOR_PHONE_QUESTION, '');
    location.href = origin + '/question/' + questionId;
    return;
  }

  if (pathname.includes(PATHNAME_FOR_PHONE_ART)) {
    const questionId = pathname.replace(PATHNAME_FOR_PHONE_ART, '');
    location.href = 'https://zhuanlan.zhihu.com/p/' + questionId;
    return;
  }

  /** 获取元素 */
  const dom = (n) => document.querySelector(n);
  /** 使用 Id 获取元素 */
  const domById = (id) => document.getElementById(id);
  /** 获取所有元素 */
  const domA = (n) => document.querySelectorAll(n);
  /** 创建元素 */
  const domC = (name, attrObjs) => {
    const node = document.createElement(name);
    for (let key in attrObjs) {
      node[key] = attrObjs[key];
    }
    return node;
  };
  /** 查找父级元素 */
  const domP = (node, attrName, attrValue) => {
    const nodeP = node.parentElement;
    if (!attrName || !attrValue) {
      return nodeP;
    }
    if (nodeP === document.body) {
      return undefined;
    }
    const attrValueList = (nodeP.getAttribute(attrName) || '').split(' ');
    return attrValueList.includes(attrValue) ? nodeP : domP(nodeP, attrName, attrValue);
  };
  /** 判断是否返回空字符串 */
  const fnReturnStr = (str, isHave = false, strFalse = '') => (isHave ? str : strFalse);
  /** 带前缀的 log */
  const fnLog = (...str) => console.log('%c「修改器」', 'color: green;font-weight: bold;', ...str);
  /** 注入样式文件的方法 */
  const fnInitDomStyle = (id, innerHTML) => {
    const element = domById(id);
    element ? (element.innerHTML = innerHTML) : document.head.appendChild(domC('style', { id, type: 'text/css', innerHTML }));
  };
  /** 元素替换内容 */
  const fnDomReplace = (node, attrObjs) => {
    if (!node) return;
    for (let key in attrObjs) {
      node[key] = attrObjs[key];
    }
  };

  const HTML_HOOTS = ['www.zhihu.com', 'zhuanlan.zhihu.com'];
  /** 设置弹窗 */
  const ID_DIALOG = 'CTZ_DIALOG_MAIN';
  /** 屏蔽词 ID */
  const ID_FILTER_WORDS = 'CTZ_FILTER_WORDS';
  /** 黑名单列表 ID */
  const ID_BLOCK_LIST = 'CTZ-BLOCK-LIST';
  /** 同步黑名单 按钮 ID */
  const ID_BUTTON_SYNC_BLOCK = 'CTZ-BUTTON-SYNC-BLOCK';
  /** INPUT 点击元素类名 */
  const CLASS_INPUT_CLICK = 'ctz-i';
  /** INPUT 修改操作元素类名 */
  const CLASS_INPUT_CHANGE = 'ctz-i-change';
  /** 黑名单元素删除按钮类名 */
  const CLASS_REMOVE_BLOCK = 'ctz-remove-block';
  /** 不感兴趣外置按钮 */
  const CLASS_NOT_INTERESTED = 'ctz-not-interested';

  /** 回答收起展开插入的类名 */
  const OB_CLASS_FOLD = {
    on: 'ctz-fold-open',
    off: 'ctz-fold-close',
  };

  /** 背景色设置 */
  const BACKGROUND_CONFIG = {
    '#ffffff': { name: '默认', opacity: '', color: '#333' },
    '#ffe4c4': { name: '护眼红', opacity: '#fff4e7', color: '#333' },
    '#FAF9DE': { name: '杏仁黄', opacity: '#fdfdf2', color: '#333' },
    '#cce8cf': { name: '青草绿', opacity: '#e5f1e7', color: '#333' },
    '#EAEAEF': { name: '极光灰', opacity: '#f3f3f5', color: '#333' },
    '#E9EBFE': { name: '葛巾紫', opacity: '#f2f3fb', color: '#333' },
    '#121212': { name: '夜间模式', opacity: '', color: '#ffffff' },
    '#1f1f1f': { name: '夜间护眼一', opacity: '', color: '#f7f9f9' },
    '#15202b': { name: '夜间护眼二', opacity: '', color: '#f7f9f9' },
    '#272822': { name: '夜间护眼三', opacity: '', color: '#f7f9f9' },
  };

  const BACKGROUND_DARK_COLORS = {
    '#121212': { b2: '#333333', t1: '#fff', t2: '#999' },
    '#15202b': { b2: '#38444d', t1: '#f7f9f9', t2: '#161d23' },
    '#1f1f1f': { b2: '#303030', t1: '#f7f9f9', t2: '#161d23' },
    '#272822': { b2: '#383932', t1: '#f7f9f9', t2: '#161d23' },
  };

  const FOOTER_HTML =
    `<a href="https://github.com/superPufferfish/custom-zhihu" target="_blank">Github⭐</a>` +
    `<a href="https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8" target="_blank">GreasyFork</a>`;

  /** 隐藏内容模块默认配置 */
  const CONFIG_HIDDEN_DEFAULT = {
    /** 隐藏回答页面右侧内容 */
    hiddenAnswerRightFooter: true,
    /** 隐藏回答下方悬浮操作条 */
    hiddenFixedActions: false,
    /** 隐藏logo */
    hiddenLogo: false,
    /** 隐藏header */
    hiddenHeader: false,
    /** 隐藏顶部滚动header */
    hiddenHeaderScroll: false,
    /** 隐藏列表回答操作 */
    hiddenItemActions: false,
    /** 隐藏回答操作文字 */
    hiddenAnswerText: false,
    /** 隐藏问题分享 */
    hiddenQuestionShare: false,
    /** 隐藏问题话题 */
    hiddenQuestionTag: false,
    /** 隐藏问题操作栏 */
    hiddenQuestionActions: false,
    /** 隐藏赞赏按钮 */
    hiddenReward: false,
    /** 隐藏专栏关联话题 */
    hiddenZhuanlanTag: false,
    /** 隐藏问题列表图片 */
    hiddenListImg: false,
    /** 隐藏阅读全文文字 */
    hiddenReadMoreText: true,
    /** 隐藏广告 */
    hiddenAD: true,
    /** 隐藏问题列表回答内容 */
    hiddenAnswers: false,
    /** 隐藏专栏下方操作条 */
    hiddenZhuanlanActions: false,
    /** 隐藏专栏标题图片 */
    hiddenZhuanlanTitleImage: false,
    /** 隐藏热门热度值 */
    hiddenHotItemMetrics: false,
    /** 隐藏热门排序 */
    hiddenHotItemIndex: false,
    /** 热门"新"隐藏元素 */
    hiddenHotItemLabel: false,
    /** 隐藏详情回答人头像 */
    hiddenDetailAvatar: false,
    /** 隐藏详情回答人简介 */
    hiddenDetailBadge: false,
    /** 隐藏详情回答人下赞同数 */
    hiddenDetailVoters: false,
    /** 隐藏详情回答人姓名 */
    hiddenDetailName: false,
    /** 隐藏详情回答人关注按钮 */
    hiddenDetailFollow: true,
    /** 隐藏首页问题列表切换模块 */
    hiddenHomeTab: false,
    /** 隐藏问题关注和被浏览数 */
    hiddenQuestionSide: false,
    /** 隐藏关注问题按钮 */
    hiddenQuestionFollowing: false,
    /** 隐藏写回答按钮 */
    hiddenQuestionAnswer: false,
    /** 隐藏邀请回答按钮 */
    hiddenQuestionInvite: false,
    /** 隐藏搜索栏知乎热搜 */
    hiddenSearchBoxTopSearch: false,
    /** 隐藏搜索页知乎热搜 */
    hiddenSearchPageTopSearch: false,
    /** 隐藏搜索页知乎指南 */
    hiddenSearchPageFooter: false,
    /** 隐藏专栏悬浮分享按钮 */
    hiddenZhuanlanShare: false,
    /** 隐藏专栏悬浮赞同按钮 */
    hiddenZhuanlanVoters: false,
    /** 列表[亲自答]隐藏标签 */
    hiddenListAnswerInPerson: false,
    /** 隐藏关注列表关注人操作栏 */
    hiddenFollowAction: false,
    /** 隐藏关注列表用户信息 */
    hiddenFollowChooseUser: false,
    /** 隐藏信息栏关于作者 */
    hiddenAnswerRightFooterAnswerAuthor: false,
    /** 隐藏信息栏被收藏次数 */
    hiddenAnswerRightFooterFavorites: false,
    /** 隐藏信息栏相关问题 */
    hiddenAnswerRightFooterRelatedQuestions: false,
    /** 隐藏信息栏相关推荐 */
    hiddenAnswerRightFooterContentList: false,
    /** 隐藏信息栏知乎指南 */
    hiddenAnswerRightFooterFooter: false,
    /** 隐藏618红包链接（临时补充） */
    hidden618HongBao: true,
    /** 隐藏文章作者关注按钮 */
    hiddenZhuanlanFollowButton: false,
    /** 隐藏文章作者头像 */
    hiddenZhuanlanAvatarWrapper: false,
    /** 隐藏文章作者姓名 */
    hiddenZhuanlanAuthorInfoHead: false,
    /** 隐藏文章作者简介 */
    hiddenZhuanlanAuthorInfoDetail: false,
    /** 隐藏详情顶部专题收录标签 */
    hiddenQuestionSpecial: false,
    /** 隐藏列表视频回答的内容 */
    hiddenListVideoContent: false,
    /** 隐藏主页创作中心 */
    hiddenHomeCreatorEntrance: false,
    /** 隐藏主页推荐关注 */
    hiddenHomeRecommendFollow: false,
    /** 隐藏主页分类圆桌 */
    hiddenHomeCategory: false,
    /** 隐藏主页更多分类 */
    hiddenHomeCategoryMore: false,
    /** 隐藏主页知乎指南 */
    hiddenHomeFooter: false,
    /** 隐藏回答内容操作栏 */
    hiddenAnswerItemActions: false,
    /** 隐藏回答下方发布编辑时间 */
    hiddenAnswerItemTime: false,
    /** 发现模块-隐藏首页 */
    hiddenAppHeaderTabHome: false,
    /** 发现模块-隐藏知学堂 */
    hiddenAppHeaderTabZhi: false,
    /** 发现模块-隐藏会员 */
    hiddenAppHeaderTabVIP: false,
    /** 发现模块-隐藏发现 */
    hiddenAppHeaderTabFind: false,
    /** 发现模块-隐藏等你来答 */
    hiddenAppHeaderTabWaitingForYou: false,
    /** 隐藏全部问题列表切换模块 */
    hiddenHomeListTab: false,
    /** 问题列表切换 - 隐藏关注 */
    hiddenHomeListTabFollow: false,
    /** 问题列表切换 - 隐藏推荐 */
    hiddenHomeListTabRecommend: false,
    /** 问题列表切换 - 隐藏热榜 */
    hiddenHomeListTabHot: false,
    /** 问题列表切换 - 隐藏视频 */
    hiddenHomeListTabVideo: false,
    /** 隐藏「好问题」按钮 */
    hiddenQuestionGoodQuestion: false,
    /** 隐藏添加评论按钮 */
    hiddenQuestionComment: false,
    /** 问题「...隐藏」按钮 */
    hiddenQuestionMore: false,
    /** 隐藏不显示修改器唤醒图标 */
    hiddenOpenButton: false,
    /** 回答操作 - 赞同按钮仅显示赞同数 */
    justVoteNum: false,
    /** 回答操作 - 评论按钮仅显示评论数 */
    justCommitNum: false,
  };

  /** 屏蔽内容模块默认配置 */
  const CONFIG_FILTER_DEFAULT = {
    /** 屏蔽知乎官方账号回答 */
    removeZhihuOfficial: false,
    /** 屏蔽故事档案局回答 */
    removeStoryAnswer: true,
    /** 屏蔽盐选科普回答 */
    removeYanxuanAnswer: true,
    /** 屏蔽盐选推荐 */
    removeYanxuanRecommend: true,
    /** 屏蔽盐选测评室 */
    removeYanxuanCPRecommend: true,
    /** 屏蔽选自盐选专栏的回答 */
    removeFromYanxuan: true,
    /** 屏蔽带有虚构内容的回答 */
    removeUnrealAnswer: false,
    /** 屏蔽关注人赞同回答 */
    removeFollowVoteAnswer: false,
    /** 屏蔽关注人赞同文章 */
    removeFollowVoteArticle: false,
    /** 屏蔽关注人关注问题 */
    removeFollowFQuestion: false,
    /** 屏蔽不再显示黑名单用户发布的内容 */
    removeBlockUserContent: true,
    /** 屏蔽已屏蔽用户列表 */
    removeBlockUserContentList: [],
    /** 屏蔽商业推广 */
    removeItemAboutAD: false,
    /** 屏蔽文章 */
    removeItemAboutArticle: false,
    /** 屏蔽视频 */
    removeItemAboutVideo: false,
    /** 屏蔽列表提问 */
    removeItemQuestionAsk: false,
    /** 关注列表过滤低于以下赞的内容 */
    removeLessVote: false,
    /** 关注列表过滤低于以下赞的内容 */
    lessVoteNumber: 100,
    /** 回答低赞内容屏蔽 */
    removeLessVoteDetail: false,
    /** 回答详情屏蔽以下赞的内容 */
    lessVoteNumberDetail: 100,
    /** 屏蔽匿名用户回答 */
    removeAnonymousAnswer: false,
    /** 关注列表屏蔽自己的操作 */
    removeMyOperateAtFollow: false,
  };

  /** 悬浮模块默认配置 */
  const CONFIG_SUSPENSION = {
    suspensionHomeTab: false, // 问题列表切换
    suspensionHomeTabPo: 'left: 20px; top: 100px;', // 定位
    suspensionHomeTabFixed: true,
    suspensionFind: false, // 顶部发现模块
    suspensionFindPo: 'left: 10px; top: 380px;',
    suspensionFindFixed: true,
    suspensionSearch: false, // 搜索栏
    suspensionSearchPo: 'left: 10px; top: 400px;',
    suspensionSearchFixed: true,
    suspensionUser: false, // 个人中心
    suspensionUserPo: 'right: 60px; top: 100px;',
    suspensionUserFixed: true,
    suspensionPickUp: true, // 长回答和列表收起按钮
  };

  /** 极简模式配置 */
  const CONFIG_SIMPLE = {
    hiddenAnswerRightFooter: true,
    hiddenFixedActions: true,
    hiddenLogo: true,
    hiddenHeader: true,
    hiddenHeaderScroll: true,
    hiddenItemActions: true,
    hiddenAnswerText: true,
    hiddenQuestionShare: true,
    hiddenQuestionTag: true,
    hiddenQuestionActions: true,
    hiddenReward: true,
    hiddenZhuanlanTag: true,
    hiddenListImg: true,
    hiddenReadMoreText: true,
    hiddenAD: true,
    hiddenAnswers: true,
    hiddenZhuanlanActions: true,
    hiddenZhuanlanTitleImage: true,
    hiddenHotItemMetrics: true,
    hiddenHotItemIndex: true,
    hiddenHotItemLabel: true,
    hiddenDetailAvatar: true,
    hiddenDetailBadge: true,
    hiddenDetailVoters: true,
    hiddenDetailName: true,
    hiddenDetailFollow: true,
    hiddenHomeTab: false,
    hiddenQuestionSide: true,
    hiddenQuestionFollowing: true,
    hiddenQuestionAnswer: true,
    hiddenQuestionInvite: true,
    hiddenSearchBoxTopSearch: true,
    hiddenSearchPageTopSearch: true,
    hiddenSearchPageFooter: true,
    hiddenZhuanlanShare: true,
    hiddenZhuanlanVoters: true,
    hiddenListAnswerInPerson: true,
    hiddenFollowAction: true,
    hiddenFollowChooseUser: true,
    hidden618HongBao: true,
    hiddenZhuanlanFollowButton: true,
    hiddenZhuanlanAvatarWrapper: true,
    hiddenZhuanlanAuthorInfoHead: true,
    hiddenZhuanlanAuthorInfoDetail: true,
    hiddenQuestionSpecial: true,
    hiddenListVideoContent: true,
    hiddenHomeCreatorEntrance: true,
    hiddenHomeRecommendFollow: true,
    hiddenHomeCategory: true,
    hiddenHomeCategoryMore: true,
    hiddenHomeFooter: true,
    removeZhihuOfficial: false,
    removeStoryAnswer: true,
    removeYanxuanAnswer: true,
    removeYanxuanRecommend: true,
    removeYanxuanCPRecommend: true,
    removeFromYanxuan: true,
    removeUnrealAnswer: false,
    removeFollowVoteAnswer: false,
    removeFollowVoteArticle: false,
    removeFollowFQuestion: false,
    removeBlockUserContent: true,
    removeItemAboutAD: false,
    removeItemAboutArticle: false,
    removeItemAboutVideo: false,
    removeItemQuestionAsk: false,
    removeLessVote: false,
    lessVoteNumber: 100,
    removeLessVoteDetail: false,
    lessVoteNumberDetail: 100,
    suspensionHomeTab: false,
    suspensionHomeTabPo: 'left: 20px; top: 100px;',
    suspensionHomeTabFixed: true,
    suspensionFind: false,
    suspensionFindPo: 'left: 10px; top: 380px;',
    suspensionFindFixed: true,
    suspensionSearch: true,
    suspensionSearchPo: 'left: 10px; top: 400px;',
    suspensionSearchFixed: true,
    suspensionUser: true,
    suspensionUserPo: 'right: 60px; top: 100px;',
    suspensionUserFixed: true,
    suspensionPickUp: true,
    answerOpen: 'off',
    showBlockUser: false,
    zoomImageType: '2',
    zoomImageSize: '200',
    showGIFinDialog: true,
    questionTitleTag: true,
    listOutPutNotInterested: true,
    fixedListItemMore: true,
    highlightOriginal: true,
    highlightListItem: true,
    listItemCreatedAndModifiedTime: true,
    answerItemCreatedAndModifiedTime: true,
    questionCreatedAndModifiedTime: true,
    articleCreateTimeToTop: true,
    linkShopping: '1',
    linkAnswerVideo: '1',
    hiddenAnswerItemActions: true,
    hiddenAnswerItemTime: true,
  };

  /** 屏蔽关注列表关注人操作 */
  const FILTER_FOLLOWER_OPERATE = [
    { key: 'removeFollowVoteAnswer', rep: '赞同了回答' },
    { key: 'removeFollowVoteArticle', rep: '赞同了文章' },
    { key: 'removeFollowFQuestion', rep: '关注了问题' },
  ];

  /** 隐藏模块指向 */
  const HIDDEN_DIRECITION = {
    /** 基础设置 */
    CTZ_SET_BASIS: [
      [{ value: 'hiddenAD', label: '广告' }],
      [{ value: 'hiddenTopAD', label: '顶部推广（只能物理隐藏，会存在颜色错误）' }],
      [
        { value: 'hiddenLogo', label: 'logo' },
        { value: 'hiddenHeader', label: '顶部悬浮模块' },
        { value: 'hiddenHeaderScroll', label: '滚动顶部悬浮模块/问题名称' },
      ],
      [
        { value: 'hiddenAppHeaderTabHome', label: '发现模块-首页' },
        { value: 'hiddenAppHeaderTabZhi', label: '发现模块-知学堂' },
        { value: 'hiddenAppHeaderTabVIP', label: '发现模块-会员' },
        { value: 'hiddenAppHeaderTabFind', label: '发现模块-发现' },
        { value: 'hiddenAppHeaderTabWaitingForYou', label: '发现模块-等你来答' },
      ],
      [
        { value: 'hiddenAnswerText', label: '回答操作文字' },
        { value: 'justVoteNum', label: '回答操作 - 赞同按钮仅显示赞同数' },
        { value: 'justCommitNum', label: '回答操作 - 评论按钮仅显示评论数' },
      ],
    ],
    /** 首页列表设置 */
    CTZ_SET_LIST: [
      [
        { value: 'hiddenHomeCreatorEntrance', label: '创作中心' },
        { value: 'hiddenHomeRecommendFollow', label: '推荐关注' },
        { value: 'hiddenHomeCategory', label: '分类圆桌' },
        { value: 'hiddenHomeCategoryMore', label: '更多分类' },
        { value: 'hiddenHomeFooter', label: '知乎指南' },
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
    /** 回答详情设置 */
    CTZ_SET_ANSWER: [
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
        { value: 'hiddenAnswerItemTime', label: '回答底部发布编辑时间' },
        { value: 'hiddenReward', label: '赞赏按钮' },
        { value: 'hidden618HongBao', label: '618红包链接' },
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
    /** 文章专栏设置 */
    CTZ_SET_ARTICLE: [
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
  };

  /** 屏蔽带有标签的回答 */
  const HIDDEN_ANSWER_TAG = {
    removeFromYanxuan: '盐选专栏',
    removeUnrealAnswer: '虚构创作',
  };

  /** 屏蔽账号回答 */
  const HIDDEN_ANSWER_ACCOUNT = {
    removeStoryAnswer: '故事档案局',
    removeYanxuanAnswer: '盐选科普',
    removeYanxuanRecommend: '盐选推荐',
    removeYanxuanCPRecommend: '盐选测评室',
  };

  /** 网页标题图片集合 */
  const ICO_URL = {
    zhihu: 'https://static.zhihu.com/heifetz/favicon.ico',
    github: 'https://github.githubassets.com/pinned-octocat.svg',
    juejin: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png',
    csdn: 'https://g.csdnimg.cn/static/logo/favicon32.ico',
    runoob: 'https://static.runoob.com/images/favicon.ico',
    vue: 'https://cli.vuejs.org/icons/apple-touch-icon-152x152.png',
    bilibili: 'https://www.bilibili.com/favicon.ico',
    lanhu: 'https://sso-cdn.lanhuapp.com/ssoweb/favicon.ico',
    yuque: 'https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*vMxOQIh4KBMAAAAAAAAAAAAADvuFAQ/original',
    mailQQ: 'https://mail.qq.com/zh_CN/htmledition/images/favicon/qqmail_favicon_96h.png',
    mail163: 'https://mail.163.com/favicon.ico',
    weibo: 'https://weibo.com/favicon.ico',
    qzone: 'https://qzonestyle.gtimg.cn/aoi/img/logo/favicon.ico?max_age=31536000',
    baidu: 'https://www.baidu.com/favicon.ico',
  };

  /** 默认功能文案 */
  const DEFAULT_FUNCTION = [
    '外链直接打开<div class="ctz-commit">知乎里所有外部链接的重定向去除，可以直接访问</div>',
    '移除登录提示弹窗',
    '一键移除所有屏蔽选项，点击「话题黑名单」编辑按钮出现按钮<div class="ctz-commit">知乎屏蔽标签每次只显示部分，建议解除屏蔽后刷新页面查看是否仍然存在新的屏蔽标签</div><a href="/settings/filter" target="_blank">前往屏蔽页</a>',
    '回答视频下载<div class="ctz-commit">回答内容视频左上角会生成一个下载按钮，点击即可下载视频</div>',
    '收藏夹内容导出为 PDF<div class="ctz-commit">点击收藏夹名称上方「生成PDF」按钮，可导出当前页码的收藏夹详细内容</div>',
    '回答内容按照点赞数和评论数排序' +
      '<div class="ctz-commit">' +
      '6-1. 点击回答右上角的排序按钮，点击【点赞数排序】或【评论数排序】后，页面刷新等待排序完成；<br/>' +
      '6-2. 因为知乎并没有开放点赞数和评论排序参数，所以只能每次加载后按照当前的数据进行页面排序；<br/>' +
      '6-3. 为了防止页面错乱，只对前20条进行排序，后续新加载的数据不做排序处理' +
      '</div>',
    '个人主页「我关注的问题」、「我关注的收藏」可以一键移除或将移除的内容添加回关注' +
      '<div class="ctz-commit">' +
      '由于知乎接口的限制，关注及移除只能在对应页面中进行操作，所以点击「移除关注」按钮将打开页面到对应页面，取消或关注后此页面自动关闭，如果脚本未加载请刷新页面' +
      '</div>',
    '推荐页内容链接根据有新到旧进行缓存，可缓存 100 条；缓存内容在「编辑器 - 历史记录 - 推荐列表缓存」',
    '可保存 100 条浏览历史记录链接，内容为打开的问题、文章、视频；「编辑器 - 历史记录 - 浏览历史记录」',
  ];

  /** html 添加额外的类名 */
  const EXTRA_CLASS_HTML = {
    'zhuanlan.zhihu.com': 'zhuanlan',
    'www.zhihu.com': 'zhihu',
  };

  /** 挂载脚本时 document.head 是否渲染 */
  let isHaveHeadWhenInit = true;
  /** 配置项 */
  let pfConfig = {
    ...CONFIG_HIDDEN_DEFAULT,
    ...CONFIG_FILTER_DEFAULT,
    ...CONFIG_SUSPENSION,
    /** 自定义样式 */
    customizeCss: '',
    /** 知乎默认 | 自动展开所有回答 | 默认收起所有长回答 */
    answerOpen: '',
    filterKeywords: [],
    /** 列表用户名后显示「屏蔽用户」按钮 */
    showBlockUser: true,
    /** 背景色 */
    colorBackground: '#ffffff',
    /** 列表版心宽度 */
    versionHome: '1000',
    /** 回答版心宽度 */
    versionAnswer: '1000',
    /** 文章版心宽度 */
    versionArticle: '690',
    /** 图片尺寸自定义类型 0 1 2 */
    zoomImageType: '0',
    /** 图片尺寸自定义大小 */
    zoomImageSize: '600',
    /** 使用弹窗打开动图 */
    showGIFinDialog: true,
    /** 网页标题 */
    globalTitle: '',
    /** 网页标题logo图 */
    titleIco: '',
    /** 内容标题添加类别标签 */
    questionTitleTag: true,
    /** 推荐列表外置「不感兴趣」按钮 */
    listOutPutNotInterested: false,
    /** 列表更多按钮固定至题目右侧 */
    fixedListItemMore: false,
    /** 关注列表高亮原创内容 */
    highlightOriginal: true,
    /** 列表内容点击高亮边框 */
    highlightListItem: false,
    /** 列表内容显示发布与最后修改时间 */
    listItemCreatedAndModifiedTime: true,
    /** 回答列表显示创建与最后修改时间 */
    answerItemCreatedAndModifiedTime: true,
    /** 问题显示创建和最后修改时间 */
    questionCreatedAndModifiedTime: true,
    /** 文章发布时间置顶 */
    articleCreateTimeToTop: true,
    /** 购物链接显示设置 0 1 2 */
    linkShopping: '0',
    /** 回答视频显示设置  0 1 2 */
    linkAnswerVideo: '0',
    /** 列表内容标准文字大小 */
    fontSizeForList: 15,
    /** 回答内容标准文字大小 */
    fontSizeForAnswer: 15,
    /** 文章内容标准文字大小 */
    fontSizeForArticle: 16,
    /** 列表视频回答内容尺寸 */
    zoomListVideoType: '0',
    /** 列表视频回答内容缩放 */
    zoomListVideoSize: '500',
    /** 唤醒快捷键是否开启 */
    hotKey: true,
  };
  /** 缓存历史记录 */
  let pfHistory = {
    list: [],
    view: [],
  };
  /** 缓存的历史记录数量 */
  const SAVE_HISTORY_NUMBER = 500;

  /** 用户信息 */
  let userInfo = {};

  const findEvent = {
    header: { fun: null, num: 0, isFind: false },
  };

  /** 脚本内配置缓存 */
  const storageConfig = {
    cachePfConfig: {}, // 缓存初始配置
    cacheTitle: '', // 缓存页面原标题
    fetchHeaders: {}, // fetch 的 headers 内容, 获取下来以供使用
    heightForList: 0, // 列表缓存高度
    headerDoms: {}, // header内元素
  };

  /** 修改页面背景的 css */
  const myBackground = {
    init: function () {
      const innerHTML = this.change(pfConfig.colorBackground);
      fnInitDomStyle('CTZ_STYLE_BACKGROUND', innerHTML);
    },
    change: function (bg) {
      if (this.isUseDark()) return this.dark(bg);
      if (bg === '#ffffff') return this.default();
      return this.normal(bg) + this.normalAppHeader(bg);
    },
    isUseDark: () => Object.keys(BACKGROUND_DARK_COLORS).includes(pfConfig.colorBackground),
    default: () => '.GlobalSideBar-navList{background: #fff}',
    dark: (bg) => {
      const { b2, t1, t2 } = BACKGROUND_DARK_COLORS[bg];
      const backgroundBG =
        `#${ID_DIALOG},.ctz-set-title>span,#CTZ-BLOCK-LIST .ctz-black-item` +
        `,.css-ul9l2m,.css-mq2czy,.css-1da4iq8,.css-oqge09,.css-lpo24q,.css-16zrry9,.css-u8y4hj,.css-1117lk0:hover,.css-1yq3jl6,.css-mzh2tk,.css-6mdg56,.css-mjg7l1,.css-q2yfd6,.css-1ulkprw,.Modal-modal-wf58,.css-1j5d3ll,.css-ovbogu,.css-1v840mj,.css-huwkhm,.css-akuk2k,.css-ygii7h,.css-1h84h63,.css-1bwzp6r,.css-w215gm,.css-iebf30,.css-1qjzmdv,.css-g3xs10,.css-jlyj5p,.css-805ti0,.css-12yl4eo,.css-1ggwojn,.css-xqep55,.css-1ne387d,.Card,.ContentItem-actions,.QuestionHeader,.ShelfTopNav-root-eb3BX,.Modal-inner,.zhi,.Notifications-footer` +
        `,.QuestionHeader-footer,.MoreAnswers .List-headerText,.EQvEDwRqICOvs_x_kUWW,.ProfileHeader-wrapper,.SettingsFAQ,.QuestionWaiting-types,.Popover-content,.Post-content,.KfeCollection-PcCollegeCard-root,.SearchTabs,.GlobalSideBar-navList,.WebPage-root-g7WXc,.KfeCollection-FeedBlockSetting,.AnswerForm-footer,.CreatorRecruitFooter--fix,body .Recruit-buttonFix-placeholder,.CreatorIndex-BottomBox-Item,.Recommendations-Main,.QZcfWkCJoarhIYxlM_sG,.Sticky,.css-1vtgv04` +
        `{background: ${bg}!important;}`;
      const backgroundB2 =
        `.ctz-content-right>div:nth-of-type(2n),.ctz-content-right>div:nth-of-type(2n) .ctz-set-title > span` +
        `,.css-1vwmxb4:hover,.css-1xegbra,.css-xevy9w tbody tr:nth-of-type(odd),.css-r9mkgf,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-1gnqr8i,.css-1stnbni:hover,.css-5abu0r,.css-n7efg0,.css-ssvpr2,.css-m9gn5f,.FeedbackForm-inputBox-15yJ,.css-106u01g,.css-c29erj,.css-1xk2o8d,.FeedbackForm-canvasContainer-mrde,._Invite_container_30SP,.utils-frostedGlassEffect-2unM,.css-16eulm,.index-root-3h4H5` +
        `,.Card-card-2K6v,.UserLivesPage-page-GSje,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448,.PubIndex-CategoriesHeader,.AppHeader,body,.UserPageItem--withButton,.QuestionWaiting-typesTopper,.PostItem,.LinkCard.new` +
        `{background:${b2}!important;}`;
      const backgroundTransparent =
        `._AccountSettings_accountLine_3HJS,.css-1gfpqrv,.css-13dk2dh,.css-u6lvao,.css-u6lvao:before,.css-u6lvao:after,.Community-ContentLayout` +
        `{background: transparent!important;}`;
      const colorT1 =
        `.ctz-footer` +
        `,.css-7v0haq,.css-1yj4z27,.css-1204lgo,.css-1ng3oge,.css-5abu0r,.css-p52k8h,.css-1dpmqsl,.css-1myqwel,.css-1ykn8va,.css-1117lk0,.css-m9gn5f,.css-oqge09,.css-8u7moq,.css-k0fmhp,css-bc6idi,.css-nsw6sf,.css-25wprl,.css-294ohd,.css-1nmddht,.css-11nn00q,.css-1c4skpi,.GlobalSidebar-appDownloadTip-33iw,.css-pgcb4h,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-jwse5c,.css-hd7egx,.css-1zcaix,.css-4a3k6y,.css-eonief,.css-dy7bva,.css-sthon2,.css-teb1rp,.css-uq88u1,.css-nymych,.css-1gomreu,.css-tnsaxh,.css-jt1vdv,.css-tfs9zi,.css-1m2h1o9,.css-16p5ii9,.css-kkim14,.css-1mx84bz,.css-74475r,.css-3dzvwq,.css-1ab1nhi,.css-1l1sy07,.css-1bbvash,.css-1stnbni:hover,.css-tad50r,.css-1rd0h6f,.css-1k10w8f,.css-195d1c3,.css-1bfi5pu,.css-kk7b9z` +
        `,.CopyrightSettings h2,.CopyrightSettings,.LiveItem-title-2qes,.GlobalSidebar-introItem-24PB h3,.Card-card-2K6v,.LiveItem-description-Tliw,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448,.zu-main-content,.zu-main-sidebar,.FeedbackForm-form-1uUg,.CopyrightSettings h1,.index-root-3h4H5,.TopNavBar-userInfo-kfSJK .TopNavBar-icon-9TVP7,.ZVideo-body .UserLink,.ZVideo-body .CommentRichText,.CommentContent,.TopNavBar-logoContainer-vDhU2 .TopNavBar-zhihuLogo-jzM1f,.RichContent-collapsedText,.ContentItem-arrowIcon,.TopNavBar-inner-baxks .TopNavBar-tab-hBAaU a,.UserHeader-Info,.NavItemClassName,#creator-statistic,#creator-task-dayTask,#creator-task-creatorTask,#creator-manual` +
        `{color: ${t1}!important}`;
      const colorT2 = `.css-o7lu8j{color: ${t2}!important}`;
      const colorB2 = `css-1x3upj1,.ctz-content-left>a:hover,.ctz-button{color: ${b2}!important}`;
      const borderColorBG = `.MenuBar-root-rQeFm{border-color: ${bg}!important;}`;
      const dialogBorder = `#${ID_DIALOG}{border: 1px solid ${b2}}.ctz-menu-top>a.target{border-bottom: 4px solid ${t1};color: ${t1};}`;

      // 添加 html[data-theme=dark] 前缀
      const addPrefix = (i) =>
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
    normal: (bg) => {
      // 普通背景色
      const background =
        `.ctz-content-right>div:nth-of-type(2n),.ctz-content-right>div:nth-of-type(2n) .ctz-set-title > span` +
        `,body,.Post-content,.HotList,.HotListNavEditPad,.ColumnPageHeader,.ZVideoToolbar,.position-suspensionSearch.focus,.Modal-modal-wf58,.Community-ContentLayout,.App-root-8rX7N,.MenuBar-root-rQeFm,.TopNavBar-fixMode-4nQmh,.App-active-dPFhH,.CategorySection-categoryList-mrt3Z,.zhuanlan .Post-content .ContentItem-actions,.zhuanlan .ContentItem-actions,.LinkCard.new,.WebPage-root-g7WXc,.KfeCollection-FeedBlockSetting,.ShelfTopNav-root-eb3BX` +
        `{background-color: ${bg}!important;}`;
      const backgroundOpacity =
        `#${ID_DIALOG},.ctz-set-title>span,#${ID_DIALOG} select,#${ID_DIALOG} input,#${ID_DIALOG} textarea,#CTZ_SET_FILTER` +
        `,.QuestionHeader,.Card,.HotItem,.Recommendations-Main,.GlobalSideBar-navList,.SearchSubTabs,.CommentsV2-withPagination,.QuestionHeader-footer,.HoverCard,.ContentItem-actions,.MoreAnswers .List-headerText,.Topbar,.CommentsV2-footer,.Select-plainButton,.ExploreRoundtableCard,.ExploreCollectionCard,.ExploreSpecialCard,.ExploreColumnCard,.ExploreHomePage-ContentSection-moreButton a,.QuestionWaiting-types,.AutoInviteItem-wrapper--desktop,.Popover-content,.Notifications-footer,.SettingsFAQ,.Popover-arrow:after,.Messages-footer,.Modal-inner,.RichContent-actions,.KfeCollection-FeedBlockSetting,.CommentListV2-header-divider,.Input-wrapper:not(.Input-wrapper--grey),.TopstoryItem .ZVideoToolbar,.SearchTabs,.Topic-bar,.VotableTopicCard,textarea.FeedbackForm-inputBox-15yJ,.FeedbackForm-canvasContainer-mrde` +
        `,.css-mq2czy,.css-lpo24q,.css-16zrry9,.css-1v840mj,.css-ovbogu,.css-1h84h63,.css-u8y4hj,.css-1bwzp6r,.css-w215gm,.InputLike,.AnswerForm-footer,.Editable-toolbar,.Chat,.css-ul9l2m,.Balance-Main .Tabs,.Community,.Report-list tr:nth-child(2n),.Report-Pagination,.Report-list,.Report-header th,._Invite_container_30SP,.css-ssvpr2,.css-1p1lrh0,.zu-main,.utils-frostedGlassEffect-2unM,.Card-card-2K6v,.UserLivesPage-page-GSje,.Tooltip-tooltip-2Cut.Tooltip-light-3TwZ .Tooltip-tooltipInner-B448,.PubIndex-CategoriesHeader,.css-r9mkgf,.CornerButton,.css-1sqjzsk,.css-t3f0zn,.css-1cj0s4z,.css-1vtgv04,.WikiLandingHeader,.WikiLanding,.WikiLandingItemCard,.WikiLandingEntryCard,.SideNavs-navContainer-6VkAT,.App-root-cPFwn,.TopNavs-root-rwAr7,.App-root-qzkuH,.App-actionTrigger-cCyD7,.ProductTrigger-root-amaSi,.App-infiniteContainer-nrxGj,.ActionTrigger-content-dPn6H,.App-card-pkbhv,.css-zvnmar,.Login-options,.SignFlowInput-errorMask,.ColumnHomeColumnCard,.KfeCollection-PcCollegeCard-root,.KfeCollection-PcCollegeCard-wrapper` +
        `,.css-1j5d3ll,.css-iebf30,.css-1qjzmdv,.AnswerForm-footer,.css-g3xs10,.css-jlyj5p,.CommentEditorV2-inputUpload,.css-805ti0,.css-10fqe38,.css-n9os37,.css-sdgtgb,.css-f955pw,.css-6tr06j,.css-pslzz3,.css-10rrwst,.css-1ne387d,.css-1bmbu2d,.css-mjg7l1,.css-1ulkprw,.css-1k8sxfm,.css-a9sbyu,.CreatorIndex-BottomBox-Item,.css-1r9j229,.css-wgpue5,.css-1hwwfws,.css-1clwviw,.css-ndqbqd,.css-19v79p5,.css-f7rzgf,.css-106u01g,.css-c29erj,.Modal-content,.Sticky,.css-2i2hyg,.css-1sz5gzk,.css-vvikez` +
        `{background-color:${BACKGROUND_CONFIG[bg].opacity}!important;background:${BACKGROUND_CONFIG[bg].opacity}!important;}`;
      const backgroundTransparent =
        `.zhuanlan .Post-content .RichContent-actions.is-fixed,.AnnotationTag,.ProfileHeader-wrapper,.css-1ggwojn` +
        `{background-color: transparent!important;}`;
      const borderColor = `.MenuBar-root-rQeFm{border-color: ${bg}!important;}`;
      return background + backgroundOpacity + backgroundTransparent + borderColor;
    },
    normalAppHeader: (bg) => {
      // header 颜色变化
      const elementHC = dom('.AppHeader') && dom('.AppHeader').classList;
      const haveTopAD = dom('.Topstory>div:not(.Topstory-container)') && dom('.Topstory>div:not(.Topstory-container)').childElementCount;
      const headerBelongAd = haveTopAD ? elementHC[elementHC.length - 1] : '';
      return (
        `${headerBelongAd ? `.AppHeader:not(.${headerBelongAd})` : '.AppHeader'}` +
        `{background-color:${BACKGROUND_CONFIG[bg].opacity}!important;background:${BACKGROUND_CONFIG[bg].opacity}!important;}`
      );
    },
  };

  /** 修改版心的 css */
  const myVersion = {
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
        `img.lazy,.GifPlayer img,.ArticleItem-image,.ztext figure .content_image,.ztext figure .origin_image,.TitleImage{${nContent}}`
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

  /** 隐藏元素的 css */
  const myHidden = {
    init: function () {
      fnInitDomStyle('CTZ_STYLE_HIDDEN', this.change() || '');
    },
    change: function () {
      const cssHidden = Object.keys(this.cssForKey)
        .map((key) => (pfConfig[key] ? this.cssForKey[key] : ''))
        .join('');
      let cssHiddenMore = '';
      this.cssForKeysArray.forEach(({ keys, value }) => {
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
      hiddenItemActions:
        `.Topstory-container .ContentItem-actions>span,.Topstory-container .ContentItem-actions>button` +
        `,.Topstory-container .ContentItem-actions>div,.Topstory-container .ContentItem-actions>a` +
        `,.TopstoryQuestionAskItem-writeAnswerButton,.TopstoryQuestionAskItem-hint` +
        `{visibility:hidden!important;height:0!important;padding:0!important;}` +
        `.TopstoryQuestionAskItem-hint{margin: 0!important;}` +
        `.Topstory .ContentItem-actions{padding: 0!important;}` +
        `.SearchResult-Card .ContentItem-actions{display: none;}`,
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
      hiddenListImg: `.RichContent-cover,.HotItem-img{display:none!important;}` + `.HotItem-metrics--bottom{position: initial!important;}`,
      hiddenReadMoreText: '.ContentItem-more{font-size:0!important;}',
      hiddenAD: '.TopstoryItem--advertCard,.Pc-card,.Pc-word{display: none!important;}',
      hiddenAnswers:
        `.Topstory-container .RichContent.is-collapsed .RichContent-inner,.HotItem-excerpt--multiLine` +
        `,.TopstoryQuestionAskItem .RichContent .RichContent-inner,.HotItem-content .HotItem-excerpt` +
        `,.Topstory-recommend .ZVideoItem-video, .Topstory-recommend .VideoAnswerPlayer` +
        `{display: none;}`,
      hiddenListVideoContent: `.Topstory-recommend .ZVideoItem-video,.Topstory-recommend .VideoAnswerPlayer,.Topstory-recommend .ZVideoItem .RichContent{display: none;}`,
      hiddenZhuanlanActions: '.RichContent-actions.is-fixed>.ContentItem-actions{display: none;}',
      hiddenZhuanlanTitleImage: '.TitleImage,.css-78p1r9{display: none;!important}',
      hiddenFixedActions: `.ContentItem .RichContent-actions.is-fixed,.List-item .RichContent-actions.is-fixed{visibility: hidden!important;}`,
      hiddenHotItemMetrics: '.HotItem-content .HotItem-metrics{display: none;}',
      hiddenHotItemIndex: '.HotItem-index{display: none;}.HotItem{padding: 16px!important;}',
      hiddenHotItemLabel: '.HotItem-label{display: none;}',
      hiddenDetailAvatar:
        '.AnswerItem .AuthorInfo .AuthorInfo-avatarWrapper{display: none;}.AnswerItem .AuthorInfo .AuthorInfo-content{margin-left:0!important;}',
      hiddenDetailBadge: '.AnswerItem .AuthorInfo .AuthorInfo-detail{display: none;}',
      hiddenDetailVoters: '.AnswerItem .Voters button{display: none;}',
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
      hiddenAnswerItemActions: '.Question-main .ContentItem-actions{display: none;}',
      hiddenAnswerItemTime: '.Question-main .ContentItem-time{display: none;margin: 0;}',
      hiddenAppHeaderTabHome: '.AppHeader-Tab:nth-of-type(1){display: none}',
      hiddenAppHeaderTabZhi: '.AppHeader-Tab:nth-of-type(2){display: none}',
      hiddenAppHeaderTabVIP: '.AppHeader-Tab:nth-of-type(3){display: none}',
      hiddenAppHeaderTabFind: '.AppHeader-Tab:nth-of-type(4){display: none}',
      hiddenAppHeaderTabWaitingForYou: '.AppHeader-Tab:nth-of-type(5){display: none}',
      hiddenHomeListTabFollow: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-follow"]{display: none}',
      hiddenHomeListTabRecommend: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-recommend"]{display: none}',
      hiddenHomeListTabHot: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-hot"]{display: none}',
      hiddenHomeListTabVideo: '.Topstory-container .TopstoryTabs [aria-controls="Topstory-zvideo"]{display: none}',
      hiddenHomeListTab: '.Topstory-container .TopstoryTabs{display: none}',
      hiddenQuestionGoodQuestion: '.QuestionPage .QuestionHeader .GoodQuestionAction{display: none}',
      hiddenQuestionComment: '.QuestionPage .QuestionHeader .QuestionHeader-Comment{display: none}',
      hiddenQuestionMore: '.QuestionPage .QuestionHeader [aria-label="更多"]{display: none;}',
      hiddenOpenButton: '#CTZ_OPEN_BUTTON{display: none;}',
      hiddenTopAD: '.App-main .Topstory>div:first-of-type:not(.Topstory-container){display: none}',
    },
    cssForKeysArray: [
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
    ],
  };

  /** 自定义样式方法 */
  const myCustomStyle = {
    init: function () {
      dom('[name="textStyleCustom"]').value = pfConfig.customizeCss || '';
      this.change();
    },
    change: () => fnInitDomStyle('CTZ_STYLE_CUSTOM', pfConfig.customizeCss || ''),
  };

  /** 编辑器按钮点击事件集合 */
  const myButtonOperation = {
    /** 导出配置 */
    configExport: async () => {
      const config = await myStorage.get('pfConfig');
      const link = domC('a', {
        href: 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(config),
        download: `知乎编辑器配置-${+new Date()}.txt`,
      });
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    /** 导入配置 */
    configImport: async () => {
      const configImport = dom('[name=textConfigImport]').value;
      pfConfig = JSON.parse(configImport);
      await myStorage.set('pfConfig', JSON.stringify(pfConfig));
      resetData();
    },
    configReset: async () => {
      const isUse = confirm('是否启恢复默认配置？\n该功能会覆盖当前配置，建议先将配置导出保存');
      if (!isUse) return;
      const { filterKeywords = [], removeBlockUserContentList = [] } = pfConfig;
      pfConfig = {
        ...storageConfig.cachePfConfig,
        filterKeywords,
        removeBlockUserContentList,
      };
      await myStorage.set('pfConfig', JSON.stringify(pfConfig));
      resetData();
    },
    /** 自定义样式 */
    styleCustom: async () => {
      const value = dom('[name="textStyleCustom"]').value || '';
      pfConfig.customizeCss = value;
      await myStorage.set('pfConfig', JSON.stringify(pfConfig));
      myCustomStyle.change();
    },
    syncBlack: () => myBlack.sync(0),
    /** 确认更改网页标题 */
    buttonConfirmTitle: async () => {
      const value = dom('[name="globalTitle"]').value;
      pfConfig.globalTitle = value || '';
      await myStorage.set('pfConfig', JSON.stringify(pfConfig));
      changeTitle();
    },
    /** 还原网页标题 */
    buttonResetTitle: async () => {
      pfConfig.globalTitle = '';
      dom('[name="globalTitle"]').value = storageConfig.cacheTitle;
      await myStorage.set('pfConfig', JSON.stringify(pfConfig));
      changeTitle();
    },
    useSimple: () => useSimple(),
  };

  /** 使用 localStorage + GM 存储，解决跨域存储配置不同的问题 */
  const myStorage = {
    set: async function (name, value) {
      let v = value;
      if (this.namesNeedT.includes(name)) {
        const valueParse = JSON.parse(value);
        valueParse.t = +new Date();
        v = JSON.stringify(valueParse);
      }
      localStorage.setItem(name, v);
      await GM_setValue(name, v);
    },
    get: async function (name) {
      const config = await GM_getValue(name);
      const configLocal = localStorage.getItem(name);
      let c = config;
      if (this.namesNeedT.includes(name)) {
        const cParse = config ? JSON.parse(config) : null;
        const cLParse = configLocal ? JSON.parse(configLocal) : null;
        if (!cParse && !cLParse) return '';
        if (!cParse) return configLocal;
        if (!cLParse) return config;
        if (cParse.t < cLParse.t) return configLocal;
        return config;
      }
      return c;
    },
    initConfig: async function () {
      const nConfig = await this.get('pfConfig');
      const c = nConfig ? JSON.parse(nConfig) : {};
      if (nConfig === JSON.stringify(pfConfig)) {
        return Promise.resolve(false);
      }
      pfConfig = { ...pfConfig, ...c };
      return Promise.resolve(true);
    },
    initHistory: async function () {
      const nHistory = await myStorage.get('pfHistory');
      const h = nHistory ? JSON.parse(nHistory) : pfHistory;
      if (nHistory === JSON.stringify(pfHistory)) {
        return Promise.resolve(false);
      }
      pfHistory = h;
      return Promise.resolve(true);
    },
    namesNeedT: ['pfConfig', 'pfHistory'], // 需要时间戳的名称
  };

  /** 在打开弹窗时候停止页面滚动，只允许弹窗滚动 */
  const myScroll = {
    stop: () => dom('body').classList.add('ctz-stop-scroll'),
    on: () => dom('body').classList.remove('ctz-stop-scroll'),
  };

  /** 自定义预览方法 */
  const myPreview = {
    // 开启预览弹窗
    open: function (src, even, isVideo) {
      const nameDom = isVideo ? this.evenPathVideo : this.evenPathImg;
      const idDom = isVideo ? this.idVideo : this.idImg;
      dom(nameDom).src = src;
      domById(idDom).style.display = 'block';
      // 存在 even 则保存，关闭时候清除
      // 解决浏览 GIF 时的弹窗问题
      even && (this.even = even);
      myScroll.stop();
    },
    // 关闭预览弹窗
    hide: function (pEvent) {
      if (this.even) {
        this.even.click();
        this.even = null;
      }
      pEvent.style.display = 'none';
      dom(this.evenPathImg).src = '';
      dom(this.evenPathVideo).src = '';
      myScroll.on();
    },
    even: null,
    evenPathImg: '#CTZ_PREVIEW_IMAGE img',
    evenPathVideo: '#CTZ_PREVIEW_VIDEO video',
    idImg: 'CTZ_PREVIEW_IMAGE',
    idVideo: 'CTZ_PREVIEW_VIDEO',
  };

  /** 编辑器弹窗打开关闭方法 */
  const myDialog = {
    open: async () => {
      domById(ID_DIALOG).style.display = 'flex';
      myScroll.stop();
      const isChangeConfig = await myStorage.initConfig();
      isChangeConfig && echoData();
      const isChangeHistory = await myStorage.initHistory();
      isChangeHistory && echoHistory();
    },
    hide: () => {
      domById(ID_DIALOG).style.display = 'none';
      myScroll.on();
    },
  };

  /** 屏蔽词方法 */
  const myFilterWord = {
    add: async function (target) {
      // 添加屏蔽词
      const word = target.value;
      const { filterKeywords } = pfConfig;
      filterKeywords.push(word);
      pfConfig = { ...pfConfig, filterKeywords };
      await myStorage.set('pfConfig', JSON.stringify(pfConfig));
      const item = domC('span', { innerHTML: this.evenText(word) });
      item.dataset.title = word;
      domById(ID_FILTER_WORDS).appendChild(item);
      target.value = '';
    },
    remove: (event) => {
      // 删除屏蔽词
      const title = event.dataset.title;
      const { filterKeywords } = pfConfig;
      pfConfig = {
        ...pfConfig,
        filterKeywords: filterKeywords.filter((i) => i !== title),
      };
      event.remove();
      myStorage.set('pfConfig', JSON.stringify(pfConfig));
    },
    init: function () {
      // 初始化
      const children = (pfConfig.filterKeywords || []).map((i) => this.evenTextBlock(i)).join('');
      domById(ID_FILTER_WORDS).innerHTML = children || '';
      domById(ID_FILTER_WORDS).onclick = (e) => {
        e.target.classList.contains('ctz-filter-word-remove') && this.remove(e.target.parentElement);
      };
      dom('[name="inputFilterWord"]').onchange = (e) => this.add.call(this, e.target);
    },
    evenText: (w) => `<span>${w}</span><i class="ctz-icon ctz-filter-word-remove">&#xe602;</i>`,
    evenTextBlock: function (w) {
      return `<span data-title="${w}">${this.evenText(w)}</span>`;
    },
  };

  /** 设置菜单方法 */
  const myMenu = {
    init: function () {
      // 匹配顶部菜单项或者匹配菜单子项
      const chooseId = [...dom('.ctz-menu-top').children].map((i) => i.hash).find((i) => i === hash || hash.replace(i) !== hash);
      if (chooseId) {
        this.click({ target: dom(`a[href="${chooseId}"]`) });
        return;
      }
      this.click({ target: dom('a[href="#CTZ_SET_BASIS"]') });
    },
    click: function ({ target }) {
      if (!(target.hash && target.tagName === 'A')) return;
      const isThis = target.hash.replace(/#/, '');
      if (!isThis) return;
      domA('.ctz-menu-top>a').forEach((itemA) => itemA.classList.remove('target'));
      target.classList.add('target');
      domA('.ctz-content>div').forEach((item) => (item.style.display = isThis === item.id ? 'flex' : 'none'));
    },
  };

  /** 监听列表内容 - 过滤  */
  const myListenListItem = {
    index: 0,
    init: async function () {
      const {
        filterKeywords = [],
        removeItemAboutVideo,
        removeItemAboutArticle,
        removeLessVote,
        lessVoteNumber,
        removeItemQuestionAsk,
        removeFollowVoteAnswer,
        removeFollowVoteArticle,
        removeFollowFQuestion,
        listOutPutNotInterested,
        highlightOriginal,
        colorBackground,
        removeMyOperateAtFollow,
      } = pfConfig;
      const elements = domA('.TopstoryItem');
      let lessNum = 0;
      await myStorage.initHistory();
      const historyList = pfHistory.list;
      for (let i = this.index, len = elements.length; i < len; i++) {
        let message = ''; // 屏蔽信息
        let dataZop = {};
        let cardContent = {};
        const nodeItem = elements[i];
        const nodeItemContent = nodeItem.querySelector('.ContentItem');
        if (!nodeItem.scrollHeight || !nodeItemContent) continue;
        // 列表外置不感兴趣按钮
        if (listOutPutNotInterested) {
          const elementNotInterested = domC('button', { innerText: '不感兴趣', className: CLASS_NOT_INTERESTED });
          !nodeItem.querySelector(`.${CLASS_NOT_INTERESTED}`) && nodeItem.querySelector('.ContentItem-title').appendChild(elementNotInterested);
        }
        try {
          dataZop = JSON.parse(nodeItemContent.getAttribute('data-zop'));
          cardContent = JSON.parse(nodeItemContent.getAttribute('data-za-extra-module')).card.content;
        } catch {}
        const { itemId = '', title = '', type = '' } = dataZop || {};
        // 关注列表屏蔽自己的操作
        if (removeMyOperateAtFollow && nodeItem.classList.contains('TopstoryItem-isFollow')) {
          try {
            const findUserId = nodeItem.querySelector('.UserLink .UserLink-link').href.match(/[^\/]+$/)[0];
            const myUserId = userInfo.url.match(/[^\/]+$/)[0];
            findUserId === myUserId && (message = '关注列表屏蔽自己的操作');
          } catch {}
        }
        // 列表种类过滤
        const haveVideo = nodeItemContent.classList.contains('ZVideoItem') && removeItemAboutVideo;
        const haveArticle = nodeItemContent.classList.contains('ArticleItem') && removeItemAboutArticle;
        (haveVideo || haveArticle) && !message && (message = '列表种类屏蔽');
        // 屏蔽低赞内容
        if (removeLessVote && !message) {
          cardContent['upvote_num'] < lessVoteNumber && (message = `屏蔽低赞内容: ${title}, ${cardContent['upvote_num']}`);
        }
        // 屏蔽邀请回答
        const elementQuestionAsk = nodeItem.querySelector('.TopstoryQuestionAskItem');
        if (removeItemQuestionAsk && elementQuestionAsk && !message) {
          message = '屏蔽邀请回答';
        }
        // 关注列表屏蔽关注人操作
        const isFilterFollowerOperate = removeFollowVoteAnswer || removeFollowVoteArticle || removeFollowFQuestion;
        if (isFilterFollowerOperate && !message && nodeItem.classList.contains('TopstoryItem-isFollow')) {
          const textFollowerOperate = nodeItem.querySelector('.FeedSource-firstline').innerText;
          for (let itemOperate of FILTER_FOLLOWER_OPERATE) {
            const thisRep = new RegExp(itemOperate.rep);
            if (pfConfig[itemOperate.key] && thisRep.test(textFollowerOperate)) {
              message = `屏蔽关注人操作: ${textFollowerOperate}`;
              break;
            }
          }
        }
        if (!message) {
          let matchedWord = ''; // 匹配到的内容, 仅匹配第一个
          for (let itemWord of filterKeywords) {
            const rep = new RegExp(itemWord.toLowerCase());
            if (rep.test(title.toLowerCase())) {
              matchedWord += `「${itemWord}」`;
              break;
            }
          }
          // 匹配到屏蔽词, 屏蔽词过滤
          if (matchedWord) {
            const elementItemProp = nodeItemContent.querySelector('[itemprop="url"]');
            const routeURL = elementItemProp && elementItemProp.getAttribute('content');
            doFetchNotInterested({ id: itemId, type });
            message = `屏蔽列表内容: ${title},匹配屏蔽词：${matchedWord}, 链接：${routeURL}`;
          }
        }
        // 高亮原创
        const userNameE = nodeItem.querySelector('.FeedSource-firstline .UserLink-link');
        const userName = userNameE ? userNameE.innerText : '';
        if (highlightOriginal && dataZop && dataZop.authorName === userName && !message) {
          const highlight = `background: ${
            myBackground.isUseDark()
              ? `${BACKGROUND_DARK_COLORS[colorBackground].b2}!important;`
              : colorBackground === '#ffffff'
              ? '#fff3d4!important;'
              : `${colorBackground}!important;`
          }`;
          nodeItem.style = `${highlight}border: 1px solid #aaa;`;
          nodeItem.querySelector('.ContentItem-actions').style = highlight;
        }
        // 最后信息 & 起点位置处理
        message && (lessNum = fnHiddenDom(lessNum, nodeItem, message));
        // 缓存推荐列表
        if (domP(nodeItem, 'class', 'Topstory-recommend') && nodeItem.querySelector('.ContentItem-title a')) {
          const nodeATitle = nodeItem.querySelector('.ContentItem-title a');
          const itemHref = nodeATitle.href;
          const itemTitle = nodeATitle.innerText;
          const itemA = `<a href="${itemHref}" target="_blank">${itemTitle}</a>`;
          if (historyList[0] !== itemA) {
            historyList.unshift(itemA);
            pfHistory.list = historyList.slice(0, SAVE_HISTORY_NUMBER);
          }
        }
        fnJustNum(nodeItem);
        if (i + 1 === len) {
          const nI = i - lessNum >= 0 ? i - lessNum : 0;
          this.index = nI;
          myStorage.set('pfHistory', JSON.stringify(pfHistory));
        }
      }
    },
    reset: function () {
      this.index = 0;
    },
    restart: function () {
      this.reset();
      this.init();
    },
  };

  /** 监听搜索列表 - 过滤  */
  const myListenSearchListItem = {
    index: 0,
    init: function () {
      const { removeItemAboutVideo, removeItemAboutArticle, removeItemAboutAD, removeLessVote, lessVoteNumber } = pfConfig;
      const elements = domA('.SearchResult-Card[role="listitem"]');
      let lessNum = 0;
      for (let i = this.index, len = elements.length; i < len; i++) {
        let message = ''; // 屏蔽信息
        const elementThis = elements[i];
        if (!elementThis) continue;
        // FIRST
        // 列表种类屏蔽
        const haveAD = removeItemAboutAD && elementThis.querySelector('.KfeCollection-PcCollegeCard-root');
        const haveArticle = removeItemAboutArticle && elementThis.querySelector('.ArticleItem');
        const haveVideo = removeItemAboutVideo && elementThis.querySelector('.ZvideoItem');
        (haveAD || haveArticle || haveVideo) && (message = '列表种类屏蔽');
        // 低赞内容过滤
        if (removeLessVote && !message) {
          const elementUpvote = elementThis.querySelector('.ContentItem-actions .VoteButton--up');
          const ariaLabel = elementUpvote ? elementUpvote.getAttribute('aria-label') : '';
          const upvoteText = ariaLabel ? ariaLabel.trim().replace(/\W+/, '') : '0';
          const upvote = upvoteText.includes('万') ? upvoteText.replace('万', '').trim() * 10000 : +upvoteText;
          if (upvote > -1 && upvote < lessVoteNumber) {
            message = `屏蔽低赞内容: ${upvote}赞`;
          }
        }
        fnJustNum(elementThis);
        // 最后信息 & 起点位置处理
        message && (lessNum = fnHiddenDom(lessNum, elementThis, message));
        this.index = fnIndexMath(this.index, i, len, lessNum);
      }
    },
    reset: function () {
      this.index = 0;
    },
    restart: function () {
      this.reset();
      this.init();
    },
  };

  /** 监听详情回答 - 过滤 */
  const myListenAnswerItem = {
    index: 0,
    init: function () {
      myListenSelect.addSort();
      const {
        removeLessVoteDetail,
        lessVoteNumberDetail,
        answerOpen,
        removeZhihuOfficial,
        removeBlockUserContent,
        removeBlockUserContentList,
        showBlockUser,
        removeAnonymousAnswer,
      } = pfConfig;
      if (dom('.QuestionAnswer-content')) {
        pfConfig.answerItemCreatedAndModifiedTime && addTimes(dom('.QuestionAnswer-content'));
        showBlockUser && myBlack.addButton(dom('.QuestionAnswer-content'));
      }
      const hiddenTags = Object.keys(HIDDEN_ANSWER_TAG);
      // 屏蔽用户名称列表
      let hiddenUsers = [];
      for (let i in HIDDEN_ANSWER_ACCOUNT) {
        pfConfig[i] && hiddenUsers.push(HIDDEN_ANSWER_ACCOUNT[i]);
      }
      removeBlockUserContent && (hiddenUsers = hiddenTags.concat(removeBlockUserContentList.map((i) => i.name)));
      const elements = domA('.AnswersNavWrapper .List-item');
      let lessNum = 0;
      for (let i = this.index, len = elements.length; i < len; i++) {
        let message = '';
        const elementThis = elements[i];
        const elementInfo = elementThis.querySelector('.ContentItem');
        let dataZop = {};
        let dataCardContent = {}; // 回答扩展信息
        try {
          dataZop = JSON.parse(elementInfo.getAttribute('data-zop'));
          dataCardContent = JSON.parse(elementInfo.getAttribute('data-za-extra-module')).card.content;
        } catch {}
        // FIRST
        // 低赞回答过滤
        dataCardContent['upvote_num'] < lessVoteNumberDetail && removeLessVoteDetail && (message = `过滤低赞回答: ${dataCardContent['upvote_num']}赞`);
        // 屏蔽知乎官方账号回答
        if (removeZhihuOfficial && !message) {
          const labelE = elementThis.querySelector('.AuthorInfo-name .css-n99yhz');
          const label = labelE ? labelE.getAttribute('aria-label') : '';
          /知乎[\s]*官方帐号/.test(label) && (message = '已删除一条知乎官方帐号的回答');
        }
        // 屏蔽带有选中标签的回答
        let isHiddenTag = false;
        hiddenTags.forEach((i) => pfConfig[i] && (isHiddenTag = true));
        if (isHiddenTag && !message) {
          const nodeTag1 = elementThis.querySelector('.KfeCollection-AnswerTopCard-Container');
          const nodeTag2 = elementThis.querySelector('.LabelContainer-wrapper');
          const text1 = nodeTag1 ? nodeTag1.innerText : '';
          const text2 = nodeTag2 ? nodeTag2.innerText : '';
          const tagText = text1 + text2;
          hiddenTags.forEach((i) => {
            if (pfConfig[i]) {
              const nReg = new RegExp(HIDDEN_ANSWER_TAG[i]);
              nReg.test(tagText) && (message = `已删除一条标签${HIDDEN_ANSWER_TAG[i]}的回答`);
            }
          });
        }
        // 屏蔽用户 | 知乎账号的回答
        hiddenUsers.length && !message && hiddenUsers.includes(dataZop.authorName) && (message = `已删除${dataZop.authorName}的回答`);
        // 屏蔽「匿名用户」回答
        if (removeAnonymousAnswer && !message) {
          const userName = elementThis.querySelector('[itemprop="name"]').content;
          userName === '匿名用户' && (message = `已屏蔽一条「匿名用户」回答`);
        }
        // 自动展开回答 和 默认收起长回答
        if (!message && answerOpen) {
          const unFoldButton = elementThis.querySelector('.ContentItem-expandButton');
          const foldButton = elementThis.querySelector('.RichContent-collapsedText');
          const isNotOpen = !elementThis.classList.contains(OB_CLASS_FOLD.on);
          const isNotClose = !elementThis.classList.contains(OB_CLASS_FOLD.off);
          if (answerOpen === 'on' && isNotOpen) {
            unFoldButton.click();
            elementThis.classList.add(OB_CLASS_FOLD.on);
            lessNum++;
          }
          const isF = foldButton && elementThis.offsetHeight > 939;
          const isFC = unFoldButton; // 已经收起的回答
          if (answerOpen === 'off' && isNotClose && (isF || isFC)) {
            elementThis.classList.add(OB_CLASS_FOLD.off);
            isF && foldButton.click();
            lessNum++;
          }
        }
        fnJustNum(elementThis);
        if (!message) {
          // 添加回答时间
          pfConfig.answerItemCreatedAndModifiedTime && addTimes(elementThis);
          // 添加「屏蔽用户」按钮
          showBlockUser && myBlack.addButton(elementThis, this);
        }

        // 最后信息 & 起点位置处理
        message && (lessNum = fnHiddenDom(lessNum, elementThis, message));
        this.index = fnIndexMath(this.index, i, len, lessNum);
      }
    },
    reset: function () {
      this.index = 0;
    },
    restart: function () {
      this.reset();
      this.init();
    },
  };

  /** 回答排序 */
  const myListenSelect = {
    isSortFirst: true,
    observer: null,
    keySort: 'default',
    /** 添加回答排序 */
    answerSortIds: {
      'Select1-0': { key: 'default', name: '默认排序' },
      'Select1-1': { key: 'update', name: '按时间排序' },
      'Select1-2': { key: 'vote', name: '点赞数排序' },
      'Select1-3': { key: 'comment', name: '评论数排序' },
    },
    sortKeys: { vote: '点赞数排序', comment: '评论数排序' },
    /** 加载监听问题详情里的.Select-button按钮 */
    init: function () {
      const classSelectButton = '.Select-button';
      if (this.keySort === 'vote' || this.keySort === 'comment') {
        dom(classSelectButton).innerHTML = dom(classSelectButton).innerHTML.replace(/[\u4e00-\u9fa5]+(?=<svg)/, this.sortKeys[this.keySort]);
      }
      const clickSort = (id) => {
        myListenAnswerItem.reset();
        const { key, name } = this.answerSortIds[id];
        this.keySort = key;
        dom(classSelectButton).innerHTML = dom(classSelectButton).innerHTML.replace(/[\u4e00-\u9fa5]+(?=<svg)/, name);
        if (key === 'vote' || key === 'comment') {
          location.href = href.replace(/(?<=question\/\d+)[?\/][\w\W]*/, '') + '?sort=' + key;
        } else if (key === 'default') {
          /\?sort=/.test(href) && (location.href = href.replace(/(?<=question\/\d+)[?\/][\w\W]*/, ''));
        }
      };

      if (dom(classSelectButton)) {
        try {
          this.observer.disconnect();
        } catch {}
        const buConfig = { attribute: true, attributeFilter: ['aria-expanded'] };
        this.observer = new MutationObserver(() => {
          const elementSelect = dom('.Answers-select');
          if (dom(classSelectButton).getAttribute('aria-expanded') === 'true' && elementSelect) {
            elementSelect.appendChild(domC('button', { className: 'Select-option', tabindex: '-1', role: 'option', id: 'Select1-2', innerHTML: '点赞数排序' }));
            elementSelect.appendChild(domC('button', { className: 'Select-option', tabindex: '-1', role: 'option', id: 'Select1-3', innerHTML: '评论数排序' }));
            domA('.Select-option').forEach((ev) => {
              ev.onclick = () => clickSort(ev.id);
            });
          }
        });
        this.observer.observe(dom(classSelectButton), buConfig);
      }
    },
    addSort: function () {
      // 排序列表
      // 因为知乎并没有开放点赞数和评论排序参数，所以只能每次加载后按照当前的数据进行页面排序
      // 为了防止页面错乱，只对前20条进行排序
      const keySort = this.keySort;
      if ((keySort === 'vote' || keySort === 'comment') && this.isSortFirst) {
        const element = dom('.List>div:nth-child(2)>div');
        const arrElement = Array.from(element.querySelectorAll('.List-item:not(.PlaceHolder)')).sort((a, b) => {
          const aContent = a.querySelector('.AnswerItem').getAttribute('data-za-extra-module')
            ? JSON.parse(a.querySelector('.AnswerItem').getAttribute('data-za-extra-module')).card.content
            : {};
          const bContent = b.querySelector('.AnswerItem').getAttribute('data-za-extra-module')
            ? JSON.parse(b.querySelector('.AnswerItem').getAttribute('data-za-extra-module')).card.content
            : {};
          switch (keySort) {
            case 'vote':
              return aContent.upvote_num - bContent.upvote_num;
            case 'comment':
              return aContent.comment_num - bContent.comment_num;
            default:
              return true;
          }
        });
        element.querySelector('.List-item:not(.PlaceHolder)') && element.querySelector('.List-item:not(.PlaceHolder)').remove();
        const eleFirst = element.querySelector(':first-child');
        arrElement.forEach((item, index) => {
          element.insertBefore(item, index === 0 ? eleFirst : arrElement[index - 1]);
        });
        this.isSortFirst = false;
      }
    },
  };

  /** 黑名单用户操作方法 */
  const myBlack = {
    messageCancel: '取消屏蔽之后，对方将可以：关注你、给你发私信、向你提问、评论你的答案、邀请你回答问题。',
    /** 初始化黑名单列表 */
    init: function () {
      const me = this;
      const elementBlock = domById(ID_BLOCK_LIST);
      elementBlock.innerHTML = pfConfig.removeBlockUserContentList.map((i) => this.createItem(i)).join('');
      elementBlock.onclick = (event) => {
        if (!event.target.classList.contains(CLASS_REMOVE_BLOCK)) return;
        const item = event.target.parentElement;
        const info = item.dataset.info ? JSON.parse(item.dataset.info) : {};
        confirm(me.messageCancel) && me.serviceRemove(info);
      };
    },
    /** 黑名单元素 */
    createItem: function (info) {
      return `<div class="ctz-black-item ctz-black-id-${info.id}" data-info='${JSON.stringify(info)}'>${this.createItemContent(info)}</div>`;
    },
    createItemContent: ({ id, name, avatar }) => {
      return `<img src="${avatar}"/><a href="/people/${id}" target="_blank">${name}</a><i class="ctz-icon ${CLASS_REMOVE_BLOCK}" style="margin-left:4px;cursor:pointer;">&#xe607;</i>`;
    },
    /** 添加「屏蔽用户」按钮，第二个参数为监听方法对象 */
    addButton: function (event, objMy) {
      const me = this;
      const classBox = 'ctz-block-box';
      event.querySelector(`.${classBox}`) && event.querySelector(`.${classBox}`).remove();
      const nodeUser = event.querySelector('.AnswerItem-authorInfo>.AuthorInfo');
      if (!nodeUser || !nodeUser.offsetHeight) return;
      const userUrl = nodeUser.querySelector('meta[itemprop="url"]').content;
      const userName = nodeUser.querySelector('meta[itemprop="name"]').content;
      const avatar = nodeUser.querySelector('meta[itemprop="image"]').content;
      const aContent = event.querySelector('.AnswerItem').getAttribute('data-za-extra-module')
        ? JSON.parse(event.querySelector('.AnswerItem').getAttribute('data-za-extra-module')).card.content
        : {};
      const userId = aContent.author_member_hash_id || '';
      if (!userUrl.replace(/https:\/\/www.zhihu.com\/people\//, '')) return;
      const { removeBlockUserContentList } = pfConfig;
      const isAlreadyBlack = removeBlockUserContentList.findIndex((i) => i.id === userId) >= 0;
      const message = `是否要屏蔽${userName}？\n屏蔽后，对方将不能关注你、向你发私信、评论你的实名回答、使用「@」提及你、邀请你回答问题，但仍然可以查看你的公开信息。\n如果开启了「不再显示已屏蔽用户发布的内容」那么也不会看到对方发布的回答`;
      const classBlack = 'ctz-black';
      const classBlackRemove = 'ctz-black-remove';
      const classBlackFilter = 'ctz-black-filter';
      const classJustFilter = 'ctz-just-filter';
      const innerHTML = isAlreadyBlack
        ? `<button class="${classBlackRemove}">解除屏蔽</button>` + fnReturnStr(`<button class="${classJustFilter}">隐藏该回答</button>`, !!objMy)
        : `<button class="${classBlack}">屏蔽用户</button>` + fnReturnStr(`<button class="${classBlackFilter}">屏蔽用户并隐藏该回答</button>`, !!objMy);
      const nodeBox = domC('div', { className: classBox, innerHTML });
      nodeBox.onclick = function ({ target }) {
        const urlToken = userUrl.match(/(?<=people\/)[\w\W]+/)[0];
        // 屏蔽用户
        if (target.classList.contains(classBlack)) {
          if (!confirm(message)) return;
          me.serviveAdd(urlToken, userName, userId, avatar);
          fnDomReplace(this.querySelector(`.${classBlackFilter}`), { className: classJustFilter, innerText: '隐藏该回答' });
          fnDomReplace(target, { className: classBlackRemove, innerText: '解除屏蔽' });
          return;
        }
        // 解除屏蔽
        if (target.classList.contains(classBlackRemove)) {
          if (!confirm(me.messageCancel)) return;
          me.serviceRemove({ urlToken, id: userId, name: userName });
          fnDomReplace(target, { className: classBlack, innerText: '屏蔽用户' });
          fnDomReplace(this.querySelector(`.${classJustFilter}`), { className: classBlackFilter, innerText: '屏蔽用户并隐藏该回答' });
          return;
        }
        // 屏蔽并隐藏回答
        if (target.classList.contains(classBlackFilter) || target.classList.contains(classJustFilter)) {
          if (target.classList.contains(classBlackFilter)) {
            if (!confirm(message)) return;
            me.serviveAdd(urlToken, userName, userId, avatar);
          }
          event.style.display = 'none';
          objMy.index = objMy.index - 1 > 0 ? objMy.index - 1 : 0;
          return;
        }
      };
      nodeUser.appendChild(nodeBox);
    },
    /** 添加屏蔽用户 */
    addBlackItem: function (info) {
      pfConfig.removeBlockUserContentList.push(info);
      myStorage.set('pfConfig', JSON.stringify(pfConfig));
      const nodeBlackItem = domC('div', { className: `ctz-black-item ctz-black-id-${info.id}`, innerHTML: this.createItemContent(info) });
      nodeBlackItem.dataset.info = JSON.stringify(info);
      domById(ID_BLOCK_LIST).appendChild(nodeBlackItem);
    },
    /** 调用「屏蔽用户」接口 */
    serviveAdd: function (urlToken, userName, userId, avatar) {
      const me = this;
      fetch(`/api/v4/members/${urlToken}/actions/block`, {
        method: 'POST',
        headers: new Headers({
          ...storageConfig.fetchHeaders,
          'x-xsrftoken': document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)[0],
        }),
      }).then(() => {
        me.addBlackItem({ id: userId, name: userName, avatar, userType: 'people', urlToken });
      });
    },
    /** 解除拉黑用户接口 */
    serviceRemove: function (info) {
      const { urlToken, id } = info;
      fetch(`/api/v4/members/${urlToken}/actions/block`, {
        method: 'DELETE',
        headers: new Headers({
          ...storageConfig.fetchHeaders,
          'x-xsrftoken': document.cookie.match(/(?<=_xsrf=)[\w-]+(?=;)/)[0],
        }),
      }).then(() => {
        const itemIndex = pfConfig.removeBlockUserContentList.findIndex((i) => i.id === info.id);
        if (itemIndex >= 0) {
          const nRemoveBlockUserContentList = pfConfig.removeBlockUserContentList;
          nRemoveBlockUserContentList.splice(itemIndex, 1);
          pfConfig.removeBlockUserContentList = nRemoveBlockUserContentList;
          const removeItem = dom(`.ctz-black-id-${id}`);
          removeItem && removeItem.remove();
          myStorage.set('pfConfig', JSON.stringify(pfConfig));
        }
      });
    },
    /** 同步黑名单列表 */
    sync: function (offset = 0, l = []) {
      !l.length && (domById(ID_BLOCK_LIST).innerHTML = '');
      fnDomReplace(domById(ID_BUTTON_SYNC_BLOCK), { innerHTML: '<i class="ctz-icon ctz-loading">&#xe605;</i>', disabled: true });
      const limit = 20;
      fetch(`/api/v3/settings/blocked_users?offset=${offset}&limit=${limit}`, {
        method: 'GET',
        headers: new Headers({
          ...storageConfig.fetchHeaders,
        }),
      })
        .then((response) => response.json())
        .then(({ data, paging }) => {
          data.forEach(({ id, name, avatar_url, user_type, url_token }) => {
            l.push({ id, name, avatar: avatar_url, userType: user_type, urlToken: url_token });
          });
          if (!paging.is_end) {
            this.sync((offset + 1) * limit, l);
          } else {
            pfConfig.removeBlockUserContentList = l;
            myStorage.set('pfConfig', JSON.stringify(pfConfig));
            myBlack.init();
            fnDomReplace(domById(ID_BUTTON_SYNC_BLOCK), { innerHTML: '同步黑名单', disabled: false });
          }
        });
    },
  };

  /** 绑定页面元素的点击拖动方法 */
  const myMove = {
    init: function (eventName, configName, name) {
      const e = dom(eventName);
      // 保存当前元素点击事件
      if (e) {
        this.clicks[configName] = e.click;
        e.onmousedown = (ev) => {
          // 固定则跳出
          if (pfConfig[`${name}Fixed`]) return;
          const event = window.event || ev;

          const bodyW = document.body.offsetWidth;
          const windowW = window.innerWidth;
          const windowH = window.innerHeight;
          const eW = e.offsetWidth;
          const eH = e.offsetHeight;
          const eL = e.offsetLeft;
          const eT = e.offsetTop;
          const evX = event.clientX;
          const evY = event.clientY;

          const dx = evX - eL;
          const dy = evY - eT;
          const rx = eW + eL - evX;
          // 按下拖动
          document.onmousemove = (ev) => {
            const eventN = window.event || ev;
            const evNX = eventN.clientX;
            let evenLeft = 0;
            let evenRight = 0;
            const isR = this.useR.find((i) => i === name);
            if (isR) {
              // 用 body 替代 window 获取宽度来解决右侧滚动条宽度不一致问题
              const right = bodyW - evNX - rx;
              evenRight = right <= 0 ? 0 : right >= bodyW - eW ? bodyW - eW : right;
              e.style.right = evenRight + 'px';
            } else {
              const left = evNX - dx;
              evenLeft = left <= 0 ? 0 : left >= windowW - eW ? windowW - eW : left;
              e.style.left = evenLeft + 'px';
            }
            const top = eventN.clientY - dy;
            const evenTop = top <= 0 ? 0 : top >= windowH - eH ? windowH - eH : top;
            // 元素不能超过页面宽高
            e.style.top = evenTop + 'px';
            this.isMove = true;
            this.timer[configName] && clearTimeout(this.timer[configName]);
            this.timer[configName] = setTimeout(async () => {
              clearTimeout(this.timer[configName]);
              pfConfig[configName] = `${isR ? `right: ${evenRight}px;` : `left: ${evenLeft}px;`}top: ${evenTop}px;`;
              await myStorage.set('pfConfig', JSON.stringify(pfConfig));
            }, 500);
          };

          // 抬起停止拖动
          document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
            e.onclick = (e) => {
              // 如果模块被移动则移除默认点击事件
              // 否则返回原有点击事件
              if (this.isMove) {
                this.isMove = false;
                return e.preventDefault && e.preventDefault();
              } else {
                return this.clicks[configName];
              }
            };
          };
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            return false;
          }
        };
      }
    },
    destroy: function (eventName) {
      const e = dom(eventName);
      e && (e.onmousedown = null);
    },
    isMove: false,
    clicks: {},
    timer: {},
    useL: ['suspensionHomeTab', 'suspensionFind', 'suspensionSearch'], // 使用left定位的name
    useR: ['suspensionUser'], // 使用right定位的name
  };

  /** 悬浮模块开关锁添加移除方法 */
  const myLock = {
    append: function (e, name) {
      // 悬浮模块是否固定改为鼠标放置到模块上显示开锁图标 点击即可移动模块
      if (!e) return;
      const lock = this.lock.class;
      const unlock = this.unlock.class;
      const lockMask = this.lockMask.class;
      const classRemove = 'ctz-move-this';
      const iLock = domC('i', { className: `ctz-icon ${this.lock.name}`, innerHTML: '&#xe700;' });
      const iUnlock = domC('i', { className: `ctz-icon ${this.unlock.name}`, innerHTML: '&#xe688;' });
      const dLockMask = domC('div', { className: this.lockMask.name });
      !e.querySelector(lock) && e.appendChild(iLock);
      !e.querySelector(unlock) && e.appendChild(iUnlock);
      !e.querySelector(lockMask) && e.appendChild(dLockMask);
      e.querySelector(lock).onclick = async () => {
        pfConfig[name + 'Fixed'] = true;
        await myStorage.set('pfConfig', JSON.stringify(pfConfig));
        e.classList.remove(classRemove);
      };
      e.querySelector(unlock).onclick = async () => {
        pfConfig[name + 'Fixed'] = false;
        await myStorage.set('pfConfig', JSON.stringify(pfConfig));
        e.classList.add(classRemove);
      };
      // 如果进入页面的时候该项的 FIXED 为 false 则添加 class
      if (pfConfig[name + 'Fixed'] === false) {
        e.classList.add(classRemove);
      }
    },
    remove: function (e) {
      if (!e) return;
      const lock = this.lock.class;
      const unlock = this.unlock.class;
      const lockMask = this.lockMask.class;
      e.querySelector(lock) && e.querySelector(lock).remove();
      e.querySelector(unlock) && e.querySelector(unlock).remove();
      e.querySelector(lockMask) && e.querySelector(lockMask).remove();
    },
    lock: { class: '.ctz-lock', name: 'ctz-lock' },
    unlock: { class: '.ctz-unlock', name: 'ctz-unlock' },
    lockMask: { class: '.ctz-lock-mask', name: 'ctz-lock-mask' },
  };

  /** 视频的操作方法|下载 */
  const myVideo = {
    index: 0,
    timeout: null,
    init: function () {
      this.timeout && clearTimeout(this.timeout);
      if (this.index < 30) {
        this.timeout = setTimeout(() => {
          clearTimeout(this.timeout);
          if (domA('#player video').length) {
            this.index = 0;
            domA('#player>div').forEach((even) => {
              const elementDownload = domC('i', { className: 'ctz-icon ctz-video-download', innerHTML: '&#xe608;' });
              const elementLoading = domC('i', { className: 'ctz-icon ctz-loading', innerHTML: '&#xe605;' });
              elementDownload.onclick = () => {
                const url = elementDownload.parentElement.parentElement.querySelector('video').src;
                if (url) {
                  elementDownload.style.display = 'none';
                  even.appendChild(elementLoading);
                  const name = url.match(/(?<=\/)[\d\w-\.]+(?=\?)/)[0];
                  videoDownload(url, name).then(() => {
                    elementDownload.style.display = 'block';
                    elementLoading.remove();
                  });
                }
              };
              even.querySelector('.ctz-video-download') && even.querySelector('.ctz-video-download').remove();
              even.appendChild(elementDownload);
            });
          } else {
            this.init();
            this.index++;
          }
        }, 500);
      }
    },
  };

  /** 屏蔽页面设置 */
  const myPageFilterSetting = {
    timeout: null,
    init: function () {
      this.timeout && clearTimeout(this.timeout);
      if (/\/settings\/filter/.test(pathname)) {
        this.timeout = setTimeout(() => {
          this.addHTML();
          this.init();
        }, 500);
      }
    },
    addHTML: () => {
      const elementButton = domC('button', {
        className: 'ctz-button',
        style: 'margin-left: 12px;',
        innerHTML: '移除当前页所有屏蔽话题',
      });
      elementButton.onclick = () => {
        domA('.Tag button').forEach((item) => item.click());
      };
      domA('.css-j2uawy').forEach((item) => {
        if (/已屏蔽话题/.test(item.innerText) && !item.querySelector('.ctz-button')) {
          item.appendChild(elementButton);
        }
      });
    },
  };

  /** 收藏夹打印 */
  const myCollectionExport = {
    init: function () {
      const elementBox = domC('div', { className: this.className, innerHTML: this.element });
      dom(`.${this.className}`) && dom(`.${this.className}`).remove();
      const elementTypeSpan = this.elementTypeSpan;
      elementBox.querySelector('[name="ctz-export-collection"]').onclick = function () {
        this.innerText = '加载中...';
        this.disabled = true;
        const id = pathname.match(/(?<=\/collection\/)\d+/)[0];
        const offset = 20 * (dom('.Pagination .PaginationButton--current') ? Number(dom('.Pagination .PaginationButton--current').innerText) - 1 : 0);

        fetch(`/api/v4/collections/${id}/items?offset=${offset}&limit=20`, {
          method: 'GET',
          headers: new Headers({
            ...storageConfig.fetchHeaders,
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((res) => {
            const collectionsHTMLMap = (res.data || []).map((item) => {
              const { type, url, question, content, title } = item.content;
              switch (type) {
                case 'zvideo':
                  return (
                    `<div class="ctz-pdf-dialog-item">` +
                    `<div class="ctz-pdf-dialog-title">${elementTypeSpan(type)}${title}</div>` +
                    `<div>视频链接：<a href="${url}" target="_blank">${url}</a></div>` +
                    `</div>`
                  );
                case 'answer':
                case 'article':
                default:
                  return (
                    `<div class="ctz-pdf-dialog-item">` +
                    `<div class="ctz-pdf-dialog-title">${elementTypeSpan(type)}${title || question.title}</div>` +
                    `<div>内容链接：<a href="${url}" target="_blank">${url}</a></div>` +
                    `<div>${content}</div>` +
                    `</div>`
                  );
              }
            });

            const iframe = dom('.ctz-pdf-box-content');
            const collectionsHTML = collectionsHTMLMap.join('');
            const doc = iframe.contentWindow.document;
            doc.body.innerHTML = '';
            if (!doc.head.querySelector('style')) {
              doc.write(`<style type="text/css" id="ctz-css-own">${INNER_CSS}</style>`);
            }
            doc.write(`<div class="ctz-pdf-view">${collectionsHTML}</div>`);

            // 检测图片是否都加载完全 解决打印不全的情况
            const imgLoadPromises = [];
            doc.querySelectorAll('img').forEach((item) => {
              imgLoadPromises.push(
                new Promise((resolve, reject) => {
                  item.onload = function () {
                    resolve(true);
                  };
                })
              );
            });

            Promise.all(imgLoadPromises).then(() => {
              // 图片加载完成后调用打印方法
              this.innerText = '生成PDF';
              this.disabled = false;
              iframe.contentWindow.print();
            });
          });
      };
      dom('.CollectionDetailPageHeader-title') && dom('.CollectionDetailPageHeader-title').appendChild(elementBox);
    },
    className: 'ctz-export-collection-box',
    element:
      `<button class="ctz-button" name="ctz-export-collection">生成PDF</button>` +
      `<p>仅对当前页码收藏夹内容进行导出</p>` +
      `<p>图片内容过多时请耐心等待</p>` +
      `<p>如果点击没有生成PDF请刷新页面</p>`,
    elementTypeSpan: (type) => {
      const typeObj = {
        zvideo: '<span class="ctz-label-tag" style="color: #12c2e9;">视频</span>',
        answer: '<span class="ctz-label-tag" style="color: #ec7259;">问答</span>',
        article: '<span class="ctz-label-tag" style="color: #00965e;">文章</span>',
      };
      return typeObj[type] || '';
    },
  };

  /** 关注的内容一键移除 */
  const myFollowRemove = {
    init: function () {
      const me = this;
      clearTimeout(me.timer);
      me.timer = setTimeout(() => {
        pathnameHasFn({
          questions: () => me.addButtons(this.classOb.questions),
          // topics: () => me.addButtons(this.classOb.topics), // 话题跳转页面内会重定向，暂时隐藏
          collections: () => me.addButtons(this.classOb.collections),
        });
      }, 500);
    },
    addButtons: function (initTypeOb) {
      const me = this;
      const { classNameItem, classHref, ctzType } = initTypeOb;
      domA(`.${classNameItem}`).forEach((item) => {
        const elementButton = domC('button', {
          className: `${me.className} ${me.classNameRemove} ctz-button-block`,
          innerText: '移除关注',
          style: 'height: 28px;position: absolute;right: 16px;bottom: 16px;',
        });
        elementButton.onclick = function () {
          const nItem = domP(this, 'class', classNameItem);
          const qHref = nItem.querySelector(classHref) ? nItem.querySelector(classHref).href : '';
          if (!qHref) return;
          const nHref = qHref + `?ctzType=${ctzType}`;
          window.open(nHref);
          if (this.classList.contains(me.classNameRemove)) {
            this.innerText = '添加关注';
            this.classList.remove(me.classNameRemove);
          } else {
            this.innerText = '移除关注';
            this.classList.add(me.classNameRemove);
          }
        };
        item.querySelector(`.${me.className}`) && item.querySelector(`.${me.className}`).remove();
        item.appendChild(elementButton);
      });
    },
    className: 'ctz-remove-follow',
    classNameRemove: 'ctz-button-red',
    classOb: {
      questions: {
        // 关注的问题
        classNameItem: 'List-item',
        classHref: '.QuestionItem-title a',
        ctzType: 1,
      },
      topics: {
        // 关注的话题
        classNameItem: 'List-item',
        classHref: '.ContentItem-title .TopicLink',
        ctzType: 2,
      },
      collections: {
        // 关注的收藏夹
        classNameItem: 'List-item',
        classHref: '.ContentItem-title a',
        ctzType: 3,
      },
    },
    timer: null,
  };

  /** 路径上存在 ctzType的操作 */
  const myCtzTypeOperation = {
    init: function () {
      const params = new URLSearchParams(search);
      let ctzType = params.get('ctzType');
      this[ctzType] && this[ctzType]();
    },
    1: () => {
      // 移除、关注问题并关闭网页
      dom('.QuestionButtonGroup button') && dom('.QuestionButtonGroup button').click();
      window.close();
    },
    2: () => {
      // 移除、关注话题并关闭网页
      dom('.TopicActions .FollowButton') && dom('.TopicActions .FollowButton').click();
      window.close();
    },
    3: () => {
      // 移除、关注收藏夹并关闭网页
      dom('.CollectionDetailPageHeader-actions .FollowButton') && dom('.CollectionDetailPageHeader-actions .FollowButton').click();
      window.close();
    },
  };

  /** 仅显示数字内容 */
  const fnJustNum = (element) => {
    if (!element) return;
    const { justVoteNum, justCommitNum } = pfConfig;
    const nodeVoteup = element.querySelector('.VoteButton--up');
    if (justVoteNum && nodeVoteup) {
      nodeVoteup.style = 'font-size: 14px!important;';
      nodeVoteup.innerHTML = nodeVoteup.innerHTML.replace('赞同 ', '');
    }
    if (justCommitNum) {
      const buttons = element.querySelectorAll('.ContentItem-actions button');
      for (let i = 0; i < buttons.length; i++) {
        const buttonThis = buttons[i];
        if (buttonThis.innerHTML.includes('条评论')) {
          buttonThis.style = 'font-size: 14px!important;margin-top:-5px;';
          buttonThis.innerHTML = buttonThis.innerHTML.replace('条评论', '');
        }
      }
    }
  };

  /** 视频下载 */
  const videoDownload = async (url, name) => {
    return fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const objectUrl = window.URL.createObjectURL(blob);
        const elementA = domC('a', {
          download: name,
          href: objectUrl,
        });
        elementA.click();
        window.URL.revokeObjectURL(objectUrl);
        elementA.remove();
      });
  };

  /** 启用知乎默认的黑暗模式 */
  const onUseThemeDark = () => {
    dom('html').setAttribute('data-theme', myBackground.isUseDark() ? 'dark' : 'light');
  };

  /** 回填数据，供每次打开使用 */
  const echoData = () => {
    const textSameName = {
      globalTitle: (e) => (e.value = pfConfig.globalTitle || document.title),
      customizeCss: (e) => (e.value = pfConfig['customizeCss']),
    };
    const echoText = (even) => {
      textSameName[even.name] ? textSameName[even.name](even) : (even.value = pfConfig[even.name]);
    };
    const echo = {
      radio: (even) => pfConfig.hasOwnProperty(even.name) && even.value === pfConfig[even.name] && (even.checked = true),
      checkbox: (even) => (even.checked = pfConfig[even.name] || false),
      'select-one': (even) => {
        if (pfConfig[even.name]) {
          for (let i = 0; i < even.length; i++) {
            if (even[i].value === pfConfig[even.name]) {
              even[i].selected = true;
            }
          }
        }
      },
      text: echoText,
      number: echoText,
      range: (even) => {
        const nValue = pfConfig[even.name];
        const rangeNum = isNaN(+nValue) || !(+nValue > 0) ? dom(`[name="${even.name}"]`).min : nValue;
        even.value = rangeNum;
        domById(even.name).innerText = rangeNum;
      },
    };
    const doEcho = (item) => {
      echo[item.type] && echo[item.type](item);
    };
    domA(`.${CLASS_INPUT_CLICK}`).forEach(doEcho);
    domA(`.${CLASS_INPUT_CHANGE}`).forEach(doEcho);
    echo.text(dom('[name="globalTitle"]'));
  };

  /** 回填历史记录 */
  const echoHistory = () => {
    const { list, view } = pfHistory;
    dom('#CTZ_SET_HISTORY_LIST .ctz-set-content').innerHTML = list.join('<br/>');
    dom('#CTZ_SET_HISTORY_VIEW .ctz-set-content').innerHTML = view.join('<br/>');
  };

  /** 更改编辑器方法 */
  const fnChanger = async (ev) => {
    // onchange 时只调用 myVersion 的 name
    const doCssVersion = [
      'questionTitleTag',
      'fixedListItemMore',
      'linkShopping',
      'highlightListItem',
      'zoomImageType',
      'zoomImageSize',
      'versionHome',
      'versionAnswer',
      'versionArticle',
      'fontSizeForList',
      'fontSizeForAnswer',
      'fontSizeForArticle',
      'zoomListVideoType',
      'zoomListVideoSize',
    ];
    const { name, value, checked, type } = ev;
    const ob = {
      colorBackground: () => {
        myVersion.change();
        myBackground.init();
        myListenListItem.restart();
        onUseThemeDark();
      },
      suspensionHomeTab: () => {
        myVersion.change();
        changeSuspensionTab();
      },
      suspensionFind: cacheHeader,
      suspensionSearch: cacheHeader,
      suspensionUser: cacheHeader,
      titleIco: changeICO,
      showGIFinDialog: previewGIF,
      questionCreatedAndModifiedTime: addQuestionCreatedAndModifiedTime,
      highlightOriginal: () => {
        myListenListItem.restart();
      },
      listOutPutNotInterested: () => {
        myListenListItem.restart();
      },
      articleCreateTimeToTop: addArticleCreateTimeToTop,
      linkAnswerVideo: () => {
        myVersion.change();
        zoomVideos();
      },
    };

    pfConfig[name] = type === 'checkbox' ? checked : value;
    await myStorage.set('pfConfig', JSON.stringify(pfConfig));
    type === 'range' && domById(name) && (domById(name).innerText = value);
    if (/^hidden/.test(name)) {
      myHidden.init();
      return;
    }
    if (doCssVersion.includes(name)) {
      myVersion.change();
      return;
    }
    ob[name] && ob[name]();
  };

  /** 在重置数据时调用 */
  const resetData = () => {
    onInitStyleExtra();
    initData();
    onUseThemeDark();
  };

  /** 查找是否使用主题 */
  const findTheme = () => {
    // 开始进入先修改一次
    onUseThemeDark();
    const elementHTML = dom('html');
    const muConfig = { attribute: true, attributeFilter: ['data-theme'] };
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

  /** 时间格式化 */
  const timeFormatter = (time, formatter = 'YYYY-MM-DD HH:mm:ss') => {
    if (!time) return '';
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    const preArr = (num) => (String(num).length !== 2 ? '0' + String(num) : String(num));
    return formatter
      .replace(/YYYY/g, year)
      .replace(/MM/g, preArr(month))
      .replace(/DD/g, preArr(day))
      .replace(/HH/g, preArr(hour))
      .replace(/mm/g, preArr(min))
      .replace(/ss/g, preArr(sec));
  };

  /** 问题添加时间 */
  const addTimes = (event) => {
    const className = 'ctz-list-item-time';
    event.querySelector(`.${className}`) && event.querySelector(`.${className}`).remove();
    const crTime = event.querySelector('[itemprop="dateCreated"]') ? event.querySelector('[itemprop="dateCreated"]').content : '';
    const puTime = event.querySelector('[itemprop="datePublished"]') ? event.querySelector('[itemprop="datePublished"]').content : '';
    const muTime = event.querySelector('[itemprop="dateModified"]') ? event.querySelector('[itemprop="dateModified"]').content : '';
    const created = timeFormatter(crTime || puTime);
    const modified = timeFormatter(muTime);
    if (!created || !event.querySelector('.ContentItem-meta')) return;
    event.querySelector('.ContentItem-meta').appendChild(
      domC('div', {
        className,
        style: 'line-height: 24px;padding-top: 6px;',
        innerHTML: `<div>创建时间：${created}</div><div>最后修改时间：${modified}</div>`,
      })
    );
  };

  /** 问题详情添加时间 */
  const addQuestionCreatedAndModifiedTime = () => {
    const className = 'ctz-question-time';
    dom(`.${className}`) && dom(`.${className}`).remove();
    if (!(pfConfig.questionCreatedAndModifiedTime && dom('[itemprop="dateCreated"]'))) return;
    const created = timeFormatter(dom('[itemprop="dateCreated"]').content);
    const modified = timeFormatter(dom('[itemprop="dateModified"]').content);
    dom('.QuestionPage .QuestionHeader-title').appendChild(
      domC('div', {
        className,
        innerHTML: `<div>创建时间：${created}</div><div>最后修改时间：${modified}</div>`,
      })
    );
  };

  /** 文章发布时间置顶 */
  const addArticleCreateTimeToTop = () => {
    const className = 'ctz-article-create-time';
    dom(`.${className}`) && dom(`.${className}`).remove();
    if (!(pfConfig.articleCreateTimeToTop && dom('.ContentItem-time'))) return;
    dom('.Post-Header').appendChild(
      domC('span', {
        className,
        style: 'color: #8590a6;line-height: 30px;',
        innerHTML: dom('.ContentItem-time').innerText || '',
      })
    );
  };

  /** 监听过滤内容 */
  const fnHiddenDom = (lessNum, ev, log) => {
    ev.style.display = 'none';
    fnLog(log);
    return ++lessNum;
  };

  /** 计算过滤起始位置 */
  const fnIndexMath = (index, i, len, lessNum) => {
    return i + 1 === len ? (i - lessNum >= 0 ? i - lessNum : 0) : index;
  };

  /** 调用「不感兴趣」接口 */
  const doFetchNotInterested = ({ id, type }) => {
    const nHeader = storageConfig.fetchHeaders;
    delete nHeader['vod-authorization'];
    delete nHeader['content-encoding'];
    delete nHeader['Content-Type'];
    delete nHeader['content-type'];
    fetch('/api/v3/feed/topstory/uninterestv2', {
      body: `item_brief=${encodeURIComponent(JSON.stringify({ source: 'TS', type: type, id: id }))}`,
      method: 'POST',
      headers: new Headers({
        ...nHeader,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      }),
    }).then((res) => res.json());
  };

  /** 节流, 使用时 fn 需要为 function () {} */
  function throttle(fn, time = 300) {
    let tout = null;
    return function () {
      if (tout) return;
      tout = setTimeout(() => {
        tout = null;
        fn.apply(this, arguments);
      }, time);
    };
  }

  /** 漂浮收起按钮的方法 */
  const suspensionPackUp = (elements) => {
    const RIGHT = 60;
    const { colorBackground } = pfConfig;
    for (let i = 0; i < elements.length; i++) {
      const even = elements[i];
      const evenPrev = i > 0 ? elements[i - 1] : null;
      const evenBottom = even.offsetTop + even.offsetHeight;
      const evenPrevBottom = evenPrev ? evenPrev.offsetTop + evenPrev.offsetHeight : 0;
      const hST = dom('html').scrollTop;
      // 收起按钮
      const evenButton = even.querySelector('.ContentItem-actions .ContentItem-rightButton');
      if (evenButton) {
        if (evenBottom > hST + window.innerHeight && evenPrevBottom < hST) {
          evenButton.style =
            `visibility:visible!important;position: fixed!important;bottom: 60px;` +
            `right: ${(document.body.offsetWidth - even.offsetWidth) / 2 + RIGHT}px;` +
            `box-shadow: 0 1px 3px rgb(18 18 18 / 10%);` +
            `height: 40px!important;padding: 0 12px!important;` +
            `background: ${
              myBackground.isUseDark()
                ? BACKGROUND_DARK_COLORS[colorBackground].b2
                : BACKGROUND_CONFIG[colorBackground].opacity
                ? BACKGROUND_CONFIG[colorBackground].opacity
                : colorBackground
            }!important;`;
        } else {
          evenButton.style = '';
        }
      }
    }
  };

  /** 修改网页标题 */
  const changeTitle = () => {
    document.title = pfConfig.globalTitle || storageConfig.cacheTitle;
  };

  /** 修改网页标题图片 */
  const changeICO = () => {
    const { titleIco } = pfConfig;
    const nId = 'CTZ_ICO';
    if (!ICO_URL[titleIco]) return;
    dom('[type="image/x-icon"]') && dom('[type="image/x-icon"]').remove();
    domById(nId) && domById(nId).remove();
    dom('head').appendChild(
      domC('link', {
        type: 'image/x-icon',
        href: ICO_URL[titleIco],
        id: nId,
        rel: 'icon',
      })
    );
  };

  /** 加载预览图片方法，解决部分图片无法点击预览的问题 */
  const initImagePreview = () => {
    const images = [domA('.TitleImage'), domA('.ArticleItem-image'), domA('.ztext figure .content_image')];
    images.forEach((events) => {
      events.forEach((e) => {
        const src = e.src || (e.style.backgroundImage && e.style.backgroundImage.split('("')[1].split('")')[0]);
        e.onclick = () => myPreview.open(src);
      });
    });
    if (pfConfig.zoomImageType === '2') {
      domA('.origin_image').forEach((item) => {
        item.src = item.getAttribute('data-original') || item.src;
        item.style = 'max-width: 100%;';
      });
    }
  };

  /** 视频跳转链接 */
  const zoomVideos = () => {
    if (pfConfig.linkAnswerVideo !== '1') return;
    const itemClick = (item) => {
      item.onclick = () => {
        const itemParent = domP(item, 'class', 'VideoAnswerPlayer');
        if (itemParent) {
          // 可跳转视频链接
          const videoLink = itemParent.querySelector('.VideoAnswerPlayer-video video').src;
          videoLink && window.open(videoLink);
        } else {
          // 不可跳转视频链接
          item.querySelector('.VideoCard').style = `opacity: 1;height: auto;`;
        }
      };
    };
    domA('.VideoContributionAnswer-container').forEach(itemClick);
    domA('.RichText-video').forEach(itemClick);
    domA('.VideoAnswerPlayer-stateBar').forEach(itemClick);
  };

  /** 预览动图回调 */
  const callbackGIF = (mutationsList) => {
    const target = mutationsList[0].target;
    if (!(/\bisPlaying\b/.test(target.className) && pfConfig.showGIFinDialog)) return;
    target.querySelector('video') ? myPreview.open(target.querySelector('video').src, target, true) : myPreview.open(target.querySelector('img').src, target);
  };
  const observerGIF = new MutationObserver(callbackGIF);
  /** 挂载预览 observe */
  function previewGIF() {
    // 因为 GIF 图是点击后切换到真正 GIF, 所以在点击切换后再打开弹窗
    // 使用 MutationObserver 监听元素属性变化
    if (pfConfig.showGIFinDialog) {
      const config = { attributes: true, attributeFilter: ['class'] };
      domA('.GifPlayer').forEach((event) => observerGIF.observe(event, config));
    } else {
      observerGIF.disconnect();
    }
  }

  /** 推荐列表最外层绑定事件 */
  const initTopStoryRecommendEvent = () => {
    if (!dom('.Topstory-recommend')) return;
    const classTarget = ['RichContent-cover', 'RichContent-inner', 'ContentItem-more', 'ContentItem-arrowIcon'];
    const canFindTargeted = (e) => {
      let finded = false;
      classTarget.forEach((item) => {
        (e.classList.contains(item) || e.parentElement.classList.contains(item)) && (finded = true);
      });
      return finded;
    };
    dom('.Topstory-recommend').onclick = function (event) {
      const { target } = event;
      const nodeContentItem = domP(target, 'class', 'ContentItem');
      // 点击外置「不感兴趣」按钮
      if (pfConfig.listOutPutNotInterested && target.classList.contains(CLASS_NOT_INTERESTED)) {
        const dataZopJson = nodeContentItem && nodeContentItem.getAttribute('data-zop');
        const { itemId = '', type = '' } = JSON.parse(dataZopJson || '{}');
        doFetchNotInterested({ id: itemId, type });
        domP(target, 'class', 'TopstoryItem').style.display = 'none';
      }
      // 列表内容展示更多
      if (canFindTargeted(target)) {
        setTimeout(() => {
          pfConfig.listItemCreatedAndModifiedTime && addTimes(nodeContentItem);
          pfConfig.showBlockUser && myBlack.addButton(nodeContentItem.parentElement);
        }, 0);
      }
    };
  };

  /** 缓存顶部元素 */
  const cacheHeader = () => {
    const headerEventNames = ['suspensionFind', 'suspensionSearch', 'suspensionUser'];
    if (!findEvent.header.isFind) {
      findEvent.header.fun && clearTimeout(findEvent.header.fun);
      findEvent.header.fun = setTimeout(() => {
        clearTimeout(findEvent.header.fun);
        if (findEvent.header.num < 100) {
          if (dom('.AppHeader-inner')) {
            findEvent.header.isFind = true;
            storageConfig.headerDoms = {
              suspensionFind: {
                class: '.AppHeader-inner .AppHeader-Tabs',
                even: dom('.AppHeader-inner .AppHeader-Tabs'),
                index: 1,
              },
              suspensionSearch: {
                class: '.AppHeader-inner .SearchBar',
                even: dom('.AppHeader-inner .SearchBar'),
                index: 2,
              },
              suspensionUser: {
                class: '.AppHeader-inner .AppHeader-userInfo',
                even: dom('.AppHeader-inner .AppHeader-userInfo'),
                index: 3,
              },
            };
          }
          findEvent.header.num++;
          cacheHeader();
        }
      }, 100);
      return;
    }
    const classIcon = '.ctz-search-icon';
    const classPickup = '.ctz-search-pick-up';
    const classNameFocus = 'focus';
    headerEventNames.forEach((name) => {
      const { even } = storageConfig.headerDoms[name];
      if (pfConfig[name]) {
        // 如果是 suspensionSearch 则添加展开和收起按钮
        if (name === 'suspensionSearch') {
          !dom(classIcon) && even.appendChild(domC('i', { className: 'ctz-icon ctz-search-icon', innerHTML: '&#xe600;' }));
          !dom(classPickup) && even.appendChild(domC('i', { className: 'ctz-icon ctz-search-pick-up', innerHTML: '&#xe601;' }));
          dom(classIcon).onclick = () => even.classList.add(classNameFocus);
          dom(classPickup).onclick = () => even.classList.remove(classNameFocus);
        }
        myLock.append(even, name);
        even.classList.add(`position-${name}`);
        dom('#root').appendChild(even);
      } else {
        if (name === 'suspensionSearch') {
          dom(classIcon) && dom(classIcon).remove();
          dom(classPickup) && dom(classPickup).remove();
          even.classList.remove(classNameFocus);
        }
        myLock.remove(even, name);
        even.classList.remove(`position-${name}`);
        even.setAttribute('style', '');
        dom('.AppHeader-inner').appendChild(even);
      }
      cSuspensionStyle(name);
    });
    myVersion.change();
  };

  /** 悬浮模块切换样式 */
  const cSuspensionStyle = (name) => {
    const cssObj = {
      suspensionHomeTab: '.Topstory-container .TopstoryTabs',
      suspensionFind: '.AppHeader-Tabs',
      suspensionSearch: '.SearchBar', // 搜索框使用自己添加的元素
      suspensionUser: '.AppHeader-userInfo',
    };
    if (dom(`.ctz-${name}`)) {
      dom(`.ctz-${name}`).style = pfConfig[name] ? 'display: inline-block;' : 'display: none;';
    }
    // 如果取消悬浮，则注销掉挂载的move方法
    if (cssObj[name]) {
      pfConfig[name] ? myMove.init(cssObj[name], `${name}Po`, name) : myMove.destroy(cssObj[name]);
    }
  };

  /** 改变列表切换TAB悬浮 */
  const changeSuspensionTab = () => {
    const name = 'suspensionHomeTab';
    cSuspensionStyle(name);
    const even = dom('.Topstory-container .TopstoryTabs');
    pfConfig[name] ? myLock.append(even, name) : myLock.remove(even, name);
  };

  /** 使用极简模式 */
  const useSimple = async () => {
    const isUse = confirm('是否启用极简模式？\n该功能会覆盖当前配置，建议先将配置导出保存');
    if (!isUse) return;
    pfConfig = { ...pfConfig, ...CONFIG_SIMPLE };
    await myStorage.set('pfConfig', JSON.stringify(pfConfig));
    onDocumentStart();
    initData();
  };

  /** 知乎外链直接打开(修改外链内容，去除知乎重定向) */
  const initLinkChanger = () => {
    const esName = ['a.external', 'a.LinkCard'];
    const operaLink = 'is-link-changed';
    const hrefChanger = (item) => {
      const hrefFormat = item.href.replace(/^(https|http):\/\/link\.zhihu\.com\/\?target\=/, '') || '';
      let href = '';
      // 解决 hrefFormat 格式已经是 decode 后的格式
      try {
        href = decodeURIComponent(hrefFormat);
      } catch {
        href = hrefFormat;
      }
      item.href = href;
      item.classList.add(operaLink);
    };
    esName.forEach((name) => {
      domA(`${name}:not(.${operaLink})`).forEach(hrefChanger);
    });
  };

  /** 加载额外的样式文件 */
  const onInitStyleExtra = () => {
    myHidden.init();
    myBackground.init();
    myVersion.init();
    findTheme();
  };

  /** 判断 pathname 匹配的项并运行对应方法 */
  const pathnameHasFn = (obj) => {
    for (let name in obj) {
      pathname.includes(name) && obj[name]();
    }
  };

  /** 使用 ResizeObserver 监听body高度 */
  const resizeObserver = new ResizeObserver(throttle(resizeFun, 500));
  function resizeFun() {
    if (!HTML_HOOTS.includes(hostname)) return;
    // 比较列表缓存的高度是否大于当前高度，如果大于则是从 index = 0 遍历
    if (domById('TopstoryContent')) {
      const heightTopstoageContent = domById('TopstoryContent').offsetHeight;
      if (heightTopstoageContent < storageConfig.heightForList) {
        myListenListItem.restart();
        initTopStoryRecommendEvent();
      } else {
        myListenListItem.init();
      }
      // 如果列表模块高度小于网页高度则手动触发 resize 使其加载数据
      heightTopstoageContent < window.innerHeight && window.dispatchEvent(new Event('resize'));
      storageConfig.heightForList = heightTopstoageContent;
    }

    initLinkChanger();
    previewGIF();
    initImagePreview();
    myListenSearchListItem.init();
    myListenAnswerItem.init();
    pathnameHasFn({
      question: () => {
        zoomVideos();
        myListenSelect.init();
      },
      video: () => myVideo.init(),
      collection: () => myCollectionExport.init(),
    });

    pfConfig.globalTitle !== document.title && changeTitle();
    if (pfConfig.hiddenSearchBoxTopSearch && dom('.SearchBar-input input')) {
      dom('.SearchBar-input input').placeholder = '';
    }
  }

  /** 解决视频自动播放问题 */
  const fixVideoAutoPlay = () => {
    // 拦截 video.play() 指令
    var originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      // 如果视频隐藏则退出
      if (!this.offsetHeight) {
        return;
      }
      // 否则正常执行 video.play() 指令
      return originalPlay.apply(this, arguments);
    };
  };

  /** 添加浏览历史 */
  const initHistoryView = async () => {
    const question = 'www.zhihu.com/question/';
    const article = 'zhuanlan.zhihu.com/p/';
    const video = 'www.zhihu.com/zvideo/';
    let name = href;
    setTimeout(() => {
      if (!href.includes(question) && !href.includes(article) && !href.includes(video)) return;
      href.includes(question) && dom('.QuestionPage [itemprop="name"]') && (name = dom('.QuestionPage [itemprop="name"]').content);
      href.includes(article) && dom('.Post-Title') && (name = dom('.Post-Title').innerText);
      href.includes(video) && dom('.ZVideo .ZVideo-title') && (name = dom('.ZVideo .ZVideo-title').innerText);
      const nA = `<a href="${origin + pathname}" target="_blank">${name}</a>`;
      const { view } = pfHistory;
      if (nA !== view[0]) {
        view.unshift(nA);
        pfHistory.view = view.slice(0, SAVE_HISTORY_NUMBER);
        myStorage.set('pfHistory', JSON.stringify(pfHistory));
      }
    }, 100);
  };

  /** 获取用户信息 */
  const initUserInfo = () => {
    fetch(
      `/api/v4/me?include=is_realname%2Cad_type%2Cavailable_message_types%2Cdefault_notifications_count%2Cfollow_notifications_count%2Cvote_thank_notifications_count%2Cmessages_count%2Cemail%2Caccount_status%2Cis_bind_phone%2Cfollowing_question_count%2Cis_force_renamed%2Crenamed_fullname%2Cis_destroy_waiting`,
      {
        method: 'GET',
        headers: new Headers(storageConfig.fetchHeaders),
      }
    )
      .then((response) => response.json())
      .then((res) => {
        userInfo = res || {};
      });
  };

  /** 在启动时注入的内容 */
  async function onDocumentStart() {
    if (!HTML_HOOTS.includes(hostname) || window.frameElement) return;
    if (!document.head) {
      fnLog('not find document.head, waiting for reload...');
      isHaveHeadWhenInit = false;
      return;
    }
    fixVideoAutoPlay();
    fnInitDomStyle('CTZ_STYLE', INNER_CSS);
    storageConfig.cachePfConfig = pfConfig;
    await myStorage.initConfig();
    await myStorage.initHistory();
    initHistoryView();
    onInitStyleExtra();
    EXTRA_CLASS_HTML[host] && dom('html').classList.add(EXTRA_CLASS_HTML[host]);

    // 拦截 fetch 方法, 获取 option 中的值
    const originFetch = fetch;
    unsafeWindow.fetch = (url, opt) => {
      if (/\/answers\?/.test(url) && (myListenSelect.keySort === 'vote' || myListenSelect.keySort === 'comment') && myListenSelect.isSortFirst) {
        // 如果是自定义排序则知乎回答页码增加到20条
        url = url.replace(/(?<=limit=)\d+(?=&)/, '20');
      }

      // 缓存 header
      if (opt && opt.headers) {
        storageConfig.fetchHeaders = {
          ...storageConfig.fetchHeaders,
          ...opt.headers,
        };
      }
      return originFetch(url, opt);
    };

    if (/\/question/.test(pathname) && search.match(/(?<=sort=)\w+/)) {
      myListenSelect.keySort = search.match(/(?<=sort=)\w+/)[0];
    }

    initUserInfo();
  }
  onDocumentStart();

  /** 加载基础元素及绑定方法 */
  const initHTML = () => {
    document.body.appendChild(domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML }));
    myBlack.init();
    myMenu.init();
    dom('.ctz-version').innerText = `version: ${GM_info.script.version}`;

    // 添加弹窗底部信息
    dom('.ctz-footer').innerHTML = FOOTER_HTML;

    // 添加背景色选择
    domById('CTZ_BACKGROUND').innerHTML = Object.keys(BACKGROUND_CONFIG)
      .map((key) => {
        const { name, color } = BACKGROUND_CONFIG[key];
        return (
          `<label class="ctz-bg-choose-label">` +
          `<input class="${CLASS_INPUT_CLICK}" name="colorBackground" type="radio" value="${key}"/>` +
          `<div style="background: ${key};border: 2px solid ${key};color: ${color}">${name}</div>` +
          `</label>`
        );
      })
      .join('');

    // 添加隐藏元素
    for (let key in HIDDEN_DIRECITION) {
      const arrHidden = HIDDEN_DIRECITION[key];
      if (!arrHidden || !arrHidden.length) continue;
      const elementItem = dom(`#${key}_HIDDEN>.ctz-set-content`);
      elementItem.innerHTML = arrHidden
        .map(
          (i) =>
            `${i.map(({ label, value }) => `<label><input class="ctz-i" name="${value}" type="checkbox" value="on" />${label}</label>`).join('')}` +
            `<span style="width: 100%; margin: 8px 0; background: #ddd; height: 1px; display:block"></span>`
        )
        .join('');
    }

    // 添加修改网页标题图片
    domById('CTZ_TITLE_ICO').innerHTML = Object.keys(ICO_URL)
      .map((key) => `<label><input class="ctz-i" name="titleIco" type="radio" value="${key}" /><img src="${ICO_URL[key]}" alt="${key}"></label>`)
      .join('');

    // 添加更多默认设置
    domById('CTZ_DEFAULT_SELF').innerHTML = DEFAULT_FUNCTION.map((elementItem, index) => `<div>${index + 1}. ${elementItem}</div>`).join('');

    {
      const href = userInfo.url ? userInfo.url.replace('/api/v4', '') : '';
      if (href) {
        // 保存个人主页位置
        const homeLink = domC('a', {
          href,
          target: '_blank',
          innerText: '个人主页',
        });
        dom('#CTZ_SET_BASIS .ctz-content-left').appendChild(homeLink);
      }
    }
  };

  /** 加载设置弹窗绑定方法 */
  const initOperate = () => {
    const myOperation = {
      [CLASS_INPUT_CLICK]: fnChanger,
      [CLASS_INPUT_CHANGE]: fnChanger,
      'ctz-button': (even) => myButtonOperation[even.name] && myButtonOperation[even.name](),
    };
    const operation = (even) => {
      for (let key in myOperation) {
        even.target.classList.contains(key) && myOperation[key](even.target);
      }
    };
    dom('.ctz-content').onclick = operation;
    dom('.ctz-content').onchange = operation;
    dom('.ctz-menu-top').onclick = myMenu.click;
    domA('.ctz-preview').forEach((item) => {
      item.onclick = function () {
        myPreview.hide(this);
      };
    });

    domA('[name="button_history_clear"]').forEach((item) => {
      item.onclick = async (event) => {
        const dataId = event.target.getAttribute('data-id');
        const isClear = confirm(`是否清空${event.target.innerText}`);
        if (!isClear) return;
        pfHistory[dataId] = [];
        await myStorage.set('pfHistory', JSON.stringify(pfHistory));
        echoHistory();
      };
    });

    // 绑定元素事件
    domById('CTZ_OPEN_BUTTON').onclick = myDialog.open;
    domById('CTZ_CLOSE_DIALOG').onclick = myDialog.hide;
    initTopStoryRecommendEvent();
  };

  /** 加载数据 */
  const initData = () => {
    storageConfig.cacheTitle = document.title;
    echoData();
    cacheHeader();
    changeICO();
    changeTitle();
    changeSuspensionTab();
  };

  /** 页面路由变化, 部分操作方法 */
  const changeHistory = () => {
    pathnameHasFn({
      filter: () => myPageFilterSetting.init(),
      following: () => myFollowRemove.init(),
    });
    // 重置监听起点
    myListenListItem.reset();
    myListenSearchListItem.reset();
    myListenAnswerItem.reset();
  };

  /** history 变化 */
  window.addEventListener('popstate', changeHistory);
  window.addEventListener('pushState', changeHistory);

  /** 页面滚动方法 */
  window.addEventListener(
    'scroll',
    throttle(() => {
      if (pfConfig.suspensionPickUp) {
        suspensionPackUp(domA('.List-item'));
        suspensionPackUp(domA('.TopstoryItem'));
        suspensionPackUp(domA('.AnswerCard'));
      }
    }, 100),
    false
  );

  /** 页面加载完成 */
  window.addEventListener(
    'DOMContentLoaded',
    async () => {
      // 如果脚本注入时 document.head 未加载完成则在页面渲染后重新进行加载
      if (!isHaveHeadWhenInit) {
        await onDocumentStart();
      }

      if (HTML_HOOTS.includes(hostname) && !window.frameElement) {
        // 不考虑在 iframe 中的情况
        initHTML();
        initOperate();
        initData();
        // 页面加载完成后再进行加载背景色, 解决存在顶部推广的 header 颜色
        myBackground.init();
        myVersion.initAfterLoad();
        myCustomStyle.init();
        myFilterWord.init();
        resizeObserver.observe(document.body);
        myCtzTypeOperation.init();
        echoHistory();
      }

      pathnameHasFn({
        question: () => {
          myListenSelect.init();
          addQuestionCreatedAndModifiedTime();
          fnJustNum(dom('.QuestionAnswer-content'));
        },
        video: () => myVideo.init(),
        filter: () => myPageFilterSetting.init(),
        collection: () => myCollectionExport.init(),
        following: () => myFollowRemove.init(),
      });

      if (host === 'zhuanlan.zhihu.com') {
        addArticleCreateTimeToTop();
      }
      // 如果存在登录弹窗则移除
      dom('.signFlowModal') && dom('.signFlowModal').querySelector('.Modal-closeButton').click();
      fnLog(
        `加载完毕, 加载时长: ${
          (performance.now() - T0) / 1000
        }s, 可使用 shift + . 或点击左侧眼睛按钮唤起修改器弹窗，如果快捷键不生效可以在控制台使用 window.openCtz() 唤起`
      );
    },
    false
  );

  window.addEventListener('keydown', (event) => {
    if (pfConfig.hotKey) {
      // shift + . 唤醒关闭修改器弹窗
      if (event.key === '>' || event.key === '》') {
        domById(ID_DIALOG).style.display === 'none' ? myDialog.open() : myDialog.hide();
      }
    }
    // esc 关闭弹窗
    if (event.key === 'Escape' || event.keyCode === 27) {
      myDialog.hide();
    }
  });
  unsafeWindow.openCtz = myDialog.open;
})();
