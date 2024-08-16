# 「补充篇」在Cloudflare上设置并更新SRV记录

## 关于本教程

在之前的教程中我们已经介绍了使用luckySTUN穿透功能  
配合dynv6创建并更新SRV记录以供Minecraft Java版 联机使用的方法 [链接](https://www.bilibili.com/read/cv31482590/)  
而在本教程中我们将介绍如何在Cloudflare上设置并更新SRV记录  

（Cloudflare 下文简称CF）  

## 创建SRV记录

当然进行下列设置的前提是**有个已经托管在CF的域名**  
创建SRV记录的方法和之前在dynv6时的差不多
这里将使用 `ie12.com` 进行举例

登录CF 》 点击侧边栏中的网站 》 选择你的域名 》 点击侧边栏中的DNS
点击添加记录 》 类型选择SRV 》 名称填写
  
**示例**
值得注意的是CF这里的目标地址最后不用像dynv6那样
加一个英文句号

图片
