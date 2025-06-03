# 「EasyTier」使用SRV TXT HTTP重定向获取对端IP端口

## 关于此功能

在版本 [v2.2.3](https://github.com/EasyTier/EasyTier/releases/tag/v2.2.3) 中EasyTier添加了对SRV TXT 记录和HTTP重定向的支持  

这使得ET在连接其他节点时可以不直接指定端口号而是从DNS记录或者HTTP响应中获得  
此功能设计的初衷是与 NAT1 的 TCP 穿透配合使用  

TCP穿透成功后可开放一个TCP端口 除了端口号不固定其访问效果和公网无异  
不过这个不定期变化的端口号 给其他节点的连接带来了很大的麻烦

在端口变化后手动修改过于繁琐 但现在我们可以从上述的DNS记录和HTTP响应中取得这一端口号
以实现完全自动化

lucky STUN 穿透教程：


https://github.com/EasyTier/EasyTier/issues/83


## 地址格式

其格式并不复杂通过不同的协议头来区分
通过这些记录和响应来获取实际要连接的地址和端口

* TXT记录 `txt://example.com` 
* SRV记录 `srv://example.com`
* Http(s)响应 `http://example.com` `https://example.com`


## TXT 记录使用方法

TXT记录是最简单最灵活的方法 就像在客户端中连接时那样  
在TXT记录中写入一 协议 地址 端口即可 `协议://地址:端口`  

得益于lucky的DDNS模块更新TXT记录的更新 大幅简化
无需再向过去那样进行繁琐的配置  

旧教程：

## SRV 记录


## HTTP 响应

HTTP方法中又分为两种 分别是200 响应和 30x 重定向


### HTTP 200 响应


lucky 制作一个简单

### HTTP 30X 重定向

HTTP重定向中又分为两种
一种是从url中直接获取

查询字符串


