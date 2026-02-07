# HTTPS/SVCB记录和HTTP3/QUIC排障

2026.2.7

## 关于

之前的教程 [使用SVCB/HTTPS记录隐藏和固定Web服务端口](../lucky-STUN/svcb-records-hidden-ports.md)  
我们实现了了通过HTTPS记录来隐藏非标准HTTPS端口  

而此教程 [使用SVCB/HTTPS解析和HTTP3搭配Lucky的STUN穿透实现无端口号自用完美访问Web服务](https://www.ytca.top/stun/2331/)  
实现了通过HTTPS记录直接发起HTTP3请求到非标准https端口 从而连接到只开放了UDP端口的web服务器  

HTTPS记录目前只能在火狐浏览器和 Safari 浏览器 **Chrome 浏览器尚不支持**  
此处记录一些排查  HTTPS/SVCB记录和HTTP3/QUIC排障经验和方法  

---

## 测试HTTPS记录和DOH服务器解析

在Linux上可以使用 dig 工具进行解析  
Windows的上nslookup.exe 不支持查询HTTPS记录  
在线HTTPS查询工具返回的结果有时并不准确  

这里找到一个第三方工具 支持doh服务器和HTTPS记录  
且可以 在Windows和Linux 等多个平台上运行的工具  
有了这个工具就能同时测试 HTTPS记录设置情况 和 DOH 服务器解析情况  

dnslookup：[链接](https://github.com/ameshkov/dnslookup)  

```
// 请求方法
(set "RRTYPE=DNS记录类型" && call dnslookup 需要查询的域名 DOH服务器URL)

// 示例
(set "RRTYPE=HTTPS" && call dnslookup example.com https://dns.alidns.com/dns-query)
```
其中的 RRTYPE 为环境变量 而非参数 所以需要用这种方法书写  
在Linux中的请求方法为：`RRTYPE=HTTPS dnslookup example.org tls://127.0.0.1`  

<img src="../../images/https-record-http3-test/dnslookup-require.jpg" width="60%" height="60%" />

---

## 服务端HTTP3/QUIC测试

可以通过curl 强制发起 HTT3请求 来测试服务器的HTTP3连接情况  
这不仅用于测试 服务器的HTTP3支持情况 **也测试目标UDP端口是否打开或正确转发**  
UDP端口的测试没有TCP来的方便 很多时候不通可能是UDP端口的问题 相比之下服务端本身一般不容易出现问题  

### 检查curl支持

运行 `curl -V` **V要大写** 查看输出内容中是否有 `HTTP3` 字样  
Windows中预装的curl可能并不支持HTTP3 下载curl：[链接](https://curl.se/download.html#Win32)  

<img src="../../images/https-record-http3-test/curl-features.jpg" width="60%" height="60%" />

使用HTTP3连接站点 `curl --http3-only -v URL` **V要小写** 其中的v参数用于显示连接详情  **注意URL要加上https协议头**  
`--http3-only`表示强制使用 HTTP3 且不允许降级  

**示例**  
<img src="../../images/https-record-http3-test/curl-http3.jpg" width="60%" height="60%" />

---

## 其他问题

### 火狐浏览器代理设置

火狐浏览器代理设置 中不要勾选 使用socks v4/v5 使通过代理查询 如果使用socks代理服务器的话  
有些本地代理转发器或远程代理服务器可能会


### ECH 问题

在测试过程中发现若是设置了ECH 似乎会影响到浏览器通过HTTPS记录  
直接使用HTTP3连接站点 其具体原因尚不明确 应该是由于浏览器自身的问题或设置造成的  



