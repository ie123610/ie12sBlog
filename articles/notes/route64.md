# Route64 IPv6 隧道

[Route64](https://www.route64.org)提供基于 VPN 的 IPv6 隧道  
这使得 位于 NAT 后的 Windows 设备可以方案的通过 wireguard 获得 IPv6  
尽管其速度可能并不是很理想 但的确可用  

其也提供 EoIP、GRE、L2TPv3、SIT、VXLAN 连接方法  
但这些在 Windows 上使用起来都不是很方便  

由于使用 wireguard 其不需要像 tunnelbroker 的 6in4 隧道那样  
要求使用设备具有公网 IPv4 地址 因为大多数的 NAT 无法处理 6in4 数据包  
其并非基于 TCP 或 UDP 而是拥有单独的协议号 41  

