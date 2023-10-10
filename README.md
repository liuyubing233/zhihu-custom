# 知乎修改器

<img src="https://onedrive.live.com/embed?resid=DA8363D294AD6D2B%211382&authkey=%21AB2XtbDvZUaLvMw&width=1373&height=964" width="1373" height="964" />

快捷键 >（Shift + .）唤起修改器弹窗

请先确认已安装 <a href="https://www.tampermonkey.net/" target="_blank">tampermonkey</a> 脚本管理器后，再安装本助手

<a href="https://github.com/liuyubing233/custom-zhihu/blob/main/CHANGELOG.md" target="_blank">更新日志</a>

<a href="https://github.com/liuyubing233/custom-zhihu/blob/main/Q%26A.md" target="_blank">部分问题解答</a>

<a href="https://github.com/liuyubing233/custom-zhihu/tree/main" target="_blank">Github</a>

<a href="https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8" target="_blank">GreasyFork</a>

发现问题和想要添加的内容请反馈给我，感谢！！！

插件目录跳转失效请移步<a href="https://github.com/liuyubing233/custom-zhihu/blob/main/README.md" target="_blank">这里查看</a>

Safari 浏览器下在[知乎](www.zhihu.com)使用 TamperMonkey 会报错，导致插件无法使用，暂时没有解决头绪...

```text
Refused to execute a script because its hash, its nonce, or 'unsafe-inline' does not appear in the script-src directive of the Content Security Policy.
```

<img src="https://onedrive.live.com/embed?resid=DA8363D294AD6D2B%211127&authkey=%21AMkK7HHwEAS2dXE&width=1024&height=999999" width="1024" height="auto" />

## 插件目录

