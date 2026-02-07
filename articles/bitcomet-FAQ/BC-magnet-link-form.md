---
sidebar_label: 磁力链接格式问题
---

# 比特彗星常见问题-磁力链接格式问题

2023.08.04  

**问：** 磁力链接为什么有两种不同的格式？(使用磁力链接向彗星添加任务后再复制出的磁力链接会发变化？)  

<img src="../../images/BC-magnet-link-form/BC-magnet-link-form-1.jpg" width="60%" height="60%" />

**答:只是表示方法不同而已** 表示的内容都是相同的SHA-1散列  
全部大写且稍短的是由base32编码表示的  

```
magnet:?xt=urn:btih:T7BAXHUY5KMLJI26MIRQIGS67FHKE6AJ
#磁力链接
T7BAXHUY5KMLJI26MIRQIGS67FHKE6AJ
#哈希值
```

全部小写且稍长则是**使用十六进制表示的**  

```
magnet:?xt=urn:btih:9fc20b9e98ea98b4a35e6223041a5ef94ea27809
#磁力链接
9fc20b9e98ea98b4a35e6223041a5ef94ea27809
#哈希值
```

在比特彗星中 右键任务>复制磁力>复制出来的磁力是 **使用base32编码** 的磁力  
若想使用更常见的 **十六进制** 表示方式请使用：右键任务>复制>特征码v1  



**问：** 为什么有些软件/网站不识别使用base32编码的磁力链接？  

**答：** 虽然使用base32编码和十六进制表示 **都是符合要求的**  
不过似乎十六进制用的 **更加广泛** 有些软件/网站可能只对十六进制进行了适配  

我们可以使用在线工具将base32编码格式转换成16进制格式：[链接](http://www.tomeko.net/online_tools/base32.php?lang=en)  


---

参考：

* [cometbbs-为什么磁链有两个哈希值?](https://www.cometbbs.com/t/%E4%B8%BA%E4%BB%80%E4%B9%88%E7%A3%81%E9%93%BE%E6%9C%89%E4%B8%A4%E4%B8%AA%E5%93%88%E5%B8%8C%E5%80%BC/83763)
* [Wikipedia-磁力链接](https://zh.wikipedia.org/zh-cn/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5)

