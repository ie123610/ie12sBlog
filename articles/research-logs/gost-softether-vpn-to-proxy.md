# 使用Gost将SoftEther转换为socks5代理 

2026.2.11  

## 使用Gost建立socks5等代理服务端

SoftEther 建立的虚拟专用网络 使用TAP网卡 即虚拟二层设备  
其分流并不方便 只能使用路由表进行分流 较难实现分应用代理  

Gost支持设置socks5/4 HTTP(s)代理服务端  
同时支持一定的分流措施 但最重要的支持 **从指定的网卡/地址发起连接**  

这样一来可以通过修改虚拟网卡跃点数的方法 使得系统的主要流量不通过虚拟网卡  
而其他程序可通过连接Gost设置的本地代理服务器 将流量发送到虚拟网卡上  

Gost interface 选项：[链接](https://gost.run/tutorials/multi-homed/)  

---

## 正向代理方案

此场景下浏览器或其他程序需要通过SoftEther的隧道以访问远程站点  

1.设置 softether 使用的虚拟网卡跃点数为100  

```
控制面板》网络和共享中心》更改适配器设置》选择虚拟网卡右键菜单选择属性  
》选择TCP/IPv4协议点击属性》高级设置》取消勾选自动跃点数 **设置跃点数为100**  
```
图片教程：[链接](http://www.softether.cn/jishu/113.html)  

**通过此设置使得各程序在默认情况发起的流量不会通过虚拟网卡**

2.设置完成后 softether 发起连接建立专用网络  

3.使用gost创建socks5/4本地代理并指定流量发出的网卡  
一些应用程序不支持socks代理 可以换用http(s)代理  

### 获取网卡名称

使用 powershell 获取接口名称 `Get-NetAdapter`  
复制name一项中的名称就行了 **注意是名称不是描述**  

```
C:\Users\Administrator>powershell
Windows PowerShell
版权所有 (C) Microsoft Corporation。保留所有权利。

尝试新的跨平台 PowerShell https://aka.ms/pscore6

PS C:\Users\Administrator> Get-NetAdapter

Name                      InterfaceDescription                    ifIndex Status       MacAddress             LinkSpeed
----                      --------------------                    ------- ------       ----------             ---------
Ethernet1                 Intel(R) 82574L Gigabit Network Co...#2      21 Disconnected 00-0C-29-3B-1D-A5          0 bps
Ethernet0                 Intel(R) 82574L Gigabit Network Co...#3      20 Up           00-0C-29-3B-1D-9B         1 Gbps
本地连接                  TAP-Windows Adapter V9                       16 Disconnected 00-FF-B5-96-DB-35         1 Gbps
Ethernet2                 Intel(R) 82574L Gigabit Network Conn...      13 Up           00-0C-29-3B-1D-AF         1 Gbps
```

或者直接在 `控制面板》网络和共享中心》更改适配器设置`  
中重命名网络适配器 将名称复制下来  


### socks5/4 代理

socks代理文档：[链接](https://gost.run/tutorials/protocols/socks/)  
socks5/4监听本地4080端口 并指定出口网卡  
**建议用英文双引号包裹网卡名称** 以防止空格或其他特殊字符的影响命令  

```
gost -L socks4://:4080?interface="网卡名称"

gost -L socks5://:4080?interface="网卡名称"
```

### HTTP代理

监听本地4080端口 并指定出口网卡  

```
gost -L http://:6080?interface="网卡名称"
```

### 同时运行多个代理

```
gost -L http://:6080?interface="网卡名称" -L socks4://:4080?interface="网卡名称"
```

### 分流

Gost本身支持分流 可简单可复杂：[链接](https://gost.run/concepts/bypass/)  


## 类推方案

此方案其不仅适用于SoftEther的二层TAP适配器  
**其他组网程序创建的三层TUN适配器也是支持的**  

如wireguard等 但是这些TUN适配器在连接断开后消失  
下次连接的时候所创建适配器的名称会发生变化  
不过有些程序支持指定TUN适配器的名称  

在这种情况下**应该使用使用IP地址而不是适配器名称**  
当然这个就需要静态IP或者静态分配IP了  

```
gost -L :8080 -F :8000?interface=192.168.0.1
```
---

## 辅助正向代理方案

这个情景和之前的基本相同 区别在引入了 **已有socks5代理**  
即浏览器或其他程序本身就需要通过socks代理联网  

但是已有代理并不能实现连接到指定站点的目的  
需要通过 softether 的虚拟专用网络加以实现  

而且softether不能直接建立连接 需要通过已有socks5代理进行连接  
**即浏览器或目标程序的大部分流量通过已有socks5代理传出**  
**而少部分的流量通过 softether 的虚拟专用网络传出**  


### 分流

在存在 已有socks5代理 的情况下一般都会使用 **本地代理转发器**  
其会建立本地服务端 本地程序先连接这个本地服务端  
再由本地代理转发器将流量转发到远程代理服务器上  

在本地代理转发其中可以选择目标远程代理服务器并设置分流  
**即流量是通过代理发出还是直接从本地网卡发出**  

在此场景下 softether 在建立虚拟专用网络的时候  
需要先连接本地代理转发器 通过代理转发器将流量转发的远程代理服务器  
再通过代理服务器和远程虚局域网服务器建立虚拟专用网络  

通过虚拟网卡的流量路径：  
```
虚拟网卡》本地代理转发器》远程代理服务器》远程虚专用网络服务器》目标站点
```

此时通过上一节的方案 再将softether的虚拟专用网络 转换成socks代理  
供浏览器等程序使用 以连接通过常规socks代理无法连接的站点  

---

## 辅助组网

通过将softether的虚拟专用网络 转换成socks代理  
可以允许不支持虚拟专用网络的程序通过加入虚拟组网  
适用于那些不支持或不想安装虚拟专用网络专用客户端却支持设置代理的程序和设备上  

### 分流问题

通过此方法可以加入已经建立的虚拟局域网 访问组网中的其他设备  
但由于自身是通过代理加入的 其他设备是无法反向访问的  
此外还需要注意处理分流问题 以防止影响正常上网  


