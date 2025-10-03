# [LUCKY]在Windows下使用STUN穿透实现Minecraft联机并设置SRV记录

2024.02.18  

**本教程目标：**  
在无公网环境低成本的实现较为稳定的 Minecraft Java版联机（服务器）  
目前常见的联机(服务器）方法及其问题（针对好友联机和小/微型服务器）  



家庭宽带 公网直连（IPv4或IPv6）

优点：完全原生 网络效率和稳定性上不存在问题
缺点：IPv4公网难获取 而IPv6普及率仍然不够高 玩家不一定有IPv6






组网方案 （比如EasyN2N）

优点：对玩家网络要求不是很高可以实现P2P直连

即使P2P直连不成功也可以走服务器中转


缺点：中转状态下速度和稳定性受限于中转服务器

同时需要在设备上额外安装客户端






租用高性能VPS直接开服

优点：网络方面相当于原生公网
缺点：高性能服务器价格较高 对于好友联机和微型服务器来讲



租用低性能VPS+frp穿透 在个人电脑上开服

优点：网络方面相当于原生公网（算是是买了个公网IP）
缺点：即使是低性能服务器依然要些花钱（主要是带宽） 如果VPS离开玩家和mc服务端较远延迟可能还是较高
毕竟比直接部署在VPS上要多绕一些路径






免费frp穿透服务

优点：对玩家网络要求不高
缺点：和组网方案类似 稳定性和速度等受限于穿透节点




本教程将介绍STUN穿透法

优点：几乎相当于原生公网并有较大的带宽其上限为家庭宽带本身的上限
（即使是一般的100M家庭宽带都有30Mbps的上传 ）

缺点：端口号不定期变化
解决方法：设置srv记录（其可以记录端口号）Minecraft Java 版 支持解析srv记录 无需手动输入端口号



这是除了租用VPS外最接近公网直连的方法




配置思路



得益于lucky将 stun穿透 端口转发 webhook 以及DDNS更新 等功能整合在一起
我们可以轻松的实现stun穿透联机的设想

在dynv6上创建免费动态域名 并添SRV记录

使用lucky 的stun穿透和端口转发功能打开端口并将流量导向服务端

在stun传穿透的IP或者端口发生变化时可以触发webhook请求 使用其向dynv6的更新api发送请求更新srv记录中的端口

玩家输入仅需动态域名 客户端将自动解析srv记录中的地址和端口即可登入游戏




网络环境检测和优化


尽管大部分stun穿透教程都会强调必须是全锥型NAT才能穿透

但这其实指的是最外面一层的运营商NAT 而大部分的运营商NAT都是全锥型的



不过现在的家庭网络环境中几乎都存在多层NAT 而NAT类型测试只能测出其“最差”的一层 其很可能显示为“端口受限（锥）型NAT”这其实是由于 路由器/光猫上的NAT造成的



不过这并不会影响我们使用stun穿透 可以按照这篇教程进行网络优化

教程：网络环境检测和优化

优化到只剩一层运营商NAT和 和一层光猫/路由器 NAT

共两层NAT 且NAT类型检查结果不为对称型即可进行穿透 




下载和安装lucky
在之前的教程中已经讲解过 

LUCKY STUN穿透在Windows上使用UPnP工具为BT客户端自动添加内外端口号不同的映射规则

关于本教程本教程基于：基于stun穿透工具LUCKY，使BT客户端绿灯、开放TCP端口的办法（进化版）在该教程中实现了使用 路由器/光猫 的端口转发功能处理流量其效率更高且可以使BT客户端正确的显示其他连入用户的IP地址但是其使用的是静态的端口转发/映射规则在stun穿透端口发生变化后需要手动修改转发规则 无法实现自动化可以使用 UPnP 来替代 静态的端口转发规则但是lucky内置的 UPnP 功能所添加的规则的内部端口和外部端口是相同的但我们所需要的映射是内外端口不同的尽管在 v2.5.3 版本中增加

文章
ie-12
1.5万
89
120





注册dynv6
访问 dynv6.com 点击右上角的 sign up
填写邮箱和密码后即可

邮箱中会收到一封确认邮件要点击邮件内的链接确认账户

值得注意的是确认页面有谷歌人机验证可能需要代理才能正常显示



如果没有代理可以使用下面链接中的方法使验证显示出来

https://blog.azurezeng.com/recaptcha-use-in-china/




设置 动态域名和srv记录


登录账户 点击右上角的 My Zones 选择 More




再点击右侧的 Create new Zone






名称可以设置 你喜欢的名字 只能为数字和字母

选择一个方便记忆的一级域名这里选择 dynv6.net

IP地址先不设置 之后会设置解析

创建



创建完成后会自动切换到该域名的配置页面
选择 Records 选项卡
添加 记录类型选择 SRV






填写 

Name 

Server 

Port 

这几个选项






（后面会解释为什么这样填）



Port:任意填写之后还要修改 这里使用25565



Name:

_minecraft._tcp.mc


Server 中填写的则是之前创建的域名（注意最后有一个点）

例如：

ie12test.dynv6.net.


配置效果




检查解析效果

命令提示符运行以下命令

nslookup -q=srv 你的域名
例如

nslookup -q=srv _minecraft._tcp.mc.ie12test.dynv6.net
注意前面的_minecraft._tcp. 不能少

看到如下中的内容表示设置正确







关于srv记录


其中的 _minecraft._tcp 表示服务类型为 Minecraft  协议为TCP 

这个部分是必须要有的且不能修改的



而后面的.mc 相当于一个三级域名可以自由修改 游玩时在地址栏里输入 mc.ie12test.dynv6.net

若改为.abc 那游玩时就要输入 abc.ie12test.dynv6.net


前面的_minecraft._tcp在游玩时不用输入 mc客户端会在你输入的域名前面自动加上 进行查询

server 选项表示使用的实际域名或者IP
这里直接使用的是它的上级域名即 ie12test.dynv6.net 也可以使用任意的其他域名
填写的时候别忘了后面要加上一个点即英文状态下的句号



一些教程会说srv记录可以隐藏地址但这其实是不准确的

之所以srv看起来可以隐藏地址是因为在服务器地址栏中输入的是

mc.ie12test.dynv6.net

而实际客户端查询的是

_minecraft._tcp.mc.ie12test.dynv6.net

mc.ie12test.dynv6.net这个地址不需要设置IP地址 自然解析不出IP来






而且实际使用的地址是 _minecraft._tcp.mc.ie12test.dynv6.net 中srv记录里指定的地址
直接解析这个地址也是解析不出来IP的
因为DNS解析一般默认解析的都是 A（IPv4地址）和AAAA（IPv6地址）记录






必须要像刚才检查解析效果时那样指定查询记录类型为srv才行

所以这只能算是一种障眼法对不了解srv记录的人有一定效果

不能真的隐藏服务器的源IP地址






文中更新SRV记录的方法已经过时 lucky在2.15版本后已经支持SRV记录

这使得配置方法极大简化 请移步至此教程：链接



获取域名ID和记录ID以及token
通过dynv6的 REST API 我们可以更新srv 记录中的端口号

API定义：https://dynv6.github.io/api-spec/



但是在这之前我们需要先获取两个ID号和一个Token

一个是域名ID即zoneID另一个是记录ID（srv记录的）即recordID

而Token 相当于是一串密码用来进行身份验证



我们先从token开始

点击右上角的账户名选择 keys





在HTTP Tokens 应该已经有了一个默认的Token
点开 details 查看内容

注意不要泄露token 如果泄露应马上更换


将token复制下来获取ID的时候要用到

ID的获取相对麻烦一些 dynv6的文档中用的是curl
我们直接使用lucky中的 webhook 功能就不用再去下curl了



打开lucky
点击左侧的 计划任务
添加计划任务


设置内容如下：



开关：关闭

执行周期和时间：任意 这个只是测试用的

添加子任务

类型 callweb

接口地址：

https://dynv6.com/api/v2/zones
请求方法：GET
请求头：

Authorization: Bearer 之前获取的TOKEN
Accept: application/json
启用 禁用成功字符检测

保存任务



设置效果
点击手动触发


查看日志中输出的信息
如果配置正确会返回域名和ID


这里的ID就是域名ID即zoneID 有了这个我们才能获取记录ID



接下来获取record ID

修改计划任务中的内容

将请求地址修改为：

https://dynv6.com/api/v2/zones/刚才获取的ID/records
其他都不变
保存规则再次点击手动触发
查看日志中的返回内容如果配置正确会返回域名和ID




这次的ID就是记录ID了即recordID

现在我们就可以进行srv记录的端口更新了
这个要到stun穿透里面设置不过我们可以先在这测试一下



再次修改任务

接口地址改为：

https://dynv6.com/api/v2/zones/你的域名ID/records/你的记录ID
请求方法：PATCH

请求主体填写：

{
"name": "记录名称",
"port": 1024
}
记录名称是刚才获取记录ID时返回的Name的值
端口号任意 仅用于测试

例如

{
"name": "_minecraft._tcp.mc",
"port": 1024
}
配置效果
保存规则点击手动触发
查看日志中的返回内容如果配置正确会返回srv记录的详细信息
同时查看端口是否已经更新





记录下刚才填写的配置一会儿要在stun穿透里面设置



（这里踩了个坑 name 必须要有不然会报错 之前没加上导致一直报错 还在QQ群友帮助测试后才发现这个问题）




设置DDNS解析
选择左侧的动态域名解析
添加任务




名称：任意

托管服务商：dynv6

Token：填写之前获得的token

类型：选择IPv4

域名列表：填写 之前SRV记录指向的域名

保存规则






配置效果

等待片刻后显示公网IP未改变或更新成功即设置正确




设置STUN穿透
选择左侧的stun内网穿透
添加穿透规则







名称：任意

穿透类型： IPv4 TCP

监听端口：可自定义 不和其他程序冲突即可 这里使用 22333

目标地址：设置为mc服务端运行的地址 如果和lucky运行在同一设备上使用127.0.0.1即可

目标端口：设置为mc服务端监听的端口 这里用的是25678









打开webook开关

填写的内容和之前在计划任务中测试时的基本相同

接口地址：

https://dynv6.com/api/v2/zones/你的域名ID/records/你的记录ID
请求方法：PATCH

请求头：

Authorization: Bearer 之前获取的TOKEN
Accept: application/json
请求主体

{
"name": "记录名称",
"port": #{port}
}
记录名称是之前获取记录ID时返回的 Name 的值

例如

{
"name": "_minecraft._tcp.mc",
"port": #{port}
}
调用成功字符串检检测：SRV（要大写）






填写完成后点击右上角的手动触发
查看是否调用成功




成功会返回记录的详细信息
注意这里的端口号变成了6666

保存规则






最终效果





至此我们已经完成了配置

当stun穿透的端口或者IP发生变化时DDNS记录会自动更新

玩家无需从新输入地址和端口 只不过在变化瞬间会掉线 重新登录一下即可

当然这种变化一般不会太频繁 不过这要看地区和运营商 毕竟运营商NAT配置方式各不相同



不过有时候DNS缓存及时没有更新 可以使用下列命令刷新 Windows DNS 缓存

ipconfig /flushdns
或者制作成批处理使用起来更方便

@echo off
ipconfig /flushdns
pause


游戏测试环节
游戏版本：Minecraft 1.16.5 Java  Forge 36.2.41

使用 自定义局域网联机（Lan Server Properties） mod固定端口

https://www.mcmod.cn/class/2754.html



值得注意的是在1.16.5下有一个bug
离线登录玩家无法进行多人游戏即多人游戏按钮被禁用
加个Mod即可修复

https://www.mcmod.cn/class/10643.html





对局域网开放
填写地址
服务器已正常显示
登录成功

参考：

https://www.bilibili.com/read/cv25389887/

https://dusays.com/383/

