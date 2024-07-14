# 「LUCKY STUN穿透」使用Cloudflare的页面规则固定和隐藏网页端口

## 关于本教程

```
索引
│
├─关于本教程
│
├─在STUN穿透环境中使用WEB服务
│   ├─动态端口带来的麻烦
│   ├─“隐藏端口”和固定端口
│   └─可用的解决方法
│        ├─使用邮件进行通知端口变化
│        └─使用HTTP重定向
│
├─网络环境优化和STUN穿透规则设置
│  ├─网络环境优化
│  │  └─NAT测试工具
│  ├─普通UPnP DMZ 以及端口映射
│  │   ├─DMZ的妙用
│  │   └─端口映射的妙用
│  └─STUN穿透规则设置
│       ├─使用内置转发
│       ├─使用内置UPnP
│       └─直接操作防火墙规则
│
├─使用Cloudflare的页面规则重定向URL以固定STUN穿透的网页端口
│   ├─运行流程
│   ├─设置DNS记录
│   ├─设置DNS记录解析
│   ├─创建页面规则
│   ├─更新页面规则
│   │  ├─获取区域ID
│   │  ├─创建访问令牌
│   │  ├─获取规则ID
│   │  └─测试更新
│   └─在STUN穿透规则中更新端口
│
├─配置反向代理规则及其相关设置
│   ├─创建反向代理规则
│   └─获取TLS/SSL证书
│
└─最终验证环节
```

---

## 在STUN穿透环境中使用WEB服务

