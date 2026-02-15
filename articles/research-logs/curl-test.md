# cURL SVCB/HTTPS 记录测试

2023.2.15

在之前的教程中我们已经实现了 [使用SVCB/HTTPS记录隐藏和固定Web服务端口](../lucky-STUN/svcb-records-hidden-ports.md)  
也对配置过程中的出现的一些问题进行了排除：[HTTPS/SVCB记录和HTTP3/QUIC排障](./https-record-http3-test.md)  

原计划使用 curl 替代火狐浏览器来测试 SVCB/HTTPS记录效果  
研究后发现 curl 目前其似乎并不支持根据 SVCB/HTTPS 内的端口号来连接非标准HTTPS端口  

进行测试需要手动编译 curl 以启用 HTTPS-RR 以及 ech 等相关功能  
目前官方构建中并没有启用这些功能 Github 构建测试：[链接](https://github.com/ie123610/curl-HTTPS-RR)  

curl构建方法和功能验证参考以下链接：  

* [Support HTTPS and SVCB RRs](https://github.com/curl/curl/discussions/16855)
* [Building curl with HTTPS-RR and ECH support](https://github.com/freebsd/pkg/blob/main/external/curl/docs/ECH.md)