- [默认功能](#默认功能)
	- [推荐页内容缓存](#推荐页内容缓存)
	- [保存浏览历史记录](#保存浏览历史记录)
	- [外链直接打开](#外链直接打开)
	- [视频下载](#视频下载)
	- [屏蔽设置页面添加一键移除所有屏蔽选项](#屏蔽设置页面添加一键移除所有屏蔽选项)
	- [移除登录弹窗](#移除登录弹窗)
	- [收藏夹内容导出为 PDF](#收藏夹内容导出为-pdf)
	- [回答内容按照点赞数和评论数排序](#回答内容按照点赞数和评论数排序)
	- [个人主页「我关注的问题」、「我关注的收藏」可以一键移除或将移除的内容添加回关注](#个人主页我关注的问题我关注的收藏可以一键移除或将移除的内容添加回关注)
	- [一键邀请功能](#一键邀请功能)
	- [复制代码块删除版权信息](#复制代码块删除版权信息)
	- [静态图片弹窗观看点击键盘左右直接切换到上一张或下一张](#静态图片弹窗观看点击键盘左右直接切换到上一张或下一张)
- [基础设置](#基础设置)
	- [基础设置 - 基本设置](#基础设置---基本设置)
		- [更改网页和标题](#更改网页和标题)
		- [自定义回答和文章图片尺寸](#自定义回答和文章图片尺寸)
		- [使用弹窗打开动图](#使用弹窗打开动图)
	- [基础设置 - 悬浮模块](#基础设置---悬浮模块)
		- [回答「收起」按钮悬浮](#回答收起按钮悬浮)
		- [信息模块悬浮](#信息模块悬浮)
	- [基础设置 - 黑名单设置](#基础设置---黑名单设置)
	- [基础设置 - 通用模块隐藏](#基础设置---通用模块隐藏)
	- [基础设置 - 颜色设置](#基础设置---颜色设置)
	- [基础设置 - 配置操作](#基础设置---配置操作)
	- [基础设置 - 默认功能](#基础设置---默认功能)
- [首页列表设置](#首页列表设置)
	- [首页列表设置 - 基础设置](#首页列表设置---基础设置)
		- [列表版心宽度](#列表版心宽度)
		- [内容标题添加类别显示](#内容标题添加类别显示)
		- [推荐列表显示「不感兴趣」按钮](#推荐列表显示不感兴趣按钮)
		- [列表更多「···」按钮移动到题目右侧](#列表更多按钮移动到题目右侧)
		- [关注列表高亮原创内容](#关注列表高亮原创内容)
		- [列表内容点击高亮边框](#列表内容点击高亮边框)
		- [列表内容显示发布时间和最后修改时间](#列表内容显示发布时间和最后修改时间)
		- [列表内容标准文字大小调整](#列表内容标准文字大小调整)
	- [首页列表设置 - 屏蔽内容](#首页列表设置---屏蔽内容)
		- [关注列表关注人操作屏蔽](#关注列表关注人操作屏蔽)
		- [列表类别屏蔽](#列表类别屏蔽)
		- [列表低赞内容屏蔽](#列表低赞内容屏蔽)
		- [列表屏蔽词](#列表屏蔽词)
	- [首页列表设置 - 隐藏模块](#首页列表设置---隐藏模块)
- [回答详情设置](#回答详情设置)
	- [回答详情设置 - 基础设置](#回答详情设置---基础设置)
		- [回答版心宽度](#回答版心宽度)
		- [问题详情显示创建时间和最后修改时间](#问题详情显示创建时间和最后修改时间)
		- [回答内容显示创建时间与最后修改时间](#回答内容显示创建时间与最后修改时间)
		- [购物链接显示设置](#购物链接显示设置)
		- [回答视频显示设置](#回答视频显示设置)
	- [回答详情设置 - 屏蔽内容](#回答详情设置---屏蔽内容)
		- [屏蔽官方账号的回答](#屏蔽官方账号的回答)
		- [屏蔽带有标签的回答](#屏蔽带有标签的回答)
		- [详情低赞回答屏蔽](#详情低赞回答屏蔽)
		- [回答内容标准文字大小调整](#回答内容标准文字大小调整)
	- [回答详情设置 - 隐藏模块](#回答详情设置---隐藏模块)
	- [回答详情设置 - 回答展开收起](#回答详情设置---回答展开收起)
- [文章专栏设置](#文章专栏设置)
	- [文章专栏设置 - 基础设置](#文章专栏设置---基础设置)
		- [文章版心宽度](#文章版心宽度)
		- [文章发布时间置顶](#文章发布时间置顶)
		- [文章内容标准文字大小调整](#文章内容标准文字大小调整)
	- [文章专栏设置 - 隐藏模块](#文章专栏设置---隐藏模块)

### 默认功能

#### 推荐页内容缓存

推荐页内容链接根据有新到旧进行缓存，可缓存 100 条；「编辑器 - 历史记录 - 推荐列表缓存」

<img src="https://bnz06pap004files.storage.live.com/y4m57E4fziLSLmLGt_Nz-CNFucYHkMaCEIzfY4AWXed2sCxKtAt1X7WGZK0dtzP7fQCZz6jHvYrm6tvVgmBPjwQEQVgcnxOCBe27O20fJYx7vbFeuwqFRHjFV8nY3UlLO3MZ6TyHckmIzLowb5eETwMD_YiEOdteGFlMMCUsFzGWzlF40KsZ6vFRk_AqwpuS06Y?width=1024&height=612&cropmode=none" width="1024" />

#### 保存浏览历史记录

可保存 100 条浏览历史记录链接，内容为打开的问题、文章、视频；「编辑器 - 历史记录 - 浏览历史记录」

<img src="https://bnz06pap004files.storage.live.com/y4mX6wlaBERlQTa9hfLa6IxfVrb2MdcX0kOR59JdAsHyC4v58PeZhGBWAL4ux_gokKhLJccmuwkEfdwJ6DXUnU3Ssl5LlfCdy4EaTAYvLOAZyMxt7hecrCGe1MNIuSFSmgzKjLDAwvserMiIAspx68oI6qeGoFASch-Mog8DdF4-vx7LikpLenvYEL1UhxUpehu?width=1024&height=772&cropmode=none" width="1024" />

#### 外链直接打开

将知乎里所有外部链接的重定向去除，可以直接访问。

#### 视频下载

知乎视频现在在左上角会生成一个下载按钮，点击即可下载视频。

<img src="https://bnz06pap004files.storage.live.com/y4m2EzgtXbvKwB3h1e9gIjMYH5Fv9sR6L36SxnwuYAVxgJPnbIuiY8wG9D9eZVJuJpQZCa3KTG8D-MY9Bhe3G_Dd8-jcbZ-WaFA1oCrUexwHQ4dyFKFTJhcmWCyPtb1QSQnEoXCcm_-RJzaCyqz94byREznrjJBJb9PuPbOlKzif_oQ4f3uYDVBx51rEcEMM-7A?width=1024&height=565&cropmode=none" width="1024"  />

#### 屏蔽设置页面添加一键移除所有屏蔽选项

因为知乎屏蔽 TAG 每次只显示部分，建议解除屏蔽后刷新页面查看是否仍然存在新的屏蔽 TAG。

<img src="https://onedrive.live.com/embed?resid=DA8363D294AD6D2B%211106&authkey=%21AFfEhvEzWvvWevk&width=1024&height=999999" width="1024" height="auto" />

#### 移除登录弹窗

未登录状态下问答和专栏移除登录弹窗

#### 收藏夹内容导出为 PDF

在收藏夹名称上方显示【生成 PDF】按钮，点击导出当前页码的收藏夹详细内容。

<img src="https://onedrive.live.com/embed?resid=DA8363D294AD6D2B%211114&authkey=%21AMrTLMx_Q0LHgDs&width=1024&height=999999" width="1024" height="auto" />

#### 回答内容按照点赞数和评论数排序

在页面加载完成后点击回答右上角的排序按钮，点击【点赞数排序】或【评论数排序】后，页面刷新等待排序完成。

因为知乎并没有开放点赞数和评论排序参数，所以只能每次加载后按照当前的数据进行页面排序

<p style="color: red;">为了防止页面错乱，只对前20条进行排序，后续新加载的数据不做排序处理</p>

<img src="https://onedrive.live.com/embed?resid=DA8363D294AD6D2B%211122&authkey=%21AA_kctRgW9tNjAQ&width=1024&height=999999" width="1024" height="auto" />

#### 个人主页「我关注的问题」、「我关注的收藏」可以一键移除或将移除的内容添加回关注

***注：由于知乎接口的限制，关注及移除只能在对应页面中进行操作，所以点击「移除关注」按钮将打开页面到对应页面，取消或关注后此页面自动关闭，如果脚本未加载请刷新页面***

<img src="https://bnz06pap004files.storage.live.com/y4mbZNPw7OZA5zbinGMfYhJN2Yb1vThLOpqM096m8bnSEm3Hi77OyazOeR7cjFbUfLvzVYpyNpihoGRArUTBYCTlI6BFqwSxXmVhU_m1PXci6tSo_r0_XvRnZW3fMgLnahIBoVUrjpeDBnqySRAjqqezw88shAdrOOb8ao7Xep9MBfXBHBAnNCelaTbz6l14KSy?width=1024&height=469&cropmode=none" width="1024" />

#### 一键邀请功能

<img src="https://onedrive.live.com/embed?resid=DA8363D294AD6D2B%211312&authkey=%21AAASWfmg8Hhe7rE&width=1028&height=485" width="1028" height="485" />

添加一键邀请功能，点击即可邀请当前页面所有推荐用户

#### 复制代码块删除版权信息

复制代码块内容删除烦人的版权信息

<img src="https://onedrive.live.com/embed?resid=DA8363D294AD6D2B%211319&authkey=%21AE_fgVVOOid4wOU&width=1024&height=999999" width="1024" height="auto" />

#### 静态图片弹窗观看点击键盘左右直接切换到上一张或下一张

查看图片点击预览大图时，如果当前回答或者文章中存在多个图片，可以使用键盘方向键左右切换图片显示。

### 基础设置

#### 基础设置 - 基本设置

##### 更改网页和标题

<img src="https://bnz06pap004files.storage.live.com/y4mwpJxepWLgAGAVohF0i_rh8p_LEgUn_wU_JeDlZB257vMzcrp_w8aZv5KROuzRA9zTApWrbeuvipODusa0SGxaSebTTAwAnm1cccJHwJarBJ_mmLfX928z2w9y-mMaAWKynYJyPapGooSszgdvCK2B0g8YBAf1eZ3RYK_OJ7VOiFKfs1BQcrgSRd6tLSFxQo8?width=1024&height=639&cropmode=none" width="1024" />

##### 自定义回答和文章图片尺寸

设置此项可以将回答和专栏内图片按照所设置的大小进行缩放，并且在缩放模式下添加了所有的图片弹窗预览。

「使用弹窗打开动图」在图片缩放模式下极为好用

<img src="https://bnz06pap004files.storage.live.com/y4mn0WCV4AeRizRJggESO-70r0GlJjeCiIyL6JHU_Kckfsff2ET3CoNsyWRisLZE2kn0kORbuQ6p0OaEjt_djhASBwV_QQe5Iub6i5ddsIyqa1HNyphDDMOM07hE5RPhTp9fh3j94ca1RxbBVH47s5hv2ULOQ3gSTw2ymIHwE0DOBfsaMFTHAfta4nqm0U2R0vD?width=660&height=641&cropmode=none" width="660" />

##### 使用弹窗打开动图

勾选此项所有的动图点击会以弹窗方式打开

#### 基础设置 - 悬浮模块

##### 回答「收起」按钮悬浮

将展开长回答中的收起按钮悬浮显示，建议在隐藏问题详情操作栏的时候选择此项。

##### 信息模块悬浮

悬浮模块，可以拖动自定义位置

<img src="https://bnz06pap004files.storage.live.com/y4mwNoK1snkbOYlJF0WsGJSucfKh_SMEgcRkoXUqYJ8RsQknOM4oZi6F2d5c9opZ8xc2eYrkpec1BUTp9Y4R-OQXz8N6rByTF5drwU-PTSvvFeNFj1jd-jZJvewwlZNyXapIUpfF2DuubPqWM0S50dhlVR2CY0T1OX3oXcnK0np9GJDae0t5GXjDyPIbIr0l3YS?width=1024&height=560&cropmode=none" width="1024" />

#### 基础设置 - 黑名单设置

在使用该功能前，请先点击「同步黑名单」按钮同步黑名单内容（黑名单内容仅为演示）

开启该选项后，在问答详情中将会过滤该用户的回答内容

<img src="https://bnz06pap004files.storage.live.com/y4mliXAXchX2uoVjwENCG3MYLKL-fYIIM9XPUtsZnptt6DokVzVd08x2hPz--WK3jfc6Ia7yMQwMQ_6uIsY41Djattqhf2Y6Bn0fd_S_3SW6b4p_--_vYmr3M29FaoH4FXsjQWajFeLZn4-Sko_BtkM3T4Nuu0-DPlDVE-5u-iL3Q0vPXoWUyjhwsqZwasCPZ1c?width=660&height=654&cropmode=none" width="660"  />

点击已屏蔽用户了列表后方的 x 可以进行移出黑名单操作，跟知乎移除黑名单操作一致，不过如果是在知乎设置页里进行了「移除屏蔽」操作，需要手动运行同步黑名单。

列表用户名后显示「屏蔽用户」按钮开启后，在回答页面用户后将显示「屏蔽用户」按钮，点击屏蔽用户将调用知乎本身的屏蔽接口，仅对应知乎原生的屏蔽用户功能。

回答列表页面添加「屏蔽用户并隐藏该回答」及屏蔽用户后的解除屏蔽按钮

<img src="https://bnz06pap004files.storage.live.com/y4mycVRs_iN0ljlYMudcDJ_GkK8_nP7l5zGVNoNwW9bmH2sGHlpHKdJpL6VyUtLu-HjVZ9Lio8bAP2v86_rE6-z4tsDmkZtPOtWcwoqdqVZiGJZxDX9zTVCQPm8uZ6uLMyRcT3IljXPQMD7zFjZf34FRUUQO5JpWm59XupoxHS8qSNmEgZvp-eoMcNvzbaxrXQY?width=1024&height=616&cropmode=none" width="1024"  />

点击屏蔽后（或未开启过滤屏蔽用户回答）

<img src="https://bnz06pap004files.storage.live.com/y4mM7EyuAgRFTiMUPdPsoprp8CbJfsqm11QzOabFh8Vhe9lOh1bPOC94RtoFOPHD36Qt4X87ogfjMeDcfyabtSUA9lZJByCieedZdduTo7n8iexYwe0FeO-CRxmVo0qfoOQCCuONAosYOtpi-F9724ZlGEF2-UOYcasyYTjCmKjF0Hg0-YTOwWlhbmabEJjYZX6?width=1024&height=664&cropmode=none" width="1024"  />

#### 基础设置 - 通用模块隐藏

通用模块，比如首页顶部操作栏和滚动操作顶部可隐藏

广告模块隐藏

所有的回答操作文字可进行隐藏

#### 基础设置 - 颜色设置

<img src="https://onedrive.live.com/embed?resid=DA8363D294AD6D2B%211355&authkey=%21AO8NCx0TYnqsdk8&width=1024" width="1024" height="auto" />

设置为自动时，背景色可跟随浏览器颜色变化

#### 基础设置 - 配置操作

这里可以导出当前配置，导入配置时将导出的配置内容复制进来再点击【导入】按钮即可完成导入

此部分将自己定义的 css 样式写入即可生效

#### 基础设置 - 默认功能

此模块为修改器自带功能的提示

### 首页列表设置

#### 首页列表设置 - 基础设置

##### 列表版心宽度

单独设置列表的版心宽度

##### 内容标题添加类别显示

列表内容标题前添加类别标签，直观区分【问答】、【文章】、【视频】、【提问】

##### 推荐列表显示「不感兴趣」按钮

推荐列表【不感兴趣】按钮可以设置是否外置，点击删除该条内容并且自动调用【不感兴趣】接口

##### 列表更多「···」按钮移动到题目右侧

##### 关注列表高亮原创内容

选择此项后关注列表里原创内容【发表回答】【发表文章】【提出问题】后将高亮显示，在所有颜色设置下生效

##### 列表内容点击高亮边框

设置此项后首页和回答详情列表在点击时边框高亮，同知乎原生快捷键 S 键

##### 列表内容显示发布时间和最后修改时间

##### 列表内容标准文字大小调整

可自由调节列表内容文字大小

#### 首页列表设置 - 屏蔽内容

##### 关注列表关注人操作屏蔽

可以设置屏蔽关注人「赞同回答、赞同文章、关注问题」操作内容。

##### 列表类别屏蔽

通过列表类别过滤内容

勾选「邀请回答」后推荐列表将不会显示邀请回答内容。

勾选「商业推广」后搜索列表将不会显示商业推广内容。

勾选「文章」后推荐列表将不会再出现专栏文章。

勾选「视频」后推荐列表中将不会再出现视频内容。

##### 列表低赞内容屏蔽

设置后，点赞量低于输入框中的「推荐页、搜索页」内容会被自动过滤

##### 列表屏蔽词

关注、推荐页面将屏蔽包含题目屏蔽词的内容。

输入框输入后列表将会进行关键词过滤，可过滤多项，无上限。并在关键词过滤后自动调用“不感兴趣”的接口，防止在其他设备上出现同样内容

#### 首页列表设置 - 隐藏模块

首页列表和搜索列表可隐藏部分显示模块，前往编辑器查看更多

### 回答详情设置

#### 回答详情设置 - 基础设置

##### 回答版心宽度

单独设置回答页面的版心宽度

##### 问题详情显示创建时间和最后修改时间

<img src="https://bnz06pap004files.storage.live.com/y4mjXltdYptJVGNdPMnfauYAeOd0BfKuoF7xFvNlqtn_NjGN6RqjdmypGjJqsPyLvKec5M-1pCRJyt4ocCE1vtnQQNFX-mflRWhTPmzgzbjY-Fq7ufpuXg71sb4Md_1152KIK1egHXzRElqUnQnkNaMV-TJ_0_m35Hndb6_nU23yW46BKnz2D7dQQ9MY0fi4Wkx?width=660&height=377&cropmode=none" width="660" />

##### 回答内容显示创建时间与最后修改时间

##### 购物链接显示设置

可以设置回答和专栏里的购物链接只显示文字还是隐藏。

##### 回答视频显示设置

可以设置是仅显示链接还是隐藏，优化浏览体验

#### 回答详情设置 - 屏蔽内容

##### 屏蔽官方账号的回答

屏蔽勾选的官方账号的回答

##### 屏蔽带有标签的回答

屏蔽带有勾选标签的回答

##### 详情低赞回答屏蔽

<img src="https://bnz06pap004files.storage.live.com/y4mikY2myD2uBtMhPk5SAzOqYxTIZa8Iv2QXTtFI30LLnG7EQPtpkqynKz7m3YuVtyAKTwnlRvC22wiuMpkKoDwFS-ybSNPRoPgapkkPW9wDpXXoDcG1gvKSLNFTVuH7JwvNwiHpkLlSnh45-BjZic-08dgKWlfSNFkVntC5d70Wn80xKlJTANxkMjtgrC5ruVH?width=660&height=657&cropmode=none" width="660" />

选中后，点赞量低于输入框中的回答会被自动过滤

##### 回答内容标准文字大小调整

可自由调节回答内容文字大小，效果可参考列表文字大小调整

#### 回答详情设置 - 隐藏模块

回答详情页面可隐藏部分显示模块，前往编辑器查看更多

#### 回答详情设置 - 回答展开收起

自动展开所有回答：通过推荐页进入问答详情时默认会收起长回答，选择此项后进入页面会自动展开所有收起的回答。

默认收起所有长回答：选择此项后问答页面所有可收起的长回答默认都是收起状态，方便浏览。

### 文章专栏设置

#### 文章专栏设置 - 基础设置

##### 文章版心宽度

单独设置文章页面的版心宽度

##### 文章发布时间置顶

##### 文章内容标准文字大小调整

可自由调节文章内容文字大小，效果可参考列表文字大小调整

#### 文章专栏设置 - 隐藏模块

文章页面可隐藏部分显示模块，前往编辑器查看更多
