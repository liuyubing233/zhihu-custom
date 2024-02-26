# 知乎修改器，一个可以自定义知乎的脚本

![脚本样式](https://pic.imgdb.cn/item/658a6b57c458853aefa44014.png)

---

**移动端脚本正在开发中，[可以在这里提出移动端的一些需求 >>>](https://github.com/liuyubing233/zhihu-custom-mobile/issues/new)**

**在空余时间开发，开发进度并不会很快**

---

快捷键 >（Shift + .）唤起修改器弹窗, 或鼠标放置到页面左侧齿轮按钮等弹出后点击唤起弹窗。

请先确认已安装 [tampermonkey](https://www.tampermonkey.net/) 脚本管理器后，再安装本助手。

[更新日志](https://github.com/liuyubing233/zhihu-custom/blob/main/CHANGELOG.md) ｜ [问题解答](https://github.com/liuyubing233/zhihu-custom/blob/main/Q%26A.md)

[Github](https://github.com/liuyubing233/zhihu-custom/tree/main) ｜ [GreasyFork](https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8)

---

`使用弹窗打开动图` 设置与修改图片类型的其他脚本或插件冲突，如果有使用修改图片的脚本不要打开此项设置。

---

<b style="color: red;">如果遇到知乎页面无法显示数据的情况请尝试关闭接口拦截。</b>

![接口拦截](https://pic.imgdb.cn/item/658a6bbbc458853aefa5f465.png)

---

Safari 浏览器在[知乎](www.zhihu.com)无法使用 TamperMonkey 脚本，暂无解决方法。
![Safari错误](https://pic.imgdb.cn/item/658a6dddc458853aefaf3f88.png)

```text
Refused to execute a script because its hash, its nonce, or 'unsafe-inline' does not appear in the script-src directive of the Content Security Policy.
```

---

## 功能简介

4.X 版本的详细更新内容在 [更新日志](https://github.com/liuyubing233/zhihu-custom/blob/main/CHANGELOG.md)。

### 推荐列表缓存 & 浏览历史记录

默认缓存 500 条，点击标题可跳转。

![历史记录](https://pic.imgdb.cn/item/658a711fc458853aefbb6148.png)

---

### 外链直接打开

将知乎里所有链接的重定向去除，外部链接可以直接跳转到对应网址，不再出现跳转提示。

---

### 视频下载

知乎视频现在在左上角会生成一个下载按钮，点击即可下载视频。

![视频下载](https://bnz06pap004files.storage.live.com/y4m2EzgtXbvKwB3h1e9gIjMYH5Fv9sR6L36SxnwuYAVxgJPnbIuiY8wG9D9eZVJuJpQZCa3KTG8D-MY9Bhe3G_Dd8-jcbZ-WaFA1oCrUexwHQ4dyFKFTJhcmWCyPtb1QSQnEoXCcm_-RJzaCyqz94byREznrjJBJb9PuPbOlKzif_oQ4f3uYDVBx51rEcEMM-7A?width=1024&height=565&cropmode=none)

---

### 屏蔽设置页一键移除所有屏蔽选项

因为知乎屏蔽标签每次只显示部分，建议解除屏蔽后刷新页面查看是否仍然存在新的屏蔽标签。

![一键移除屏蔽](https://pic.imgdb.cn/item/658a747bc458853aefc7cf23.png)

---

### 移除登录弹窗，未登陆状态下自动移除登陆弹窗

---

### 收藏夹内容导出，用户主页当前页回答和当前页文章导出（需开启接口拦截）

![收藏夹内容导出](https://pic.imgdb.cn/item/658a7c6bc458853aefe53b51.png)

![用户主页内容导出](https://pic.imgdb.cn/item/658a7cb5c458853aefe647d2.png)

文档或回答顶部显示导出当前内容/回答按钮，需要勾选 `显示设置 - 文档或回答顶部显示导出当前内容/回答按钮`

![导出当前内容](https://pic.imgdb.cn/item/658a7d67c458853aefe92bb1.png)

---

### 个人主页 `关注的问题`、`关注的收藏` 一键移除功能

_注：由于知乎接口的限制，关注及移除只能在对应页面中进行操作，所以点击 `移除关注` 按钮将打开到对应页面，取消或关注后此页面自动关闭，脚本未加载请刷新页面_

![一键移除](https://bnz06pap004files.storage.live.com/y4mbZNPw7OZA5zbinGMfYhJN2Yb1vThLOpqM096m8bnSEm3Hi77OyazOeR7cjFbUfLvzVYpyNpihoGRArUTBYCTlI6BFqwSxXmVhU_m1PXci6tSo_r0_XvRnZW3fMgLnahIBoVUrjpeDBnqySRAjqqezw88shAdrOOb8ao7Xep9MBfXBHBAnNCelaTbz6l14KSy?width=1024&height=469&cropmode=none)

---

### 一键邀请推荐的所有人

![一键邀请](https://pic.imgdb.cn/item/658a776fc458853aefd21447.png)

添加一键邀请功能，点击即可邀请当前页面所有推荐用户

---

### 复制内容删除版权信息

![移除版权信息](https://pic.imgdb.cn/item/658a77b5c458853aefd31b72.png)

---

### 静态图片弹窗观看点击键盘左右切换到上一张或下一张（图片快速切换）

查看图片点击预览大图时，如果当前回答或者文章中存在多个图片，可以使用键盘方向键左右切换图片显示。

---

### 修改网页标题、图标

![基本设置预览](https://pic.imgdb.cn/item/658a78eec458853aefd828aa.png)

---

![显示设置预览](https://pic.imgdb.cn/item/658a7a04c458853aefdc96c0.png)

### 赞同、评论按钮仅显示数字

---

### 回答内容顶部显示赞同人数

此功能是为了解决知乎更新后顶部赞同人数消失的问题。

---

### 回答和文章中的视频替换为链接

![回答和文章中的视频替换为链接](https://pic.imgdb.cn/item/658a7dd6c458853aefeb0df2.png)

---

### 列表标题添加显示类别

![列表预览](https://pic.imgdb.cn/item/658a7e23c458853aefec44ca.png)

---

### 推荐列表显示「不感兴趣」按钮（需开启接口拦截）

点击不感兴趣隐藏当前问题并且自动调用知乎本身 `不感兴趣` 接口，防止出现重复推荐（知乎不感兴趣接口对内容推荐的时效性不是很强，如果点击不感兴趣后再次出现也是知乎本身的问题）

---

### 推荐列表显示「直达问题」按钮

用以直接跳转到所有回答，而不是仅仅的推荐回答页面。

---

### 关注列表高亮原创内容、列表内容点击高亮边框

`关注列表高亮原创内容` 勾选后关注列表里原创内容 `发表回答`、`发表文章`、`提出问题` 后将高亮显示，在所有颜色设置下均生效

`列表内容点击高亮边框` 勾选后后首页和回答详情列表在点击时边框高亮，类似于知乎原生快捷键 S 键

---

### 列表内容、 问题详情、回答内容显示发布时间和最后修改时间，文章发布时间置顶

![时间](https://pic.imgdb.cn/item/658a7ff7c458853aeff39275.png)

---

### 购物链接显示修改

可以设置回答和文章里的购物链接样式：仅以文字显示、隐藏、不修改

---

### 回答内容展开/收起

- 自动展开所有回答：通过推荐页进入问答详情时原本为收起长回答，选择此项后进入页面会自动展开所有收起的回答；
- 默认收起所有长回答：选择此项后问答页面所有可收起的长回答默认都是收起状态，方便浏览。

---

### 页面尺寸内容修改

![页面尺寸](https://pic.imgdb.cn/item/658a80f5c458853aeff795d6.png)

1. 列表、回答、文章页面内容宽度

   - 普通宽度设置，宽度为固定宽度；
   - 勾选百分比设置后，页面内容将根据浏览器宽度进行设置。

2. 页面的标题和内容文字大小
3. 自定义回答和文章图片尺寸
   - 设置此项可以将回答和专栏内图片按照所设置的大小进行缩放，并且在缩放模式下添加了所有的图片弹窗预览。
4. 使用弹窗打开动图

   - 勾选此项所有的动图点击会以弹窗方式打开

5. 列表视频回答的视频内容尺寸
   - 在未设置视频回答为隐藏或仅链接的情况可以使用此选项设置列表回答中的视频显示尺寸。

---

### 悬浮模块设置

1. 回答 `收起` 按钮悬浮

   - 将展开长回答中的收起按钮悬浮显示，建议在隐藏问题详情操作栏的时候选择此项。

2. 信息模块悬浮
   - 悬浮对应模块，可以拖动自定义位置

![信息模块悬浮](https://bnz06pap004files.storage.live.com/y4mwNoK1snkbOYlJF0WsGJSucfKh_SMEgcRkoXUqYJ8RsQknOM4oZi6F2d5c9opZ8xc2eYrkpec1BUTp9Y4R-OQXz8N6rByTF5drwU-PTSvvFeNFj1jd-jZJvewwlZNyXapIUpfF2DuubPqWM0S50dhlVR2CY0T1OX3oXcnK0np9GJDae0t5GXjDyPIbIr0l3YS?width=1024&height=560&cropmode=none)

---

### 背景色和文字颜色修改

![颜色设置](https://pic.imgdb.cn/item/658a8256c458853aeffd1975.png)

设置为自动时，背景色可跟随浏览器颜色变化

可以自定义修改文字颜色，颜色格式为代码可识别的格式。

---

### 配置操作

这里可以导出当前配置，导入配置时将导出的配置内容复制进来再点击 `导入` 按钮即可完成导入

此部分将自己定义的样式写入即可生效

---

### 隐藏模块设置

勾选后将隐藏对应的模块

![预览](https://pic.imgdb.cn/item/658a8462c458853aef0492e7.png)

---

### 屏蔽内容设置

![预览](https://pic.imgdb.cn/item/658a84c0c458853aef0599fe.png)

1. 屏蔽顶部活动推广

   - 勾选后将模拟点击方式关闭主页顶部活动推广，可解决物理隐藏下的颜色错误问题。

2. 关注列表关注人操作屏蔽
   - 可以设置屏蔽关注人的 `赞同回答`、`赞同文章`、`关注问题` 操作。
3. 列表类别屏蔽
   - 勾选 `邀请回答` 后推荐列表将不会显示邀请回答内容。
   - 勾选 `商业推广` 后搜索列表将不会显示商业推广内容。
   - 勾选 `文章` 后推荐列表将不会再出现专栏文章。
   - 勾选 `视频` 后推荐列表中将不会再出现视频内容。
   - 勾选 `想法` 后推荐列表中将不会再出现想法内容。
4. 设置 `列表低赞内容屏蔽` 后，点赞量低于输入框中的 `推荐页`、`搜索页` 列表内容会被自动过滤
5. 屏蔽官方账号、屏蔽匿名用户、屏蔽带有标签的回答如 `选自盐选专栏`。
6. 设置 `详情低赞回答屏蔽` 后，点赞量低于输入框中的回答会被自动过滤。

---

### 屏蔽词设置

![预览](https://pic.imgdb.cn/item/658a8642c458853aef09d13f.png)

1. 标题屏蔽词
   - 输入框输入后列表将会进行关键词过滤。可过滤多项，无上限。并在关键词过滤后自动调用 `不感兴趣` 的接口，防止在其他设备上出现同样内容
2. 内容屏蔽词
   - 输入框输入后回答内容将会进行关键词过滤。可过滤多项，无上限。将过滤列表中和回答详情内容中含有对应词语的回答。

---

### 黑名单设置（需开启接口拦截）

![预览](https://pic.imgdb.cn/item/658a86b2c458853aef0b08ea.png)

在使用该功能前，请先点击 `同步黑名单` 按钮同步黑名单内容。

1. 回答列表用户名后显示「屏蔽用户」按钮
   - 勾选后在回答内容中将添加 `屏蔽用户`、`屏蔽用户并隐藏该回答` 按钮，点击即可将对应用户拉入黑名单
2. 勾选 `屏蔽黑名单用户发布的内容` 后在回答详情中将会过滤黑名单用户的回答内容

---

<span style="color: red">更多功能请在使用中查看</span>
