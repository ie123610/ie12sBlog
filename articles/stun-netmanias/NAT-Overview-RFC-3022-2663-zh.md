# 网络地址转换（NAT）概述（RFC 3022/2663）

2013 年 9 月 3 日 | 作者：Netmanias (tech@netmanias.com) | 汉化：ie12  

&emsp;&emsp;如今，除了固定有线接入网（FTTH、以太网、DSL 等）之外，韩国电信运营商已经在其几乎所有的接入网中全面部署了 NAT。  

* **3G/LTE 网络**：在 3G/LTE 核心网的 GGSN/P-GW 后方部署大规模 NAT（LSN），亦称“运营商级 NAT（CGN）”。
* **Wi-Fi 热点网络**：直接在 Wi-Fi 热点 AP 上实现 NAT。
* **住宅网络**：在运营商租借给签约用户的 AP、或用户自行选购的 AP（如 D-Link 的 DIR 系列）上实现 NAT。

&emsp;&emsp;包括 3G/LTE、Wi-Fi 热点以及家庭 AP 在内的所有终端用户，都会被分配一个私网 IP 地址。当他们访问互联网时，该地址会经由 NAT 统一转换为公网 IP 地址。  

&emsp;&emsp;部署 NAT 为电信运营商带来了以下优势：  

&emsp;&emsp;(1) **节省公网 IP 地址** ：NAT 能将分配给多台设备的私网 IP 转换为单个公网 IP。这样一来，多台设备在访问互联网时只需共享一个公网 IP，无需各自占用独立公网地址。  

&emsp;&emsp;(2) **抵御外部网络攻击**：通过在 3G/LTE 网络上引入 LSN，可有效防止针对移动设备或移动网络的外部攻击。企业也可以通过在内网使用私网地址（类似于配置防火墙），来保护其内部网络免受外部入侵与攻击。。  

