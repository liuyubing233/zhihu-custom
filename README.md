<a href="https://github.com/superPufferfish/custom-zhihu/blob/main/development/changelog.md" target="_blank">更新日志</a>

<a href="https://github.com/superPufferfish/custom-zhihu" target="_blank">Github</a>

<a href="https://greasyfork.org/zh-CN/scripts/423404-%E7%9F%A5%E4%B9%8E%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%E5%99%A8" target="_blank">GreasyFork</a>

发现 bug 和想要添加的内容请反馈给我，感谢！！！

插件目录跳转失效请移步<a href="https://github.com/superPufferfish/custom-zhihu/blob/main/README.md" target="_blank">这里查看</a>

Safari浏览器下在[知乎](www.zhihu.com)使用TamperMonkey会报错，导致插件无法使用，暂时没有解决头绪...
```
Refused to execute a script because its hash, its nonce, or 'unsafe-inline' does not appear in the script-src directive of the Content Security Policy.
```
<img src="https://by3302files.storage.live.com/y4mVi9J2xNNGWP4VYxRPRquLOGPzu69BSk6kyzN8dkYI2621zoUYuQbkIaq9HaS2RgMa-LJH8azYF-Akh4fxJUhWj3ydhKGV3PjU1974qhiKMElT8wzaW0ygkuV1UmMhOTQ6TkwcT_-wBV0o9N9NoNpe_5xHZwy9p9vfrHYp68eWM71Z6Oh2UTIfNR2sFU2CipM?width=1024&height=58&cropmode=none" width="1024" height="58" />

## 插件目录

