---
draft: true
---


# 网络地址转换（NAT）概述（RFC 3022/2663）

2013 年 9 月 3 日 | 作者：Netmanias (tech@netmanias.com) | 汉化：ie12  

&emsp;&emsp;如今，除了固定有线接入网（FTTH、以太网、DSL 等）外，韩国电信运营商在其几乎所有的接入网中都全面部署了 NAT。  

* **3G/LTE 网络**：在大规模 NAT（LSN，部署于 3G/LTE 核心网的 GGSN/P-GW 之后）中实现，也称为“运营商级 NAT（CGN）”。
* **Wi-Fi 热点网络**：在 Wi-Fi 热点 AP 中实现。
* **住宅网络**：在由运营商提供（租赁）的订户 AP 或从公开市场购买的 AP（例如 D-Link 的 DIR 系列）中实现。

&emsp;&emsp;包括 3G/LTE 用户、Wi-Fi 热点用户和家庭 AP 用户在内的所有用户，都会被分配一个私网 IP 地址。当他们访问互联网时，该地址会通过 NAT 转换为公网 IP 地址。  

&emsp;&emsp;使用 NAT 允许电信运营商：  

&emsp;&emsp;(1) 节省公网 IP 地址：因为 NAT 可以将分配给多个设备的私网 IP 地址转换为一个公网地址。这使得设备在访问互联网时，只需共享使用一个公网 IP 地址，而无需各自占用独立的公网地址。  

&emsp;&emsp;(2) 抵御外部攻击：通过在 3G/LTE 网络上引入 LSN，防止对移动设备或移动网络的任何外部攻击。企业也可以通过将其地址私有化来保护其内部网络免受外部入侵/攻击（类似于使用防火墙）。  

