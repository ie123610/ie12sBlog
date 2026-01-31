# HTTPS/SVCB记录和HTTP3/QUIC排障 WIP

2026.

## 关于
W
之前的教程 使用https/SVCB 记录 指示端口

隐藏端口 

目前只能在火狐浏览器和 Safari 浏览器 使用
Chrome 浏览器尚不支持


HTTP3使用QUIC协议 其以UDP为基础
与HTTPS相结合可以 让浏览器之前发起HTTP3请求 
即通过直接UDP进行访问访问




浏览器使用doh解析 出现问题 不方便排查





## 测试HTTPS记录和DOH服务器解析

在Linux上可以使用 dig 工具进行解析

Windows的上nslookup.exe 不支持查询HTTPS记录

这里找到一个第三方工具 支持doh服务器
和HTTPS记录且可以 在Windows和Linux 等多个平台上运行

dnslookup

同时测试 HTTPS记录 和 DOH 服务器状态


## 服务端HTTP3/QUIC测试

使用curl 强制发起 HTT3请求

###




