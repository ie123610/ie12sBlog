# 「反吸血」使用命令操作Windows防火墙以实现全自动/半自动的批量IP屏蔽

2024.05.25  

## 关于本教程
在之前的教程中我们通过调整比特彗星的反吸血设置来屏蔽 **吸血客户端**  

比特彗星常见问题-屏蔽吸血客户端和设置自动反吸血  
但是这种方法并不能很有效的屏蔽被滥用的正常客户端  

目前已经发现了滥用比特彗星进行刷流的IP段  
详见：https://www.cometbbs.com/t/92122/31  

而在之前的教程中我们已经介绍了手动编辑防火墙规则  
来屏蔽IP的方法 不过这个方法无法实现自动化  
详见：https://www.cometbbs.com/t/92122/3  

更好的方法是使用命令来控制Windows防火墙进行屏蔽  

---

## 远程动态关键字地址

在win10和更高版本中引入了一种名为 **远程动态关键字地址** 的新变量  
（RemoteDynamicKeywordAddresses）下文中简称为 **动态关键字**  

**微软文档**  
[RemoteDynamicKeywordAddresses](https://learn.microsoft.com/en-us/powershell/module/netsecurity/new-netfirewallrule)  
[创建动态关键字](https://learn.microsoft.com/en-us/powershell/module/netsecurity/new-netfirewalldynamickeywordaddress)  

我们可以将想要屏蔽的IP地址（段）写入创建动态关键字  
再将其绑定到一条或多条防火墙规则上  
当我们需要修改屏蔽IP（段）时只需要修改这个动态关键字即可  

这比直接修改防火墙规则更加方便而且几乎没有IP数量限制  
本方法由[泥浆](https://space.bilibili.com/14913)提出并实现  

---

## 使用动态关键字的配置方法

打开powershell 生成 GUID `New-Guid`  
复制GUID 创建防火墙规则并绑定动态关键字（其依靠GUID进行区分）  
<img src="../../images/win防火墙反吸血/生成GUID.webp" width="60%" height="60%" />

**入站规则**  
`New-NetFirewallRule -DisplayName “规则名称” -Direction Inbound -Action Block -Program "BT客户端路径" -RemoteDynamicKeywordAddresses "{GUID}"`  


**出站规则**  
`New-NetFirewallRule -DisplayName “规则名称” -Direction Outbound -Action Block -Program "BT客户端路径" -RemoteDynamicKeywordAddresses "{GUID}"`  

**示例**  
```
New-NetFirewallRule -DisplayName “BT_BC_BAN_IN” -Direction Inbound -Action Block -Program "C:\BitComet_2.07\BitComet_x64.exe" -RemoteDynamicKeywordAddresses "{3817fa89-3f21-49ca-a4a4-80541ddf7465}"
```

```
New-NetFirewallRule -DisplayName “BT_BC_BAN_OUT” -Direction Outbound -Action Block -Program "C:\BitComet_2.07\BitComet_x64.exe" -RemoteDynamicKeywordAddresses "{3817fa89-3f21-49ca-a4a4-80541ddf7465}"
```

<img src="../../images/win防火墙反吸血/规则详情.webp" width="60%" height="60%" />

**在刚才我们已经将代表动态关键字的GUID绑定到了防火墙规则上**  
接下来创建与GUID对应的动态关键字  

将想要屏蔽的IP地址（段）写入一个文本文件  
每行一个地址段 支持 单IP、CIDR、子网掩码、IP范围  

**示例**  
```
1.1.1.1
223.78.79.0-223.78.79.255
223.78.80.0/24
2409:873c:f03:6000::/56
8.8.8.0/255.255.255.0
```

<img src="../../images/win防火墙反吸血/ip列表.webp" width="60%" height="60%" />

**将IP列表写入动态关键字**  
```
New-NetFirewallDynamicKeywordAddress -Id "{GUDI}" -Keyword "名字" -Addresses (Get-Content IP列表文件路径 -Raw ).Replace("`r`n",",")  
```

**示例**  
```
New-NetFirewallDynamicKeywordAddress -Id "{3817fa89-3f21-49ca-a4a4-80541ddf7465}" -Keyword "BANIP" -Addresses (Get-Content C:\ip.txt -Raw ).Replace("`r`n",",")  
```

运行成功后会显示出规则内容  
<img src="../../images/win防火墙反吸血/运行成功.webp" width="60%" height="60%" />

这样我们就完成了防火墙规则和动态关键字的创建  
**若IP列表有更新则只需要更新动态关键字即可**  


**更新动态关键字**  

要先移除旧的关键字  
`Remove-NetFirewallDynamicKeywordAddress -Id "{GUID}"`  

**示例**  
`Remove-NetFirewallDynamicKeywordAddress -Id "{3817fa89-3f21-49ca-a4a4-80541ddf7465}"`


再生成新的关键字 命令和之前创建时一样  
**其GUID要和之前绑定在防火墙规则中的相同**  

```
New-NetFirewallDynamicKeywordAddress -Id "{GUDI}" -Keyword "便于识别的名称" -Addresses (Get-Content IP列表文件路径 -Raw ).Replace("`r`n",",")  
```

**示例**  
```
New-NetFirewallDynamicKeywordAddress -Id "{3817fa89-3f21-49ca-a4a4-80541ddf7465}" -Keyword "BANIP" -Addresses (Get-Content C:\ip.txt -Raw ).Replace("`r`n",",")  
```

查看已经创建的关键字 `Get-NetFirewallDynamicKeywordAddress`  


**懒人脚本**  

保存为批处理文件后就可以直接使用  
仅需要修改 客户端和IP列表的路径即可  

```
@echo off
set BTEXE="C:\Program Files\BitComet\BitComet.exe"
set IPFILE="C:\ip.txt"
set DYKWID="{3817fa89-3f21-49ca-a4a4-80541ddf7465}"

netsh advfirewall firewall delete rule name="BT_BAN_IPLIST" >nul
powershell.exe "New-NetFirewallRule -DisplayName "BT_BAN_IPLIST" -Direction Inbound -Action Block -Program '%BTEXE%' -RemoteDynamicKeywordAddresses '%DYKWID%'"
powershell.exe "New-NetFirewallRule -DisplayName "BT_BAN_IPLIST" -Direction Outbound -Action Block -Program '%BTEXE%' -RemoteDynamicKeywordAddresses '%DYKWID%'"
powershell.exe "Remove-NetFirewallDynamicKeywordAddress -Id '%DYKWID%'" >nul
powershell.exe "New-NetFirewallDynamicKeywordAddress -Id '%DYKWID%' -Keyword "BT_BAN_IPLIST" -Addresses (Get-Content '%IPFILE%' -Raw).Replace(\"`r`n\",\",\")"

pause
```

**这样我们就实现了自动/半自动的更新规则**  
可以配合外置的一些反吸血软件或其他可输出想要屏蔽IP列表的软件使用  

---

## 在防火墙管理工具中查看规则

使用命令行毕竟不是很直观  
**删除规则的时候可以直接使用高级Windows防火墙的管理工具**  
有时候可能会报错 显示无法删除 但实际其实是可以删掉的  

除此之外图形界面的管理工具并不能显示出动态关键字
所以使用动态关键字的规则看起来像是屏蔽了所有的IP

### 在win7上使用

win7其实是不支持动态关键字的 我们只能直接操作防火墙规则  
使用较旧的 `netsh advfirewall` 命令  

每条防火墙规则只能容纳 1000个IP（段）  
参考：[链接](https://superuser.com/questions/712831/is-there-a-limit-to-the-number-of-ip-addresses-for-a-windows-firewall-rules-sco)  

**不过用于吸血IP的屏蔽还是足够的**  
这里也给出自动化脚本其使用方法和之前的是一样的  

```
@echo off
setlocal enabledelayedexpansion

set BTEXE="C:\Program Files\BitComet\BitComet.exe"
set IPFILE="C:\ip.txt"

FOR /F %%i in ('type %IPFILE%') do set IPLIST=!IPLIST!%%i,

netsh advfirewall firewall delete rule name="BT_BAN_IPLIST" >nul
netsh advfirewall firewall add rule name="BT_BAN_IPLIST" dir=in action=block program=%BTEXE%
netsh advfirewall firewall add rule name="BT_BAN_IPLIST" dir=out action=block program=%BTEXE%
netsh advfirewall firewall set rule name="BT_BAN_IPLIST" new remoteip=%IPLIST%

pause
```

---

## 屏蔽指定地区的所有IP

由于动态关键字几乎支持无限数量的IP地址（段）  
仅用于反一般的反吸血有些大材小用  

**我们还可以使用其屏蔽/允许指定地区的IP**  
这不仅适用于BT客户端 也可以用于 web站点  远程桌面/登录  
在 IP2location上可以下载到指定地区的IP列表 [链接](https://www.ip2location.com/free/visitor-blocker)  

可以将这些地址以上文中方法添加到动态关键字中  
即可实现屏蔽或允许的效果 **格式建议选择CIRD格式**  
注意要转换一下换行符 其默认为UNIX换行符  

不过这样一来IP（段）非常的多使用批处理效率可能不是很高  
**更好的方法是直接运行powershell脚本**  

但win的默认安全策略并 **不允许直接运行PS脚本**  
虽然可以修改安全策略但更简的方法是 **通过批处理附加参数的方式间接运行**  

**示例**  
`powershell -ExecutionPolicy Bypass "C:\BT_BAN_IPLIST.ps1"`  

**powershell 脚本**  
```
$BTEXE="C:\Program Files\BitComet\BitComet.exe"
$IPFILE="C:\ip.txt"
$DYKWID="{3817fa89-3f21-49ca-a4a4-80541ddf7465}"

$RULES=(Get-NetFirewallRule -DisplayName "BT_BAN_IPLIST" -ErrorAction Ignore)

$SET_RULES = {
	Remove-NetFirewallRule -DisplayName "BT_BAN_IPLIST" -ErrorAction Ignore
	New-NetFirewallRule -DisplayName "BT_BAN_IPLIST" -Direction Inbound -Action Block -Program $BTEXE -RemoteDynamicKeywordAddresses $DYKWID | Out-Null
	New-NetFirewallRule -DisplayName "BT_BAN_IPLIST" -Direction Outbound -Action Block -Program $BTEXE -RemoteDynamicKeywordAddresses $DYKWID | Out-Null
}

if (($RULES | Out-String -Stream | Select-String -SimpleMatch $DYKWID).Count -ne 2) {
	&$SET_RULES
}
elseif (($RULES | Get-NetFirewallApplicationFilter | Out-String -Stream | Select-String -SimpleMatch $BTEXE).Count -ne 2) {
	&$SET_RULES
}
elseif (($RULES | Out-String -Stream | Select-String -SimpleMatch Inbound).Count -ne 1) {
	&$SET_RULES
}

if (Get-NetFirewallDynamicKeywordAddress -Id $DYKWID -ErrorAction Ignore) {
	Update-NetFirewallDynamicKeywordAddress -Id $DYKWID -Addresses (Get-Content -Raw $IPFILE).Replace("`r`n",",") | Out-Null
}
else {
	New-NetFirewallDynamicKeywordAddress -Id $DYKWID -Keyword "BT_BAN_IPLIST" -Addresses (Get-Content -Raw $IPFILE).Replace("`r`n",",") | Out-Null
}
```


