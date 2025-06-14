# Windows无法启用休眠问题

win10/win11系统 运行 `powercfg -h on` 尝试启用休眠功能 返回  

```
休眠失败，错误如下: 不支持该请求。

下列项目使此系统的休眠操作无法执行。
        内部系统组件已禁用休眠。
                受保护的主机
````

请检查是否启用了 hyper-v 虚拟机功能  
若已经启用请转到 控制面板》程序和功能》打开或关闭Windows功能  
检查 "受保护的主机" 选项是否勾选  

取消勾选此功能并重启系统后  
再次运行运行 `powercfg -h on` 命令休眠功能应可以启用  
关闭此功能基本不会影响hyper-v虚拟机运行  

**参考：**  

* [“内部系统组件已禁用休眠” | 永远的幻想](https://xuanmanstein.wordpress.com/2009/09/19/%E2%80%9C%E5%86%85%E9%83%A8%E7%B3%BB%E7%BB%9F%E7%BB%84%E4%BB%B6%E5%B7%B2%E7%A6%81%E7%94%A8%E4%BC%91%E7%9C%A0%E2%80%9D/)
* [下列项目使此系统的休眠操作无法执行 内部系统组件已禁用休眠 受保护的主机](https://answers.microsoft.com/zh-hans/windows/forum/all/%E4%B8%8B%E5%88%97%E9%A1%B9%E7%9B%AE%E4%BD%BF/25521b20-eb74-4e5b-92dc-f93edea26e30)
* [关于Windows开启系统休眠功能 - 網絡一隅 Net`Corner](https://web.archive.org/web/20241203000436/https://cloud.sd.cn/guan-yu-Windows-kai-qi-xi-tong-xiu-mian-gong-neng)