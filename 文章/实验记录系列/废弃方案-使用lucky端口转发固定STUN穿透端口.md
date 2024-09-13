# 废弃方案-使用lucky端口转发固定STUN穿透端口

## 关于本教程

此教程本设计用于固定STUN穿透后的非HTTP服务端口  
但因为通用性和稳定性的问题 最终被废弃  
由于已经进行较多的研究故保留研究记录  

## 遇到的问题

在之前教程中我们已经完成了为WEB服务固定STUN穿透端口  详见：[链接](../../文章/lucky-STUN系列/stun-web服务-CF.md)  
但是这些都是利用的HTTP重定向特性  
对非HTTP服务 和不支持重定向的程序此方法不起作用  

而像 MC Java 那样支持 srv记录的程序可谓少之又少 详见：[链接](https://www.bilibili.com/read/cv31482590/)  
想让服务和程序本身去进行适配几乎是不可能的  

虽然之前也写过使用邮件来通知端口变化的方案  详见：[链接](https://www.bilibili.com/read/cv34705222/)  
但这和登录lucky后台查看穿透后的端口再手动进行修改 没有什么本质上的区别  
只是在查看端口上略微方便一些而已  

要想真正的提升使用体验我们需要一种“无感”的解决方法  
也就是其对程序和服务本身要透明 让其不会感觉到端口的变化  
我们也不需要手动去修改端口 故其必须以某种自动的方法完成  


---

## 可以用的解决方案  


### 使用NAT

使用NAT确实可以解决这个这个问题  

通过NAT对传出流量中的端口进行处理 将其修改到STUN穿透后的端口  
这一过程是透明的 和正常通过NAT联网的过程是一样的  
只不过映射规则为手动指定而非由NAT自动处理  

但这意味要在客户端侧布专门的NAT或者操作现有NAT  
这对Linux类系统和软路由来说或许并不困难  
但对Windows系统和硬路由以及安卓来说就比较麻烦了  

### 使用端口转发

其相当于一个弱化版的NAT 部署起来会更加方便  
在Windows上自然使用lucky的转发功能了  
其实Win自己其实也有类似功能但只支持TCP 详见：[链接](https://www.bilibili.com/read/cv36203459/)  

不过在安卓设备上用起来还是不方便  
尽管在理论上也可以用终端模拟器在安卓上安装lucky  
执行在win上类似的转发操作 但这仍显得比较麻烦  


---

## 使用lucky端口转发固定STUN穿透端口


### 工作流程

1. 在lucky的 端口转发 功能中新建规则 按照实际情况监听本端口  
   转发目标位STUN穿透后的端口  
2. 需要使用的服务和程序向之前监听的本地端口发起连接  
3. 发送到本地的连接将被lucky转发到目标服务端STUN穿透后的地址和端口 连接完成  
4. 在 lucky的 计划任务 功能中新建规则 每隔一段时间执行一次  
   其会运行一个脚本 从一个 TXT DNS 记录中读取信息 它记录了STUN穿透后的端口号  
   这个记录会在服务侧STUN穿透发生变化后由服务端侧的lucky进行更新  
   在获取了端口号之后就可以对转发规则进行更新了 其需要开启lucky的 openAPI功能  
   通过 curl 提交更新 即可修改端口转发规则中的目标端口  


### 实验用脚本 

此部分记录了实验阶段时使用的脚本  
但该方案最后被放弃 故不会进一步完善  

其仅为客户端侧更新端口转发规则所使用的脚本  
服务端侧更新TXT记录的方法 视使用的域名提供商而异  

值得注意的是 每次提交更新 端口转发规则 都会导致已有的连接的中断  
这也是很正常的事情 毕竟目标的目标端口发生了变化 但这也意味着我们不能频繁刷新规则  
需要判断端口号是否发生变化 只有在端口号确实发生变化的时候才更新规则  


```

@echo off
@setlocal EnableExtensions EnableDelayedExpansion

chcp 65001

rem ----------------------------------------------
rem 配置文件区域

set "tempFile=%temp%\lucky-TXT-records.txt"
set "tempFile2=%temp%\lucky-TXT-records-old.txt"

rem 存放TXT记录的临时文件路径

set "startTag=SE"
set "endTag=SE"
rem 从TXT记录中匹配端口号时使用的分割符


set "servernamme=你的规则名称"
rem 规则名称 方便在日志中查看执行效果

set "APIaddress=http://127.0.0.1:16601/api/portforward"
set "APItoken=你的API token
rem lucky的API接口地址和token

set json={"Name":"SE","Key":"KjE2ISELzspbCFCF","DiaglogShowMode":"diy","ListenAddress":"127.0.0.1","ListenPorts":"5555","TargetAddressList":["192.168.5.120"],"TargetPorts":"","OpenFirewallPorts":false,"ForwardTypes":["tcp4"],"Enable":true,"LogLevel":4,"LogOutputToConsole":false,"AccessLogMaxNum":128,"WebListShowLastLogMaxCount":20,"Options":{"SingleProxyMaxUDPReadTargetDatagoroutineCount":32,"SingleProxyMaxTCPConnections":256,"UDPPackageSize":1500,"UDPShortMode":false,"SafeMode":"blacklist"},"TrafficIn":0,"TrafficOut":0,"TCPCurrentConnections":0,"UDPCurrentConnections":0,"State":""}

rem lucky转发规则 记得将TargetPorts后面的端口号删去，只留下两个引号

rem ----------------------------------------------


echo [%servernamme%]

echo [正在检查端口号...]

for /F "delims=" %%A in ('powershell -Command "$fileContent = Get-Content -Path '%tempFile%'; foreach ($line in $fileContent) { $matches = [regex]::Match($line, '%startTag%(.*?)%endTag%'); if ($matches.Success) { Write-Output $matches.Groups[1].Value }}"') do (
    set "newport=%%A"
)

echo [新端口号: %newport%]

for /F "delims=" %%B in ('powershell -Command "$fileContent = Get-Content -Path '%tempFile2%'; foreach ($line in $fileContent) { $matches = [regex]::Match($line, '%startTag%(.*?)%endTag%'); if ($matches.Success) { Write-Output $matches.Groups[1].Value }}"') do (
    set "oldport=%%B"
)

echo [旧端口号: %oldport%]


if "%newport%"=="%oldport%" (
    echo [端口号未改变]
) else (
    echo [端口号已改变]
    echo [正在更新端口转发规则...]
    
    set "json=%json:"=\"%"
    set "json=!json:TargetPorts\":\"=TargetPorts\":\"%newPort%!"
    
    
    for /f "delims=" %%C in ('curl -X PUT -H "openToken: %APItoken%" -H "Content-Type: application/json" -d "!json!" %APIaddress% 2^>NUL') do (
        set response=%%C
    )
    
    if !response!=={"ret":0} (
        echo [更新成功]
    ) else (
        echo [更新失败]
        echo [错误信息: !response!]
    )
    

)

echo [运行完毕]

pause

```


