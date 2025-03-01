# 知乎修改器，一个可以自定义知乎的脚本

### <a style="color: red;" href="https://github.com/liuyubing233/zhihu-custom/blob/main/Q%26A.md">提问前请先查看问题解答，已存在解答的内容不做回复</a>

[问题解答](https://github.com/liuyubing233/zhihu-custom/blob/main/Q%26A.md)

---

移动版脚本地址：[GreasyFork](https://greasyfork.org/zh-CN/scripts/488508-%E7%9F%A5%E4%B9%8E%E4%BF%AE%E6%94%B9%E5%99%A8%E7%A7%BB%E5%8A%A8%E7%89%88-%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0) ｜ [Github](https://github.com/liuyubing233/zhihu-custom-mobile/tree/main)

---

### 注意事项：

1. safari 浏览器（苹果浏览器）请删除代码头部的 `// @grant        unsafeWindow` 一行，否则无法正常运行。

   ![safari浏览器用户删除内容](https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/safari-use.png)

2. `使用弹窗打开动图` 设置与修改图片类型的脚本或插件冲突，如果有使用修改图片的脚本不要打开此项设置。
3. 如果遇到知乎页面无法显示数据的情况请尝试关闭接口拦截。
   ![接口拦截](https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/not-fetch.png)

快捷键 >（Shift + .）唤起修改器抽屉, 或鼠标点击页面右下角齿轮按钮唤修改器抽屉。

请先确认已安装 [tampermonkey](https://www.tampermonkey.net/) 脚本管理器后，再安装本助手。

[更新日志](https://github.com/liuyubing233/zhihu-custom/blob/main/CHANGELOG.md)

[Github](https://github.com/liuyubing233/zhihu-custom/tree/main) ｜ [GreasyFork](https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8)

### 脚本样式

![脚本样式](https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/home.png)

## 功能简介

### 通用设置

<!-- 修改网页标签 -->

<details>

<summary>修改网页标签</summary>

> 菜单目录：通用 - 基本设置

<br>

1. 去除浏览器标签上 `XX 条私信，XX条未读消息` 的提示<br>
2. 修改浏览器标签名<br>
3. 修改浏览器标签图片<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/change-web-title.png" alt="修改网页标签">

</details>

<!-- 购物链接显示 -->

<details>

<summary>购物链接显示修改</summary>

> 菜单目录：通用 - 显示修改

<br>

- 默认：不修改<br>
- 近文字：购物链接显示为 `购物链接：XXX` 的超链接<br>
- 隐藏：隐藏购物链接显示<br>

</details>

<!-- 回答内容展开/收起状态 -->

<details>

<summary>回答内容展开/收起状态修改</summary>

> 菜单目录：通用 - 显示修改

<br>

- 默认：不修改<br>
- 自动展开所有回答：通过推荐页进入问答详情时原本为收起长回答，选择此项后进入页面会自动展开所有收起的回答<br>
- 默认收起长回答：选择此项后问答页面所有可收起的长回答默认都是收起状态，方便浏览<br>

</details>

<!-- 替换知乎直达✦为搜索 -->

<details>

<summary>替换知乎直达✦为搜索</summary>

> 菜单目录：通用 - 显示修改 - 替换知乎直达 ✦ 为搜索

<br>

1. 设置知乎直达去除直达链接跳转，可以将知乎直达修改为普通文字内容<br>
2. 设置为知乎、百度、必应、谷歌搜索，可以将知乎直达修改为对应的搜索链接，点击可跳转自动搜索<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/setting-replace-zhida.png" alt="直达设置">

<br>

---

<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/replace-zhida.png" alt="直达">

</details>

<!-- 列表标题类别显示 -->

<details>

<summary>列表标题类别显示</summary>

> 菜单目录：通用 - 显示修改

<br>

开启后将在列表中显示类别<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/item-type.png" alt="列表标题类别显示">

</details>

<!-- 列表点击高亮边框 -->

<details>

<summary>列表点击高亮边框</summary>

> 菜单目录：通用 - 显示修改

<br>

勾选后后首页和回答详情列表在点击时边框高亮，类似于知乎原生快捷键 S 键

</details>

<!-- 列表更多「···」按钮移动到最右侧 -->

<details>

<summary>列表更多「···」按钮移动到最右侧</summary>

> 菜单目录：通用 - 显示修改

</details>

<!-- 推荐列表按钮 -->

<details>

<summary>推荐列表「不感兴趣」、「直达问题」按钮</summary>

> 菜单目录：通用 - 显示修改

<br>

1. 开启 `推荐列表「不感兴趣」按钮` 后在推荐列表标题显示 `不感兴趣` 按钮<br>
   - 点击`不感兴趣`隐藏当前问题并自动调用知乎本身 `不感兴趣` 接口，防止出现重复推荐（知乎不感兴趣接口对内容推荐的时效性不强，若后续再次出现重复内容为知乎自身问题）<br>
   - 该功能需开启接口拦截<br>
2. 开启 `推荐列表「直达问题」按钮` 后在推荐列表标题显示 `直达问题` 按钮<br>
   - 点击直接跳转到问题主页，而不是当前推荐回答页面<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/just-number.png" alt="仅数字">

</details>

<!-- 仅数字 -->

<details>

<summary>赞同按钮仅显示数字、评论按钮仅显示数字</summary>

> 菜单目录：通用 - 显示修改

<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/just-number.png" alt="仅数字">

</details>

<!-- 回答内容顶部显示赞同人数 -->

<details>

<summary>回答内容顶部显示赞同人数</summary>

> 菜单目录：通用 - 显示修改

<br>

此功能是为了解决知乎更新后顶部赞同人数消失的问题。

</details>

<!-- 一键获取回答链接 -->

<details>

<summary>一键获取回答链接</summary>

> 菜单目录：通用 - 显示修改

<br>

点击后自动复制当前回答内容的链接到剪贴板<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/copy-link.png" alt="回答一键获取回答链接">

</details>

<!-- 回答和文章中的视频替换为链接 -->

<details>

<summary>回答和文章中的视频替换为链接</summary>

> 菜单目录：通用 - 显示修改

<br>

勾选后回答和文章中的视频内容将修改为超链接的形式<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/video-link.png" alt="回答和文章中的视频替换为链接">

</details>

<!-- 发布时间 -->

<details>

<summary>推荐、关注列表内容，问题详情，回答内容显示发布时间和最后修改时间，文章发布时间置顶</summary>

> 菜单目录：通用 - 显示修改

<br>

分别勾选后将在对应的内容顶部显示发布和修改时间<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/item-date.png" alt="时间">

</details>

<!-- 取消评论输入框自动聚焦 -->

<details>

<summary>取消评论输入框自动聚焦</summary>

> 菜单目录：通用 - 显示修改

<br>

开启后打开评论区不再自动聚焦到输入框，方便使用快捷键操作页面<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/cancel-comment-auto-focus.png" alt="取消聚焦"><br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/cancel-comment-auto-focus-after.png" alt="取消聚焦对比">

</details>

### 高性能模式

<details>

<summary>高性能模式</summary>

> 菜单目录：高性能模式

<br>

推荐列表高性能模式开启后推荐列表内容最多保留 50 条，超出则删除之前内容<br>

回答页高性能模式开启后，最多保留 30 条回答，超出则删除之前回答<br>

</details>

### 悬浮模块

<!-- 回答内容「收起」按钮悬浮 -->

<details>

<summary>回答内容「收起」按钮悬浮</summary>

> 菜单目录：悬浮模块

<br>

将展开长回答中的收起按钮悬浮显示，建议在隐藏问题详情操作栏的时候选择此项。<br>

悬浮收起按钮距离右侧位置可自行设置。<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/suspension-pickup.png" alt="收起悬浮">

</details>

<!-- 信息模块悬浮 -->

<details>

<summary>信息模块悬浮</summary>

> 菜单目录：悬浮模块 - 信息模块悬浮

<br>

悬浮对应模块，可以拖动自定义位置。<br>

可设置模块：`首页列表切换`、`顶部发现模块`、`个人重心模块`、`搜索栏模块`<br>

</details>

### 隐藏模块

<details>

<summary>设置隐藏模块</summary>

> 菜单目录：隐藏模块

<br>

勾选即可隐藏相应模块，隐藏模块大概设置内容：<br>

- 通用隐藏<br>
  - `隐藏修改器弹出图标 ⚙︎`, `广告`, `logo`, `顶部悬浮模块`, `滚动顶部悬浮模块/问题名称`, `发现模块-首页`, `发现模块-知学堂`, `发现模块-等你来答`, `发现模块-知乎直达`, `回答隐藏用户信息下的附加信息，比如：你赞同过、XXX 赞同了等...`, `评论「回复」按钮`, `评论「点赞」按钮`, `评论底部信息`, `知乎知学堂教育推广商品模块`<br>
- 操作栏<br>
  - `推荐、关注列表操作栏`, `推荐、关注列表操作栏 - 底部悬浮`, `搜索页列表操作栏`, `搜索页列表操作栏 - 底部悬浮`, `回答页问题操作栏`, `回答页回答内容操作栏`, `回答页回答内容操作栏 - 底部悬浮`, `文章底部悬浮操作栏`, `收藏夹列表操作栏`, `收藏夹列表操作栏 - 底部悬浮`, `个人主页动态、回答、文章等操作栏`, `个人主页动态、回答、文章等操作栏 - 底部悬浮`<br>
- 列表页面<br>
  - `创作中心`, `推荐关注`, `分类圆桌`, `更多分类`, `知乎指南`, `盐选作者平台`, `首页列表切换模块`, `首页列表切换 - 关注`, `首页列表切换 - 推荐`, `首页列表切换 - 热榜`, `首页列表切换 - 视频`, `列表内容`, `推荐、关注列表的视频`, `列表图片`, `问题列表阅读全文文字`, `列表「亲自答」标签`, `关注列表关注人操作`, `关注列表用户信息`, `热门排序编号`, `热门"新"元素`, `热门热度值`, `搜索栏知乎热搜`, `搜索页知乎热搜`, `搜索页知乎指南`<br>
- 回答页面<br>
  - `问题话题`, `问题分享`, `「好问题」按钮`, `添加评论`, `问题更多「...」按钮`, `问题专题收录标签`, `问题关注按钮`, `问题写回答按钮`, `问题邀请回答按钮`, `问题标题卡片广告和榜单`, `查看全部回答按钮`, `回答人头像`, `回答人姓名`, `回答人简介`, `回答人关注按钮`, `回答人下赞同数`, `问题关注和被浏览数`, `赞赏按钮`, `618 红包链接`, `回答底部发布编辑时间和 IP`, `回答底部发布编辑时间（保留 IP）`, `回答底部「继续追问」模块`, `详情右侧信息栏`, `信息栏关于作者`, `信息栏被收藏次数`, `信息栏相关问题`, `信息栏相关推荐`, `信息栏知乎指南`<br>
- 文章专栏<br>
  - `文章关联话题`, `文章标题图片`, `文章悬浮分享按钮`, `文章悬浮赞同按钮`, `文章作者头像`, `文章作者姓名`, `文章作者简介`, `文章作者关注按钮`, `文章底部知乎热榜`, `内容所属专栏`<br>
- 用户主页<br>
  - `用户主页付费咨询、认证和成就`, `用户主页出版作品`, `用户主页创作中心`, `用户主页关注和关注者卡片`, `用户主页关注的内容和赞助`, `用户主页右侧屏蔽·举报用户、个人主页被浏览次数`, `用户主页知乎指南`<br>
- 收藏夹<br>
  - `收藏夹创作中心`, `收藏夹推荐关注`, `收藏夹圆桌入口`, `收藏夹更多分类`, `收藏夹知乎指南`<br>
- 话题<br>
  - `话题主页右侧浏览/讨论量模块`, `话题主页右侧父子话题模块`, `话题主页右侧知乎指南`<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/hidden.png" alt="设置隐藏模块">

</details>

### 黑名单

<details>

<summary>黑名单</summary>

> 菜单目录：黑名单

<br>

_注：需要开启接口拦截_<br>

在使用该功能前，请先点击 `同步黑名单` 按钮同步黑名单内容。<br>

1. 回答列表用户名后显示「屏蔽用户」按钮<br>
   - 勾选后在回答内容中将添加 `屏蔽用户`、`屏蔽用户并隐藏该回答` 按钮，点击即可将对应用户拉入黑名单<br>
2. 勾选 `屏蔽黑名单用户发布的内容` 后在回答详情中将会过滤黑名单用户的回答内容<br>
3. 点击用户后的 x 即可将用户从黑名单移除<br>
4. 黑名单功能在评论区同样适用

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/black.png" alt="黑名单">

</details>

<details>

<summary>黑名单标签</summary>

> 菜单目录：黑名单 - 黑名单标签

<br>

_注：需要开启接口拦截_<br>

在使用该功能前，请先点击 `同步黑名单` 按钮同步黑名单内容。<br>

给黑名单用户打标，以来表明是因为什么拉黑用户。<br>

1. 在黑名单标签添加标签<br>
2. 在黑名单用户名后的 ✎ 图标点击弹出选择标签弹窗进行添加删除<br>
3. 设定了标签的黑名单用户在同步黑名单时标签仍然会存在<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/blocked-user-tag-input.png" alt="黑名单标签" />

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/blocked-user-tag-edit.png" alt="黑名单标签添加" />

</details>

### 页面尺寸

<!-- 页面内容宽度 -->

<details>

<summary>页面内容宽度（列表、回答、文章、评论弹窗）</summary>

> 菜单目录：页面尺寸 - 页面内容宽度

<br>

1. 普通宽度设置，宽度为固定宽度，设置区间为 600 ～ 1500<br>
2. 勾选百分比设置后，页面内容将根据浏览器宽度的比例进行设置，最小百分比为 20%<br>
3. `评论弹窗匹配页面宽度` 勾选后，评论弹窗将跟页面内容宽度一致<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/setting-size.png" alt="页面尺寸">

</details>

<!-- 字体大小设置 -->

<details>

<summary>字体大小设置</summary>

> 菜单目录：页面尺寸 - 字体大小

<br>

1. 列表标题文字大小、列表内容文字大小<br>
2. 回答标题文字大小、回答内容文字大小<br>
3. 文章标题文字大小、文章内容文字大小<br>
4. 内容行高（在所有内容中生效）<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/font-size.png" alt="字体大小">

</details>

<!-- 图片尺寸 -->

<details>

<summary>回答和文章图片尺寸</summary>

> 菜单目录：页面尺寸 - 回答和文章图片尺寸 ｜ 页面尺寸 - 图片最大高度限制

<br>

1. 回答和文章图片尺寸 - 为图片宽度设置<br>
   - 默认：不修改<br>
   - 原图：按照图片原图大小显示<br>
   - 自定义：自定义图片宽度，设置区间为 0 ～ 1000<br>
2. 图片最大高度显示<br>
   - 开启限制后，图片宽度设置将会失效<br>
   - 开启后，将按照设置的高度等比缩放图片<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/image-size.png" alt="图片尺寸">

</details>

<!-- 评论图片预览不超出页面 -->

<details>

<summary>评论图片预览不超出页面</summary>

> 菜单目录：页面尺寸 - 图片尺寸 - 评论图片预览不超出页面

<br>

开启后评论区的弹窗图片预览将不超出页面最大尺寸<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/comment-image-preview.png" alt="图片尺寸">

</details>

<!-- 弹窗打开动图 -->

<details>

<summary>弹窗打开动图</summary>

> 菜单目录：页面尺寸 - 图片最大高度限制

<br>

开启后，页面动图预览将以弹窗的形式查看，来替换直接在原位置查看的方式

</details>

<!-- 列表视频回答中的视频尺寸 -->

<details>

<summary>列表视频回答中的视频尺寸</summary>

> 菜单目录：页面尺寸 - 列表视频回答中的视频尺寸

<br>

开启自定义后，将列表中的视频内容按照宽度进行缩放，设置区间为 0 ～ 1000

</details>

### 主题颜色

<!-- 设置夜间模式 -->

<details>

<summary>主题颜色设置（是否开启夜间模式）</summary>

> 菜单目录：主题颜色 - 主题颜色

<br>

1. 浅色：页面主题将根据浅色设置<br>
2. 深色（夜间模式）：页面主题将根据深色设置<br>
3. 自动：页面主题将根据浏览器是否开启夜间模式来设置，适用于自动开启夜间模式的电脑和浏览器<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/setting-background.png" alt="颜色设置">

</details>

<!-- 浅色颜色选择 -->

<details>

<summary>浅色颜色选择</summary>

> 菜单目录：主题颜色 - 浅色颜色选择

<br>

浅色颜色主题预览（绿）：<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/background-light.png" alt="浅色颜色预览">

</details>

<!-- 深色颜色选择 -->

<details>

<summary>深色颜色选择（夜间模式颜色选择）</summary>

> 菜单目录：主题颜色 - 深色颜色选择

<br>

_注：需开启深色模式，或在主题颜色自动时浏览器为深色模式_<br>

_注 2: 深色蓝、深色红、深色绿为高对比度颜色_<br>

深色颜色主题预览（深色护眼三）：<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/background-dark.png" alt="深色颜色预览">

</details>

<!-- 修改文字颜色 -->

<details>

<summary>修改文字颜色</summary>

> 菜单目录：主题颜色 - 修改文字颜色

<br>

输入文字颜色后点击回车键或失去焦点生效，点击重置去除文字颜色设置<br>

修改文字颜色预览：<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/font-color.png" alt="修改文字颜色">

</details>

<!-- 关注列表高亮原创内容 -->

<details>

<summary>关注列表高亮原创内容</summary>

> 菜单目录：通用 - 显示修改

<br>

勾选后关注列表里原创内容 `发表回答`、`发表文章`、`提出问题` 后将高亮显示<br>

可在 `关注列表高亮原创内容背景色` 自定义高亮背景色

</details>

### 配置操作

<!-- 极简模式 -->

<details>

<summary>极简模式</summary>

> 菜单目录：主题颜色 - 配置操作

<br>

点击即可启用极简模式，隐藏大部分的模块，仅保留列表主体、回答主体、文章主体，完全服务于阅读

</details>

<!-- 配置导入导出 -->

<details>

<summary>配置导入导出</summary>

> 菜单目录：主题颜色 - 配置操作

<br>

1. 配置导出即可将当前设置导出为 txt 文件<br>
2. 配置导入可将配置 txt 文件上传进行配置同步，一般用户跨浏览器使用<br>

</details>

<!-- 自定义样式 -->

<details>

<summary>自定义样式</summary>

> 菜单目录：主题颜色 - 自定义样式

<br>

可自行输入 css 样式来进行定制化设置

</details>

### 屏蔽内容

<details>

<summary>屏蔽内容设置预览</summary>

> 菜单目录：屏蔽内容

<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/setting-filter.png" alt="屏蔽内容设置预览">

</details>

<!-- 屏蔽选自盐选专栏的内容 -->

<details>

<summary>屏蔽选自盐选专栏的内容</summary>

> 菜单目录：屏蔽内容 - 通用内容屏蔽

<br>

开启后在推荐列表、回答内容中均会自动屏蔽来自盐选专栏的内容

</details>

<!-- 屏蔽顶部活动推广 -->

<details>

<summary>屏蔽顶部活动推广</summary>

> 菜单目录：屏蔽内容 - 列表内容屏蔽

<br>

开启后将模拟点击方式关闭主页顶部活动推广，可解决物理隐藏下的颜色错误问题。

</details>

<!-- 屏蔽匿名用户提问 -->

<details>

<summary>屏蔽匿名用户提问</summary>

> 菜单目录：屏蔽内容 - 列表内容屏蔽

<br>

开启后推荐列表将屏蔽屏蔽匿名用户的提问内容

</details>

<!-- 关注列表屏蔽自己的操作 -->

<details>

<summary>关注列表屏蔽自己的操作</summary>

> 菜单目录：屏蔽内容 - 列表内容屏蔽

<br>

开启后在关注列表将不再出现自己的操作内容

</details>

<!-- 关注列表过滤关注人操作 -->

<details>

<summary>关注列表过滤关注人操作</summary>

> 菜单目录：屏蔽内容 - 列表内容屏蔽

<br>

可设置过滤关注列表关注人的`赞同回答`、`赞同文章`、`关注话题`的操作

</details>

<!-- 列表低赞内容屏蔽 -->

<details>

<summary>列表低赞内容屏蔽</summary>

> 菜单目录：屏蔽内容 - 列表内容屏蔽

</details>

<!-- 列表类别过滤 -->

<details>

<summary>列表类别过滤</summary>

> 菜单目录：屏蔽内容 - 列表内容屏蔽

<br>

- 勾选 `邀请回答` 后推荐列表将不会显示邀请回答内容<br>
- 勾选 `商业推广` 后搜索列表将不会显示商业推广内容<br>
- 勾选 `文章` 后推荐列表将不会再出现专栏文章<br>
- 勾选 `视频` 后推荐列表中将不会再出现视频内容<br>
- 勾选 `想法` 后推荐列表中将不会再出现想法内容<br>

</details>

<!-- 屏蔽「匿名用户」回答 -->

<details>

<summary>屏蔽「匿名用户」回答</summary>

> 菜单目录：屏蔽内容 - 回答内容屏蔽

<br>

开启后在回答页面，将不会再推荐匿名用户的回答<br>

_注：仅在回答页面生效_<br>

</details>

<!-- 回答页面低赞回答屏蔽 -->

<details>

<summary>回答页面低赞回答屏蔽</summary>

> 菜单目录：屏蔽内容 - 回答内容屏蔽

<br>

勾选后问题详情页将屏蔽点赞量少于设置大小的回答

</details>

<!-- 屏蔽带有虚构创作、选自电子书的回答 -->

<details>

<summary>屏蔽带有虚构创作、选自电子书的回答</summary>

> 菜单目录：屏蔽内容 - 回答内容屏蔽

<br>

勾选后在回答内容中将屏蔽带有对应标签的回答

</details>

### 屏蔽词

<!-- 标题屏蔽词 -->

<details>

<summary>标题屏蔽词</summary>

> 菜单目录：屏蔽词 - 标题屏蔽词

<br>

输入框输入后点击回车键可添加屏蔽词，点击屏蔽词即可删除<br>

推荐列表的标题将会针对屏蔽词过滤。可过滤多项，无上限。并在过滤后自动调用 `不感兴趣` 的接口，防止在其他设备上出现重复内容<br>

_注：标题屏蔽词仅匹配标题内容_<br>

**(图片内容仅为示例，无个人主观情感)**<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/filter-title-word.png" alt="标题屏蔽词">

</details>

<!-- 内容屏蔽词 -->

<details>

<summary>内容屏蔽词</summary>

> 菜单目录：屏蔽词 - 内容屏蔽词

<br>

输入框输入后点击回车键可添加屏蔽词，点击屏蔽词即可删除<br>

推荐列表内容、回答列表的内容将会针对屏蔽词过滤。可过滤多项，无上限。<br>

_注：内容屏蔽词仅匹配列表或回答内容_<br>

</details>

### 默认功能

<!-- 推荐列表缓存 & 浏览历史记录 -->

<details>

<summary>推荐列表缓存 & 浏览历史记录</summary>

> 修改器默认功能，无需主动开启

<br>

默认缓存 500 条，点击标题可跳转。<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/history-recommend.png" alt="推荐列表缓存">

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/history-view.png" alt="浏览历史记录">

</details>

<!-- 外部链接直接跳转 -->

<details>

<summary>外部链接直接跳转</summary>

> 修改器默认功能，无需主动开启

<br>

知乎里所有外部链接的重定向页面去除，点击将直接跳转到外部链接，不再打开知乎外部链接提示页面

</details>

<!-- 视频下载 -->

<details>

<summary>视频下载</summary>

> 修改器默认功能，无需主动开启

<br>

可下载视频内容左上角将会生成一个下载按钮，点击即可下载视频<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/download-video.png" alt="视频下载">

</details>

<!-- 移除登录提示弹窗 -->

<details>

<summary>移除登录提示弹窗</summary>

> 修改器默认功能，无需主动开启

<br>

未登录状态下自动移除登录弹窗<br>

由于知乎接口的修改，未登录状态下无法查看全部回答、无法查看完整回答，以上问题只能通过登录解决<br>

</details>

<!-- 移除登录提示弹窗 -->

<details>

<summary>收藏夹、用户主页内容、文章和回答导出</summary>

> 修改器默认功能，无需主动开启

<br>

导出步骤：<br>

1. 点击导出内容按钮<br>
2. 等待资源加载完成<br>
3. 生成为 PDF 预览，点击保存即可保存至本地<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/export-to-pdf.png" alt="内容导出步骤">

<br>

用户主页回答、文章导出按钮：<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/export-home.png" alt="用户主页内容导出">

<br>

如需显示文章和回答导出按钮，需勾选 `通用 - 显示修改 - 文档或回答顶部显示导出当前内容/回答按钮`<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/export-content.png" alt="导出当前内容">

</details>

<!-- 一键邀请 -->

<details>

<summary>一键邀请</summary>

> 修改器默认功能，无需主动开启

<br>

问题邀请用户添加一键邀请按钮，点击可邀请所有推荐用户<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/invite.png" alt="一键邀请">

</details>

<!-- 个人主页关注订阅快捷取消关注 -->

<details>

<summary>个人主页关注订阅快捷取消关注</summary>

> 修改器默认功能，无需主动开启

<br>

_注：由于知乎接口的限制，关注及移除只能在对应页面中进行操作，所以点击 `移除关注` 按钮将打开到对应页面，取消或关注后此页面自动关闭，脚本未加载请刷新页面_<br>

目前只支持 `关注的问题`、`关注的收藏`<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/remove-item.png" alt="一键移除">

</details>

<!-- 个人主页关注订阅快捷取消关注 -->

<details>

<summary>复制内容删除版权信息</summary>

> 修改器默认功能，无需主动开启

<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/remove-message.png" alt="移除版权信息">

</details>

<!-- 预览静态图片键盘快捷切换 -->

<details>

<summary>预览静态图片键盘快捷切换</summary>

> 修改器默认功能，无需主动开启

<br>

静态图片点击查看大图时，如果当前回答或者文章中存在多个图片，可以使用键盘方向键左右切换图片显示

</details>

<!-- 一键移除所有屏蔽话题 -->

<details>

<summary>一键移除所有屏蔽话题</summary>

> 修改器默认功能，无需主动开启

<br>

_注：由于知乎屏蔽话题每次只显示部分内容，建议解除屏蔽后刷新页面查看是否仍然存在新的屏蔽话题。_<br>

<img src="https://raw.githubusercontent.com/liuyubing233/zhihu-custom/refs/heads/main/static/remove-filter-tag.png" alt="一键移除屏蔽话题">

</details>

<span style="color: red">更多功能请在使用中查看</span>