&emsp;&emsp;下面将解释在 [RFC 3022 (Traditional NAT)](https://www.google.com/search?q=http://www.ietf.org/rfc/rfc3022.txt) 和 [RFC 2663 (IP NAT Terminology and Considerations)](https://www.google.com/search?q=http://www.ietf.org/rfc/rfc2663.txt) 中定义的 NAT 相关术语。  

## 术语

### 1. TU 端口（TU Ports）

&emsp;&emsp;TCP 和 UDP 报头都包含源端口和目的端口字段。这些端口被统称为“TU 端口”或“传输标识符（Transport Identifiers）”。当设备（客户端）使用 TCP 或 UDP 与服务器通信时，根据 RFC 1700 的规定，TU 目的端口通常使用 0 到 1,023 之间的值（由 IANA 定义的知名端口）或 1,024 到 49,191 之间的值（由 IANA 定义的注册端口）。例如，HTTP 的 TCP 目的端口是 80。然而，对于 TU 源端口，各个操作系统会使用从各自定义的范围（大约 30,000 ~ 60,000）中随机选择的值。这种类型的端口被称为“临时端口（ephemeral port）”（更多信息请参阅 [https://en.wikipedia.org/wiki/Ephemeral_port](https://en.wikipedia.org/wiki/Ephemeral_port)）。  

### 2. 公网/全局/外部网络（Public/Global/External Network）

&emsp;&emsp;指拥有由互联网数字分配机构（IANA）分配的全局唯一 IP 地址的网络。因此，这种类型的网络可以跨全球电信运营商的网络进行路由（通信）。通常被称为“公网 IP 网络”。  

### 3. 私网/本地网络（Private/Local Network）

&emsp;&emsp;指拥有非 IANA 分配的 IP 地址的网络。这种类型的网络无法直接在互联网上进行路由。通常被称为“私网 IP 网络”。  

&emsp;&emsp;IANA 为此目的定义了以下三个 IP 地址块：  

* 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16  

### 4. 会话（Session）

&emsp;&emsp;会话被定义为作为转换单位加以管理的一组流量。每个 TCP/UDP 会话都由源 IP 地址、源 TU 端口、目的 IP 地址和目的 TU 端口的值来唯一标识（即四元组）。  

### 5. 应用层网关（ALG, Application Level Gateway）

&emsp;&emsp;某些应用在其负载（跟在 TCP/UDP 报头后面的特定应用数据）中包含 IP 地址和/或 TU 端口信息。因此，某些 NAT 设备集成了应用层网关（ALG），其具备能够转换存储在负载中的 IP 地址和/或 TU 端口信息的代理功能（即 NAT 具备应用感知能力）。通常，这些 NAT 会附带一份支持的应用列表（例如 FTP、SIP、RTSP 等）。由于 NAT 实际上不可能为市场上每天发布的所有应用都提供 ALG 支持，因此支持 ALG 的 NAT 并不多见。  

## 什么是 NAT？

&emsp;&emsp;网络地址转换（NAT，Network Address Translation）是将私网 IP 地址转换为公网 IP 地址（反之亦然）的过程，旨在允许私网上的设备与公网（互联网）进行通信。  

> 在大多数情况下，**传统 NAT** 允许私网内部的主机透明地访问外部网络中的主机。在传统 NAT 中，会话是单向的，即从私网发起向外。通过为预先选择的主机建立静态地址映射，可以在例外情况下允许反向的会话。（RFC 3022）
> 传统上，**NAT 设备**用于将具有未注册私有地址的隔离地址域连接到具有全局唯一注册地址的外部域。（RFC 2663）

## NAT 的类型

&emsp;&emsp;RFC 3022/2663 中定义了两种类型的 NAT：传统网络地址转换（Basic NAT）和网络地址端口转换（NAPT）。虽然旨在“节省 IPv4 地址”的 NAPT 是如今最常见的 NAT 类型，但它们都被统称为“传统 NAT（Traditional NAT）”。因此，当我们提及 NAT 时，绝大多数情况下指的都是 NAPT。如今所有 AP 都支持 NAPT 类型的操作。  

> 基础网络地址转换（**Basic NAT**）是一种将 IP 地址从一组映射到另一组的方法，对终端用户透明。网络地址端口转换（**NAPT**）是一种将多个网络地址及其 TCP/UDP（传输控制协议/用户数据报协议）端口转换为单个网络地址及其 TCP/UDP 端口的方法。
> 这**两种操作**统称为**传统 NAT**，提供了一种将具有私有地址的域连接到具有全局唯一注册地址的外部域的机制。（RFC 3022）

### 1. Basic NAT（基础 NAT）

<img loading="lazy" src="../../images/NAT-Overview-RFC-3022-2663-en/Fig1.Network%20Address%20Translation%20(NAT)%20Overview.gif" />

**定义与目的**  

&emsp;&emsp;Basic NAT 出于安全目的（类似于防火墙）部署在企业网络中。它提供 IP 地址的一对一转换。这意味着如果有 N 台具备私网 IP 地址的设备需要访问互联网，就需要相同数量（N 个）的公网 IP 地址。  

> 通过将私有地址集动态映射到全局有效网络地址集，可以使私网上的节点能够与外部网络进行通信。（RFC 3022）

**转换规则**  

&emsp;&emsp;1:1 转换（1 个公网 IP = 1 个私网 IP）  

**映射机制**  

* **出站流量（Outbound Traffic）**：将私网源 IP 地址转换为公网源 IP 地址
* **入站流量（Inbound Traffic）**：将公网目的 IP 地址转换为私网目的 IP 地址

**数据包修改**  

&emsp;&emsp;转换期间会替换以下数据包信息：  

* **出站流量**：源 IP 地址、IP 报头校验和
* **入站流量**：目的 IP 地址、IP 报头校验和

**会话中的三个转换阶段**  

1. **地址绑定（Address Binding）**

&emsp;&emsp;Basic NAT 将公网 IP 地址绑定到私网设备发送的每个出站流量（1:1 映射），并在 NAT 绑定表中生成会话表项。

2. **地址查找与转换（Address Lookup and Translation）**

* 随后，当 NAT 收到出站流量数据包（从用户设备发往 NAT）时，它会参考绑定表将数据包的私网源 IP 地址转换为公网源 IP 地址，并将其转发至互联网。
* 当收到入站流量数据包（从互联网发往 NAT）时，它会参考绑定表将数据包的公网目的 IP 地址转换为用户设备的 IP 地址（即私网目的 IP 地址），并将其转发至用户设备。

3. **地址解绑（Address Unbinding）**

&emsp;&emsp;如果没有与已生成的会话表项相对应的后续数据包到达，NAT 会从 NAT 绑定表中删除该表项。  

**部署示例**  

&emsp;&emsp;企业网络  

### 2. NAPT（网络地址端口转换）

<img loading="lazy" src="../../images/NAT-Overview-RFC-3022-2663-en/Fig2.Network Address Translation (NAT) Overview.gif" />

**定义与目的**

&emsp;&emsp;NAPT 用于节省公网 IP 地址。它提供 IP 地址的多对一转换。这意味着当多个具有私网 IP 地址的用户设备访问互联网时，共享同一个公网 IP 地址。  

> 借助于 NAPT，利用单个注册的 IP 地址，可以允许私网上的多个节点同时访问外部网络。（RFC 3022）

**转换规则**  

&emsp;&emsp;1:N 转换（1 个公网 IP = N 个私网 IP）

**映射机制**  

* **出站流量（Outbound Traffic）**：将 {私网源 IP 地址, 本地 TU 源端口} 二元组转换为 {公网源 IP 地址, 注册 TU 源端口} 二元组
* **入站流量（Inbound Traffic）**：将 {公网目的 IP 地址, 注册 TU 目的端口} 二元组转换为 {私网目的 IP 地址, 本地 TU 目的端口} 二元组

**数据包修改**  

&emsp;&emsp;转换期间会替换以下数据包信息：  

* **出站流量**：源 IP 地址、IP 报头校验和、TU 源端口、TCP/UDP 报头校验和
* **入站流量**：目的 IP 地址、IP 报头校验和、TU 目的端口、TCP/UDP 报头校验和

**会话中的三个转换阶段**  

1. **地址绑定（Address Binding）**  

* 当具备私网 IP 地址的设备发送出站流量时，NAPT 会将公网 IP 地址和 TU 源端口绑定到该设备的私网 IP 地址和 TU 源端口（1:N 映射）。随后，NAPT 会在 NAT 绑定表中为该流量生成会话表项。

2. **地址查找与转换（Address Lookup and Translation）**  

* 随后，当 NAPT 收到出站流量数据包（从用户设备发往 NAT）时，它会查阅绑定表，将数据包的私网源 IP 地址和本地 TU 源端口转换为公网源 IP 地址和注册 TU 源端口，并将其转发至互联网（注册端口指由 NAT 分配的端口。本地 TU 源端口也称为“内部端口”，注册 TU 源端口则被称为“外部端口”）。
* 当收到入站流量数据包（从互联网发往 NAT）时，它会查阅绑定表，将数据包的公网目的 IP 地址和注册 TU 目的端口转换为用户设备的 IP 地址和端口值（即私网目的 IP 地址和本地 TU 目的端口），并将其转发给用户设备。

3. **地址解绑（Address Unbinding）**  

&emsp;&emsp;如果没有与已生成的会话表项相对应的后续数据包到达，NAPT 会从 NAT 绑定表中删除该表项。  

**部署示例**  

&emsp;&emsp;Wi-Fi 热点、SOHO 网络、家庭网络以及 3G/LTE LSN  