&emsp;&emsp;下文将解释 [RFC 3022 (Traditional NAT)](https://www.google.com/search?q=http://www.ietf.org/rfc/rfc3022.txt) 和 [RFC 2663 (IP NAT Terminology and Considerations)](https://www.google.com/search?q=http://www.ietf.org/rfc/rfc2663.txt) 中定义的 NAT 相关术语。  

## 术语

### 1. TU 端口（TU Ports）

&emsp;&emsp;TCP 和 UDP 报头都包含源端口和目标端口字段。这些端口被统称为“TU 端口”或“传输标识符（Transport Identifiers）”。当设备（客户端）使用 TCP 或 UDP 与服务器通信时，根据 RFC 1700 的规定，TU 目标端口通常使用 0 ～ 1,023 （由 IANA 定义的知名端口）或 1,024 ～ 49,191 （由 IANA 定义的注册端口）。例如 HTTP 的 TCP 目标端口是 80。而对于 TU 源端口，各操作系统则会在其自定的动态范围（大约 30,000 ~ 60,000）内随机选择。此类端口被称为“临时端口（ephemeral port）”（更多信息请参阅 [维基百科](https://en.wikipedia.org/wiki/Ephemeral_port)）。  

### 2. 公网/全球网络/外网（Public/Global/External Network）

&emsp;&emsp;指拥有由互联网数字分配机构（IANA）分配的全局唯一 IP 地址的网络。此类网络能够在全球运营商之间进行路由与通信。通常被称为“公网 IP 网络”。  

### 3. 私网/本地网络（Private/Local Network）

&emsp;&emsp;指使用非 IANA 直接分配的 IP 地址的网络。这类网络无法直接在互联网上进行路由与通信，通常被称为“私有 IP 网络”。  

&emsp;&emsp;IANA 为此保留了以下三个地址块：  

* 10.0.0.0/8
* 172.16.0.0/12
* 192.168.0.0/16

### 4. 会话（Session）

&emsp;&emsp;会话是指在地址转换时被作为一个整体进行跟踪与管理的流量集合。每个 TCP/UDP 会话均由源 IP 地址、源 TU 端口、目标 IP 地址及目的 TU 端口唯一标识（即“四元组”）。  

### 5. 应用层网关（ALG, Application Level Gateway）

&emsp;&emsp;某些应用的效载荷（即 TCP/UDP 报头之后的数据区）中包含 IP 地址 或 TU 端口信息。部分 NAT 设备集成了应用层网关（ALG），通过代理机制来转换载荷内嵌入的地址与端口信息（即 NAT 具备应用感知能力）。通常，这些 NAT 会提供一份支持的应用列表（例如 FTP、SIP、RTSP 等）。然而 NAT 不可能为市场上层出不穷的应用都提供 ALG 支持，因此支持 ALG 的 NAT 并不多见。  


## 什么是 NAT？

&emsp;&emsp;网络地址转换（NAT，Network Address Translation）是指在私网 IP 地址与公网 IP 地址之间相互转换的过程，旨在允许私网设备与互联网（公网）进行通信。  

> 在大多数情况下，**传统 NAT** 允许私网内部的主机透明地访问外网中的主机。其会话是单向的，即从私网向外发起。仅在特殊情况下，通过为特定主机配置静态地址映射，来发起反向会话。（RFC 3022）
> 传统意义上，**NAT 设备**设备用于连接两个不同的地址域，一端是采用未注册私网地址的隔离内网，另一端则是采用全局唯一注册地址的公网。（RFC 2663）


## NAT 的类型

&emsp;&emsp;RFC 3022/2663 中定义了两种类型的 NAT：基础 NAT（Basic NAT）和网络地址端口转换（NAPT）。虽然旨在“节省 IPv4 地址”的 NAPT 是如今最常见的 NAT 类型，但它们都被统称为“传统 NAT（Traditional NAT）”。因此，当我们提及 NAT 时，绝大多数情况下指的都是 NAPT。如今所有 AP 都支持 NAPT 。  

> 基础网络地址转换（**Basic NAT**）是一种在两组 IP 地址之间进行一对一映射的机制，该过程对终端用户完全透明。网络地址端口转换（**NAPT**）则是将多个网络地址及其 TCP/UDP 端口改写并映射到单个网络地址及其 TCP/UDP 端口的技术。
> 这**两种操作**统称为**传统 NAT**，它们提供了一种将使用私网地址的内部域与使用全局唯一注册地址的外部域相连接起来的机制。（RFC 3022）

### 1. 基础 NAT（Basic NAT）

<img loading="lazy" src="../../images/NAT-Overview-RFC-3022-2663-zh/Fig1.Network%20Address%20Translation%20(NAT)%20Overview-zh.png" />

**定义与目的**  

&emsp;&emsp;Basic NAT 出于安全目的（类似于防火墙）部署在企业网络中。它提供 IP 地址的一对一转换。这意味着如果有 N 台具备私网 IP 地址的设备需要访问互联网，就需要相同数量（N 个）的公网 IP 地址。  

> 通过将私有地址集动态映射到全局有效网络地址集，可使私网节点与外部网络进行通信。（RFC 3022）

**转换规则**  

&emsp;&emsp;1:1 转换（1 个公网 IP 对应 1 个私网 IP）  

**映射机制**  

* **出站流量**：将私网源 IP 地址转换为公网源 IP 地址
* **入站流量**：将公网目标 IP 地址转换为私网目标 IP 地址

**数据包修改**  

&emsp;&emsp;转换期间会替换以下信息：  

* **出站流量**：源 IP 地址、IP 报头校验和
* **入站流量**：目标 IP 地址、IP 报头校验和

**会话中的三个转换阶段**  

1. **地址绑定（Address Binding）**

&emsp;&emsp;基础 NAT 将公网 IP 地址绑定到私网设备发起的出站流量上（实现 1:1 映射），并在 NAT 绑定表中建立对应的会话表项。

2. **地址查找与转换（Address Lookup and Translation）**

* 出站方向：当 NAT 收到出站数据包（由用户设备发往 NAT）时，通过检索绑定表，将数据包中的私网源 IP 地址转换为公网源 IP 地址，并转发至互联网。
* 入站方向：当 NAT 收到入站数据包（由互联网发往 NAT）时，同样检索绑定表，将数据包中的公网目标 IP 地址转换为用户设备的私网目标 IP 地址，并转发至目标用户设备。

3. **地址解绑（Address Unbinding）**

&emsp;&emsp;若在规定时间内未再接收到与该会话表项对应的后续数据包，NAT 将从绑定表中删除该表项  


**部署示例**  

&emsp;&emsp;企业网络  

### 2. NAPT（网络地址端口转换）

<img loading="lazy" src="../../images/NAT-Overview-RFC-3022-2663-zh/Fig2.Network Address Translation (NAT) Overview-zh.png" />

**定义与目的**

&emsp;&emsp;NAPT 旨在节省公网 IP 地址，提供 IP 地址的多对一转换。这意味着多个私网设备在访问互联网时，可以共用一个公网 IP 地址。。  

> 借助 NAPT，私网中的多个节点依靠单个已注册的 IP 地址即可同时访问外部网络。（RFC 3022）

**转换规则**  

&emsp;&emsp;1:N 转换（1 个公网 IP 对应 N 个私网 IP）

**映射机制**  

* **出站流量**：将 \{私网源 IP 地址, 本地 TU 源端口\} 二元组转换为 \{公网源 IP 地址, 注册 TU 源端口\} 二元组
* **入站流量**：将 \{公网目标 IP 地址, 注册 TU 目标端口\} 二元组转换为 \{私网目标 IP 地址, 本地 TU 目标端口\} 二元组

**数据包修改**  

&emsp;&emsp;转换期间会替换以下信息：  

* **出站流量**：源 IP 地址、IP 报头校验和、TU 源端口、TCP/UDP 报头校验和
* **入站流量**：目标 IP 地址、IP 报头校验和、TU 目标端口、TCP/UDP 报头校验和

**会话中的三个转换阶段**  

1. **地址绑定（Address Binding）**  

* 当私网设备发送出站流量时，NAPT 会将公网 IP 地址及注册 TU 源端口，绑定到该设备的私网 IP 地址及本地 TU 源端口上（实现 1:N 映射），并在 NAT 绑定表中建立对应的会话表项。

2. **地址查找与转换（Address Lookup and Translation）**  

* 出站方向：当 NAPT 收到出站数据包（由用户设备发往 NAT）时，通过检索绑定表，将数据包中的私网源 IP 地址和本地 TU 源端口，转换为公网源 IP 地址和注册 TU 源端口，并转发至互联网。（注：注册端口指由 NAT 动态分配的公网端口。本地 TU 源端口亦称“内部端口”，注册 TU 源端口亦称“外部端口”。）
    
* 入站方向：当 NAPT 收到入站数据包（由互联网发往 NAT）时，同样检索绑定表，将数据包中的公网目标 IP 地址和注册 TU 目标端口，转换为用户设备的私网目标 IP 地址和本地 TU 目标端口，并转发至目标用户设备。

3. **地址解绑（Address Unbinding）**  

&emsp;&emsp;若在规定时间内未再接收到与该会话表项对应的后续数据包，NAPT 将从绑定表中删除该表项。  

**部署示例**  

&emsp;&emsp;Wi-Fi 热点、SOHO 网络、家庭网络以及 3G/LTE LSN  
