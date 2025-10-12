# 「LUCKY STUN穿透」使用邮件通知端口变化情况

2024.05.21  

在之前的一系列教程中我们介绍了一些STUN的用法  
其中也包括了固定或更新端口的方法  

但还有许多服务我们还不能实现固定端口  
或自动化的修改端口 **需要手动重新设置**  

这也意味着每当穿透端口发生变化后  
**需要以某种方式通知我们以便及时的修改端口**  

尽管一般来讲 STUN 穿透端口不会非常频繁的变化  
但当其被应用在远程访问或者组网的时候  
及时的通知端口变化情况就显得十分重要了  

**这里选择使用邮件进行通知**  
即当端口发生变化后发出一封邮件以提示我们更换端口  
感谢 [泥浆](https://space.bilibili.com/14913) 提供的帮助  

---

## 开启SMTP服务

想要发邮件自然需要邮箱  
我们将要使用 SMTP（简单邮件传输协议）来发送邮件  

这里推荐网易的邮箱 126和163皆可  
主要是设置起来比较方便  

其他的邮箱例如 QQ邮箱 Google邮箱 Outlook其实也可以  
但可能存在额外的安全设置 （没有经过测试）  

---

### 网易邮箱开启SMTP服务

可以参考网易的帮助网页：[链接](https://help.mail.163.com/faqDetail.do?code=d7a5dc8471cd0c0e8b4b8f4f8e49998b374173cfe9171305fa1ce630d7f67ac2a5feb28b66796d3b)

按照链接或图中内容的操作即可获得 **授权码**  
选择 IMAP/SMTP服务即可  

<img src="../../images/邮件通知/网易开启smtp.webp" width="60%" height="60%" />

## 安装Curl

在开启了邮箱的SMTP服务后  
我们还需要一个支持SMTP协议的客户端程序  

这里选择 curl 因为 **其安装和使用起来都很方便**  
无论是在Windows上还是Linux中（docker）  

安装方法可以查看之前的教程：  
[「LUCKY STUN穿透」使用 cURL 自动修改 Transmission 的监听端口](./stun-tr-modify-port.md)  


### 测试脚本

在完成上述的准备工作后就可以开始发送邮件了  
先在lucky的 计划任务 中进行测试 成功后  
再填写进 STUN 规则的自定义规则  


#### 创建计划脚本

子规则选择 **自定义脚本** 其他选项任意设置  
不填写脚本内容先保存计划任务  

<img src="../../images/邮件通知/计划任务-1.webp" width="60%" height="60%" />
<img src="../../images/邮件通知/计划任务-2.webp" width="60%" height="60%" />

关闭规则开关 我们只使用手动触发  

<img src="../../images/邮件通知/计划任务-3.webp" width="60%" height="60%" />

**Windows平台**  

lucky 在运行批处理脚本时似乎存在一些编码问题  
**导致中文字符无法正常显示** 即使切换编码到UTF-8也不行  

所以这里选择的方法是创建独立的批处理文件  
然后在lucky的自定义脚本中调用 这样就不用担心编码问题了  

**而 端口号 规则名称 以及 授权码将通过传参的形式发给批处理脚本**  
因为在发送邮件时要写临时文件 在临时文件名中加入穿透规则的名称  
可防止多个规则之间互相干扰  

虽然授权码是固定的 完全可以写在批处理中但这样明文存储还是有些危险  
存储在lucky的配置文件中相对安全一些 其有一些加密措施  


**创建批处理**  

创建一个批处理文件 并填写下列命令部分参数按照实际情况填写  
批处理文件存放的位置可任意选择但名称和路径中不要有中文和空格  
正确示例：`C:\STUN_send_mail.bat`  

其中发件人邮箱和收件人邮箱可以相同即自己发邮件给自己  
流程很简单先创建要发送的邮件内容》发送》删除临时文件  

如果用的是126邮箱就直接按照示例 填写STMP服务器地址即可  
若是163邮箱将126修改为163即可端口用不变即 `smtp.163.com`  

```
@echo off
chcp 65001

set "port=%1"
set "rulename=%2"
set "token=%3"
set "mail=%tmp%\%rulename%mail.txt"

echo From: 发件人邮箱 > %mail%
echo To: 收件人邮箱 >> %mail%
echo Subject: STUN穿透规则%rulename%端口变化 >> %mail%
echo. >> %mail%
echo 穿透规则%rulename%端口已变化，新端口号：%port% >> %mail%

curl --ssl-no-revoke --url "smtps://SMTP服务器地址（使用TLS）"  --user "发件人邮箱@之前的部分:%token%"  --mail-from "发件人邮箱"  --mail-rcpt "收件人邮箱"  -T %mail%

del %mail%

echo Mail has been sent

pause
```

**示例**  

```
@echo off
chcp 65001

set "port=%1"
set "rulename=%2"
set "token=%3"
set "mail=%tmp%\%rulename%mail.txt"

echo From: ie12@126.com > %mail%
echo To: ie12@126.com >> %mail%
echo Subject: STUN穿透规则%rulename%端口变化 >> %mail%
echo. >> %mail%
echo 穿透规则%rulename%端口已变化，新端口号：%port% >> %mail%

curl --ssl-no-revoke --url "smtps://smtp.126.com:465"  --user "ie12:%token%"  --mail-from "ie12@126.com"  --mail-rcpt "ie12@126.com"  -T %mail%

del %mail%

echo Mail has been sent

pause
```

<img src="../../images/邮件通知/批处理示意.webp" width="60%" height="60%" />


创建完成后我们先在命令提示符中进行测试  
**传参顺序》端口号-规则名称-授权码**  

<img src="../../images/邮件通知/测试脚本-1.webp" width="60%" height="60%" />
<img src="../../images/邮件通知/测试脚本-2.webp" width="60%" height="60%" />
<img src="../../images/邮件通知/测试邮件-1.webp" width="60%" height="60%" />

若设置都正确即可收到邮件并看到 curl 的发送记录  
如果存在错误 则可在此阶段进行排查  
出现"Login denied" **请检查授权码是否正确**  

命令提示符测试通过之后再放到 **计划任务** 中进行测试  
应能收到邮件并有相同的日志输出  

<img src="../../images/邮件通知/在lucky测试脚本-1.webp" width="60%" height="60%" />
<img src="../../images/邮件通知/在lucky测试脚本-2.webp" width="60%" height="60%" />


**Linux(docker)平台**  

在Linux下的命令比Windows下要**简单一些**  
编辑计划任务并按照实际情况填写下列命令  

其中发件人邮箱和收件人邮箱可以相同即自己发邮件给自己  
流程很简单先创建要发送的邮件内容>发送>删除临时文件  

如果用的是126邮箱就直接按照示例 填写STMP服务器地址即可  
若是163邮箱将126修改为163即可端口用不变即 `smtp.163.com`  


```
echo -e 'From: 发件人邮箱\nTo: 收件人邮箱\nSubject: STUN穿透规则${ruleName}端口变化\n\n 穿透规则${ruleName}端口已变化，新端口号：${port}' > /tmp/${ruleName}mail.txt

curl --url 'smtps://SMTP服务器地址（使用TLS）' --user '发件人邮箱@之前的部分:授权码' --mail-from '发件人邮箱' --mail-rcpt '收件人邮箱' -T /tmp/${ruleName}mail.txt 2>&1

rm /tmp/${ruleName}mail.txt
```

**示例**  

```
echo -e 'From: ie12@126.com\nTo: ie12@126.com\nSubject: STUN穿透规则${ruleName}端口变化\n\n 穿透规则${ruleName}端口已变化，新端口号：${port}' > /tmp/${ruleName}mail.txt

curl --url 'smtps://smtp.126.com:465' --user 'ie12:ABCDEFG' --mail-from 'ie12@126.com' --mail-rcpt 'ie12@126.com' -T /tmp/${ruleName}mail.txt 2>&1

rm /tmp/${ruleName}mail.txt
```

<img src="../../images/邮件通知/Linux脚本-1.webp" width="60%" height="60%" />


有些shell还支持 **“过程替换”** (process substitution)  
可以不用创建临时文件 **直接进行发送**  
详见：[链接](https://www.gnu.org/software/bash/manual/html_node/Process-Substitution.html#Process-Substitution)  

```
curl --url 'smtps://SMTP服务器地址（使用TLS）'  --user '发件人邮箱@之前的部分:授权码'  --mail-from '发件人邮箱'  --mail-rcpt '收件人邮箱'  -T <(echo -e 'From: 发件人邮箱\nTo: 收件人邮箱\nSubject: STUN穿透规则${ruleName}端口变化\n\n 穿透规则${ruleName}端口已变化，新端口号：${port}') 2>&1
```

**示例**  

```
curl --url 'smtps://smtp.126.com:465'  --user 'ie12:ABCDEFG'  --mail-from 'ie12@126.com'  --mail-rcpt 'ie12@126.com' -T <(echo -e 'From: ie12@126.com\nTo: ie12@126.com\nSubject: STUN穿透规则${ruleName}端口变化\n\n 穿透规则${ruleName}端口已变化，新端口号：${port}') 2>&1
```

<img src="../../images/邮件通知/Linux脚本-2.webp" width="60%" height="60%" />

完成后按下测试按钮查看日志输出  
应该可以看到curl的发送记录并接收到邮件  

如果存在错误 则可在此阶段进行排查  
出现"Login denied" **请检查授权码是否正确**  

<img src="../../images/邮件通知/测试邮件-2.webp" width="60%" height="60%" />
<img src="../../images/邮件通知/在lucky测试脚本-3.webp" width="60%" height="60%" />


---

## 编辑STUN规则

### Windows

将测试好的命令复制到 STUN 规则的自定义脚本区域  
端口号 规则名称 **使用变量替代 其中规则名称不要包含中文**  

若在自定义脚本区域已经有命令则应按照流程顺序进行排列  
并使用vbs脚本设置间隔 详情见 [第一期的教程](./stun-bt.md)  

<img src="../../images/邮件通知/在lucky测试脚本-4.webp" width="60%" height="60%" />
<img src="../../images/邮件通知/测试邮件-3.webp" title="邮件效果" width="60%" height="60%" />


### Linux(docker)

直接将命令复制到 STUN 规则的自定义脚本中即可  
若在自定义脚本区域已经有命令则应按照流程顺序进行排列  
**并使用sleep设置间隔**  

<img src="../../images/邮件通知/方案1.webp" title="方法1" width="60%" height="60%" />
<img src="../../images/邮件通知/方案2.webp" title="方法2" width="60%" height="60%" />

<img src="../../images/邮件通知/测试邮件-3.webp" title="邮件效果" width="60%" height="60%" />

---

## 参考资料

* https://blog.csdn.net/Dancen/article/details/109730392
* https://www.cnblogs.com/yiminlin/p/17030412.html
* https://opswill.com/articles/curl-smtp-send-mail.html