# Windows 传输动画提取

## 传输动画

在Windows XP 和更早的 Win9X 系统中 系统程序在传输过程中  
会播放一些有趣的动画  

有趣的是这些动画是以AVI格式存在于exe或dll文件中的  
可以通过Resource Hacker 提取  

不过AVI也只是封装格式 不代表其编码格式  
其视频编码格式为 `Run length encoded 8bpp RGB image`  
即一系列使用RLE压缩的8位（256色）位图 按顺序打包在AVI容器中

其都带有一个纯色的背景 通过色键的方式实现透明效果  
当时应该是没有透明通道的  


## 提取方法

通过Resource Hacker 打开exe或dll文件 提取带有纯色背景的AVI文件  
使用转换工具将AVI格式转换成GIF格式 由于其本质是就是一组图片  
转换效果是不会有什么问题的  

不过转换完成后的GIF文件依然带有纯色背景  
可以通过PS的魔棒将每一帧的纯色背景删除 这样就得到了透明背景的GIF  


## ieframe.dll

IE浏览器下载动画 （IE8+风格）  
AVI文件：<a href="../../images/win-animation/ie8-download.avi">链接</a>  
<img src="../../images/win-animation/ie8-download.gif"  />


IE浏览器下载动画 (IE7-/Win9X风格 256色)  
AVI文件：<a href="../../images/win-animation/ie7-download.avi">链接</a>  
<img src="../../images/win-animation/ie7-download.gif"  />

---

## shell32.dll

资源管理器 复制文件动画 （Windows XP 风格）  
AVI文件：<a href="../../images/win-animation/winxp-copy-files.avi">链接</a>  
<img src="../../images/win-animation/winxp-copy-files.gif"/>

资源管理器 复制文件动画 （Windows 9X 风格 256色）  
AVI文件：<a href="../../images/win-animation/win9X-copy-files.avi">链接</a>  
<img src="../../images/win-animation/win9X-copy-files.gif"/>

资源管理器 移动文件动画 （Windows XP 风格）  
AVI文件：<a href="../../images/win-animation/winxp-move-files.avi">链接</a>  
<img src="../../images/win-animation/winxp-move-files.gif"/>

资源管理器 移动文件动画 （Windows 9X 风格 256色）  
AVI文件：<a href="../../images/win-animation/win9x-move-files.avi">链接</a>  
<img src="../../images/win-animation/win9x-move-files.gif"/>

资源管理器 删除文件动画 （Windows XP 风格）  
AVI文件：<a href="../../images/win-animation/winxp-delete-files.avi">链接</a>  
<img src="../../images/win-animation/winxp-delete-files.gif"/>

资源管理器 删除文件动画 （Windows 9X 风格 256色）  
AVI文件：<a href="../../images/win-animation/win9x-delete-files.avi">链接</a>  
<img src="../../images/win-animation/win9x-delete-files.gif"/>

资源管理器 移动到回收站动画 （Windows XP 风格）  
AVI文件：<a href="../../images/win-animation/winxp-move-to-recycle-bin.avi">链接</a>  
<img src="../../images/win-animation/winxp-move-to-recycle-bin.gif"/>

资源管理器 清空回收站动画 （Windows XP 风格）  
AVI文件：<a href="../../images/win-animation/winxp-empty-recycle-bin.avi">链接</a>  
<img src="../../images/win-animation/winxp-empty-recycle-bin.gif"/>

应用设置？  
AVI文件：<a href="../../images/win-animation/winxp-apply-settings.avi">链接</a>  
<img src="../../images/win-animation/winxp-apply-settings.gif"/>

资源管理器 查找目标 （Windows 9X 风格 256色）  
AVI文件：<a href="../../images/win-animation/find-target.avi">链接</a>  
<img src="../../images/win-animation/find-target.gif"/>

资源管理器 搜索 （Windows XP 风格）  
AAVI文件：<a href="../../images/win-animation/search-1.avi">链接</a>|<a href="../../images/win-animation/search-2.avi">链接</a>|[<a href="../../images/win-animation/search-3.avi">链接</a>  

<img src="../../images/win-animation/search-1.gif"/><img src="../../images/win-animation/search-2.gif"/><img src="../../images/win-animation/search-3.gif"/>

## xpnetdiag.exe

Windows XP 网络诊断 （Windows 9X 风格 256色）  
AVI文件：<a href="../../images/win-animation/xpnetdiag.avi">链接</a>  
<img src="../../images/win-animation/xpnetdiag.gif"  />
