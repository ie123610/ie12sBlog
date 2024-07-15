# 使用Windows自带的端口转发功能让不支持IPv6的程序间接的用上IPv6

## 遇到的问题

随着IPv6的普及 端到端的连接 再次成为可能  
也使的远程访问和游戏联机变得更加方便  
不过一些较旧的程序并不支持IPv6   

但我们依然可以使用一些方法使其间接的使用上IPv6  


## v6/v4 端口转发

通过端口转发的形式实现IPv6/IPv4协议之间的转换  
这样一来不支持IPv6的程序在发送和接受数据是依然使用IPv4  
而在公共网络传输的过程中使用IPv6 由两端转发器在其中进行转换  

但其只能处理单播而不能处理广播 **且只支持TCP**  
不过胜在配置起来较为简单  

本教程将使用Windows自带的端口转发功能实现此目的  

**示意图**


---

## 专用客户端和浏览器

### 客户端和服务端

一般来说客户端和服务端都是成对使用的  
若服务端不支持IPv6则客户端一般也也不支持  
反之亦然  

此时需要在客户端和服务端侧均设置转发   

当然也有特殊情况 比如服务端程序已经停止更新  
但客户端程序还在更新   
就会出现服务端不支持IPv6但客户端支持的情况  

在此情况下只需要在服务端进行端口转发即可  
因为客户端原生支持IPv6  

例如此视频中的无线电软件：[链接](https://www.bilibili.com/video/BV1Kw411C7fY)

### WEB UI

除了刚才所说的服务端/客户端 一方停更的情况外  
还存在一种特殊情况 就是 **WEB UI**  

一些老程序的 WEB UI只支持IPv4  
但现代浏览器都已经支持IPv6  

其与刚才所说的一方停更的情况类似  
也只需在服务端侧进行转发   
不过这种情况应该会更加的常见  

----

## 设置方法

### 使用命令行

在默认情况下 只能使用命令进行配置  
即`netsh interface portproxy`命令  
详见：[链接](https://learn.microsoft.com/zh-cn/windows-server/networking/technologies/netsh/netsh-interface-portproxy)  

但使用命令进行操作并不方便  
更好的方法是使用图形化程序  

### 使用 PortProxyGUI

Github 项目地址: [链接](https://github.com/zmjack/PortProxyGUI)  
网盘链接： [链接]()   
**需要 .NET 运行环境**  


下载解压后即可运行  
若需要安装.NET则按照提示进行安装即可  

**主界面**  
<img src="/图片/Win端口转发/win端口转发-ppgui主界面.JPG" width="60%" height="60%" />

---

## 转发演示 eMule WEB UI

eMule本身是不支持IPv6的  
且由于是WEB UI所以我们只需要在服务端侧进行转发即可  
右键空白处可以新建 转发规则  

类型：选择 v6tov4 即将传入的IPv6请求转换成IPv4  

监听地址:默认为 星号 即监听所有地址端口号 可自定义  
但最好和下发连接地址后面的端口号相同  

连接地址:即将转换后的请求所发往的地址  
选择127.0.0.1即本地地址 端口则是eMule WEB ui 所监听的端口  
这里用的是4777  

备注：相当于规则名称 可留空  
分组:可将多个规则分为一组方便识别可留空  

按下设置 以保存规则  
**还需要手动添加Windows防火墙规则以放行流量**
其不会自动添加

**示例**  

<img src="/图片/Win端口转发/win端口转发_ppgui-eMule-webUI-1.JPG" width="60%" height="60%" />
<img src="/图片/Win端口转发/win端口转发_ppgui-eMule-webUI-2.JPG" width="60%" height="60%" />


#### 检视效果

在另一位一台电脑上使用IPv6地址进行访问  
为了方便演示这里使用的是内网IPv6地址  
实际访问时可以替换成解析到IPv6的域名  

**效果**  
<img src="/图片/Win端口转发/win端口转发_ppgui-eMule-webUI-检视效果.JPG" width="60%" height="60%" />
<img src="/图片/Win端口转发/win端口转发_ppgui-eMule-webUI-检视效果-2.JPG" width="60%" height="60%" />

---

## 转发演示   





