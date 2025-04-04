# 比特彗星常见问题-有关绿灯的常见误区

在比特彗星有关绿灯的讨论中存在一些比较常见的误区  
本文中我们会解释这些问题  

---

## 绿灯的作用

许多有关比特彗星使用的讨论中都会强调要获得绿灯  
之所以强调绿灯是因为**其代表端口开放**  

也就意味着你可以接受其他人的连接请求  
**从而直接提高上传速度** 间接提高下载速度  

关于BT下载的特性和和开放端口的重要性  
在之前的教程中已经有所讲解：[链接](https://www.bilibili.com/read/cv25876182)  

这种端口开放显示机制不局限于比特彗星 其也适用于大部分的P2P文件下载/共享软件  
比如qbittorrent中右下角的绿色地球/插头 以及 电骡/驴（eMule）  
中的 “High ID” 和 “Low ID”  

---

## 显示为绿灯的条件

想要让比特彗星的右下角显示绿灯其实非常简单  

只要比特彗星在接收到外部主动传入的TCP连接后 右下角就会显示为绿灯    
这包括主动进行的端口检测和被动的接受其他用户的连接请求  
不会区分连接的来源和IP协议  

这意味着无论这个TCP连接使用IPv4还是IPv6 是来自于互联网还是本地局域网  
甚至是本地环回地址 其都可以使右下角显示为绿灯  

**请记住绿灯只是一种显示方式 开放端口才是真正目标的**  

---

## 什么是 “双绿灯”

在有关绿灯讨论中大概会听到“双绿灯”这样一个说法  

有关于“双绿灯”最常见的**误区**是  
认为其表示左下角有两个绿色的点  

**示例**  
<img src="../../图片/BC绿灯常见问题/BC绿灯常见问题-监听端口和DHT.jpg" width="60%" height="60%" />


然而这是不正确的 其正确的含义应该是  
**比特彗星所监听的IPv6端口和IPv4端口都是开放的**  
即在统计中展开TCP监听端口可以看到 IPv4和IPv6都显示已开通  

**示例**  
<img src="../../图片/BC绿灯常见问题/BC绿灯常见问题-IPv4和IPv6端口.jpg" width="60%" height="60%" />

其更为准确的称呼应该为“双栈”或“双栈公网”  
这里的栈指协议IP栈 双栈就是IPv4和IPv6协议  
简而言之**就是IPv4和IPv6端口都开放**  

---

## 什么是“假绿灯”和“快乐灯”

其实“假绿灯”和“快乐灯”是一回事 即在端口没有开放的情况下  
右下角却显示了端口开放  

其实造成这种现象的原因也很简单 只要满足了前文中所说的绿灯条件  
右下角就会显示绿灯 **即使对外端口在事实上并没有开放**  

一种最常见的情况就是 在本地开了两个客户端 下载同一个资源  
两个客户端通过局域网地址或本地环回地址连接上  
客户端检测到了主动传入的连接 显示了绿灯  
****
要验证和检查当前的绿灯是否为 **真绿灯**  
可以通过在线的端口扫描工具实现 若扫描显示端口开放  
即为真绿灯反之为假绿灯  

**端口扫描工具：**[链接](https://zh.infobyip.com/tcpportchecker.php)  

---

## 我已经做了XXX但为什么还是没有XXX 

最常见的一种提问就是 “我已经做了 端口映射/UPnP/DMZ 为什么还是没有绿灯？”  

其实出现这样的提问也不难理解 因为很多网上的教程就是这样写的  
说开个 端口映射/UPnP/DMZ 就行了  

这种方法放在10或20年可能是有效的**现在的网络环境已经和当年大不相同了**  

当然这其实都不是最大的问题 最大的问题是这些教程不会告诉你你前因后果  
只是展示一个操作过程 其既不教你检测自身实际的网络环境  
也不告诉你为什么要这样做 但由于其操作简单 被大量的复制和传播  

要想解决端口阻塞问题还是要从实际情况出发  
根据网络情况进行分析和排查 **端口阻塞解决方案：**[链接](https://www.bilibili.com/read/cv32811550/)  

---

## 为什么绿灯下载还是缓慢或无法下载

在端口开放后 有些资源依然下载缓慢或无法下载 这其实是**资源本身的问题**  
在之前的教程中我们已经讲解了 BT下载基本原理  
以及下载缓慢和无法下载的一些解决方法  

* **下载缓慢和无法下载问题[重置]** [链接](https://www.bilibili.com/read/cv26980113/)  
* **P2P模式 和C/S模式的差异** [链接](https://www.bilibili.com/read/cv26980113/)  


简而言之 BT下载 需要有用户上传才行  
即你的下载是其他持有相同资源用户的上传  
其一般不依赖中心化的服务器  

所以 获得绿灯即开放端口 **只是提升连接用户的效率** 而并非凭空产生资源  
当然对标准BT客户端来说是这样的  
“巧妇难为无米之炊” 没有可供下载的东西自然无法下载  

而那些通过服务器拉取资源 再提供给用户下载的非标准客户端（程序）  
不在讨论的范围内 比如迅雷或一些网盘所提供的**所谓离线下载**  
当然这些离线下载既有危害也有价值  