- [一. 唤起方式](#一-唤起方式)
- [二. 默认功能](#二-默认功能)
  - [1. 外链直接打开](#1-外链直接打开)
  - [2. 视频下载](#2-视频下载)
  - [3. 屏蔽设置页面添加一键移除所有屏蔽选项](#3-屏蔽设置页面添加一键移除所有屏蔽选项)
  - [4. 移除登录弹窗](#4-移除登录弹窗)
  - [5. 收藏夹内容导出为 PDF](#5-收藏夹内容导出为-pdf)
  - [6. 回答内容按照点赞数和评论数排序](#6-回答内容按照点赞数和评论数排序)
- [三. 基础设置](#三-基础设置)
  - [1. 极简模式及恢复默认配置](#1-极简模式及恢复默认配置)
  - [2. 回答和专栏图片缩放](#2-回答和专栏图片缩放)
  - [3. 更改网页标题和标题图片](#3-更改网页标题和标题图片)
  - [4. 页面右下停靠返回主页按钮](#4-页面右下停靠返回主页按钮)
  - [5. 问题显示创建和最后修改时间](#5-问题显示创建和最后修改时间)
  - [6. 关注列表高亮原创内容](#6-关注列表高亮原创内容)
  - [7. 页面悬浮模块](#7-页面悬浮模块)
  - [7. 列表内容高亮点击高亮边框](#7-列表内容高亮点击高亮边框)
  - [8. 文章发布时间置顶](#8-文章发布时间置顶)
  - [9. 首页列表显示创建与最后修改时间](#9-首页列表显示创建与最后修改时间)
  - [10. 回答列表显示创建与最后修改时间](#10-回答列表显示创建与最后修改时间)
  - [11. 版心宽度自定义（20210717新增）](#11-版心宽度自定义20210717新增)
  - [12. 「屏蔽用户」按钮外置（20210823新增）](#12-屏蔽用户按钮外置20210823新增)
  - [13. 不再显示「已屏蔽」用户发布的内容](#13-不再显示已屏蔽用户发布的内容)
- [四. 首页设置](#四-首页设置)
  - [1. 首页五个模块位置自定义](#1-首页五个模块位置自定义)
  - [2. 内容标题添加类别标签](#2-内容标题添加类别标签)
  - [3. 推荐列表外置“不感兴趣”按钮](#3-推荐列表外置不感兴趣按钮)
- [五. 过滤内容](#五-过滤内容)
  - [1. 过滤知乎官方账号](#1-过滤知乎官方账号)
  - [2. 过滤列表类别](#2-过滤列表类别)
  - [3. 关键词过滤](#3-关键词过滤)
  - [4. 关注列表过滤](#4-关注列表过滤)
- [六. 回答设置](#六-回答设置)
  - [1. 自动展开所有回答](#1-自动展开所有回答)
  - [2. 默认收起所有长回答](#2-默认收起所有长回答)
  - [3. 回答【收起】按钮悬浮](#3-回答收起按钮悬浮)
- [七. 隐藏模块](#七-隐藏模块)
  - [1. 购物链接显示设置](#1-购物链接显示设置)
  - [2. 广告过滤](#2-广告过滤)
  - [3. 顶部模块隐藏](#3-顶部模块隐藏)
  - [4. 列表内容隐藏](#4-列表内容隐藏)
  - [5. 详情（问答）内容隐藏](#5-详情问答内容隐藏)
  - [6. 搜索内容隐藏](#6-搜索内容隐藏)
  - [7. 专栏内容隐藏](#7-专栏内容隐藏)
  - [8. 回答列表中的视频显示方式](#8-回答列表中的视频显示方式)
- [八. 颜色设置](#八-颜色设置)
  - [1. 修改背景色](#1-修改背景色)
  - [2. 夜间模式](#2-夜间模式)
- [九. 配置导出导入](#九-配置导出导入)
  - [1. 自定义 css](#1-自定义-css)

### 一. 唤起方式

在页面左侧处触摸出现眼睛按钮，点击弹出修改器弹窗。

弹窗唤起后点击背景或右上角的关闭按钮关闭弹窗。

<img src="https://by3302files.storage.live.com/y4md44Udu1ToWvEweYp159wttkOXFcuV1EarS9ZEZIFSuwrYXsPmGibCqpIzMxp2bgDKvTNq4R8tDpS2T5MqID-Y756FzIj-MhZs6kRYlvauimr6h6If90aS0O64LbjJdx2_Kra4e5dShX0EE9_-t_IP3bC__flBIUfx_EHcGsSj7p_jGhWHUbF313g6M1TKrUN?width=1024&height=602&cropmode=none" width="800" />

### 二. 默认功能

#### 1. 外链直接打开

将知乎里所有外部链接的重定向去除，可以直接访问。

#### 2. 视频下载

知乎视频现在在左上角会生成一个下载按钮，点击即可下载视频。

<img src="https://by3302files.storage.live.com/y4mAMNtMnqmvplhJhaX2R7miQ-wv75-zAYeGahGlfybYFESgcpKv696Zcwok-YLpv-PNJzGoBzUzARWdwZgC025DfdVrE6LAG5Tioj_aiuHvL4FyM29vd1qS4ya2hv5FNEFyEYv38fUstYqOMOYaZlTKjLTplk0FEcIH7w6_WwnVMzuDGTM8KaxihNVSHvQZi8E?width=1024&height=702&cropmode=none" width="800" />

#### 3. 屏蔽设置页面添加一键移除所有屏蔽选项

因为知乎屏蔽 TAG 每次只显示部分，建议解除屏蔽后刷新页面查看是否仍然存在新的屏蔽 TAG。

<img src="https://by3302files.storage.live.com/y4mgpz5fP0fXYeq33PZ-6_CEqTmQHArhcPnngb_YYCurPpRg0wjbibzbaA-tz80g7RtYbDt5aVIWvm-wqJkN59zthOOXg5XHHCz-8ejrrXxTYd8hjYZPj-i2y-xoO9Uwz6g-pvfnvK7ezz8jmfSt_J04l0lN88omVzpKVEP7GbUnrekgekDTGwx8PRrAUURTFe1?width=1024&height=443&cropmode=none" width="800" />

#### 4. 移除登录弹窗

未登录状态下问答和专栏移除登录弹窗

#### 5. 收藏夹内容导出为 PDF

在收藏夹名称上方显示【生成 PDF】按钮，

点击导出当前页码的收藏夹详细内容。

<img src="https://by3302files.storage.live.com/y4mBAd7pcfJLDGO6eTp9QMr4BpIv9uJFOJp36mqHJ8TZZ8zxRIIBaeReR6BukraUXU7m_ixVKdcx52jlzfZBKy017Rqlc-ISArd3RgfBBQojfpSNrDO5J6WPvb54BueAT1y3ok2q7IOvx_9TOg3zPEEPH6q2igjIBavlSgyf3Fisvn-d2V1mYDQbJnLggz9otTR?width=1024&height=418&cropmode=none" width="800" />

调用浏览器打印方法，等待一段时间后生成 PDF：

<img src="https://by3302files.storage.live.com/y4mh3hbhNlSEi28HSbRZAPJwwWymCrShD162KSkjBZqpPfmGSgn-nY8d7lh1aVOv83cAm5SN7_bzHNIH9ofUNrgZGslH7z8frjgeuZkYsH7r0QRawYD3yXC9M6cu6MEitWi4TX9imcayzg3pAnHsmkPULR8LW0kQ6psKwCDG_2cStbpNNJg-Q96PTM4x9VOz83N?width=1024&height=466&cropmode=none" width="800" />

下载的 PDF 预览

<img src="https://by3302files.storage.live.com/y4mVvDZC3X45KzJUxF4m4_aMPdeiInIyOKzXz8klEtw5Rs3_Ih0Cr_jZ2MN9QwZ0culgSkx7qqwrL2V--0ApvuO_F7TuIi9NPF2E8lnfZgYNSSGgStBYTyXavxCLfG1YNTc6yG2yQr-fQAe0PgfpwT8vEOscrtDSioFiVi1XSDDisDAEwZ0xz5XUj6dI6l6P9lx?width=1024&height=430&cropmode=none" width="800" />

#### 6. 回答内容按照点赞数和评论数排序

在页面加载完成后点击回答右上角的排序按钮，点击【点赞数排序】或【评论数排序】后，页面刷新等待排序完成。

因为知乎并没有开放点赞数和评论排序参数，所以只能每次加载后按照当前的数据进行页面排序

<p style="color: red;">为了防止页面错乱，只对前20条进行排序，后续新加载的数据不做排序处理</p>

<img src="https://by3302files.storage.live.com/y4mGIVdrryH0No61yjWLsVzP4JtrfuJG9QfOYsJOKW7KL1N3Jfh349HFwL7eO5F5Zb2nEXE-GaoJG-FT8ObMf6D2NyMPvWbGOyOoohClW0UlHfB_hSnT-zRoktlLxoBE7bRgP0XioTxnuEWzySMVokLU8X2rE2O1hAC02lgtThGoAs1Bkjs5X3il11dauoKF6ma?width=1024&height=458&cropmode=none" width="800" />

<img src="https://by3302files.storage.live.com/y4mLzCKl5n4tGM1j2j1WdL0u3XU0_fzJpwKGh1NSf7Kf0eFZ7_tyDDatvEI1pq5k2KDYwCO5kmMapNx3dEDv2ClBv9x8BqNwUG94Mxy6AfHuCJUFCIMx9icoBUtAYGpUJiCvQkJLVPIPqu3iLFxj8yU-gOjcaQIB_ptMPLtaAr5xZbzx-VcBbsHIOD21veU7V1c?width=1024&height=467&cropmode=none" width="800" />

### 三. 基础设置

[返回目录](#插件目录)

#### 1. 极简模式及恢复默认配置

点击【启用极简模式】按钮则将页面改为本人配置的极简模式样式，如需修改功能样式在修改器配置修改即可。

点击【恢复默认配置】按钮则将页面还原回默认配置样式。

极简模式预览：

<img src="https://by3302files.storage.live.com/y4mSqmevK_F5UP654n4eKDHlgu6xtxqTjmRWEs8flN-zT1WNBRlD48kmq0LNN6zTfbuCvSs9tZrYwy-BJWj1KtIHgVzxuAmRyz-lAp2lXw1NCbDmCu0Ygstn12-XCiwDyhEBH9BivHojeYZbe3qg1o8_cCW5aDlQKOw11VCOJQV9ab7-Oiy6y3na0dOkSZAzUNW?width=660&height=327&cropmode=none" width="800" />

#### 2. 回答和专栏图片缩放

设置此项可以将回答和专栏内图片按照所设置的大小进行缩放，并且在缩放模式下添加了所有的图片弹窗预览。

【动图弹窗显示】在图片缩放模式下极为好用

#### 3. 更改网页标题和标题图片

<img src="https://by3302files.storage.live.com/y4m2FJaLWI6rv17hJgdzSSjm5gnySjQBcCNTthEW-bzzga3K3lod1CYgyusqKjHrsMAADwjWhLKH1SrT_wWwvl20llZGuJwbch8GHuTMov3Qqsi22vks6vSrEnB0D20Kh25UANYOy422nuAH562Ub72oPhYEWERIs6W4mrLCPEY-B_VWSAowmEB-x-No-vV0MEv?width=1024&height=621&cropmode=none" width="800" />

#### 4. 页面右下停靠返回主页按钮

<img src="https://by3302files.storage.live.com/y4mOhBqjWja1SLqIRo4QLazE8n0DZvcI43xDG93YdAUlFWNKuaLoT_i0bd5RnME_sUkwwry3Z6tfMoapI9G8HgsmEBD5BcGiXE8XV2A8Wb7V6M9l24QtskLRtd6dHNVRc3PagYBxVhRmbyP_ysDOmRndvRlxwdwCOdt-IwCS9Hs9TI5Rg71c4qQkoG5XcwM_AEF?width=1024&height=507&cropmode=none" width="800" />

#### 5. 问题显示创建和最后修改时间

选择改选项后会在问答页面的问题标题下方显示创建和最后修改时间

<img src="https://by3302files.storage.live.com/y4muxyVssoNjJGR6jPVBwSrmqZQGvJAGYJf05588XA3BIZnqPpZgCSJ0dtLzVnCMjrG8FkEVIa3rJlV97WoDbppQZZ-wdY0lYs1eJZ-XPa2ohnJad6BFmnlsNMUirMouOXMLG6R_rls8xLVpVnVzKKBGpZ3H0kkODptXPGUPOAxboof01gU90NqxKW9IxOvCque?width=1024&height=351&cropmode=none" width="800" />

#### 6. 关注列表高亮原创内容

选择此项后关注列表里原创内容【发表回答】【发表文章】【提出问题】后将高亮显示，在所有颜色设置下生效

<img src="https://by3302files.storage.live.com/y4m19EHE0XCoYwlBwhNfzOV1mvcpDDKJTmkYH616fSe5RCx5Gfd42ul8weBHLVcMKt3FyWBo2vzZKtUjNXP-5qPgEJN3P1Qa_VBin_TpLuY0yucgy8gYEXdC1MvwFE0G0V1U4yiz01oiClKM9o1Aryuiul3_IMxleO8Zzh4dNc5-rX19RLXJmF7V5QYtUnQ4uVJ?width=587&height=496&cropmode=none" width="587" />

<img src="https://by3302files.storage.live.com/y4movgDT2h4PN6dyYuCvEcmgp4MoWThn4hmsHcuBcMCY_E8-ZfM4O5AvoyD26_WVx5bbqFZD8apMJVULc9vmJDRWfb_AEAk1a-KpuBamZ4isWwLRnpWBBYPNz494X0zc3EfTs9oa_J-Sa-St6UsAlmD6NBQVM5XO8vF_rGukUaJwZ9LOyq79e_TxUsperLfGscT?width=1024&height=758&cropmode=none" width="800" />

#### 7. 页面悬浮模块

模块可配置是否悬浮显示，其中问题列表切换模块可设置是否隐藏。

<img src="https://by3302files.storage.live.com/y4mdxyLs_3HIkxZ6dknGySUHvyiuBKo6FQ8RTU18JVsvMtGefDCZgHZ41Hca5XMOGsR18xTNJb056yqP-J6ccGnl2JRt6c6aQTNTS_-FuNMsARrsbieqr7Nhd0RLE2xOCDe7FypC0_VKWKHOwxMV7VTdPt468tHL6te6OYTdL9NbL4sISVw17lyN_9AiEQNZge5?width=1024&height=284&cropmode=none" width="800" />

<img src="https://by3302files.storage.live.com/y4mXdEW-aTkkazcsDRSYStdnJRCoEHvcpPQSvOP0Vucnb1wtFwDqdLYiG8Tf1m2XCmFPuwd9oEVsl9iANPoIy3RZSwKmAAPjUKwP4XasBeDbxFIft9-l7NTBXMJXBxwwinpl0MrtNaBijAGplZEM6TWrh20ogxBDbfk1TUePAUUuImDxILtCfewdY5Q2fxuBDje?width=1024&height=508&cropmode=none" width="800" />

#### 7. 列表内容高亮点击高亮边框

设置此项后首页和回答详情列表在点击时边框高亮，同知乎原生快捷键S键

#### 8. 文章发布时间置顶

<img src="https://by3302files.storage.live.com/y4mrllfKDnCo_M2nEB2KYC3stVQQLhxe-AWbfcKRdCWSHh0NXs6Lh7yFVXZldLe1mQqLQrnfOIfQuAeH2ygsktczYa0jm-gjbF709JRoZfuY1Zh4Z08dF1BU9o--sdV7ROe3Bw4Dov_abzCqPprrtCJB5ycRhZn0xsOWPJOrrT0qtti4C7UWzReO4Ig9Dd2BN98?width=1024&height=504&cropmode=none" width="800" />

#### 9. 首页列表显示创建与最后修改时间

<img src="https://by3302files.storage.live.com/y4m05GjqvaVsLL9bKkY9TIFywr9x8EUmjao7eAe6Wg6bRtPTjva18t2IICu3fhp0xWqVnM-Y88lFpP11Rey2EMaJTR4JY4TMW1iLEPbyydgcmQSQxCcxntLhfNl0eGPKm7i2mMbMswBMBR6zYQ2ncU0FCXTpgDXkv4Nc-RtEWpgoluHO1gObtIdPtkxahc33F8j?width=1024&height=509&cropmode=none" width="800" />

#### 10. 回答列表显示创建与最后修改时间

<img src="https://by3302files.storage.live.com/y4m8d2x1gf2Ldvmpo3ukUjLrJkW_ocN_MX_0nFnl63X2rWrVjss6B3smdBYoApyqIqiPzBdBNW3BwjVEgqGftuT1xb0E1IgYqdFv31FYPWxeO-c8ch-CAhU1p6Yg_YXoer0-q2f6LudBTOFDlrPgO11WZSY7EkluhMjGaS735I1HGt_I0lBBQOf5iF4qECLNQac?width=1024&height=509&cropmode=none" width="800" />

#### 11. 版心宽度自定义（20210717新增）

选择设定版心方式为【自定义】，可以手动输入数字来调整版心宽度，再也不用担心宽度被束缚了！
注：默认1200，输入数字小于1000会按照1000来处理，以免因为版心过小导致排版错乱，暂时不设置上限。
选择【使用预设】（默认）则是使用作者给出的1000，1200，1500和拉满四个选项。

<img src="https://by3302files.storage.live.com/y4mjR0VN4GrWRtUjggsd4Kpt-4vCMTkIzcva5QYX1oAb3xOY32ktZTwG8vaFEHi5jJCM-0VU2w4awzMXKA7vm4w2EjSal-UpsMGezZJ_bUIA6vLcCdar7pGrWTPLN2s1gO6IrNFddZo4bwqZ0gILsJMpX0TYhzVaampGbzqiytvI8O9bWqaGuBc66wij3bhhF6h?width=660&height=194&cropmode=none" width="660" height="194" />

#### 12. 「屏蔽用户」按钮外置（20210824新增）

点击屏蔽用户将调用知乎本身的屏蔽接口，仅对应知乎原生的屏蔽用户功能。

<img src="https://by3302files.storage.live.com/y4mZ6PRLOQPrjjEq0IGYM0xYCGSm4uvgQn1F15czFg2ddbLdRUlPX8kiRj3-d_P-WxZYsrm22OWuo4LE1tu4VaLGocY5ptSjJtCyZVua_DZrmauJ3avDpvKdVjQ0BzFeCE7Mr5_x3PPe8NPCjYPcfHTBOYkg03zIBWFHK-JcYt9tOth2Hzpxrb3JFulFDVGMkh9?width=660&height=357&cropmode=none" width="660" height="357" />

#### 13. 可设置不再显示「已屏蔽」用户发布的内容（20210824新增）

在使用该功能前，请先点击「同步黑名单」按钮同步黑名单内容（黑名单内容仅为演示）

开启该选项后，在问答详情中将会过滤该用户的回答内容

<img src="https://by3302files.storage.live.com/y4mXQ8wJIV1lE_BoqRS7m1EyM0NC4UVPu0ZCTU1e-7MZuyuGMD0N7knigO3bnvNvMv41-pmv-Uz8-YjJqs_B8QXPqvAdknUXGa48pQrQbEFeE0kfxV2x-658uBPBs3tGpqm8IcVYv9m3Vs8VmrnOkQSqaA8isSD0ewMHBNELK46glj4KPEmeCKmZiIeQOIp2pfH?width=453&height=405&cropmode=none" width="453" height="405" />

点击已屏蔽用户了列表后方的 x 可以进行移出黑名单操作，跟知乎移除黑名单操作一致，不过如果是在知乎设置页里进行了「移除屏蔽」操作，需要手动运行同步黑名单。

### 四. 首页设置

[返回目录](#插件目录)

#### 1. 首页五个模块位置自定义

首页五个模块位置自定义配置，可根据优先级排序，可设置是否隐藏。

列表标题添加类别标签，清晰的区分列表种类。

更多按钮（即列表中的【···】）是否固定到当前列表最右选项，极简模式默认启用。

<img src="https://by3302files.storage.live.com/y4mBQ5JJN6ET0jMbCzXx5CDDHnJ0VNB19k5rQvLVIylYhHu7BrXQvjU1jXVtkMlZ01zexqE-1Ak7d-rhAIatydoc6HG0KOYxbDIwxXJhjIjismqrALZWX0_SJOrJR9HNYMBdjtfA_4o_wFmX6jqaz-t4x-gW01hP8D2Jm5Wdta675Cbc9mmbYhItvhGCIgkIhS3?width=1024&height=534&cropmode=none" width="800" />

#### 2. 内容标题添加类别标签

列表内容标题前添加类别标签，直观区分【问答】、【文章】、【视频】、【提问】

#### 3. 推荐列表外置“不感兴趣”按钮

推荐列表【不感兴趣】按钮可以设置是否外置，点击删除该条内容并且自动调用【不感兴趣】接口

<img src="https://by3302files.storage.live.com/y4m-hW8_FsqrpJWLf9xtYxscE9M_9XMus4Eb9yLEy2c6T-hNfHuITz7_he2mcI75K2eomhdCm9ZLrh9IZw62Fh3J5SNhHUdxxpvzHvujUYxBAVt3E5HeCaw9ClHTIqNmFNmyzxmRiMu4kJlGn68Czd6Ry81yyRyhbOmCwDD3UOHfwt0iWM6hl2p9xhH9hBCl_pB?width=1024&height=447&cropmode=none" width="800" />

### 五. 过滤内容

#### 1. 过滤知乎官方账号

设置在问题详情中过滤全部知乎官方账号还是故事档案局盐选科普等回答。

过滤后问题详情中将不显示对应账号的回答，在控制台中可以输出过滤的回答账号。

<img src="https://by3302files.storage.live.com/y4mWCP8aJwzoi3qUkD0SKE3S6YyABKM7ekHGiLoeHk-b4Y_-cxiz0G11ysE82JoBWa5KPZ1YLzGXNekuMw1yXK-QrwI4eQKqMVUSJ9-0gu2wCbli7eQaKBCSN8kYN4PTlnrghX7RVs0OW-eewWDhwIcSnMTGuaUlDDSmdzEOlGwWI9ocOgh-3yUNy1OwdFbD6k-?width=1024&height=537&cropmode=none" width="800" />

#### 2. 过滤列表类别

通过列表类别过滤内容

选择【问答】后推荐列表中将不会再出现提问回答内容，建议保留。

选择【文章】后推荐列表将不会再出现专栏文章。

选择【视频】后推荐列表中将不会再出现视频内容。

#### 3. 关键词过滤

输入框输入后列表将会进行关键词过滤，可过滤多项，无上限。

并在关键词过滤后自动调用“不感兴趣”的接口，防止在其他设备上出现同样内容。

<img src="https://by3302files.storage.live.com/y4m7oXD2oTCdj74Zy7oMC9LaiabLYduduSqiMgFrJ1vATwHQTlIHfdxqe8tWzQ3AZTWzo1K5e7dKy5rXtogNFWlyCyHpydOZYzVFl1MEPI6H9XBIGjfM4e83dJYnsNmCt2atg_RRnmxTbQ0AcySQg5Bskj8Zd0nXad9DEr2KyDeRHpPtcMt6tEZikAv-zxJ1sdf?width=1024&height=528&cropmode=none" width="800" />

选择【屏蔽内容后显示通知提醒框】则会在关键词过滤后右上方弹出弹窗提示过滤的内容，3 秒后自动消失（只是为了满足好奇心）。

<img src="https://by3302files.storage.live.com/y4mSE-0VR0yzJI3WaR-1a3yfaeqo9D-RiomOTZ1t5-t0f5821DFQPXLnfcBUjMglJSzlYbB4k7pmx3tifr4-xGAFBVyTjTUGW4Tz7LAzHJS-F5CAnTN-6qPEaNXemOj8qV84Uy96XbgdyNoM_AMu086pZOzeYMRcp7TN7NZ-CG9QTmMU5hiHUKoWem4kCjZ7-xX?width=1024&height=536&cropmode=none" width="800" />

#### 4. 关注列表过滤

可以设置过滤关注列表的【关注人赞同回答】【关注人赞同文章】【关注人关注问题】内容

### 六. 回答设置

[返回目录](#插件目录)

#### 1. 自动展开所有回答

通过推荐页进入问答详情时默认会收起长回答，选择此项后进入页面会自动展开所有收起的回答。

#### 2. 默认收起所有长回答

选择此项后问答页面所有可收起的长回答默认都是收起状态，方便浏览。

#### 3. 回答【收起】按钮悬浮

将展开长回答中的收起按钮悬浮显示，建议在隐藏问题详情操作栏的时候选择此项。

<img src="https://by3302files.storage.live.com/y4mXC-x6WlfP9sb0GrdPGZ_QnwQYssK7fZAwkNHxNsFoxWZdlU6jSFV1FxskWtrN_nLcVVqDr4c59d-LyzGKjbByb1hdfhv3pyGq1tWt7L-ap6IRpWPvsBPfqvWMNGa2UZ_GFjVU4OK6t-BUnuw4wu0yCoRK0qO1SVhl6P-_lYzLjduPvK1lQ_l4sNCZmoFAIO-?width=1024&height=446&cropmode=none" width="800" />

### 七. 隐藏模块

[返回目录](#插件目录)

#### 1. 购物链接显示设置

可以设置回答和专栏里的购物链接只显示文字还是隐藏。

<img src="https://by3302files.storage.live.com/y4m4ik3yB0dIlQO0wB_n2WH--hZYC4V475JMKZpBuO3XvBh5unbCFNhmCoG3lbtu_9uYvr0tThWW2MIA7S-QPDHlY0Om_ZpKRvkNZrBVBFSacwR0HyXCs4cqU2xE7kag6krbPaA4DoyCT5EoiyRjSFLuo_op35psObGVwVWGy2XEYPr1wlhUbQQHvkrjpK8yUvb?width=1024&height=489&cropmode=none" width="800" />

<img src="https://by3302files.storage.live.com/y4mPjP3GrR_1gKQyDrnLfhguGpXxx2gFHNyQURJoF3Qe_mPQuJ9p8yIAzJH2gOquZcerDL_chhORJ8YHLfzw5XKdo2_V01QefKOxbhO3i9MVf7IZXp-O-u8a1LBhT3la4nsJm9KZ3kNwrn6DNSilqHah4DI6kOvBSwXyeEPr7rznmw_LNsgwJMXU63wRJlqWv4-?width=1024&height=463&cropmode=none" width="800" />

<img src="https://by3302files.storage.live.com/y4m1NZYSfm8JHUPO_6MngMr2ZYINdctoRrSx6cHW6pZ9RzSweFtPs10rfLMx7d0KLNm9VXYgCoA3f2t1xkBLjSgZqWuvUxI6C1yVc22Ku1KIEsCImVth6rjsGDkpWYzLRl6TwWcQGzgeLRfhJZRxFCYc7FqL2GuSgG83HbPqRJd1C-ibMLdnkRWwd_bR-8ZfOw9?width=1024&height=457&cropmode=none" width="800" />

#### 2. 广告过滤

默认选择此项，过滤页面内的广告，如果有没有过滤的广告请反馈给我！感谢！

#### 3. 顶部模块隐藏

顶部模块隐藏前后效果入下图所示。

<img src="https://by3302files.storage.live.com/y4mPkfBbmUF1r5idSLhLcXok11MuiMPhL92wdzMpebEpcrKlf0l6BIJfo1DKjhqfk687S4LSZynTIoFeLyModgEOK7m8zLL5C08aFYdit3SIez4tkOds_nBJni50uM1x_GEg-SXBLjW8EopQE0qv4lZ_fUn_skBdg34VNIyOWMEANPlHSlRdcBlVwZUAMpxZyyX?width=1024&height=239&cropmode=none" width="800" />

<img src="https://by3302files.storage.live.com/y4mlTOAidZXJUGnXMd44XnsfcpXT0RsVHDZG9Bkbe37x69rnfkVpzoxSB0KuXDIOj1hDnLppz838okQH0CwVOV1ONzxpw74vSAFL6S7PUn_QZocKtzBsqXgtjq4hV5wrVUP-dZRycStvxNXuX8xOMcSAIE4Ap15PCnEoqdvsAfJ2y8_Mdmnx4Iw--y_ibM2b__Q?width=1024&height=186&cropmode=none" width="800" />

设置隐藏顶部模块和顶部滚动模块后：

<img src="https://by3302files.storage.live.com/y4m_kQDPvJVQYLJhidK5irjLC3qKx8iWeTIbn7Or54GhY1U1BijWmMNxif4UzU6kXQjzQGFv_NkSm035UjtAgBIFWrM1oK5nsVH0xvndexfRg8l8QIZoNyefN5QRjM-176bJLMtW7RwJb2KN6kRRn1B4Wkxwc2ts1jhQWoN6egRJq9CQid44s5WxuK60R6gieSI?width=1024&height=536&cropmode=none" width="800" />

#### 4. 列表内容隐藏

如图所示，框选的内容均可配置隐藏。

<img src="https://by3302files.storage.live.com/y4muFoyRI395-yfqXW05GhgrR2n9OMyDCr7hwcM0F9FI-pnI-jfFI_GaWXg-XDQnVcGouUOqWXn6AquROyaWnxmk6jTu2zQNnPQhY-RgY4jY_9OC76OD4i3MOiRE_WMIes14adsP8f0aUBpT8gJXd4XTeuEM9Bl7hl8p2_zrWKS7I_ta3n4yZ9qFbnZ-gLBcVlI?width=1024&height=506&cropmode=none" width="800" />

<img src="https://by3302files.storage.live.com/y4m1H0sTO6g2eIoTrGlCxGPabm7_aK3pGk-mMuEgjryTN4T0XtOSbMX7ARoZLQ7CIEE1k3L3hukkhtyNMi87Izc88JRRfUcH8STC5AubTi0fZ2ovLNaUmb6IpuNN1m2yPXXHBhFIfaydpHrpAjM-5XyvVItz1mVmYwimSlVrBiZVv4jemYdjUA4V2u0_4jOVLCX?width=1024&height=505&cropmode=none" width="800" />

#### 5. 详情（问答）内容隐藏

如图显示内容及打赏按钮等模块配置隐藏。

<img src="https://by3302files.storage.live.com/y4m98rJ_Qwp97wd4D6F2LMllqKkJNqEOwIak8mQvMV6m9yzBAzBhlXnTvaIxcoglmjbOZYaJW_04pmmTij5auZev08UF7rhjSI28P_75NVfN8YjqpevUr0aD5mzOCEpPXpafDRZAJwgPUmc9mbmRD5lUfXIxpyQ2R0vi35r-Q5oPBqHb1Yok1JcGurk9c7mFObj?width=1024&height=508&cropmode=none" width="800" />

#### 6. 搜索内容隐藏

如图显示内容及搜索结果的推广内容配置隐藏。

搜索框内热搜隐藏在搜索框悬浮时仍然生效。

<img src="https://by3302files.storage.live.com/y4mMJdlzWhc2dfbkedG0jlQ0hElqWUCAA8iRsuercfx7_80NRvTlI-7MOSZFJbMhem20nMnPNI1czABwkyFvzCS_gAmYABSN53G3SOvCZ74ohTyqSM67X6X8Q2VISI4fF6_g4NBj-CAlGEdZOjQTyt2yusmvxQAjI1i80_YuRVpxUfFCMA7o-P6r2iT2TaBwPFA?width=1024&height=515&cropmode=none" width="800" />

#### 7. 专栏内容隐藏

如图显示内容可配置隐藏。

<img src="https://by3302files.storage.live.com/y4m0WrNz8IsEg77aGfERyfPzPKs2n5SxEGXyEDyJuwso0sCPWHpmb2m9OHkO4ZgDF8s8U-bhpt45vr8gMergapkDe7l8ySdNFwyKwWLM5H8ktdBnHHV5YzjwLkdHL9kZQI1uWudUW8Yv6HKlCaiuRegVlnwSFqVzfzr1i3hU4_sGT6k_K2luD2KRcBfozaZjPeL?width=1024&height=469&cropmode=none" width="800" />

<img src="https://by3302files.storage.live.com/y4mu7BOFA15oSmt4crDMDWXXPr-LJuQzsP5M-ZFqqN6J16ZJ5-tDfVhr8mUVjJa8NZ0na30uNusubPvUXOC5FPIAYJvZHmx7UoM3GZe3ckXo9vjFscgsAzVVxF8w7NYAqf75orVwRvlOff6ax7OSEr53uWfFDngzoQRGFmNA7efEbDzbwoV_65_0BumZJcp6ntl?width=1024&height=462&cropmode=none" width="800" />

#### 8. 回答列表中的视频显示方式

可以设置是仅显示链接还是隐藏了，优化浏览体验

<img src="https://by3302files.storage.live.com/y4mac46UjdolK1otk-NzbPMmxvzXP9hi41B6RDSJ6t-4wjBsEzfMdsZ7PNT_ojm3bhrX8WSbeegttwJQhzp94bOFc7xg3losXIdjmKVKLEX_JSScGdGX-3P3q7LmtQnAHHT9toI124h0IkDeSuswHDt15EWLaqGp91RsbYp6lskrnh8225cttrVc7tnccz-234A?width=1024&height=467&cropmode=none" width="800" />

<img src="https://by3302files.storage.live.com/y4mJrwlO4PgJjlWTTd1iYOxKg26e6vQRMiNYmwMArAYRFnpcB_NCD43FSPpwUY-8gIGTq7K6sMx_cfalcmy2devMEWf9xNbTWtBk6Fc85gKo94l6uhdEcSAVX6c1qmY8sVWLyNdw-DEU5__yfrR-FAFaZItvqCy7uzrkvncz0S-uUytS8JVaQBIiMRVr7O3TYQR?width=1024&height=560&cropmode=none" width="800" />

<img src="https://by3302files.storage.live.com/y4miv_QmrUpxq69Kyl5q5RA4P-EBl_1SZsw9R9lZYy25e39oIvbREktKRk2ltc0-jrsoLR1RhBXWWU-KRgVaG0wO3B0N3Snc4fCE4vdq1wgGtZ75kT15x-zUEbYJHZFqFjEAXT8yA0mWW3do6KHPg7GmTw9rLrT9Ms-02L2ZtLtaSTF8Rx1XZI7eV95bvRutUQH?width=1024&height=473&cropmode=none" width="800" />

### 八. 颜色设置

[返回目录](#插件目录)

#### 1. 修改背景色

<img src="https://by3302files.storage.live.com/y4mHEbBrbiVsJ0-JjLMTRSj4oKq7TSHZc_YvnWEja4SQKjuKY82fiUCHYOO-VuecNW4lOwfImGEedAAXdOCGT5J-nZ9i7U8w9zijc0t6Rsph9W9RgV-YeMau1P9HNwrF_-2O_xj0N8hLgXwTLjvckYaXe3N90pDCpi55ZWBlG9HcwZi_59cM6z2LvKAd_7GFKFT?width=1024&height=508&cropmode=none" width="800" />

#### 2. 夜间模式

启用夜间模式为调用知乎原有夜间模式样式+知乎夜间模式未完成内容做的修改，如果发现夜间模式失效或渲染不完全情况请及时反馈给我。

<img src="https://by3302files.storage.live.com/y4mdFDF3kSXpwxFio5W8ZaorG1A90k49OJPlA0VRIXPsQtYP8WzDs6R8NcpYwkEsK0-VQNafQ74OR8gbMhVJ3HQbg2X0FWHq3Cy-XQvzIsQC-wAQ9-YAaqxmqkTuLZfiAQsL8VRIa7dy-sMPQ4OS5FyNnmnyekK966qYabDbnb85zllWJRldtlrZzaE00JFd1km?width=1024&height=508&cropmode=none" width="800" />

### 九. 配置导出导入

[返回目录](#插件目录)

这里可以导出当前配置，导入配置时将导出的配置内容复制进来再点击【导入】按钮即可完成导入

#### 1. 自定义 css

此部分将自己定义的 css 样式写入即可生效

更多功能请在修改器中体验

[返回目录](#插件目录)
