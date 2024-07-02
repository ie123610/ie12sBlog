# 「LUCKY STUN穿透」使用Cloudflare的页面规则能固定和隐藏网页端口


## 关于本教程


```
占位符
```


## 在STUN穿透环境中使用WEB服务

在之前的教程中我们已经通过lucky实现了较为安全的WEB访问  
但这些是建立在拥有公网IP的情况下（IPv4/IPv6）  


### 动态端口带来的麻烦

由于STUN穿透所获得的端口是动态的 即每次端口有一定的“生存时间”  
超过这个时间后端口号会再此次发生变化 变化的时间和变化后的端口号都是不确定的  
这也意味着要在STUN后使用web服务需要不停更的换端口 是一件比较麻烦的事情  

在之前的教程中我们已经实现了 BT下载软件监听端口的自动更换 [链接](https://www.bilibili.com/read/cv31006420/)   
以及 Minecraft Java的服务器联机端口的固定 [链接](https://www.bilibili.com/read/cv31482590/)  

不过BT下载器依靠追踪器（tracker）和DHT网络自动化的获取 其他节点的  端口和地址  
而 Minecraft Java 版依赖SRV记录 来存储端口号  
在HTTP中我们无法使用上述的方法  


### 可以用的解决方法


使用邮件进行通知


HTTP的特性








在之前的教程中我们通过SRV记录固定了


但几乎所有浏览器都不支持SRV记录 所以我们无法使用这种方法固定网页的端口

在稍早前的教程中我们实现了使用邮件来通知端口变化

有了邮件的通知我们只需要在访问的时候手动附加端口号即可



而

但这样仍然比较麻烦 需要查看邮件内容并在访问时手动输入端口





好在HTTP支持重新定向 这为固定端口提供了可能



本教程将使用Cloudflare的页面规则功能固定STUN穿透的网页端口
Cloudflare后文中简称为CF

注意这里使用的是已经改版后的页面规则
其现在只具有URL转发能力

新旧页面规则视图对比
[]


而且使用CF的服务意味将我们可以使用80端口 
即在访问时不用附加端口号





这个其实没什么特别的 但更重要的是CF的批量重新定向规则
可以通过API进行更新

这意味着当STUN穿透端口发生变化后
我们可以通过这个API修改规则中重定向的目标地址






### 在CF中拥有一个域名


若想使用CF的批量重定向则被重定向的域名需要在CF的管理之下 但重定向的目标地址可不在CF的管理之下

这意味着我们需要在CF拥有与一个域名
不过注册CF、购买或迁入域名不在本教程讲解的范围内
这部分的设置方法 建议参考网络上的其他教程

本教程将从在CF中拥有一个域名开始
（本教程将以ie12.com作为示例）
[img]https://pic.imgdb.cn/item/664eef99d9c307b7e9145ac9.jpg[/img]
[img]https://pic.imgdb.cn/item/664eefddd9c307b7e914a92d.jpg[/img]

### 设置DNS记录

光拥有域名还不够我们还需要为其设置DNS记录
这样

点击已拥有的域名

[img]https://pic.imgdb.cn/item/664ef318d9c307b7e918654f.jpg[/img]

点开DNS选项 选择记录

[img]https://pic.imgdb.cn/item/664ef318d9c307b7e9186512.jpg[/img]

添加DNS记录
（我这里已经设置一些记录不用在意）

[img]https://pic.imgdb.cn/item/664ef318d9c307b7e9186530.jpg[/img]

这里先设置一个子域名用于记录宽带IP地址
我的主域名是ie12.com 再设置一个字域名比如home 
这样就有了home.ie12.com

类型选择A类 名称填写home IP地址填写宽带的对外IP
我们之后还要在lucky中更新IP这个地址
代理状态关闭

[]
[]

接下来要设置被重定向的域名
即在访问时要输入到浏览器中的地址

这里以qbittorrent 的webUI为例
子域名我就设置为qb
像这样就得到了qb.ie12.com

类型选择A类 名称填写qb 
代理状态一定要打开 这样IP地址就会变成CF服务器的
这样CF就可以处理http请求了

至于后面的IP地址选项就可以随意填写了
比如填个8.8.8.8 这不会影响

[]
[]

设置完成了被重定向的域名
我们还要设置重定向的目标域名

这个域名是由于重定向自动跳转的
不需要手动输入所以可以设置的复杂一些
比如qbittorrent
像这样就得到了qbittorrent.ie12.com

类型选择CNAME类 名称填写qb 
目标填写我们刚才设置的home.ie12.com 代理状态关闭 

CNAME表示别名 我们将其指向刚才设置home.ie12.com
简单的来讲 qbittorrent.ie12.com 的IP 就和 home.ie12.com 的IP实现了同步
即home.ie12.com 的IP变化了 qbittorrent.ie12.com 的IP也会同步变化

如果我们有多个不同的服务在同一IP上就可以使用这样的方法
只需要更新一个域名对应的IP即可

[]
[]

设置完成DNS记录后就可以开始设置重定向规则了


### 设置批量重定向规则

点击左上角的箭头回到账户主页面

[img]https://pic.imgdb.cn/item/664efc4ed9c307b7e9233274.jpg[/img]

将左侧的滚动条拉到底可以看到 批量重定向

[img]https://pic.imgdb.cn/item/664efc4ed9c307b7e9233260.jpg[/img]

点开批量重定向 开始创建规则











