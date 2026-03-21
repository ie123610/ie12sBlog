---
draft: true
---


# 使用 Huginn 生成 RSS 研究记录 WIP

此部分用于记录 在使用 Huginn 生成RSS时遇到的问题和解决方法  

---

## 通用选项

## 数据库登录问题

---

## Huginn 订阅源在浏览器中的渲染问题

Huginn在默认配置下所生成的订阅源直接用 Chrome浏览器打开 其没有以XML的的形式渲染  
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

https://www.cnblogs.com/mkl34367803/p/8477624.html


Huginn 的 Data Output Agent 用于生成 订阅源  
可以通过设置 `rss_content_type` 来调整媒体类型  
默认/不指定 为`application/rss+xml` 可修改为 `application/xml`  


[]





https://www.cnblogs.com/lvfeilong/p/sdg435645.html
https://www.cnblogs.com/tuyile006/p/3691024.html



## 



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