在之前的教程中我们已经通过lucky实现了较为安全的WEB访问 详见：[链接](https://www.bilibili.com/read/cv35702797/)  
但这些是建立在拥有**公网IP**的情况下（IPv4/IPv6）  


### 动态端口带来的麻烦

由于STUN穿透所获得的端口是动态的 即每次穿透都有一定的“生存时间”  
超过这个时间后端口号会再此次发生变化 变化的时间和变化后的端口号都是不确定的  
这也意味着要在STUN穿透后使用web服务需要**不停更的换端口** 是一件比较麻烦的事情  

在之前我们已经实现了BT下载软件监听端口的自动更换 详见：[链接](https://www.bilibili.com/read/cv31006420/)   
以及 Minecraft Java的服务器联机端口的固定 详见：[链接](https://www.bilibili.com/read/cv31482590/)  

不过BT下载器依靠追踪器（tracker）和DHT网络自动化的获取 其他节点的端口和地址  
而 Minecraft Java 版依赖 **SRV记录** 来获取端口号  
在HTTP和浏览器不支持上述特性所以我们**无法使用这些方法**  

---

### “隐藏端口”和固定端口

固定端口 这个问题自然是针对STUN穿透的 其并不局限于WEB服务  
而“隐藏端口”这个概念更多由有公网的家宽用户提出  
这里简单的说明一下这两个概念  


* **固定端口**  
  这个概念非常好理解 即使总是用固定的端口号进行访问 无需更换端口号  

* **“隐藏端口”**  
  对于大部分协议协议来说所谓的 “隐藏端口” 其实是指的是不指定端口号  
  即使用默认端口进行连接  

  在浏览器中当不指定端口号的时候会使用HTTP/HTTPS的默认端口  
  HTTP中这个默认端口是80 而HTTPS是443  
 
所以能做到“隐藏端口” 其实也是做到了 固定端口  
对于在STUN穿透后使用web服务的用户来讲固定端口是一个迫切的需求  

而对有公网的家宽用户来说 “隐藏端口” 也是一个有吸引力的选择  
因为一般的家庭宽带是封堵 80和443端口的 （有些地方IPv6是不封的）  

---

### 可用的解决方法

所以在STUN穿透后使用WEB服务亟待解决的就是**端口号的不固定和不确定**

#### 使用邮件进行通知端口变化

在稍早前的教程中我们实现了使用邮件来通知端口变化 详见：[链接](https://www.bilibili.com/read/cv34705222/)  
有了邮件的通知我们只需要在访问的时候手动附加端口号即可

这一方案可用于任何使用TCP/UDP协议的程序  
但这样仍然比较麻烦 需要查看邮件内容并在访问时手动输入端口  

#### 使用HTTP重定向

好在HTTP有自己的特性 **重新定向**   
其可以改变端口和地址这为固定端口提供了可能  

* **使用 Cloudflare 进行重定向**
  
  cloudflare （下文简称CF）使用CF的重定向服务可以同时实现  
  “隐藏端口”和固定端口 当然这需要有域名托管在CF上
  **这也是本文将要介绍的方案**

* **使用免费FRP服务器转发端口**
  
  与CF的重定向类似 但此方案是通过FRP映射出一个固定端口  
  此端口仅用于重定向（使用lucky）通入站的请求到STUN穿透的端口  
  不然所有访问流量都会通过FRP服务器  
  
  这个方案的好处是可以使用免费的动态域名 理论上可以做到一分钱不花  
  可以轻松的实现固定端口但要实现 “隐藏端口”可能有些困难  
  要看免费FRP服务器80/443端口是否可用  

  
* **使用免费短链服务进行重定向**

  其实与CF的重定向方案差不多 但是目前没有找到比较好的供应商  


---

## 网络环境优化和STUN穿透规则设置

当然最重要的还是STUN穿透能够成功   
若无法穿透则后面的这些内容都无从谈起   
相比起BT下时的穿透 给web服务的穿透会更加简单一些  


### 网络环境优化

尽管大部分stun穿透教程都会强调必须是**全锥型NAT**才能穿透  
但这其实指的是最外面一层的运营商NAT 而大部分的运营商NAT都是全锥型的  

不过现在的家庭网络环境中几乎都存在多层NAT 而NAT类型测试**只能测出其“最差”的一层**   
其很可能显示为"端口受限（锥）型NAT" 这其实是由于 路由器/光猫上的NAT造成的  

不过这并不会影响我们使用stun穿透 可以按照这篇教程进行网络优化
教程：[链接](https://www.bilibili.com/read/cv30370049)  

优化到只剩一层运营商NAT和 和一层光猫/路由器 NAT  
共两层NAT 且NAT类型检查结果**不为对称型即可进行穿透**   


#### NAT测试工具

Github 项目下载地址： [链接](https://github.com/HMBSbige/NatTypeTester/releases/)  
网盘下载地址: [链接](https://wwm.lanzoul.com/ivTFr2458oxc)  
密码:NAT  

<img src="/图片/stun-web服务-CF/stun-web服务-NAT测试工具1.jpg" width="60%" height="60%" />

**旧版测试**

如果结果出现 UDP block 可以尝试更换上方的服务器  
测试结果不为对称型即可  


* Full Cone             》全锥形  
* Restricted Cone       》地址受限锥形  
* Port-Restricted Cone  》（地址和）端口受限锥形  
* Symmetric             》 对称形

示例  
<img src="/图片/stun-web服务-CF/stun-web服务-NAT测试工具-旧版测试.jpg" width="60%" height="60%" />

**新版测试**

如果绑定测试出现 failed 可以尝试更换上方的服务器  
测试映射行为 为 EndpointIndependent 则表示可以穿透  
即以E开头 若出现A开头则不能穿透  

示例  
<img src="/图片/stun-web服务-CF/stun-web服务-NAT测试工具-新版测试.jpg" width="60%" height="60%" />

---

### 普通UPnP DMZ 以及端口映射

在之前的BT下载穿透中主要使用手动的端口转发   
以及相对特殊的 miniUPnP 客户端 来设置映射

这其实是由于BT下载的特殊性所导致的  
详见：[链接](https://www.bilibili.com/read/cv31006420/)  

由于BT下载的特殊性导致其不适合使用DMZ lucky内置转发以及普通的UPnP  
不过在包括web服务等大多数其他服务中不会有这样的问题  
这使得穿透过程更加简单也更容易成功  


#### DMZ的妙用

开启DMZ主要是为了解决部分场景下无法穿透的问题  
部分的光猫和少数路由器似乎存在无法关闭的过滤选项  
可理解为隐形的防火墙  

即使在已经优化过网络结构且运营商NAT是全锥型的情况下  
依然无法穿透 主要表现为穿透日志一直再刷新类似于  
"stun pubile addr check error" "穿透通道失效" 之类的报错信息  

而DMZ使用是则破除这种“隐形防火墙”的一种简单而有效的方法   
若出现上述情况可尝试开启DMZ 其目标IP为lucky所在设备的IP  
当然前提是其能够启用DMZ且其确实能够生效  

DMZ设置参考: [链接1](https://www.bilibili.com/read/cv28835081/) [链接2](https://help.onethingcloud.com/9dd6/e9ec#header-5)  


#### 端口映射的妙用

一些光猫在普通权限下可能无法使用DMZ  
但可以使用较为基础的端口映射  

可以将STUN规则监听端口（穿透通道本地端口）映射出去  
可起到类似DMZ的效果 此场景下的STUN规则监听端口要固定不能为0  
即随机端口  

端口映射教程 详见：[链接](https://www.bilibili.com/read/cv28835081/)

映射时内外端口号均为 **穿透通道本地端口** 的端口号  
协议选择 both 即 TCP和UDP 而内网IP则填写lucky所在设备的IP  

---

### STUN穿透规则设置

此部分将介绍在STUN穿透规则中内置转发和内置UPnP的方法

#### 使用内置转发

这是最简单的方法 直接转发到反向代理服务所监听的端口  
运行在docker中的lucky比较适合使用此方法  

不过这个方法也有缺点 即无法获取访问者的源IP  
在之前的教程中 可以通过HTTP请求头来向反代  
后端的源服务端传递访问者源IP   

但使用内置转发的话 在反代服务器这里看到的IP  
就已经是内网地址了 通过请求头传递源IP也成了内网地址  

不过这对大部分的web服务来说也不是问题  
**主要对鉴权方面有些影响** 比如有些服务可以设置对内网地址免登录  
若使用内置转发则不要开启类似这样的功能  

* **直接使用/与DMZ组合使用**
  
  此场景下 穿透通道本地端口 可以使用随机端口

  示例  
  <img src="/图片/stun-web服务-CF/stun-web服务-STUN规则示例-内置转发-随机端口.jpg" width="60%" height="60%" />


* **与端口映射组合使用**

  此场景下 穿透通道本地端口 需要使用固定端口
  并将此端口映射出去  

  示例  
  <img src="/图片/stun-web服务-CF/stun-web服务-STUN规则示例-内置转发-固定端口.jpg" width="60%" height="60%" />


#### 使用内置UPnP

相比起使用内置映射要麻烦一些 需要光猫/路由器支持UPnP  
不过其好处也是显而易见的 即**可以获取访问者的源IP**  

其可以在docker部署的情况下使用但需要额外填写UPnP网关地址等参数  
故不太适合运行在docker中的lucky使用  

示例  
<img src="/图片/stun-web服务-CF/stun-web服务-STUN规则示例-upnp.jpg" width="60%" height="60%" />


#### 直接操作防火墙规则

针对直接运行在路由器上的lucky   
可以直接通过自定义脚本直接修改防火墙规则 以达到效果  
不过这不在本教程介绍的范围   


---

## 使用Cloudflare的页面规则重定向URL以固定STUN穿透的网页端口

### 运行流程

我们将使用CF页面规则来重定向URL以实现端口的固定和“隐藏”

此处需要两组域名 **重定向前的域名** 和 **重定向后的域名**

* 重定向前的域名  

  此域名开启CF代理 即IP解析到CF以便进行重定向处理  
  这也是我们需要在浏览器中输入的域名
  （例如`web.ie12.com`）


* 重定向后的域名   

  不开启CF代理 IP解析到真实的对外IP  
  这将是重定向后的访问的域名(例如`web.stun.ie12.com`)  

**流程图**

<img src="/图片/stun-web服务-CF/stun-web服务-CF_重定向网页流程图-压缩.jpg" width="60%" height="60%" />

---

### 设置DNS记录

由于免费账户只提供3条页面规则 所以我们需要节约使用 可通过设置**泛域名解析**的方法容纳大量服务

* **设置重定向前的域名**

  登录CF > 点击侧边栏中的网站 > 选择你的域名 > 点击侧边栏中的DNS  
  点击添加记录 > 类型选择A > 名称填写 * > IP地址任意填写这这里使用`8.8.8.8`  
  开启代理  此处的*为泛域名解析 例如`*.ie12.com`  

  <img src="/图片/stun-web服务-CF/stun-web服务-CF_添加重定向前域名.jpg" width="60%" height="60%" />


* **设置重定向后的域名**

  登录CF > 点击侧边栏中的网站 > 选择你的域名 > 点击侧边栏中的DNS  
  点击添加记录 > 类型选择A > 名称填写 `*.stun` > IP地址任意填写 >不开启代理  
  此处的*为泛域名解析 例如`*.stun.ie12.com`  这里的STUN可自定义  

  <img src="/图片/stun-web服务-CF/stun-web服务-CF_添加重定向后域名.jpg" width="60%" height="60%" />

---

### 设置DNS记录解析

完成上述配置后我们只需要更新泛域名就可以了  
DDNS更新方法在之前的教程中已讲解过 详见：[链接](https://www.bilibili.com/read/cv35021955)   
更新时直接填写带星号的泛域名即可    

<img src="/图片/stun-web服务-CF/stun-web服务-CF_DNS解析示例.jpg" width="60%" height="60%" />

---



### 创建页面规则

登录CF > 点击侧边栏中的网站 > 选择你的域名 > 点击侧边栏中的规则 >   
页面规则 > 创建规则  

URL填写 **重定向前的泛域名** 比如`*.ie12.com`  
选取设置：**转发URL**          状态代码：**302**  
目标地址： **填写重定向后的地址 和STUN穿透端口**  

可以带上https 以完成HTTP重定向工作  
此处的$1用于传递上面*部分的字符  
这样我们就可以用一条页面规则完成无数服务的重定向  

可以继续添加通配符以匹配 资源路径和查询字符串等  
不过在本教程中并不需要使用这些  

<img src="/图片/stun-web服务-CF/stun-web服务-CF_创建页面规则.jpg" width="60%" height="60%" /> 

**通配符效果演示**  
<img src="/图片/stun-web服务-CF/stun-web服务-CF_通配符演示.jpg" width="60%" height="60%" />


### 更新页面规则

在设置创建完成页面规则后我们还需要对其进行更新  
即更新重定向后地址中的STUN穿透端口号  
通过API可以完成更新 但我们需要先获取 **区域ID** 和 **规则ID**  


#### 获取区域ID 

区域ID获取起来非常简单 点开页面规则中的API按钮  
将示例URL中的区域ID复制出来即可  
<img src="/图片/stun-web服务-CF/stun-web服务-CF_获取区域ID-1.jpg" width="60%" height="60%" /> 

在侧边栏的**概况**里面也有显示  
<img src="/图片/stun-web服务-CF/stun-web服务-CF_获取区域ID-2.jpg" width="60%" height="60%" /> 


#### 创建访问令牌

规则ID的获取相对麻烦一些 要使用API来获取  
要使用API我们需要先创建**访问令牌**  
API定义：[链接](https://developers.cloudflare.com/api/operations/page-rules-list-page-rules) 

转到个人资料页面以创建访问令牌  
点击右上角的小人图标 > 选择我的个人资料  
<img src="/图片/stun-web服务-CF/stun-web服务-CF_前往个人资料页面.jpg" width="60%" height="60%" /> 

或者在已经登录CF的情况下直接访问该链接：[链接](https://dash.cloudflare.com/profile/api-tokens)  

切换到 API令牌 点击右侧的**创建令牌**  
<img src="/图片/stun-web服务-CF/stun-web服务-CF_创建API令牌页面.jpg" width="60%" height="60%" /> 

选择页面底部的 **自定义令牌**  
<img src="/图片/stun-web服务-CF/stun-web服务-CF_创建自定义令牌.jpg" width="60%" height="60%" /> 

按照图中的提示设置令牌内容 其中的名称可自定义  
<img src="/图片/stun-web服务-CF/stun-web服务-CF_令牌创建过程1.jpg" width="60%" height="60%" /> 
<img src="/图片/stun-web服务-CF/stun-web服务-CF_令牌创建过程2.jpg" width="60%" height="60%" /> 

此令牌只会显示一次 复制下来 妥善保存  
接下来我们就可以开始获取规则ID了  
<img src="/图片/stun-web服务-CF/stun-web服务-CF_令牌创建过程3.jpg" width="60%" height="60%" /> 


#### 获取规则ID

在创建了访问令牌后就可以开始获取规则ID了  
此处使用lucky计划任务中的callweb功能来进行获取  
登录lucky > 点击侧边栏的 计划任务 > 添加计划任务  

任务备注 即任务名称任意填写  
执行周期 仅执行一次  执行时间 ： 任意选择   
我们将使用手动触发所以执行时间随意填写  


**添加子任务**  
备注即子任务名称 任意填写  
类型 **callweb**  

接口地址： `https://api.cloudflare.com/client/v4/zones/你的区域ID/pagerules`  
请求头：  
```
Authorization: Bearer 之前获取的令牌
Content-Type: application/json
```

开启 禁用CallWeb调用成功字符串检测  
保存规则  

示例  
<img src="/图片/stun-web服务-CF/stun-web服务-CF_规则ID获取过程-1.jpg" width="60%" height="60%" /> 

保存规则后 关闭任务开关 并按下手动触发按钮  
检查日志输出 若配置都正确可以看到下列内容  

其中的 **id** 就我们需要的 规则ID  
而value 和 url 就是之前设置的重定向前/后域名  

<img src="/图片/stun-web服务-CF/stun-web服务-CF_规则ID获取过程-2.jpg" width="60%" height="60%" /> 

在获取完 规则ID后就可以开始更新  

#### 测试更新

我们先在计划任务测试完成后 再写到STUN穿透规则里  
修改计划任务   

接口地址： `https://api.cloudflare.com/client/v4/zones/区域ID/pagerules/规则ID`  
请求方法： PATCH  

由于是测试所以这里的STUN穿透端口号可以随意填 
请求主体：  

```
{
  "actions": [
    {
      "id": "forwarding_url",
      "value": {
        "url": "https://$1.你的重定向后域名:STUN穿透端口",
        "status_code": 302
      }
    }
  ]
}
```

示例  
<img src="/图片/stun-web服务-CF/stun-web服务-CF_页面规则更新测试.jpg" width="60%" height="60%" />


保存规则 按下手动触发按钮 观察日志  
查看url 字段中重定向后域名附加的端口号是否变化  
以及是否有返回"success":true"  

示例   
<img src="/图片/stun-web服务-CF/stun-web服务-CF_页面规则更新测试-2.jpg" width="60%" height="60%" />


### 在STUN穿透规则中更新端口

在计划任务中完成更新测试后 现在要将其填写到STUN穿透规则内  
设置方式与在计划任务中基本相同 需使用变量表示穿透得到的端口号   

接口调用成功包含的字符串填写：
```
"success":true
```

示例  
<img src="/图片/stun-web服务-CF/stun-web服务-STUN更新端口.jpg" width="60%" height="60%" />

可以按下 上面的webhook手动测试按钮 测试参数是否填写正确  
其会使用内置的演示参数 端口应该会变成6666  

示例  
<img src="/图片/stun-web服务-CF/stun-web服务-STUN更新端口结果.jpg" width="60%" height="60%" />


至此我们已经基本完成了 固定/隐藏端口的设置  
接下来就是设置普通反向代理的工作了  

---

## 配置反向代理规则及其相关设置

### 创建反向代理规则

设置反向代理规则的部分可以查看之前的教程  
不过要注意一下前端地址修为重定向后的地址 
详见：[链接](https://www.bilibili.com/read/cv35702797/)  

示例  
<img src="/图片/stun-web服务-CF/stun-web服务-CF_反代规则前端域名.jpg" width="60%" height="60%" />

### 获取TLS/SSL证书

获取TLS/SSL证书的部分可以查看之前的教程  
申请的证书为重定向后的泛域名 
详见：[链接](https://www.bilibili.com/read/cv35124571/)  
 
示例  
<img src="/图片/stun-web服务-CF/stun-web服务-CF_证书示例.jpg" width="60%" height="60%" />

---

## 最终验证环节

完成上述设置后我们既可进行最后的验证  
在浏览器中输入重定向前地址 例如`alist.ie12.com`  
应会跳转到`alist.stun.ie12.com:STUN穿透端口`  

可尝试重启 光猫/路由器 以使的穿透端口发生变化   
以测试其实际工作状况  

---


参考：

* [页面规则的未来](https://blog.cloudflare.com/future-of-page-rules-zh-cn)
* [Cloudflare API](https://developers.cloudflare.com/api/operations/page-rules-list-page-rules)

---

## 评论区

前往评论区 》 [链接](https://github.com/ie123610/ie12sBlog/issues/5)





