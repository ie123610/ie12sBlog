# 原生 Win32 控件窗口文本获取工具

[sysexp.exe](https://www.nirsoft.net/utils/sysexp.html) 支持从原生 Win32 窗口中获取文本  
这种窗口内部子元素 (窗口) 也具有 HWND (窗口句柄) 同时响应 win32 消息  

这样的原生窗口现在已经比较少见 但 Bitcomet 的窗口就符合这些条件  
sysexp 可以从中获取文本内容 这对研究 BC 的 DHT 用户列表情况提供了极大的帮助  
BC 本身并不支持复制或导出此列表  