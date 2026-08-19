# IETF 定义的 NAT 行为要求 (RFC 4787) — 第三部分：确定性质

2013年10月10日 | 作者：Netmanias (tech@netmanias.com) | 汉化：ie12  

---

由 IETF 定义的 NAT 行为要求 (RFC 4787)  

* [第一部分：映射行为](#)
* [第二部分：过滤行为](#)
* **[第三部分：确定性质](#)**

---

&emsp;&emsp;这是解读 RFC 4787 系列文章的最后一篇。  

## 4. 应用层网关 (ALG)

&emsp;&emsp;有关应用层网关 (Application Level Gateway, ALG) 的更多信息，请点击[此处](#)。  

> **RFC 4787 规范要求 (REQ-10)**：为了消除 ALG 对 UNSAF [（UNilateral Self-Address Fixing ，单边自我地址修正）](https://datatracker.ietf.org/doc/html/rfc3424) NAT 穿透机制的干扰，并保障 UDP 通信的完整性，针对 UDP 协议的 NAT ALG 应该（SHOULD）被关闭。  

&emsp;&emsp;这项建议意味着什么？如果 NAT 设备的 ALG 功能不完善，往往只会对 NAT 穿透造成干扰。因此直接将其关闭！！  

## 5. 确定性质 (Deterministic Properties)

### 非确定型 NAT (Non-Deterministic NAT)

&emsp;&emsp;在特定情况下（见下文示例）会改变其映射行为或过滤行为的 NAT 被称为“非确定型 NAT”。RFC 4787 中给出的此类 NAT 示例说明如下：  

&emsp;&emsp;NAT 通常具有“带端口保持（Port Preservation）的端点无关映射（Endpoint-Independent Mapping）”特性。  

&emsp;&emsp;因此，在下图中对于主机 A 发往主机 X 和主机 Y 的数据包 [1] 和 [2]，NAT 都分配了相同的外部端口 (5000)（端点无关映射）。它还直接沿用了内部端口号 5000 作为其外部端口号（端口保持）。  

&emsp;&emsp;接着，主机 A 和主机 B 分别向主机 Y 发送数据包 [3] 和 [4]。此时，两个数据包使用的内部端口号均为 6000。由于 NAT 的外部地址池中有足够的 IP 地址可用，因此它可以继续维持“端口保持”策略。  

&emsp;&emsp;稍后，当主机 C 向主机 Y 发送数据包 [5]，且该数据包像主机 B 一样使用 6000 作为内部端口号时，NAT 检测到：1) 内部端口 6000 已经分配给了先前发往同一外部端点的数据包；2) 已经没有可用的外部地址。因此，它无法再继续维持“端口保持”策略，进而切换为“不带端口保持的地址与端口相关映射”。  

&emsp;&emsp;因此，主机 C 发往主机 Y 的数据包 [5] 的外部端口（7000）必然无法再与内部端口（6000）保持一致（即放弃了端口保持！）。进而，主机 C 后续发往主机 X 的数据包 [6]，其外部端口（7002）也必然会与发往主机 Y 的端口（7000）不同（即切换为了地址与端口相关映射）。  

<img loading="lazy" src="../../images/NAT-Deterministic-Properties-zh/Fig1.%20NAT.Part%203-zh.png" />

### 确定型 NAT (Deterministic NAT)

&emsp;&emsp;在任何情况下都绝不改变其映射或过滤行为的 NAT 被称为“确定型 NAT”。  

> **RFC 4787 规范要求 (REQ-11)**：NAT 必须（MUST）具备确定性行为，即它绝不能（MUST NOT）在任何时间或任何条件下改变其转换或过滤行为。  

## 6. 出站数据包的分片 (Fragmentation of Outgoing Packets)

&emsp;&emsp;主机中 TCP/UDP 应用发送的出站数据包大小，受到 IP 最大传输单元（MTU）的限制。当 IP 的下层（L2 链路层）为以太网时，IP MTU 为 1500 字节（巨型帧除外）。因此，如下图所示，若 UDP 应用发送了一个 2,000 字节的数据包，NAT 会将其分片为两个较小的包：第一个同时包含 IP 头和 UDP 头，第二个则仅包含 IP 头。  

&emsp;&emsp;因此，NAT 必须能够根据 IP 头部的 MF（More Fragment，更多分片）标志和分片偏移（Fragment Offset）字段来识别分片包。对于没有 UDP 头部的第二个分片，NAT 应当依据 IP 头部的标识字段（0x1234）来关联会话，并将数据包的内部地址（10.1.1.1）替换为外部地址（5.5.5.1）。如果 NAT 无法处理这些，通信将无法正常进行（显然，这些机制过于基础，以至于 IETF 甚至未将其列入 RFC 4787 中）。  

<img loading="lazy" src="../../images/NAT-Deterministic-Properties-zh/Fig2.%20NAT.Part%203-zh.png" />

&emsp;&emsp;数据包分片不仅会发生在主机（终端设备或服务器）上，也会发生在通用路由器和 NAT 上（因为 NAT 的数据包转发同样基于目的 IP 地址，所以它也可以被看作是一种路由器）。  

&emsp;&emsp;如今，几乎所有链路层采用的都是以太网，且 Wi-Fi 网络的 MTU 大小通常也是 1,500 字节（在 Windows 系统中），因此 NAT 实际上很少进行数据包分片。尽管如此，RFC 4787 仍建议 NAT 在必要时按如下方式发送 ICMP 消息：  

> **RFC 4787 规范要求 (REQ-13)**：当 NAT 从内部 IP 收到 DF=1 的数据包时，必须（MUST）依据 [RFC0792] 向源主机返回一条“需要分片但已设置 DF（Fragmentation needed and DF set）”的 ICMP 消息。  
> a) 若数据包的 DF=0，NAT 必须（MUST）对其进行分片，并且应该（SHOULD）按顺序发送各个分片。  

## 7. 接收分片数据包 (Receiving Fragmented Packets)

&emsp;&emsp;数据包分片既可由上述内部端点触发，也可由外部主机（如下图中的主机 B）引发。在外部主机引发分片的情况下，第 6 节中的相关要求同样适用。对于不带 UDP 头部的分片，NAT 应能够依据 IP 头部的标识字段来识别其所属的会话，并将其外部地址转换为内部地址。  

<img loading="lazy" src="../../images/NAT-Deterministic-Properties-zh/Fig3.%20NAT.Part%203-zh.png" />

&emsp;&emsp;针对这种情况，RFC 4787 中提到了以下两种类型的 NAT 行为：  

### 分片有序接收 (Received Fragments Ordered)

&emsp;&emsp;只有当收到的分片数据包顺序与它们被分片时的顺序一致时，NAT 才能转换这些数据包的地址和端口并将其转发给内部端点。  

### 分片乱序接收 (Received Fragment Out of Order)

&emsp;&emsp;即使收到的分片数据包顺序与它们被分片时不一致（例如外部端点按 1、2、3 的顺序发送，但 NAT 以 1、3、2 的顺序接收），NAT 也能转换这些数据包的地址和端口并将其转发给内部端点。  

> **RFC 4787 规范要求 (REQ-14)**：NAT 必须（MUST）支持顺序和乱序分片的接收，因此其必须（MUST）具备“乱序分片接收”能力。  

## 8. 结语

&emsp;&emsp;至此，我们已通过三篇文章梳理了 RFC 4787 中定义的“单播 UDP  NAT 行为规范”。在深入研读该文档后，您大概也会认同我的以下观点：  

i) 如果 IETF 能在 NAT 大规模部署前就完成行为标准化，那么为各类 NAT 制定统一标准本可以简单得多。  

ii) 遗憾的是，无论是电信运营商定制还是零售市场上销售的 AP（无线路由器），大多未能遵循上述标准。因为这些规范最初主要是为了解决 NAT 穿透问题（即针对数据包必须穿越 NAT 的 P2P 应用）而设计的。而根据我们对 Cisco-Linksys、ipTIME 和某运营商 AP 的实试，所有参测设备均采用“端点无关映射 + 地址与端口相关过滤”。  