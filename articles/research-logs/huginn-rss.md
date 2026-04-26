---
draft: true
---

# 使用 Huginn 生成 RSS 研究记录 WIP

此部分用于记录 在使用 Huginn 生成RSS时遇到的问题和解决方法  

## 目标和需求

RSS 的用途 
参考 之前的教程

简单的来说 有了RSS可以定期的自动的获取网页上的信息
而不用去打开网页本身

提高阅读的效率
无需在浏览器多个选项卡之间来回切换

但是RSS订阅源内容一般需要站点本身提供
由于其不通过浏览器访问 
在很大程度上影响了网站的流量 影响了广告的效果

不过对用户来说 RSS 还是非常方便的
即使站点本身不提供订阅源我们也可以自己来生成

在之前的文章中我们已经搞清楚了 RSS 的本质其实就是一个XML文件
与浏览器解析HTML类似 RSS阅读器依靠解析XML文件 来呈现内容

而我们要做的 就是制作这个XML文件 而来其源则是网站本身所提供的HTML
也就是将目标网页的HML文件按照我们的需要转换成 XML文件

使用Huginn完成此操作


## RSS 要素

在RSS（RSS2.0）中最主要的 或者说最基本的是

标题 信息的内容
超链接 指向对应内容的详情
发布时间 指示内容所发生 更直接的作用是 在阅读器中进行排序
使用时间排序是所有阅读都支持 也是最常见的排序方法

还有一个项目 是描述

这个选项不是必须的但也很常见
虽然叫描述但是也可以用来放置全文

如果所抓取的站点有 人机验证或使用js脚本设置cookie的验证
RSS阅读器自带的浏览器 可能无法显示 页面
可以在制作页面内容的时候 将详情一并抓取下来
放置在描述中显示 可以解决此问题

当然在抓取的时候 要想办法通过这种验证 
在后面的教程中我们会讲到









## 通用选项

## 数据库登录问题

---

## Huginn 订阅源在浏览器中的渲染问题

Huginn 在默认配置下所生成的订阅源直接用 Chrome浏览器打开 其没有以XML的的形式渲染  
而是显示为了纯文本 html标记被转义 

而在Firefox 中的情况更糟 其无法预览而是会直接跳出下载框  
看起来火狐认为其是一种无法预览的格式  
尽管这个问题不影响RSS阅读器 解析订阅源 但对调试来说就非常不利了  

[]

这个问题其实出在  `Content-Type` （媒体类型）  
其用于指示传递内容的格式和类型 方便浏览器进行解析  

Huginn 所生成的 订阅源默认使用 `application/rss+xml` 作为媒体类型  
对于 RSS 订阅源来说 使用 `application/rss+xml` 是正确的  
但不幸的是现代浏览器已经不再识别 这此类型了  

而且严格意义上讲 `application/rss+xml` 不是一个标准类型
其没有在IETF完成注册 只有一个早 [已过期的草案](https://www.webcitation.org/68cwv25Tb?url=http://tools.ietf.org/id/draft-nottingham-rss-media-type-00.txt) 

为了在现代浏览器中使得订阅源以XML形式渲染  
可以将其媒体类型 设置为 `application/xml` 或者 `text/xml`  

考虑到编码问题 应该 优先使用 `application/xml`  
修改媒体类型对 阅读器的解析 不会有太大的影响  
参考：[链接](https://www.cnblogs.com/mkl34367803/p/8477624.html)


Huginn 的 Data Output Agent 用于生成 订阅源  
可以通过设置 `rss_content_type` 来调整媒体类型  
默认/不指定 为`application/rss+xml` 可修改为 `application/xml`  


[]

---



https://www.cnblogs.com/lvfeilong/p/sdg435645.html
https://www.cnblogs.com/tuyile006/p/3691024.html





## 

https://www.peterjxl.com/RSS/reader


其实际的工作方式和设想不太一样

其并不将上游的所有时间 获取后 慢慢发送到下游

而是缓慢的抽取 上游事件到下游

Schedule 用于触发 抽取





抽取量和发送顺序

huginn内部的计算器精度最高为1分钟

理论

## dry run 测试 传递上游数据 



## 已知教程

* [Huginn 指南：为任意网站制作 RSS](https://blog.colinx.one/posts/huginn%E6%8C%87%E5%8D%97%E4%B8%BA%E4%BB%BB%E6%84%8F%E7%BD%91%E7%AB%99%E5%88%B6%E4%BD%9Crss/)
* [RSS 进阶篇：Huginn结合PhantomJs为任意网页定制RSS源](https://newzone.top/posts/2018-10-07-huginn_scraping_any_website.html)
* [Huginn | newzone.top](https://newzone.top/services/Huginn.html)
* [超详细!如何利用Huginn制作专属RSS](https://www.cnblogs.com/liujiangblog/articles/12115804.html)
* [使用Huginn打造自动化信息处理中心](https://blog.csdn.net/unreliable_narrator/article/details/124309672)
* [【高级篇】RSS的世界：Huginn篇（中）](https://www.bilibili.com/read/cv14280731/?opus_fallback=1)
* [用 Huginn 为高频 RSS 生成每日摘要并输出新的 RSS](https://www.zmonster.me/2020/10/24/make-digest-rss-with-huginn.html)
* 
---