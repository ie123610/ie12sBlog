---
draft: true
---

# 使用 Huginn 生成 RSS 研究记录 WIP

此部分用于记录 在使用 Huginn 生成RSS时遇到的问题和解决方法  

---

## 目标和需求

有关RSS的用途可以参考之前的教程：[Feed RSS ATOM 以及 Feed JSON](./feed-rss-atom-json.md)

简单的来说 RSS可以定期的自动的获取网页上的信息  
而不用去打开网页本身 这样一来提高阅读的效率  
无需在浏览器多个选项卡之间来回切换  

**但是RSS订阅源内容一般需要站点本身提供**
由于其不通过浏览器访问 在很大程度上影响了网站的流量 以及广告的效果  

不过对用户来说 RSS 还是非常方便的  
**即使站点本身不提供订阅源我们也可以自己来生成**

在之前的文章中我们已经搞清楚了 RSS 的本质其实就是一个XML文件  
与浏览器解析HTML类似 RSS阅读器依靠解析XML文件来呈现内容  

而我们要做的就是制作这个XML文件 其源则是网站本身所提供的HTML  
即将目标网页的HML文件按照我们的需要转换成 XML文件  

本教程中使用Huginn完成此操作  

---

## RSS 要素

在RSS（RSS2.0）中最主要的或者说最基本的是

* 标题
* 超链接
* 发布时间

标题的作用不言自明 超链接用于指向对应内容的详情  
发布时间用于指示内容所发生日期 更直接的作用是便于阅读器进行排序  

对于RSS 2.0 来说 发布时间项 甚至都不是必须的  
但考虑到易读和易用性时间选项一般的订阅源都是有时间的  
使用时间排序是所有阅读都支持也是最常见的排序方法  

还有一个项目是描述(description)这个选项不是必须的但也很常见  
可以展示目标内容的总结或摘要 虽然叫描述但是也可以用来放置全文内容  
在ATOM中使用总结(summary)和内容(content)来区分    

所以我们的目标就是 

获取网站的HTML内容  
将其中的 标题、链接、时间以及描述 获取下来  
使用这些数据生成对应的XML文件 一个RSS订阅源就制作好了  

如果所抓取的站点有 人机验证或使用js脚本设置cookie的验证
RSS阅读器自带的浏览器 可能无法显示 页面

可以在制作页面内容的时候 将详情一并抓取下来 放置在描述中显示
当然在抓取的时候 要想办法通过这种验证 
在后面的教程中我们会讲到

---

## 安装 Huginn

使用docker部署时 建议使用 docker compose  
可以通过一个配置文件方便的管理多个容器

Huginn 在使用时需要一个 mysql数据库
其也提供Huginn和数据库整合在一起的镜像
但考虑到之后还需要部署的其他容器 这里依然使用分立的版本

配置文件名称默认为 docker-compose.yml  
如果不使用默认名称则需要在命令中指定配置文件名  

**在启动成功容器后不要删除配置文件**  
之后修改容器时还需要用到  

<details>

<summary>配置文件参考</summary>

```
version: '3'

services:
  db:
    image: mysql:5.7
    container_name: huginn-mysql
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: huginn
      MYSQL_USER: huginn
      MYSQL_PASSWORD: password123
      MYSQL_ROOT_PASSWORD: rootpassword123
    volumes:
    # 挂载目录 以实现容器在删除后数据保留
      - D:\docker\huginn-sql:/var/lib/mysql

  huginn:
    image: ghcr.io/huginn/huginn:latest
    container_name: huginn-app
    restart: unless-stopped
    # 映射端口
    ports:
      - "3000:3000"
    environment:
      DATABASE_ADAPTER: mysql2
      DATABASE_HOST: db
      DATABASE_PORT: 3306
      DATABASE_NAME: huginn
      # 这里用root登录刚的数据 用自定义的账户huginn似乎无法登录
      DATABASE_USER: root
      DATABASE_PASSWORD: rootpassword123
      # 设置时区 影响huginn处理时间时所使用的时区
      TIMEZONE: Beijing
      DATABASE_ENCODING: utf8mb4
      # 设置代理 有些页面可能需要代理才能打开 使用宿主设备上的代理 host.docker.internal 表示宿主机的IP
      HTTP_PROXY: http://host.docker.internal:10808
      HTTPS_PROXY: http://host.docker.internal:10808
      # 3. 排除不需要代理的内部通信（如数据库、本地访问）
      NO_PROXY: localhost,127.0.0.1,db
      ENABLE_INSECURE_AGENTS: "true"
    depends_on:
      - db
```
</details>

编写好配置文件后 在cmd中切换到 配置文件所在的目录  
使用 `docker-compose up -d` 命令创建容器  
`-d` 参数代表 "detached" 模式 容器会在后台运行，不会占用终端窗口  

其他常用命令

查看状态	docker-compose ps	列出由该配置文件运行的所有容器。
停止并移除	docker-compose down	停止容器并删除容器、网络和镜像挂载。
停止但不移除	docker-compose stop	仅停止运行，保留容器状态。
查看日志	docker-compose logs -f	追踪查看后台运行容器的日志。
重新构建	docker-compose up -d --build	如果修改了 Dockerfile，用此命令重新构建并启动。

    文件名： 默认情况下命令会找 docker-compose.yml 或 docker-compose.yaml。如果你的文件名不同，需要使用 -f 参数，例如：docker-compose -f my-config.yml up -d。




`





## 通用选项



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
但不幸的是现代浏览器已经不再识别此类型了  

而且严格意义上讲 `application/rss+xml` 不是一个标准类型  
其没有在IETF完成注册 只有一个早已过期的 [草案](https://www.webcitation.org/68cwv25Tb?url=http://tools.ietf.org/id/draft-nottingham-rss-media-type-00.txt)  

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