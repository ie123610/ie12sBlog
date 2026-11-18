# 使用 cURL 测试代理服务器

### 基础测试

使用  `-x` (或 `--proxy`) 参数指定代理地址 使得 curl 通过代理连接站点  

```bash
# 基础格式
curl -x http://proxy_ip:port 目标站点

# 示例：使用代理 127.0.0.1:8080
curl -x http://127.0.0.1:8080 https://www.google.com
```

如果显示出 目标网页的 html 源码 则表示连接成功  


### 可用代理协议

**1. HTTP / HTTPS 代理**  
使用 `http://` 或 `https://` 协议头即可  

```bash
curl -x http://proxy_ip:port https://example.com
```

**2. SOCKS 代理**  
`curl` 支持多种SOCKS 代理变体 主要区别在于 **域名是通过本地还是代理进行解析**  

| 代理类型 | 参数写法（示例） | 特点 |
| :--- | :--- | :--- |
SOCKS4 | `-x socks4://proxy:1080` | 本地解析域名，不支持 IPv6。 |
SOCKS4a | `-x socks4a://proxy:1080` | 由代理服务器解析域名。 |
SOCKS5 | `-x socks5://proxy:1080` | 本地解析域名，支持 IPv6。 |
SOCKS5h | `-x socks5h://proxy:1080` | 由代理解析域名 |

示例：  

```bash
curl -x socks5h://proxy_ip:1080 https://ifconfig.me
```

### 身份验证设置

如果代理需要用户名和密码，有两种方式提供凭据：

**方式一：直接嵌入 URL**  
将 `username:password@` 放在代理地址中  

```bash
curl -x http://username:password@proxy_ip:port https://example.com
```

**方式二：使用 `--proxy-user` 参数**  
用户名和密码 与 URL 分离  

```bash
curl -x http://proxy_ip:port --proxy-user username:password https://example.com
```
> **注意**：如果密码包含 `@`、`:` 等特殊字符，建议进行 URL 编码，或优先使用 `--proxy-user` 参数以避免解析错误。

### 更多参数

**1. 设置超时**  

使用 `--connect-timeout` 限制**连接代理**的等待时间（秒） 用 `--max-time` 限制整个请求的总时长  

```bash
# 连接超时设为 8 秒，总请求超时设为 20 秒
curl --connect-timeout 8 --max-time 20 -x http://proxy_ip:port https://example.com
```

**2. 开启详细模式（`-v`）**  
打印尝试连接代理、进行协议握手、以及最终得到响应的全过程  

```bash
curl -v -x http://proxy_ip:port https://example.com
```

**3. 只显示响应头**
使用 `-I` 仅发送 HEAD 请求，仅输出响应头 不显示 html 源码内容  
更便于观察是否成功  


### 分流与出口测试

访问 IP 测试接口 观察返回 IP 以确定代理的出口  
如果代理服务器配置有分流策略 可以访问不同地区的 IP 测试接口  
通过观察 出口 IP 以判断分流是否按照预期工作  

**纯文本接口**  
直接返回一个 IP 字符串，没有多余格式  

```
icanhazip.com
checkip.amazonaws.com
ipinfo.io/ip
ipecho.net/plain
ident.me
ip.sb
myexternalip.com/raw
whatismyip.akamai.com
ip4.now
ip6.now
```

国内网络友好的接口 即位于国内的接口  

```
cip.cc
myip.ipip.net
```