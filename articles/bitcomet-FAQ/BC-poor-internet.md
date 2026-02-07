---
sidebar_label: 断网问题
---

# 比特彗星常见问题-断网问题

2023.09.10  

**问：** 使用彗星进行下载的时候网络会变得缓慢甚至会断网  

**答：** 如果出现网络断流可能是由于DHT发包量过多造成的  
也可能是运营商限制造成的 也可能是路由器\光猫性能瓶颈  

**问：** 如何解决？  

**答：** 在高级设置中找到 `network.max_udp_pkt_per_sec` 默认值为 1000  
可以逐渐调小数值 或者直接设置为 10 设置为10的时候一般不会再出现断网问题  

<img src="../../images/BC-poor-internet/udp-packet-transmission-volume.webp" title="总 UDP 发包量设置 目前无法单独设置 DHT 发包量" width="60%" height="60%" />

除此之外还需要调整 `dht.udp_send_queue_threshold` 选项  
此项目用于控制 DHT UDP 发包队列 因为调小了发送速度 也需要调整队列长度  

**以防止DHT发包堆积从而占用大量内存**  
默认值为 30000 在UDP发起为10的情况下 可以设置为 300 或更小  

<img src="../../images/BC-poor-internet/udp-queue.webp" title="DHT 队列长度设置" width="60%" height="60%" />

**问：** 如果还是存在断网的现象怎么办？  

**答：** 如果修改发包量后仍然会断网，可以尝试禁用DHT  

<img src="../../images/BC-poor-internet/join-dht-network.webp" title="禁用 DHT 网络" width="60%" height="60%" />

**注意：在禁用 DHT 网络后不会再产生非常的多的UDP包**  
**建议调大UDP发包量和队列**  

**以防止UDP发包量过小导致Dns查询 UDP tracker 等无法发出**  
**在未禁用 DHT 是也是同理 全局UDP发包量 过小会造成其他问题**  

**如果所处的网络环境对 UDP 限制较为严格建议**  
**禁用 DHT 功能 优先保障 DNS查询 和 UDP tracker等更核心的功能**  

---

原贴地址：https://www.cometbbs.com/t/86304/16  

参考：  
* https://www.cometbbs.com/t/69173
* https://www.cometbbs.com/t/42191


