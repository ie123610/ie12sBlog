# 「LUCKY STUN 穿透]使用webhook自动修改 qbittorrent 的监听端口

<p>
  
在 lucky stun 穿透获得的外部端口发生变化后除了要修改路由设备上的映射规则  
还需要修改BT下载软件的监听端口  

<p>
  
得益于 qbittorrent 较为完善的 webUI 其在接口中定义了多种修改配置的参数  
当然也包括监听端口 这样我们就可以非常轻松的使用lucky stun穿透中的webhook功能  
在穿透端口发生变化时自动修改监听端口  
  
<p>
  
qbittorrent webUI 接口定义：[链接](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)#set-application-preferences) 
  
<p>
<p>
  
## 配置方法

<p>
  
**打开webhook开关**

<p>
  
接口地址：`http://[IP和webUI端口]/api/v2/app/setPreferences`

<p>
  
请求方法：POST

<p>
  
请求头： `Content-type:application/x-www-form-urlencoded`

<p>
  
请求主体：`json={"listen_port":#{port}}`

<p>
  
打开 **禁用Webhook接口调用成功字符串检测**

<p>
  
示例  

<img src="https://pic.imgdb.cn/item/65bdf358871b83018afd0d6d.png" width="60%" height="60%" />


<p>

接口地址的IP和端口按照实际情况修改     
如果lucky和 qb运行在同一设备上（非docker）上IP使用127.0.0.1即可  
建议勾选上qb webUI设置中的 “对本地主机上的客户端跳过身份验证”  

<p>
  
<img src="https://pic.imgdb.cn/item/65bde965871b83018ad92457.png" width="60%" height="60%" />

<p>

如果不运行在同一设备上运行则这里的IP端口填写qb所运行在的设备上的IP和以及对应的端口  
并勾选 “对IP子网白名单中的客户端跳过身份验证”  
将运行lucky的设备IP段添加到这个白名单上  

<p>
  
<img src="https://pic.imgdb.cn/item/65bdea2f871b83018adbf7c5.png" width="60%" height="60%" />

<p>

以防止由于身份验证的问题导致调用失败  
填写完成后可以点击旁边的手动触发测试各项参数设置是否正确  

<p>
  
<img src="https://pic.imgdb.cn/item/65bdf108871b83018af4c58f.png" width="60%" height="60%" />

<p>

这里所说的内置数据不是真实数据应该指的是 穿透地址端口这些信息  
这并不影响我们检查各项设置是否正确  

<p>

之所以要打开禁用Webhook接口调用成功字符串检测是  
因为调用成功后并不会返回任何字符串 只有一个 HTTP 200 OK 看起来像这样  

<p>
  
<img src="https://pic.imgdb.cn/item/65bdf0e2871b83018af44664.png" width="60%" height="60%" />

<p>

如果设置有问题比如 没有免除身份验证就会报403  

<p>
  
<img src="https://pic.imgdb.cn/item/65bdf234871b83018af8ebb3.png" width="60%" height="60%" />

<p>

地址或端口填写错误则可能报  
“No connection could be made because the target machine actively refused it.”  
或者直接弹出一个小的错误提示  

<p>

<img src="https://pic.imgdb.cn/item/65bdf72b871b83018a0aed6c.png" width="60%" height="60%" />
<img src="https://pic.imgdb.cn/item/65bdf72b871b83018a0aee6b.png" width="60%" height="60%" />

<p>

若是 请求主体 写错就可能会报 HTTP 400  

<p>

<img src="https://pic.imgdb.cn/item/65bdf76b871b83018a0bc73c.png" width="60%" height="60%" />

<p>
<p>

---

至此我们就完成了使用webhook自动修改 qbittorrent 的监听端口的设置  
再配合上之前的教程使用UPNP工具添加内网端口不同的映射规则即可实现完全自动化  

---

